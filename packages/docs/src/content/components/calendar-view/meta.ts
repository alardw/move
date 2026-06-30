import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'layout-grid',
    text: 'Four views — month, week, day, agenda — controlled by a single `view` prop. Switching is instant; events keep their identities and animate between layouts.',
  },
  {
    icon: 'clock',
    text: 'Configure the visible day with `startHour` and `endHour`, change the slot height, raise or lower `slotInterval` (15 / 30 / 60 minutes) — all without touching the rendered output.',
  },
  {
    icon: 'mouse-pointer-click',
    text: '`onEventClick`, `onSlotClick`, `onDayClick`, `onAllDayClick` give you precise hooks for opening detail panels, creating new events, or routing to a daily view.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/calendar',
    name: 'Calendar',
    reason: 'For picking one or more dates inline. CalendarView is for showing what’s already on a schedule.',
  },
  {
    to: '/components/timeline',
    name: 'Timeline',
    reason: 'When the data is a sequence of events on a single axis, not a grid of weeks.',
  },
];

export const meta: ComponentDocument = {
  slug: 'calendar-view',
  synonyms: [ 'agenda', 'schedule', 'planner', 'event calendar', 'timeline calendar', 'events', 'week view', 'month view', ],
  name: 'CalendarView',
  tagline: 'A full month/week/day/agenda calendar with a real time grid, events that span days, an all-day row, and built-in controls for navigation and view switching.',
  categories: ['date-time'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
  ],
  highlights,
  related,
  importCode: `import { CalendarView } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus between the navigation buttons, view switcher, and event tiles.' },
    { key: 'Enter / Space', action: 'Activates the focused control or event.' },
  ],
  accessibilityLede:
    'Each event tile is a real button with the event title and time as its accessible name. Day and slot click targets are buttons too — so screen-reader users can browse and act on the same surface as everyone else.',
};
