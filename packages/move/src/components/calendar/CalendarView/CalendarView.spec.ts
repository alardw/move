// CalendarView.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 7 as const,
  name: 'CalendarView',
  componentClass: 'display' as const,
  category: 'calendar',
  description:
    'Full-featured calendar view supporting day, week, month, and agenda modes with event display, time grid, locale-aware formatting, and view switching',

  // Compound pattern — plain object with multiple sub-components
  compound: {
    pattern: 'object' as const,
    subComponents: ['Root', 'Header', 'Nav', 'Title', 'Today', 'ViewSwitcher', 'Body'] as string[],
  },

  anatomy: ['Root', 'Header', 'Nav', 'Title', 'Today', 'ViewSwitcher', 'Body'] as string[],

  slots: ['root', 'header', 'nav', 'title', 'today', 'viewSwitcher', 'body'] as string[],

  props: {
    Root: [
      'view',
      'defaultView',
      'onViewChange',
      'date',
      'defaultDate',
      'onDateChange',
      'events',
      'locale',
      'weekStartsOn',
      'startHour',
      'endHour',
      'slotHeight',
      'slotInterval',
      'maxEventsPerCell',
      'renderEvent',
      'onEventClick',
      'onSlotClick',
      'onDayClick',
      'onAllDayClick',
      'showAllDay',
      'labels',
      'children',
      'className',
      'style',
    ] as string[],
    Header: ['children', 'className', 'style'] as string[],
    Nav: ['className'] as string[],
    Title: ['className'] as string[],
    Today: ['children', 'className'] as string[],
    ViewSwitcher: ['views', 'className'] as string[],
    Body: ['className', 'style'] as string[],
  },

  defaults: {
    view: 'month',
    date: 'new Date()',
    events: [] as unknown[],
    locale: 'en-US',
    startHour: 0,
    endHour: 24,
    slotInterval: 60,
    maxEventsPerCell: 3,
    showAllDay: false,
  },

  moveProps: [
    'view',
    'defaultView',
    'onViewChange',
    'date',
    'defaultDate',
    'onDateChange',
    'events',
    'locale',
    'weekStartsOn',
    'startHour',
    'endHour',
    'slotHeight',
    'slotInterval',
    'maxEventsPerCell',
    'renderEvent',
    'onEventClick',
    'onSlotClick',
    'onDayClick',
    'onAllDayClick',
    'showAllDay',
    'labels',
  ] as string[],

  variants: null,
  sizes: null,

  controlled: { pattern: 'value' as const },
  controlledProps: {
    view: {
      prop: 'view',
      defaultProp: 'defaultView',
      onChange: 'onViewChange',
    },
    date: {
      prop: 'date',
      defaultProp: 'defaultDate',
      onChange: 'onDateChange',
    },
  },

  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  dismissBehavior: null,

  renderContracts: [
    'Root provides CalendarViewContext consumed by Header, Nav, Title, Today, ViewSwitcher, and Body',
    'Root delegates all state management to useCalendarView hook',
    'Nav uses Button sub-components with chevron icons for prev/next navigation',
    'Nav reads goToPrev, goToNext, labels from CalendarViewContext',
    'Title reads computed title string from context and renders as h2 with aria-live="polite"',
    'Today reads goToToday and labels.today from context; renders as Button',
    'ViewSwitcher uses ToggleGroup.Root/Item to switch between view modes',
    'ViewSwitcher reads view, setView, labels from CalendarViewContext',
    'ViewSwitcher defaults to all four views: day, week, month, agenda',
    'Body conditionally renders DayView, WeekView, MonthView, or AgendaView based on current view',
    'Body passes all relevant props from context to the active view sub-component',
    'MonthView click on day cell navigates to day view (calls setDate + setView("day"))',
    'MonthView overflow events show popover via Radix Popover',
    'DayView/WeekView render TimeGrid for timed events and separate all-day section',
    'AgendaView groups events by day and shows empty message when no events',
    'useCalendarView uses useControlledState for both view and date',
    'Navigation adapts to view: day +/-1 day, week +/-7 days, month/agenda +/-1 month',
  ] as string[],

  // === Animation ===
  // CalendarView has no direct animations — the internal sub-views are plain React components.
  // ToggleGroup (ViewSwitcher) provides its own sliding indicator animation.
  animations: [],



  labels: {
    today: 'Today',
    previous: 'Previous',
    next: 'Next',
    calendarView: 'Calendar view',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    agenda: 'Agenda',
    allDay: 'All day',
    noEvents: 'No events in this period',
    more: '(count: number) => `+${count} more`',
  },

  tokens: [
    // Root
    { name: '--move-calendarview-bg', value: 'transparent', slot: 'root' },
    { name: '--move-calendarview-font', value: 'var(--move-font-body)', slot: 'root' },

    // Header
    { name: '--move-calendarview-header-padding', value: 'var(--move-spacing-md)', slot: 'header' },

    // Title
    { name: '--move-calendarview-title-font-size', value: 'var(--move-size-lg)', slot: 'title' },
    { name: '--move-calendarview-title-font-weight', value: 'var(--move-weight-semibold)', slot: 'title' },
    { name: '--move-calendarview-title-fg', value: 'var(--move-fg-base)', slot: 'title' },

    // MonthView
    { name: '--move-calendarview-month-header-font-size', value: 'var(--move-size-xs)', slot: 'monthWeekHeader' },
    { name: '--move-calendarview-month-header-fg', value: 'var(--move-fg-muted)', slot: 'monthWeekHeader' },
    { name: '--move-calendarview-month-cell-border', value: 'var(--move-border-base)', slot: 'monthDayCell' },
    { name: '--move-calendarview-month-cell-bg-hover', value: 'var(--move-bg-subtle)', slot: 'monthDayCell' },
    { name: '--move-calendarview-month-cell-bg-today', value: 'color-mix(in srgb, var(--move-primary-subtle) 30%, transparent)', slot: 'monthDayCell' },
    { name: '--move-calendarview-month-day-fg', value: 'var(--move-fg-base)', slot: 'monthDayNumber' },
    { name: '--move-calendarview-month-today-bg', value: 'var(--move-primary)', slot: 'monthDayNumber' },
    { name: '--move-calendarview-month-today-fg', value: 'var(--move-primary-fg)', slot: 'monthDayNumber' },
    { name: '--move-calendarview-month-more-fg', value: 'var(--move-fg-muted)', slot: 'monthMoreButton' },
    { name: '--move-calendarview-month-popover-bg', value: 'var(--move-bg-subtle)', slot: 'monthMorePopover' },
    { name: '--move-calendarview-month-popover-border', value: 'var(--move-border-base)', slot: 'monthMorePopover' },
    { name: '--move-calendarview-month-popover-radius', value: 'var(--move-rounded-lg)', slot: 'monthMorePopover' },
    { name: '--move-calendarview-month-popover-shadow', value: 'var(--move-shadow-default)', slot: 'monthMorePopover' },

    // WeekView / DayView headers
    { name: '--move-calendarview-dayheader-font-size', value: 'var(--move-size-sm)', slot: 'dayHeader' },
    { name: '--move-calendarview-dayheader-fg', value: 'var(--move-fg-base)', slot: 'dayHeader' },
    { name: '--move-calendarview-dayheader-today-fg', value: 'var(--move-primary)', slot: 'dayHeader' },

    // All-day section
    { name: '--move-calendarview-allday-label-font-size', value: 'var(--move-size-xs)', slot: 'allDayLabel' },
    { name: '--move-calendarview-allday-label-fg', value: 'var(--move-fg-muted)', slot: 'allDayLabel' },

    // AgendaView
    { name: '--move-calendarview-agenda-date-font-size', value: 'var(--move-size-lg)', slot: 'agendaDayHeader' },
    { name: '--move-calendarview-agenda-date-fg', value: 'var(--move-fg-base)', slot: 'agendaDayHeader' },
    { name: '--move-calendarview-agenda-day-fg', value: 'var(--move-fg-muted)', slot: 'agendaDayHeader' },
    { name: '--move-calendarview-agenda-today-bg', value: 'var(--move-primary)', slot: 'agendaDayHeader' },
    { name: '--move-calendarview-agenda-today-fg', value: 'var(--move-primary-fg)', slot: 'agendaDayHeader' },
    { name: '--move-calendarview-agenda-empty-fg', value: 'var(--move-fg-muted)', slot: 'agendaEmpty' },
    { name: '--move-calendarview-agenda-header-border', value: 'var(--move-border-base)', slot: 'agendaDayHeader' },
  ],

  hasHook: true,
  radixPrimitive: null,

  a11y: {
    role: null,
    focusPattern: null,
    keyboardPattern: null,
    attributes: [
      'aria-live="polite" on Title element for view/date change announcements',
      'aria-label on Nav buttons (Previous / Next)',
      'aria-label on ViewSwitcher (Calendar view)',
      'Today button is an actionable element',
      'MonthView day cells are clickable (navigates to day view)',
      'TimeGrid clickable slots announce time context',
      'All-day empty slots get role="button" when onAllDayClick is provided',
    ] as string[],
  },

  componentDeps: ['Button', 'Icon', 'ToggleGroup'] as string[],

  // Shared infrastructure files used by both Calendar and CalendarView.
  // These are the same files referenced in Calendar.spec.ts and must be
  // generated into src/components/calendar/_shared/.
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
    { path: '_shared/TimeGrid.tsx', exports: ['TimeGrid'] },
    { path: '_shared/TimeGrid.module.css', exports: [] },
  ],

  // CalendarView-specific internal files (sub-views)
  internalFiles: [
    { path: 'DayView.tsx', exports: ['DayView'] },
    { path: 'DayView.module.css', exports: [] },
    { path: 'WeekView.tsx', exports: ['WeekView'] },
    { path: 'WeekView.module.css', exports: [] },
    { path: 'MonthView.tsx', exports: ['MonthView'] },
    { path: 'MonthView.module.css', exports: [] },
    { path: 'AgendaView.tsx', exports: ['AgendaView'] },
    { path: 'AgendaView.module.css', exports: [] },
    { path: 'useCalendarView.ts', exports: ['useCalendarView', 'UseCalendarViewOptions', 'UseCalendarViewReturn', 'CalendarViewLabels'] },
  ],

  childrenKind: 'composition' as const,

  demo: {
    controls: [
      {
        name: 'consumer.view',
        kind: 'select',
        options: ['day', 'week', 'month', 'agenda'],
        defaultValue: 'month',
      },
      { name: 'consumer.startHour', kind: 'number', defaultValue: 0 },
      { name: 'consumer.endHour', kind: 'number', defaultValue: 24 },
      {
        name: 'consumer.slotInterval',
        kind: 'select',
        options: ['30', '60'],
        defaultValue: '60',
      },
      { name: 'consumer.showAllDay', kind: 'boolean', defaultValue: false },
      {
        name: 'playground.view',
        kind: 'select',
        options: ['day', 'week', 'month', 'agenda'],
        defaultValue: 'month',
      },
      { name: 'playground.maxEventsPerCell', kind: 'number', defaultValue: 3 },
    ],
    sections: [
      {
        id: 'consumer',
        label: 'Consumer Samples',
        description: 'Common CalendarView usage patterns with events',
      },
      {
        id: 'playground',
        label: 'Props Playground',
        description: 'Explore all CalendarView configuration options',
      },
    ],
    renderMode: 'grid' as const,
  },

  testing: {
    cases: [
      'Root renders children within CalendarViewContext provider',
      'Root forwards className and style',
      'Root defaults to view=month',
      'Root defaults to date=new Date()',
      'Header renders children with flex layout',
      'Nav renders previous and next buttons',
      'Nav previous button calls goToPrev',
      'Nav next button calls goToNext',
      'Title renders h2 with aria-live="polite"',
      'Title displays computed title string based on current view and date',
      'Title updates when view or date changes',
      'Today button calls goToToday',
      'Today button displays labels.today text',
      'ViewSwitcher renders ToggleGroup with view options',
      'ViewSwitcher defaults to all four views: day, week, month, agenda',
      'ViewSwitcher respects custom views prop to show subset',
      'ViewSwitcher calls setView on selection change',
      'Body renders DayView when view=day',
      'Body renders WeekView when view=week',
      'Body renders MonthView when view=month',
      'Body renders AgendaView when view=agenda',
      'DayView renders TimeGrid for timed events',
      'DayView shows all-day section when all-day events exist or showAllDay=true',
      'WeekView renders 7-day TimeGrid',
      'WeekView shows day headers with today highlighting',
      'MonthView renders week day headers',
      'MonthView renders day cells in grid layout',
      'MonthView highlights today with data-today',
      'MonthView dims outside-month days with data-outside',
      'MonthView shows overflow popover when events exceed maxEventsPerCell',
      'MonthView day click navigates to day view',
      'AgendaView groups events by day',
      'AgendaView shows empty message when no events',
      'AgendaView highlights today in day headers',
      'Controlled view prop overrides internal state',
      'onViewChange fires when view changes',
      'Controlled date prop overrides internal state',
      'onDateChange fires when date changes',
      'Labels support full customization',
      'Navigation: day view navigates by +/-1 day',
      'Navigation: week view navigates by +/-7 days',
      'Navigation: month view navigates by +/-1 month',
      'Navigation: agenda view navigates by +/-1 month',
      'useCalendarView hook returns expected interface',
    ] as string[],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
};
