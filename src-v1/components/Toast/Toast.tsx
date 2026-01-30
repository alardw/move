'use client';

import * as React from 'react';
import { Toast as RadixToast } from 'radix-ui';
import styles from './Toast.module.css';

export interface ToastProviderProps extends React.ComponentPropsWithoutRef<typeof RadixToast.Provider> {}

const ToastProvider: React.FC<ToastProviderProps> = (props) => (
  <RadixToast.Provider {...props} />
);
ToastProvider.displayName = 'Toast.Provider';

export interface ToastViewportProps extends React.ComponentPropsWithoutRef<typeof RadixToast.Viewport> {
  className?: string;
}

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof RadixToast.Viewport>,
  ToastViewportProps
>(({ className, ...props }, ref) => (
  <RadixToast.Viewport
    ref={ref}
    className={`${styles.viewport} ${className || ''}`}
    {...props}
  />
));
ToastViewport.displayName = 'Toast.Viewport';

export interface ToastRootProps extends React.ComponentPropsWithoutRef<typeof RadixToast.Root> {
  className?: string;
}

const ToastRoot = React.forwardRef<
  React.ElementRef<typeof RadixToast.Root>,
  ToastRootProps
>(({ className, ...props }, ref) => (
  <RadixToast.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));
ToastRoot.displayName = 'Toast.Root';

export interface ToastTitleProps extends React.ComponentPropsWithoutRef<typeof RadixToast.Title> {
  className?: string;
}

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof RadixToast.Title>,
  ToastTitleProps
>(({ className, ...props }, ref) => (
  <RadixToast.Title
    ref={ref}
    className={`${styles.title} ${className || ''}`}
    {...props}
  />
));
ToastTitle.displayName = 'Toast.Title';

export interface ToastDescriptionProps extends React.ComponentPropsWithoutRef<typeof RadixToast.Description> {
  className?: string;
}

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof RadixToast.Description>,
  ToastDescriptionProps
>(({ className, ...props }, ref) => (
  <RadixToast.Description
    ref={ref}
    className={`${styles.description} ${className || ''}`}
    {...props}
  />
));
ToastDescription.displayName = 'Toast.Description';

export interface ToastActionProps extends React.ComponentPropsWithoutRef<typeof RadixToast.Action> {
  className?: string;
}

const ToastAction = React.forwardRef<
  React.ElementRef<typeof RadixToast.Action>,
  ToastActionProps
>(({ className, ...props }, ref) => (
  <RadixToast.Action
    ref={ref}
    className={`${styles.action} ${className || ''}`}
    {...props}
  />
));
ToastAction.displayName = 'Toast.Action';

export interface ToastCloseProps extends React.ComponentPropsWithoutRef<typeof RadixToast.Close> {
  className?: string;
}

const ToastClose = React.forwardRef<
  React.ElementRef<typeof RadixToast.Close>,
  ToastCloseProps
>(({ className, ...props }, ref) => (
  <RadixToast.Close
    ref={ref}
    className={`${styles.close} ${className || ''}`}
    {...props}
  />
));
ToastClose.displayName = 'Toast.Close';

export const Toast = {
  Provider: ToastProvider,
  Viewport: ToastViewport,
  Root: ToastRoot,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
};
