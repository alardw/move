// DatePicker.spec.ts — Component specification
// specHash: 891de3de

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'DatePicker',
  componentClass: 'input_popup' as const,
  category: 'date-time',
  description: 'Date selection input with calendar popup, supporting single, range, and multiple modes with optional time picker',

  synonyms: ['date', 'calendar input', 'date field', 'date select', 'datepicker', 'schedule'],
  animationPatterns: ['popupMenu'],
  families: {
    behavior:  ['popup-anchored'],
    state:     ['controlled-value', 'controlled-open'],
    a11y:      ['dialog'],
  },
  behavior: {
    popup: {
      closeOnEscape: true,
      closeOnOutsideClick: true,
      closeOnScroll: true,
      closeOnResize: true,
    },
  },

  compound: true,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Wrapper containing Radix Popover and context providers' },
    { name: 'trigger', element: 'div', description: 'Radix Popover.Anchor wrapping the input area' },
    { name: 'singleWrapper', element: 'div', description: 'Layout wrapper for single/multiple mode input' },
    { name: 'rangeWrapper', element: 'div', description: 'Layout wrapper for range mode dual inputs' },
    { name: 'icon', element: 'span', description: 'Calendar icon slot' },
    { name: 'content', element: 'div', description: 'Animated Radix Popover.Content' },
    { name: 'rangeInstruction', element: 'div', description: 'Active field label shown inside popover for range mode' },
    { name: 'datePickerTime', element: 'div', description: 'Time field section inside popover or inline' },
  ],

  subComponents: [
    {
      name: 'Trigger',
      slots: [{ name: 'trigger', element: 'div', description: 'Popover anchor area' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Trigger content' },
      ],
      usesFactory: false,
      description: 'Anchor element for the calendar popover (div, not button — a button containing inputs is invalid HTML)',
    },
    {
      name: 'Input',
      slots: [
        { name: 'singleWrapper', element: 'div', description: 'Single/multiple mode layout' },
        { name: 'rangeWrapper', element: 'div', description: 'Range mode layout' },
      ],
      props: [
        { name: 'placeholder', type: 'string', moveSpecific: false, description: 'Input placeholder text' },
        { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Input size' },
      ],
      usesFactory: false,
      description: 'Smart input that dispatches to SingleInput or RangeInput based on mode from CalendarContext',
    },
    {
      name: 'Icon',
      slots: [{ name: 'icon', element: 'span', description: 'Icon wrapper' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Custom icon content (defaults to calendar icon)' },
      ],
      usesFactory: false,
      description: 'Calendar icon slot (backwards-compat / custom icon override)',
    },
    {
      name: 'Content',
      slots: [
        { name: 'content', element: 'div', description: 'Popover content with enter/exit animation' },
        { name: 'rangeInstruction', element: 'div', description: 'Range active field label' },
        { name: 'datePickerTime', element: 'div', description: 'Time field section' },
      ],
      props: [
        { name: 'sideOffset', type: 'number', default: '4', moveSpecific: false, description: 'Offset from trigger' },
        { name: 'align', type: "'start' | 'center' | 'end'", default: "'start'", moveSpecific: false, description: 'Alignment relative to trigger' },
        { name: 'container', type: 'HTMLElement', moveSpecific: false, description: 'Custom portal mount target. Defaults to document.body.' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Calendar content' },
      ],
      usesFactory: false,
      description: 'Animated popover content with bake-in portaling, enter/exit transitions, and day-cell stagger.',
    },
  ],

  props: [
    // Animation
    { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Animation config for open/close transitions' },
    // Controlled open
    { name: 'open', type: 'boolean', moveSpecific: true, description: 'Controlled open state' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', moveSpecific: true, description: 'Default open state (uncontrolled)' },
    { name: 'onOpenChange', type: '(open: boolean) => void', moveSpecific: true, description: 'Open state change handler' },
    // Behavior
    { name: 'closeOnSelect', type: 'boolean', default: 'true', moveSpecific: true, description: 'Close popover after date selection' },
    // Selection
    { name: 'mode', type: "'single' | 'range' | 'multiple'", default: "'single'", moveSpecific: true, description: 'Date selection mode' },
    { name: 'value', type: 'Date | DateRange | Date[] | null', moveSpecific: true, description: 'Controlled selected value' },
    { name: 'defaultValue', type: 'Date | DateRange | Date[] | null', moveSpecific: true, description: 'Default selected value (uncontrolled)' },
    { name: 'onValueChange', type: '(value: any) => void', moveSpecific: true, description: 'Value change handler' },
    // Calendar config
    { name: 'events', type: 'CalendarEvent[]', moveSpecific: true, description: 'Calendar events to display' },
    { name: 'locale', type: 'string', moveSpecific: true, description: 'Locale for date formatting (BCP 47)' },
    { name: 'weekStartsOn', type: 'number', moveSpecific: true, description: 'First day of week (0=Sun, 1=Mon, etc.)' },
    { name: 'constraints', type: 'CalendarConstraints', moveSpecific: true, description: 'Date constraints (min, max, disabled dates)' },
    { name: 'numberOfMonths', type: 'number', moveSpecific: true, description: 'Number of months to display simultaneously' },
    { name: 'showWeekNumbers', type: 'boolean', default: 'false', moveSpecific: true, description: 'Show ISO week numbers' },
    { name: 'yearRange', type: 'number', moveSpecific: true, description: 'Year range for year picker navigation' },
    { name: 'fixedWeeks', type: 'boolean', default: 'false', moveSpecific: true, description: 'Always show 6 weeks per month' },
    // Renderers
    { name: 'renderDayCell', type: 'RenderDayCell', moveSpecific: true, description: 'Custom day cell renderer' },
    { name: 'renderEvent', type: 'RenderEvent', moveSpecific: true, description: 'Custom event renderer' },
    // Labels / i18n
    { name: 'placeholder', type: 'string', moveSpecific: false, description: 'Input placeholder text' },
    { name: 'rangeLabels', type: 'DatePickerRangeLabels', moveSpecific: true, description: 'Custom labels for range from/to fields' },
    { name: 'labels', type: 'DatePickerLabels', moveSpecific: true, description: 'Custom UI labels for accessibility and display' },
    // Time
    { name: 'showTime', type: "boolean | { hourCycle?: 12 | 24; placement?: 'inline' | 'popup' }", default: 'false', moveSpecific: true, description: 'Show time picker integration' },
    // Standard
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'DatePicker sub-components (Trigger, Input, Portal, Content)' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: [],
    children: [
      {
        slot: 'trigger',
        dataAttributes: [],
        children: [
          { slot: 'singleWrapper', dataAttributes: [] },
          { slot: 'rangeWrapper', dataAttributes: ['data-size'] },
        ],
      },
      {
        slot: 'content',
        dataAttributes: [],
        children: [
          { slot: 'rangeInstruction', dataAttributes: [] },
          { slot: 'datePickerTime', dataAttributes: [] },
        ],
      },
    ],
  },

  controlled: 'open' as const,
  controlledProps: {
    open: { prop: 'open', defaultProp: 'defaultOpen', handler: 'onOpenChange' },
    value: { prop: 'value', defaultProp: 'defaultValue', handler: 'onValueChange' },
  },

  keyboard: 'linear' as const,
  focus: 'child' as const,
  formType: null,
  asChild: false,

  dismissBehavior: 'unmountAfterExit' as const,

  renderContracts: [
    'Root provides DatePickerContext to all children with animation config, open state, refs, labels, time state',
    'Root provides CalendarContext (via useCalendar) with wrapped onSelect for close-on-select and field-aware range behavior',
    'Content reads animation config from DatePickerContext for enter/exit animations',
    'Content uses stagger selector "[role=gridcell]" for day cell stagger animation',
    'Input reads mode from CalendarContext to dispatch to SingleInput or RangeInput',
    'animate prop on Root is forwarded to Content via DatePickerContext (not a direct prop)',
    'SingleInput uses InputText + Button + optional TimeField from Move component library',
    'RangeInput uses two InputText instances + Button with field-aware focus/commit logic',
    'Range mode: selecting from-date sets activeField to "to", selecting to-date triggers close',
    'Range mode: auto-swap boundaries when to < from',
  ],

  animations: [
    { trigger: 'Content.enter', sequence: [[
      { fn: 'animateDimension', animation: { height: { ease: 'poppy' } } },
      { children: ':scope > *', animation: { scale: { from: 0.8, to: 1, ease: 'poppy' }, opacity: { from: 0, to: 1 } }, stagger: { delay: 30 } },
    ]] },
    { trigger: 'Content.exit', sequence: [[
      { fn: 'animateDimension', animation: { height: { ease: 'snappy' } } },
      { children: ':scope > *', animation: { scale: { to: 0.8, ease: 'snappy' }, opacity: { to: 0 } }, stagger: { delay: 20, from: 'last' } },
    ]] },
  ],

  tokens: [
    { name: '--move-datepicker-content-bg', value: 'var(--move-bg-subtle)', description: 'Content popup background' },
    { name: '--move-datepicker-content-border', value: 'var(--move-border-base)', description: 'Content popup border color' },
    { name: '--move-datepicker-content-radius', value: 'var(--move-rounded-lg)', description: 'Content popup border radius' },
    { name: '--move-datepicker-content-shadow', value: 'var(--move-shadow-lg)', description: 'Content popup box shadow' },
    { name: '--move-datepicker-content-padding', value: 'var(--move-spacing-sm)', description: 'Content popup inner padding' },
  ],

  variants: {},
  sizes: ['sm', 'md', 'lg'],

  labels: [
    { key: 'selectDate', default: 'Select date', description: 'Placeholder for single/multiple mode input' },
    { key: 'datesSelected', default: '{count} dates selected', description: 'Display text for multiple date selection (template)' },
    { key: 'openCalendar', default: 'Open calendar', description: 'Calendar button aria-label' },
    { key: 'startDate', default: 'Start date', description: 'Range from-input aria-label' },
    { key: 'endDate', default: 'End date', description: 'Range to-input aria-label' },
    { key: 'selectStartDate', default: 'Select start date', description: 'Range instruction label for from field' },
    { key: 'selectEndDate', default: 'Select end date', description: 'Range instruction label for to field' },
  ],

  childrenKind: 'composition' as const,
  propRoles: {
    mode: 'data',
    value: 'behavior',
    defaultValue: 'behavior',
    closeOnSelect: 'behavior',
    animations: 'behavior',
    showTime: 'behavior',
    labels: 'i18n',
    locale: 'i18n',
    rangeLabels: 'i18n',
    placeholder: 'displayText',
    children: 'composition',
  },

  hasHook: true,
  engineImports: [] as string[],
  radixPrimitive: 'Popover',
  componentDeps: ['InputText', 'TimeField', 'Button', 'Icon', 'Calendar'],

  testing: {
    behaviors: [
      'Root renders with DatePickerContext provider',
      'Root renders with CalendarContext provider',
      'Root wraps children in Radix Popover.Root',
      'Trigger renders as Radix Popover.Anchor',
      'Input dispatches to SingleInput for single/multiple modes',
      'Input dispatches to RangeInput for range mode',
      'Content renders inside Radix Popover.Content',
      'Content runs enter/exit animation on mount/unmount',
      'Content passes stagger config for day cell animation',
      'Close on select in single mode',
      'Close on select after to-field in range mode',
      'Range mode: from/to field-aware selection flow',
      'Range mode: auto-swap when to < from',
      'Forwards className and style on Root',
      'Forwards className and style on Content',
      'SingleInput renders InputText with locale-aware placeholder',
      'SingleInput commit-or-revert on blur/Enter',
      'RangeInput renders two InputText instances with separator',
      'Time integration: inline TimeField when showTime + placement=inline',
      'Time integration: popup TimeField in Content when showTime + placement=popup',
    ],
    keyboard: [
      'ArrowDown opens calendar / focuses calendar grid',
      'Enter commits typed date and closes (single mode)',
      'Escape reverts typed date and closes',
      'Range mode: Enter on from-input advances focus to to-input',
    ],
    aria: [
      'Calendar button has aria-label "Open calendar"',
      'Range from-input has aria-label "Start date"',
      'Range to-input has aria-label "End date"',
    ],
    animation: [
      'Supports custom enter/exit animation config',
      'Enter: opacity [0,1] + scale [0.5,1] with outQuart easing',
      'Exit: opacity [1,0] + scale [1,0.95] with outQuart easing, 200ms',
      'Stagger: day cells via selector "[role=gridcell]" with 15ms delay',
      'Disables animation when animations={false}',
    ],
  },

  iconsUsed: ['calendar'],
  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'rule-based' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
