'use client';

import * as React from 'react';
import { AspectRatio as RadixAspectRatio } from 'radix-ui';
import styles from './AspectRatio.module.css';

export interface AspectRatioProps extends React.ComponentPropsWithoutRef<typeof RadixAspectRatio.Root> {
  className?: string;
}

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof RadixAspectRatio.Root>,
  AspectRatioProps
>(({ className, ...props }, ref) => (
  <RadixAspectRatio.Root
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));

AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };
