'use client';
// Generated from Drawer.spec.ts (schemaVersion: 7, specHash: PLACEHOLDER)

import * as React from 'react';
import { Dialog as RadixDialog } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useAnimations, resolveAnimationsConfig, snappy } from '../../../animation';
import { useSurfaceFlip, SurfaceProvider } from '../../../infrastructure/Surface';
import { LayerProvider } from '../../../infrastructure/Layer';
import { useResolvedIcon } from '../../../infrastructure/Icon';
import type { AnimationTrigger } from '../../../animation';
import styles from './Drawer.module.css';

// ============================================================================
// useMediaQuery (internal)
// ============================================================================

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    setMatches(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// ============================================================================
// Types
// ============================================================================

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

// ============================================================================
// Context (animation coordination)
// ============================================================================

interface DrawerContextValue {
  isClosing: boolean;
  close: () => void;
  onCloseComplete: () => void;
  animConfig: AnimationTrigger[] | null;
  effectivePosition: DrawerPosition;
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawerContext() {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error('Drawer components must be used within Drawer.Root');
  }
  return context;
}

// ============================================================================
// Animation helpers
// ============================================================================

function getDefaultAnimations(position: DrawerPosition): AnimationTrigger[] {
  const isHorizontal = position === 'left' || position === 'right';
  const from = position === 'left' || position === 'top' ? '-100%' : '100%';

  return [
    {
      trigger: 'Content.enter',
      sequence: [{
        animation: isHorizontal
          ? { translateX: { from, to: '0%', ease: snappy } }
          : { translateY: { from, to: '0%', ease: snappy } },
      }],
    },
    {
      trigger: 'Content.exit',
      sequence: [{
        animation: isHorizontal
          ? { translateX: { to: from, ease: snappy, duration: 200 } }
          : { translateY: { to: from, ease: snappy, duration: 200 } },
      }],
    },
    {
      trigger: 'Overlay.enter',
      sequence: [{
        animation: { opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 } },
      }],
    },
    {
      trigger: 'Overlay.exit',
      sequence: [{
        animation: { opacity: { from: 1, to: 0, ease: 'outQuart', duration: 150 } },
      }],
    },
  ];
}

// ============================================================================
// Root (stateful — manages open/close state + animation context)
// ============================================================================

export interface DrawerRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  animations?: AnimationTrigger[] | false;
  modal?: boolean;
  position?: DrawerPosition;
  responsive?: boolean;
  breakpoint?: number;
}

const DrawerRoot: React.FC<DrawerRootProps> = ({
  children,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  animations: animationsProp,
  modal = true,
  position = 'right',
  responsive = true,
  breakpoint = 768,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [isClosing, setIsClosing] = React.useState(false);

  const isMobile = useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
  const effectivePosition: DrawerPosition = responsive && isMobile ? 'bottom' : position;

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (newOpen) {
      if (!isControlled) setUncontrolledOpen(true);
      onOpenChange?.(true);
    }
    // Ignore close requests from Radix — we handle closing via close()
  }, [isControlled, onOpenChange]);

  const handleCloseComplete = React.useCallback(() => {
    setIsClosing(false);
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
  }, [isControlled, onOpenChange]);

  const close = React.useCallback(() => {
    setIsClosing(true);
  }, []);

  const defaultAnims = React.useMemo(() => getDefaultAnimations(effectivePosition), [effectivePosition]);
  const animConfig = resolveAnimationsConfig(defaultAnims, animationsProp);

  return (
    <DrawerContext.Provider value={{ isClosing, close, onCloseComplete: handleCloseComplete, animConfig, effectivePosition }}>
      <RadixDialog.Root open={open || isClosing} onOpenChange={handleOpenChange} modal={modal}>
        {children}
      </RadixDialog.Root>
    </DrawerContext.Provider>
  );
};
DrawerRoot.displayName = 'Drawer.Root';

// ============================================================================
// Trigger
// ============================================================================

export interface DrawerTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  asChild?: boolean;
  sp?: SlotPropsMap<'trigger'>;
}

const DrawerTrigger = withMoveComponent<'trigger', DrawerTriggerProps, HTMLButtonElement>({
  name: 'DrawerTrigger',
  styles,
  slots: ['trigger'] as const,
  moveProps: ['asChild'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const triggerSp = sp('trigger');
        const { className: spClass, style: spStyle, ...spRest } = triggerSp as Record<string, unknown>;
        return (
          <RadixDialog.Trigger
            {...attrs}
            {...spRest}
            ref={ref}
            asChild={props.asChild as boolean}
            className={cx('trigger', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixDialog.Trigger>
        );
      },
    };
  },
});

// ============================================================================
// Portal (stateless — no factory needed)
// ============================================================================

export interface DrawerPortalProps {
  children?: React.ReactNode;
  container?: HTMLElement;
}

const DrawerPortal: React.FC<DrawerPortalProps> = (props) => (
  <RadixDialog.Portal {...props} />
);
DrawerPortal.displayName = 'Drawer.Portal';

// ============================================================================
// Overlay
// ============================================================================

export interface DrawerOverlayProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'overlay'>;
}

const DrawerOverlay = withMoveComponent<'overlay', DrawerOverlayProps, HTMLDivElement>({
  name: 'DrawerOverlay',
  styles,
  slots: ['overlay'] as const,

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const { isClosing, animConfig } = useDrawerContext();

    const overlayConfig = React.useMemo(() => {
      if (!animConfig) return null;
      return animConfig.filter((t) => t.trigger.startsWith('Overlay.'));
    }, [animConfig]);

    const overlayRefs = React.useMemo(() => ({
      Overlay: internalRef as React.RefObject<HTMLElement | null>,
    }), [internalRef]);

    const { runExit } = useAnimations(overlayConfig, overlayRefs);

    React.useEffect(() => {
      if (!isClosing) return;
      runExit();
    }, [isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
      render() {
        const overlaySp = sp('overlay');
        const { className: spClass, style: spStyle, ...spRest } = overlaySp as Record<string, unknown>;
        return (
          <RadixDialog.Overlay
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('overlay', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          />
        );
      },
    };
  },
});

// ============================================================================
// Content
// ============================================================================

export interface DrawerContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  size?: DrawerSize;
  onOpenAutoFocus?: (event: Event) => void;
  onPointerDownOutside?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onInteractOutside?: (event: Event) => void;
  sp?: SlotPropsMap<'content'>;
}

const DrawerContent = withMoveComponent<'content', DrawerContentProps, HTMLDivElement>({
  name: 'DrawerContent',
  styles,
  slots: ['content'] as const,
  moveProps: ['size', 'onOpenAutoFocus', 'onPointerDownOutside', 'onEscapeKeyDown', 'onInteractOutside'],
  defaults: { size: 'md' },

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const { isClosing, close, onCloseComplete, animConfig, effectivePosition } = useDrawerContext();
    const isBottomSheet = effectivePosition === 'bottom';
    const surface = useSurfaceFlip();

    const contentConfig = React.useMemo(() => {
      if (!animConfig) return null;
      return animConfig.filter((t) => t.trigger.startsWith('Content.'));
    }, [animConfig]);

    const contentRefs = React.useMemo(() => ({
      Content: internalRef as React.RefObject<HTMLElement | null>,
    }), [internalRef]);

    const { runExit } = useAnimations(contentConfig, contentRefs);

    React.useEffect(() => {
      if (!isClosing) return;
      if (!animConfig) { onCloseComplete?.(); return; }
      runExit().then(() => onCloseComplete?.());
    }, [isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleOpenAutoFocus = (event: Event) => {
      (props.onOpenAutoFocus as ((e: Event) => void) | undefined)?.(event);
    };

    const handlePointerDownOutside = (e: Event) => {
      (props.onPointerDownOutside as ((e: Event) => void) | undefined)?.(e);
      if (!e.defaultPrevented) close();
    };

    const handleEscapeKeyDown = (e: KeyboardEvent) => {
      (props.onEscapeKeyDown as ((e: KeyboardEvent) => void) | undefined)?.(e);
      if (!e.defaultPrevented) close();
    };

    const handleInteractOutside = (e: Event) => {
      (props.onInteractOutside as ((e: Event) => void) | undefined)?.(e);
    };

    return {
      render() {
        const contentSp = sp('content');
        const { className: spClass, style: spStyle, ...spRest } = contentSp as Record<string, unknown>;
        return (
          <RadixDialog.Content
            {...attrs}
            {...spRest}
            ref={ref}
            data-position={effectivePosition}
            data-size={props.size}
            data-responsive={isBottomSheet ? '' : undefined}
            data-surface={surface}
            onOpenAutoFocus={handleOpenAutoFocus}
            onPointerDownOutside={handlePointerDownOutside}
            onEscapeKeyDown={handleEscapeKeyDown}
            onInteractOutside={handleInteractOutside}
            className={cx('content', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            <SurfaceProvider value={surface}>
              <LayerProvider value={400}>
                {/* TODO: re-enable handle when touch drag-to-dismiss is implemented */}
                {props.children}
              </LayerProvider>
            </SurfaceProvider>
          </RadixDialog.Content>
        );
      },
    };
  },
});

// ============================================================================
// Header
// ============================================================================

export interface DrawerHeaderProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  closable?: boolean;
  sp?: SlotPropsMap<'header'>;
}

const DrawerHeader = withMoveComponent<'header', DrawerHeaderProps, HTMLDivElement>({
  name: 'DrawerHeader',
  styles,
  slots: ['header'] as const,
  moveProps: ['closable'],
  defaults: { closable: true },

  setup({ props, ref, cx, sp, attrs }) {
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
          >
            {props.children}
            {props.closable !== false && <DrawerClose />}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Body
// ============================================================================

export interface DrawerBodyProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'body'>;
}

const DrawerBody = withMoveComponent<'body', DrawerBodyProps, HTMLDivElement>({
  name: 'DrawerBody',
  styles,
  slots: ['body'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const bodySp = sp('body');
        const { className: spClass, style: spStyle, ...spRest } = bodySp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('body', props.className, spClass as string | undefined)}
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
// Footer
// ============================================================================

export interface DrawerFooterProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'footer'>;
}

const DrawerFooter = withMoveComponent<'footer', DrawerFooterProps, HTMLDivElement>({
  name: 'DrawerFooter',
  styles,
  slots: ['footer'] as const,

  setup({ props, ref, cx, sp, attrs }) {
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
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Title
// ============================================================================

export interface DrawerTitleProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'title'>;
}

const DrawerTitle = withMoveComponent<'title', DrawerTitleProps, HTMLHeadingElement>({
  name: 'DrawerTitle',
  styles,
  slots: ['title'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const titleSp = sp('title');
        const { className: spClass, style: spStyle, ...spRest } = titleSp as Record<string, unknown>;
        return (
          <RadixDialog.Title
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('title', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixDialog.Title>
        );
      },
    };
  },
});

// ============================================================================
// Description
// ============================================================================

export interface DrawerDescriptionProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'description'>;
}

const DrawerDescription = withMoveComponent<'description', DrawerDescriptionProps, HTMLDivElement>({
  name: 'DrawerDescription',
  styles,
  slots: ['description'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const descSp = sp('description');
        const { className: spClass, style: spStyle, ...spRest } = descSp as Record<string, unknown>;
        return (
          <RadixDialog.Description asChild>
            <div
              {...attrs}
              {...spRest}
              ref={ref}
              className={cx('description', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            >
              {props.children}
            </div>
          </RadixDialog.Description>
        );
      },
    };
  },
});

// ============================================================================
// Close
// ============================================================================

export interface DrawerCloseProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  asChild?: boolean;
  sp?: SlotPropsMap<'close'>;
}

const DrawerClose = withMoveComponent<'close', DrawerCloseProps, HTMLButtonElement>({
  name: 'DrawerClose',
  styles,
  slots: ['close'] as const,
  moveProps: ['asChild'],

  setup({ props, ref, cx, sp, attrs }) {
    const { close } = useDrawerContext();
    // Default close glyph resolves through the icon resolver (falls back to the
    // built-in 'x'), so it re-skins with the rest of the app's icons.
    const closeIcon = useResolvedIcon('x', 16);

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      close();
    };

    return {
      render() {
        const closeSp = sp('close');
        const { className: spClass, style: spStyle, ...spRest } = closeSp as Record<string, unknown>;
        return (
          <RadixDialog.Close
            {...attrs}
            {...spRest}
            ref={ref}
            asChild={props.asChild as boolean}
            onClick={handleClick}
            className={props.asChild ? props.className : cx('close', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children ?? closeIcon}
          </RadixDialog.Close>
        );
      },
    };
  },
});

// ============================================================================
// Handle
// ============================================================================

export interface DrawerHandleProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'handle'>;
}

const DrawerHandle = withMoveComponent<'handle', DrawerHandleProps, HTMLDivElement>({
  name: 'DrawerHandle',
  styles,
  slots: ['handle'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const handleSp = sp('handle');
        const { className: spClass, style: spStyle, ...spRest } = handleSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('handle', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            <div className={styles.handleBar} />
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Drawer = {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Portal: DrawerPortal,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
  Handle: DrawerHandle,
};
