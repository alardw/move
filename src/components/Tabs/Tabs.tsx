'use client';

import * as React from 'react';
import { Tabs as RadixTabs } from 'radix-ui';
import styles from './Tabs.module.css';

export interface TabsRootProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.Root> {
  className?: string;
}

const TabsRoot = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Root>,
  TabsRootProps
>(({ className, ...props }, ref) => (
  <RadixTabs.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));
TabsRoot.displayName = 'Tabs.Root';

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.List> {
  className?: string;
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof RadixTabs.List>,
  TabsListProps
>(({ className, ...props }, ref) => (
  <RadixTabs.List
    ref={ref}
    className={`${styles.list} ${className || ''}`}
    {...props}
  />
));
TabsList.displayName = 'Tabs.List';

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {
  className?: string;
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Trigger>,
  TabsTriggerProps
>(({ className, ...props }, ref) => (
  <RadixTabs.Trigger
    ref={ref}
    className={`${styles.trigger} ${className || ''}`}
    {...props}
  />
));
TabsTrigger.displayName = 'Tabs.Trigger';

export interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.Content> {
  className?: string;
}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => (
  <RadixTabs.Content
    ref={ref}
    className={`${styles.content} ${className || ''}`}
    {...props}
  />
));
TabsContent.displayName = 'Tabs.Content';

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
};
