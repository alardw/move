import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'loader-circle',
    text: 'A token-driven indeterminate loader — three sizes, theme-aware colour, smooth animation that respects `prefers-reduced-motion`.',
  },
  {
    icon: 'rabbit',
    text: 'Loops at compositor-friendly speed using anime.js — no layout thrash, no JS-bound jank.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/skeleton',
    name: 'Skeleton',
    reason: 'For layout-shaped placeholders. Loader is for "something is happening" without a known shape.',
  },
  {
    to: '/components/progress-bar',
    name: 'ProgressBar',
    reason: 'When you have a real progress percentage to show.',
  },
];

export const meta: ComponentDocument = {
  slug: 'loader',
  synonyms: ['spinner', 'loading', 'wait', 'progress indicator', 'busy indicator'],
  preview: { width: 'fit' },
  name: 'Loader',
  tagline: 'An indeterminate loading indicator — three sizes, theme-aware colour, GPU-friendly loop.',
  categories: ['feedback'],
  badges: [
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Loader } from 'move';`,
  keyboard: [
    { key: '—', action: 'Loader is purely visual. Pair with `aria-busy` on the surrounding region for assistive tech.' },
  ],
  accessibilityLede:
    'Loader has `aria-hidden="true"` since it’s decorative. Set `aria-busy="true"` on the actual loading region (e.g. a `role="status"` block) so screen readers know the content is in progress.',
};
