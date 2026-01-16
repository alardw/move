'use client';

import * as React from 'react';
import { Progress as RadixProgress } from 'radix-ui';
import styles from './Progress.module.css';

export interface ProgressRootProps extends React.ComponentPropsWithoutRef<typeof RadixProgress.Root> {
  className?: string;
}

const ProgressRoot = React.forwardRef<
  React.ElementRef<typeof RadixProgress.Root>,
  ProgressRootProps
>(({ className, ...props }, ref) => (
  <RadixProgress.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));
ProgressRoot.displayName = 'Progress.Root';

export interface ProgressIndicatorProps extends React.ComponentPropsWithoutRef<typeof RadixProgress.Indicator> {
  className?: string;
}

const ProgressIndicator = React.forwardRef<
  React.ElementRef<typeof RadixProgress.Indicator>,
  ProgressIndicatorProps
>(({ className, ...props }, ref) => (
  <RadixProgress.Indicator
    ref={ref}
    className={`${styles.indicator} ${className || ''}`}
    {...props}
  />
));
ProgressIndicator.displayName = 'Progress.Indicator';

export const Progress = {
  Root: ProgressRoot,
  Indicator: ProgressIndicator,
};
