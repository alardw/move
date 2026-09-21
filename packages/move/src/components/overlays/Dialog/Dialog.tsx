'use client';

import * as React from 'react';
import { Dialog as RadixDialog } from 'radix-ui';
import { composeHandlers, containsElementOfType, withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import {
  useAnimations,
  resolveAnimationsConfig,
  snappy,
  useDismissable,
  useDismissableExit,
} from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import { Surface } from '../../layout/Surface';
import { LayerProvider } from '../../../infrastructure/Layer';
import { useIcon } from '../../../infrastructure/Icon';
import styles from './Dialog.module.css';

// ============================================================================
// Labels (i18n)
// ============================================================================

export interface DialogLabels {
  /** Accessible name for the close button Header renders automatically. */
  close: string;
}

const DEFAULT_LABELS: DialogLabels = {
  close: 'Close',
};

// ============================================================================
// Context (animation coordination)
// ============================================================================

interface DialogContextValue {
  isClosing: boolean;
  close: () => void;
  epoch: number;
  onExitDone: (epoch: number) => void;
  animConfig: AnimationTrigger[] | null;
  labels: DialogLabels;
  /** Whether this is a modal — which is what decides there is a backdrop. */
  modal: boolean;
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

const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Content.enter',
    sequence: [
      {
        animation: {
          opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 },
          scale: { from: 0.85, to: 1, ease: snappy },
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
  {
    trigger: 'Overlay.enter',
    sequence: [
      {
        animation: { opacity: { from: 0, to: 1, ease: 'outQuart', duration: 250 } },
      },
    ],
  },
  {
    trigger: 'Overlay.exit',
    sequence: [
      {
        animation: { opacity: { from: 1, to: 0, ease: 'outQuart', duration: 200 } },
      },
    ],
  },
];

export interface DialogRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  animations?: AnimationTrigger[] | false;
  modal?: boolean;
  /** Overridable user-facing strings. */
  labels?: Partial<DialogLabels>;
}

const DialogRoot: React.FC<DialogRootProps> = ({
  children,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  animations: animationsProp,
  modal,
  labels: labelsProp,
}) => {
  // Interruptible open/close lifecycle (open cancels an in-flight close;
  // exit-completion is epoch-guarded). See useDismissable.
  const dismissable = useDismissable({ open: controlledOpen, defaultOpen, onOpenChange });
  const { isOpen, isClosing, epoch, onExitDone, open: openFn, close } = dismissable;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      // Open (or cancel an in-flight close); ignore Radix's own close — the exit
      // animation drives it (useDismissable).
      if (newOpen) openFn();
    },
    [openFn],
  );

  const animConfig = resolveAnimationsConfig(DEFAULT_ANIMATIONS, animationsProp);

  const labels = React.useMemo(() => ({ ...DEFAULT_LABELS, ...labelsProp }), [labelsProp]);

  return (
    <DialogContext.Provider
      value={{ isClosing, close, epoch, onExitDone, animConfig, labels, modal: modal !== false }}
    >
      <RadixDialog.Root open={isOpen || isClosing} onOpenChange={handleOpenChange} modal={modal}>
        {children}
      </RadixDialog.Root>
    </DialogContext.Provider>
  );
};
DialogRoot.displayName = 'Dialog.Root';

// ============================================================================
// Trigger
// ============================================================================

export interface DialogTriggerProps extends React.HTMLAttributes<HTMLElement> {
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = triggerSp as Record<string, unknown>;
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

/**
 * A modal has a backdrop. Rendering one is not a decision the call site makes —
 * it is what being modal MEANS: the page behind is inert, and the dimming is
 * how a person is told so. Radix draws nothing unless an Overlay is mounted, so
 * every app had to remember, and an app that forgot got a dialog floating over
 * a page that still looked live. Nothing warned them; it simply looked wrong.
 *
 * So the Portal mounts it, the way Header mounts its own Close — unless the
 * call site wrote one (it gets exactly that one, styled however it likes), or
 * the dialog is not modal, where there is nothing to dim.
 */
const DialogPortal: React.FC<DialogPortalProps> = ({ children, ...rest }) => {
  const { modal } = useDialogContext();
  const hasOwnOverlay = containsElementOfType(children, DialogOverlay);
  return (
    <RadixDialog.Portal {...rest}>
      {modal && !hasOwnOverlay && <DialogOverlay />}
      {children}
    </RadixDialog.Portal>
  );
};
DialogPortal.displayName = 'Dialog.Portal';

// ============================================================================
// Overlay
// ============================================================================

export interface DialogOverlayProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'overlay'>;
}

const DialogOverlay = withMoveComponent<'overlay', DialogOverlayProps, HTMLDivElement>({
  name: 'DialogOverlay',
  styles,
  slots: ['overlay'] as const,

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const { isClosing, epoch, animConfig } = useDialogContext();

    // Filter triggers for this slot
    const overlayConfig = React.useMemo(() => {
      if (!animConfig) return null;
      return animConfig.filter((t) => t.trigger.startsWith('Overlay.'));
    }, [animConfig]);

    const overlayRefs = React.useMemo(
      () => ({
        Overlay: internalRef as React.RefObject<HTMLElement | null>,
      }),
      [internalRef],
    );

    const { runExit, runEnter, pauseAll } = useAnimations(overlayConfig, overlayRefs);

    // Animate the backdrop in/out; the Content slot drives close completion, so
    // this exit must NOT confirm the close (no-op onExitDone).
    useDismissableExit({ isClosing, epoch, onExitDone: () => {}, runExit, runEnter, pauseAll });

    return {
      render() {
        const overlaySp = sp('overlay');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = overlaySp as Record<string, unknown>;
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

export interface DialogContentProps extends React.HTMLAttributes<HTMLElement> {
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

const DialogContent = withMoveComponent<'content', DialogContentProps, HTMLDivElement>({
  name: 'DialogContent',
  styles,
  slots: ['content'] as const,
  moveProps: [
    'size',
    'onOpenAutoFocus',
    'onPointerDownOutside',
    'onEscapeKeyDown',
    'onInteractOutside',
  ],
  defaults: { size: 'md' },

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const { isClosing, close, epoch, onExitDone, animConfig } = useDialogContext();

    // Filter triggers for this slot
    const contentConfig = React.useMemo(() => {
      if (!animConfig) return null;
      return animConfig.filter((t) => t.trigger.startsWith('Content.'));
    }, [animConfig]);

    const contentRefs = React.useMemo(
      () => ({
        Content: internalRef as React.RefObject<HTMLElement | null>,
      }),
      [internalRef],
    );

    const { runExit, runEnter, pauseAll } = useAnimations(contentConfig, contentRefs);

    useDismissableExit({ isClosing, epoch, onExitDone, runExit, runEnter, pauseAll });

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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = contentSp as Record<string, unknown>;
        return (
          <LayerProvider value={400}>
            <Surface asChild>
              <RadixDialog.Content
                {...attrs}
                {...spRest}
                ref={ref}
                data-size={props.size}
                onOpenAutoFocus={handleOpenAutoFocus}
                onPointerDownOutside={composeHandlers(
                  attrs.onPointerDownOutside,
                  handlePointerDownOutside,
                )}
                onEscapeKeyDown={handleEscapeKeyDown}
                onInteractOutside={handleInteractOutside}
                className={cx('content', props.className, spClass as string | undefined)}
                style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
              >
                {props.children}
              </RadixDialog.Content>
            </Surface>
          </LayerProvider>
        );
      },
    };
  },
});

// ============================================================================
// Title
// ============================================================================

export interface DialogTitleProps extends React.HTMLAttributes<HTMLElement> {
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = titleSp as Record<string, unknown>;
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

export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'description'>;
}

const DialogDescription = withMoveComponent<'description', DialogDescriptionProps, HTMLDivElement>({
  name: 'DialogDescription',
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
// Header
// ============================================================================

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Auto-render a close button in the header. Defaults to `true`. */
  closable?: boolean;
  sp?: SlotPropsMap<'header' | 'headerContent'>;
}

const DialogHeader = withMoveComponent<
  'header' | 'headerContent',
  DialogHeaderProps,
  HTMLDivElement
>({
  name: 'DialogHeader',
  styles,
  slots: ['header', 'headerContent'] as const,
  moveProps: ['closable'],
  defaults: { closable: true },

  setup({ props, ref, cx, sp, attrs }) {
    // A consumer who writes their own Close gets exactly that one — rendering the
    // automatic button beside it would leave two close controls in the header.
    const hasOwnClose = containsElementOfType(props.children as React.ReactNode, DialogClose);

    // The close button sits beside the header text, everything else stacks under
    // the title — so a Description lands on its own line rather than next to it.
    const childList = React.Children.toArray(props.children as React.ReactNode);
    const isClose = (child: React.ReactNode) =>
      React.isValidElement(child) && child.type === DialogClose;
    const ownClose = childList.filter(isClose);
    const stacked = childList.filter((child) => !isClose(child));

    return {
      render() {
        const headerSp = sp('header');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = headerSp as Record<string, unknown>;
        const contentSp = sp('headerContent');
        const {
          className: contentSpClass,
          style: contentSpStyle,
          ...contentSpRest
        } = contentSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('header', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            <div
              {...contentSpRest}
              className={cx('headerContent', contentSpClass as string | undefined)}
              style={contentSpStyle as React.CSSProperties}
            >
              {stacked}
            </div>
            {ownClose}
            {props.closable !== false && !hasOwnClose && <DialogClose />}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Body
// ============================================================================

export interface DialogBodyProps extends React.HTMLAttributes<HTMLElement> {
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

export interface DialogFooterProps extends React.HTMLAttributes<HTMLElement> {
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

export interface DialogFooterStartProps extends React.HTMLAttributes<HTMLElement> {
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = footerStartSp as Record<string, unknown>;
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

export interface DialogFooterEndProps extends React.HTMLAttributes<HTMLElement> {
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = footerEndSp as Record<string, unknown>;
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

export interface DialogCloseProps extends React.HTMLAttributes<HTMLElement> {
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
    const { close, labels } = useDialogContext();
    // Default close glyph resolves through the icon resolver (falls back to the
    // built-in 'x'), so it re-skins with the rest of the app's icons.
    const closeIcon = useIcon('close', 16);

    // The default glyph carries no text, so the button needs a name. Children or
    // `asChild` mean the consumer supplied the content — and with visible text an
    // aria-label would override it, so we leave those alone (WCAG 2.5.3).
    const defaultName = props.children == null && !props.asChild ? labels.close : undefined;

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
        return (
          <RadixDialog.Close
            aria-label={defaultName}
            {...attrs}
            {...spRest}
            ref={ref}
            asChild={props.asChild as boolean}
            onClick={composeHandlers(attrs.onClick, handleClick)}
            className={
              props.asChild
                ? props.className
                : cx('close', props.className, spClass as string | undefined)
            }
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
