import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'list',
    text: 'A group of toggle buttons — single-select (radio) or multi-select (checkbox-style). Built on Radix ToggleGroup.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Variants and sizes set on Root cascade to all items, so the row reads as one unified control.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/toggle-button',
    name: 'ToggleButton',
    reason: 'For a standalone toggle. ToggleGroup is the multi-button row.',
  },
  {
    to: '/components/tabs',
    name: 'Tabs',
    reason: 'When the toggles drive panel switching with content, not just a value.',
  },
];

export const meta: ComponentMeta = {
  slug: 'toggle-group',
  synonyms: ['segmented control', 'tab-like group', 'button group', 'toggle'],
  name: 'ToggleGroup',
  tagline: 'A row of connected toggle buttons — single or multi select, with variant and size set once on the Root.',
  categories: ['actions'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
  ],
  highlights,
  related,
  importCode: `import { ToggleGroup } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus into the group, then traverses items.' },
    { key: 'Arrow keys', action: 'Moves between items.' },
    { key: 'Enter / Space', action: 'Activates the focused item.' },
  ],
  accessibilityLede:
    'Built on Radix ToggleGroup — `role="group"`, `aria-pressed` per item. Single-select mode behaves like a radio group; multi-select mirrors a checkbox row.',
};
