// CalendarView.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'CalendarView',
  componentClass: 'display' as const,
  category: 'date-time',
  description:
    'Full-featured calendar view supporting day, week, month, and agenda modes with event display, time grid, locale-aware formatting, and view switching',

  synonyms: [
    'agenda',
    'schedule',
    'planner',
    'event calendar',
    'timeline calendar',
    'events',
    'week view',
    'month view',
  ],
  families: {
    behavior: ['display'],
    state: ['controlled-value'],
    a11y: ['none'],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description: 'CalendarView context container that wraps Header and Body',
    },
    {
      name: 'header',
      element: 'div',
      description: 'Toolbar area for Nav, Title, Today and ViewSwitcher composition',
    },
    { name: 'nav', element: 'div', description: 'Previous/next navigation button group' },
    {
      name: 'title',
      element: 'h2',
      description: 'Localized title heading announcing current view and date range',
    },
    { name: 'today', element: 'button', description: 'Button that resets the date to today' },
    {
      name: 'viewSwitcher',
      element: 'div',
      description: 'ToggleGroup for switching between day/week/month/agenda views',
    },
    {
      name: 'body',
      element: 'div',
      description:
        'Container that renders the active view (DayView, WeekView, MonthView, or AgendaView)',
    },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'div', description: 'CalendarView context container' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'CalendarView.Header and CalendarView.Body composition',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'view',
          typeRef: 'CalendarViewMode',
          moveSpecific: true,
          description: 'Controlled current view (day | week | month | agenda)',
        },
        {
          name: 'defaultView',
          typeRef: 'CalendarViewMode',
          default: "'month'",
          moveSpecific: true,
          description: 'Initial view when uncontrolled',
        },
        {
          name: 'onViewChange',
          type: '(view: CalendarViewMode) => void',
          moveSpecific: true,
          description: 'Called when the view changes',
        },
        {
          name: 'date',
          type: 'Date',
          moveSpecific: true,
          description: 'Controlled focus date driving the displayed range',
        },
        {
          name: 'defaultDate',
          type: 'Date',
          default: 'new Date()',
          moveSpecific: true,
          description: 'Initial focus date when uncontrolled',
        },
        {
          name: 'onDateChange',
          type: '(date: Date) => void',
          moveSpecific: true,
          description: 'Called when the focus date changes',
        },
        {
          name: 'events',
          typeRef: 'CalendarEvent[]',
          default: '[]',
          moveSpecific: true,
          description: 'List of events to display across views',
        },
        {
          name: 'locale',
          type: 'string',
          default: "'en-US'",
          moveSpecific: true,
          description: 'BCP-47 locale tag for date and time formatting',
        },
        {
          name: 'weekStartsOn',
          type: 'number',
          moveSpecific: true,
          description: 'First day of week (0=Sunday, 1=Monday); defaults from locale',
        },
        {
          name: 'startHour',
          type: 'number',
          default: '0',
          moveSpecific: true,
          description: 'First hour shown in day/week time grid (0-23)',
        },
        {
          name: 'endHour',
          type: 'number',
          default: '24',
          moveSpecific: true,
          description: 'Last hour shown in day/week time grid (1-24)',
        },
        {
          name: 'slotHeight',
          type: 'string',
          moveSpecific: true,
          description: 'CSS height for each time slot row in the day/week time grid',
        },
        {
          name: 'slotInterval',
          type: '30 | 60',
          default: '60',
          moveSpecific: true,
          description: 'Time slot granularity in minutes',
        },
        {
          name: 'maxEventsPerCell',
          type: 'number',
          default: '3',
          moveSpecific: true,
          description: 'Maximum visible events per month cell before overflow popover',
        },
        {
          name: 'renderEvent',
          typeRef: 'RenderEvent',
          moveSpecific: true,
          description: 'Custom renderer for an event chip',
        },
        {
          name: 'onEventClick',
          type: '(event: CalendarEvent, e: React.MouseEvent) => void',
          moveSpecific: true,
          description: 'Called when an event chip is clicked',
        },
        {
          name: 'onSlotClick',
          type: '(date: Date, e: React.MouseEvent) => void',
          moveSpecific: true,
          description: 'Called when an empty time slot is clicked (day/week views)',
        },
        {
          name: 'onDayClick',
          type: '(date: Date, e: React.MouseEvent) => void',
          moveSpecific: true,
          description:
            'Called when a day cell is clicked (month view); navigates to day view by default',
        },
        {
          name: 'onAllDayClick',
          type: '(date: Date, e: React.MouseEvent) => void',
          moveSpecific: true,
          description: 'Called when an empty all-day slot is clicked (day/week views)',
        },
        {
          name: 'showAllDay',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Always show the all-day section in day/week views',
        },
        {
          name: 'labels',
          typeRef: 'CalendarViewLabels',
          moveSpecific: true,
          description:
            'Localizable strings for nav, today, view switcher, all-day, empty agenda, and overflow',
        },
      ],
      usesFactory: false,
      description:
        'Stateful root that creates CalendarViewContext via useCalendarView and renders children',
    },
    {
      name: 'Header',
      slots: [{ name: 'header', element: 'div', description: 'Toolbar area' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Header composition (Nav, Title, Today, ViewSwitcher)',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
      ],
      usesFactory: false,
      description:
        'Flex toolbar slot that composes navigation, title, today and view-switcher controls',
    },
    {
      name: 'Nav',
      slots: [{ name: 'nav', element: 'div', description: 'Previous/next button group' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
      ],
      usesFactory: false,
      description:
        'Button.Group with previous/next chevron buttons that read goToPrev/goToNext from CalendarViewContext',
    },
    {
      name: 'Title',
      slots: [{ name: 'title', element: 'h2', description: 'Localized title heading' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
      ],
      usesFactory: false,
      description:
        'h2 element with aria-live="polite" announcing the computed title from CalendarViewContext',
    },
    {
      name: 'Today',
      slots: [{ name: 'today', element: 'button', description: 'Today button' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Custom button label; defaults to labels.today',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
      ],
      usesFactory: false,
      description: 'Secondary Button that calls goToToday on click',
    },
    {
      name: 'ViewSwitcher',
      slots: [{ name: 'viewSwitcher', element: 'div', description: 'View switcher toggle group' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'views',
          typeRef: 'CalendarViewMode[]',
          default: "['day', 'week', 'month', 'agenda']",
          moveSpecific: true,
          description: 'Subset of views to expose in the switcher',
        },
      ],
      usesFactory: false,
      description:
        'ToggleGroup that reads view/setView from context and switches between day/week/month/agenda',
    },
    {
      name: 'Body',
      slots: [{ name: 'body', element: 'div', description: 'Active view container' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
      ],
      usesFactory: false,
      description:
        'Conditionally renders DayView, WeekView, MonthView, or AgendaView based on the current view, forwarding context props',
    },
  ],

  props: [],

  anatomy: {
    slot: 'root',
    children: [
      {
        slot: 'header',
        children: [
          { slot: 'nav', ariaAttributes: ['aria-label="Previous"', 'aria-label="Next"'] },
          { slot: 'title', ariaAttributes: ['aria-live="polite"'] },
          { slot: 'today' },
          { slot: 'viewSwitcher', ariaAttributes: ['aria-label="Calendar view"'] },
        ],
      },
      {
        slot: 'body',
      },
    ],
  },

  controlled: 'value' as const,
  controlledProps: {
    valueProp: 'view',
    defaultValueProp: 'defaultView',
    onChangeProp: 'onViewChange',
  },
  keyboard: 'none' as const,
  focus: 'none' as const,
  formType: null,
  asChild: false,

  animations: [],

  renderContracts: [
    {
      id: 'root-provides-context',
      description:
        'Root provides CalendarViewContext consumed by Header, Nav, Title, Today, ViewSwitcher, and Body',
    },
    {
      id: 'root-delegates-to-hook',
      description:
        'Root delegates all state management (view, date, navigation) to the useCalendarView hook',
    },
    {
      id: 'nav-uses-button-group',
      description:
        'Nav uses Button.Group with chevron icons for prev/next navigation; reads goToPrev, goToNext, labels from CalendarViewContext',
    },
    {
      id: 'title-aria-live',
      description:
        'Title reads computed title string from context and renders as h2 with aria-live="polite" for view/date change announcements',
    },
    {
      id: 'today-button',
      description:
        'Today reads goToToday and labels.today from context; renders as Button and uses children when provided',
    },
    {
      id: 'view-switcher-toggle-group',
      description:
        'ViewSwitcher uses ToggleGroup.Root/Item to switch between view modes; reads view, setView, labels from CalendarViewContext',
    },
    {
      id: 'view-switcher-default-views',
      description:
        'ViewSwitcher defaults to all four views (day, week, month, agenda) and respects a custom views prop subset',
    },
    {
      id: 'body-conditional-rendering',
      description:
        'Body conditionally renders DayView, WeekView, MonthView, or AgendaView based on current view; passes all relevant props from context to the active view sub-component',
    },
    {
      id: 'month-view-day-click',
      description:
        'MonthView day click navigates to day view (calls setDate with clicked date and setView("day"))',
    },
    {
      id: 'month-view-overflow-popover',
      description:
        'MonthView shows overflow popover via Radix Popover when events exceed maxEventsPerCell',
    },
    {
      id: 'time-grid-views',
      description:
        'DayView/WeekView render TimeGrid for timed events and a separate all-day section when showAllDay is true or all-day events exist',
    },
    {
      id: 'agenda-grouping',
      description:
        'AgendaView groups events by day and shows the empty message (labels.noEvents) when no events fall within the period',
    },
    {
      id: 'use-controlled-state',
      description:
        'useCalendarView uses useControlledState for both view and date so either can be controlled or uncontrolled independently',
    },
    {
      id: 'navigation-step-by-view',
      description:
        'Navigation adapts to view: day +/-1 day, week +/-7 days, month/agenda +/-1 month',
    },
  ],

  tokens: [
    // Root
    { name: '--move-calendarview-bg', value: 'transparent', slot: 'root' },
    { name: '--move-calendarview-font', value: 'var(--move-font-body)', slot: 'root' },

    // Header
    { name: '--move-calendarview-header-padding', value: 'var(--move-spacing-md)', slot: 'header' },
  ],

  variants: {},
  sizes: [],

  labels: [
    { key: 'today', default: 'Today', description: 'Label for the Today button' },
    {
      key: 'previous',
      default: 'Previous',
      description: 'Aria label for the previous-period nav button',
    },
    { key: 'next', default: 'Next', description: 'Aria label for the next-period nav button' },
    {
      key: 'calendarView',
      default: 'Calendar view',
      description: 'Aria label for the view switcher',
    },
    { key: 'day', default: 'Day', description: 'Label for the day view in the view switcher' },
    { key: 'week', default: 'Week', description: 'Label for the week view in the view switcher' },
    {
      key: 'month',
      default: 'Month',
      description: 'Label for the month view in the view switcher',
    },
    {
      key: 'agenda',
      default: 'Agenda',
      description: 'Label for the agenda view in the view switcher',
    },
    {
      key: 'allDay',
      default: 'All day',
      description: 'Label for the all-day section in day/week views',
    },
    {
      key: 'noEvents',
      default: 'No events in this period',
      description: 'Empty-state message in agenda view',
    },
    {
      key: 'more',
      default: '(count) => `+${count} more`',
      description: 'Function returning the overflow label for month-view event cells',
    },
  ],

  radixPrimitive: null,
  hasHook: true,
  engineImports: ['useControlledState'] as string[],

  componentDeps: ['Button', 'Icon', 'ToggleGroup'] as string[],

  testing: {
    behaviors: [
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
    ],
    keyboard: [],
    aria: [
      'aria-live="polite" on Title element for view/date change announcements',
      'aria-label on Nav buttons (Previous / Next)',
      'aria-label on ViewSwitcher (Calendar view)',
      'Today button is an actionable element',
      'MonthView day cells are clickable (navigates to day view)',
      'TimeGrid clickable slots announce time context',
      'All-day empty slots get role="button" when onAllDayClick is provided',
    ],
  },

  iconsUsed: ['chevron-left', 'chevron-right'],
  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
