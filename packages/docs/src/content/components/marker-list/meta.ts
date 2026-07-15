import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'list',
    text: 'A semantic ul/ol marker list — bullets, numbers, or icons — that indents per nested level. The marker-list family, distinct from List (the structured leading/content/trailing row list).',
  },
  {
    icon: 'layers',
    text: 'Per-level markers: give the root a `markers` array (disc → circle → square) and every nested list inherits it automatically, selecting the marker for its own depth.',
  },
  {
    icon: 'hash',
    text: 'Ordered numbering (decimal / alpha / roman) via CSS counters, bullet glyphs, or a resolved Icon as the marker — rendered by the component with correct semantics, never fighting native ::marker.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/list',
    name: 'List',
    reason:
      'The other list family — structured rows with leading avatar/icon, title/description, and trailing content. MarkerList is for plain bulleted / numbered / nested content.',
  },
  {
    to: '/components/prose',
    name: 'Prose',
    reason: 'When the list is inside rendered markdown/HTML rather than composed structurally.',
  },
];

export const meta: ComponentDocument = {
  slug: 'marker-list',
  synonyms: [
    'bullet list',
    'bullets',
    'ordered list',
    'numbered list',
    'ul',
    'ol',
    'nested list',
    'outline',
  ],
  name: 'MarkerList',
  tagline:
    'A nested marker list — bullets, numbers, or icons — with per-level markers that nested lists inherit, and controllable indent.',
  categories: ['data-display'],
  badges: [{ icon: 'boxes', label: 'Compound' }],
  highlights,
  related,
  importCode: `import { MarkerList } from 'move';`,
  keyboard: [
    {
      key: '—',
      action: 'MarkerList is a presentational ul/ol. It carries no interaction of its own.',
    },
  ],
  accessibilityLede:
    'Renders native ul/ol with role="list" and real li items; ordered lists keep their ol number semantics. Bullet, number, and icon markers are decorative (aria-hidden) — the item text carries the meaning.',
};
