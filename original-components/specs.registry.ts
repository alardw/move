/**
 * Component Spec Registry
 *
 * Tracks all components and their spec/validation status.
 * Updated by /validate.
 */

export type SpecStatus = 'no-spec' | 'draft' | 'approved' | 'generated' | 'validated';

export interface RegistryEntry {
  /** Component name */
  name: string;
  /** Category folder */
  category: string;
  /** Spec status */
  specStatus: SpecStatus;
  /** Last validated timestamp (ISO) */
  lastValidated?: string;
  /** Spec hash (if spec exists) */
  specHash?: string;
  /** Number of validation issues (last run) */
  issues?: number;
}

export const COMPONENT_REGISTRY: RegistryEntry[] = [
  // calendar
  { name: 'Calendar', category: 'calendar', specStatus: 'no-spec' },
  { name: 'CalendarView', category: 'calendar', specStatus: 'no-spec' },

  // core
  { name: 'Alert', category: 'core', specStatus: 'no-spec' },
  { name: 'Align', category: 'core', specStatus: 'no-spec' },
  { name: 'Avatar', category: 'core', specStatus: 'no-spec' },
  { name: 'Button', category: 'core', specStatus: 'no-spec' },
  { name: 'Code', category: 'core', specStatus: 'no-spec' },
  { name: 'Grid', category: 'core', specStatus: 'no-spec' },
  { name: 'Heading', category: 'core', specStatus: 'no-spec' },
  { name: 'Icon', category: 'core', specStatus: 'no-spec' },
  { name: 'Link', category: 'core', specStatus: 'no-spec' },
  { name: 'Prose', category: 'core', specStatus: 'no-spec' },
  { name: 'Stack', category: 'core', specStatus: 'no-spec' },
  { name: 'Text', category: 'core', specStatus: 'no-spec' },
  { name: 'Tooltip', category: 'core', specStatus: 'no-spec' },
  { name: 'Badge', category: 'core', specStatus: 'validated', lastValidated: '2026-02-28T14:30:00Z', specHash: 'bedd4e02', issues: 0 },
  { name: 'ChatBubble', category: 'core', specStatus: 'no-spec' },

  // data
  { name: 'Table', category: 'data', specStatus: 'no-spec' },
  { name: 'Timeline', category: 'data', specStatus: 'no-spec' },

  // form
  { name: 'Autocomplete', category: 'form', specStatus: 'no-spec' },
  { name: 'Checkbox', category: 'form', specStatus: 'no-spec' },
  { name: 'ColorInput', category: 'form', specStatus: 'no-spec' },
  { name: 'ColorPicker', category: 'form', specStatus: 'no-spec' },
  { name: 'DatePicker', category: 'form', specStatus: 'no-spec' },
  { name: 'FileUpload', category: 'form', specStatus: 'no-spec' },
  { name: 'FormField', category: 'form', specStatus: 'no-spec' },
  { name: 'InputRange', category: 'form', specStatus: 'no-spec' },
  { name: 'InputText', category: 'form', specStatus: 'no-spec' },
  { name: 'Label', category: 'form', specStatus: 'no-spec' },
  { name: 'NumberInput', category: 'form', specStatus: 'no-spec' },
  { name: 'Password', category: 'form', specStatus: 'no-spec' },
  { name: 'PinInput', category: 'form', specStatus: 'no-spec' },
  { name: 'RadioGroup', category: 'form', specStatus: 'no-spec' },
  { name: 'RichTextEditor', category: 'form', specStatus: 'no-spec' },
  { name: 'Select', category: 'form', specStatus: 'no-spec' },
  { name: 'Switch', category: 'form', specStatus: 'no-spec' },
  { name: 'Textarea', category: 'form', specStatus: 'no-spec' },
  { name: 'TimeField', category: 'form', specStatus: 'no-spec' },

  // loading
  { name: 'EmptyState', category: 'loading', specStatus: 'no-spec' },
  { name: 'Loader', category: 'loading', specStatus: 'no-spec' },
  { name: 'ProgressBar', category: 'loading', specStatus: 'no-spec' },
  { name: 'Skeleton', category: 'loading', specStatus: 'no-spec' },
  { name: 'Spinner', category: 'loading', specStatus: 'no-spec' },

  // media
  { name: 'AudioPlayer', category: 'media', specStatus: 'no-spec' },
  { name: 'Carousel', category: 'media', specStatus: 'no-spec' },
  { name: 'Image', category: 'media', specStatus: 'no-spec' },
  { name: 'ImageGroup', category: 'media', specStatus: 'no-spec' },
  { name: 'VideoPlayer', category: 'media', specStatus: 'no-spec' },

  // nav
  { name: 'Breadcrumb', category: 'nav', specStatus: 'no-spec' },

  // navigation
  { name: 'Pagination', category: 'navigation', specStatus: 'no-spec' },
  { name: 'Stepper', category: 'navigation', specStatus: 'no-spec' },

  // overlay
  { name: 'Dialog', category: 'overlay', specStatus: 'no-spec' },
  { name: 'Dropdown', category: 'overlay', specStatus: 'no-spec' },
  { name: 'Popover', category: 'overlay', specStatus: 'no-spec' },
  { name: 'Toast', category: 'overlay', specStatus: 'no-spec' },

  // panel
  { name: 'Accordion', category: 'panel', specStatus: 'no-spec' },
  { name: 'Card', category: 'panel', specStatus: 'no-spec' },
  { name: 'Collapsible', category: 'panel', specStatus: 'no-spec' },
  { name: 'Divider', category: 'panel', specStatus: 'no-spec' },
  { name: 'ScrollArea', category: 'panel', specStatus: 'no-spec' },
  { name: 'Sidebar', category: 'panel', specStatus: 'no-spec' },
  { name: 'Splitter', category: 'panel', specStatus: 'no-spec' },
  { name: 'Tabs', category: 'panel', specStatus: 'no-spec' },

  // toolbar
  { name: 'ToggleButton', category: 'toolbar', specStatus: 'no-spec' },
  { name: 'ToggleGroup', category: 'toolbar', specStatus: 'no-spec' },
];
