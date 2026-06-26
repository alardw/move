import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'clock',
    text: 'Hour and minute number fields with optional AM/PM toggle and an optional seconds field — switchable between 12- and 24-hour cycles.',
  },
  {
    icon: 'keyboard',
    text: 'Type to edit, Tab between fields, Arrow keys step by 1 (or `step` minutes for the minute field). Each field is a real number input.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/date-picker',
    name: 'DatePicker',
    reason: 'For picking a date with optional time. DatePicker uses TimeField internally when `showTime` is on.',
  },
];

export const meta: ComponentMeta = {
  slug: 'time-field',
  preview: { width: 'fit' },
  name: 'TimeField',
  tagline: 'A time input with hour, minute, optional seconds, and optional AM/PM — typed and tab-able like a real form field.',
  categories: ['date-time', 'forms'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
  ],
  highlights,
  related,
  importCode: `import { TimeField } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves between hour, minute, period (AM/PM).' },
    { key: 'Arrow Up / Down', action: 'Steps the focused field.' },
    { key: 'Type', action: 'Replaces the focused field.' },
  ],
  accessibilityLede:
    'Each field is a real `<input inputMode="numeric">`. The Period toggle is a labelled button. Pair with FormField + Label for accessible labelling.',
};
