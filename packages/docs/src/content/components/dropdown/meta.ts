import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'menu',
    text: 'Items, groups, labels, checkbox items, radio groups, separators, and sub-menus — built on Radix DropdownMenu so the keyboard contract is solid.',
  },
  {
    icon: 'rabbit',
    text: 'Animated height reveal on open with a staggered item entrance — feels alive without slowing the click down.',
  },
  {
    icon: 'keyboard',
    text: 'Full keyboard contract from Radix — Arrow keys to navigate, Enter/Space to activate, type-ahead, Escape to close, side menus open via ArrowRight.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/select',
    name: 'Select',
    reason: 'When the menu is for picking a single value out of a list. Dropdown is for triggering actions, not committing to a value.',
  },
  {
    to: '/components/popover',
    name: 'Popover',
    reason: 'For free-form anchored content (cards, forms). Dropdown is the menu-shaped subset.',
  },
];

export const meta: ComponentMeta = {
  slug: 'dropdown',
  synonyms: ['menu', 'context menu', 'select menu', 'overflow menu', 'action menu', 'actions'],
  name: 'Dropdown',
  tagline: 'A context menu with items, groups, sub-menus, and toggleable checkbox/radio entries — animated, keyboard-driven, ARIA-correct.',
  categories: ['overlays'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Dropdown } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the trigger.' },
    { key: 'Enter / Space', action: 'Opens the menu (when focus is on the trigger), or activates an item.' },
    { key: 'Arrow Up / Down', action: 'Navigates between items.' },
    { key: 'Arrow Right', action: 'Opens a sub-menu when focused on a SubTrigger.' },
    { key: 'Type-ahead', action: 'Jumps to items by typing their first letters.' },
    { key: 'Escape', action: 'Closes the menu.' },
  ],
  accessibilityLede:
    'Built on Radix DropdownMenu — `role="menu"`, `aria-haspopup`, focus return to trigger, type-ahead, all of it. The trigger is your button; the menu lives in a portal so it always sits above the page.',
};
