'use client';

import * as React from 'react';
import { Dialog as RadixDialog } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import styles from './Dialog.module.css';

// ============================================================================
// Root (stateless wrapper — no factory needed)
// ============================================================================

export interface DialogRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

const DialogRoot: React.FC<DialogRootProps> = (props) => (
  <RadixDialog.Root {...props} />
);
DialogRoot.displayName = 'Dialog.Root';

// ============================================================================
// Trigger
// ============================================================================

export interface DialogTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  asChild?: boolean;
  pt?: PassThrough<'trigger'>;
}

const DialogTrigger = withMoveComponent<'trigger', DialogTriggerProps, HTMLButtonElement>({
  name: 'DialogTrigger',
  styles,
  slots: ['trigger'] as const,
  moveProps: ['asChild'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const triggerPt = ptm('trigger');
        const { className: ptClass, style: ptStyle, ...ptRest } = triggerPt as Record<string, unknown>;
        return (
          <RadixDialog.Trigger
            {...attrs}
            {...ptRest}
            ref={ref}
            asChild={props.asChild as boolean}
            className={cx('trigger', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'overlay'>;
}

const DialogOverlay = withMoveComponent<'overlay', DialogOverlayProps, HTMLDivElement>({
  name: 'DialogOverlay',
  styles,
  slots: ['overlay'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const overlayPt = ptm('overlay');
        const { className: ptClass, style: ptStyle, ...ptRest } = overlayPt as Record<string, unknown>;
        return (
          <RadixDialog.Overlay
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('overlay', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'content'>;
}

const DialogContent = withMoveComponent<'content', DialogContentProps, HTMLDivElement>({
  name: 'DialogContent',
  styles,
  slots: ['content'] as const,
  moveProps: ['size', 'onOpenAutoFocus'],
  defaults: { size: 'md' },

  setup({ props, ref, cx, ptm, attrs }) {
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

    return {
      render() {
        const contentPt = ptm('content');
        const { className: ptClass, style: ptStyle, ...ptRest } = contentPt as Record<string, unknown>;
        return (
          <RadixDialog.Content
            {...attrs}
            {...ptRest}
            ref={ref}
            data-size={props.size}
            onOpenAutoFocus={handleOpenAutoFocus}
            className={cx('content', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'title'>;
}

const DialogTitle = withMoveComponent<'title', DialogTitleProps, HTMLHeadingElement>({
  name: 'DialogTitle',
  styles,
  slots: ['title'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const titlePt = ptm('title');
        const { className: ptClass, style: ptStyle, ...ptRest } = titlePt as Record<string, unknown>;
        return (
          <RadixDialog.Title
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('title', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'description'>;
}

const DialogDescription = withMoveComponent<'description', DialogDescriptionProps, HTMLParagraphElement>({
  name: 'DialogDescription',
  styles,
  slots: ['description'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const descPt = ptm('description');
        const { className: ptClass, style: ptStyle, ...ptRest } = descPt as Record<string, unknown>;
        return (
          <RadixDialog.Description
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('description', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'header'>;
}

const DialogHeader = withMoveComponent<'header', DialogHeaderProps, HTMLDivElement>({
  name: 'DialogHeader',
  styles,
  slots: ['header'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const headerPt = ptm('header');
        const { className: ptClass, style: ptStyle, ...ptRest } = headerPt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('header', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'body'>;
}

const DialogBody = withMoveComponent<'body', DialogBodyProps, HTMLDivElement>({
  name: 'DialogBody',
  styles,
  slots: ['body'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const bodyPt = ptm('body');
        const { className: ptClass, style: ptStyle, ...ptRest } = bodyPt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('body', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'footer'>;
}

const DialogFooter = withMoveComponent<'footer', DialogFooterProps, HTMLDivElement>({
  name: 'DialogFooter',
  styles,
  slots: ['footer'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const footerPt = ptm('footer');
        const { className: ptClass, style: ptStyle, ...ptRest } = footerPt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('footer', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'footerStart'>;
}

const DialogFooterStart = withMoveComponent<'footerStart', DialogFooterStartProps, HTMLDivElement>({
  name: 'DialogFooterStart',
  styles,
  slots: ['footerStart'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const pt = ptm('footerStart');
        const { className: ptClass, style: ptStyle, ...ptRest } = pt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('footerStart', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'footerEnd'>;
}

const DialogFooterEnd = withMoveComponent<'footerEnd', DialogFooterEndProps, HTMLDivElement>({
  name: 'DialogFooterEnd',
  styles,
  slots: ['footerEnd'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const pt = ptm('footerEnd');
        const { className: ptClass, style: ptStyle, ...ptRest } = pt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('footerEnd', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'close'>;
}

const DialogClose = withMoveComponent<'close', DialogCloseProps, HTMLButtonElement>({
  name: 'DialogClose',
  styles,
  slots: ['close'] as const,
  moveProps: ['asChild'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const closePt = ptm('close');
        const { className: ptClass, style: ptStyle, ...ptRest } = closePt as Record<string, unknown>;
        return (
          <RadixDialog.Close
            {...attrs}
            {...ptRest}
            ref={ref}
            asChild={props.asChild as boolean}
            className={props.asChild ? props.className : cx('close', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
