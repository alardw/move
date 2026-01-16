'use client';

import * as React from 'react';
import { HoverCard as RadixHoverCard } from 'radix-ui';
import styles from './HoverCard.module.css';

export interface HoverCardRootProps extends React.ComponentPropsWithoutRef<typeof RadixHoverCard.Root> {}

const HoverCardRoot: React.FC<HoverCardRootProps> = (props) => (
  <RadixHoverCard.Root {...props} />
);
HoverCardRoot.displayName = 'HoverCard.Root';

export interface HoverCardTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixHoverCard.Trigger> {
  className?: string;
}

const HoverCardTrigger = React.forwardRef<
  React.ElementRef<typeof RadixHoverCard.Trigger>,
  HoverCardTriggerProps
>(({ className, ...props }, ref) => (
  <RadixHoverCard.Trigger
    ref={ref}
    className={`${styles.trigger} ${className || ''}`}
    {...props}
  />
));
HoverCardTrigger.displayName = 'HoverCard.Trigger';

export interface HoverCardPortalProps extends React.ComponentPropsWithoutRef<typeof RadixHoverCard.Portal> {}

const HoverCardPortal: React.FC<HoverCardPortalProps> = (props) => (
  <RadixHoverCard.Portal {...props} />
);
HoverCardPortal.displayName = 'HoverCard.Portal';

export interface HoverCardContentProps extends React.ComponentPropsWithoutRef<typeof RadixHoverCard.Content> {
  className?: string;
}

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof RadixHoverCard.Content>,
  HoverCardContentProps
>(({ className, ...props }, ref) => (
  <RadixHoverCard.Content
    ref={ref}
    className={`${styles.content} ${className || ''}`}
    {...props}
  />
));
HoverCardContent.displayName = 'HoverCard.Content';

export interface HoverCardArrowProps extends React.ComponentPropsWithoutRef<typeof RadixHoverCard.Arrow> {
  className?: string;
}

const HoverCardArrow = React.forwardRef<
  React.ElementRef<typeof RadixHoverCard.Arrow>,
  HoverCardArrowProps
>(({ className, ...props }, ref) => (
  <RadixHoverCard.Arrow
    ref={ref}
    className={`${styles.arrow} ${className || ''}`}
    {...props}
  />
));
HoverCardArrow.displayName = 'HoverCard.Arrow';

export const HoverCard = {
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
  Portal: HoverCardPortal,
  Content: HoverCardContent,
  Arrow: HoverCardArrow,
};
