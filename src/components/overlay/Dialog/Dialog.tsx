'use client';

import * as React from 'react';
import { Dialog as RadixDialog } from 'radix-ui';
import { animate, spring } from 'animejs';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { mergeAnimateConfig, prefersReducedMotion } from '../../../animation';
import type { LifecycleAnimate } from '../../../animation';
import styles from './Dialog.module.css';

// ============================================================================
// Context (animation coordination)
// ============================================================================

interface DialogContextValue {
  isClosing: boolean;
  close: () => void;
  onCloseComplete: () => void;
  animateConfig: LifecycleAnimate | null;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within Dialog.Root');
  }
  return context;
}

// ============================================================================
// Root (stateful — manages open/close state + animation context)
// ============================================================================

const defaultDialogAnimation: LifecycleAnimate = {
  enter: {
    opacity: { value: [0, 1], easing: 'outQuart' },
    scale: { value: [0.85, 1], easing: 'snappy' },
  },
  exit: {
    opacity: { value: [1, 0], easing: 'outQuart' },
    scale: { value: [1, 0.95], easing: 'outQuart' },
    duration: 200,
  },
};

export interface DialogRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  animate?: LifecycleAnimate | false;
  modal?: boolean;
}

const DialogRoot: React.FC<DialogRootProps> = ({
  children,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  animate: animateProp,
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

  const animateConfig = animateProp === false ? null : mergeAnimateConfig(defaultDialogAnimation, animateProp);

  return (
    <DialogContext.Provider value={{ isClosing, close, onCloseComplete: handleCloseComplete, animateConfig }}>
      <RadixDialog.Root open={open || isClosing} onOpenChange={handleOpenChange} modal={modal}>
        {children}
      </RadixDialog.Root>
    </DialogContext.Provider>
  );
};
DialogRoot.displayName = 'Dialog.Root';

// ============================================================================
// Trigger
// ============================================================================

export interface DialogTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  asChild?: boolean;
  sp?: SlotPropsMap<'trigger'>;
}

const DialogTrigger = withMoveComponent<'trigger', DialogTriggerProps, HTMLButtonElement>({
  name: 'DialogTrigger',
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

export interface DialogPortalProps {
  children?: React.ReactNode;
  container?: HTMLElement;
}

const DialogPortal: React.FC<DialogPortalProps> = (props) => (
  <RadixDialog.Portal {...props} />
);
DialogPortal.displayName = 'Dialog.Portal';

// ============================================================================
// Overlay
// ============================================================================

export interface DialogOverlayProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'overlay'>;
}

const DialogOverlay = withMoveComponent<'overlay', DialogOverlayProps, HTMLDivElement>({
  name: 'DialogOverlay',
  styles,
  slots: ['overlay'] as const,

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const { isClosing, animateConfig } = useDialogContext();
    const animRef = React.useRef<ReturnType<typeof animate> | null>(null);

    // Enter: fade in
    React.useLayoutEffect(() => {
      const el = internalRef.current;
      if (!el || !animateConfig || prefersReducedMotion()) return;

      el.style.opacity = '0';
      animRef.current = animate(el, {
        opacity: [0, 1],
        ease: 'outQuart',
        duration: 250,
      });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Exit: fade out (fire-and-forget, Content drives onCloseComplete)
    React.useEffect(() => {
      if (!isClosing) return;
      const el = internalRef.current;
      if (!el || !animateConfig || prefersReducedMotion()) return;

      if (animRef.current) animRef.current.pause();
      animRef.current = animate(el, {
        opacity: [1, 0],
        ease: 'outQuart',
        duration: 200,
      });
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

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DialogContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  size?: DialogSize;
  onOpenAutoFocus?: (event: Event) => void;
  onPointerDownOutside?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onInteractOutside?: (event: Event) => void;
  sp?: SlotPropsMap<'content'>;
}

const dialogSpring = { mass: 0.6, stiffness: 350, damping: 16, velocity: 0 };

const DialogContent = withMoveComponent<'content', DialogContentProps, HTMLDivElement>({
  name: 'DialogContent',
  styles,
  slots: ['content'] as const,
  moveProps: ['size', 'onOpenAutoFocus', 'onPointerDownOutside', 'onEscapeKeyDown', 'onInteractOutside'],
  defaults: { size: 'md' },

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const { isClosing, close, onCloseComplete, animateConfig } = useDialogContext();
    const animRef = React.useRef<ReturnType<typeof animate> | null>(null);
    const isAnimatingOutRef = React.useRef(false);

    // Enter: scale with bounce + opacity
    React.useLayoutEffect(() => {
      const el = internalRef.current;
      if (!el) return;

      if (!animateConfig || prefersReducedMotion()) {
        el.style.opacity = '1';
        return;
      }

      el.style.opacity = '0';
      el.style.transform = 'scale(0.85)';

      animRef.current = animate(el, {
        opacity: [0, 1],
        scale: [0.85, 1],
        ease: spring(dialogSpring),
      });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Exit: scale down + opacity out
    React.useEffect(() => {
      if (!isClosing || isAnimatingOutRef.current) return;
      isAnimatingOutRef.current = true;

      const el = internalRef.current;
      if (!el || !animateConfig || prefersReducedMotion()) {
        isAnimatingOutRef.current = false;
        onCloseComplete();
        return;
      }

      if (animRef.current) animRef.current.pause();

      animRef.current = animate(el, {
        opacity: [1, 0],
        scale: [1, 0.95],
        ease: 'outQuart',
        duration: 200,
        onComplete: () => {
          isAnimatingOutRef.current = false;
          onCloseComplete();
        },
      });
    }, [isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleOpenAutoFocus = (event: Event) => {
      (props.onOpenAutoFocus as ((e: Event) => void) | undefined)?.(event);
      if (event.defaultPrevented) return;

      const content = event.currentTarget as HTMLElement;
      const body = content.querySelector(`.${styles.body}`);
      const footer = content.querySelector(`.${styles.footer}`);

      // Try form fields in the body first
      const firstField = body?.querySelector<HTMLElement>('input, textarea, select');
      if (firstField) {
        event.preventDefault();
        firstField.focus();
        return;
      }

      // Fall back to first button in body or footer
      const firstButton = (body ?? footer)?.querySelector<HTMLElement>('button');
      if (firstButton) {
        event.preventDefault();
        firstButton.focus();
      }
    };

    // Intercept close events to trigger animation.
    // No preventDefault on pointer/interact — allows native events to propagate.
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
            data-size={props.size}
            onOpenAutoFocus={handleOpenAutoFocus}
            onPointerDownOutside={handlePointerDownOutside}
            onEscapeKeyDown={handleEscapeKeyDown}
            onInteractOutside={handleInteractOutside}
            className={cx('content', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixDialog.Content>
        );
      },
    };
  },
});

// ============================================================================
// Title
// ============================================================================

export interface DialogTitleProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'title'>;
}

const DialogTitle = withMoveComponent<'title', DialogTitleProps, HTMLHeadingElement>({
  name: 'DialogTitle',
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

export interface DialogDescriptionProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'description'>;
}

const DialogDescription = withMoveComponent<'description', DialogDescriptionProps, HTMLParagraphElement>({
  name: 'DialogDescription',
  styles,
  slots: ['description'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const descSp = sp('description');
        const { className: spClass, style: spStyle, ...spRest } = descSp as Record<string, unknown>;
        return (
          <RadixDialog.Description
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('description', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixDialog.Description>
        );
      },
    };
  },
});

// ============================================================================
// Header
// ============================================================================

export interface DialogHeaderProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'header'>;
}

const DialogHeader = withMoveComponent<'header', DialogHeaderProps, HTMLDivElement>({
  name: 'DialogHeader',
  styles,
  slots: ['header'] as const,

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
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Body
// ============================================================================

export interface DialogBodyProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'body'>;
}

const DialogBody = withMoveComponent<'body', DialogBodyProps, HTMLDivElement>({
  name: 'DialogBody',
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

export interface DialogFooterProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'footer'>;
}

const DialogFooter = withMoveComponent<'footer', DialogFooterProps, HTMLDivElement>({
  name: 'DialogFooter',
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
// FooterStart
// ============================================================================

export interface DialogFooterStartProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'footerStart'>;
}

const DialogFooterStart = withMoveComponent<'footerStart', DialogFooterStartProps, HTMLDivElement>({
  name: 'DialogFooterStart',
  styles,
  slots: ['footerStart'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const footerStartSp = sp('footerStart');
        const { className: spClass, style: spStyle, ...spRest } = footerStartSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('footerStart', props.className, spClass as string | undefined)}
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
// FooterEnd
// ============================================================================

export interface DialogFooterEndProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'footerEnd'>;
}

const DialogFooterEnd = withMoveComponent<'footerEnd', DialogFooterEndProps, HTMLDivElement>({
  name: 'DialogFooterEnd',
  styles,
  slots: ['footerEnd'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const footerEndSp = sp('footerEnd');
        const { className: spClass, style: spStyle, ...spRest } = footerEndSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('footerEnd', props.className, spClass as string | undefined)}
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
// Close
// ============================================================================

export interface DialogCloseProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  asChild?: boolean;
  sp?: SlotPropsMap<'close'>;
}

const DialogClose = withMoveComponent<'close', DialogCloseProps, HTMLButtonElement>({
  name: 'DialogClose',
  styles,
  slots: ['close'] as const,
  moveProps: ['asChild'],

  setup({ props, ref, cx, sp, attrs }) {
    const { close } = useDialogContext();

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
            {props.children}
          </RadixDialog.Close>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  FooterStart: DialogFooterStart,
  FooterEnd: DialogFooterEnd,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};
