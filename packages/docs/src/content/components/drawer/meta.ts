import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'panel-right',
    text: 'Slides in from any edge — left, right, top, or bottom — with a real spring animation that respects `prefers-reduced-motion`.',
  },
  {
    icon: 'smartphone',
    text: 'Drops to a bottom sheet on mobile by default. `responsive={false}` keeps the configured edge on every viewport, `breakpoint` tunes the cut-over.',
  },
  {
    icon: 'lock',
    text: 'Modal contract from the Dialog primitive — backdrop, body-scroll lock, focus trap, Escape to dismiss. Header, Body, and Footer slots match Dialog so the content shape is familiar.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/dialog',
    name: 'Dialog',
    reason: 'When the modal should sit centered on screen instead of sliding in from an edge.',
  },
  {
    to: '/components/sidebar',
    name: 'Sidebar',
    reason: 'When the panel is permanent navigation rather than a transient flow that opens and closes.',
  },
];

export const meta: ComponentMeta = {
  slug: 'drawer',
  name: 'Drawer',
  tagline: 'A slide-in panel from any edge — perfect for filters, detail views, multi-step flows. Modal by default, bottom-sheet on mobile, full keyboard contract.',
  categories: ['overlays'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Drawer } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Cycles focus through interactive elements inside the drawer (focus is trapped).' },
    { key: 'Shift + Tab', action: 'Cycles focus in reverse.' },
    { key: 'Escape', action: 'Triggers the animated close.' },
    { key: 'Enter / Space', action: 'Activates the focused button — same as a click.' },
  ],
  accessibilityLede:
    'Built on Radix Dialog, so `role="dialog"`, `aria-modal`, focus trap, return-to-trigger, and scroll lock are all handled. Title and Description wire up `aria-labelledby` / `aria-describedby` automatically just by being children.',
};
