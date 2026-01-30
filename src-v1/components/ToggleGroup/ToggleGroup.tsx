'use client';

import * as React from 'react';
import { ToggleGroup as RadixToggleGroup } from 'radix-ui';
import styles from './ToggleGroup.module.css';

type ToggleGroupSingleProps = React.ComponentPropsWithoutRef<typeof RadixToggleGroup.Root> & {
  type: 'single';
};

type ToggleGroupMultipleProps = React.ComponentPropsWithoutRef<typeof RadixToggleGroup.Root> & {
  type: 'multiple';
};

export type ToggleGroupRootProps = (ToggleGroupSingleProps | ToggleGroupMultipleProps) & {
  className?: string;
};

const ToggleGroupRoot = React.forwardRef<
  HTMLDivElement,
  ToggleGroupRootProps
>(({ className, ...props }, ref) => (
  <RadixToggleGroup.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));
ToggleGroupRoot.displayName = 'ToggleGroup.Root';

export interface ToggleGroupItemProps extends React.ComponentPropsWithoutRef<typeof RadixToggleGroup.Item> {
  className?: string;
}

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof RadixToggleGroup.Item>,
  ToggleGroupItemProps
>(({ className, ...props }, ref) => (
  <RadixToggleGroup.Item
    ref={ref}
    className={`${styles.item} ${className || ''}`}
    {...props}
  />
));
ToggleGroupItem.displayName = 'ToggleGroup.Item';

export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem,
};
