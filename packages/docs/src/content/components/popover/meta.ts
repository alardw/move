import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'message-circle',
    text: 'A free-form anchored panel — drop any content inside (forms, info, mini-cards). Built on Radix Popover so positioning, dismissal, and focus management are solid.',
  },
  {
    icon: 'rabbit',
    text: 'Spring scale-fade enter/exit, transform-origin per side/align so the panel feels anchored to the trigger no matter where it lands.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/dropdown',
    name: 'Dropdown',
    reason: 'For menu-shaped popovers (items, separators, sub-menus). Popover is the free-form sibling.',
  },
  {
    to: '/components/tooltip',
    name: 'Tooltip',
    reason: 'For tiny labels on hover. Popover is for click-to-open content with focusable elements inside.',
  },
];

export const meta: ComponentMeta = {
  slug: 'popover',
  name: 'Popover',
  tagline: 'A click-to-open anchored panel for any content — forms, mini-cards, inspectors. Real focus contract from Radix.',
  badges: [
    { icon: 'message-circle', label: 'Overlay' },
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Popover } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus into the panel; cycles back to trigger after the last element.' },
    { key: 'Escape', action: 'Closes the popover.' },
  ],
  accessibilityLede:
    'Built on Radix Popover — `role="dialog"`, focus management, `aria-haspopup`, return-to-trigger. The panel renders in a portal so it always sits above the page.',
};
