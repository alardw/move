import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'shapes',
    text: 'Three primitive shapes — Circle, Rectangle, Rounded — plus Text for multi-line paragraph placeholders.',
  },
  {
    icon: 'rabbit',
    text: 'Two animation modes — `pulse` (opacity loop) and `wave` (sweeping highlight). Set `animation="none"` to freeze.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/loader',
    name: 'Loader',
    reason: 'For "something is happening" without a known shape.',
  },
  {
    to: '/components/empty-state',
    name: 'EmptyState',
    reason: 'For "loaded, but empty" placeholders.',
  },
];

export const meta: ComponentMeta = {
  slug: 'skeleton',
  name: 'Skeleton',
  tagline: 'Layout-shaped loading placeholders — Circle, Rectangle, Rounded, Text — with pulse or wave animation.',
  categories: ['feedback'],
  badges: [
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Skeleton } from 'move';`,
  keyboard: [
    { key: '—', action: 'Skeletons are decorative.' },
  ],
  accessibilityLede:
    'Skeletons are `aria-hidden`. Pair them with `aria-busy="true"` on the parent loading region so assistive tech announces the loading state.',
};
