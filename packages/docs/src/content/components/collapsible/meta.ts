import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'rabbit',
    text: 'Real measured-height animation — no hard-coded max-heights, no clipping when content reflows. Open and close run on the compositor and respect prefers-reduced-motion.',
  },
  {
    icon: 'shapes',
    text: 'Pass `asChild` on the Trigger and Collapsible forgets it’s a button — wrap a header, a card title, or a row in a list and the click target follows.',
  },
  {
    icon: 'keyboard',
    text: 'Trigger is a real button by default — `aria-expanded` reflects open state, `aria-controls` points to the content region, and Enter/Space toggle.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/accordion',
    name: 'Accordion',
    reason: 'When you have a list of disclosures that share rules (one open at a time, or many). Collapsible is the standalone primitive.',
  },
  {
    to: '/components/dialog',
    name: 'Dialog',
    reason: 'When the hidden content needs to take over the screen instead of expanding in place.',
  },
];

export const meta: ComponentMeta = {
  slug: 'collapsible',
  preview: { width: 'xs' },
  name: 'Collapsible',
  tagline: 'A single show/hide region with a measured-height animation, an auto-rotating chevron, and a real button under the trigger.',
  badges: [
    { icon: 'chevron-down', label: 'Disclosure' },
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Collapsible } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the trigger.' },
    { key: 'Enter / Space', action: 'Toggles the panel.' },
  ],
  accessibilityLede:
    'The Trigger renders as `<button aria-expanded aria-controls>` and the Content gets a matching `id` — so screen readers announce expanded/collapsed state and can jump to the disclosed region. `data-state` on root and trigger reflects the current state for styling.',
};
