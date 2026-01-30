'use client';

import * as React from 'react';
import { Separator as RadixSeparator } from 'radix-ui';
import styles from './Separator.module.css';

export interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof RadixSeparator.Root> {
  className?: string;
}

const Separator = React.forwardRef<
  React.ElementRef<typeof RadixSeparator.Root>,
  SeparatorProps
>(({ className, ...props }, ref) => (
  <RadixSeparator.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));

Separator.displayName = 'Separator';

export { Separator };
