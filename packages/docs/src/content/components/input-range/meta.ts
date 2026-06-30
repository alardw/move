import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'sliders-horizontal',
    text: 'Single-thumb or dual-thumb (range) — pass a number or a `[min, max]` tuple. Built on Radix Slider so the keyboard story works out of the box.',
  },
  {
    icon: 'eye',
    text: 'Optional value display next to the slider — pass `showValue` for the current number(s), or render your own using the controlled value.',
  },
  {
    icon: 'rabbit',
    text: 'Thumb spring on hover and active drag — small detail, big difference in feel.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/number-input',
    name: 'NumberInput',
    reason: 'When the user wants to type the value precisely. Pair with InputRange when both interactions matter.',
  },
];

export const meta: ComponentDocument = {
  slug: 'input-range',
  synonyms: ['slider', 'range slider', 'range input', 'track'],
  preview: { width: 'md' },
  name: 'InputRange',
  tagline: 'A slider with single or dual thumbs, an optional value readout, and a real keyboard contract from Radix Slider.',
  categories: ['forms'],
  badges: [
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { InputRange } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the slider thumb.' },
    { key: 'Arrow keys', action: 'Steps the value up or down by `step` units.' },
    { key: 'Page Up / Down', action: 'Larger step.' },
    { key: 'Home / End', action: 'Jumps to min / max.' },
  ],
  accessibilityLede:
    'Built on Radix Slider — `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and label support. Each thumb is independently focusable in dual-thumb mode.',
};
