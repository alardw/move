import type { KeyboardRow } from '../components/types';

/**
 * Shared listbox-pattern keyboard map. Used by Select, Autocomplete,
 * Dropdown, and any other component that opens a focusable list.
 */
export const listboxKeyboard: KeyboardRow[] = [
  { key: 'Enter / Space', action: 'Opens the dropdown when focus is on the trigger.' },
  { key: 'Arrow Down', action: 'Moves focus to the next item.' },
  { key: 'Arrow Up', action: 'Moves focus to the previous item.' },
  { key: 'Home / End', action: 'Moves focus to the first / last item.' },
  { key: 'Enter', action: 'Selects the focused item and closes the dropdown.' },
  { key: 'Escape', action: 'Closes the dropdown without selecting.' },
  { key: 'Type-ahead', action: 'Typing letters jumps to matching items.' },
];
