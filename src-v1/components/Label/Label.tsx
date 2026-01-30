'use client';

import * as React from 'react';
import { Label as RadixLabel } from 'radix-ui';
import styles from './Label.module.css';

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof RadixLabel.Root> {
  className?: string;
}

const Label = React.forwardRef<
  React.ElementRef<typeof RadixLabel.Root>,
  LabelProps
>(({ className, ...props }, ref) => (
  <RadixLabel.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));

Label.displayName = 'Label';

export { Label };
