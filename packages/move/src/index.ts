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
export { Alert } from './components/core/Alert';
export type { AlertProps, AlertVariant, AlertSize, AlertLabels } from './components/core/Alert';

export { Align } from './components/core/Align';
export type { AlignProps, AlignSectionProps, AlignGap, AlignVertical, AlignPadding, AlignFlex } from './components/core/Align';

export { Avatar } from './components/core/Avatar';
export type { AvatarRootProps, AvatarImageProps, AvatarFallbackProps, AvatarGroupProps, AvatarSize } from './components/core/Avatar';

export { Badge } from './components/core/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/core/Badge';

export { Button } from './components/core/Button';
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonGroupProps } from './components/core/Button';

export { ChatBubble } from './components/core/ChatBubble';
export type { ChatBubbleRootProps, ChatBubbleAvatarProps, ChatBubbleAvatarSize, ChatBubbleContainerProps, ChatBubbleVariant, ChatBubbleHeaderProps, ChatBubbleContentProps, ChatBubbleFooterProps, ChatBubblePlacement } from './components/core/ChatBubble';

export { Code } from './components/core/Code';
export type { CodeProps, CodeVariant, CodeSize } from './components/core/Code';
export { CodeHighlighterProvider, useCodeHighlighter } from './components/core/Code';
export type { CodeHighlighterFn, CodeHighlighterProviderProps, HighlightResult } from './components/core/Code';

export { Grid } from './components/core/Grid';
export type { GridProps, GridCellProps, GridGap, GridPadding } from './components/core/Grid';

export { Heading } from './components/core/Heading';
export type { HeadingProps, HeadingLevel, HeadingSize, HeadingWeight, HeadingColor, HeadingTracking, HeadingAlign } from './components/core/Heading';

export { Link } from './components/core/Link';
export type { LinkProps, LinkVariant, LinkUnderline, LinkSize } from './components/core/Link';

export { Prose } from './components/core/Prose';
export type { ProseProps, ProseSize } from './components/core/Prose';

export { Stack } from './components/core/Stack';
export type { StackProps, StackDirection, StackGap, StackAlign, StackJustify, StackPadding, StackFlex } from './components/core/Stack';

export { Text } from './components/core/Text';
export type { TextProps, TextSize, TextWeight, TextColor, TextAlign, TextAs } from './components/core/Text';

export { Tooltip } from './components/core/Tooltip';
export type { TooltipSimpleProps, TooltipProviderProps, TooltipRootProps, TooltipTriggerProps, TooltipContentProps, TooltipArrowProps } from './components/core/Tooltip';

export { Calendar } from './components/calendar/Calendar';
export type { CalendarRootProps, CalendarNavProps, CalendarGridProps } from './components/calendar/Calendar';
export { useCalendar } from './components/calendar/Calendar';
export type { UseCalendarOptions, UseCalendarSingleOptions, UseCalendarRangeOptions, UseCalendarMultipleOptions, UseCalendarReturn } from './components/calendar/Calendar';

export { CalendarView } from './components/calendar/CalendarView';
export type { CalendarViewRootProps, CalendarViewHeaderProps, CalendarViewNavProps, CalendarViewTitleProps, CalendarViewTodayProps, CalendarViewViewSwitcherProps, CalendarViewBodyProps } from './components/calendar/CalendarView';
export { useCalendarView } from './components/calendar/CalendarView';
export type { UseCalendarViewOptions, UseCalendarViewReturn, CalendarViewLabels } from './components/calendar/CalendarView';

export { DatePicker } from './components/form/DatePicker';
export type { DatePickerRootProps, DatePickerTriggerProps, DatePickerInputProps, DatePickerIconProps, DatePickerContentProps, DatePickerSize, DatePickerLabels, DatePickerRangeLabels } from './components/form/DatePicker';
export { useDatePicker } from './components/form/DatePicker';
export type { UseDatePickerOptions, UseDatePickerReturn } from './components/form/DatePicker';

export { Card } from './components/panel/Card';
export type { CardVariant, CardSize, CardRootProps, CardHeaderProps, CardTitleProps, CardDescriptionProps, CardBodyProps, CardFooterProps, CardFooterStartProps, CardFooterEndProps } from './components/panel/Card';

export { Divider } from './components/panel/Divider';
export type { DividerProps, DividerSlots, DividerType, DividerAlign, DividerSize } from './components/panel/Divider';

export { EmptyState } from './components/loading/EmptyState';
export type { EmptyStateProps, EmptyStateSize } from './components/loading/EmptyState';

export { Skeleton } from './components/loading/Skeleton';
export type { SkeletonAnimation, SkeletonRootProps, SkeletonCircleProps, SkeletonRectangleProps, SkeletonRoundedProps, SkeletonTextProps } from './components/loading/Skeleton';

export { Spinner } from './components/loading/Spinner';
export type { SpinnerProps, SpinnerSize, SpinnerVariant } from './components/loading/Spinner';

export { Loader } from './components/loading/Loader';
export type { LoaderProps, LoaderVariant, LoaderColor, LoaderSize } from './components/loading/Loader';

export { ProgressBar } from './components/loading/ProgressBar';
export type { ProgressBarProps, ProgressBarSize, ProgressBarVariant } from './components/loading/ProgressBar';

export { InputText } from './components/form/InputText';
export type { InputTextProps, InputTextVariant, InputTextSize } from './components/form/InputText';

export { Label } from './components/form/Label';
export type { LabelProps, LabelSize } from './components/form/Label';

export { FormField } from './components/form/FormField';
export type { FormFieldRootProps, FormFieldLabelProps, FormFieldFieldProps, FormFieldDescriptionProps } from './components/form/FormField';

export { Switch } from './components/form/Switch';
export type { SwitchRootProps, SwitchThumbProps, SwitchSize } from './components/form/Switch';

export { Textarea } from './components/form/Textarea';
export type { TextareaProps, TextareaVariant, TextareaSize } from './components/form/Textarea';

export { Checkbox } from './components/form/Checkbox';
export type { CheckboxProps, CheckboxGroupProps, CheckboxSize } from './components/form/Checkbox';
export { useCheckbox } from './components/form/Checkbox';
export type { UseCheckboxOptions, UseCheckboxReturn } from './components/form/Checkbox';

export { RadioGroup } from './components/form/RadioGroup';
export type { RadioGroupRootProps, RadioGroupItemProps, RadioGroupSize } from './components/form/RadioGroup';

export { Password } from './components/form/Password';
export type { PasswordProps, PasswordVariant, PasswordSize, PasswordLabels } from './components/form/Password';

export { NumberInput } from './components/form/NumberInput';
export type { NumberInputProps, NumberInputVariant, NumberInputSize } from './components/form/NumberInput';
export { useNumberInput } from './components/form/NumberInput';
export type { UseNumberInputOptions, UseNumberInputReturn } from './components/form/NumberInput';

export { InputRange } from './components/form/InputRange';
export type { InputRangeProps, InputRangeSlots, InputRangeSize } from './components/form/InputRange';
export { useInputRange } from './components/form/InputRange';
export type { UseInputRangeOptions, UseInputRangeReturn, InputRangeValue } from './components/form/InputRange';

export { PinInput } from './components/form/PinInput';
export type { PinInputProps, PinInputSize } from './components/form/PinInput';
export { usePinInput } from './components/form/PinInput';
export type { UsePinInputOptions, UsePinInputReturn } from './components/form/PinInput';

export { Select } from './components/form/Select';
export type { SelectRootProps, SelectTriggerProps, SelectTriggerSize, SelectTriggerVariant, SelectValueProps, SelectIconProps, SelectContentProps, SelectViewportProps, SelectItemProps, SelectGroupProps, SelectLabelProps, SelectSeparatorProps } from './components/form/Select';

export { Autocomplete } from './components/form/Autocomplete';
export type { AutocompleteRootProps, AutocompleteTriggerProps, AutocompleteTriggerSize, AutocompleteTriggerVariant, AutocompleteInputProps, AutocompleteTagListProps, AutocompleteTagProps, AutocompleteIconProps, AutocompleteClearTriggerProps, AutocompleteContentProps, AutocompleteItemProps, AutocompleteItemIndicatorProps, AutocompleteGroupProps, AutocompleteGroupLabelProps, AutocompleteEmptyProps, AutocompleteLoadingProps, AutocompleteSeparatorProps } from './components/form/Autocomplete';
export { useAutocomplete } from './components/form/Autocomplete';
export type { UseAutocompleteOptions, UseAutocompleteReturn, RegisteredItem } from './components/form/Autocomplete';

export { ColorPicker } from './components/form/ColorPicker';
export type { ColorPickerProps, ColorPickerSize, ColorPickerSlots } from './components/form/ColorPicker';
export { useColorPicker } from './components/form/ColorPicker';
export type { UseColorPickerOptions, UseColorPickerReturn } from './components/form/ColorPicker';
export type { ColorFormat, BaseColorFormat, HsvColor, RgbColor, HslColor, ColorChannel } from './components/form/ColorPicker';

export { ColorInput } from './components/form/ColorInput';
export type { ColorInputProps, ColorInputVariant, ColorInputSize, ColorInputSlots } from './components/form/ColorInput';

export { FileUpload } from './components/form/FileUpload';
export type { FileUploadSize, FileUploadVariant, FileUploadRootProps, FileUploadDropzoneProps, FileUploadTriggerProps, FileUploadItemGroupProps, FileUploadItemProps, FileUploadItemPreviewProps, FileUploadItemNameProps, FileUploadItemSizeProps, FileUploadItemDeleteProps, FileUploadClearTriggerProps, FileUploadItemProgressProps, FileUploadTotalProgressProps, FileUploadItemStatusProps, FileUploadUploadTriggerProps } from './components/form/FileUpload';
export { useFileUpload, formatFileSize } from './components/form/FileUpload';
export type { FileError, FileRejection, UseFileUploadOptions, UseFileUploadReturn } from './components/form/FileUpload';
export { useUploadManager } from './components/form/FileUpload';
export type { UseUploadManagerReturn } from './components/form/FileUpload';
export type { FileUploadStatus, UploadProgress, FileUploadAdapterResult, FileUploadEntry, FileUploadAdapterOptions, FileUploadAdapter, HttpAdapterOptions, UseUploadManagerOptions, UploadAggregateState } from './components/form/FileUpload';

export { RichTextEditor } from './components/form/RichTextEditor';
export type { RichTextEditorVariant, RichTextEditorSize, RichTextEditorRootProps, RichTextEditorToolbarProps, RichTextEditorControlGroupProps, RichTextEditorControlProps, RichTextEditorSeparatorProps, RichTextEditorContentProps } from './components/form/RichTextEditor';

export { TimeField } from './components/form/TimeField';
export type { TimeFieldRootProps, TimeFieldSegmentProps, TimeFieldSeparatorProps, TimeFieldPeriodProps, TimeFieldDropdownProps, TimeFieldDropdownColumnProps, TimeFieldSize } from './components/form/TimeField';
export { useTimeField } from './components/form/TimeField';
export type { UseTimeFieldOptions, UseTimeFieldReturn, SegmentType, SegmentInfo, TimeFieldGranularity } from './components/form/TimeField';

export { Accordion } from './components/panel/Accordion';
export type { AccordionRootProps, AccordionItemProps, AccordionHeaderProps, AccordionTriggerProps, AccordionContentProps, AccordionSize, AccordionVariant, AccordionAnimateConfig } from './components/panel/Accordion';
export { useAccordion } from './components/panel/Accordion';
export type { UseAccordionOptions, UseAccordionReturn } from './components/panel/Accordion';

export { Collapsible } from './components/panel/Collapsible';
export type { CollapsibleRootProps, CollapsibleTriggerProps, CollapsibleIconProps, CollapsibleContentProps, CollapsibleAnimate } from './components/panel/Collapsible';
export { useCollapsible } from './components/panel/Collapsible';
export type { UseCollapsibleOptions, UseCollapsibleReturn } from './components/panel/Collapsible';

export { ScrollArea } from './components/panel/ScrollArea';
export type { ScrollAreaRootProps, ScrollAreaHeaderProps, ScrollAreaContentProps, ScrollAreaFooterProps } from './components/panel/ScrollArea';

export { Tabs } from './components/panel/Tabs';
export type { TabsRootProps, TabsListProps, TabsTriggerProps, TabsContentProps, TabsSize, TabsVariant } from './components/panel/Tabs';

export { Splitter } from './components/panel/Splitter';
export type { SplitterRootProps, SplitterPanelProps } from './components/panel/Splitter';

export { Sidebar } from './components/panel/Sidebar';
export type { SidebarProviderProps, SidebarRootProps, SidebarOverlayProps, SidebarHeaderProps, SidebarContentProps, SidebarFooterProps, SidebarGroupProps, SidebarGroupLabelProps, SidebarItemProps, SidebarTriggerProps } from './components/panel/Sidebar';
export { useSidebar, useSidebarContext } from './components/panel/Sidebar';
export type { UseSidebarOptions, UseSidebarReturn } from './components/panel/Sidebar';

export { Dialog } from './components/overlay/Dialog';

export { Drawer } from './components/overlay/Drawer';
export type { DrawerRootProps, DrawerTriggerProps, DrawerPortalProps, DrawerOverlayProps, DrawerContentProps, DrawerPosition, DrawerSize, DrawerHeaderProps, DrawerBodyProps, DrawerFooterProps, DrawerTitleProps, DrawerDescriptionProps, DrawerCloseProps, DrawerHandleProps } from './components/overlay/Drawer';
export type { DialogRootProps, DialogTriggerProps, DialogPortalProps, DialogOverlayProps, DialogContentProps, DialogSize, DialogHeaderProps, DialogBodyProps, DialogFooterProps, DialogFooterStartProps, DialogFooterEndProps, DialogTitleProps, DialogDescriptionProps, DialogCloseProps } from './components/overlay/Dialog';

export { Dropdown } from './components/overlay/Dropdown';
export type { DropdownRootProps, DropdownTriggerProps, DropdownContentProps, DropdownArrowProps, DropdownItemProps, DropdownGroupProps, DropdownLabelProps, DropdownCheckboxItemProps, DropdownRadioGroupProps, DropdownRadioItemProps, DropdownItemIndicatorProps, DropdownSeparatorProps, DropdownSubProps, DropdownSubTriggerProps, DropdownSubContentProps } from './components/overlay/Dropdown';

export { Popover } from './components/overlay/Popover';
export type { PopoverRootProps, PopoverTriggerProps, PopoverAnchorProps, PopoverContentProps, PopoverArrowProps, PopoverCloseProps } from './components/overlay/Popover';

export { Toast, toast } from './components/overlay/Toast';
export type { ToastViewportProps, ToastState, ToastPosition, ToastVariant, ToastOptions } from './components/overlay/Toast';

export { Table, useTableSelection } from './components/data/Table';
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
} from './components/data/Table';

export { Timeline } from './components/data/Timeline';
export type { TimelineSize, TimelineAlign, TimelineColor, TimelineLineVariant, TimelineRootProps, TimelineItemSlots, TimelineItemProps } from './components/data/Timeline';

export { List } from './components/data/List';
export type { ListSize, ListDensity, ListDescriptionLines, ListItemElement, ListRootProps, ListItemProps, ListLeadingProps, ListContentProps, ListTitleProps, ListDescriptionProps, ListTrailingProps } from './components/data/List';

export { ToggleButton } from './components/toolbar/ToggleButton';
export type { ToggleButtonProps } from './components/toolbar/ToggleButton';

export { ToggleGroup } from './components/toolbar/ToggleGroup';
export type { ToggleGroupRootProps, ToggleGroupItemProps } from './components/toolbar/ToggleGroup';

export { Breadcrumb } from './components/nav/Breadcrumb';
export type { BreadcrumbRootProps, BreadcrumbItemProps, BreadcrumbLinkProps, BreadcrumbPageProps, BreadcrumbSeparatorProps, BreadcrumbEllipsisProps, BreadcrumbSize } from './components/nav/Breadcrumb';

export { TableOfContents } from './components/nav/TableOfContents';
export type { TableOfContentsRootProps, TableOfContentsItemProps } from './components/nav/TableOfContents';

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

export { ImageGroup } from './components/media/ImageGroup';
export type { ImageGroupProps, ImageGroupGap, ImageGroupRadius } from './components/media/ImageGroup';

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

// Spec contract — types, taxonomies, and tooling helpers consumed by
// the docs site and AI skills. The `Animation` taxonomy is aliased to
// `AnimationFamily` here to avoid clash with the runtime `Animation`
// type from the animation module.
export { SCHEMA_VERSION, ANIMATION_RULES, Z_LAYERS, deriveZ } from './contract';
export type {
  Spec,
  Identity, Taxonomies, Composition, Interaction, Style, AnimationBlock, Lifecycle, Tooling,
  PropDef, PropRequired, PropOptionalLiteral, PropOptionalLabeled, PropRole,
  SlotDef, SubComponentDef, TokenDef, AnimationDef, AnimationStateDef,
  RenderContractDef, AnatomyDef, LabelDef, ControlledProps, TestingDef,
  DefaultReview, DeprecatedDef, ChildrenKind, KeyboardPattern, FocusPattern, FormType,
  Category, ComponentClass, Behavior, State, Surface, A11y, Z,
  ComponentClassKind, BehaviorKind, StateKind, AnimationKind, SurfaceKind, ZKind, A11yKind,
} from './contract';
export type { Animation as AnimationFamily, AnimationStep as AnimationFamilyStep } from './contract';
