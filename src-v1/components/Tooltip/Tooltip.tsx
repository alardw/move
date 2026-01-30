'use client';

import * as React from 'react';
import { Tooltip as RadixTooltip } from 'radix-ui';
import styles from './Tooltip.module.css';

export interface TooltipProviderProps extends React.ComponentPropsWithoutRef<typeof RadixTooltip.Provider> {}

const TooltipProvider: React.FC<TooltipProviderProps> = (props) => (
  <RadixTooltip.Provider {...props} />
);
TooltipProvider.displayName = 'Tooltip.Provider';

export interface TooltipRootProps extends React.ComponentPropsWithoutRef<typeof RadixTooltip.Root> {}

const TooltipRoot: React.FC<TooltipRootProps> = (props) => (
  <RadixTooltip.Root {...props} />
);
TooltipRoot.displayName = 'Tooltip.Root';

export interface TooltipTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixTooltip.Trigger> {
  className?: string;
}

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof RadixTooltip.Trigger>,
  TooltipTriggerProps
>(({ className, ...props }, ref) => (
  <RadixTooltip.Trigger
    ref={ref}
    className={`${styles.trigger} ${className || ''}`}
    {...props}
  />
));
TooltipTrigger.displayName = 'Tooltip.Trigger';

export interface TooltipPortalProps extends React.ComponentPropsWithoutRef<typeof RadixTooltip.Portal> {}

const TooltipPortal: React.FC<TooltipPortalProps> = (props) => (
  <RadixTooltip.Portal {...props} />
);
TooltipPortal.displayName = 'Tooltip.Portal';

export interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof RadixTooltip.Content> {
  className?: string;
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof RadixTooltip.Content>,
  TooltipContentProps
>(({ className, ...props }, ref) => (
  <RadixTooltip.Content
    ref={ref}
    className={`${styles.content} ${className || ''}`}
    {...props}
  />
));
TooltipContent.displayName = 'Tooltip.Content';

export interface TooltipArrowProps extends React.ComponentPropsWithoutRef<typeof RadixTooltip.Arrow> {
  className?: string;
}

const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof RadixTooltip.Arrow>,
  TooltipArrowProps
>(({ className, ...props }, ref) => (
  <RadixTooltip.Arrow
    ref={ref}
    className={`${styles.arrow} ${className || ''}`}
    {...props}
  />
));
TooltipArrow.displayName = 'Tooltip.Arrow';

export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
  Arrow: TooltipArrow,
};
