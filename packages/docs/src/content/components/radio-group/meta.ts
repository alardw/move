import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'circle-dot',
    text: 'Built on Radix RadioGroup — single-selection, full keyboard contract (arrow keys traverse, Space activates), proper ARIA roles.',
  },
  {
    icon: 'list',
    text: 'Pair items with FormField for label + description + error — or compose your own layout with `RadioGroup.Item` directly.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/checkbox',
    name: 'Checkbox',
    reason: 'When more than one option can be selected. RadioGroup is for exactly one.',
  },
  {
    to: '/components/select',
    name: 'Select',
    reason: 'When the option list is long enough that a popover beats a flat list.',
  },
];

export const meta: ComponentMeta = {
  slug: 'radio-group',
  synonyms: ['radio', 'options', 'single select', 'radio buttons', 'choices'],
  name: 'RadioGroup',
  tagline: 'A single-select group of options with a real keyboard contract from Radix — Arrow keys traverse, Space activates.',
  categories: ['forms'],
  badges: [
  ],
  highlights,
  related,
  importCode: `import { RadioGroup } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the selected option (or first if none selected).' },
    { key: 'Arrow keys', action: 'Moves between options — selecting as it goes.' },
    { key: 'Space', action: 'Selects the focused option.' },
  ],
  accessibilityLede:
    'Group container has `role="radiogroup"`. Each item is a `role="radio"` button with `aria-checked`. Use a labelled wrapper (FormField or Label) so the group has an accessible name.',
};
