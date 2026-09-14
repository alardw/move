'use client';
// Generated from Form.spec.ts

import * as React from 'react';

/**
 * What a Form tells the fields below it.
 *
 * Two facts, both owned by the consumer and passed straight through — the Form
 * holds no state of its own. Everything travels DOWN: a field reads what is
 * addressed to it and nothing is registered, counted or reported back. That is
 * what lets a Form know nothing about its own children.
 */
export interface FormContextValue {
  /**
   * Errors by field name. A FormField takes the entry matching its own `name`;
   * the form never goes looking for the field.
   */
  errors: Record<string, React.ReactNode>;
  /** Whether a submission is in flight, so actions and controls can disable themselves. */
  pending: boolean;
}

const FormContext = React.createContext<FormContextValue | null>(null);

export const FormProvider = FormContext.Provider;

/**
 * Read the Form above, if there is one.
 *
 * Null outside a Form, and every caller must treat that as normal rather than
 * as an error: a FormField works on its own, in a dialog, in a filter bar, in a
 * settings row. The Form is an optional addition, never a requirement.
 */
export function useFormContext(): FormContextValue | null {
  return React.useContext(FormContext);
}
