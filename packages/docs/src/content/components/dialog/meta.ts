import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'rabbit',
    text: 'Springs in on open with a small scale-and-fade, and stays mounted long enough to spring back out — no jarring snap, no torn focus rings.',
  },
  {
    icon: 'lock',
    text: 'Modal by default — backdrop, body-scroll lock, focus trap, Escape to dismiss. Radix wires the ARIA, the focus loop, and the dismiss handlers.',
  },
  {
    icon: 'layout',
    text: 'Header, Body, Footer slots with built-in `closable` on Header — the close button is one prop, not three nested elements you have to remember to wire up.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/drawer',
    name: 'Drawer',
    reason: 'Same modal contract, but slides in from an edge — better for forms and detail panels that pair with a list view.',
  },
  {
    to: '/components/popover',
    name: 'Popover',
    reason: 'Non-modal, anchored to a trigger. For lightweight inline content that doesn’t warrant a backdrop or focus trap.',
  },
];

export const meta: ComponentMeta = {
  slug: 'dialog',
  name: 'Dialog',
  tagline: 'A modal panel for confirmations, forms, and any flow that deserves the user’s undivided attention — with a spring entrance and a real focus trap.',
  categories: ['overlays'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Dialog } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Cycles focus through interactive elements inside the dialog (focus is trapped).' },
    { key: 'Shift + Tab', action: 'Cycles focus in reverse.' },
    { key: 'Escape', action: 'Triggers the animated close.' },
    { key: 'Enter / Space', action: 'Activates the focused button — same as a click.' },
  ],
  accessibilityLede:
    'Radix Dialog handles the heavy lifting — `role="dialog"`, `aria-modal`, focus trap, return-to-trigger, scroll lock. Title and Description wire up `aria-labelledby`/`aria-describedby` automatically just by being children.',
};
