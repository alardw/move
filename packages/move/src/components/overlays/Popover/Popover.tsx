'use client';
// Generated from Popover.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import {
  useAnimations,
  resolveAnimationsConfig,
  quick,
  useDismissable,
  useDismissableExit,
} from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import { useIcon } from '../../../infrastructure/Icon';
import { useSurfaceFlip, SurfaceProvider } from '../../../infrastructure/Surface';
import { useLayer } from '../../../infrastructure/Layer';
import styles from './Popover.module.css';

// =============================================================================
// Context (animation coordination -- same pattern as Dropdown)
// =============================================================================

interface PopoverContextValue {
  isClosing: boolean;
  epoch: number;
  onExitDone: (epoch: number) => void;
  close: () => void;
  animConfig: AnimationTrigger[] | false | null;
  closeOnScroll: boolean;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover components must be used within Popover.Root');
  }
  return context;
}

// =============================================================================
// Root (stateful FC -- manages open/close state + animation context)
// =============================================================================

export interface PopoverRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  animations?: AnimationTrigger[] | false;
  /** Close the popover when an ancestor element scrolls */
  closeOnScroll?: boolean;
  modal?: boolean;
}

const DEFAULT_POPOVER_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Content.enter',
    sequence: [
      {
        animation: {
          // Same recipe as the tooltip: subtle scale + quick spring (not bouncy).
          opacity: { from: 0, to: 1, ease: quick },
          scale: { from: 0.88, to: 1, ease: quick },
        },
      },
    ],
  },
  {
    trigger: 'Content.exit',
    sequence: [
      {
        animation: {
          opacity: { from: 1, to: 0, ease: 'outQuart', duration: 150 },
          scale: { from: 1, to: 0.95, ease: 'outQuart', duration: 200 },
        },
      },
    ],
  },
];

const PopoverRoot: React.FC<PopoverRootProps> = ({
  children,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  animations: animationsProp,
  closeOnScroll = false,
  modal,
}) => {
  // Interruptible open/close lifecycle (open cancels an in-flight close;
  // exit-completion is epoch-guarded). See useDismissable.
  const dismissable = useDismissable({ open: controlledOpen, defaultOpen, onOpenChange });
  const { isOpen: open, isClosing, epoch, onExitDone, open: openFn, close } = dismissable;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      // Open (or cancel an in-flight close); ignore Radix's own close — the exit
      // animation drives it (useDismissable).
      if (newOpen) openFn();
    },
    [openFn],
  );

  const animConfig = resolveAnimationsConfig(DEFAULT_POPOVER_ANIMATIONS, animationsProp);

  return (
    <PopoverContext.Provider
      value={{ isClosing, epoch, onExitDone, close, animConfig, closeOnScroll }}
    >
      <RadixPopover.Root open={open || isClosing} onOpenChange={handleOpenChange} modal={modal}>
        {children}
      </RadixPopover.Root>
    </PopoverContext.Provider>
  );
};
PopoverRoot.displayName = 'Popover.Root';

// =============================================================================
// Trigger
// =============================================================================

export interface PopoverTriggerProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  asChild?: boolean;
  sp?: SlotPropsMap<'trigger'>;
}

const PopoverTrigger = withMoveComponent<'trigger', PopoverTriggerProps, HTMLButtonElement>({
  name: 'PopoverTrigger',
  styles,
  slots: ['trigger'] as const,
  moveProps: ['asChild'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const triggerSp = sp('trigger');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = triggerSp as Record<string, unknown>;
        return (
          <RadixPopover.Trigger
            {...attrs}
            {...spRest}
            ref={ref}
            asChild={props.asChild as boolean}
            className={cx('trigger', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixPopover.Trigger>
        );
      },
    };
  },
});

// =============================================================================
// Anchor
// =============================================================================

export interface PopoverAnchorProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  asChild?: boolean;
  sp?: SlotPropsMap<'anchor'>;
}

const PopoverAnchor = withMoveComponent<'anchor', PopoverAnchorProps, HTMLDivElement>({
  name: 'PopoverAnchor',
  styles,
  slots: ['anchor'] as const,
  moveProps: ['asChild'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const anchorSp = sp('anchor');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = anchorSp as Record<string, unknown>;
        return (
          <RadixPopover.Anchor
            {...attrs}
            {...spRest}
            ref={ref}
            asChild={props.asChild as boolean}
            className={cx('anchor', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixPopover.Anchor>
        );
      },
    };
  },
});

// =============================================================================
// Content (auto-portals to document.body)
// =============================================================================

export interface PopoverContentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  container?: HTMLElement;
  onPointerDownOutside?: (e: Event) => void;
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  onInteractOutside?: (e: Event) => void;
  onOpenAutoFocus?: (e: Event) => void;
  onCloseAutoFocus?: (e: Event) => void;
  sp?: SlotPropsMap<'content' | 'contentInner'>;
}

/**
 * Inner animated surface. Lives INSIDE RadixPopover.Content so it mounts per open
 * — that is what makes the lifecycle `Content.enter` fire on every open
 * (useAnimations runs its enter once per mount; keeping it in the always-mounted
 * outer component fired it once, at page load, with a null ref). Carries the
 * scale transform and the scroll region; the outer shell keeps Radix' positioning
 * transform free so the popup follows the trigger on scroll.
 */
const PopoverContentInner: React.FC<{
  surface: ReturnType<typeof useSurfaceFlip>;
  className?: string;
  style?: React.CSSProperties;
  rest?: Record<string, unknown>;
  children?: React.ReactNode;
}> = ({ surface, className, style, rest, children }) => {
  const { isClosing, epoch, onExitDone, animConfig } = usePopoverContext();
  const innerRef = React.useRef<HTMLDivElement>(null);
  const refs = React.useMemo(
    () => ({ Content: innerRef as React.RefObject<HTMLElement | null> }),
    [],
  );
  const { runExit, runEnter, pauseAll } = useAnimations(animConfig, refs);

  useDismissableExit({ isClosing, epoch, onExitDone, runExit, runEnter, pauseAll });

  return (
    <div ref={innerRef} {...rest} className={className} style={style}>
      <SurfaceProvider value={surface}>{children}</SurfaceProvider>
    </div>
  );
};

const PopoverContent = withMoveComponent<
  'content' | 'contentInner',
  PopoverContentProps,
  HTMLDivElement
>({
  name: 'PopoverContent',
  styles,
  slots: ['content', 'contentInner'] as const,
  moveProps: [
    'side',
    'sideOffset',
    'align',
    'alignOffset',
    'container',
    'onPointerDownOutside',
    'onEscapeKeyDown',
    'onInteractOutside',
    'onOpenAutoFocus',
    'onCloseAutoFocus',
  ],

  setup({ props, ref, cx, sp, attrs }) {
    const { close, closeOnScroll } = usePopoverContext();
    const surface = useSurfaceFlip();
    const layer = useLayer();

    const contentRef = React.useRef<HTMLDivElement>(null);
    const mergedContentRef = useMergedRef<HTMLDivElement>(ref, contentRef);

    // Close on ancestor scroll — opt-in (default off). When off, Radix keeps the
    // popup pinned to the trigger via autoUpdate (the inner-layer transform leaves
    // Radix' positioning transform free), so the popup follows instead of hanging.
    React.useEffect(() => {
      if (!closeOnScroll) return;
      const el = contentRef.current;
      if (!el) return;

      const handler = () => close();

      // Listen on all scrollable ancestors (capture on window catches them all)
      window.addEventListener('scroll', handler, true);
      return () => window.removeEventListener('scroll', handler, true);
    }, [closeOnScroll, close, contentRef]);

    // Intercept close events to trigger animation.
    // No preventDefault on pointer/interact -- allows native events to reach
    // other triggers (e.g. clicking another Popover while this one is open).
    // Radix can't close us because Root ignores onOpenChange(false).
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
        const innerSp = sp('contentInner');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = contentSp as Record<string, unknown>;
        const {
          className: innerSpClass,
          style: innerSpStyle,
          ...innerSpRest
        } = innerSp as Record<string, unknown>;

        return (
          <RadixPopover.Portal container={props.container as HTMLElement | undefined}>
            <RadixPopover.Content
              {...attrs}
              {...spRest}
              ref={mergedContentRef}
              side={props.side as 'top' | 'right' | 'bottom' | 'left'}
              sideOffset={props.sideOffset as number}
              align={props.align as 'start' | 'center' | 'end'}
              alignOffset={props.alignOffset as number}
              data-surface={surface}
              className={cx('content', props.className, spClass as string | undefined)}
              style={{
                ...props.style,
                ...(layer > 0 ? { zIndex: layer + 1 } : {}),
                ...(spStyle as React.CSSProperties),
              }}
              onPointerDownOutside={handlePointerDownOutside}
              onEscapeKeyDown={handleEscapeKeyDown}
              onInteractOutside={handleInteractOutside}
              onOpenAutoFocus={props.onOpenAutoFocus as ((e: Event) => void) | undefined}
              onCloseAutoFocus={props.onCloseAutoFocus as ((e: Event) => void) | undefined}
            >
              <PopoverContentInner
                surface={surface}
                className={cx('contentInner', innerSpClass as string | undefined)}
                style={innerSpStyle as React.CSSProperties}
                rest={innerSpRest}
              >
                {props.children}
              </PopoverContentInner>
            </RadixPopover.Content>
          </RadixPopover.Portal>
        );
      },
    };
  },
});

// =============================================================================
// Arrow
// =============================================================================

export interface PopoverArrowProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  sp?: SlotPropsMap<'arrow'>;
}

const PopoverArrow = withMoveComponent<'arrow', PopoverArrowProps, HTMLElement>({
  name: 'PopoverArrow',
  styles,
  slots: ['arrow'] as const,
  moveProps: ['width', 'height'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const arrowSp = sp('arrow');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = arrowSp as Record<string, unknown>;
        return (
          <RadixPopover.Arrow
            {...attrs}
            {...spRest}
            ref={ref as any}
            width={props.width as number}
            height={props.height as number}
            className={cx('arrow', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          />
        );
      },
    };
  },
});

// =============================================================================
// Close
// =============================================================================

export interface PopoverLabels {
  /** Accessible label for the close button */
  close: string;
}

const DEFAULT_LABELS: PopoverLabels = {
  close: 'Close',
};

export interface PopoverCloseProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  asChild?: boolean;
  labels?: Partial<PopoverLabels>;
  sp?: SlotPropsMap<'close'>;
}

const PopoverClose = withMoveComponent<'close', PopoverCloseProps, HTMLButtonElement>({
  name: 'PopoverClose',
  styles,
  slots: ['close'] as const,
  moveProps: ['asChild', 'labels'],

  setup({ props, ref, cx, sp, attrs }) {
    const labels = { ...DEFAULT_LABELS, ...(props.labels as Partial<PopoverLabels>) };
    const { close } = usePopoverContext();
    const resolvedCloseIcon = useIcon('close', 14);

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      close();
    };

    return {
      render() {
        const closeSp = sp('close');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = closeSp as Record<string, unknown>;

        if (props.asChild) {
          return (
            <RadixPopover.Close {...attrs} {...spRest} ref={ref} asChild onClick={handleClick}>
              {props.children}
            </RadixPopover.Close>
          );
        }

        return (
          <button
            {...attrs}
            {...spRest}
            ref={ref}
            type="button"
            className={cx('close', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={handleClick}
            aria-label={labels.close}
          >
            {props.children ?? resolvedCloseIcon}
          </button>
        );
      },
    };
  },
});

// =============================================================================
// Export
// =============================================================================

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Anchor: PopoverAnchor,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Close: PopoverClose,
};
