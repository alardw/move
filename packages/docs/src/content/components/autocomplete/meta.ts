import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'search',
    text: 'Type to filter the list, with sensible defaults for case and substring matching — override the filter function when you need server-side search.',
  },
  {
    icon: 'tags',
    text: 'Multi-select mode swaps in a tag list inside the trigger — Backspace peels the last tag off, just like an email To: field.',
  },
  {
    icon: 'rabbit',
    text: 'Popover enter/exit animates, the chevron rotates, empty and loading states swap in place — no layout jump between them.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/select',
    name: 'Select',
    reason: 'When the list is short enough to browse instead of type, and custom text input would be a footgun.',
  },
  {
    to: '/components/dropdown',
    name: 'Dropdown',
    reason: 'For triggering actions rather than choosing a value.',
  },
];

export const meta: ComponentMeta = {
  slug: 'autocomplete',
  name: 'Autocomplete',
  tagline: 'A text input that suggests as you type — single or multi, with tags, groups, async loading, and an empty state that doesn’t feel rude.',
  badges: [
    { icon: 'rectangle-ellipsis', label: 'Form' },
    { icon: 'boxes', label: 'Compound' },
    { icon: 'search', label: 'Filterable' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Autocomplete } from 'move';`,
  keyboard: [
    { key: 'Arrow Down', action: 'Opens the list (if closed) or moves focus to the next item.' },
    { key: 'Arrow Up', action: 'Moves focus to the previous item.' },
    { key: 'Home / End', action: 'Moves focus to the first / last item.' },
    { key: 'Enter', action: 'Selects the focused item.' },
    { key: 'Escape', action: 'Closes the list without selecting.' },
    { key: 'Backspace', action: 'In multi-select with empty input, removes the last tag.' },
    { key: 'Type-ahead', action: 'Filters the list as you type (case-insensitive substring by default).' },
  ],
  accessibilityLede:
    'The trigger exposes the WAI-ARIA combobox pattern — aria-expanded, aria-controls, aria-activedescendant are all wired up by the component. Announcing messages live in the popover as focus moves.',
};
