'use client';

import * as React from 'react';
import { NavigationMenu as RadixNavigationMenu } from 'radix-ui';
import styles from './NavigationMenu.module.css';

export interface NavigationMenuRootProps extends React.ComponentPropsWithoutRef<typeof RadixNavigationMenu.Root> {
  className?: string;
}

const NavigationMenuRoot = React.forwardRef<
  React.ElementRef<typeof RadixNavigationMenu.Root>,
  NavigationMenuRootProps
>(({ className, ...props }, ref) => (
  <RadixNavigationMenu.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));
NavigationMenuRoot.displayName = 'NavigationMenu.Root';

export interface NavigationMenuSubProps extends React.ComponentPropsWithoutRef<typeof RadixNavigationMenu.Sub> {
  className?: string;
}

const NavigationMenuSub = React.forwardRef<
  React.ElementRef<typeof RadixNavigationMenu.Sub>,
  NavigationMenuSubProps
>(({ className, ...props }, ref) => (
  <RadixNavigationMenu.Sub
    ref={ref}
    className={`${styles.sub} ${className || ''}`}
    {...props}
  />
));
NavigationMenuSub.displayName = 'NavigationMenu.Sub';

export interface NavigationMenuListProps extends React.ComponentPropsWithoutRef<typeof RadixNavigationMenu.List> {
  className?: string;
}

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof RadixNavigationMenu.List>,
  NavigationMenuListProps
>(({ className, ...props }, ref) => (
  <RadixNavigationMenu.List
    ref={ref}
    className={`${styles.list} ${className || ''}`}
    {...props}
  />
));
NavigationMenuList.displayName = 'NavigationMenu.List';

export interface NavigationMenuItemProps extends React.ComponentPropsWithoutRef<typeof RadixNavigationMenu.Item> {
  className?: string;
}

const NavigationMenuItem = React.forwardRef<
  React.ElementRef<typeof RadixNavigationMenu.Item>,
  NavigationMenuItemProps
>(({ className, ...props }, ref) => (
  <RadixNavigationMenu.Item
    ref={ref}
    className={`${styles.item} ${className || ''}`}
    {...props}
  />
));
NavigationMenuItem.displayName = 'NavigationMenu.Item';

export interface NavigationMenuTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixNavigationMenu.Trigger> {
  className?: string;
}

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof RadixNavigationMenu.Trigger>,
  NavigationMenuTriggerProps
>(({ className, ...props }, ref) => (
  <RadixNavigationMenu.Trigger
    ref={ref}
    className={`${styles.trigger} ${className || ''}`}
    {...props}
  />
));
NavigationMenuTrigger.displayName = 'NavigationMenu.Trigger';

export interface NavigationMenuContentProps extends React.ComponentPropsWithoutRef<typeof RadixNavigationMenu.Content> {
  className?: string;
}

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof RadixNavigationMenu.Content>,
  NavigationMenuContentProps
>(({ className, ...props }, ref) => (
  <RadixNavigationMenu.Content
    ref={ref}
    className={`${styles.content} ${className || ''}`}
    {...props}
  />
));
NavigationMenuContent.displayName = 'NavigationMenu.Content';

export interface NavigationMenuLinkProps extends React.ComponentPropsWithoutRef<typeof RadixNavigationMenu.Link> {
  className?: string;
}

const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof RadixNavigationMenu.Link>,
  NavigationMenuLinkProps
>(({ className, ...props }, ref) => (
  <RadixNavigationMenu.Link
    ref={ref}
    className={`${styles.link} ${className || ''}`}
    {...props}
  />
));
NavigationMenuLink.displayName = 'NavigationMenu.Link';

export interface NavigationMenuIndicatorProps extends React.ComponentPropsWithoutRef<typeof RadixNavigationMenu.Indicator> {
  className?: string;
}

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof RadixNavigationMenu.Indicator>,
  NavigationMenuIndicatorProps
>(({ className, ...props }, ref) => (
  <RadixNavigationMenu.Indicator
    ref={ref}
    className={`${styles.indicator} ${className || ''}`}
    {...props}
  />
));
NavigationMenuIndicator.displayName = 'NavigationMenu.Indicator';

export interface NavigationMenuViewportProps extends React.ComponentPropsWithoutRef<typeof RadixNavigationMenu.Viewport> {
  className?: string;
}

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof RadixNavigationMenu.Viewport>,
  NavigationMenuViewportProps
>(({ className, ...props }, ref) => (
  <RadixNavigationMenu.Viewport
    ref={ref}
    className={`${styles.viewport} ${className || ''}`}
    {...props}
  />
));
NavigationMenuViewport.displayName = 'NavigationMenu.Viewport';

export const NavigationMenu = {
  Root: NavigationMenuRoot,
  Sub: NavigationMenuSub,
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Content: NavigationMenuContent,
  Link: NavigationMenuLink,
  Indicator: NavigationMenuIndicator,
  Viewport: NavigationMenuViewport,
};
