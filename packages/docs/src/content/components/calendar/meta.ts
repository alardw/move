import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'calendar',
    text: 'Three selection modes — `single`, `range`, `multiple` — share the same grid, the same keyboard contract, and the same render hooks.',
  },
  {
    icon: 'globe',
    text: 'Locale-aware out of the box — pass `locale="nl-NL"` and the day names, month names, and week start flip without you touching the rest of the page.',
  },
  {
    icon: 'sparkles',
    text: 'Pass `events` and the grid renders dots, badges, or your own JSX per day via `renderEvent`. Constraints (`min`, `max`, `disabledDates`, `disabledDaysOfWeek`) keep the user out of date ranges that aren’t selectable.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/calendar-view',
    name: 'CalendarView',
    reason: 'When the calendar is the page — month/week/day/agenda views, time grid, event detail. Calendar is for picking dates.',
  },
  {
    to: '/components/date-picker',
    name: 'DatePicker',
    reason: 'For inline form date entry. DatePicker wraps Calendar inside a popover with a text input.',
  },
];

export const meta: ComponentDocument = {
  slug: 'calendar',
  synonyms: ['date picker grid', 'datepicker', 'month grid', 'date grid', 'schedule'],
  preview: { width: 'fit' },
  name: 'Calendar',
  tagline: 'A date-selection grid with single, range, and multi modes — locale-aware, keyboard-driven, and willing to show event dots when you have them.',
  categories: ['date-time'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Calendar } from 'move';`,
  keyboard: [
    { key: 'Arrow keys', action: 'Move focus between days, weeks, and grid edges.' },
    { key: 'Enter / Space', action: 'Selects (or toggles) the focused day.' },
    { key: 'Home / End', action: 'Jumps to the start / end of the focused week.' },
    { key: 'Page Up / Down', action: 'Moves to the previous / next month.' },
    { key: 'Shift + Page Up / Down', action: 'Moves to the previous / next year.' },
  ],
  accessibilityLede:
    'Each day is a real button with an `aria-label` containing the full date. Selected, today, in-range, and disabled states are all reflected on `data-` attributes and through ARIA — screen readers announce the right thing without you wiring labels by hand.',
};
