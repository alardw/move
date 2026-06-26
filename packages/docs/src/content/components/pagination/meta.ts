import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'arrow-left-right',
    text: 'Prev/next triggers, numbered page buttons, an ellipsis when ranges are long, and a sliding indicator that follows the active page.',
  },
  {
    icon: 'rabbit',
    text: 'Indicator slides between buttons with a real spring; entrance staggers in. Subtle, but it makes the control feel responsive.',
  },
  {
    icon: 'eye',
    text: 'Renders as `<nav aria-label="Pagination">` with `aria-current="page"` on the active button — screen readers announce the right thing.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/table',
    name: 'Table',
    reason: 'Tabular data often pairs with Pagination at the bottom.',
  },
];

export const meta: ComponentMeta = {
  slug: 'pagination',
  name: 'Pagination',
  tagline: 'A page navigator with prev/next, numbered buttons, ellipsis collapse, and a sliding active indicator.',
  categories: ['navigation'],
  badges: [
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Pagination } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus through prev → page numbers → next.' },
    { key: 'Enter / Space', action: 'Activates the focused button.' },
  ],
  accessibilityLede:
    'Renders `<nav aria-label="Pagination">` with `aria-current="page"` on the active page. Each page is a real button with an `aria-label` containing the full "Go to page N" text.',
};
