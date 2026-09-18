import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'move',
    text: 'Drag a row by its handle and the list reorders. The order stays your data — Sortable reports the move and you apply it, so nothing is duplicated into a second source of truth.',
  },
  {
    icon: 'keyboard',
    text: 'Every move is available from the keyboard as a named action: focus a handle, press Enter, pick "Move to top". No arrow-key drag mode to enter or get stuck inside.',
  },
  {
    icon: 'lock',
    text: 'A row can be fixed in place. It keeps its position while the others reorder around it, and offers neither a handle nor a move.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/drag',
    name: 'Drag',
    reason:
      'For dropping onto a place of its own — a slot that stays visible while empty, or a second list a row moves into.',
  },
  {
    to: '/components/layout-group',
    name: 'LayoutGroup',
    reason: 'The animation underneath: it slides the rows to their new places after a move.',
  },
  {
    to: '/components/list',
    name: 'List',
    reason: 'When the rows are read rather than rearranged.',
  },
];

export const meta: ComponentDocument = {
  slug: 'sortable',
  synonyms: ['reorder', 'drag & drop', 'dnd', 'sortable list', 'rearrange', 'drag handle'],
  preview: { width: 'full' },
  name: 'Sortable',
  tagline:
    'A list whose rows can be rearranged by dragging, with the same moves available from the keyboard.',
  categories: ['data-display'],
  badges: [],
  highlights,
  related,
  importCode: `import { Sortable } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Move between handles' },
    { key: 'Enter / Space', action: 'Open the move menu on the focused handle' },
    { key: '↑ ↓', action: 'Move through the menu once it is open' },
    { key: 'Enter', action: 'Perform the highlighted move' },
    { key: 'Esc', action: 'Close the menu, or abandon a drag in progress' },
  ],
  accessibilityLede:
    'The keyboard path is a menu of named moves rather than an arrow-key drag: pick "Move to top" from one focus stop instead of counting arrow presses. Every move is announced by position — "Dropped at position 2 of 5" — through a single live region. Give each Item a `label` so the announcement names the row rather than only its number.',
};
