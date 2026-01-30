// Move - Animated UI Component Library
// Fresh architecture with withMoveComponent factory

// Import system CSS (lighting, shadows)
import './styles/system.css';

// Core factory
export { withMoveComponent, MoveProvider, useMoveContext } from './engine';
export { mergeSlotProps, createCx, createPtm } from './engine';
export type {
  SlotProps,
  PassThrough,
  GlobalPassThrough,
  CxFn,
  PtmFn,
  SetupContext,
  SetupReturn,
  MoveComponentOptions,
  MoveProviderProps,
} from './engine';

// Ref utilities
export { useMergedRef } from './engine';

// Headless utilities (from core)
export { useControlledState } from './engine';
export type { UseControlledStateOptions } from './engine';

// Headless hooks (colocated with components)
export { useCheckbox } from './components/form/Checkbox/useCheckbox';
export type {
  UseCheckboxOptions,
  UseCheckboxReturn,
} from './components/form/Checkbox/useCheckbox';

export { useAccordion } from './components/panel/Accordion/useAccordion';
export type {
  UseAccordionOptions,
  UseAccordionReturn,
} from './components/panel/Accordion/useAccordion';

// Animation system
export {
  springs,
  easings,
  getEase,
  isSpring,
  DEFAULT_DURATION,
  prefersReducedMotion,
  resolveEasing,
  toAnimeParams,
  toInstantParams,
  mergeAnimateConfig,
  getInitialStyles,
  useAnimateConfig,
  useInteractiveAnimate,
  useToggleAnimation,
  useExpandAnimation,
  Presence,
  usePresence,
  useIsPresent,
  defaultAnimations,
} from './animation';
export type {
  SpringParams,
  SpringPreset,
  Easing,
  AnimationPreset,
  UseAnimateConfigOptions,
  UseAnimateConfigReturn,
  UseToggleAnimationOptions,
  UseToggleAnimationReturn,
  UseExpandAnimationOptions,
  UseExpandAnimationReturn,
  PresenceProps,
  PresenceContextValue,
  AnimatableValue,
  Animation,
  AnimationProperties,
  AnimateConfig,
  StaggerConfig,
  InteractiveAnimate,
  ExpandableAnimate,
  ToggleableAnimate,
  OverlayAnimate,
  MenuAnimate,
  MenuItemAnimate,
  ListAnimate,
  ListItemAnimate,
} from './animation';

// Themes
export { darkTheme, lightTheme } from './styles/themes';
export type { Theme, ThemeTokens, ThemeAnimation } from './styles/themes';

// ThemeProvider
export { ThemeProvider, useTheme } from './components/ThemeProvider';
export type { ThemeProviderProps, ThemeContextValue } from './components/ThemeProvider';

// Visual systems (lighting, shadows)
export { LightProvider, useLighting } from './styles/visual';
export type { LightProviderProps } from './styles/visual';

export { shadows, createShadow, createShadowPalette, shadowCSSVariables, elevationValues } from './styles/visual';
export type { ElevationLevel, ShadowElevation, CreateShadowOptions } from './styles/visual';

// Icons
export { Icon, IconProvider, useIconContext } from './components/core/Icon';
export type { IconComponentProps, IconProps, IconResolver, IconProviderProps } from './components/core/Icon';

// Components
export { Badge } from './components/misc/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/misc/Badge';

export { Avatar } from './components/core/Avatar';
export type {
  AvatarGroupProps,
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarSize,
} from './components/core/Avatar';

export { Button } from './components/core/Button';
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonGroupProps } from './components/core/Button';

export { Checkbox } from './components/form/Checkbox';
export type { CheckboxProps, CheckboxGroupProps } from './components/form/Checkbox';

export { Accordion } from './components/panel/Accordion';
export type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionContentProps,
  AccordionAnimateConfig,
} from './components/panel/Accordion';

export { Tabs } from './components/panel/Tabs';
export type {
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from './components/panel/Tabs';

export { Dialog } from './components/overlay/Dialog';
export type {
  DialogRootProps,
  DialogTriggerProps,
  DialogPortalProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
} from './components/overlay/Dialog';

export { Dropdown } from './components/overlay/Dropdown';
export type {
  DropdownRootProps,
  DropdownTriggerProps,
  DropdownPortalProps,
  DropdownContentProps,
  DropdownArrowProps,
  DropdownItemProps,
  DropdownGroupProps,
  DropdownLabelProps,
  DropdownCheckboxItemProps,
  DropdownRadioGroupProps,
  DropdownRadioItemProps,
  DropdownItemIndicatorProps,
  DropdownSeparatorProps,
  DropdownSubProps,
  DropdownSubTriggerProps,
  DropdownSubContentProps,
} from './components/overlay/Dropdown';

export { Tooltip } from './components/core/Tooltip';
export type {
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipPortalProps,
  TooltipContentProps,
  TooltipArrowProps,
} from './components/core/Tooltip';

export { ToggleButton } from './components/toolbar/ToggleButton';
export type { ToggleButtonProps } from './components/toolbar/ToggleButton';

export { Switch } from './components/form/Switch';
export type { SwitchRootProps, SwitchThumbProps } from './components/form/Switch';

export { RadioGroup } from './components/form/RadioGroup';
export type { RadioGroupRootProps, RadioGroupItemProps } from './components/form/RadioGroup';

export { Label } from './components/form/Label';
export type { LabelProps } from './components/form/Label';

export { FormField } from './components/form/FormField';
export type {
  FormFieldRootProps,
  FormFieldLabelProps,
  FormFieldFieldProps,
  FormFieldDescriptionProps,
} from './components/form/FormField';

export { Select } from './components/form/Select';
export type {
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectIconProps,
  SelectPortalProps,
  SelectContentProps,
  SelectViewportProps,
  SelectItemProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectSeparatorProps,
} from './components/form/Select';

export { InputText } from './components/form/InputText';
export type { InputTextProps, InputTextVariant, InputTextSize } from './components/form/InputText';

export { Password } from './components/form/Password';
export type { PasswordProps, PasswordVariant, PasswordSize } from './components/form/Password';

export { ProgressBar } from './components/loading/ProgressBar';
export type { ProgressBarProps } from './components/loading/ProgressBar';

export { Spinner } from './components/loading/Spinner';
export type { SpinnerProps, SpinnerSize } from './components/loading/Spinner';
