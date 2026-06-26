import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'columns-2',
    text: 'Two or more resizable panels with auto-injected gutters between them. Drag to resize, double-click a gutter to reset.',
  },
  {
    icon: 'keyboard',
    text: 'Gutters are focusable — Arrow keys nudge in 1% steps, Shift + Arrow in 10%. Each gutter is a real `role="separator"`.',
  },
  {
    icon: 'smartphone',
    text: 'Optional responsive collapse — pass a `breakpoint` and the layout stacks vertically below it.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/sidebar',
    name: 'Sidebar',
    reason: 'When the side panel is permanent navigation rather than user-resizable.',
  },
];

export const meta: ComponentMeta = {
  slug: 'splitter',
  name: 'Splitter',
  tagline: 'A resizable two-or-more panel layout with draggable gutters, keyboard resize, and responsive collapse.',
  categories: ['layout'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
  ],
  highlights,
  related,
  importCode: `import { Splitter } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the next gutter.' },
    { key: 'Arrow keys', action: 'Resize the panels around the focused gutter.' },
    { key: 'Shift + Arrow', action: 'Larger resize step (10%).' },
    { key: 'Home / End', action: 'Collapse to one side.' },
  ],
  accessibilityLede:
    'Each gutter is `role="separator"` with `aria-orientation`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` so screen-reader users can hear the current ratio.',
};
