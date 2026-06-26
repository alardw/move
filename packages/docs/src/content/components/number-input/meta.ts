import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'plus',
    text: 'Increment / decrement stepper buttons with hold-to-repeat — set `step`, `min`, `max` and the value clamps for free.',
  },
  {
    icon: 'languages',
    text: 'Custom `format` and `parse` callbacks for currency, percentages, units. The internal value stays a number; the displayed string is yours.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/input-text',
    name: 'InputText',
    reason: 'For free-form text. NumberInput is the numeric specialisation.',
  },
  {
    to: '/components/input-range',
    name: 'InputRange',
    reason: 'When the value lives on a continuous track. Pair with NumberInput when both interactions matter.',
  },
];

export const meta: ComponentMeta = {
  slug: 'number-input',
  preview: { layout: 'fit' },
  name: 'NumberInput',
  tagline: 'A numeric input with stepper buttons, hold-to-repeat, min/max clamping, and pluggable format/parse.',
  badges: [
    { icon: 'hash', label: 'Form' },
  ],
  highlights,
  related,
  importCode: `import { NumberInput } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the input.' },
    { key: 'Arrow Up / Down', action: 'Steps the value up or down.' },
    { key: 'Page Up / Down', action: 'Larger step.' },
    { key: 'Home / End', action: 'Jumps to min / max.' },
  ],
  accessibilityLede:
    'A real `<input inputMode="decimal">` with stepper buttons that have `aria-label`s. Min/max constraints expose via standard HTML attributes; assistive tech announces them.',
};
