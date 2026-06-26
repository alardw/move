import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'toggle-right',
    text: 'A real `<button role="switch">` with on/off state — animated thumb, three sizes, label slot for "left of switch" descriptive text.',
  },
  {
    icon: 'keyboard',
    text: 'Native button semantics: Tab to focus, Space to toggle. `aria-checked` reflects state for assistive tech.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/checkbox',
    name: 'Checkbox',
    reason: 'For form-style on/off where the change applies on submit. Switch is for "toggles immediately."',
  },
];

export const meta: ComponentMeta = {
  slug: 'switch',
  preview: { layout: 'fit' },
  name: 'Switch',
  tagline: 'An immediate-action toggle — animated thumb, three sizes, real `role="switch"` semantics.',
  badges: [
    { icon: 'toggle-right', label: 'Form' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Switch } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the switch.' },
    { key: 'Space', action: 'Toggles between on and off.' },
  ],
  accessibilityLede:
    'Renders as `<button role="switch" aria-checked>`. Pair with a `<Label htmlFor="…">` so screen readers know what the switch toggles.',
};
