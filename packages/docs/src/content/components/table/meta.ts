import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  { icon: 'rows', text: 'Compound primitives that mirror the native HTML table elements — Root, Header, Body, Row, Head, Cell, Footer, Caption.' },
  { icon: 'eye', text: 'Variants for zebra striping, borders, hover highlight, and a sticky header for tall datasets.' },
  { icon: 'move-horizontal', text: 'Responsive behavior is up to you — wrap in a scrolling container, collapse to cards at narrow widths, or let the table define the page width.' },
];

const related: RelatedItem[] = [
  {
    to: '/components/list',
    name: 'List',
    reason: 'For vertical item layouts with Leading/Content/Trailing slots instead of columns.',
  },
  {
    to: '/components/data-grid',
    name: 'DataGrid',
    reason: 'When you need sorting, filtering, virtualization, or column resizing — Table is a presentation primitive.',
  },
];

export const meta: ComponentMeta = {
  slug: 'table',
  name: 'Table',
  tagline: 'Rows and columns with the frame, density, and responsive behavior you pick.',
  badges: [
    { icon: 'rows', label: 'Data' },
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Table } from 'move';`,
  // Table isn't an interactive widget — no meaningful keyboard map.
  keyboard: [],
  accessibilityLede:
    'Table renders native `<table>` semantics. Use `<caption>` (via Table.Caption) to label the dataset and keep headers in `<thead>` so screen readers announce column context for each cell.',
};
