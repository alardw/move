import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'list',
    text: 'A scroll-aware list of section links — the active item highlights as the page scrolls past its target heading.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/sidebar',
    name: 'Sidebar',
    reason: 'For primary nav. TableOfContents is the per-page rail.',
  },
];

export const meta: ComponentDocument = {
  slug: 'table-of-contents',
  synonyms: ['toc', 'on this page', 'page nav', 'page outline', 'anchors'],
  name: 'TableOfContents',
  tagline: 'A scroll-aware page rail that highlights the active section as you scroll — useful on long docs and articles.',
  categories: ['navigation'],
  badges: [
  ],
  highlights,
  related,
  importCode: `import { TableOfContents } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus through items.' },
    { key: 'Enter', action: 'Jumps to the linked section.' },
  ],
  accessibilityLede:
    'Renders as a `<nav aria-label="Table of contents">` with an `<ul>` of `<a>` items. The active item carries `aria-current="location"`.',
};
