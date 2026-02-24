'use client';

import * as React from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import { animate } from 'animejs';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine/useMergedRef';
import type { PassThrough } from '../../../engine/types';
import { mergeAnimateConfig, prefersReducedMotion } from '../../../animation/utils';
import type { PopupAnimate } from '../../../animation/types';
import { useResolvedIcon } from '../../core/Icon/useResolvedIcon';
import styles from './Popover.module.css';

// =============================================================================
// Context (animation coordination — same pattern as Dropdown)
// =============================================================================

interface PopoverContextValue {
  isClosing: boolean;
  onCloseComplete: () => void;
  close: () => void;
  animateConfig: PopupAnimate | null;
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
// Root (stateful FC — manages open/close state + animation context)
// =============================================================================

export interface PopoverRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  animate?: PopupAnimate | false;
  /** Close the popover when an ancestor element scrolls */
  closeOnScroll?: boolean;
  modal?: boolean;
}

const defaultPopoverAnimation: PopupAnimate = {
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
  pt?: PassThrough<'trigger'>;
}

const PopoverTrigger = withMoveComponent<'trigger', PopoverTriggerProps, HTMLButtonElement>({
  name: 'PopoverTrigger',
  styles,
  slots: ['trigger'] as const,
  moveProps: ['asChild'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const triggerPt = ptm('trigger');
        const { className: ptClass, style: ptStyle, ...ptRest } = triggerPt as Record<string, unknown>;
        return (
          <RadixPopover.Trigger
            {...attrs}
            {...ptRest}
            ref={ref}
            asChild={props.asChild as boolean}
            className={cx('trigger', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'anchor'>;
}

const PopoverAnchor = withMoveComponent<'anchor', PopoverAnchorProps, HTMLDivElement>({
  name: 'PopoverAnchor',
  styles,
  slots: ['anchor'] as const,
  moveProps: ['asChild'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const anchorPt = ptm('anchor');
        const { className: ptClass, style: ptStyle, ...ptRest } = anchorPt as Record<string, unknown>;
        return (
          <RadixPopover.Anchor
            {...attrs}
            {...ptRest}
            ref={ref}
            asChild={props.asChild as boolean}
            className={cx('anchor', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixPopover.Anchor>
        );
      },
    };
  },
});

// =============================================================================
// Portal (stateless — no factory needed)
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
  pt?: PassThrough<'content'>;
}

const PopoverContent = withMoveComponent<'content', PopoverContentProps, HTMLDivElement>({
  name: 'PopoverContent',
  styles,
  slots: ['content'] as const,
  moveProps: ['side', 'sideOffset', 'align', 'alignOffset', 'onPointerDownOutside', 'onEscapeKeyDown', 'onInteractOutside', 'onOpenAutoFocus', 'onCloseAutoFocus'],

  setup({ props, ref, internalRef, cx, ptm, attrs }) {
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const animRef = React.useRef<ReturnType<typeof animate> | null>(null);
    const { isClosing, onCloseComplete, close, animateConfig, closeOnScroll } = usePopoverContext();
    const [isAnimatingOut, setIsAnimatingOut] = React.useState(false);

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
    }, [closeOnScroll, close]);

    // Intercept close events to trigger animation
    const handlePointerDownOutside = (e: Event) => {
      e.preventDefault();
      (props.onPointerDownOutside as ((e: Event) => void) | undefined)?.(e);
      close();
    };

    const handleEscapeKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      (props.onEscapeKeyDown as ((e: KeyboardEvent) => void) | undefined)?.(e);
      close();
    };

    const handleInteractOutside = (e: Event) => {
      e.preventDefault();
      (props.onInteractOutside as ((e: Event) => void) | undefined)?.(e);
      close();
    };

    // Animate open on mount
    React.useLayoutEffect(() => {
      const el = contentRef.current;
      if (!el) return;

      if (!animateConfig || prefersReducedMotion()) {
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
        return;
      }

      if (animRef.current) animRef.current.pause();

      el.style.opacity = '0';
      el.style.transform = 'scale(0.5)';

      animRef.current = animate(el, {
        opacity: 1,
        scale: 1,
        ease: 'outQuart',
        duration: 250,
        onComplete: () => {
          if (el) {
            el.style.removeProperty('opacity');
            el.style.removeProperty('transform');
          }
        },
      });
    }, [animateConfig]);

    // When isClosing becomes true, start local animation state
    React.useEffect(() => {
      if (isClosing && !isAnimatingOut) {
        setIsAnimatingOut(true);
      }
    }, [isClosing, isAnimatingOut]);

    // Animate close
    React.useEffect(() => {
      if (!isAnimatingOut) return;

      const el = contentRef.current;
      if (!el) return;

      if (!animateConfig || prefersReducedMotion()) {
        onCloseComplete();
        return;
      }

      if (animRef.current) animRef.current.pause();

      animRef.current = animate(el, {
        opacity: 0,
        scale: 0.95,
        ease: 'outQuart',
        duration: 200,
        onComplete: () => onCloseComplete(),
      });
    }, [isAnimatingOut, onCloseComplete, animateConfig]);

    return {
      render() {
        const contentPt = ptm('content');
        const { className: ptClass, style: ptStyle, ...ptRest } = contentPt as Record<string, unknown>;

        return (
          <RadixPopover.Content
            {...attrs}
            {...ptRest}
            ref={mergedContentRef}
            side={props.side as 'top' | 'right' | 'bottom' | 'left'}
            sideOffset={props.sideOffset as number}
            align={props.align as 'start' | 'center' | 'end'}
            alignOffset={props.alignOffset as number}
            className={cx('content', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'arrow'>;
}

const PopoverArrow = withMoveComponent<'arrow', PopoverArrowProps, HTMLElement>({
  name: 'PopoverArrow',
  styles,
  slots: ['arrow'] as const,
  moveProps: ['width', 'height'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const arrowPt = ptm('arrow');
        const { className: ptClass, style: ptStyle, ...ptRest } = arrowPt as Record<string, unknown>;
        return (
          <RadixPopover.Arrow
            {...attrs}
            {...ptRest}
            ref={ref as any}
            width={props.width as number}
            height={props.height as number}
            className={cx('arrow', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'close'>;
}

const PopoverClose = withMoveComponent<'close', PopoverCloseProps, HTMLButtonElement>({
  name: 'PopoverClose',
  styles,
  slots: ['close'] as const,
  moveProps: ['asChild', 'closeLabel'],

  setup({ props, ref, cx, ptm, attrs }) {
    const { close } = usePopoverContext();
    const resolvedCloseIcon = useResolvedIcon('x', 14);

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      close();
    };

    return {
      render() {
        const closePt = ptm('close');
        const { className: ptClass, style: ptStyle, ...ptRest } = closePt as Record<string, unknown>;

        if (props.asChild) {
          return (
            <RadixPopover.Close
              {...attrs}
              {...ptRest}
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
            {...ptRest}
            ref={ref}
            type="button"
            className={cx('close', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
