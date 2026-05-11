import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'lock',
    text: 'A password field with a built-in show/hide toggle — `<input type="password">` ↔ `<input type="text">` without an extra checkbox in your form.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Same shape as InputText — outlined / filled, three sizes, optional `iconLeft`, `invalid`, controlled or uncontrolled visibility via `visible` / `defaultVisible`.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/pin-input',
    name: 'PinInput',
    reason: 'For fixed-length OTP / 2FA codes that don’t need a show/hide toggle.',
  },
  {
    to: '/components/input-text',
    name: 'InputText',
    reason: 'For non-secret text. Password is the locked-down sibling.',
  },
];

export const meta: ComponentMeta = {
  slug: 'password',
  name: 'Password',
  tagline: 'A password input with a show/hide toggle — outlined or filled, three sizes, the rest of InputText’s contract.',
  badges: [
    { icon: 'lock', label: 'Form' },
  ],
  highlights,
  related,
  importCode: `import { Password } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the input, then to the show/hide toggle.' },
    { key: 'Enter / Space', action: 'On the toggle — switches between revealed and hidden.' },
  ],
  accessibilityLede:
    'A real `<input type="password">` with the show/hide toggle as a labelled button. When revealed, the input becomes `type="text"` (browsers treat this as accessible behaviour).',
};
