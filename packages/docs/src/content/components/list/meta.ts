import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'list',
    text: 'Three-zone item layout — Leading (avatar/icon), Content (title/description), Trailing (badge/button) — with sensible default sizing and truncation.',
  },
  {
    icon: 'minus',
    text: 'Built-in dividers between items via CSS (no per-item separator), three sizes, and density control for compact/comfortable lists.',
  },
  {
    icon: 'columns-2',
    text: 'Responsive collapse — long lists keep their structure on wide screens and stack the title + description vertically on narrow ones.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/table',
    name: 'Table',
    reason: 'When the data is tabular with multiple columns. List is for one-line-per-item with optional secondary text.',
  },
  {
    to: '/components/sidebar',
    name: 'Sidebar',
    reason: 'For navigation lists with a different visual contract.',
  },
];

export const meta: ComponentMeta = {
  slug: 'list',
  name: 'List',
  tagline: 'A structured `<ul>` with three-zone rows — leading / content / trailing — built-in dividers, density control, and responsive collapse.',
  badges: [
    { icon: 'list', label: 'Data' },
    { icon: 'boxes', label: 'Compound' },
  ],
  highlights,
  related,
  importCode: `import { List } from 'move';`,
  keyboard: [
    { key: '—', action: 'List is a presentational `<ul>`. Wrap items in Link or Button for navigation/activation.' },
  ],
  accessibilityLede:
    'Renders native `<ul>` / `<li>` elements. Make items focusable when they’re interactive (wrap them in Link or Button) — the list itself is just structure.',
};
