import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'pipette',
    text: 'Type a hex, paste an `rgb()`, click the eye-dropper, or open the popover and drag through the saturation field — they all land in the same controlled value.',
  },
  {
    icon: 'palette',
    text: 'Switch the active format on the fly — hex, hexa, rgb, rgba, hsl, hsla — and the input value re-formats to match. Pass `formatOptions` to limit the picker to a subset.',
  },
  {
    icon: 'grid-3x3',
    text: 'Pass an array of preset `swatches` and the picker shows them as a clickable palette — perfect for brand colours or theme presets.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/color-picker',
    name: 'ColorPicker',
    reason: 'For inline use without a text input or popover. ColorInput wraps it in an input field; ColorPicker is the picker on its own.',
  },
  {
    to: '/components/input-text',
    name: 'InputText',
    reason: 'For non-colour text input. ColorInput shares its sizing and variant tokens so they line up in a form.',
  },
];

export const meta: ComponentMeta = {
  slug: 'color-input',
  preview: { width: 'fit' },
  name: 'ColorInput',
  tagline: 'A text input with a colour swatch trigger — type a value, click the swatch to drop into a full picker, or grab a colour off the screen with the eye-dropper.',
  categories: ['forms'],
  badges: [
    { icon: 'pipette', label: 'Picker' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { ColorInput } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the swatch, then the input, then the eye-dropper.' },
    { key: 'Enter / Space', action: 'On the swatch — toggles the picker popover.' },
    { key: 'Escape', action: 'Closes the picker popover.' },
  ],
  accessibilityLede:
    'The swatch is a labelled button with `aria-label`, the input is a real `<input>`, and the popover is a `role="dialog"` from Radix Popover. Both the swatch and input update the same controlled value.',
};
