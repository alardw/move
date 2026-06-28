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

// Animation system
export {
  springs,
  easings,
  getEase,
  isSpring,
  DEFAULT_DURATION,
  prefersReducedMotion,
  mergeAnimateConfig,
  toEndValues,
  getFromStyles,
  // Pre-computed spring constants
  snappy,
  quick,
  poppy,
  gentle,
  slow,
  lazy,
  jelly,
  stiff,
  // Core animation functions
  moveAnimate,
  animateDimension,
  animatePosition,
  staggerAnimate,
  // Orchestration
  useAnimations,
  resolveAnimationsConfig,
  // Presets
  fadeIn,
  fadeOut,
  popIn,
  popOut,
  scaleUp,
  scaleDown,
  scaleIn,
  interactive,
  revealHeight,
  staggerItems,
  toggleIndicator,
  expandContent,
  PRESET_REGISTRY,
  // Position tracking
  usePositionTracker,
  useSlidingIndicator,
  // Container resize / morph
  useMorphHeight,
  // Presence system
  Presence,
  usePresence,
  useIsPresent,
} from './animation';
export type {
  SpringParams,
  SpringPreset,
  Easing,
  AnimationPreset,
  PresenceProps,
  PresenceContextValue,
  Animation,
  StaggerConfig,
  JSAnimation,
  // Trigger-sequence types
  AnimationState,
  AnimationStep,
  SequenceItem,
  AnimationTrigger,
} from './animation';

// Themes
export { darkTheme, lightTheme } from './styles/themes';
export type { Theme, ThemeTokens, ThemeAnimation } from './styles/themes';

// ThemeProvider
export { ThemeProvider, useTheme } from './infrastructure/Theme';
export type { ThemeProviderProps, ThemeContextValue } from './infrastructure/Theme';

// MoveRoot
export { MoveRoot } from './infrastructure/MoveRoot';
export type { MoveRootProps } from './infrastructure/MoveRoot/MoveRoot';

// Surface context (background alternation)
export { useSurface, useSurfaceFlip, SurfaceProvider } from './infrastructure/Surface';
export type { SurfaceTone } from './infrastructure/Surface';

// Layer context (z-index awareness for portaled components inside overlays)
export { useLayer, LayerProvider } from './infrastructure/Layer';

// Visual systems (shadows, surfaces)
export { shadows, createShadow, createShadowPalette, shadowCSSVariables, createThemeShadows } from './styles/visual';
export type { ShadowElevation, CreateShadowOptions, SurfaceLevel, ThemeShadowConfig, ThemeShadowTokens } from './styles/visual';

// Icons
export { Icon, IconProvider, useIconContext, useResolvedIcon } from './infrastructure/Icon';
export type { IconComponentProps, IconProps, IconResolver, IconProviderProps } from './infrastructure/Icon';

// Components — generated via the /component-generate-source pipeline
export { Alert } from './components/feedback/Alert';
export type { AlertProps, AlertVariant, AlertSize, AlertLabels } from './components/feedback/Alert';

export { Align } from './components/layout/Align';
export type { AlignProps, AlignSectionProps, AlignGap, AlignVertical, AlignPadding, AlignFlex } from './components/layout/Align';

export { Avatar } from './components/data-display/Avatar';
export type { AvatarRootProps, AvatarImageProps, AvatarFallbackProps, AvatarGroupProps, AvatarSize } from './components/data-display/Avatar';

export { Badge } from './components/data-display/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/data-display/Badge';

export { Button } from './components/actions/Button';
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonGroupProps } from './components/actions/Button';

export { ChatBubble } from './components/data-display/ChatBubble';
export type { ChatBubbleRootProps, ChatBubbleAvatarProps, ChatBubbleAvatarSize, ChatBubbleContainerProps, ChatBubbleVariant, ChatBubbleHeaderProps, ChatBubbleContentProps, ChatBubbleFooterProps, ChatBubblePlacement } from './components/data-display/ChatBubble';

export { Code } from './components/typography/Code';
export type { CodeProps, CodeVariant, CodeSize } from './components/typography/Code';
export { CodeHighlighterProvider, useCodeHighlighter } from './components/typography/Code';
export type { CodeHighlighterFn, CodeHighlighterProviderProps, HighlightResult } from './components/typography/Code';

export { Grid } from './components/layout/Grid';
export type { GridProps, GridCellProps, GridGap, GridPadding } from './components/layout/Grid';
export { LayoutGroup } from './components/layout/LayoutGroup';
export type { LayoutGroupProps, LayoutGroupAs, LayoutGroupAnim } from './components/layout/LayoutGroup';

export { AnimatedText } from './components/typography/AnimatedText';
export type { AnimatedTextProps, AnimatedTextAs, AnimatedTextSize, AnimatedTextWeight, AnimatedTextBy, AnimatedTextEffect, AnimatedTextTrigger } from './components/typography/AnimatedText';

export { Heading } from './components/typography/Heading';
export type { HeadingProps, HeadingLevel, HeadingSize, HeadingWeight, HeadingColor, HeadingTracking, HeadingAlign } from './components/typography/Heading';

export { Link } from './components/navigation/Link';
export type { LinkProps, LinkVariant, LinkUnderline, LinkSize } from './components/navigation/Link';

export { Prose } from './components/typography/Prose';
export type { ProseProps, ProseSize } from './components/typography/Prose';

export { Stack } from './components/layout/Stack';
export type { StackProps, StackDirection, StackGap, StackAlign, StackJustify, StackPadding, StackFlex } from './components/layout/Stack';

export { Text } from './components/typography/Text';
export type { TextProps, TextSize, TextWeight, TextColor, TextAlign, TextAs } from './components/typography/Text';

export { Tooltip } from './components/overlays/Tooltip';
export type { TooltipSimpleProps, TooltipProviderProps, TooltipRootProps, TooltipTriggerProps, TooltipContentProps, TooltipArrowProps } from './components/overlays/Tooltip';

export { Calendar } from './components/date-time/Calendar';
export type { CalendarRootProps, CalendarNavProps, CalendarGridProps } from './components/date-time/Calendar';
export { useCalendar } from './components/date-time/Calendar';
export type { UseCalendarOptions, UseCalendarSingleOptions, UseCalendarRangeOptions, UseCalendarMultipleOptions, UseCalendarReturn } from './components/date-time/Calendar';

export { CalendarView } from './components/date-time/CalendarView';
export type { CalendarViewRootProps, CalendarViewHeaderProps, CalendarViewNavProps, CalendarViewTitleProps, CalendarViewTodayProps, CalendarViewViewSwitcherProps, CalendarViewBodyProps } from './components/date-time/CalendarView';
export { useCalendarView } from './components/date-time/CalendarView';
export type { UseCalendarViewOptions, UseCalendarViewReturn, CalendarViewLabels } from './components/date-time/CalendarView';

export { DatePicker } from './components/date-time/DatePicker';
export type { DatePickerRootProps, DatePickerTriggerProps, DatePickerInputProps, DatePickerIconProps, DatePickerContentProps, DatePickerSize, DatePickerLabels, DatePickerRangeLabels } from './components/date-time/DatePicker';
export { useDatePicker } from './components/date-time/DatePicker';
export type { UseDatePickerOptions, UseDatePickerReturn } from './components/date-time/DatePicker';

export { Card } from './components/layout/Card';
export type { CardVariant, CardSize, CardRootProps, CardHeaderProps, CardTitleProps, CardDescriptionProps, CardBodyProps, CardFooterProps, CardFooterStartProps, CardFooterEndProps } from './components/layout/Card';

export { Divider } from './components/layout/Divider';
export type { DividerProps, DividerSlots, DividerType, DividerAlign, DividerSize } from './components/layout/Divider';

export { EmptyState } from './components/feedback/EmptyState';
export type { EmptyStateProps, EmptyStateSize } from './components/feedback/EmptyState';

export { Skeleton } from './components/feedback/Skeleton';
export type { SkeletonAnimation, SkeletonRootProps, SkeletonCircleProps, SkeletonRectangleProps, SkeletonRoundedProps, SkeletonTextProps } from './components/feedback/Skeleton';

export { Spinner } from './components/feedback/Spinner';
export type { SpinnerProps, SpinnerSize, SpinnerVariant } from './components/feedback/Spinner';

export { Loader } from './components/feedback/Loader';
export type { LoaderProps, LoaderVariant, LoaderColor, LoaderSize } from './components/feedback/Loader';

export { ProgressBar } from './components/feedback/ProgressBar';
export type { ProgressBarProps, ProgressBarSize, ProgressBarVariant } from './components/feedback/ProgressBar';

export { InputText } from './components/forms/InputText';
export type { InputTextProps, InputTextVariant, InputTextSize } from './components/forms/InputText';

export { Label } from './components/forms/Label';
export type { LabelProps, LabelSize } from './components/forms/Label';

export { FormField } from './components/forms/FormField';
export type { FormFieldRootProps, FormFieldLabelProps, FormFieldFieldProps, FormFieldDescriptionProps } from './components/forms/FormField';

export { Switch } from './components/forms/Switch';
export type { SwitchRootProps, SwitchThumbProps, SwitchSize } from './components/forms/Switch';

export { Textarea } from './components/forms/Textarea';
export type { TextareaProps, TextareaVariant, TextareaSize } from './components/forms/Textarea';

export { Checkbox } from './components/forms/Checkbox';
export type { CheckboxProps, CheckboxGroupProps, CheckboxSize } from './components/forms/Checkbox';
export { useCheckbox } from './components/forms/Checkbox';
export type { UseCheckboxOptions, UseCheckboxReturn } from './components/forms/Checkbox';

export { RadioGroup } from './components/forms/RadioGroup';
export type { RadioGroupRootProps, RadioGroupItemProps, RadioGroupSize } from './components/forms/RadioGroup';

export { Password } from './components/forms/Password';
export type { PasswordProps, PasswordVariant, PasswordSize, PasswordLabels } from './components/forms/Password';

export { NumberInput } from './components/forms/NumberInput';
export type { NumberInputProps, NumberInputVariant, NumberInputSize } from './components/forms/NumberInput';
export { useNumberInput } from './components/forms/NumberInput';
export type { UseNumberInputOptions, UseNumberInputReturn } from './components/forms/NumberInput';

export { InputRange } from './components/forms/InputRange';
export type { InputRangeProps, InputRangeSlots, InputRangeSize } from './components/forms/InputRange';
export { useInputRange } from './components/forms/InputRange';
export type { UseInputRangeOptions, UseInputRangeReturn, InputRangeValue } from './components/forms/InputRange';

export { PinInput } from './components/forms/PinInput';
export type { PinInputProps, PinInputSize } from './components/forms/PinInput';
export { usePinInput } from './components/forms/PinInput';
export type { UsePinInputOptions, UsePinInputReturn } from './components/forms/PinInput';

export { Select } from './components/forms/Select';
export type { SelectRootProps, SelectTriggerProps, SelectTriggerSize, SelectTriggerVariant, SelectValueProps, SelectIconProps, SelectContentProps, SelectViewportProps, SelectItemProps, SelectGroupProps, SelectLabelProps, SelectSeparatorProps } from './components/forms/Select';

export { Autocomplete } from './components/forms/Autocomplete';
export type { AutocompleteRootProps, AutocompleteTriggerProps, AutocompleteTriggerSize, AutocompleteTriggerVariant, AutocompleteInputProps, AutocompleteTagListProps, AutocompleteTagProps, AutocompleteIconProps, AutocompleteClearTriggerProps, AutocompleteContentProps, AutocompleteItemProps, AutocompleteItemIndicatorProps, AutocompleteGroupProps, AutocompleteGroupLabelProps, AutocompleteEmptyProps, AutocompleteLoadingProps, AutocompleteSeparatorProps } from './components/forms/Autocomplete';
export { useAutocomplete } from './components/forms/Autocomplete';
export type { UseAutocompleteOptions, UseAutocompleteReturn, RegisteredItem } from './components/forms/Autocomplete';

export { ColorPicker } from './components/forms/ColorPicker';
export type { ColorPickerProps, ColorPickerSize, ColorPickerSlots } from './components/forms/ColorPicker';
export { useColorPicker } from './components/forms/ColorPicker';
export type { UseColorPickerOptions, UseColorPickerReturn } from './components/forms/ColorPicker';
export type { ColorFormat, BaseColorFormat, HsvColor, RgbColor, HslColor, ColorChannel } from './components/forms/ColorPicker';

export { ColorInput } from './components/forms/ColorInput';
export type { ColorInputProps, ColorInputVariant, ColorInputSize, ColorInputSlots } from './components/forms/ColorInput';

export { FileUpload } from './components/forms/FileUpload';
export type { FileUploadSize, FileUploadVariant, FileUploadRootProps, FileUploadDropzoneProps, FileUploadTriggerProps, FileUploadItemGroupProps, FileUploadItemProps, FileUploadItemPreviewProps, FileUploadItemNameProps, FileUploadItemSizeProps, FileUploadItemDeleteProps, FileUploadClearTriggerProps, FileUploadItemProgressProps, FileUploadTotalProgressProps, FileUploadItemStatusProps, FileUploadUploadTriggerProps } from './components/forms/FileUpload';
export { useFileUpload, formatFileSize } from './components/forms/FileUpload';
export type { FileError, FileRejection, UseFileUploadOptions, UseFileUploadReturn } from './components/forms/FileUpload';
export { useUploadManager } from './components/forms/FileUpload';
export type { UseUploadManagerReturn } from './components/forms/FileUpload';
export type { FileUploadStatus, UploadProgress, FileUploadAdapterResult, FileUploadEntry, FileUploadAdapterOptions, FileUploadAdapter, HttpAdapterOptions, UseUploadManagerOptions, UploadAggregateState } from './components/forms/FileUpload';

export { RichTextEditor } from './components/forms/RichTextEditor';
export type { RichTextEditorVariant, RichTextEditorSize, RichTextEditorRootProps, RichTextEditorToolbarProps, RichTextEditorControlGroupProps, RichTextEditorControlProps, RichTextEditorSeparatorProps, RichTextEditorContentProps } from './components/forms/RichTextEditor';

export { TimeField } from './components/date-time/TimeField';
export type { TimeFieldRootProps, TimeFieldSegmentProps, TimeFieldSeparatorProps, TimeFieldPeriodProps, TimeFieldDropdownProps, TimeFieldDropdownColumnProps, TimeFieldSize } from './components/date-time/TimeField';
export { useTimeField } from './components/date-time/TimeField';
export type { UseTimeFieldOptions, UseTimeFieldReturn, SegmentType, SegmentInfo, TimeFieldGranularity } from './components/date-time/TimeField';

export { Accordion } from './components/disclosure/Accordion';
export type { AccordionRootProps, AccordionItemProps, AccordionHeaderProps, AccordionTriggerProps, AccordionContentProps, AccordionSize, AccordionVariant, AccordionAnimateConfig } from './components/disclosure/Accordion';
export { useAccordion } from './components/disclosure/Accordion';
export type { UseAccordionOptions, UseAccordionReturn } from './components/disclosure/Accordion';

export { Collapsible } from './components/disclosure/Collapsible';
export type { CollapsibleRootProps, CollapsibleTriggerProps, CollapsibleIconProps, CollapsibleContentProps, CollapsibleAnimate } from './components/disclosure/Collapsible';
export { useCollapsible } from './components/disclosure/Collapsible';
export type { UseCollapsibleOptions, UseCollapsibleReturn } from './components/disclosure/Collapsible';

export { ScrollArea } from './components/layout/ScrollArea';
export type { ScrollAreaRootProps, ScrollAreaHeaderProps, ScrollAreaContentProps, ScrollAreaFooterProps } from './components/layout/ScrollArea';

export { Tabs } from './components/navigation/Tabs';
export type { TabsRootProps, TabsListProps, TabsTriggerProps, TabsContentProps, TabsSize, TabsVariant } from './components/navigation/Tabs';

export { Splitter } from './components/layout/Splitter';
export type { SplitterRootProps, SplitterPanelProps } from './components/layout/Splitter';

export { Sidebar } from './components/navigation/Sidebar';
export type { SidebarProviderProps, SidebarRootProps, SidebarOverlayProps, SidebarHeaderProps, SidebarContentProps, SidebarFooterProps, SidebarGroupProps, SidebarGroupLabelProps, SidebarItemProps, SidebarTriggerProps } from './components/navigation/Sidebar';
export { useSidebar, useSidebarContext } from './components/navigation/Sidebar';
export type { UseSidebarOptions, UseSidebarReturn } from './components/navigation/Sidebar';

export { Dialog } from './components/overlays/Dialog';

export { Drawer } from './components/overlays/Drawer';
export type { DrawerRootProps, DrawerTriggerProps, DrawerPortalProps, DrawerOverlayProps, DrawerContentProps, DrawerPosition, DrawerSize, DrawerHeaderProps, DrawerBodyProps, DrawerFooterProps, DrawerTitleProps, DrawerDescriptionProps, DrawerCloseProps, DrawerHandleProps } from './components/overlays/Drawer';
export type { DialogRootProps, DialogTriggerProps, DialogPortalProps, DialogOverlayProps, DialogContentProps, DialogSize, DialogHeaderProps, DialogBodyProps, DialogFooterProps, DialogFooterStartProps, DialogFooterEndProps, DialogTitleProps, DialogDescriptionProps, DialogCloseProps } from './components/overlays/Dialog';

export { Dropdown } from './components/overlays/Dropdown';
export type { DropdownRootProps, DropdownTriggerProps, DropdownContentProps, DropdownArrowProps, DropdownItemProps, DropdownGroupProps, DropdownLabelProps, DropdownCheckboxItemProps, DropdownRadioGroupProps, DropdownRadioItemProps, DropdownItemIndicatorProps, DropdownSeparatorProps, DropdownSubProps, DropdownSubTriggerProps, DropdownSubContentProps } from './components/overlays/Dropdown';

export { Popover } from './components/overlays/Popover';
export type { PopoverRootProps, PopoverTriggerProps, PopoverAnchorProps, PopoverContentProps, PopoverArrowProps, PopoverCloseProps } from './components/overlays/Popover';

export { Toast, toast } from './components/feedback/Toast';
export type { ToastViewportProps, ToastState, ToastPosition, ToastVariant, ToastOptions } from './components/feedback/Toast';

export { Table, useTableSelection } from './components/data-display/Table';
export type {
  TableVariant,
  TableSize,
  TableAlign,
  TableResponsive,
  TableRootProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableCaptionProps,
  TableGroupProps,
  TableGroupHeaderProps,
  UseTableSelectionOptions,
  UseTableSelectionReturn,
} from './components/data-display/Table';

export { Timeline } from './components/data-display/Timeline';
export type { TimelineSize, TimelineAlign, TimelineColor, TimelineLineVariant, TimelineRootProps, TimelineItemSlots, TimelineItemProps } from './components/data-display/Timeline';

export { List } from './components/data-display/List';
export type { ListSize, ListDensity, ListDescriptionLines, ListItemElement, ListRootProps, ListItemProps, ListLeadingProps, ListContentProps, ListTitleProps, ListDescriptionProps, ListTrailingProps } from './components/data-display/List';

export { ToggleButton } from './components/actions/ToggleButton';
export type { ToggleButtonProps } from './components/actions/ToggleButton';

export { ToggleGroup } from './components/actions/ToggleGroup';
export type { ToggleGroupRootProps, ToggleGroupItemProps } from './components/actions/ToggleGroup';

export { Breadcrumb } from './components/navigation/Breadcrumb';
export type { BreadcrumbRootProps, BreadcrumbItemProps, BreadcrumbLinkProps, BreadcrumbPageProps, BreadcrumbSeparatorProps, BreadcrumbEllipsisProps, BreadcrumbSize } from './components/navigation/Breadcrumb';

export { TableOfContents } from './components/navigation/TableOfContents';
export type { TableOfContentsRootProps, TableOfContentsItemProps } from './components/navigation/TableOfContents';

export { Pagination } from './components/navigation/Pagination';
export type { PaginationSize, PaginationVariant, PaginationRootProps, PaginationPrevTriggerProps, PaginationNextTriggerProps, PaginationItemsProps } from './components/navigation/Pagination';
export { usePagination } from './components/navigation/Pagination';
export type { UsePaginationOptions, UsePaginationReturn } from './components/navigation/Pagination';

export { Stepper } from './components/navigation/Stepper';
export type { StepperRootProps, StepperStepProps, StepperIndicatorProps, StepperTitleProps, StepperDescriptionProps, StepperSeparatorProps, StepperCompletedProps, StepperSize, StepperOrientation, StepStatus } from './components/navigation/Stepper';
export { useStepper } from './components/navigation/Stepper';
export type { UseStepperOptions, UseStepperReturn } from './components/navigation/Stepper';

export { Image } from './components/media/Image';
export type { ImageProps, ImageSource, ImageFit, ImageRadius, ImagePosition } from './components/media/Image';


export { AudioPlayer } from './components/media/AudioPlayer';
export type { AudioPlayerProps, AudioPlayerRadius, AudioPlayerSize } from './components/media/AudioPlayer';
export { useAudioPlayer } from './components/media/AudioPlayer';
export type { UseAudioPlayerOptions, UseAudioPlayerReturn } from './components/media/AudioPlayer';

export { Carousel } from './components/media/Carousel';
export type { CarouselRootProps, CarouselViewportProps, CarouselSlideProps, CarouselPrevTriggerProps, CarouselNextTriggerProps, CarouselIndicatorGroupProps, CarouselIndicatorProps } from './components/media/Carousel';
export { useCarousel } from './components/media/Carousel';
export type { UseCarouselOptions, UseCarouselReturn, CarouselOrientation, CarouselAlign, CarouselAnimate } from './components/media/Carousel';

export { VideoPlayer } from './components/media/VideoPlayer';
export type { VideoPlayerProps } from './components/media/VideoPlayer';

// Canonical shared prop unions — use these instead of inlining
// `'sm' | 'md' | 'lg'` style literal unions in component types.
// Two families: `Size` for controls (sm/md/lg-anchored), `TypographySize`
// for inline text (base-anchored, matching --move-text-base).
export type {
  Size, SizeWithXS, SizeWithXL, SizeFull,
  TypographySize, DisplaySize,
  Gap, GapWithXL2,
  Color,
  Radius,
} from './shared/types';
export { CANONICAL_TYPES, resolveTypeRef, valuesForTypeRef } from './shared/typeRegistry';
export type { CanonicalTypeName } from './shared/typeRegistry';

// Stacking layers — the canonical z-index scale + CSS tokens, surfaced in the
// docs "Stacking" page. (The legacy `contract/` spec-design module was removed;
// the real spec shape is `ComponentSpec` in `spec-type.ts`.)
export { Z_LAYERS } from './shared/z-layers';
export type { Z, ZKind, ZLayers } from './shared/z-layers';
