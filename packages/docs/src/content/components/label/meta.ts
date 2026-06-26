import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'tag',
    text: 'Real `<label>` element with `htmlFor` plumbed through — clicking the label focuses or activates the bound control natively.',
  },
  {
    icon: 'asterisk',
    text: 'Pass `required` and Label appends a small `*` indicator — purely visual; the control still owns the `required` attribute for validation.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/form-field',
    name: 'FormField',
    reason: 'Wraps Label and a Field control with grid layout, label/control alignment, and helper text. Use Label inside FormField.Label.',
  },
];

export const meta: ComponentMeta = {
  slug: 'label',
  preview: { layout: 'fit' },
  name: 'Label',
  tagline: 'A real `<label>` with size, required indicator, and the click-to-focus behavior browsers ship for free when you use the right element.',
  badges: [
    { icon: 'tag', label: 'Form' },
  ],
  highlights,
  related,
  importCode: `import { Label } from 'move';`,
  keyboard: [
    { key: '—', action: 'Label is presentational. Clicking it focuses the bound control via `htmlFor`.' },
  ],
  accessibilityLede:
    'Renders `<label htmlFor="…">` so the screen reader announces the label when the bound control is focused. Always set `htmlFor` to a real element id.',
};
