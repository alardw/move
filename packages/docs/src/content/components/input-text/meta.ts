import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'pen-line',
    text: 'A real native `<input>` wrapped with focus-within border, two variants (outlined / filled), three sizes, and slot props for icons left and right.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Standard form props (name, value, defaultValue, onChange, required, type) just pass through. No custom event shape, no value-conversion to learn.',
  },
  {
    icon: 'eye',
    text: 'Invalid, disabled, and read-only states are token-driven, so themers can re-skin without reaching into the component.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/textarea',
    name: 'Textarea',
    reason: 'For multi-line input. Same look and tokens.',
  },
  {
    to: '/components/form-field',
    name: 'FormField',
    reason: 'For wrapping the input with a label and description in a responsive grid.',
  },
];

export const meta: ComponentMeta = {
  slug: 'input-text',
  preview: { width: 'sm' },
  name: 'InputText',
  tagline: 'A single-line text input — outlined or filled, three sizes, icon slots, and a real `<input>` underneath.',
  categories: ['forms'],
  badges: [
  ],
  highlights,
  related,
  importCode: `import { InputText } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the input.' },
    { key: 'Type', action: 'Standard text input behaviour.' },
  ],
  accessibilityLede:
    'A real `<input>` — pair with `<Label htmlFor="…">` for accessible labelling, and use `aria-describedby` when you need to associate helper text or errors.',
};
