'use client';

import { useCallback, useRef } from 'react';
import { useControlledState } from '../../../engine/useControlledState';

// ============================================================================
// Types
// ============================================================================

export interface UseNumberInputOptions {
  value?: number | string;
  defaultValue?: number | string;
  onValueChange?: (value: number | undefined, displayValue: string) => void;
  min?: number;
  max?: number;
  step?: number;
  shiftStep?: number;
  clampBehavior?: 'blur' | 'strict' | 'none';
  allowDecimal?: boolean;
  decimalScale?: number;
  allowNegative?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  prefix?: string;
  suffix?: string;
  formatValue?: (v: number) => string;
  parseValue?: (s: string) => number | undefined;
}

export interface UseNumberInputReturn {
  displayValue: string;
  numericValue: number | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  increment: (shift?: boolean) => void;
  decrement: (shift?: boolean) => void;
  setValue: (v: number | undefined) => void;
}

// ============================================================================
// Helpers
// ============================================================================

function clamp(v: number, min?: number, max?: number): number {
  let result = v;
  if (min !== undefined && result < min) result = min;
  if (max !== undefined && result > max) result = max;
  return result;
}

function roundToStep(value: number, step: number, min?: number): number {
  // Round to nearest step from min (or 0)
  const base = min ?? 0;
  const diff = value - base;
  const rounded = Math.round(diff / step) * step + base;
  // Fix floating point
  const decimals = String(step).split('.')[1]?.length ?? 0;
  return Number(rounded.toFixed(decimals));
}

function applyDecimalScale(value: number, scale: number | undefined): number {
  if (scale === undefined) return value;
  return Number(value.toFixed(scale));
}

function formatNumber(
  value: number | undefined,
  decimalScale: number | undefined,
  formatValue?: (v: number) => string,
): string {
  if (value === undefined) return '';
  const scaled = applyDecimalScale(value, decimalScale);
  if (formatValue) return formatValue(scaled);
  return String(scaled);
}

function parseNumber(
  raw: string,
  parseValue?: (s: string) => number | undefined,
): number | undefined {
  if (parseValue) return parseValue(raw);
  if (raw === '' || raw === '-') return undefined;
  const num = Number(raw);
  return isNaN(num) ? undefined : num;
}

// ============================================================================
// Hook
// ============================================================================

export function useNumberInput(options: UseNumberInputOptions = {}): UseNumberInputReturn {
  const {
    min,
    max,
    step = 1,
    shiftStep,
    clampBehavior = 'blur',
    allowDecimal = true,
    decimalScale,
    allowNegative = true,
    disabled = false,
    readOnly = false,
    prefix,
    suffix,
    formatValue: formatValueFn,
    parseValue: parseValueFn,
  } = options;

  const effectiveShiftStep = shiftStep ?? step * 10;

  // Strip prefix/suffix from raw input string
  function stripAffixes(s: string): string {
    let result = s;
    if (prefix && result.startsWith(prefix)) result = result.slice(prefix.length);
    if (suffix && result.endsWith(suffix)) result = result.slice(0, -suffix.length);
    return result;
  }

  // Convert incoming value to number
  function toNumber(v: number | string | undefined): number | undefined {
    if (v === undefined || v === '') return undefined;
    if (typeof v === 'number') return v;
    return parseNumber(v, parseValueFn);
  }

  // Controlled state stores the display string
  const [displayValue, setDisplayValue, isControlled] = useControlledState<string>({
    value: options.value !== undefined ? formatNumber(toNumber(options.value), decimalScale, formatValueFn) : undefined,
    defaultValue: options.defaultValue !== undefined
      ? formatNumber(toNumber(options.defaultValue), decimalScale, formatValueFn)
      : '',
    onChange: undefined, // We fire onValueChange manually with both values
  });

  const onValueChangeRef = useRef(options.onValueChange);
  onValueChangeRef.current = options.onValueChange;

  const numericValue = parseNumber(stripAffixes(displayValue), parseValueFn);

  const fireChange = useCallback((num: number | undefined, display: string) => {
    setDisplayValue(display);
    onValueChangeRef.current?.(num, display);
  }, [setDisplayValue]);

  // Set value programmatically
  const setValue = useCallback((v: number | undefined) => {
    if (v === undefined) {
      fireChange(undefined, '');
      return;
    }
    const clamped = clamp(v, min, max);
    const display = formatNumber(clamped, decimalScale, formatValueFn);
    fireChange(clamped, display);
  }, [min, max, decimalScale, formatValueFn, fireChange]);

  // Increment / decrement
  const adjust = useCallback((delta: number) => {
    if (disabled || readOnly) return;
    const current = numericValue ?? min ?? 0;
    let next = current + delta;
    next = clamp(next, min, max);
    next = applyDecimalScale(next, decimalScale);
    const display = formatNumber(next, decimalScale, formatValueFn);
    fireChange(next, display);
  }, [disabled, readOnly, numericValue, min, max, decimalScale, formatValueFn, fireChange]);

  const increment = useCallback((shift?: boolean) => {
    adjust(shift ? effectiveShiftStep : step);
  }, [adjust, step, effectiveShiftStep]);

  const decrement = useCallback((shift?: boolean) => {
    adjust(shift ? -effectiveShiftStep : -step);
  }, [adjust, step, effectiveShiftStep]);

  // Filter input for valid number characters
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    let raw = e.target.value;

    // Strip affixes if user is editing
    raw = stripAffixes(raw);

    // Filter: allow digits, one minus at start, one decimal point
    let filtered = '';
    let hasDecimal = false;
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];
      if (ch === '-') {
        if (i === 0 && allowNegative) filtered += ch;
      } else if (ch === '.') {
        if (!hasDecimal && allowDecimal) {
          filtered += ch;
          hasDecimal = true;
        }
      } else if (/\d/.test(ch)) {
        filtered += ch;
      }
    }

    const num = parseNumber(filtered, parseValueFn);

    if (clampBehavior === 'strict' && num !== undefined) {
      const clamped = clamp(num, min, max);
      if (clamped !== num) {
        const display = formatNumber(clamped, decimalScale, formatValueFn);
        fireChange(clamped, display);
        return;
      }
    }

    // When filtered matches current state, React won't re-render and
    // the rejected character stays in the DOM. Use rAF to force-reset
    // after React's reconciliation completes.
    if (filtered === displayValue) {
      const input = e.target;
      const resetValue = filtered !== ''
        ? (prefix || '') + filtered + (suffix || '')
        : '';
      requestAnimationFrame(() => {
        input.value = resetValue;
      });
      return;
    }

    // Store raw string to allow partial input (e.g. "1." or "-")
    fireChange(num, filtered);
  }, [disabled, readOnly, allowNegative, allowDecimal, clampBehavior, min, max, decimalScale, formatValueFn, parseValueFn, fireChange, prefix, suffix, displayValue]);

  // Clamp and format on blur
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (clampBehavior === 'none') return;

    const raw = stripAffixes(displayValue);
    let num = parseNumber(raw, parseValueFn);

    if (num === undefined) {
      // If empty, keep empty
      if (raw === '' || raw === '-') {
        fireChange(undefined, '');
        return;
      }
    }

    if (num !== undefined) {
      num = clamp(num, min, max);
      num = applyDecimalScale(num, decimalScale);
      const display = formatNumber(num, decimalScale, formatValueFn);
      fireChange(num, display);
    }
  }, [clampBehavior, displayValue, min, max, decimalScale, formatValueFn, parseValueFn, fireChange, prefix, suffix]);

  // Keyboard: ArrowUp/Down
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      increment(e.shiftKey);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      decrement(e.shiftKey);
    }
  }, [disabled, readOnly, increment, decrement]);

  // Add prefix/suffix for display
  let finalDisplay = displayValue;
  if (finalDisplay !== '' && prefix) finalDisplay = prefix + finalDisplay;
  if (finalDisplay !== '' && suffix) finalDisplay = finalDisplay + suffix;

  return {
    displayValue: finalDisplay,
    numericValue,
    handleChange,
    handleKeyDown,
    handleBlur,
    increment,
    decrement,
    setValue,
  };
}
