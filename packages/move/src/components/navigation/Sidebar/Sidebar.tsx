'use client';

import * as React from 'react';
import { Slot, Dialog as RadixDialog, VisuallyHidden } from 'radix-ui';
import { composeHandlers, useMergedRef, withMoveComponent } from '../../../engine';
import { useSurfaceFlip, SurfaceProvider } from '../../../infrastructure/Surface';
import { LayerProvider } from '../../../infrastructure/Layer';
import {
  useAnimations,
  useDismissable,
  useDismissableExit,
  poppy,
  snappy,
  smooth,
} from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import { Tooltip } from '../../overlays/Tooltip';
import { Button } from '../../actions/Button';
import { Icon, useIcon } from '../../../infrastructure/Icon';
import type { SlotPropsMap } from '../../../engine';
import { useSidebar } from './useSidebar';
import type { UseSidebarOptions, UseSidebarReturn } from './useSidebar';
import styles from './Sidebar.module.css';

// Bundlers (Vite, webpack, Next) statically replace `process.env.NODE_ENV`; declare it
// rather than depending on @types/node, which consumers of a browser library need not have.
declare const process: { env: { NODE_ENV?: string } };

// ============================================================================
// Labels (i18n)
// ============================================================================

export interface SidebarLabels {
  /** aria-label for the mobile close button. */
  close: string;
  /** Accessible name for the mobile navigation sheet (Radix Dialog title). */
  title: string;
}

const DEFAULT_LABELS: SidebarLabels = {
  close: 'Close sidebar',
  title: 'Navigation',
};

// ============================================================================
// Animation config
// ============================================================================

const SIDEBAR_STAGGER_DELAY = 60;
// Pixel-based scale offset (matches Select item reveal). Dynamic per-item
// via $itemScaleFrom so the visible motion stays at a fixed pixel delta
// regardless of sidebar width.
const ITEM_SCALE_INSET_PX = 24;
// Horizontal travel distance for the collapse/expand stagger. Items slide
// in from this offset on each toggle. Kept below 32px so the shift stays
// within the visible area even with overflow-x: hidden on Content.
const COLLAPSE_STAGGER_TRAVEL_PX = 24;
const COLLAPSE_STAGGER_DELAY = 40;
// Matches Sidebar.NavItem by default AND any consumer-rendered element that
// opts in via data-sidebar-animate (e.g. a Button or Dropdown sitting outside
// the nav list). Resolved lazily inside the component — styles.navItem is only
// defined once the CSS module has loaded, which at module-scope it already has.
//
// Section headings join in, so a group arrives as a group instead of a heading
// standing still while its rows slide in under it. Only while expanded, though:
// collapsed, the CSS holds them at opacity 0 / height 0, and anime writes inline
// styles that outrank a stylesheet — a heading in the stagger would fade itself
// back into a rail that has no room for it.
function getItemSelector(collapsed: boolean) {
  const rows = `.${styles.navItem}, [data-sidebar-animate]`;
  return collapsed ? rows : `${rows}, .${styles.groupLabel}`;
}

// Mobile sheet enter/exit — the whole thing runs through the Move anime.js
// system (useAnimations), coordinated with Radix Dialog via useDismissable so
// the panel stays mounted for the exit animation. NOT CSS keyframes.
const MOBILE_OVERLAY_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Overlay.enter',
    sequence: [{ animation: { opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 } } }],
  },
  {
    trigger: 'Overlay.exit',
    sequence: [{ animation: { opacity: { from: 1, to: 0, ease: 'outQuart', duration: 150 } } }],
  },
];

/** Slides the aside in from / out to the off-screen edge for the given side. */
function mobileRootAnimations(side: 'left' | 'right'): AnimationTrigger[] {
  const off = side === 'right' ? '100%' : '-100%';
  return [
    {
      trigger: 'Root.enter',
      sequence: [
        { target: 'Root', animation: { translateX: { from: off, to: '0%', ease: snappy } } },
      ],
    },
    {
      trigger: 'Root.exit',
      sequence: [
        { target: 'Root', animation: { translateX: { to: off, ease: snappy, duration: 200 } } },
      ],
    },
  ];
}

/** Shares the dismissable exit lifecycle with the overlay sub-component so its
 *  fade runs in step with the aside slide. Only Root confirms the close. */
interface SidebarMobileContextValue {
  isClosing: boolean;
  epoch: number;
  overlayConfig: AnimationTrigger[] | null;
}
const SidebarMobileContext = React.createContext<SidebarMobileContextValue | null>(null);

function contentEnterAnimations(collapsed: boolean): AnimationTrigger[] {
  return [
    {
      trigger: 'Content.enter',
      sequence: [
        {
          target: 'Content',
          children: getItemSelector(collapsed),
          stagger: { delay: SIDEBAR_STAGGER_DELAY },
          animation: {
            opacity: { from: 0, to: 1, duration: 300, ease: 'outQuart' },
            scale: { from: '$itemScaleFrom', to: 1, ease: poppy },
          },
        },
      ],
    },
  ];
}

// ============================================================================
// Context
// ============================================================================

const SidebarContext = React.createContext<UseSidebarReturn | null>(null);

/**
 * Animation context for Sidebar sub-components.
 * - `false` = all animations disabled
 * - `undefined` = use defaults
 */
const SidebarAnimateContext = React.createContext<false | undefined>(undefined);

/**
 * Scroll-state context — SidebarContent observes its scroll position
 * and publishes two flags. Header reads `scrolledFromTop` (there's
 * content above the visible area, show a bottom border). Footer
 * reads `scrolledFromBottom` (there's more content below the visible
 * area, show a top border). Kept on a separate context so updates
 * don't re-render every consumer of the main SidebarContext.
 */
interface SidebarScrollContextValue {
  scrolledFromTop: boolean;
  scrolledFromBottom: boolean;
  setScroll: (v: { scrolledFromTop: boolean; scrolledFromBottom: boolean }) => void;
}
const SidebarScrollContext = React.createContext<SidebarScrollContextValue | null>(null);

/**
 * A Group hands its GroupLabel's id to the Nav beside it, so a section that is
 * already labelled on screen does not have to be named a second time in the
 * markup. The label registers itself because a Group cannot point at a heading
 * that isn't there — `aria-labelledby` at an id that never renders names the
 * landmark nothing at all, which is worse than leaving it anonymous.
 */
interface SidebarGroupContextValue {
  labelId: string;
  hasLabel: boolean;
  registerLabel: () => void;
}
const SidebarGroupContext = React.createContext<SidebarGroupContextValue | null>(null);

/** Set by Nav so a NavItem can tell whether its `<li>` has a list to live in. */
const SidebarNavContext = React.createContext(false);

export function useSidebarContext() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) {
    throw new Error('Sidebar components must be used within <Sidebar.Provider>');
  }
  return ctx;
}

// ============================================================================
// Provider (no factory — pure context wrapper)
// ============================================================================

export interface SidebarProviderProps extends UseSidebarOptions {
  children?: React.ReactNode;
  /** Pass `false` to disable all sidebar animations. */
  animations?: false;
}

const SidebarProvider: React.FC<SidebarProviderProps> = ({ children, animations, ...options }) => {
  const sidebar = useSidebar(options);
  const [scrollState, setScroll] = React.useState({
    scrolledFromTop: false,
    scrolledFromBottom: false,
  });
  const scrollCtx = React.useMemo(() => ({ ...scrollState, setScroll }), [scrollState]);
  return (
    <SidebarContext.Provider value={sidebar}>
      <SidebarAnimateContext.Provider value={animations}>
        <SidebarScrollContext.Provider value={scrollCtx}>{children}</SidebarScrollContext.Provider>
      </SidebarAnimateContext.Provider>
    </SidebarContext.Provider>
  );
};
SidebarProvider.displayName = 'Sidebar.Provider';

// ============================================================================
// Overlay (mobile backdrop)
// ============================================================================

export interface SidebarOverlayProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'overlay'>;
}

const SidebarOverlay = withMoveComponent<'overlay', SidebarOverlayProps, HTMLDivElement>({
  name: 'SidebarOverlay',
  styles,
  slots: ['overlay'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { setMobileOpen } = useSidebarContext();
    const mobile = React.useContext(SidebarMobileContext);
    const overlayRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef<HTMLDivElement>(ref, overlayRef);

    const overlayRefs = React.useMemo(
      () => ({
        Overlay: overlayRef as React.RefObject<HTMLElement | null>,
      }),
      [],
    );

    const { runExit, runEnter, pauseAll } = useAnimations(
      mobile?.overlayConfig ?? null,
      overlayRefs,
    );
    // Fade out in step with the aside slide; Root owns the actual close, so the
    // overlay's exit does not confirm it (no-op onExitDone).
    useDismissableExit({
      isClosing: mobile?.isClosing ?? false,
      epoch: mobile?.epoch ?? 0,
      onExitDone: () => {},
      runExit,
      runEnter,
      pauseAll,
    });

    return {
      render() {
        const overlaySp = sp('overlay');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = overlaySp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('overlay', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={composeHandlers(attrs.onClick, () => setMobileOpen(false))}
            aria-hidden="true"
          />
        );
      },
    };
  },
});

// ============================================================================
// Root (<aside> container)
// ============================================================================

export interface SidebarRootProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  side?: 'left' | 'right';
  /** Overridable user-facing strings (mobile sheet accessible name). */
  labels?: Partial<SidebarLabels>;
  sp?: SlotPropsMap<'root'>;
}

/**
 * The mobile sheet's <aside>, extracted so it mounts/unmounts WITH the Radix
 * Dialog.Content. useAnimations runs its lifecycle enter on mount, so the slide
 * only fires when this element actually appears (the always-mounted SidebarRoot
 * would fire it while the sheet is still closed and the aside is absent).
 * Mirrors DrawerContent. Rendered via Content asChild, so it forwards Radix's
 * ref + injected props (role, aria-*, data-state, onKeyDown, …) onto the aside.
 */
interface SidebarSheetProps {
  side: 'left' | 'right';
  animate: boolean;
  isClosing: boolean;
  epoch: number;
  onExitDone: (epoch: number) => void;
  titleLabel: string;
  asideClassName?: string;
  asideStyle?: React.CSSProperties;
  asideAttrs: Record<string, unknown>;
  children?: React.ReactNode;
}
const SidebarSheet = React.forwardRef<HTMLElement, SidebarSheetProps>(function SidebarSheet(
  {
    side,
    animate,
    isClosing,
    epoch,
    onExitDone,
    titleLabel,
    asideClassName,
    asideStyle,
    asideAttrs,
    children,
    ...radixProps
  },
  forwardedRef,
) {
  const asideRef = React.useRef<HTMLElement>(null);
  const mergedRef = useMergedRef<HTMLElement>(forwardedRef, asideRef);
  const config = React.useMemo(
    () => (animate ? mobileRootAnimations(side) : null),
    [animate, side],
  );
  const refs = React.useMemo(() => ({ Root: asideRef as React.RefObject<HTMLElement | null> }), []);
  const { runExit, runEnter, pauseAll } = useAnimations(config, refs);
  useDismissableExit({ isClosing, epoch, onExitDone, runExit, runEnter, pauseAll });

  const { style: radixStyle, ...radixRest } = radixProps as {
    style?: React.CSSProperties;
    [k: string]: unknown;
  };
  return (
    <aside
      ref={mergedRef}
      {...asideAttrs}
      {...radixRest}
      className={asideClassName}
      style={{ ...asideStyle, ...radixStyle }}
    >
      {/* Accessible name for the Radix Dialog. */}
      <VisuallyHidden.Root asChild>
        <RadixDialog.Title>{titleLabel}</RadixDialog.Title>
      </VisuallyHidden.Root>
      {children}
    </aside>
  );
});

const SidebarRoot = withMoveComponent<'root', SidebarRootProps, HTMLElement>({
  name: 'SidebarRoot',
  styles,
  slots: ['root'] as const,
  moveProps: ['side', 'labels'],
  defaults: { side: 'left' },

  setup({ props, ref, cx, sp, attrs }) {
    const { collapsed, mobileOpen, isMobile, setMobileOpen } = useSidebarContext();
    const animDisabled = React.useContext(SidebarAnimateContext);
    const surface = useSurfaceFlip();
    const side = (props.side as string) || 'left';

    const asideRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRef<HTMLElement>(ref, asideRef);

    // Width animation via useAnimations with deps + dynamic vars
    const widthConfig: AnimationTrigger[] | null = React.useMemo(() => {
      if (animDisabled === false || isMobile) return null;
      return [
        {
          trigger: 'width-change',
          deps: [collapsed],
          sequence: [
            {
              target: 'Root',
              animation: { width: { to: '$targetWidth', ease: smooth } },
            },
          ],
          vars: (el: HTMLElement) => {
            const rootStyles = getComputedStyle(el);
            const expandedWidth =
              rootStyles.getPropertyValue('--move-sidebar-width').trim() || '15rem';
            const collapsedWidth =
              rootStyles.getPropertyValue('--move-sidebar-width-collapsed').trim() || '4rem';
            const fromWidth = collapsed ? expandedWidth : collapsedWidth;
            const targetWidth = collapsed ? collapsedWidth : expandedWidth;
            // Snap to old width before animation
            el.style.width = fromWidth;
            return { targetWidth };
          },
          onComplete: () => {
            const el = asideRef.current;
            if (el) el.style.width = '';
          },
        },
      ];
    }, [collapsed, isMobile, animDisabled]);

    const widthRefs = React.useMemo(
      () => ({
        Root: asideRef as React.RefObject<HTMLElement | null>,
      }),
      [],
    );

    useAnimations(widthConfig, widthRefs);

    // Mobile sheet lifecycle — useDismissable keeps the Radix Dialog mounted
    // while the exit animation plays (open = isOpen || isClosing), mirroring
    // Drawer. The aside slide + overlay fade run through useAnimations (the Move
    // anime.js system), NOT CSS. Root owns the close confirmation.
    const { isOpen, isClosing, epoch, onExitDone } = useDismissable({
      open: isMobile ? mobileOpen : false,
    });
    const animateMobile = isMobile && animDisabled !== false;
    const mobileCtx = React.useMemo<SidebarMobileContextValue>(
      () => ({
        isClosing,
        epoch,
        overlayConfig: animateMobile ? MOBILE_OVERLAY_ANIMATIONS : null,
      }),
      [isClosing, epoch, animateMobile],
    );

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const labels = {
          ...DEFAULT_LABELS,
          ...(props.labels as Partial<SidebarLabels> | undefined),
        };

        // Mobile: modal sheet via Radix Dialog — focus trap, Escape, focus
        // restore, aria-modal, and scroll-lock all come from the primitive. The
        // aside lives in SidebarSheet so its slide-in fires when the sheet
        // actually mounts (see SidebarSheet).
        if (isMobile) {
          return (
            <SurfaceProvider value={surface}>
              <LayerProvider value={400}>
                <SidebarMobileContext.Provider value={mobileCtx}>
                  {/* open stays true through isClosing so the exit animation
                      plays before Radix unmounts; a Radix-initiated close
                      (Escape / overlay) flips mobileOpen, which drives the
                      dismissable exit. */}
                  <RadixDialog.Root
                    open={isOpen || isClosing}
                    onOpenChange={(o) => {
                      if (!o) setMobileOpen(false);
                    }}
                    modal
                  >
                    <RadixDialog.Portal>
                      <RadixDialog.Overlay asChild>
                        <SidebarOverlay />
                      </RadixDialog.Overlay>
                      <RadixDialog.Content asChild aria-describedby={undefined}>
                        <SidebarSheet
                          ref={mergedRef}
                          side={side as 'left' | 'right'}
                          animate={animateMobile}
                          isClosing={isClosing}
                          epoch={epoch}
                          onExitDone={onExitDone}
                          titleLabel={labels.title}
                          asideClassName={cx(
                            'root',
                            props.className,
                            spClass as string | undefined,
                          )}
                          asideStyle={{ ...props.style, ...(spStyle as React.CSSProperties) }}
                          asideAttrs={{
                            ...attrs,
                            ...spRest,
                            'data-collapsed': collapsed,
                            'data-side': side,
                            'data-mobile': true,
                            'data-surface': surface,
                          }}
                        >
                          {props.children}
                        </SidebarSheet>
                      </RadixDialog.Content>
                    </RadixDialog.Portal>
                  </RadixDialog.Root>
                </SidebarMobileContext.Provider>
              </LayerProvider>
            </SurfaceProvider>
          );
        }

        // Desktop: plain aside (landmark), width-animated on collapse.
        return (
          <SurfaceProvider value={surface}>
            <LayerProvider value={0}>
              <aside
                {...attrs}
                {...spRest}
                ref={mergedRef}
                data-collapsed={collapsed}
                data-side={side}
                data-surface={surface}
                className={cx('root', props.className, spClass as string | undefined)}
                style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
              >
                {props.children}
              </aside>
            </LayerProvider>
          </SurfaceProvider>
        );
      },
    };
  },
});

// ============================================================================
// Header (sticky top)
// ============================================================================

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Localized strings rendered by the header (mobile close button). */
  labels?: Partial<SidebarLabels>;
  sp?: SlotPropsMap<'header' | 'mobileClose'>;
}

const SidebarHeader = withMoveComponent<
  'header' | 'mobileClose',
  SidebarHeaderProps,
  HTMLDivElement
>({
  name: 'SidebarHeader',
  styles,
  slots: ['header', 'mobileClose'] as const,
  moveProps: ['labels'],

  setup({ props, ref, cx, sp, slot, attrs }) {
    const labels = { ...DEFAULT_LABELS, ...(props.labels as Partial<SidebarLabels>) };
    const { isMobile, setMobileOpen } = useSidebarContext();
    const closeIcon = useIcon('close', 16);
    const scrollCtx = React.useContext(SidebarScrollContext);

    const handleClose = React.useCallback(() => {
      setMobileOpen(false);
    }, [setMobileOpen]);

    return {
      render() {
        const headerSp = sp('header');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = headerSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('header', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-scrolled={scrollCtx?.scrolledFromTop ? '' : undefined}
          >
            {props.children}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                aria-label={labels.close}
                {...slot('mobileClose')}
              >
                {closeIcon}
              </Button>
            )}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Content (scrollable middle — stagger items on mount)
// ============================================================================

export interface SidebarContentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'content'>;
}

const SidebarContent = withMoveComponent<'content', SidebarContentProps, HTMLDivElement>({
  name: 'SidebarContent',
  styles,
  slots: ['content'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const animDisabled = React.useContext(SidebarAnimateContext);
    const { collapsed } = useSidebarContext();
    const scrollCtx = React.useContext(SidebarScrollContext);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef<HTMLDivElement>(ref, contentRef);

    // Publish two scroll-state flags. Header reads `scrolledFromTop`
    // to decide whether to render its bottom border (content has been
    // scrolled past the top). Footer reads `scrolledFromBottom` to
    // decide whether to render its top border (there's more content
    // below the visible area). Updates only fire when a flag flips —
    // not on every scroll px — so re-renders stay rare. Also runs
    // when content size changes, so a resize that newly exposes
    // overflow correctly toggles the bottom flag.
    React.useEffect(() => {
      const el = contentRef.current;
      if (!el || !scrollCtx) return;
      const update = () => {
        const fromTop = el.scrollTop > 0;
        const fromBottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
        if (fromTop !== scrollCtx.scrolledFromTop || fromBottom !== scrollCtx.scrolledFromBottom) {
          scrollCtx.setScroll({ scrolledFromTop: fromTop, scrolledFromBottom: fromBottom });
        }
      };
      update();
      el.addEventListener('scroll', update, { passive: true });
      const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
      ro?.observe(el);
      return () => {
        el.removeEventListener('scroll', update);
        ro?.disconnect();
      };
    }, [scrollCtx]);

    const contentRefs = React.useMemo(
      () => ({
        Content: contentRef as React.RefObject<HTMLElement | null>,
      }),
      [],
    );

    // Compute $itemScaleFrom at animation time from the Content's measured
    // width — keeps the stagger scale at a fixed pixel delta regardless of
    // sidebar width.
    // Adds a collapsed-change trigger that slides items horizontally in a
    // stagger on every toggle: on expand they drift in from the left, on
    // collapse they drift in from the right — mirrors the Stocklabs-style
    // sidebar reveal from Dribbble.
    const configWithVars: AnimationTrigger[] | false = React.useMemo(() => {
      if (animDisabled === false) return false;
      const mountAnims = contentEnterAnimations(collapsed).map((t) => ({
        ...t,
        vars: () => {
          const w = contentRef.current?.getBoundingClientRect().width ?? 0;
          const itemScaleFrom = w > 0 ? (w - ITEM_SCALE_INSET_PX) / w : 0.95;
          return { itemScaleFrom };
        },
      }));
      const collapseAnim: AnimationTrigger = {
        trigger: 'collapsed-change',
        deps: [collapsed],
        sequence: [
          {
            target: 'Content',
            children: getItemSelector(collapsed),
            stagger: { delay: COLLAPSE_STAGGER_DELAY },
            animation: {
              // Always drift in from the right on every toggle — keeps the
              // motion direction consistent instead of mirroring per state.
              translateX: {
                from: COLLAPSE_STAGGER_TRAVEL_PX,
                to: 0,
                ease: 'outQuart',
                duration: 360,
              },
              opacity: { from: 0, to: 1, ease: 'outQuart', duration: 260 },
            },
          },
        ],
      };
      return [...mountAnims, collapseAnim];
    }, [animDisabled, collapsed]);

    useAnimations(configWithVars, contentRefs);

    return {
      render() {
        const contentSp = sp('content');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = contentSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('content', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Footer (sticky bottom)
// ============================================================================

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'footer'>;
}

const SidebarFooter = withMoveComponent<'footer', SidebarFooterProps, HTMLDivElement>({
  name: 'SidebarFooter',
  styles,
  slots: ['footer'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const scrollCtx = React.useContext(SidebarScrollContext);
    return {
      render() {
        const footerSp = sp('footer');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = footerSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('footer', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-scrolled={scrollCtx?.scrolledFromBottom ? '' : undefined}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Group (section container)
// ============================================================================

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'group'>;
}

const SidebarGroup = withMoveComponent<'group', SidebarGroupProps, HTMLDivElement>({
  name: 'SidebarGroup',
  styles,
  slots: ['group'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    // Named for whatever Nav sits inside it, not for itself: a Group is a box,
    // and a `role="group"` with no accessible name is one more thing to step
    // through on the way to the links.
    const labelId = React.useId();
    const [hasLabel, setHasLabel] = React.useState(false);
    const registerLabel = React.useCallback(() => setHasLabel(true), []);
    const groupCtx = React.useMemo(
      () => ({ labelId, hasLabel, registerLabel }),
      [labelId, hasLabel, registerLabel],
    );

    return {
      render() {
        const groupSp = sp('group');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = groupSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('group', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            <SidebarGroupContext.Provider value={groupCtx}>
              {props.children}
            </SidebarGroupContext.Provider>
          </div>
        );
      },
    };
  },
});

// ============================================================================
// GroupLabel (section heading)
// ============================================================================

export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'groupLabel'>;
}

const SidebarGroupLabel = withMoveComponent<'groupLabel', SidebarGroupLabelProps, HTMLDivElement>({
  name: 'SidebarGroupLabel',
  styles,
  slots: ['groupLabel'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const group = React.useContext(SidebarGroupContext);
    const registerLabel = group?.registerLabel;

    // Tell the Group there is a heading to point at. In an effect rather than
    // during render because it moves the Group's state, and a parent cannot be
    // updated while a child is rendering.
    React.useEffect(() => {
      registerLabel?.();
    }, [registerLabel]);

    return {
      render() {
        const groupLabelSp = sp('groupLabel');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = groupLabelSp as Record<string, unknown>;
        return (
          <div
            id={group?.labelId}
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('groupLabel', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Nav (the list of destinations)
// ============================================================================

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'nav' | 'navList'>;
}

const SidebarNav = withMoveComponent<'nav' | 'navList', SidebarNavProps, HTMLElement>({
  name: 'SidebarNav',
  styles,
  slots: ['nav', 'navList'] as const,

  setup({ props, ref, cx, sp, slot, attrs }) {
    const group = React.useContext(SidebarGroupContext);
    const ariaLabel = attrs['aria-label'];
    const ariaLabelledby = attrs['aria-labelledby'];
    // A Group's own GroupLabel is already the section's name on screen; borrow
    // it rather than asking for the same words twice — but only as a fallback.
    // aria-labelledby outranks aria-label in the name calculation, so setting
    // both would silently override whatever the caller named it.
    const inheritedLabelId =
      !ariaLabel && !ariaLabelledby && group?.hasLabel ? group.labelId : undefined;
    React.useEffect(() => {
      if (process.env.NODE_ENV !== 'development') return;
      if (ariaLabel || ariaLabelledby || inheritedLabelId) return;
      console.warn(
        '[move] <Sidebar.Nav> has no accessible name, so it is announced only as ' +
          '"navigation" — with several of them in one sidebar there is nothing to tell ' +
          'them apart. Put a <Sidebar.GroupLabel> in the surrounding <Sidebar.Group>, ' +
          'or pass an aria-label.',
      );
    }, [ariaLabel, ariaLabelledby, inheritedLabelId]);

    return {
      render() {
        const navSp = sp('nav');
        const { className: spClass, style: spStyle, ...spRest } = navSp as Record<string, unknown>;
        return (
          <nav
            aria-labelledby={inheritedLabelId}
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('nav', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {/* role="list" restores what `list-style: none` takes away in
                Safari, which is the whole reason to render a list here: "list,
                5 items" is the orientation a pile of links doesn't give. */}
            <ul role="list" {...slot('navList')}>
              <SidebarNavContext.Provider value={true}>{props.children}</SidebarNavContext.Provider>
            </ul>
          </nav>
        );
      },
    };
  },
});

// ============================================================================
// NavItem (a destination — the one part with sidebar-specific semantics)
// ============================================================================

export interface SidebarNavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Where this goes. Dropped while `disabled`, so it cannot be followed. */
  href?: string;
  /** Icon name (built-in set) or a rendered node, shown before the label. */
  icon?: React.ReactNode;
  /** Rendered after the label; hidden while collapsed. */
  badge?: React.ReactNode;
  /** The destination the user is on. Sets `aria-current="page"`. */
  active?: boolean;
  disabled?: boolean;
  /** Render the caller's element (a router `Link`) instead of an `<a>`. */
  asChild?: boolean;
  /** Shown on hover while collapsed, when the label is hidden. */
  tooltip?: React.ReactNode;
  /**
   * Nested navigation for this destination, rendered inside the same list item.
   * A `<ul>` may only contain `<li>`, so a sub-nav placed beside the NavItem
   * would fall outside the list it belongs to.
   */
  submenu?: React.ReactNode;
  sp?: SlotPropsMap<'navItemRow' | 'navItem' | 'navItemIcon' | 'navItemLabel' | 'navItemBadge'>;
}

const SidebarNavItem = withMoveComponent<
  'navItemRow' | 'navItem' | 'navItemIcon' | 'navItemLabel' | 'navItemBadge',
  SidebarNavItemProps,
  HTMLAnchorElement
>({
  name: 'SidebarNavItem',
  styles,
  slots: ['navItemRow', 'navItem', 'navItemIcon', 'navItemLabel', 'navItemBadge'] as const,
  moveProps: ['icon', 'badge', 'active', 'disabled', 'asChild', 'tooltip', 'submenu'],

  setup({ props, ref, cx, sp, slot, attrs }) {
    const { collapsed, isMobile, setMobileOpen } = useSidebarContext();
    const inNav = React.useContext(SidebarNavContext);
    const showTooltip = collapsed && !isMobile && !!props.tooltip;

    React.useEffect(() => {
      if (process.env.NODE_ENV !== 'development' || inNav) return;
      console.warn(
        '[move] <Sidebar.NavItem> renders an <li> and needs a <Sidebar.Nav> around it ' +
          'to be a list item. For something that acts rather than navigates — a theme ' +
          'toggle, an account menu — use a Button or a Dropdown instead.',
      );
    }, [inNav]);

    // Going somewhere closes the sheet, because on mobile the sheet IS the
    // page: leaving it open would cover whatever the tap just navigated to.
    //
    // Deliberately NOT through composeHandlers, which stands down on
    // preventDefault(). Here that would read the caller backwards: a router
    // calls preventDefault() to take over navigation, so it means "I am
    // navigating", not "stay put". This is the whole reason a NavItem exists —
    // it always navigates, so the sheet can always close, with no prop and no
    // sentinel to know about.
    const callerOnClick = attrs.onClick;
    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (props.disabled) {
          e.preventDefault();
          return;
        }
        (callerOnClick as ((event: React.MouseEvent<HTMLAnchorElement>) => void) | undefined)?.(e);
        if (isMobile) setMobileOpen(false);
      },
      [props.disabled, callerOnClick, isMobile, setMobileOpen],
    );

    return {
      render() {
        const itemSp = sp('navItem');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;

        const innerContent = (child?: React.ReactNode) => (
          <>
            {props.icon != null && (
              // Decorative: the label names the destination, and it stays in the
              // accessibility tree while collapsed (the CSS zeroes its width and
              // opacity rather than removing it). Without this the icon's own
              // text would land in front of the name.
              <span aria-hidden="true" {...slot('navItemIcon')}>
                {typeof props.icon === 'string' ? (
                  <Icon name={props.icon} />
                ) : (
                  (props.icon as React.ReactNode)
                )}
              </span>
            )}
            <span {...slot('navItemLabel')}>{child}</span>
            {props.badge != null && (
              <span {...slot('navItemBadge')}>{props.badge as React.ReactNode}</span>
            )}
          </>
        );

        // An anchor has no `disabled`, and a disabled control that keeps its
        // href is still followable by Enter. Drop the destination and say so.
        const rowProps = {
          // aria-current names WHICH kind of current this is; "page" is the one
          // a sidebar means. Before the spread — a caller with a truer answer
          // (`step`, `location`) should be able to give it.
          'aria-current': props.active ? ('page' as const) : undefined,
          ...attrs,
          ...spRest,
          'data-active': props.active || undefined,
          'data-disabled': props.disabled || undefined,
          'aria-disabled': props.disabled || undefined,
          onClick: handleClick,
        };

        let element: React.ReactElement;

        if (props.asChild) {
          // A router's Link owns the element; we hand it our props and put the
          // row's icon/label/badge where its own children were.
          const child = React.Children.only(props.children) as React.ReactElement<any>;
          element = React.cloneElement(
            child,
            {
              ...rowProps,
              ref,
              className: cx(
                'navItem',
                props.className,
                child.props.className,
                spClass as string | undefined,
              ),
              style: { ...child.props.style, ...props.style, ...(spStyle as React.CSSProperties) },
            },
            innerContent(child.props.children),
          );
        } else {
          element = (
            <a
              {...rowProps}
              ref={ref}
              href={props.disabled ? undefined : (attrs.href as string | undefined)}
              className={cx('navItem', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            >
              {innerContent(props.children)}
            </a>
          );
        }

        return (
          <li {...slot('navItemRow')}>
            {showTooltip ? (
              <Tooltip label={props.tooltip as React.ReactNode} side="right" sideOffset={8}>
                {element}
              </Tooltip>
            ) : (
              element
            )}
            {props.submenu as React.ReactNode}
          </li>
        );
      },
    };
  },
});

// ============================================================================
// Expanded / Collapsed (state-scoped children, at any granularity)
// ============================================================================

export interface SidebarExpandedProps {
  /** Rendered only while the sidebar is expanded. */
  children?: React.ReactNode;
}

export interface SidebarCollapsedProps {
  /** Rendered only while the sidebar is collapsed. */
  children?: React.ReactNode;
}

/**
 * Renders its children only while the sidebar is expanded.
 *
 * Anything that isn't a NavItem — a Button, an Avatar, a Dropdown — has no way
 * to know it is in a sidebar, so it is told rather than left to guess. Wrap a
 * whole control, or only the words beside an icon that stays, which keeps the
 * collapse explicit without rendering the icon twice.
 *
 * Note this unmounts rather than hides, so an open menu inside it closes when
 * the sidebar collapses.
 */
const SidebarExpanded: React.FC<SidebarExpandedProps> = ({ children }) => {
  const { collapsed, isMobile } = useSidebarContext();
  // The mobile sheet is always full width — `collapsed` is a desktop state, and
  // the CSS draws it the same way.
  return collapsed && !isMobile ? null : <>{children}</>;
};
SidebarExpanded.displayName = 'Sidebar.Expanded';

/** Renders its children only while the sidebar is collapsed. See Expanded. */
const SidebarCollapsed: React.FC<SidebarCollapsedProps> = ({ children }) => {
  const { collapsed, isMobile } = useSidebarContext();
  return collapsed && !isMobile ? <>{children}</> : null;
};
SidebarCollapsed.displayName = 'Sidebar.Collapsed';

// ============================================================================
// Trigger (toggle button)
// ============================================================================

export interface SidebarTriggerProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  tooltip?: React.ReactNode;
  /** When to show: 'desktop' (collapse only), 'mobile' (open/close only), 'both' (default). */
  visibility?: 'desktop' | 'mobile' | 'both';
  asChild?: boolean;
  sp?: SlotPropsMap<'trigger' | 'triggerIcon' | 'triggerLabel'>;
}

const SidebarTrigger = withMoveComponent<
  'trigger' | 'triggerIcon' | 'triggerLabel',
  SidebarTriggerProps,
  HTMLButtonElement
>({
  name: 'SidebarTrigger',
  styles,
  slots: ['trigger', 'triggerIcon', 'triggerLabel'] as const,
  moveProps: ['icon', 'tooltip', 'visibility', 'asChild'],

  setup({ props, ref, cx, sp, slot, attrs }) {
    const { toggleCollapsed, toggleMobileOpen, isMobile } = useSidebarContext();
    const visibility = (props.visibility as string) || 'both';
    // Show the tooltip whenever the consumer set one. (Original
    // logic only showed it when collapsed, treating the tooltip as a
    // fallback for the hidden label — that hid intentional tooltips
    // on expanded triggers like a "Collapse" affordance.) Mobile is
    // still excluded since hover-driven tooltips don't make sense
    // there.
    const showTooltip = !isMobile && !!props.tooltip;

    // composeHandlers already runs the caller's handler first and stands down on
    // preventDefault(); calling it here as well fired every consumer's onClick
    // twice.
    const handleClick = React.useCallback(() => {
      if (isMobile) {
        toggleMobileOpen();
      } else {
        toggleCollapsed();
      }
    }, [isMobile, toggleCollapsed, toggleMobileOpen]);

    return {
      render() {
        // Hide based on visibility
        if (visibility === 'desktop' && isMobile) return null;
        if (visibility === 'mobile' && !isMobile) return null;

        const triggerSp = sp('trigger');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = triggerSp as Record<string, unknown>;

        const content = (
          <>
            {props.icon && (
              <span aria-hidden="true" {...slot('triggerIcon')}>
                {typeof props.icon === 'string' ? (
                  <Icon name={props.icon} />
                ) : (
                  (props.icon as React.ReactNode)
                )}
              </span>
            )}
            {props.children != null && <span {...slot('triggerLabel')}>{props.children}</span>}
          </>
        );

        const Comp = props.asChild ? Slot.Root : 'button';

        const element = (
          <Comp
            {...attrs}
            {...spRest}
            ref={ref as any}
            className={cx('trigger', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={composeHandlers(attrs.onClick, handleClick)}
          >
            {props.icon ? content : props.children}
          </Comp>
        );

        if (showTooltip) {
          return (
            <Tooltip label={props.tooltip as React.ReactNode} side="right" sideOffset={8}>
              {element}
            </Tooltip>
          );
        }

        return element;
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Sidebar = {
  Provider: SidebarProvider,
  Root: SidebarRoot,
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  Nav: SidebarNav,
  NavItem: SidebarNavItem,
  Expanded: SidebarExpanded,
  Collapsed: SidebarCollapsed,
  Trigger: SidebarTrigger,
  Overlay: SidebarOverlay,
};
