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

export { useInputRange } from './components/form/InputRange/useInputRange';
export type {
  UseInputRangeOptions,
  UseInputRangeReturn,
} from './components/form/InputRange/useInputRange';

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
  ElementAnimate,
  ContentAnimate,
  IndicatorAnimate,
  LayerAnimate,
  PopupAnimate,
  PopupItemAnimate,
  ListAnimate,
  ListItemAnimate,
  // Deprecated aliases
  InteractiveAnimate,
  ExpandableAnimate,
  ToggleableAnimate,
  OverlayAnimate,
  MenuAnimate,
  MenuItemAnimate,
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
export { Icon, IconProvider, useIconContext, useResolvedIcon } from './components/core/Icon';
export type { IconComponentProps, IconProps, IconResolver, IconProviderProps } from './components/core/Icon';

// Components
export { Badge } from './components/misc/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/misc/Badge';

export { EmptyState } from './components/loading/EmptyState';
export type { EmptyStateProps, EmptyStateSize } from './components/loading/EmptyState';

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

export { Collapsible } from './components/panel/Collapsible';
export type {
  CollapsibleRootProps,
  CollapsibleTriggerProps,
  CollapsibleIconProps,
  CollapsibleContentProps,
} from './components/panel/Collapsible';

export { useCollapsible } from './components/panel/Collapsible';
export type {
  UseCollapsibleOptions,
  UseCollapsibleReturn,
} from './components/panel/Collapsible';

export { Tabs } from './components/panel/Tabs';
export type {
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from './components/panel/Tabs';

export { Divider } from './components/panel/Divider';
export type { DividerProps, DividerType, DividerAlign } from './components/panel/Divider';

export { Card } from './components/panel/Card';
export type {
  CardVariant,
  CardRootProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardBodyProps,
  CardFooterProps,
  CardFooterStartProps,
  CardFooterEndProps,
} from './components/panel/Card';

export { Sidebar } from './components/panel/Sidebar';
export type {
  SidebarProviderProps,
  SidebarRootProps,
  SidebarHeaderProps,
  SidebarContentProps,
  SidebarFooterProps,
  SidebarGroupProps,
  SidebarGroupLabelProps,
  SidebarItemProps,
  SidebarTriggerProps,
  SidebarRailProps,
  SidebarOverlayProps,
} from './components/panel/Sidebar';

export { useSidebar, useSidebarContext } from './components/panel/Sidebar';
export type { UseSidebarOptions, UseSidebarReturn } from './components/panel/Sidebar';

export { Splitter } from './components/panel/Splitter';
export type { SplitterRootProps, SplitterPanelProps } from './components/panel/Splitter';

export { Alert } from './components/core/Alert';
export type { AlertProps, AlertVariant } from './components/core/Alert';

export { Dialog } from './components/overlay/Dialog';
export type {
  DialogSize,
  DialogRootProps,
  DialogTriggerProps,
  DialogPortalProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogFooterStartProps,
  DialogFooterEndProps,
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

export { Popover } from './components/overlay/Popover';
export type {
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverAnchorProps,
  PopoverPortalProps,
  PopoverContentProps,
  PopoverArrowProps,
  PopoverCloseProps,
} from './components/overlay/Popover';

export { Text } from './components/core/Text';
export type { TextProps, TextSize, TextWeight, TextColor, TextAlign, TextAs } from './components/core/Text';

export { Heading } from './components/core/Heading';
export type {
  HeadingProps,
  HeadingLevel,
  HeadingSize,
  HeadingWeight,
  HeadingColor,
  HeadingTracking,
  HeadingAlign,
} from './components/core/Heading';

export { Link } from './components/core/Link';
export type { LinkProps, LinkVariant, LinkUnderline, LinkSize } from './components/core/Link';

export { Code } from './components/core/Code';
export type { CodeProps, CodeVariant, CodeSize } from './components/core/Code';

export { Prose } from './components/core/Prose';
export type { ProseProps, ProseSize } from './components/core/Prose';

export { Tooltip } from './components/core/Tooltip';
export type {
  TooltipSimpleProps,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipPortalProps,
  TooltipContentProps,
  TooltipArrowProps,
} from './components/core/Tooltip';

export { InputRange } from './components/form/InputRange';
export type { InputRangeProps, InputRangeSize } from './components/form/InputRange';

export { ToggleButton } from './components/toolbar/ToggleButton';
export type { ToggleButtonProps } from './components/toolbar/ToggleButton';

export { ToggleGroup } from './components/toolbar/ToggleGroup';
export type { ToggleGroupRootProps, ToggleGroupItemProps } from './components/toolbar/ToggleGroup';

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

export { Textarea } from './components/form/Textarea';
export type { TextareaProps, TextareaVariant, TextareaSize } from './components/form/Textarea';

export { TimeField } from './components/form/TimeField';
export type {
  TimeFieldRootProps,
  TimeFieldSegmentProps,
  TimeFieldSeparatorProps,
  TimeFieldPeriodProps,
  TimeFieldDropdownProps,
  TimeFieldDropdownColumnProps,
} from './components/form/TimeField';

export { useTimeField } from './components/form/TimeField';
export type {
  UseTimeFieldOptions,
  UseTimeFieldReturn,
  SegmentType,
  SegmentInfo,
  TimeFieldGranularity,
} from './components/form/TimeField';

export { ProgressBar } from './components/loading/ProgressBar';
export type { ProgressBarProps } from './components/loading/ProgressBar';

export { Skeleton } from './components/loading/Skeleton';
export type {
  SkeletonRootProps,
  SkeletonCircleProps,
  SkeletonRectangleProps,
  SkeletonRoundedProps,
  SkeletonTextProps,
} from './components/loading/Skeleton';

export { Spinner } from './components/loading/Spinner';
export type { SpinnerProps, SpinnerSize } from './components/loading/Spinner';

export { Toast, toast } from './components/overlay/Toast';
export type {
  ToastViewportProps,
  ToastVariant,
  ToastPosition,
  ToastState,
  ToastOptions,
} from './components/overlay/Toast';

export { ScrollArea } from './components/panel/ScrollArea';
export type {
  ScrollAreaRootProps,
  ScrollAreaHeaderProps,
  ScrollAreaContentProps,
  ScrollAreaFooterProps,
} from './components/panel/ScrollArea';

// Calendar
export { Calendar } from './components/calendar/Calendar';
export type {
  CalendarRootProps,
  CalendarNavProps,
  CalendarGridProps,
} from './components/calendar/Calendar';

export { useCalendar } from './components/calendar/Calendar';
export type {
  UseCalendarOptions,
  UseCalendarSingleOptions,
  UseCalendarRangeOptions,
  UseCalendarMultipleOptions,
  UseCalendarReturn,
} from './components/calendar/Calendar';

// Calendar shared types
export type {
  CalendarEvent,
  DateRange,
  CalendarConstraints,
  SelectionMode,
  DayState,
  DayCellData,
  RenderDayCell,
  RenderEvent,
  CalendarViewMode,
} from './components/calendar/_shared/types';

// DatePicker
export { DatePicker } from './components/form/DatePicker';
export type {
  DatePickerRootProps,
  DatePickerTriggerProps,
  DatePickerInputProps,
  DatePickerIconProps,
  DatePickerPortalProps,
  DatePickerContentProps,
} from './components/form/DatePicker';

export { useDatePicker } from './components/form/DatePicker';
export type {
  UseDatePickerOptions,
  UseDatePickerReturn,
} from './components/form/DatePicker';

// Image
export { Image } from './components/media/Image';
export type { ImageProps, ImageFit, ImageRadius } from './components/media/Image';

export { ImageGroup } from './components/media/ImageGroup';
export type { ImageGroupProps, ImageGroupGap } from './components/media/ImageGroup';

// Breadcrumb
export { Breadcrumb } from './components/nav/Breadcrumb';
export type {
  BreadcrumbRootProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps,
  BreadcrumbSize,
} from './components/nav/Breadcrumb';

// Table
export { Table } from './components/data/Table';
export type {
  TableVariant,
  TableSize,
  TableRootProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableCaptionProps,
} from './components/data/Table';

// CalendarView
export { CalendarView } from './components/calendar/CalendarView';
export type {
  CalendarViewRootProps,
  CalendarViewHeaderProps,
  CalendarViewNavProps,
  CalendarViewTitleProps,
  CalendarViewTodayProps,
  CalendarViewSwitcherProps,
  CalendarViewBodyProps,
} from './components/calendar/CalendarView';

export { useCalendarView } from './components/calendar/CalendarView';
export type {
  UseCalendarViewOptions,
  UseCalendarViewReturn,
} from './components/calendar/CalendarView';

// Pagination
export { Pagination } from './components/navigation/Pagination';
export type {
  PaginationSize,
  PaginationVariant,
  PaginationRootProps,
  PaginationPrevTriggerProps,
  PaginationNextTriggerProps,
  PaginationItemsProps,
} from './components/navigation/Pagination';

export { usePagination } from './components/navigation/Pagination';
export type {
  UsePaginationOptions,
  UsePaginationReturn,
} from './components/navigation/Pagination';
