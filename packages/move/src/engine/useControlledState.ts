import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseControlledStateOptions<T> {
  /** Controlled value (if provided, the component is controlled) */
  value?: T;
  /** Default value for uncontrolled mode */
  defaultValue?: T;
  /** Called when the value changes */
  onChange?: (value: T) => void;
}

/**
 * Manages controlled vs uncontrolled state.
 * Returns [currentValue, setValue, isControlled].
 */
export function useControlledState<T>(
  options: UseControlledStateOptions<T>,
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const { value: controlledValue, defaultValue, onChange } = options;
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<T>(
    controlledValue ?? defaultValue ?? (undefined as unknown as T),
  );

  // Keep callback ref stable
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const currentValue = isControlled ? controlledValue : internalValue;

  const setValue = useCallback(
    (nextValue: T | ((prev: T) => T)) => {
      const resolved =
        typeof nextValue === 'function' ? (nextValue as (prev: T) => T)(currentValue) : nextValue;

      if (!isControlled) {
        setInternalValue(resolved);
      }
      onChangeRef.current?.(resolved);
    },
    [currentValue, isControlled],
  );

  return [currentValue, setValue, isControlled];
}
