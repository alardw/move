import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'layout',
    text: 'Tab triggers + tab panels with a sliding indicator that follows the active tab — built on Radix Tabs so the keyboard contract is solid.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Two variants — `underline` (clean tab line) and `pill` (rounded background) — and three sizes for different surface densities.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/accordion',
    name: 'Accordion',
    reason: 'When sections should breathe next to each other instead of taking turns.',
  },
  {
    to: '/components/sidebar',
    name: 'Sidebar',
    reason: 'For top-level navigation. Tabs is for switching between sibling views inside a page.',
  },
];

export const meta: ComponentMeta = {
  slug: 'tabs',
  name: 'Tabs',
  tagline: 'Switch between sibling views with a sliding indicator, two variants, and Radix-backed keyboard navigation.',
  categories: ['navigation'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Tabs } from 'move';`,
  keyboard: [
    { key: 'Arrow Left / Right', action: 'Moves to the previous / next tab (and activates).' },
    { key: 'Home / End', action: 'Jumps to the first / last tab.' },
    { key: 'Tab', action: 'Moves focus from the active tab into the panel.' },
  ],
  accessibilityLede:
    'Built on Radix Tabs — `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-controls`, `aria-selected` all wired correctly.',
};
