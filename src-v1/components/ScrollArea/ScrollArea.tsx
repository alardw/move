'use client';

import * as React from 'react';
import { ScrollArea as RadixScrollArea } from 'radix-ui';
import styles from './ScrollArea.module.css';

export interface ScrollAreaRootProps extends React.ComponentPropsWithoutRef<typeof RadixScrollArea.Root> {
  className?: string;
}

const ScrollAreaRoot = React.forwardRef<
  React.ElementRef<typeof RadixScrollArea.Root>,
  ScrollAreaRootProps
>(({ className, ...props }, ref) => (
  <RadixScrollArea.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));
ScrollAreaRoot.displayName = 'ScrollArea.Root';

export interface ScrollAreaViewportProps extends React.ComponentPropsWithoutRef<typeof RadixScrollArea.Viewport> {
  className?: string;
}

const ScrollAreaViewport = React.forwardRef<
  React.ElementRef<typeof RadixScrollArea.Viewport>,
  ScrollAreaViewportProps
>(({ className, ...props }, ref) => (
  <RadixScrollArea.Viewport
    ref={ref}
    className={`${styles.viewport} ${className || ''}`}
    {...props}
  />
));
ScrollAreaViewport.displayName = 'ScrollArea.Viewport';

export interface ScrollAreaScrollbarProps extends React.ComponentPropsWithoutRef<typeof RadixScrollArea.Scrollbar> {
  className?: string;
}

const ScrollAreaScrollbar = React.forwardRef<
  React.ElementRef<typeof RadixScrollArea.Scrollbar>,
  ScrollAreaScrollbarProps
>(({ className, ...props }, ref) => (
  <RadixScrollArea.Scrollbar
    ref={ref}
    className={`${styles.scrollbar} ${className || ''}`}
    {...props}
  />
));
ScrollAreaScrollbar.displayName = 'ScrollArea.Scrollbar';

export interface ScrollAreaThumbProps extends React.ComponentPropsWithoutRef<typeof RadixScrollArea.Thumb> {
  className?: string;
}

const ScrollAreaThumb = React.forwardRef<
  React.ElementRef<typeof RadixScrollArea.Thumb>,
  ScrollAreaThumbProps
>(({ className, ...props }, ref) => (
  <RadixScrollArea.Thumb
    ref={ref}
    className={`${styles.thumb} ${className || ''}`}
    {...props}
  />
));
ScrollAreaThumb.displayName = 'ScrollArea.Thumb';

export interface ScrollAreaCornerProps extends React.ComponentPropsWithoutRef<typeof RadixScrollArea.Corner> {
  className?: string;
}

const ScrollAreaCorner = React.forwardRef<
  React.ElementRef<typeof RadixScrollArea.Corner>,
  ScrollAreaCornerProps
>(({ className, ...props }, ref) => (
  <RadixScrollArea.Corner
    ref={ref}
    className={`${styles.corner} ${className || ''}`}
    {...props}
  />
));
ScrollAreaCorner.displayName = 'ScrollArea.Corner';

export const ScrollArea = {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
  Corner: ScrollAreaCorner,
};
