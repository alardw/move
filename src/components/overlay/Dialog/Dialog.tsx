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

export interface DialogContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'content'>;
}

const DialogContent = withMoveComponent<'content', DialogContentProps, HTMLDivElement>({
  name: 'DialogContent',
  styles,
  slots: ['content'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const contentPt = ptm('content');
        const { className: ptClass, style: ptStyle, ...ptRest } = contentPt as Record<string, unknown>;
        return (
          <RadixDialog.Content
            {...attrs}
            {...ptRest}
            ref={ref}
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
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};
