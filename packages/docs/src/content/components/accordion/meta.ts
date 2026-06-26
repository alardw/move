import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'rabbit',
    text: 'Opens and closes with a real measured-height animation — no flash, no jank, no guessing how tall the content is.',
  },
  {
    icon: 'keyboard',
    text: 'Keyboard and screen readers work the first time. Radix wires the ARIA, we keep out of its way.',
  },
  {
    icon: 'layers',
    text: 'One open at a time, or a pile of them — your call. Optionally collapsible, so tapping an open row folds it away.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/collapsible',
    name: 'Collapsible',
    reason: 'One disclosure, no scaffolding. The Accordion’s simpler cousin.',
  },
  {
    to: '/components/tabs',
    name: 'Tabs',
    reason: 'When only one panel should ever be visible. Accordion happily lets sections breathe next to each other.',
  },
];

export const meta: ComponentMeta = {
  slug: 'accordion',
  preview: { layout: 'fit' },
  name: 'Accordion',
  tagline: 'Collapsible sections for FAQs, settings panels, and anything that shouldn’t be visible all at once.',
  badges: [
    { icon: 'layers', label: 'Disclosure' },
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Accordion } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the next trigger.' },
    { key: 'Enter / Space', action: 'Toggles the focused item.' },
    { key: 'Arrow Down', action: 'Moves focus to the next trigger.' },
    { key: 'Arrow Up', action: 'Moves focus to the previous trigger.' },
    { key: 'Home / End', action: 'Jumps to the first / last trigger.' },
  ],
  accessibilityLede:
    'Radix Accordion does the ARIA heavy lifting — aria-expanded, aria-controls, region roles, the lot. You write the questions.',
};
