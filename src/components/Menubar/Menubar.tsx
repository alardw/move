'use client';

import * as React from 'react';
import { Menubar as RadixMenubar } from 'radix-ui';
import styles from './Menubar.module.css';

export interface MenubarRootProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Root> {
  className?: string;
}

const MenubarRoot = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.Root>,
  MenubarRootProps
>(({ className, ...props }, ref) => (
  <RadixMenubar.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));
MenubarRoot.displayName = 'Menubar.Root';

export interface MenubarMenuProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Menu> {}

const MenubarMenu: React.FC<MenubarMenuProps> = (props) => (
  <RadixMenubar.Menu {...props} />
);
MenubarMenu.displayName = 'Menubar.Menu';

export interface MenubarTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Trigger> {
  className?: string;
}

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.Trigger>,
  MenubarTriggerProps
>(({ className, ...props }, ref) => (
  <RadixMenubar.Trigger
    ref={ref}
    className={`${styles.trigger} ${className || ''}`}
    {...props}
  />
));
MenubarTrigger.displayName = 'Menubar.Trigger';

export interface MenubarPortalProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Portal> {}

const MenubarPortal: React.FC<MenubarPortalProps> = (props) => (
  <RadixMenubar.Portal {...props} />
);
MenubarPortal.displayName = 'Menubar.Portal';

export interface MenubarContentProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Content> {
  className?: string;
}

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.Content>,
  MenubarContentProps
>(({ className, ...props }, ref) => (
  <RadixMenubar.Content
    ref={ref}
    className={`${styles.content} ${className || ''}`}
    {...props}
  />
));
MenubarContent.displayName = 'Menubar.Content';

export interface MenubarArrowProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Arrow> {
  className?: string;
}

const MenubarArrow = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.Arrow>,
  MenubarArrowProps
>(({ className, ...props }, ref) => (
  <RadixMenubar.Arrow
    ref={ref}
    className={`${styles.arrow} ${className || ''}`}
    {...props}
  />
));
MenubarArrow.displayName = 'Menubar.Arrow';

export interface MenubarItemProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Item> {
  className?: string;
}

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.Item>,
  MenubarItemProps
>(({ className, ...props }, ref) => (
  <RadixMenubar.Item
    ref={ref}
    className={`${styles.item} ${className || ''}`}
    {...props}
  />
));
MenubarItem.displayName = 'Menubar.Item';

export interface MenubarGroupProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Group> {
  className?: string;
}

const MenubarGroup = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.Group>,
  MenubarGroupProps
>(({ className, ...props }, ref) => (
  <RadixMenubar.Group
    ref={ref}
    className={`${styles.group} ${className || ''}`}
    {...props}
  />
));
MenubarGroup.displayName = 'Menubar.Group';

export interface MenubarLabelProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Label> {
  className?: string;
}

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.Label>,
  MenubarLabelProps
>(({ className, ...props }, ref) => (
  <RadixMenubar.Label
    ref={ref}
    className={`${styles.label} ${className || ''}`}
    {...props}
  />
));
MenubarLabel.displayName = 'Menubar.Label';

export interface MenubarCheckboxItemProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.CheckboxItem> {
  className?: string;
}

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.CheckboxItem>,
  MenubarCheckboxItemProps
>(({ className, ...props }, ref) => (
  <RadixMenubar.CheckboxItem
    ref={ref}
    className={`${styles.checkboxItem} ${className || ''}`}
    {...props}
  />
));
MenubarCheckboxItem.displayName = 'Menubar.CheckboxItem';

export interface MenubarRadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.RadioGroup> {
  className?: string;
}

const MenubarRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.RadioGroup>,
  MenubarRadioGroupProps
>(({ className, ...props }, ref) => (
  <RadixMenubar.RadioGroup
    ref={ref}
    className={`${styles.radioGroup} ${className || ''}`}
    {...props}
  />
));
MenubarRadioGroup.displayName = 'Menubar.RadioGroup';

export interface MenubarRadioItemProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.RadioItem> {
  className?: string;
}

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.RadioItem>,
  MenubarRadioItemProps
>(({ className, ...props }, ref) => (
  <RadixMenubar.RadioItem
    ref={ref}
    className={`${styles.radioItem} ${className || ''}`}
    {...props}
  />
));
MenubarRadioItem.displayName = 'Menubar.RadioItem';

export interface MenubarItemIndicatorProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.ItemIndicator> {
  className?: string;
}

const MenubarItemIndicator = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.ItemIndicator>,
  MenubarItemIndicatorProps
>(({ className, ...props }, ref) => (
  <RadixMenubar.ItemIndicator
    ref={ref}
    className={`${styles.itemIndicator} ${className || ''}`}
    {...props}
  />
));
MenubarItemIndicator.displayName = 'Menubar.ItemIndicator';

export interface MenubarSeparatorProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Separator> {
  className?: string;
}

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.Separator>,
  MenubarSeparatorProps
>(({ className, ...props }, ref) => (
  <RadixMenubar.Separator
    ref={ref}
    className={`${styles.separator} ${className || ''}`}
    {...props}
  />
));
MenubarSeparator.displayName = 'Menubar.Separator';

export interface MenubarSubProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Sub> {}

const MenubarSub: React.FC<MenubarSubProps> = (props) => (
  <RadixMenubar.Sub {...props} />
);
MenubarSub.displayName = 'Menubar.Sub';

export interface MenubarSubTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.SubTrigger> {
  className?: string;
}

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.SubTrigger>,
  MenubarSubTriggerProps
>(({ className, ...props }, ref) => (
  <RadixMenubar.SubTrigger
    ref={ref}
    className={`${styles.subTrigger} ${className || ''}`}
    {...props}
  />
));
MenubarSubTrigger.displayName = 'Menubar.SubTrigger';

export interface MenubarSubContentProps extends React.ComponentPropsWithoutRef<typeof RadixMenubar.SubContent> {
  className?: string;
}

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.SubContent>,
  MenubarSubContentProps
>(({ className, ...props }, ref) => (
  <RadixMenubar.SubContent
    ref={ref}
    className={`${styles.subContent} ${className || ''}`}
    {...props}
  />
));
MenubarSubContent.displayName = 'Menubar.SubContent';

export const Menubar = {
  Root: MenubarRoot,
  Menu: MenubarMenu,
  Trigger: MenubarTrigger,
  Portal: MenubarPortal,
  Content: MenubarContent,
  Arrow: MenubarArrow,
  Item: MenubarItem,
  Group: MenubarGroup,
  Label: MenubarLabel,
  CheckboxItem: MenubarCheckboxItem,
  RadioGroup: MenubarRadioGroup,
  RadioItem: MenubarRadioItem,
  ItemIndicator: MenubarItemIndicator,
  Separator: MenubarSeparator,
  Sub: MenubarSub,
  SubTrigger: MenubarSubTrigger,
  SubContent: MenubarSubContent,
};
