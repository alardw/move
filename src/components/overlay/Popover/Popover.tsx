'use client';
// Generated from Popover.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { mergeAnimateConfig, useLifecycleAnimate } from '../../../animation';
import type { LifecycleAnimate } from '../../../animation';
import { useResolvedIcon } from '../../../infrastructure/Icon';
import styles from './Popover.module.css';

// =============================================================================
// Context (animation coordination -- same pattern as Dropdown)
// =============================================================================

interface PopoverContextValue {
  isClosing: boolean;
  onCloseComplete: () => void;
  close: () => void;
  animateConfig: LifecycleAnimate | null;
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
  animate?: LifecycleAnimate | false;
  /** Close the popover when an ancestor element scrolls */
  closeOnScroll?: boolean;
  modal?: boolean;
}

const defaultPopoverAnimation: LifecycleAnimate = {
  enter: {
    opacity: { value: [0, 1], easing: 'outQuart' },
    scale: { value: [0.5, 1], easing: 'outQuart' },
  },
  exit: {
    opacity: { value: [1, 0], easing: 'outQuart' },
    scale: { value: [1, 0.95], easing: 'outQuart' },
    duration: 200,
  },
};

const PopoverRoot: React.FC<PopoverRootProps> = ({
  children,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  animate: animateProp,
  closeOnScroll = false,
  modal,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [isClosing, setIsClosing] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (newOpen) {
      if (!isControlled) setUncontrolledOpen(true);
      onOpenChange?.(true);
    }
    // Ignore close requests from Radix -- we handle closing via close()
  }, [isControlled, onOpenChange]);

  const handleCloseComplete = React.useCallback(() => {
    setIsClosing(false);
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
  }, [isControlled, onOpenChange]);

  const close = React.useCallback(() => {
    setIsClosing(true);
  }, []);

  const animateConfig = animateProp === false ? null : mergeAnimateConfig(defaultPopoverAnimation, animateProp);

  return (
    <PopoverContext.Provider value={{ isClosing, onCloseComplete: handleCloseComplete, close, animateConfig, closeOnScroll }}>
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

export interface PopoverTriggerProps extends Record<string, unknown> {
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
        const { className: spClass, style: spStyle, ...spRest } = triggerSp as Record<string, unknown>;
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

export interface PopoverAnchorProps extends Record<string, unknown> {
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
        const { className: spClass, style: spStyle, ...spRest } = anchorSp as Record<string, unknown>;
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
// Portal (stateless -- no factory needed)
// =============================================================================

export interface PopoverPortalProps {
  children?: React.ReactNode;
  container?: HTMLElement;
}

const PopoverPortal: React.FC<PopoverPortalProps> = (props) => (
  <RadixPopover.Portal {...props} />
);
PopoverPortal.displayName = 'Popover.Portal';

// =============================================================================
// Content
// =============================================================================

export interface PopoverContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  onPointerDownOutside?: (e: Event) => void;
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  onInteractOutside?: (e: Event) => void;
  onOpenAutoFocus?: (e: Event) => void;
  onCloseAutoFocus?: (e: Event) => void;
  sp?: SlotPropsMap<'content'>;
}

const PopoverContent = withMoveComponent<'content', PopoverContentProps, HTMLDivElement>({
  name: 'PopoverContent',
  styles,
  slots: ['content'] as const,
  moveProps: ['side', 'sideOffset', 'align', 'alignOffset', 'onPointerDownOutside', 'onEscapeKeyDown', 'onInteractOutside', 'onOpenAutoFocus', 'onCloseAutoFocus'],

  setup({ props, ref, cx, sp, attrs }) {
    const { isClosing, onCloseComplete, close, animateConfig, closeOnScroll } = usePopoverContext();

    const { contentRef } = useLifecycleAnimate({
      animate: animateConfig,
      isClosing,
      onCloseComplete,
      animateHeight: false,
    });

    const mergedContentRef = useMergedRef<HTMLDivElement>(ref, contentRef);

    // Close on ancestor scroll
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
        const { className: spClass, style: spStyle, ...spRest } = contentSp as Record<string, unknown>;

        return (
          <RadixPopover.Content
            {...attrs}
            {...spRest}
            ref={mergedContentRef}
            side={props.side as 'top' | 'right' | 'bottom' | 'left'}
            sideOffset={props.sideOffset as number}
            align={props.align as 'start' | 'center' | 'end'}
            alignOffset={props.alignOffset as number}
            className={cx('content', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onPointerDownOutside={handlePointerDownOutside}
            onEscapeKeyDown={handleEscapeKeyDown}
            onInteractOutside={handleInteractOutside}
            onOpenAutoFocus={props.onOpenAutoFocus as ((e: Event) => void) | undefined}
            onCloseAutoFocus={props.onCloseAutoFocus as ((e: Event) => void) | undefined}
          >
            {props.children}
          </RadixPopover.Content>
        );
      },
    };
  },
});

// =============================================================================
// Arrow
// =============================================================================

export interface PopoverArrowProps extends Record<string, unknown> {
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
        const { className: spClass, style: spStyle, ...spRest } = arrowSp as Record<string, unknown>;
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

export interface PopoverCloseProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  asChild?: boolean;
  closeLabel?: string;
  sp?: SlotPropsMap<'close'>;
}

const PopoverClose = withMoveComponent<'close', PopoverCloseProps, HTMLButtonElement>({
  name: 'PopoverClose',
  styles,
  slots: ['close'] as const,
  moveProps: ['asChild', 'closeLabel'],

  setup({ props, ref, cx, sp, attrs }) {
    const { close } = usePopoverContext();
    const resolvedCloseIcon = useResolvedIcon('x', 14);

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      close();
    };

    return {
      render() {
        const closeSp = sp('close');
        const { className: spClass, style: spStyle, ...spRest } = closeSp as Record<string, unknown>;

        if (props.asChild) {
          return (
            <RadixPopover.Close
              {...attrs}
              {...spRest}
              ref={ref}
              asChild
              onClick={handleClick}
            >
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
            aria-label={props.closeLabel ?? 'Close'}
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
  Portal: PopoverPortal,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Close: PopoverClose,
};
