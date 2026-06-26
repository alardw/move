// Generated from InputRange.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { useCallback } from 'react';
import { useControlledState } from '../../../engine';

export type InputRangeValue = number | number[];

export interface UseInputRangeOptions {
  /** Controlled value (single number or array for range) */
  value?: InputRangeValue;
  /** Default value for uncontrolled mode */
  defaultValue?: InputRangeValue;
  /** Called when the value changes (always returns number[]) */
  onValueChange?: (value: number[]) => void;
}

export interface UseInputRangeReturn {
  values: number[];
  setValues: (values: number[]) => void;
}

function normalize(v: InputRangeValue | undefined, fallback: number[]): number[] {
  if (v === undefined) return fallback;
  return Array.isArray(v) ? v : [v];
}

/**
 * Headless input range hook. Manages controlled/uncontrolled slider value.
 * Accepts single number or number[] and normalizes to number[] internally.
 */
export function useInputRange(options: UseInputRangeOptions = {}): UseInputRangeReturn {
  const [values, setValues] = useControlledState<number[]>({
    value: options.value !== undefined ? normalize(options.value, [0]) : undefined,
    defaultValue: normalize(options.defaultValue, [0]),
    onChange: options.onValueChange,
  });

  const handleSetValues = useCallback(
    (next: number[]) => { setValues(next); },
    [setValues]
  );

  return { values, setValues: handleSetValues };
}
