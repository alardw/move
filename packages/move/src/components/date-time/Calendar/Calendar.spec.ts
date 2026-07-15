// Calendar.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Calendar',
  componentClass: 'display' as const,
  category: 'date-time',
  description:
    'Date selection grid supporting single, range, and multiple selection modes with event display, keyboard navigation, and locale-aware formatting',
  families: {
    behavior: ['form-input'],
    state: ['controlled-value'],
    a11y: ['none'],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description: 'Calendar context container that wraps Nav and Grid',
    },
    {
      name: 'nav',
      element: 'div',
      description: 'Navigation header with previous/next controls and month/year pickers',
    },
    {
      name: 'grid',
      element: 'div',
      description: 'Month grid rendering weekday headers and day cells',
    },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'div', description: 'Calendar context container' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Calendar.Nav and Calendar.Grid (and any custom composition)',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'mode',
          typeRef: 'SelectionMode',
          default: "'single'",
          moveSpecific: true,
          description: 'Selection mode: single date, date range, or multiple dates',
        },
        {
          name: 'value',
          type: 'Date | DateRange | Date[] | null',
          moveSpecific: true,
          description: 'Controlled selected value (shape depends on mode)',
        },
        {
          name: 'defaultValue',
          type: 'Date | DateRange | Date[] | null',
          moveSpecific: true,
          description: 'Initial selected value when uncontrolled',
        },
        {
          name: 'onValueChange',
          type: '(value: any) => void',
          moveSpecific: true,
          description: 'Called when the selection changes',
        },
        {
          name: 'events',
          typeRef: 'CalendarEvent[]',
          default: '[]',
          moveSpecific: true,
          description: 'List of events to display on day cells',
        },
        {
          name: 'locale',
          type: 'string',
          default: "'en-US'",
          moveSpecific: true,
          description: 'BCP-47 locale tag for date formatting and weekday order',
        },
        {
          name: 'weekStartsOn',
          type: 'number',
          moveSpecific: true,
          description: 'First day of week (0=Sunday, 1=Monday); defaults from locale',
        },
        {
          name: 'constraints',
          typeRef: 'CalendarConstraints',
          moveSpecific: true,
          description: 'Min/max date and disabled-day predicate',
        },
        {
          name: 'numberOfMonths',
          type: 'number',
          default: '1',
          moveSpecific: true,
          description: 'Number of months to render side-by-side',
        },
        {
          name: 'showWeekNumbers',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Show ISO week number column on each grid',
        },
        {
          name: 'yearRange',
          type: 'number',
          default: '12',
          moveSpecific: true,
          description:
            'Number of years on either side of the current year shown in the year picker',
        },
        {
          name: 'fixedWeeks',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Always render six week rows so the grid does not reflow as months change',
        },
        {
          name: 'renderDayCell',
          typeRef: 'RenderDayCell',
          moveSpecific: true,
          description: 'Custom renderer for day cell content',
        },
        {
          name: 'renderEvent',
          typeRef: 'RenderEvent',
          moveSpecific: true,
          description: 'Custom renderer for an event chip inside a day cell',
        },
        {
          name: 'labels',
          typeRef: 'CalendarLabels',
          moveSpecific: true,
          description: 'Localizable strings for nav buttons and pickers',
        },
      ],
      usesFactory: false,
      description:
        'Stateful root that creates CalendarContext via useCalendar and renders children inside the calendar slot',
    },
    {
      name: 'Nav',
      slots: [{ name: 'nav', element: 'div', description: 'Navigation header' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'sp',
          typeRef: 'CalendarNavSp',
          moveSpecific: true,
          description: 'Spacing prop forwarded to the shared CalendarNav layout',
        },
      ],
      usesFactory: false,
      description:
        'Thin wrapper around the shared CalendarNav that exposes the previous/next controls and month/year pickers',
    },
    {
      name: 'Grid',
      slots: [{ name: 'grid', element: 'div', description: 'Month grid' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
      ],
      usesFactory: false,
      description:
        'Thin wrapper around the shared MonthGrid that reads display state from CalendarContext',
    },
  ],

  props: [],

  anatomy: {
    slot: 'root',
    children: [
      {
        slot: 'nav',
        ariaAttributes: ['aria-live="polite"'],
      },
      {
        slot: 'grid',
        ariaAttributes: ['role="grid"', 'aria-label="formatted month/year"'],
        children: [
          {
            slot: 'weekDayHeader',
            ariaAttributes: ['role="columnheader"'],
          },
          {
            slot: 'weekRow',
            ariaAttributes: ['role="row"'],
            children: [
              {
                slot: 'dayCell',
                dataAttributes: [
                  'data-today',
                  'data-outside',
                  'data-disabled',
                  'data-selected',
                  'data-range-start',
                  'data-range-end',
                ],
                ariaAttributes: [
                  'role="gridcell"',
                  'aria-selected',
                  'aria-disabled',
                  'aria-label="localized date"',
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  controlled: 'value' as const,
  controlledProps: {
    valueProp: 'value',
    defaultValueProp: 'defaultValue',
    onChangeProp: 'onValueChange',
  },
  keyboard: 'roving' as const,
  focus: 'roving' as const,
  formType: null,
  asChild: false,

  animations: [
    {
      trigger: 'Grid.enter',
      sequence: [
        {
          children: ':scope > *',
          animation: { opacity: { from: 0, to: 1 }, scale: { from: 0.8, to: 1, ease: 'poppy' } },
          stagger: { delay: 15 },
        },
      ],
    },
    {
      trigger: 'DayCell.press',
      sequence: [{ animation: { scale: { to: 0.96, ease: 'snappy' } } }],
    },
  ],

  renderContracts: [
    {
      id: 'root-provides-context',
      description: 'Root provides CalendarContext consumed by Nav and Grid',
    },
    {
      id: 'root-forwards-animations',
      description: 'Root forwards animations config into Grid for month-transition stagger',
    },
    {
      id: 'nav-reads-context',
      description: 'Nav reads displayMonth, locale, yearRange, labels from CalendarContext',
    },
    {
      id: 'grid-reads-context',
      description:
        'Grid reads displayMonth, locale, weekStartsOn, numberOfMonths, showWeekNumbers, fixedWeeks, focusedDate from CalendarContext',
    },
    {
      id: 'daycell-reads-context',
      description:
        'DayCell (internal) reads mode, value, onSelect, constraints, events, focusedDate, renderDayCell from CalendarContext',
    },
  ],

  tokens: [
    // Root
    { name: '--move-calendar-bg', value: 'transparent', slot: 'root' },
    { name: '--move-calendar-padding', value: 'var(--move-spacing-sm)', slot: 'root' },
    { name: '--move-calendar-width', value: 'auto', slot: 'root' },

    // Day cell
    { name: '--move-calendar-cell-size', value: '1.75rem', slot: 'dayCell' },
    { name: '--move-calendar-cell-radius', value: 'var(--move-rounded-md)', slot: 'dayCell' },
    { name: '--move-calendar-cell-font-size', value: 'var(--move-size-sm)', slot: 'dayCell' },
    { name: '--move-calendar-cell-fg', value: 'var(--move-fg-base)', slot: 'dayCell' },
    { name: '--move-calendar-cell-bg-hover', value: 'var(--move-bg-muted)', slot: 'dayCell' },
    { name: '--move-calendar-cell-bg-selected', value: 'var(--move-primary)', slot: 'dayCell' },
    {
      name: '--move-calendar-cell-fg-selected',
      value: 'var(--move-primary-fg)',
      slot: 'dayCell',
    },
    {
      name: '--move-calendar-cell-bg-range',
      value: 'var(--move-primary-subtle)',
      slot: 'dayCell',
    },
    { name: '--move-calendar-cell-fg-today', value: 'var(--move-indigo-text)', slot: 'dayCell' },
    { name: '--move-calendar-cell-fg-outside', value: 'var(--move-fg-subtle)', slot: 'dayCell' },
    {
      name: '--move-calendar-cell-fg-disabled',
      value: 'var(--move-fg-subtle)',
      slot: 'dayCell',
    },

    // Nav
    {
      name: '--move-calendar-nav-padding',
      value: 'var(--move-spacing-sm) var(--move-spacing-xs)',
      slot: 'nav',
    },
    { name: '--move-calendar-nav-btn-size', value: '1.75rem', slot: 'navButton' },
    { name: '--move-calendar-nav-btn-radius', value: 'var(--move-rounded-md)', slot: 'navButton' },
    { name: '--move-calendar-nav-btn-fg', value: 'var(--move-fg-muted)', slot: 'navButton' },
    {
      name: '--move-calendar-nav-btn-bg-hover',
      value: 'var(--move-bg-muted)',
      slot: 'navButton',
    },

    // Grid headers
    {
      name: '--move-calendar-header-font-size',
      value: 'var(--move-size-xs)',
      slot: 'weekDayHeader',
    },
    { name: '--move-calendar-header-fg', value: 'var(--move-fg-muted)', slot: 'weekDayHeader' },
    {
      name: '--move-calendar-header-padding',
      value: 'var(--move-spacing-xs)',
      slot: 'weekDayHeader',
    },

    // Week numbers
    {
      name: '--move-calendar-weeknum-font-size',
      value: 'var(--move-size-xs)',
      slot: 'weekNumber',
    },
    { name: '--move-calendar-weeknum-fg', value: 'var(--move-fg-subtle)', slot: 'weekNumber' },

    // Picker overlays (month/year)
    { name: '--move-calendar-picker-bg', value: 'var(--move-bg-subtle)', slot: 'picker' },
    { name: '--move-calendar-picker-border', value: 'var(--move-border-base)', slot: 'picker' },
    { name: '--move-calendar-picker-radius', value: 'var(--move-rounded-lg)', slot: 'picker' },
    { name: '--move-calendar-picker-shadow', value: 'var(--move-shadow-md)', slot: 'picker' },
    { name: '--move-calendar-picker-padding', value: 'var(--move-spacing-sm)', slot: 'picker' },

    // Event slot
    { name: '--move-calendar-event-radius', value: 'var(--move-rounded-sm)', slot: 'eventSlot' },
    {
      name: '--move-calendar-event-font-size',
      value: 'var(--move-size-xs)',
      slot: 'eventSlot',
    },
    {
      name: '--move-calendar-event-padding-x',
      value: 'var(--move-spacing-xs)',
      slot: 'eventSlot',
    },
    { name: '--move-calendar-event-padding-y', value: '1px', slot: 'eventSlot' },
  ],

  variants: {},
  sizes: [],

  labels: [
    {
      key: 'previousMonth',
      default: 'Previous month',
      description: 'Aria label for the previous-month nav button',
    },
    {
      key: 'nextMonth',
      default: 'Next month',
      description: 'Aria label for the next-month nav button',
    },
    {
      key: 'selectMonth',
      default: 'Select month',
      description: 'Aria label for the month picker trigger',
    },
    {
      key: 'selectYear',
      default: 'Select year',
      description: 'Aria label for the year picker trigger',
    },
  ],

  radixPrimitive: null,
  hasHook: true,
  engineImports: [] as string[],

  componentDeps: ['Button', 'Icon', 'Select'] as string[],

  testing: {
    behaviors: [
      'Root renders children',
      'Root forwards className and style',
      'Root defaults to mode=single',
      'Grid renders weekday headers',
      'Grid renders day cells with role=gridcell',
      'Grid displays correct number of months when numberOfMonths > 1',
      'Day cell receives aria-selected when selected',
      'Day cell receives data-today for current date',
      'Day cell receives data-outside for out-of-month dates',
      'Day cell receives data-disabled for disabled dates',
      'Range mode shows range-start and range-end states',
      'Nav renders previous/next buttons with aria-labels',
      'Nav buttons navigate months',
      'Labels support customization',
      'Week numbers display when showWeekNumbers=true',
    ],
    keyboard: [
      'Arrow keys move focus between days (roving tabindex)',
      'Roving tabIndex sets 0 on focused day and -1 on the rest',
    ],
    aria: [
      'role="grid" on month grid element',
      'role="row" on week rows',
      'role="columnheader" on weekday headers',
      'role="gridcell" on day cells',
      'aria-selected on selected day cells',
      'aria-disabled on disabled day cells',
      'aria-label on grid (formatted month/year)',
      'aria-label on day cells (localized date)',
      'aria-label on nav buttons (Previous month / Next month)',
      'aria-live="polite" on nav container',
    ],
  },
} satisfies ComponentSpec;
