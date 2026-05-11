/**
 * Docs navigation config. Single source of truth for the sidebar and routing.
 * Each section's first item is the section landing page (where clicking the
 * main label lands).
 */
export interface NavItem {
  to: string;
  label: string;
}

export interface NavSection {
  key: string;
  label: string;
  icon: string;
  items: NavItem[];
}

export const DOCS_NAV: NavSection[] = [
  {
    key: 'getting-started',
    label: 'Getting started',
    icon: 'rocket',
    items: [
      { to: '/getting-started', label: 'Overview' },
      { to: '/getting-started/installation', label: 'Installation' },
      { to: '/getting-started/move-root', label: 'MoveRoot' },
      { to: '/getting-started/create-move-app', label: 'Create Move App' },
      { to: '/getting-started/vite', label: 'Vite' },
      { to: '/getting-started/next', label: 'Next.js' },
    ],
  },
  {
    key: 'core-concepts',
    label: 'Core Concepts',
    icon: 'brain',
    items: [
      { to: '/core-concepts', label: 'Overview' },
      { to: '/core-concepts/how-move-works', label: 'How Move Works' },
      { to: '/core-concepts/component-contract', label: 'Component Contract' },
      { to: '/core-concepts/animation-system', label: 'Animation System' },
      { to: '/core-concepts/theming-model', label: 'Theming Model' },
    ],
  },
  {
    key: 'ai',
    label: 'AI',
    icon: 'bot',
    items: [
      { to: '/ai', label: 'Overview' },
      { to: '/ai/skills', label: 'Skills' },
      { to: '/ai/specs', label: 'Specs' },
      { to: '/ai/writing-your-own-skills', label: 'Writing Your Own Skills' },
    ],
  },
  {
    key: 'components',
    label: 'Components',
    icon: 'blocks',
    items: [
      { to: '/components', label: 'Overview' },
      { to: '/components/accordion', label: 'Accordion' },
      { to: '/components/alert', label: 'Alert' },
      { to: '/components/align', label: 'Align' },
      { to: '/components/audio-player', label: 'AudioPlayer' },
      { to: '/components/autocomplete', label: 'Autocomplete' },
      { to: '/components/avatar', label: 'Avatar' },
      { to: '/components/badge', label: 'Badge' },
      { to: '/components/breadcrumb', label: 'Breadcrumb' },
      { to: '/components/button', label: 'Button' },
      { to: '/components/calendar', label: 'Calendar' },
      { to: '/components/calendar-view', label: 'CalendarView' },
      { to: '/components/card', label: 'Card' },
      { to: '/components/carousel', label: 'Carousel' },
      { to: '/components/chat-bubble', label: 'ChatBubble' },
      { to: '/components/checkbox', label: 'Checkbox' },
      { to: '/components/code', label: 'Code' },
      { to: '/components/collapsible', label: 'Collapsible' },
      { to: '/components/color-input', label: 'ColorInput' },
      { to: '/components/color-picker', label: 'ColorPicker' },
      { to: '/components/date-picker', label: 'DatePicker' },
      { to: '/components/dialog', label: 'Dialog' },
      { to: '/components/divider', label: 'Divider' },
      { to: '/components/drawer', label: 'Drawer' },
      { to: '/components/dropdown', label: 'Dropdown' },
      { to: '/components/empty-state', label: 'EmptyState' },
      { to: '/components/file-upload', label: 'FileUpload' },
      { to: '/components/form-field', label: 'FormField' },
      { to: '/components/grid', label: 'Grid' },
      { to: '/components/heading', label: 'Heading' },
      { to: '/components/image', label: 'Image' },
      { to: '/components/image-group', label: 'ImageGroup' },
      { to: '/components/input-range', label: 'InputRange' },
      { to: '/components/input-text', label: 'InputText' },
      { to: '/components/label', label: 'Label' },
      { to: '/components/link', label: 'Link' },
      { to: '/components/list', label: 'List' },
      { to: '/components/loader', label: 'Loader' },
      { to: '/components/number-input', label: 'NumberInput' },
      { to: '/components/pagination', label: 'Pagination' },
      { to: '/components/password', label: 'Password' },
      { to: '/components/pin-input', label: 'PinInput' },
      { to: '/components/popover', label: 'Popover' },
      { to: '/components/progress-bar', label: 'ProgressBar' },
      { to: '/components/prose', label: 'Prose' },
      { to: '/components/radio-group', label: 'RadioGroup' },
      { to: '/components/rich-text-editor', label: 'RichTextEditor' },
      { to: '/components/scroll-area', label: 'ScrollArea' },
      { to: '/components/select', label: 'Select' },
      { to: '/components/sidebar', label: 'Sidebar' },
      { to: '/components/skeleton', label: 'Skeleton' },
      { to: '/components/splitter', label: 'Splitter' },
      { to: '/components/stack', label: 'Stack' },
      { to: '/components/stepper', label: 'Stepper' },
      { to: '/components/switch', label: 'Switch' },
      { to: '/components/table', label: 'Table' },
      { to: '/components/table-of-contents', label: 'TableOfContents' },
      { to: '/components/tabs', label: 'Tabs' },
      { to: '/components/text', label: 'Text' },
      { to: '/components/textarea', label: 'Textarea' },
      { to: '/components/time-field', label: 'TimeField' },
      { to: '/components/timeline', label: 'Timeline' },
      { to: '/components/toast', label: 'Toast' },
      { to: '/components/toggle-button', label: 'ToggleButton' },
      { to: '/components/toggle-group', label: 'ToggleGroup' },
      { to: '/components/tooltip', label: 'Tooltip' },
      { to: '/components/video-player', label: 'VideoPlayer' },
    ],
  },
  {
    key: 'animation',
    label: 'Animation',
    icon: 'sparkles',
    items: [
      { to: '/animation', label: 'Overview' },
      { to: '/animation/triggers', label: 'Triggers' },
      { to: '/animation/sequences', label: 'Sequences' },
      { to: '/animation/springs', label: 'Springs & easings' },
      { to: '/animation/stagger', label: 'Stagger' },
      { to: '/animation/use-animations', label: 'useAnimations' },
    ],
  },
  {
    key: 'theming',
    label: 'Theming',
    icon: 'palette',
    items: [
      { to: '/theming', label: 'Overview' },
      { to: '/theming/tokens', label: 'Tokens' },
      { to: '/theming/colors', label: 'Colors' },
      { to: '/theming/typography', label: 'Typography' },
      { to: '/theming/surfaces', label: 'Surfaces' },
      { to: '/theming/stacking', label: 'Stacking' },
      { to: '/theming/slot-props', label: 'Slot props' },
    ],
  },
  {
    key: 'recipes',
    label: 'Recipes',
    icon: 'book-open',
    items: [
      { to: '/recipes', label: 'Overview' },
      { to: '/recipes/app-shells', label: 'App shells' },
      { to: '/recipes/forms', label: 'Forms' },
      { to: '/recipes/data', label: 'Data patterns' },
      { to: '/recipes/dashboards', label: 'Dashboards' },
    ],
  },
  {
    key: 'reference',
    label: 'Reference',
    icon: 'list',
    items: [
      { to: '/reference', label: 'All exports' },
      { to: '/reference/hooks', label: 'Hooks' },
      { to: '/reference/changelog', label: 'Changelog' },
      { to: '/reference/faq', label: 'FAQ' },
    ],
  },
];
