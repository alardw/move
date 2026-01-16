'use client';

import * as React from 'react';
import { Switch as RadixSwitch } from 'radix-ui';
import styles from './Switch.module.css';

export interface SwitchRootProps extends React.ComponentPropsWithoutRef<typeof RadixSwitch.Root> {
  className?: string;
}

const SwitchRoot = React.forwardRef<
  React.ElementRef<typeof RadixSwitch.Root>,
  SwitchRootProps
>(({ className, ...props }, ref) => (
  <RadixSwitch.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));
SwitchRoot.displayName = 'Switch.Root';

export interface SwitchThumbProps extends React.ComponentPropsWithoutRef<typeof RadixSwitch.Thumb> {
  className?: string;
}

const SwitchThumb = React.forwardRef<
  React.ElementRef<typeof RadixSwitch.Thumb>,
  SwitchThumbProps
>(({ className, ...props }, ref) => (
  <RadixSwitch.Thumb
    ref={ref}
    className={`${styles.thumb} ${className || ''}`}
    {...props}
  />
));
SwitchThumb.displayName = 'Switch.Thumb';

export const Switch = {
  Root: SwitchRoot,
  Thumb: SwitchThumb,
};
