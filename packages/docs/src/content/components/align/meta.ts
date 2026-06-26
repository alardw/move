import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'columns-3',
    text: 'Three slots — Start, Center, End — distributed on a `1fr auto 1fr` grid, so the centre stays centred even when one side is heavier than the other.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Pick the vertical alignment with `align` (start / center / end / stretch / baseline) and the horizontal gap with `gap` — token-driven, no inline styles.',
  },
  {
    icon: 'maximize-2',
    text: 'Drop a slot to get a clean two-up layout. Add `padding` to wrap the bar in spacing without a Box around it.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/stack',
    name: 'Stack',
    reason: 'For one-dimensional layouts where children flow naturally — Align is for the specific "left, middle, right" rhythm.',
  },
  {
    to: '/components/grid',
    name: 'Grid',
    reason: 'When you need more than three sections or asymmetric column tracks. Align is the constrained, opinionated cousin.',
  },
];

export const meta: ComponentMeta = {
  slug: 'align',
  preview: { width: 'full' },
  name: 'Align',
  tagline: 'A three-slot bar — Start, Center, End — for app headers, page titles, dialog footers, and any toolbar that wants its centre to stay centred.',
  badges: [
    { icon: 'columns-3', label: 'Layout' },
    { icon: 'boxes', label: 'Compound' },
  ],
  highlights,
  related,
  importCode: `import { Align } from 'move';`,
  keyboard: [
    { key: '—', action: 'Align is a layout primitive with no interactive behavior of its own.' },
  ],
  accessibilityLede:
    'Align is purely presentational — it does not add roles, focus, or ARIA. The semantics come from whatever you put inside the slots: a `<nav>` for navigation, a `<header>` if you wrap it, buttons that are buttons, links that are links.',
};
