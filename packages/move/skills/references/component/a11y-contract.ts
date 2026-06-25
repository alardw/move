/**
 * Accessibility Contract
 *
 * Maps ComponentClass to required ARIA role/attributes and focus pattern defaults.
 */

import type { ComponentClass, FocusPattern } from './component-create-spec-type';

export interface A11yContract {
  /** Required ARIA role (null = no specific role required) */
  role: string | null;
  /** Required ARIA attributes */
  requiredAttributes: string[];
  /** Default focus pattern for this class */
  defaultFocus: FocusPattern;
  /** Additional accessibility notes */
  notes: string;
}

export const A11Y_MAP: Record<ComponentClass, A11yContract> = {
  presentational: {
    role: null,
    requiredAttributes: [],
    defaultFocus: null,
    notes: 'No specific ARIA requirements. Purely visual.',
  },
  interactive: {
    role: 'button',
    requiredAttributes: ['aria-disabled (when disabled)'],
    defaultFocus: 'self',
    notes: 'Must be keyboard-operable. Role="button" if not a native <button>. Disabled state via aria-disabled.',
  },
  input_toggle: {
    role: 'checkbox',
    requiredAttributes: ['aria-checked', 'aria-disabled (when disabled)'],
    defaultFocus: 'self',
    notes: 'aria-checked is required (true/false/mixed). Use role="switch" for Switch. Role="radio" for RadioGroup items.',
  },
  input_popup: {
    role: null,
    requiredAttributes: ['aria-expanded', 'aria-haspopup', 'aria-activedescendant (when navigating)'],
    defaultFocus: 'delegated',
    notes: 'Trigger gets aria-expanded. Input (if present) gets focus. Use aria-activedescendant for virtual focus in list.',
  },
  input_plain: {
    role: null,
    requiredAttributes: ['aria-label or aria-labelledby', 'aria-invalid (when validation fails)'],
    defaultFocus: 'delegated',
    notes: 'Native input element handles most ARIA. Ensure label association via id/htmlFor or aria-label.',
  },
  disclosure: {
    role: null,
    requiredAttributes: ['aria-expanded (on trigger)', 'aria-controls (trigger → content id)'],
    defaultFocus: 'roving',
    notes: 'Trigger announces expanded/collapsed state. Content region should be labelledby trigger.',
  },
  overlay_layer: {
    role: 'dialog',
    requiredAttributes: ['aria-modal', 'aria-label or aria-labelledby'],
    defaultFocus: 'trap',
    notes: 'Focus trapped within dialog. Must have accessible name. Return focus to trigger on close.',
  },
  overlay_popup: {
    role: null,
    requiredAttributes: ['aria-expanded (on trigger)', 'aria-haspopup'],
    defaultFocus: 'self',
    notes: 'Popup trigger gets aria-expanded. Popup content may get role="menu" or role="listbox" depending on purpose.',
  },
  display: {
    role: null,
    requiredAttributes: [],
    defaultFocus: null,
    notes: 'Varies widely. Table needs role="table" or native <table>. Images need alt text. Cards may need article/section roles.',
  },
} as const;
