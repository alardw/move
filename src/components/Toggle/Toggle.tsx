'use client';

import * as React from 'react';
import { Toggle as RadixToggle } from 'radix-ui';
import styles from './Toggle.module.css';

export interface ToggleProps extends React.ComponentPropsWithoutRef<typeof RadixToggle.Root> {
  className?: string;
}

const Toggle = React.forwardRef<
  React.ElementRef<typeof RadixToggle.Root>,
  ToggleProps
>(({ className, ...props }, ref) => (
  <RadixToggle.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));

Toggle.displayName = 'Toggle';

export { Toggle };
