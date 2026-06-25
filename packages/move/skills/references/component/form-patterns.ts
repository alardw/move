/**
 * Form Integration Patterns
 *
 * Maps FormType to implementation pattern and controlled pattern prop names.
 */

import type { FormType, ControlledPattern } from './component-create-spec-type';

export interface FormPatternDef {
  /** Implementation description */
  pattern: string;
  /** Prop names for controlled state */
  controlledProps: Record<NonNullable<ControlledPattern>, string[]>;
  /** How form submission works */
  submission: string;
  /** Example components */
  examples: string[];
}

export const FORM_PATTERNS: Record<NonNullable<FormType>, FormPatternDef> = {
  'native-name': {
    pattern: 'Uses a native <input>, <select>, or <textarea> element. The name attribute participates in form submission directly.',
    controlledProps: {
      value: ['value', 'defaultValue', 'onValueChange'],
      checked: ['checked', 'defaultChecked', 'onCheckedChange'],
      open: ['open', 'defaultOpen', 'onOpenChange'],
    },
    submission: 'Native form submission via name attribute. Value is read from the input element.',
    examples: ['InputText', 'Textarea', 'Password', 'NumberInput'],
  },
  'hidden-input': {
    pattern: 'Uses a hidden <input type="hidden"> to participate in form submission. The visible UI is a custom element (button, div) that manages state internally.',
    controlledProps: {
      checked: ['checked', 'defaultChecked', 'onCheckedChange'],
      value: ['value', 'defaultValue', 'onValueChange'],
      open: ['open', 'defaultOpen', 'onOpenChange'],
    },
    submission: 'Hidden input with name prop. Value is set programmatically based on component state.',
    examples: ['Checkbox', 'Switch', 'RadioGroup', 'Select'],
  },
} as const;

/**
 * Controlled state pattern — the triad of props for each pattern.
 */
export const CONTROLLED_TRIADS: Record<NonNullable<ControlledPattern>, { state: string; default: string; callback: string }> = {
  open: {
    state: 'open',
    default: 'defaultOpen',
    callback: 'onOpenChange',
  },
  value: {
    state: 'value',
    default: 'defaultValue',
    callback: 'onValueChange',
  },
  checked: {
    state: 'checked',
    default: 'defaultChecked',
    callback: 'onCheckedChange',
  },
} as const;
