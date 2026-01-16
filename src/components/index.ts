// Theme
export { ThemeProvider, useTheme } from './ThemeProvider';
export type { ThemeProviderProps, ThemeContextValue } from './ThemeProvider';
export { darkTheme, lightTheme } from '../themes';
export type { Theme, ThemeTokens, ThemeAnimation } from '../themes';

// Animation
export {
  springs,
  easings,
  getEase,
  isSpring,
  DEFAULT_DURATION,
  prefersReducedMotion,
  toAnimeParams,
  toInstantParams,
  mergeAnimateConfig,
  useAnimateConfig,
  useInteractiveAnimate,
  Presence,
  usePresence,
  useIsPresent,
  defaultAnimations,
} from '../animation';
export type {
  SpringParams,
  SpringPreset,
  Easing,
  AnimationPreset,
  UseAnimateConfigOptions,
  UseAnimateConfigReturn,
  Animation,
  AnimateConfig,
  OverlayAnimate,
  InteractiveAnimate,
  ExpandableAnimate,
  ToggleableAnimate,
  MenuAnimate,
  PresenceProps,
} from '../animation';

// Shadows
export { shadows, createShadow, createShadowPalette, shadowCSSVariables } from '../shadows';
export type { ShadowElevation, CreateShadowOptions, CreateShadowPaletteOptions, ShadowLayer, ShadowPresets } from '../shadows';

// Icons
export { Icon, IconProvider, useIconContext } from './Icon';
export type { IconComponentProps, IconProps, IconResolver, IconProviderProps } from './Icon';

// Accessibility
export { AccessibleIcon } from './AccessibleIcon';
export type { AccessibleIconProps } from './AccessibleIcon';

// Layout
export { AspectRatio } from './AspectRatio';
export type { AspectRatioProps } from './AspectRatio';

export { Separator } from './Separator';
export type { SeparatorProps } from './Separator';

export { ScrollArea } from './ScrollArea';
export type {
  ScrollAreaRootProps,
  ScrollAreaViewportProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaCornerProps,
} from './ScrollArea';

// Forms
export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { Form } from './Form';
export type {
  FormRootProps,
  FormFieldProps,
  FormLabelProps,
  FormControlProps,
  FormMessageProps,
  FormValidityStateProps,
  FormSubmitProps,
} from './Form';

export { Label } from './Label';
export type { LabelProps } from './Label';

export { RadioGroup } from './RadioGroup';
export type {
  RadioGroupRootProps,
  RadioGroupItemProps,
} from './RadioGroup';

export { Select } from './Select';
export type {
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectPortalProps,
  SelectContentProps,
  SelectViewportProps,
  SelectItemProps,
  SelectItemTextProps,
  SelectItemIndicatorProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectSeparatorProps,
} from './Select';

export { Slider } from './Slider';
export type {
  SliderRootProps,
  SliderTrackProps,
  SliderRangeProps,
  SliderThumbProps,
} from './Slider';

export { Switch } from './Switch';
export type { SwitchRootProps, SwitchThumbProps } from './Switch';

// Navigation
export { NavigationMenu } from './NavigationMenu';
export type {
  NavigationMenuRootProps,
  NavigationMenuSubProps,
  NavigationMenuListProps,
  NavigationMenuItemProps,
  NavigationMenuTriggerProps,
  NavigationMenuContentProps,
  NavigationMenuLinkProps,
  NavigationMenuIndicatorProps,
  NavigationMenuViewportProps,
} from './NavigationMenu';

export { Menubar } from './Menubar';
export type {
  MenubarRootProps,
  MenubarMenuProps,
  MenubarTriggerProps,
  MenubarPortalProps,
  MenubarContentProps,
  MenubarArrowProps,
  MenubarItemProps,
  MenubarGroupProps,
  MenubarLabelProps,
  MenubarCheckboxItemProps,
  MenubarRadioGroupProps,
  MenubarRadioItemProps,
  MenubarItemIndicatorProps,
  MenubarSeparatorProps,
  MenubarSubProps,
  MenubarSubTriggerProps,
  MenubarSubContentProps,
} from './Menubar';

export { Tabs } from './Tabs';
export type {
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from './Tabs';

// Overlays
export { AlertDialog } from './AlertDialog';
export type {
  AlertDialogRootProps,
  AlertDialogTriggerProps,
  AlertDialogPortalProps,
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
  AlertDialogCancelProps,
  AlertDialogActionProps,
} from './AlertDialog';

export { ContextMenu } from './ContextMenu';
export type {
  ContextMenuRootProps,
  ContextMenuTriggerProps,
  ContextMenuPortalProps,
  ContextMenuContentProps,
  ContextMenuArrowProps,
  ContextMenuItemProps,
  ContextMenuGroupProps,
  ContextMenuLabelProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuItemIndicatorProps,
  ContextMenuSeparatorProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuSubContentProps,
} from './ContextMenu';

export { Dialog } from './Dialog';
export type {
  DialogRootProps,
  DialogTriggerProps,
  DialogPortalProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
} from './Dialog';

export { DropdownMenu } from './DropdownMenu';
export type {
  DropdownMenuRootProps,
  DropdownMenuTriggerProps,
  DropdownMenuPortalProps,
  DropdownMenuContentProps,
  DropdownMenuArrowProps,
  DropdownMenuItemProps,
  DropdownMenuGroupProps,
  DropdownMenuLabelProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuItemIndicatorProps,
  DropdownMenuSeparatorProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
} from './DropdownMenu';

export { HoverCard } from './HoverCard';
export type {
  HoverCardRootProps,
  HoverCardTriggerProps,
  HoverCardPortalProps,
  HoverCardContentProps,
  HoverCardArrowProps,
} from './HoverCard';

export { Popover } from './Popover';
export type {
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverAnchorProps,
  PopoverPortalProps,
  PopoverContentProps,
  PopoverArrowProps,
  PopoverCloseProps,
} from './Popover';

export { Toast } from './Toast';
export type {
  ToastProviderProps,
  ToastViewportProps,
  ToastRootProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastActionProps,
  ToastCloseProps,
} from './Toast';

export { Tooltip } from './Tooltip';
export type {
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipPortalProps,
  TooltipContentProps,
  TooltipArrowProps,
} from './Tooltip';

// Disclosure
export { Accordion } from './Accordion';
export type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from './Accordion';

export { Collapsible } from './Collapsible';
export type {
  CollapsibleRootProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
} from './Collapsible';

export { Dock } from './Dock';
export type {
  DockRootProps,
  DockGroupProps,
  DockItemProps,
} from './Dock';

export { Sidebar } from './Sidebar';
export type {
  SidebarRootProps,
  SidebarHeaderProps,
  SidebarContentProps,
  SidebarItemProps,
  SidebarToggleProps,
  SidebarFooterProps,
} from './Sidebar';

// Data Display
export { Avatar } from './Avatar';
export type {
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
} from './Avatar';

export { Progress } from './Progress';
export type { ProgressRootProps, ProgressIndicatorProps } from './Progress';

// Actions
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { Toggle } from './Toggle';
export type { ToggleProps } from './Toggle';

export { ToggleGroup } from './ToggleGroup';
export type { ToggleGroupRootProps, ToggleGroupItemProps } from './ToggleGroup';

export { Toolbar } from './Toolbar';
export type {
  ToolbarRootProps,
  ToolbarButtonProps,
  ToolbarSeparatorProps,
  ToolbarLinkProps,
  ToolbarToggleGroupProps,
  ToolbarToggleItemProps,
} from './Toolbar';

// Utilities
export { Portal } from './Portal';
export type { PortalProps } from './Portal';

export { Slot, Slottable } from './Slot';
export type { SlotProps, SlottableProps } from './Slot';

export { VisuallyHidden } from './VisuallyHidden';
export type { VisuallyHiddenProps } from './VisuallyHidden';
