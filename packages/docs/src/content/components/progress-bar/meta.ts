import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'square',
    text: 'Determinate or indeterminate — pass a `value` (0–100) for a real percentage, or omit it for a striped indeterminate state.',
  },
  {
    icon: 'palette',
    text: 'Variants for primary, success, warning, danger and three sizes — token-driven, so the bar matches the surrounding control density.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/loader',
    name: 'Loader',
    reason: 'For "something is happening" without a percentage.',
  },
  {
    to: '/components/skeleton',
    name: 'Skeleton',
    reason: 'For layout-shaped placeholders while data loads.',
  },
];

export const meta: ComponentMeta = {
  slug: 'progress-bar',
  name: 'ProgressBar',
  tagline: 'A horizontal progress indicator — determinate (with %) or indeterminate (striped), tokenised for variant and size.',
  badges: [
    { icon: 'loader-2', label: 'Loading' },
  ],
  highlights,
  related,
  importCode: `import { ProgressBar } from 'move';`,
  keyboard: [
    { key: '—', action: 'ProgressBar is presentational. Use a labelled wrapper if the percentage matters semantically.' },
  ],
  accessibilityLede:
    'Renders with `role="progressbar"` and `aria-valuemin`/`max`/`now` (when determinate). Indeterminate progress sets `aria-valuenow` to undefined per ARIA spec.',
};
