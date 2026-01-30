'use client';

import * as React from 'react';
import { ContextMenu as RadixContextMenu } from 'radix-ui';
import styles from './ContextMenu.module.css';

export interface ContextMenuRootProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.Root> {}

const ContextMenuRoot: React.FC<ContextMenuRootProps> = (props) => (
  <RadixContextMenu.Root {...props} />
);
ContextMenuRoot.displayName = 'ContextMenu.Root';

export interface ContextMenuTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.Trigger> {
  className?: string;
}

const ContextMenuTrigger = React.forwardRef<
  React.ElementRef<typeof RadixContextMenu.Trigger>,
  ContextMenuTriggerProps
>(({ className, ...props }, ref) => (
  <RadixContextMenu.Trigger
    ref={ref}
    className={`${styles.trigger} ${className || ''}`}
    {...props}
  />
));
ContextMenuTrigger.displayName = 'ContextMenu.Trigger';

export interface ContextMenuPortalProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.Portal> {}

const ContextMenuPortal: React.FC<ContextMenuPortalProps> = (props) => (
  <RadixContextMenu.Portal {...props} />
);
ContextMenuPortal.displayName = 'ContextMenu.Portal';

export interface ContextMenuContentProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.Content> {
  className?: string;
}

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof RadixContextMenu.Content>,
  ContextMenuContentProps
>(({ className, ...props }, ref) => (
  <RadixContextMenu.Content
    ref={ref}
    className={`${styles.content} ${className || ''}`}
    {...props}
  />
));
ContextMenuContent.displayName = 'ContextMenu.Content';

export interface ContextMenuArrowProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.Arrow> {
  className?: string;
}

const ContextMenuArrow = React.forwardRef<
  React.ElementRef<typeof RadixContextMenu.Arrow>,
  ContextMenuArrowProps
>(({ className, ...props }, ref) => (
  <RadixContextMenu.Arrow
    ref={ref}
    className={`${styles.arrow} ${className || ''}`}
    {...props}
  />
));
ContextMenuArrow.displayName = 'ContextMenu.Arrow';

export interface ContextMenuItemProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.Item> {
  className?: string;
}

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof RadixContextMenu.Item>,
  ContextMenuItemProps
>(({ className, ...props }, ref) => (
  <RadixContextMenu.Item
    ref={ref}
    className={`${styles.item} ${className || ''}`}
    {...props}
  />
));
ContextMenuItem.displayName = 'ContextMenu.Item';

export interface ContextMenuGroupProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.Group> {
  className?: string;
}

const ContextMenuGroup = React.forwardRef<
  React.ElementRef<typeof RadixContextMenu.Group>,
  ContextMenuGroupProps
>(({ className, ...props }, ref) => (
  <RadixContextMenu.Group
    ref={ref}
    className={`${styles.group} ${className || ''}`}
    {...props}
  />
));
ContextMenuGroup.displayName = 'ContextMenu.Group';

export interface ContextMenuLabelProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.Label> {
  className?: string;
}

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof RadixContextMenu.Label>,
  ContextMenuLabelProps
>(({ className, ...props }, ref) => (
  <RadixContextMenu.Label
    ref={ref}
    className={`${styles.label} ${className || ''}`}
    {...props}
  />
));
ContextMenuLabel.displayName = 'ContextMenu.Label';

export interface ContextMenuCheckboxItemProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.CheckboxItem> {
  className?: string;
}

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof RadixContextMenu.CheckboxItem>,
  ContextMenuCheckboxItemProps
>(({ className, ...props }, ref) => (
  <RadixContextMenu.CheckboxItem
    ref={ref}
    className={`${styles.checkboxItem} ${className || ''}`}
    {...props}
  />
));
ContextMenuCheckboxItem.displayName = 'ContextMenu.CheckboxItem';

export interface ContextMenuRadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.RadioGroup> {
  className?: string;
}

const ContextMenuRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadixContextMenu.RadioGroup>,
  ContextMenuRadioGroupProps
>(({ className, ...props }, ref) => (
  <RadixContextMenu.RadioGroup
    ref={ref}
    className={`${styles.radioGroup} ${className || ''}`}
    {...props}
  />
));
ContextMenuRadioGroup.displayName = 'ContextMenu.RadioGroup';

export interface ContextMenuRadioItemProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.RadioItem> {
  className?: string;
}

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof RadixContextMenu.RadioItem>,
  ContextMenuRadioItemProps
>(({ className, ...props }, ref) => (
  <RadixContextMenu.RadioItem
    ref={ref}
    className={`${styles.radioItem} ${className || ''}`}
    {...props}
  />
));
ContextMenuRadioItem.displayName = 'ContextMenu.RadioItem';

export interface ContextMenuItemIndicatorProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.ItemIndicator> {
  className?: string;
}

const ContextMenuItemIndicator = React.forwardRef<
  React.ElementRef<typeof RadixContextMenu.ItemIndicator>,
  ContextMenuItemIndicatorProps
>(({ className, ...props }, ref) => (
  <RadixContextMenu.ItemIndicator
    ref={ref}
    className={`${styles.itemIndicator} ${className || ''}`}
    {...props}
  />
));
ContextMenuItemIndicator.displayName = 'ContextMenu.ItemIndicator';

export interface ContextMenuSeparatorProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.Separator> {
  className?: string;
}

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof RadixContextMenu.Separator>,
  ContextMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <RadixContextMenu.Separator
    ref={ref}
    className={`${styles.separator} ${className || ''}`}
    {...props}
  />
));
ContextMenuSeparator.displayName = 'ContextMenu.Separator';

export interface ContextMenuSubProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.Sub> {}

const ContextMenuSub: React.FC<ContextMenuSubProps> = (props) => (
  <RadixContextMenu.Sub {...props} />
);
ContextMenuSub.displayName = 'ContextMenu.Sub';

export interface ContextMenuSubTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.SubTrigger> {
  className?: string;
}

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof RadixContextMenu.SubTrigger>,
  ContextMenuSubTriggerProps
>(({ className, ...props }, ref) => (
  <RadixContextMenu.SubTrigger
    ref={ref}
    className={`${styles.subTrigger} ${className || ''}`}
    {...props}
  />
));
ContextMenuSubTrigger.displayName = 'ContextMenu.SubTrigger';

export interface ContextMenuSubContentProps extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.SubContent> {
  className?: string;
}

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof RadixContextMenu.SubContent>,
  ContextMenuSubContentProps
>(({ className, ...props }, ref) => (
  <RadixContextMenu.SubContent
    ref={ref}
    className={`${styles.subContent} ${className || ''}`}
    {...props}
  />
));
ContextMenuSubContent.displayName = 'ContextMenu.SubContent';

export const ContextMenu = {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Portal: ContextMenuPortal,
  Content: ContextMenuContent,
  Arrow: ContextMenuArrow,
  Item: ContextMenuItem,
  Group: ContextMenuGroup,
  Label: ContextMenuLabel,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  ItemIndicator: ContextMenuItemIndicator,
  Separator: ContextMenuSeparator,
  Sub: ContextMenuSub,
  SubTrigger: ContextMenuSubTrigger,
  SubContent: ContextMenuSubContent,
};
