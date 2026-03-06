// Calendar.spec.ts — Component specification
// specHash: 7dc1c820

export const spec = {
  schemaVersion: 7 as const,
  name: 'Calendar',
  componentClass: 'display' as const,
  category: 'calendar',
  description:
    'Date selection grid supporting single, range, and multiple selection modes with event display, keyboard navigation, and locale-aware formatting',

  // Compound pattern — plain object (Root is a context orchestrator)
  compound: {
    pattern: 'object' as const,
    subComponents: ['Root', 'Nav', 'Grid'] as string[],
  },

  anatomy: ['Root', 'Nav', 'Grid'] as string[],

  slots: ['root', 'nav', 'grid'] as string[],

  props: {
    Root: [
      'animations',
      'mode',
      'value',
      'defaultValue',
      'onValueChange',
      'events',
      'locale',
      'weekStartsOn',
      'constraints',
      'numberOfMonths',
      'showWeekNumbers',
      'yearRange',
      'fixedWeeks',
      'renderDayCell',
      'renderEvent',
      'labels',
      'children',
      'className',
      'style',
    ] as string[],
    Nav: ['className', 'sp'] as string[],
    Grid: ['className'] as string[],
  },

  defaults: {
    mode: 'single',
    events: [] as unknown[],
    locale: 'en-US',
    numberOfMonths: 1,
    showWeekNumbers: false,
    yearRange: 12,
    fixedWeeks: false,
  },

  moveProps: [
    'animations',
    'mode',
    'value',
    'defaultValue',
    'onValueChange',
    'events',
    'locale',
    'weekStartsOn',
    'constraints',
    'numberOfMonths',
    'showWeekNumbers',
    'yearRange',
    'fixedWeeks',
    'renderDayCell',
    'renderEvent',
    'labels',
  ] as string[],

  variants: null,
  sizes: null,

  controlled: { pattern: 'value' as const },
  controlledProps: {
    value: {
      prop: 'value',
      defaultProp: 'defaultValue',
      onChange: 'onValueChange',
    },
  },

  dismissBehavior: null,

  renderContracts: [
    'Root provides CalendarContext consumed by Nav and Grid',
    'Root forwards animations config into Grid for month-transition stagger',
    'Nav reads displayMonth, locale, yearRange, labels from CalendarContext',
    'Grid reads displayMonth, locale, weekStartsOn, numberOfMonths, showWeekNumbers, fixedWeeks, focusedDate from CalendarContext',
    'DayCell (internal) reads mode, value, onSelect, constraints, events, focusedDate, renderDayCell from CalendarContext',
  ] as string[],

  animations: [
    { trigger: 'Grid.enter', sequence: [{ children: ':scope > *', animation: { opacity: { from: 0, to: 1 }, scale: { from: 0.8, to: 1, ease: 'poppy' } }, stagger: { delay: 15 } }] },
    { trigger: 'DayCell.press', sequence: [{ preset: 'scaleDown' }] },
  ],



  labels: {
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    selectMonth: 'Select month',
    selectYear: 'Select year',
  },

  tokens: [
    // Root
    { name: '--move-calendar-bg', value: 'transparent', slot: 'root' },
    { name: '--move-calendar-padding', value: 'var(--move-spacing-sm)', slot: 'root' },
    { name: '--move-calendar-width', value: 'auto', slot: 'root' },

    // Day cell
    { name: '--move-calendar-cell-size', value: '2.25rem', slot: 'dayCell' },
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
    { name: '--move-calendar-cell-fg-today', value: 'var(--move-primary)', slot: 'dayCell' },
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

  hasHook: true,
  radixPrimitive: null,

  a11y: {
    role: 'grid' as const,
    focusPattern: 'roving' as const,
    keyboardPattern: 'grid' as const,
    attributes: [
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
      'Roving tabIndex (0 on focused day, -1 on others)',
    ] as string[],
  },

  componentDeps: ['Button', 'Icon', 'Select'] as string[],

  // Shared infrastructure files used by both Calendar and CalendarView.
  // These must be generated alongside Calendar into src/components/calendar/_shared/.
  sharedFiles: [
    {
      path: '_shared/CalendarContext.tsx',
      exports: [
        'CalendarContext',
        'CalendarContextValue',
        'CalendarLabels',
        'DEFAULT_CALENDAR_LABELS',
        'useCalendarContext',
      ],
    },
    {
      path: '_shared/types.ts',
      exports: [
        'CalendarEvent',
        'DateRange',
        'CalendarConstraints',
        'SelectionMode',
        'DayState',
        'DayCellData',
        'RenderDayCell',
        'RenderEvent',
        'CalendarViewMode',
      ],
    },
    {
      path: '_shared/dateUtils.ts',
      exports: [
        'getLocaleFirstDay',
        'startOfDay',
        'isSameDay',
        'isSameMonth',
        'isToday',
        'isWithinRange',
        'isBefore',
        'isAfter',
        'addDays',
        'addMonths',
        'addYears',
        'getMonthGrid',
        'getWeekRange',
        'getWeekDayNames',
        'formatMonthYear',
        'formatMonth',
        'formatDate',
        'formatTime',
        'getMonthNames',
        'getTimeSlots',
        'isDateDisabled',
        'getLocaleDatePattern',
        'parseDate',
        'getWeekNumber',
      ],
    },
    { path: '_shared/DayCell.tsx', exports: ['DayCell'] },
    { path: '_shared/DayCell.module.css', exports: [] },
    { path: '_shared/MonthGrid.tsx', exports: ['MonthGrid'] },
    { path: '_shared/MonthGrid.module.css', exports: [] },
    { path: '_shared/CalendarNav.tsx', exports: ['CalendarNav'] },
    { path: '_shared/CalendarNav.module.css', exports: [] },
    { path: '_shared/EventSlot.tsx', exports: ['EventSlot'] },
    { path: '_shared/EventSlot.module.css', exports: [] },
    { path: '_shared/MonthPicker.tsx', exports: ['MonthPicker'] },
    { path: '_shared/MonthPicker.module.css', exports: [] },
    { path: '_shared/YearPicker.tsx', exports: ['YearPicker'] },
    { path: '_shared/YearPicker.module.css', exports: [] },
  ],

  childrenKind: 'composition' as const,

  demo: {
    controls: [
      {
        name: 'consumer.mode',
        kind: 'select',
        options: ['single', 'range', 'multiple'],
        defaultValue: 'single',
      },
      {
        name: 'consumer.numberOfMonths',
        kind: 'select',
        options: ['1', '2', '3'],
        defaultValue: '1',
      },
      { name: 'consumer.showWeekNumbers', kind: 'boolean', defaultValue: false },
      {
        name: 'playground.mode',
        kind: 'select',
        options: ['single', 'range', 'multiple'],
        defaultValue: 'single',
      },
      {
        name: 'playground.numberOfMonths',
        kind: 'select',
        options: ['1', '2', '3'],
        defaultValue: '1',
      },
      { name: 'playground.showWeekNumbers', kind: 'boolean', defaultValue: false },
      { name: 'playground.fixedWeeks', kind: 'boolean', defaultValue: false },
    ],
    sections: [
      {
        id: 'consumer',
        label: 'Consumer Samples',
        description: 'Common Calendar usage patterns',
      },
      {
        id: 'playground',
        label: 'Props Playground',
        description: 'Explore all Calendar configuration options',
      },
    ],
    renderMode: 'grid' as const,
  },

  testing: {
    cases: [
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
      'Keyboard navigation: arrow keys move focus between days',
      'Labels support customization',
      'Week numbers display when showWeekNumbers=true',
    ] as string[],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'rule-based' as const,
    overrides: {},
  },
};
