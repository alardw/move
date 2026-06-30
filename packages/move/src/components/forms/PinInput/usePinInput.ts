// Generated from PinInput.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { useState, useCallback, useRef, useEffect } from 'react';
import { useControlledState } from '../../../engine';

export interface UsePinInputOptions {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  type?: 'number' | 'alphanumeric' | RegExp;
  disabled?: boolean;
  mask?: boolean;
  placeholder?: string;
  oneTimeCode?: boolean;
  grouping?: number[];
}

export interface UsePinInputReturn {
  value: string;
  setValue: (value: string) => void;
  focusedIndex: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
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
  };
  getSlotChar: (index: number) => string;
  isSlotFilled: (index: number) => boolean;
  isSlotActive: (index: number) => boolean;
  focus: () => void;
  isFocused: boolean;
  groups: number[];
}

function validateChar(char: string, type: 'number' | 'alphanumeric' | RegExp): boolean {
  if (type === 'number') return /^\d$/.test(char);
  if (type === 'alphanumeric') return /^[a-zA-Z0-9]$/.test(char);
  return type.test(char);
}

function resolveGroups(grouping: number[] | undefined, length: number): number[] {
  if (!grouping || grouping.length === 0) return [length];
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
    [type, length, setValueRaw],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.metaKey || e.ctrlKey) return;
      if (
        e.key === 'Backspace' ||
        e.key === 'Delete' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'Tab'
      ) {
        return;
      }
      if (e.key.length === 1 && !validateChar(e.key, type)) {
        e.preventDefault();
      }
    },
    [type],
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
    [setValue],
  );

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const getSlotChar = useCallback(
    (index: number): string => {
      const ch = value[index];
      if (!ch) return placeholder;
      if (mask) return '\u2022';
      return ch;
    },
    [value, mask, placeholder],
  );

  const isSlotFilled = useCallback(
    (index: number): boolean => index < value.length,
    [value.length],
  );

  const isSlotActive = useCallback(
    (index: number): boolean => isFocused && index === Math.min(value.length, length - 1),
    [isFocused, value.length, length],
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
