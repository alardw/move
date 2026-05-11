import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'message-square',
    text: 'Hover (or focus) to reveal a small label — built on Radix Tooltip with proper delay groups so opening one warm-tooltip skips the delay on the next.',
  },
  {
    icon: 'rabbit',
    text: 'Spring fade-and-scale enter/exit, position-aware transform-origin so the tooltip feels anchored to its trigger.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/popover',
    name: 'Popover',
    reason: 'For click-to-open content with focusable elements inside. Tooltip is for tiny labels.',
  },
];

export const meta: ComponentMeta = {
  slug: 'tooltip',
  name: 'Tooltip',
  tagline: 'A small hover/focus label — Radix-backed, delay-grouped, animated, with the right ARIA semantics.',
  badges: [
    { icon: 'message-square', label: 'Overlay' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Tooltip } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Focusing the trigger reveals the tooltip.' },
    { key: 'Escape', action: 'Hides the tooltip.' },
  ],
  accessibilityLede:
    'Built on Radix Tooltip — `role="tooltip"` and `aria-describedby` on the trigger. Tooltips never trap focus; they’re strictly informational.',
};
