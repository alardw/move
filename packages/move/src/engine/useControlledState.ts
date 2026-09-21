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

  /**
   * The value the NEXT update resolves against.
   *
   * Kept in a ref rather than read from the closure, because the setter used to
   * capture the value of the render that made it — so two updates in the same
   * tick both resolved their `prev` from the same starting point, and the second
   * silently undid the first.
   *
   * FileUpload is where that surfaced: with `removeOnComplete`, several uploads
   * finish together and each removes its own row. The second removal computed
   * "everything except me" from a list that still held the first, so the first
   * file came back — and being back in the list while already untracked, it was
   * tracked again and uploaded a second time, with the tail never clearing
   * because the removals kept overwriting each other.
   *
   * Assigned during render so it follows the controlled prop (including a parent
   * that declines a change), and assigned again on each update so a run of
   * updates within one tick chains instead of racing.
   */
  const latest = useRef(currentValue);
  latest.current = currentValue;

  const setValue = useCallback(
    (nextValue: T | ((prev: T) => T)) => {
      const resolved =
        typeof nextValue === 'function' ? (nextValue as (prev: T) => T)(latest.current) : nextValue;

      latest.current = resolved;
      if (!isControlled) {
        setInternalValue(resolved);
      }
      onChangeRef.current?.(resolved);
    },
    // No `currentValue`: the ref carries it, which also keeps this identity
    // stable so a caller can hold the setter across renders.
    [isControlled],
  );

  return [currentValue, setValue, isControlled];
}
