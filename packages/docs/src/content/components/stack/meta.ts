import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'rows',
    text: 'A flexbox layout primitive with token-driven `gap`, `padding`, alignment, and direction. The most-reached-for layout component in any Move app.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Pass `direction="row"` or `"column"`, set `gap`/`padding` from the token scale, control `align` and `justify`. No raw CSS, no media queries.',
  },
  {
    icon: 'wrap-text',
    text: '`wrap` flips wrapping on; `flex={1}` makes the Stack grow to fill its parent. A handful of props cover the layout work in most pages.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/grid',
    name: 'Grid',
    reason: 'When you need a 2D layout with rows and columns.',
  },
  {
    to: '/components/align',
    name: 'Align',
    reason: 'When the layout is the specific "left, center, right" rhythm of a toolbar.',
  },
];

export const meta: ComponentMeta = {
  slug: 'stack',
  name: 'Stack',
  tagline: 'A flexbox layout primitive — direction, gap, padding, align, justify, wrap, flex — driven by tokens, no CSS required.',
  categories: ['layout'],
  badges: [
  ],
  highlights,
  related,
  importCode: `import { Stack } from 'move';`,
  keyboard: [
    { key: '—', action: 'Stack is a layout container.' },
  ],
  accessibilityLede:
    'Stack renders a `<div>` with no roles. Semantics flow from the elements inside.',
};
