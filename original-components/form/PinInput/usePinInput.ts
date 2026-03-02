import { useState, useCallback, useRef, useEffect } from 'react';
import { useControlledState } from '../../../engine/useControlledState';

export interface UsePinInputOptions {
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled mode */
  defaultValue?: string;
  /** Called when the value changes */
  onChange?: (value: string) => void;
  /** Called when all slots are filled */
  onComplete?: (value: string) => void;
  /** Number of digits/characters */
  length?: number;
  /** Character validation: 'number', 'alphanumeric', or a RegExp */
  type?: 'number' | 'alphanumeric' | RegExp;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Mask input like a password field */
  mask?: boolean;
  /** Placeholder character per slot */
  placeholder?: string;
  /** Enable autocomplete="one-time-code" for SMS autofill */
  oneTimeCode?: boolean;
  /** Grouping pattern, e.g. [3,3] splits 6 digits into two groups */
  grouping?: number[];
}

export interface UsePinInputReturn {
  /** Current value string */
  value: string;
  /** Set value programmatically */
  setValue: (value: string) => void;
  /** Index of the currently focused slot (or -1) */
  focusedIndex: number;
  /** Ref for the hidden input element */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** Props to spread on the hidden input */
  inputProps: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
    onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
    type: string;
    inputMode: 'numeric' | 'text';
    autoComplete: string;
    maxLength: number;
    disabled: boolean;
    'aria-label'?: string;
  };
  /** Get display character for a slot index */
  getSlotChar: (index: number) => string;
  /** Whether a slot is filled */
  isSlotFilled: (index: number) => boolean;
  /** Whether a slot has the caret */
  isSlotActive: (index: number) => boolean;
  /** Focus the input */
  focus: () => void;
  /** Whether the input is focused */
  isFocused: boolean;
  /** Resolved grouping array */
  groups: number[];
}

function validateChar(char: string, type: 'number' | 'alphanumeric' | RegExp): boolean {
  if (type === 'number') return /^\d$/.test(char);
  if (type === 'alphanumeric') return /^[a-zA-Z0-9]$/.test(char);
  return type.test(char);
}

function resolveGroups(grouping: number[] | undefined, length: number): number[] {
  if (!grouping || grouping.length === 0) return [length];
  // Ensure groups sum to length
  const sum = grouping.reduce((a, b) => a + b, 0);
  if (sum !== length) return [length];
  return grouping;
}

export function usePinInput(options: UsePinInputOptions = {}): UsePinInputReturn {
  const {
    length = 4,
    type = 'number',
    disabled = false,
    mask = false,
    placeholder = '',
    oneTimeCode = true,
    onComplete,
    grouping,
  } = options;

  const [value, setValueRaw] = useControlledState<string>({
    value: options.value,
    defaultValue: options.defaultValue ?? '',
    onChange: options.onChange,
  });

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const groups = resolveGroups(grouping, length);

  const setValue = useCallback(
    (newValue: string) => {
      // Filter to valid characters and clamp to length
      const filtered = newValue
        .split('')
        .filter((ch) => validateChar(ch, type))
        .slice(0, length)
        .join('');
      setValueRaw(filtered);

      if (filtered.length === length) {
        onCompleteRef.current?.(filtered);
      }
    },
    [type, length, setValueRaw]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow modifier combos (Ctrl+V, Cmd+A, etc.)
      if (e.metaKey || e.ctrlKey) return;
      // Allow navigation keys
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Tab') {
        return;
      }
      // Block invalid characters
      if (e.key.length === 1 && !validateChar(e.key, type)) {
        e.preventDefault();
      }
    },
    [type]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setFocusedIndex(Math.min(value.length, length - 1));
  }, [value.length, length]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setFocusedIndex(-1);
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text/plain');
      setValue(pasted);
    },
    [setValue]
  );

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const getSlotChar = useCallback(
    (index: number): string => {
      const ch = value[index];
      if (!ch) return placeholder;
      if (mask) return '\u2022'; // bullet
      return ch;
    },
    [value, mask, placeholder]
  );

  const isSlotFilled = useCallback(
    (index: number): boolean => index < value.length,
    [value.length]
  );

  const isSlotActive = useCallback(
    (index: number): boolean => isFocused && index === Math.min(value.length, length - 1),
    [isFocused, value.length, length]
  );

  const inputMode: 'numeric' | 'text' = type === 'number' ? 'numeric' : 'text';

  return {
    value,
    setValue,
    focusedIndex,
    inputRef,
    inputProps: {
      value,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onPaste: handlePaste,
      type: mask ? 'password' : 'text',
      inputMode,
      autoComplete: oneTimeCode ? 'one-time-code' : 'off',
      maxLength: length,
      disabled,
    },
    getSlotChar,
    isSlotFilled,
    isSlotActive,
    focus,
    isFocused,
    groups,
  };
}
