import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';
import { listboxKeyboard } from '../../keyboardMaps/listbox';

const highlights: HighlightItem[] = [
  { icon: 'rabbit', text: 'Opens and closes with a subtle animation.' },
  { icon: 'type', text: 'Long values get an ellipsis automatically. Hover the trigger or item for the full text, no wiring required.' },
];

const related: RelatedItem[] = [
  {
    to: '/components/autocomplete',
    name: 'Autocomplete',
    reason: 'If you need multi-select or search-as-you-type over the options.',
  },
  {
    to: '/components/dropdown',
    name: 'Dropdown',
    reason: 'Menu of actions without a selected value — navigation, commands, shortcuts.',
  },
  {
    to: '/components/form-field',
    name: 'FormField',
    reason: 'Integrate with FormField for label, messages and responsive behavior.',
  },
];

export const meta: ComponentMeta = {
  slug: 'select',
  preview: { width: 'fit' },
  name: 'Select',
  tagline: 'Choose from a list with a little zzzing.',
  categories: ['forms'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Select } from 'move';`,
  keyboard: listboxKeyboard,
  accessibilityLede:
    "All the keyboard and screen reader behavior you'd expect. Radix Select does the ARIA heavy lifting underneath.",
};
