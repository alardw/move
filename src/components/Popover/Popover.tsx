'use client';

import * as React from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import styles from './Popover.module.css';

export interface PopoverRootProps extends React.ComponentPropsWithoutRef<typeof RadixPopover.Root> {}

const PopoverRoot: React.FC<PopoverRootProps> = (props) => (
  <RadixPopover.Root {...props} />
);
PopoverRoot.displayName = 'Popover.Root';

export interface PopoverTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixPopover.Trigger> {
  className?: string;
}

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof RadixPopover.Trigger>,
  PopoverTriggerProps
>(({ className, ...props }, ref) => (
  <RadixPopover.Trigger
    ref={ref}
    className={`${styles.trigger} ${className || ''}`}
    {...props}
  />
));
PopoverTrigger.displayName = 'Popover.Trigger';

export interface PopoverAnchorProps extends React.ComponentPropsWithoutRef<typeof RadixPopover.Anchor> {
  className?: string;
}

const PopoverAnchor = React.forwardRef<
  React.ElementRef<typeof RadixPopover.Anchor>,
  PopoverAnchorProps
>(({ className, ...props }, ref) => (
  <RadixPopover.Anchor
    ref={ref}
    className={`${styles.anchor} ${className || ''}`}
    {...props}
  />
));
PopoverAnchor.displayName = 'Popover.Anchor';

export interface PopoverPortalProps extends React.ComponentPropsWithoutRef<typeof RadixPopover.Portal> {}

const PopoverPortal: React.FC<PopoverPortalProps> = (props) => (
  <RadixPopover.Portal {...props} />
);
PopoverPortal.displayName = 'Popover.Portal';

export interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof RadixPopover.Content> {
  className?: string;
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof RadixPopover.Content>,
  PopoverContentProps
>(({ className, ...props }, ref) => (
  <RadixPopover.Content
    ref={ref}
    className={`${styles.content} ${className || ''}`}
    {...props}
  />
));
PopoverContent.displayName = 'Popover.Content';

export interface PopoverArrowProps extends React.ComponentPropsWithoutRef<typeof RadixPopover.Arrow> {
  className?: string;
}

const PopoverArrow = React.forwardRef<
  React.ElementRef<typeof RadixPopover.Arrow>,
  PopoverArrowProps
>(({ className, ...props }, ref) => (
  <RadixPopover.Arrow
    ref={ref}
    className={`${styles.arrow} ${className || ''}`}
    {...props}
  />
));
PopoverArrow.displayName = 'Popover.Arrow';

export interface PopoverCloseProps extends React.ComponentPropsWithoutRef<typeof RadixPopover.Close> {
  className?: string;
}

const PopoverClose = React.forwardRef<
  React.ElementRef<typeof RadixPopover.Close>,
  PopoverCloseProps
>(({ className, ...props }, ref) => (
  <RadixPopover.Close
    ref={ref}
    className={`${styles.close} ${className || ''}`}
    {...props}
  />
));
PopoverClose.displayName = 'Popover.Close';

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Anchor: PopoverAnchor,
  Portal: PopoverPortal,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Close: PopoverClose,
};
