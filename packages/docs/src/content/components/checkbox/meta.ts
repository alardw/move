import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'check',
    text: 'Three states — unchecked, checked, indeterminate — with a real spring on the check glyph and a hidden form input behind it for native submission.',
  },
  {
    icon: 'keyboard',
    text: 'Native button under the hood with `role="checkbox"` and `aria-checked` — Space toggles, Tab moves focus, focus rings show. No custom keyboard wiring.',
  },
  {
    icon: 'list-checks',
    text: '`Checkbox.Group` lays out a column of related checkboxes with a shared `role="group"` so screen readers and keyboard users see them as a unit.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/switch',
    name: 'Switch',
    reason: 'When the toggle is for an immediate action ("Notifications: on/off") rather than a form choice.',
  },
  {
    to: '/components/radio-group',
    name: 'RadioGroup',
    reason: 'When exactly one option must be selected from a small fixed list.',
  },
];

export const meta: ComponentMeta = {
  slug: 'checkbox',
  preview: { layout: 'fit' },
  name: 'Checkbox',
  tagline: 'A real `<button role="checkbox">` with checked, indeterminate, and disabled states — plus a hidden input for plain-form submission and a tidy Group container.',
  badges: [
    { icon: 'check', label: 'Form' },
    { icon: 'keyboard', label: 'Native' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Checkbox } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the checkbox.' },
    { key: 'Space', action: 'Toggles between checked and unchecked.' },
  ],
  accessibilityLede:
    'Renders as `<button role="checkbox">` with `aria-checked="true | false | mixed"`. Children become the visible label; pair the checkbox with a `<FormField.Label>` when you want the label to also be a click target.',
};
