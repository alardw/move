/**
 * Keyboard Pattern Map
 *
 * Maps KeyboardPattern to keys, behavior, and typical component classes.
 */

import type { KeyboardPattern, ComponentClass } from './spec-type';

export interface KeyboardPatternDef {
  /** Keys involved */
  keys: string[];
  /** Behavior description */
  behavior: string;
  /** Component classes that typically use this pattern */
  typicalClasses: ComponentClass[];
  /** Example components */
  examples: string[];
}

export const KEYBOARD_MAP: Record<NonNullable<KeyboardPattern>, KeyboardPatternDef> = {
  toggle: {
    keys: ['Space', 'Enter'],
    behavior: 'Space or Enter toggles the component state (checked/unchecked, pressed/released).',
    typicalClasses: ['interactive', 'input_toggle'],
    examples: ['Button', 'Checkbox', 'Switch', 'ToggleButton'],
  },
  linear: {
    keys: ['ArrowUp', 'ArrowDown', 'Home', 'End'],
    behavior: 'Arrow keys navigate through a linear list of items. Home/End jump to first/last.',
    typicalClasses: ['input_popup', 'overlay_popup'],
    examples: ['Select', 'Dropdown', 'Autocomplete', 'Popover'],
  },
  roving: {
    keys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'],
    behavior: 'Arrow keys move focus between items in a group. Focus wraps or stops at boundaries. Home/End jump to first/last.',
    typicalClasses: ['disclosure'],
    examples: ['Accordion', 'Tabs', 'RadioGroup', 'ToggleGroup'],
  },
  typeahead: {
    keys: ['Any letter key'],
    behavior: 'Typing characters filters or searches items. Typically combined with linear or roving.',
    typicalClasses: ['input_popup'],
    examples: ['Autocomplete', 'Select'],
  },
  grid: {
    keys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'],
    behavior: 'Arrow keys navigate a 2D grid. Left/Right move within a row, Up/Down move between rows.',
    typicalClasses: ['display'],
    examples: ['Calendar', 'Table', 'Grid'],
  },
} as const;
