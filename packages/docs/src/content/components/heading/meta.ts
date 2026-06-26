import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'heading',
    text: 'Renders as `<h1>` through `<h6>` based on the `level` prop — semantic by default, with size derived from the level (overridable).',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Independent visual size and semantic level — render an `<h2>` styled like an `<h4>` (`level={2} size="md"`) without breaking document outline.',
  },
  {
    icon: 'minus',
    text: '`truncate` clamps to a single line with ellipsis — useful in cards and table cells where headings need to fit a fixed width.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/text',
    name: 'Text',
    reason: 'For body copy. Heading is for titles.',
  },
  {
    to: '/components/prose',
    name: 'Prose',
    reason: 'For long-form content with mixed headings, paragraphs, and inline elements.',
  },
];

export const meta: ComponentMeta = {
  slug: 'heading',
  name: 'Heading',
  tagline: 'Semantic heading h1–h6 with weight, colour, alignment, and truncation — size follows the level.',
  categories: ['typography'],
  badges: [
  ],
  highlights,
  related,
  importCode: `import { Heading } from 'move';`,
  keyboard: [
    { key: '—', action: 'Heading is presentational; no keyboard interaction.' },
  ],
  accessibilityLede:
    'Always renders the right HTML heading tag for the level prop, so the document outline stays correct. Choose `level` for screen-reader semantics, `size` for visual weight — they’re independent.',
};
