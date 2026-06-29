'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { Slot } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useSurfaceFlip, SurfaceProvider } from '../../../infrastructure/Surface';
import { LayerProvider } from '../../../infrastructure/Layer';
import {
  useAnimations,
  poppy,
  smooth,
} from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import { Tooltip } from '../../overlays/Tooltip';
import { Button } from '../../actions/Button';
import { Icon } from '../../../infrastructure/Icon';
import type { SlotPropsMap } from '../../../engine';
import { useSidebar } from './useSidebar';
import type { UseSidebarOptions, UseSidebarReturn } from './useSidebar';
import styles from './Sidebar.module.css';

// ============================================================================
// Labels (i18n)
// ============================================================================

export interface SidebarLabels {
  /** aria-label for the mobile close button. */
  close: string;
}

const DEFAULT_LABELS: SidebarLabels = {
  close: 'Close sidebar',
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
// Matches Sidebar.Item by default AND any consumer-rendered element that
// opts in via data-sidebar-animate (e.g. custom NavLinks used for sub-nav).
// Resolved lazily inside the component — styles.item is only defined once
// the CSS module has loaded, which at module-scope it already has.
function getItemSelector() {
  return `.${styles.item}, [data-sidebar-animate]`;
}

const DEFAULT_OVERLAY_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Overlay.enter',
    sequence: [{
      animation: { opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 } },
    }],
  },
];

const DEFAULT_CONTENT_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Content.enter',
    sequence: [{
      target: 'Content',
      children: `.${styles.item}`,
      stagger: { delay: SIDEBAR_STAGGER_DELAY },
      animation: {
        opacity: { from: 0, to: 1, duration: 300, ease: 'outQuart' },
        scale: { from: '$itemScaleFrom', to: 1, ease: poppy },
      },
    }],
  },
];

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

const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  animations,
  ...options
}) => {
  const sidebar = useSidebar(options);
  const [scrollState, setScroll] = React.useState({
    scrolledFromTop: false,
    scrolledFromBottom: false,
  });
  const scrollCtx = React.useMemo(
    () => ({ ...scrollState, setScroll }),
    [scrollState],
  );
  return (
    <SidebarContext.Provider value={sidebar}>
      <SidebarAnimateContext.Provider value={animations}>
        <SidebarScrollContext.Provider value={scrollCtx}>
          {children}
        </SidebarScrollContext.Provider>
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
    const animDisabled = React.useContext(SidebarAnimateContext);
    const overlayRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef<HTMLDivElement>(ref, overlayRef);

    const overlayRefs = React.useMemo(() => ({
      Overlay: overlayRef as React.RefObject<HTMLElement | null>,
    }), []);

    useAnimations(animDisabled === false ? false : DEFAULT_OVERLAY_ANIMATIONS, overlayRefs, undefined, {
      onEnterComplete: () => {
        const el = overlayRef.current;
        if (el) el.style.opacity = '';
      },
    });

    return {
      render() {
        const overlaySp = sp('overlay');
        const { className: spClass, style: spStyle, ...spRest } = overlaySp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('overlay', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={() => setMobileOpen(false)}
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
  sp?: SlotPropsMap<'root'>;
}

const SidebarRoot = withMoveComponent<'root', SidebarRootProps, HTMLElement>({
  name: 'SidebarRoot',
  styles,
  slots: ['root'] as const,
  moveProps: ['side'],
  defaults: { side: 'left' },

  setup({ props, ref, cx, sp, attrs }) {
    const { collapsed, mobileOpen, isMobile } = useSidebarContext();
    const animDisabled = React.useContext(SidebarAnimateContext);
    const surface = useSurfaceFlip();
    const side = (props.side as string) || 'left';

    const asideRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRef<HTMLElement>(ref, asideRef);

    // Width animation via useAnimations with deps + dynamic vars
    const widthConfig: AnimationTrigger[] | null = React.useMemo(() => {
      if (animDisabled === false || isMobile) return null;
      return [{
        trigger: 'width-change',
        deps: [collapsed],
        sequence: [{
          target: 'Root',
          animation: { width: { to: '$targetWidth', ease: smooth } },
        }],
        vars: (el: HTMLElement) => {
          const rootStyles = getComputedStyle(el);
          const expandedWidth = rootStyles.getPropertyValue('--move-sidebar-width').trim() || '15rem';
          const collapsedWidth = rootStyles.getPropertyValue('--move-sidebar-width-collapsed').trim() || '4rem';
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
      }];
    }, [collapsed, isMobile, animDisabled]);

    const widthRefs = React.useMemo(() => ({
      Root: asideRef as React.RefObject<HTMLElement | null>,
    }), []);

    useAnimations(widthConfig, widthRefs);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const aside = (
          <SurfaceProvider value={surface}>
            <LayerProvider value={isMobile ? 400 : 0}>
              <aside
                {...attrs}
                {...spRest}
                ref={mergedRef}
                data-collapsed={collapsed}
                data-side={side}
                data-mobile={isMobile || undefined}
                data-surface={surface}
                className={cx('root', props.className, spClass as string | undefined)}
                style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
              >
                {props.children}
              </aside>
            </LayerProvider>
          </SurfaceProvider>
        );

        // Mobile: portal with overlay
        if (isMobile) {
          if (!mobileOpen) return null;
          return createPortal(
            <>
              <SidebarOverlay />
              {aside}
            </>,
            document.body,
          );
        }

        // Desktop: plain aside
        return aside;
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
  /** Content shown when sidebar is collapsed. Falls back to children if not provided. */
  collapsedChildren?: React.ReactNode;
  /** Localized strings rendered by the header (mobile close button). */
  labels?: Partial<SidebarLabels>;
  sp?: SlotPropsMap<'header' | 'mobileClose'>;
}

const SidebarHeader = withMoveComponent<'header' | 'mobileClose', SidebarHeaderProps, HTMLDivElement>({
  name: 'SidebarHeader',
  styles,
  slots: ['header', 'mobileClose'] as const,
  moveProps: ['collapsedChildren', 'labels'],

  setup({ props, ref, cx, sp, attrs }) {
    const labels = { ...DEFAULT_LABELS, ...(props.labels as Partial<SidebarLabels>) };
    const { collapsed, isMobile, setMobileOpen } = useSidebarContext();
    const scrollCtx = React.useContext(SidebarScrollContext);
    const showCollapsed = collapsed && !isMobile;

    const handleClose = React.useCallback(() => {
      setMobileOpen(false);
    }, [setMobileOpen]);

    return {
      render() {
        const headerSp = sp('header');
        const { className: spClass, style: spStyle, ...spRest } = headerSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('header', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-scrolled={scrollCtx?.scrolledFromTop ? '' : undefined}
          >
            {showCollapsed && props.collapsedChildren !== undefined
              ? props.collapsedChildren
              : props.children}
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={handleClose} aria-label={labels.close} className={cx('mobileClose')}>
                <Icon name="x" />
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
        if (
          fromTop !== scrollCtx.scrolledFromTop ||
          fromBottom !== scrollCtx.scrolledFromBottom
        ) {
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

    const contentRefs = React.useMemo(() => ({
      Content: contentRef as React.RefObject<HTMLElement | null>,
    }), []);

    // Compute $itemScaleFrom at animation time from the Content's measured
    // width — keeps the stagger scale at a fixed pixel delta regardless of
    // sidebar width.
    // Adds a collapsed-change trigger that slides items horizontally in a
    // stagger on every toggle: on expand they drift in from the left, on
    // collapse they drift in from the right — mirrors the Stocklabs-style
    // sidebar reveal from Dribbble.
    const configWithVars: AnimationTrigger[] | false = React.useMemo(() => {
      if (animDisabled === false) return false;
      const mountAnims = DEFAULT_CONTENT_ANIMATIONS.map((t) => ({
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
        sequence: [{
          target: 'Content',
          children: getItemSelector(),
          stagger: { delay: COLLAPSE_STAGGER_DELAY },
          animation: {
            // Always drift in from the right on every toggle — keeps the
            // motion direction consistent instead of mirroring per state.
            translateX: { from: COLLAPSE_STAGGER_TRAVEL_PX, to: 0, ease: 'outQuart', duration: 360 },
            opacity: { from: 0, to: 1, ease: 'outQuart', duration: 260 },
          },
        }],
      };
      return [...mountAnims, collapseAnim];
    }, [animDisabled, collapsed]);

    useAnimations(configWithVars, contentRefs);

    return {
      render() {
        const contentSp = sp('content');
        const { className: spClass, style: spStyle, ...spRest } = contentSp as Record<string, unknown>;
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
        const { className: spClass, style: spStyle, ...spRest } = footerSp as Record<string, unknown>;
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
    return {
      render() {
        const groupSp = sp('group');
        const { className: spClass, style: spStyle, ...spRest } = groupSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            role="group"
            className={cx('group', props.className, spClass as string | undefined)}
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
    return {
      render() {
        const groupLabelSp = sp('groupLabel');
        const { className: spClass, style: spStyle, ...spRest } = groupLabelSp as Record<string, unknown>;
        return (
          <div
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
// Item (interactive nav element)
// ============================================================================

export interface SidebarItemProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  tooltip?: React.ReactNode;
  sp?: SlotPropsMap<'item' | 'itemIcon' | 'itemLabel' | 'itemBadge'>;
}

const SidebarItem = withMoveComponent<
  'item' | 'itemIcon' | 'itemLabel' | 'itemBadge',
  SidebarItemProps,
  HTMLButtonElement
>({
  name: 'SidebarItem',
  styles,
  slots: ['item', 'itemIcon', 'itemLabel', 'itemBadge'] as const,
  moveProps: ['icon', 'badge', 'active', 'disabled', 'asChild', 'tooltip'],

  setup({ props, ref, cx, sp, attrs }) {
    const { collapsed, isMobile, setMobileOpen } = useSidebarContext();
    const showTooltip = collapsed && !isMobile && !!props.tooltip;

    const handleItemClick = React.useCallback(
      (e: React.MouseEvent) => {
        (attrs as any).onClick?.(e);
        if (isMobile && !e.defaultPrevented) {
          setMobileOpen(false);
        }
      },
      [isMobile, setMobileOpen, attrs],
    );

    return {
      render() {
        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;

        const iconSp = sp('itemIcon');
        const { className: iconSpClass, style: iconSpStyle, ...iconSpRest } = iconSp as Record<string, unknown>;

        const labelSp = sp('itemLabel');
        const { className: labelSpClass, style: labelSpStyle, ...labelSpRest } = labelSp as Record<string, unknown>;

        const badgeSp = sp('itemBadge');
        const { className: badgeSpClass, style: badgeSpStyle, ...badgeSpRest } = badgeSp as Record<string, unknown>;

        const innerContent = (child?: React.ReactNode) => (
          <>
            {props.icon && (
              <span
                {...iconSpRest}
                className={cx('itemIcon', iconSpClass as string | undefined)}
                style={iconSpStyle as React.CSSProperties}
              >
                {typeof props.icon === 'string' ? <Icon name={props.icon} /> : props.icon as React.ReactNode}
              </span>
            )}
            <span
              {...labelSpRest}
              className={cx('itemLabel', labelSpClass as string | undefined)}
              style={labelSpStyle as React.CSSProperties}
            >
              {child}
            </span>
            {props.badge && (
              <span
                {...badgeSpRest}
                className={cx('itemBadge', badgeSpClass as string | undefined)}
                style={badgeSpStyle as React.CSSProperties}
              >
                {props.badge as React.ReactNode}
              </span>
            )}
          </>
        );

        let element: React.ReactElement;

        if (props.asChild) {
          // Clone the single child element, injecting icon/label/badge as its content
          const child = React.Children.only(props.children) as React.ReactElement<any>;
          element = React.cloneElement(
            child,
            {
              ...attrs,
              ...spRest,
              ref,
              onClick: handleItemClick,
              'data-active': props.active || undefined,
              'data-disabled': props.disabled || undefined,
              className: cx('item', props.className, child.props.className, spClass as string | undefined),
              style: { ...child.props.style, ...props.style, ...(spStyle as React.CSSProperties) },
            },
            innerContent(child.props.children),
          );
        } else {
          element = (
            <button
              {...attrs}
              {...spRest}
              ref={ref as any}
              onClick={handleItemClick}
              data-active={props.active || undefined}
              data-disabled={props.disabled || undefined}
              className={cx('item', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            >
              {innerContent(props.children)}
            </button>
          );
        }

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
  'trigger' | 'triggerIcon' | 'triggerLabel' | 'itemIcon' | 'itemLabel',
  SidebarTriggerProps,
  HTMLButtonElement
>({
  name: 'SidebarTrigger',
  styles,
  slots: ['trigger', 'triggerIcon', 'triggerLabel', 'itemIcon', 'itemLabel'] as const,
  moveProps: ['icon', 'tooltip', 'visibility', 'asChild'],

  setup({ props, ref, cx, sp, attrs }) {
    const { toggleCollapsed, toggleMobileOpen, isMobile } = useSidebarContext();
    const visibility = (props.visibility as string) || 'both';
    // Show the tooltip whenever the consumer set one. (Original
    // logic only showed it when collapsed, treating the tooltip as a
    // fallback for the hidden label — that hid intentional tooltips
    // on expanded triggers like a "Collapse" affordance.) Mobile is
    // still excluded since hover-driven tooltips don't make sense
    // there.
    const showTooltip = !isMobile && !!props.tooltip;

    const handleClick = React.useCallback(
      (e: React.MouseEvent) => {
        (attrs as any).onClick?.(e);
        if (e.defaultPrevented) return;
        if (isMobile) {
          toggleMobileOpen();
        } else {
          toggleCollapsed();
        }
      },
      [isMobile, toggleCollapsed, toggleMobileOpen, attrs],
    );

    return {
      render() {
        // Hide based on visibility
        if (visibility === 'desktop' && isMobile) return null;
        if (visibility === 'mobile' && !isMobile) return null;

        const triggerSp = sp('trigger');
        const { className: spClass, style: spStyle, ...spRest } = triggerSp as Record<string, unknown>;

        const iconSp = sp('triggerIcon');
        const { className: iconSpClass, style: iconSpStyle, ...iconSpRest } = iconSp as Record<string, unknown>;

        const labelSp = sp('triggerLabel');
        const { className: labelSpClass, style: labelSpStyle, ...labelSpRest } = labelSp as Record<string, unknown>;

        const content = (
          <>
            {props.icon && (
              <span
                {...iconSpRest}
                className={cx('itemIcon', iconSpClass as string | undefined)}
                style={iconSpStyle as React.CSSProperties}
              >
                {typeof props.icon === 'string' ? <Icon name={props.icon} /> : props.icon as React.ReactNode}
              </span>
            )}
            {props.children != null && (
              <span
                {...labelSpRest}
                className={cx('itemLabel', labelSpClass as string | undefined)}
                style={labelSpStyle as React.CSSProperties}
              >
                {props.children}
              </span>
            )}
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
            onClick={handleClick}
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
  Item: SidebarItem,
  Trigger: SidebarTrigger,
  Overlay: SidebarOverlay,
};
