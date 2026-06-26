import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'type',
    text: 'Token-driven `size`, `weight`, `color`, `align`, `tracking` — the most-reached-for body text component.',
  },
  {
    icon: 'shapes',
    text: '`as` lets you render as `span`, `p`, `strong`, etc. without losing the typography props.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/heading',
    name: 'Heading',
    reason: 'For titles. Text is for body copy.',
  },
  {
    to: '/components/prose',
    name: 'Prose',
    reason: 'For long-form content with mixed elements.',
  },
];

export const meta: ComponentMeta = {
  slug: 'text',
  name: 'Text',
  tagline: 'A typography primitive for body copy — size, weight, colour, alignment, and a polymorphic `as`.',
  categories: ['typography'],
  badges: [
  ],
  highlights,
  related,
  importCode: `import { Text } from 'move';`,
  keyboard: [
    { key: '—', action: 'Text is presentational.' },
  ],
  accessibilityLede:
    'Renders `<p>` by default, `<span>` when `as="span"`. The polymorphic `as` lets you reach for the right semantic element without losing the typography props.',
};
