'use client';

import * as React from 'react';
import { Toolbar as RadixToolbar } from 'radix-ui';
import styles from './Toolbar.module.css';

export interface ToolbarRootProps extends React.ComponentPropsWithoutRef<typeof RadixToolbar.Root> {
  className?: string;
}

const ToolbarRoot = React.forwardRef<
  React.ElementRef<typeof RadixToolbar.Root>,
  ToolbarRootProps
>(({ className, ...props }, ref) => (
  <RadixToolbar.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));
ToolbarRoot.displayName = 'Toolbar.Root';

export interface ToolbarButtonProps extends React.ComponentPropsWithoutRef<typeof RadixToolbar.Button> {
  className?: string;
}

const ToolbarButton = React.forwardRef<
  React.ElementRef<typeof RadixToolbar.Button>,
  ToolbarButtonProps
>(({ className, ...props }, ref) => (
  <RadixToolbar.Button
    ref={ref}
    className={`${styles.button} ${className || ''}`}
    {...props}
  />
));
ToolbarButton.displayName = 'Toolbar.Button';

export interface ToolbarSeparatorProps extends React.ComponentPropsWithoutRef<typeof RadixToolbar.Separator> {
  className?: string;
}

const ToolbarSeparator = React.forwardRef<
  React.ElementRef<typeof RadixToolbar.Separator>,
  ToolbarSeparatorProps
>(({ className, ...props }, ref) => (
  <RadixToolbar.Separator
    ref={ref}
    className={`${styles.separator} ${className || ''}`}
    {...props}
  />
));
ToolbarSeparator.displayName = 'Toolbar.Separator';

export interface ToolbarLinkProps extends React.ComponentPropsWithoutRef<typeof RadixToolbar.Link> {
  className?: string;
}

const ToolbarLink = React.forwardRef<
  React.ElementRef<typeof RadixToolbar.Link>,
  ToolbarLinkProps
>(({ className, ...props }, ref) => (
  <RadixToolbar.Link
    ref={ref}
    className={`${styles.link} ${className || ''}`}
    {...props}
  />
));
ToolbarLink.displayName = 'Toolbar.Link';

type ToolbarToggleGroupSingleProps = React.ComponentPropsWithoutRef<typeof RadixToolbar.ToggleGroup> & {
  type: 'single';
};

type ToolbarToggleGroupMultipleProps = React.ComponentPropsWithoutRef<typeof RadixToolbar.ToggleGroup> & {
  type: 'multiple';
};

export type ToolbarToggleGroupProps = (ToolbarToggleGroupSingleProps | ToolbarToggleGroupMultipleProps) & {
  className?: string;
};

const ToolbarToggleGroup = React.forwardRef<
  HTMLDivElement,
  ToolbarToggleGroupProps
>(({ className, ...props }, ref) => (
  <RadixToolbar.ToggleGroup
    ref={ref}
    className={`${styles.toggleGroup} ${className || ''}`}
    {...props}
  />
));
ToolbarToggleGroup.displayName = 'Toolbar.ToggleGroup';

export interface ToolbarToggleItemProps extends React.ComponentPropsWithoutRef<typeof RadixToolbar.ToggleItem> {
  className?: string;
}

const ToolbarToggleItem = React.forwardRef<
  React.ElementRef<typeof RadixToolbar.ToggleItem>,
  ToolbarToggleItemProps
>(({ className, ...props }, ref) => (
  <RadixToolbar.ToggleItem
    ref={ref}
    className={`${styles.toggleItem} ${className || ''}`}
    {...props}
  />
));
ToolbarToggleItem.displayName = 'Toolbar.ToggleItem';

export const Toolbar = {
  Root: ToolbarRoot,
  Button: ToolbarButton,
  Separator: ToolbarSeparator,
  Link: ToolbarLink,
  ToggleGroup: ToolbarToggleGroup,
  ToggleItem: ToolbarToggleItem,
};
