// Move - Animated UI Component Library
// Fresh architecture with withMoveComponent factory

// Import system CSS (lighting, shadows)
import './styles/system.css';

// Core factory
export { withMoveComponent, MoveProvider, useMoveContext } from './engine';
export { mergeSlotProps, createCx, createSp } from './engine';
export type {
  SlotProps,
  SlotPropsMap,
  GlobalSlotProps,
  CxFn,
  SpFn,
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

export { useNumberInput } from './components/form/NumberInput/useNumberInput';
export type {
  UseNumberInputOptions,
  UseNumberInputReturn,
} from './components/form/NumberInput/useNumberInput';

export { useColorPicker } from './components/form/ColorPicker/useColorPicker';
export type {
  UseColorPickerOptions,
  UseColorPickerReturn,
} from './components/form/ColorPicker/useColorPicker';
export type { ColorFormat, HsvColor } from './components/form/ColorPicker/colorUtils';

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

export { ChatBubble } from './components/misc/ChatBubble';
export type {
  ChatBubbleRootProps,
  ChatBubbleAvatarProps,
  ChatBubbleAvatarSize,
  ChatBubbleContainerProps,
  ChatBubbleVariant,
  ChatBubbleHeaderProps,
  ChatBubbleContentProps,
  ChatBubbleFooterProps,
} from './components/misc/ChatBubble';

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
  AccordionSize,
  AccordionVariant,
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
  TabsSize,
  TabsVariant,
} from './components/panel/Tabs';

export { Divider } from './components/panel/Divider';
export type { DividerProps, DividerType, DividerAlign, DividerSize } from './components/panel/Divider';

export { Card } from './components/panel/Card';
export type {
  CardVariant,
  CardSize,
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
export type { AlertProps, AlertVariant, AlertSize } from './components/core/Alert';

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

export { Code, CodeHighlighterProvider, useCodeHighlighter } from './components/core/Code';
export type { CodeProps, CodeVariant, CodeSize, CodeHighlighterFn, CodeHighlighterProviderProps, HighlightResult } from './components/core/Code';

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

export { Stack } from './components/core/Stack';
export type { StackProps, StackDirection, StackGap, StackAlign, StackJustify } from './components/core/Stack';

export { Grid } from './components/core/Grid';
export type { GridProps, GridCellProps, GridGap } from './components/core/Grid';

export { Align } from './components/core/Align';
export type { AlignProps, AlignSectionProps, AlignGap, AlignVertical } from './components/core/Align';

export { InputRange } from './components/form/InputRange';
export type { InputRangeProps, InputRangeSize } from './components/form/InputRange';

export { NumberInput } from './components/form/NumberInput';
export type { NumberInputProps, NumberInputVariant, NumberInputSize, NumberInputSlots } from './components/form/NumberInput';

export { ColorPicker } from './components/form/ColorPicker';
export type { ColorPickerProps, ColorPickerSize, ColorPickerSlots } from './components/form/ColorPicker';

export { ColorInput } from './components/form/ColorInput';
export type { ColorInputProps, ColorInputVariant, ColorInputSize, ColorInputSlots } from './components/form/ColorInput';

export { ToggleButton } from './components/toolbar/ToggleButton';
export type { ToggleButtonProps } from './components/toolbar/ToggleButton';

export { ToggleGroup } from './components/toolbar/ToggleGroup';
export type { ToggleGroupRootProps, ToggleGroupItemProps } from './components/toolbar/ToggleGroup';

export { Switch } from './components/form/Switch';
export type { SwitchRootProps, SwitchThumbProps, SwitchSize } from './components/form/Switch';

export { RadioGroup } from './components/form/RadioGroup';
export type { RadioGroupRootProps, RadioGroupItemProps } from './components/form/RadioGroup';

export { Label } from './components/form/Label';
export type { LabelProps, LabelSize } from './components/form/Label';

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
  SelectTriggerSize,
  SelectTriggerVariant,
} from './components/form/Select';

export { Autocomplete } from './components/form/Autocomplete';
export type {
  AutocompleteRootProps,
  AutocompleteTriggerProps,
  AutocompleteTriggerSize,
  AutocompleteTriggerVariant,
  AutocompleteInputProps,
  AutocompleteTagListProps,
  AutocompleteTagProps,
  AutocompleteIconProps,
  AutocompleteClearTriggerProps,
  AutocompletePortalProps,
  AutocompleteContentProps,
  AutocompleteItemProps,
  AutocompleteItemIndicatorProps,
  AutocompleteGroupProps,
  AutocompleteGroupLabelProps,
  AutocompleteEmptyProps,
  AutocompleteLoadingProps,
  AutocompleteSeparatorProps,
} from './components/form/Autocomplete';

export { useAutocomplete } from './components/form/Autocomplete';
export type {
  UseAutocompleteOptions,
  UseAutocompleteReturn,
} from './components/form/Autocomplete';

export { InputText } from './components/form/InputText';
export type { InputTextProps, InputTextVariant, InputTextSize } from './components/form/InputText';

export { Password } from './components/form/Password';
export type { PasswordProps, PasswordVariant, PasswordSize } from './components/form/Password';

export { PinInput } from './components/form/PinInput';
export type { PinInputProps, PinInputSize } from './components/form/PinInput';
export { usePinInput } from './components/form/PinInput/usePinInput';
export type { UsePinInputOptions, UsePinInputReturn } from './components/form/PinInput/usePinInput';

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

export { FileUpload } from './components/form/FileUpload';
export type {
  FileUploadRootProps,
  FileUploadDropzoneProps,
  FileUploadTriggerProps,
  FileUploadItemGroupProps,
  FileUploadItemProps,
  FileUploadItemPreviewProps,
  FileUploadItemNameProps,
  FileUploadItemSizeProps,
  FileUploadItemDeleteProps,
  FileUploadClearTriggerProps,

  FileUploadItemProgressProps,
  FileUploadTotalProgressProps,
  FileUploadUploadTriggerProps,
  FileUploadSize,
  FileUploadVariant,
} from './components/form/FileUpload';

export { useFileUpload, formatFileSize } from './components/form/FileUpload';
export type {
  UseFileUploadOptions,
  UseFileUploadReturn,
  FileRejection,
  FileError,
} from './components/form/FileUpload';

export { httpAdapter, createAdapter } from './components/form/FileUpload';
export type {
  FileUploadAdapter,
  FileUploadAdapterOptions,
  FileUploadAdapterResult,
  FileUploadEntry,
  FileUploadStatus,
  UploadProgress,
  UploadAggregateState,
  HttpAdapterOptions,
} from './components/form/FileUpload';

export { RichTextEditor } from './components/form/RichTextEditor';
export type {
  RichTextEditorVariant,
  RichTextEditorSize,
  RichTextEditorRootProps,
  RichTextEditorToolbarProps,
  RichTextEditorControlGroupProps,
  RichTextEditorControlProps,
  RichTextEditorSeparatorProps,
  RichTextEditorContentProps,
} from './components/form/RichTextEditor';

export { ProgressBar } from './components/loading/ProgressBar';
export type { ProgressBarProps, ProgressBarSize, ProgressBarVariant } from './components/loading/ProgressBar';

export { Skeleton } from './components/loading/Skeleton';
export type {
  SkeletonAnimation,
  SkeletonRootProps,
  SkeletonCircleProps,
  SkeletonRectangleProps,
  SkeletonRoundedProps,
  SkeletonTextProps,
} from './components/loading/Skeleton';

export { Spinner } from './components/loading/Spinner';
export type { SpinnerProps, SpinnerSize, SpinnerVariant } from './components/loading/Spinner';

export { Loader } from './components/loading/Loader';
export type { LoaderProps, LoaderVariant, LoaderColor, LoaderSize } from './components/loading/Loader';

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

// Carousel
export { Carousel } from './components/media/Carousel';
export type {
  CarouselRootProps,
  CarouselViewportProps,
  CarouselSlideProps,
  CarouselPrevTriggerProps,
  CarouselNextTriggerProps,
  CarouselIndicatorGroupProps,
  CarouselIndicatorProps,
} from './components/media/Carousel';

export { useCarousel } from './components/media/Carousel';
export type {
  UseCarouselOptions,
  UseCarouselReturn,
  CarouselOrientation,
  CarouselAlign,
} from './components/media/Carousel';

// Image
export { Image } from './components/media/Image';
export type { ImageProps, ImageSource, ImageFit, ImageRadius, ImagePosition } from './components/media/Image';

export { ImageGroup } from './components/media/ImageGroup';
export type { ImageGroupProps, ImageGroupGap, ImageGroupRadius } from './components/media/ImageGroup';

// Media shared types
export type { SubtitleTrack, QualityOption, AudioTrack } from './components/media/_shared/types';

// VideoPlayer
export { VideoPlayer } from './components/media/VideoPlayer';
export type { VideoPlayerProps, VideoPlayerProvider, VideoPlayerRadius } from './components/media/VideoPlayer';

export { useVideoPlayer } from './components/media/VideoPlayer';
export type { UseVideoPlayerOptions, UseVideoPlayerReturn } from './components/media/VideoPlayer';

export { parseVTT } from './components/media/VideoPlayer';
export type { VTTCue } from './components/media/VideoPlayer';

// AudioPlayer
export { AudioPlayer } from './components/media/AudioPlayer';
export type { AudioPlayerProps, AudioPlayerRadius, AudioPlayerSize } from './components/media/AudioPlayer';

export { useAudioPlayer } from './components/media/AudioPlayer';
export type { UseAudioPlayerOptions, UseAudioPlayerReturn } from './components/media/AudioPlayer';

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

// Timeline
export { Timeline } from './components/data/Timeline';
export type {
  TimelineRootProps,
  TimelineItemProps,
  TimelineItemSlots,
  TimelineSize,
  TimelineAlign,
  TimelineColor,
  TimelineLineVariant,
} from './components/data/Timeline';

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

// Stepper
export { Stepper } from './components/navigation/Stepper';
export type {
  StepperRootProps,
  StepperStepProps,
  StepperIndicatorProps,
  StepperTitleProps,
  StepperDescriptionProps,
  StepperSeparatorProps,
  StepperCompletedProps,
  StepperSize,
  StepperOrientation,
  StepStatus,
} from './components/navigation/Stepper';

export { useStepper } from './components/navigation/Stepper';
export type {
  UseStepperOptions,
  UseStepperReturn,
} from './components/navigation/Stepper';
