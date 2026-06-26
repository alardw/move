import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'palette',
    text: 'Saturation field, hue slider, alpha slider, format selector, and per-channel inputs — every part of the picker is accessible from the keyboard, not just the mouse.',
  },
  {
    icon: 'grid-3x3',
    text: 'Optional preset `swatches` lay out as a clickable grid below the sliders, sized via `swatchesPerRow`. Skip them entirely with `swatches={[]}`.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Drop sections you don’t need — `withPicker={false}` for swatch-only, set `formatOptions` to limit the format selector, hide the alpha slider by working in non-alpha formats.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/color-input',
    name: 'ColorInput',
    reason: 'When the picker should sit inside a form input. ColorInput wraps this component in a popover anchored to a swatch+text-input.',
  },
  {
    to: '/components/slider',
    name: 'Slider',
    reason: 'For generic value-on-a-track controls. ColorPicker’s sliders are purpose-built for hue/alpha and not exposed on their own.',
  },
];

export const meta: ComponentMeta = {
  slug: 'color-picker',
  preview: { width: 'fit' },
  name: 'ColorPicker',
  tagline: 'A standalone colour picker — saturation field, hue and alpha sliders, format toggle, channel inputs, and a tidy swatch grid. Drop in inline, or nest inside a popover.',
  categories: ['forms'],
  badges: [
    { icon: 'pipette', label: 'Picker' },
  ],
  highlights,
  related,
  importCode: `import { ColorPicker } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Cycles through saturation field, hue, alpha, format selector, and channel inputs.' },
    { key: 'Arrow keys', action: 'Within the saturation field — moves the indicator. On hue/alpha — adjusts the value.' },
    { key: 'Shift + Arrow', action: 'Larger step on the saturation field and sliders.' },
  ],
  accessibilityLede:
    'Saturation, hue, and alpha controls expose `role="slider"` with full ARIA value attributes. Channel inputs are real `<input type="number">`s with min/max constraints, so screen-reader and keyboard-only users can edit colours numerically.',
};
