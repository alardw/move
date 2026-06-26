import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'toggle-left',
    text: 'A button that holds an on/off state — built on Radix Toggle so `aria-pressed` is wired correctly.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/toggle-group',
    name: 'ToggleGroup',
    reason: 'When several toggles share a row and either pick one (radio-style) or several (checkbox-style).',
  },
  {
    to: '/components/switch',
    name: 'Switch',
    reason: 'For settings-style on/off toggles. ToggleButton suits toolbars and command bars.',
  },
];

export const meta: ComponentMeta = {
  slug: 'toggle-button',
  preview: { width: 'fit' },
  name: 'ToggleButton',
  tagline: 'A button that remembers its on/off state — perfect for toolbar formatting controls (bold, italic, view toggles).',
  categories: ['actions'],
  badges: [
  ],
  highlights,
  related,
  importCode: `import { ToggleButton } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the button.' },
    { key: 'Enter / Space', action: 'Toggles pressed state.' },
  ],
  accessibilityLede:
    'Renders as `<button aria-pressed>`. Pair with an `aria-label` (or visible text inside) so screen readers know what’s being toggled.',
};
