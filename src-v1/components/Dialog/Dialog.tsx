'use client';

import * as React from 'react';
import { Dialog as RadixDialog } from 'radix-ui';
import styles from './Dialog.module.css';

export interface DialogRootProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Root> {}

const DialogRoot: React.FC<DialogRootProps> = (props) => (
  <RadixDialog.Root {...props} />
);
DialogRoot.displayName = 'Dialog.Root';

export interface DialogTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Trigger> {
  className?: string;
}

const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Trigger>,
  DialogTriggerProps
>(({ className, ...props }, ref) => (
  <RadixDialog.Trigger
    ref={ref}
    className={`${styles.trigger} ${className || ''}`}
    {...props}
  />
));
DialogTrigger.displayName = 'Dialog.Trigger';

export interface DialogPortalProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Portal> {}

const DialogPortal: React.FC<DialogPortalProps> = (props) => (
  <RadixDialog.Portal {...props} />
);
DialogPortal.displayName = 'Dialog.Portal';

export interface DialogOverlayProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Overlay> {
  className?: string;
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Overlay>,
  DialogOverlayProps
>(({ className, ...props }, ref) => (
  <RadixDialog.Overlay
    ref={ref}
    className={`${styles.overlay} ${className || ''}`}
    {...props}
  />
));
DialogOverlay.displayName = 'Dialog.Overlay';

export interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  className?: string;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  DialogContentProps
>(({ className, ...props }, ref) => (
  <RadixDialog.Content
    ref={ref}
    className={`${styles.content} ${className || ''}`}
    {...props}
  />
));
DialogContent.displayName = 'Dialog.Content';

export interface DialogTitleProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Title> {
  className?: string;
}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Title>,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <RadixDialog.Title
    ref={ref}
    className={`${styles.title} ${className || ''}`}
    {...props}
  />
));
DialogTitle.displayName = 'Dialog.Title';

export interface DialogDescriptionProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Description> {
  className?: string;
}

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <RadixDialog.Description
    ref={ref}
    className={`${styles.description} ${className || ''}`}
    {...props}
  />
));
DialogDescription.displayName = 'Dialog.Description';

export interface DialogCloseProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Close> {
  className?: string;
}

const DialogClose = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Close>,
  DialogCloseProps
>(({ className, ...props }, ref) => (
  <RadixDialog.Close
    ref={ref}
    className={`${styles.close} ${className || ''}`}
    {...props}
  />
));
DialogClose.displayName = 'Dialog.Close';

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
