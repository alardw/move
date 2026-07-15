// Generated from Checkbox.spec.ts
import { useCallback } from 'react';
import { useControlledState } from '../../../engine';

export interface UseCheckboxOptions {
  /** Controlled checked state */
  checked?: boolean;
  /** Default checked state for uncontrolled mode */
  defaultChecked?: boolean;
  /** Whether the checkbox is in indeterminate state */
  indeterminate?: boolean;
  /** Called when checked state changes */
  onChange?: (checked: boolean) => void;
}

export interface UseCheckboxReturn {
  checked: boolean;
  indeterminate: boolean;
  toggle: () => void;
}

/**
 * Headless checkbox hook. Manages checked + indeterminate state.
 */
export function useCheckbox(options: UseCheckboxOptions = {}): UseCheckboxReturn {
  const { indeterminate = false, onChange } = options;

  const [checked, setChecked] = useControlledState<boolean>({
    value: options.checked,
    defaultValue: options.defaultChecked ?? false,
    onChange,
  });

  const toggle = useCallback(() => {
    setChecked((prev) => !prev);
  }, [setChecked]);

  return {
    checked,
    indeterminate,
    toggle,
  };
}
