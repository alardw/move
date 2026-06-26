import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'calendar',
    text: 'Single, range, multi — three picker modes share the same trigger and popover. Type a date by hand, or click in to a real calendar grid.',
  },
  {
    icon: 'clock',
    text: 'Pass `showTime` and the popover gains a time field beneath the calendar — useful for scheduling, deadlines, anything where the hour matters.',
  },
  {
    icon: 'globe',
    text: 'Locale-aware: month names, week start, formatting all flip with `locale="nl-NL"` (or any BCP-47 tag). Constraints (`min`, `max`, disabled days) keep the user inside valid ranges.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/calendar',
    name: 'Calendar',
    reason: 'For inline date selection without a popover or text input.',
  },
  {
    to: '/components/calendar-view',
    name: 'CalendarView',
    reason: 'When the calendar is the page (events, agenda, time grid). DatePicker is for picking dates inside a form.',
  },
];

export const meta: ComponentMeta = {
  slug: 'date-picker',
  preview: { width: 'fit' },
  name: 'DatePicker',
  tagline: 'A date input with a popover calendar — single date, range, or multi-select, with optional time picker, sensible localisation, and a real keyboard contract.',
  categories: ['date-time', 'forms'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { DatePicker } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus into the input, then to the calendar trigger.' },
    { key: 'Arrow keys', action: 'Inside the calendar — moves between days, weeks, and grid edges.' },
    { key: 'Enter / Space', action: 'Selects the focused day.' },
    { key: 'Escape', action: 'Closes the popover.' },
  ],
  accessibilityLede:
    'The trigger area is a non-button anchor (because a button containing inputs is invalid HTML), but the input itself is a real `<input>` with date-format aware parsing. The popover is a `role="dialog"` from Radix; calendar days inside it are focusable buttons with full date `aria-label`s.',
};
