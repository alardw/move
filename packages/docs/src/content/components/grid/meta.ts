import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'grid-3x3',
    text: 'Three modes — equal columns (`cols={3}`), explicit grid template, and auto-fit with `minColWidth` for responsive cards without media queries.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Token-driven `gap` and `padding` (xs through xl), so spacing stays consistent across the system.',
  },
  {
    icon: 'maximize-2',
    text: '`Grid.Cell` for per-item placement — span columns, offset, change order — without leaving the component contract.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/stack',
    name: 'Stack',
    reason: 'For one-dimensional layouts. Grid is for two-dimensional ones.',
  },
  {
    to: '/components/align',
    name: 'Align',
    reason: 'When the layout is the specific "left, center, right" rhythm of a toolbar.',
  },
];

export const meta: ComponentMeta = {
  slug: 'grid',
  synonyms: ['layout grid', 'columns', 'simple grid', 'masonry', 'gallery', 'image grid'],
  name: 'Grid',
  tagline: 'A CSS grid layout primitive — equal columns, span-based, or auto-fit, with a Cell sub-component for per-item placement.',
  categories: ['layout'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
  ],
  highlights,
  related,
  importCode: `import { Grid } from 'move';`,
  keyboard: [
    { key: '—', action: 'Grid is presentational; keyboard semantics belong to the cells you put inside.' },
  ],
  accessibilityLede:
    'Grid renders a `<div>` with CSS grid layout — no roles, no ARIA. The semantics come from what you put inside it.',
};
