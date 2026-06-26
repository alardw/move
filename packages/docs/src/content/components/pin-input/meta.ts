import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'key',
    text: 'A row of single-character inputs for OTP, 2FA codes, gift card numbers — auto-advances on type, jumps back on Backspace.',
  },
  {
    icon: 'clipboard-paste',
    text: 'Paste a multi-digit string anywhere in the row and the value distributes across the cells. Numeric or alphanumeric, masked or not.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/password',
    name: 'Password',
    reason: 'For longer secrets that need a show/hide toggle. PinInput is for fixed-length OTP-style codes.',
  },
  {
    to: '/components/input-text',
    name: 'InputText',
    reason: 'For free-form input. PinInput is the cell-by-cell short-code specialisation.',
  },
];

export const meta: ComponentMeta = {
  slug: 'pin-input',
  preview: { width: 'fit' },
  name: 'PinInput',
  tagline: 'A multi-cell pin/OTP input that auto-advances, supports paste-distribution, and masks like a password when you ask it to.',
  badges: [
    { icon: 'key', label: 'Form' },
  ],
  highlights,
  related,
  importCode: `import { PinInput } from 'move';`,
  keyboard: [
    { key: 'Type', action: 'Fills the current cell and advances focus.' },
    { key: 'Backspace', action: 'Clears the current cell or moves back if empty.' },
    { key: 'Arrow Left / Right', action: 'Moves between cells.' },
    { key: 'Cmd/Ctrl + V', action: 'Distributes a pasted value across cells.' },
  ],
  accessibilityLede:
    'Each cell is a real `<input>` with `inputMode` set to numeric or text per the `type` prop. Pair the whole row with a labelled `<Label>` so screen readers know what the code is for.',
};
