'use client';

import { useState, useCallback, useRef, useId, useMemo, useEffect } from 'react';
import { useControlledState } from '../../../engine/useControlledState';

// =============================================================================
// Types
// =============================================================================

export interface RegisteredItem {
  value: string;
  label: React.ReactNode;
  textContent: string;
  disabled: boolean;
  ref: React.RefObject<HTMLElement | null>;
}

export interface UseAutocompleteOptions {
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  multiple?: boolean;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;
  loading?: boolean;
  closeOnSelect?: boolean;
  openOnFocus?: boolean;
  allowCustomValue?: boolean;
  filterFn?: (inputValue: string, itemValue: string, itemLabel: string) => boolean;
}

export interface UseAutocompleteReturn {
  // Value
  selectedValues: string[];
  multiple: boolean;
  onSelect: (value: string) => void;
  onDeselect: (value: string) => void;
  isSelected: (value: string) => boolean;
  clearAll: () => void;

  // Input
  inputValue: string;
  onInputValueChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;

  // Open/close
  isOpen: boolean;
  open: () => void;
  close: () => void;

  // Keyboard navigation
  highlightedIndex: number;
  setHighlightedIndex: (i: number) => void;
  highlightedValue: string | null;

  // Item registry
  registerItem: (value: string, label: React.ReactNode, textContent: string, disabled: boolean, ref: React.RefObject<HTMLElement | null>) => void;
  unregisterItem: (value: string) => void;
  getLabel: (value: string) => React.ReactNode | undefined;
  getVisibleItems: () => RegisteredItem[];

  // Behavior
  loading: boolean;
  closeOnSelect: boolean;
  openOnFocus: boolean;
  filterFn: (inputValue: string, itemValue: string, itemLabel: string) => boolean;

  // IDs
  baseId: string;
  listboxId: string;
  getItemId: (value: string) => string;
}

// =============================================================================
// Default filter
// =============================================================================

function defaultFilter(inputValue: string, _itemValue: string, itemLabel: string): boolean {
  if (!inputValue) return true;
  return itemLabel.toLowerCase().includes(inputValue.toLowerCase());
}

// =============================================================================
// Hook
// =============================================================================

export function useAutocomplete(options: UseAutocompleteOptions = {}): UseAutocompleteReturn {
  const {
    multiple = false,
    loading = false,
    openOnFocus = true,
    allowCustomValue = false,
    filterFn = defaultFilter,
  } = options;

  const closeOnSelect = options.closeOnSelect ?? !multiple;

  // -------------------------------------------------------------------------
  // Value state
  // -------------------------------------------------------------------------

  const normalizeValue = (v: string | string[] | undefined): string[] => {
    if (v === undefined) return [];
    return Array.isArray(v) ? v : [v];
  };

  const [selectedValues, setSelectedValues] = useControlledState<string[]>({
    value: options.value !== undefined ? normalizeValue(options.value) : undefined,
    defaultValue: normalizeValue(options.defaultValue),
    onChange: (vals) => {
      if (multiple) {
        options.onValueChange?.(vals);
      } else {
        options.onValueChange?.(vals[0] ?? '');
      }
    },
  });

  // -------------------------------------------------------------------------
  // Input state
  // -------------------------------------------------------------------------

  const [inputValue, setInputValue] = useControlledState<string>({
    value: options.inputValue,
    defaultValue: options.defaultInputValue ?? '',
    onChange: options.onInputValueChange,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  // -------------------------------------------------------------------------
  // Open state
  // -------------------------------------------------------------------------

  const [isOpen, setIsOpen] = useControlledState<boolean>({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: options.onOpenChange,
  });

  const open = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    // Single mode: restore input to selected label
    if (!multiple && selectedValues.length > 0 && !allowCustomValue) {
      const label = itemMapRef.current.get(selectedValues[0]);
      if (label) {
        setInputValue(label.textContent);
      }
    }
  }, [setIsOpen, multiple, selectedValues, allowCustomValue, setInputValue]);  

  // -------------------------------------------------------------------------
  // Item registry
  // -------------------------------------------------------------------------

  const itemMapRef = useRef<Map<string, RegisteredItem>>(new Map());
  const [, forceUpdate] = useState(0);

  const registerItem = useCallback((
    value: string,
    label: React.ReactNode,
    textContent: string,
    disabled: boolean,
    ref: React.RefObject<HTMLElement | null>,
  ) => {
    const prev = itemMapRef.current.get(value);
    if (!prev || prev.label !== label || prev.disabled !== disabled || prev.textContent !== textContent) {
      itemMapRef.current.set(value, { value, label, textContent, disabled, ref });
      forceUpdate(n => n + 1);
    }
  }, []);

  const unregisterItem = useCallback((value: string) => {
    if (itemMapRef.current.has(value)) {
      itemMapRef.current.delete(value);
      forceUpdate(n => n + 1);
    }
  }, []);

  const getLabel = useCallback((value: string) => {
    return itemMapRef.current.get(value)?.label;
  }, []);

  const getVisibleItems = useCallback((): RegisteredItem[] => {
    const items: RegisteredItem[] = [];
    itemMapRef.current.forEach((item) => {
      if (filterFn(inputValue, item.value, item.textContent)) {
        items.push(item);
      }
    });
    return items;
  }, [inputValue, filterFn]);

  // -------------------------------------------------------------------------
  // Keyboard navigation
  // -------------------------------------------------------------------------

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const highlightedValue = useMemo(() => {
    if (highlightedIndex < 0) return null;
    const visible = getVisibleItems();
    return visible[highlightedIndex]?.value ?? null;
  }, [highlightedIndex, getVisibleItems]);

  // Reset highlight when input changes
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
    }
  }, [inputValue]); // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------------------------------------------------------
  // Selection
  // -------------------------------------------------------------------------

  const onSelect = useCallback((value: string) => {
    if (multiple) {
      setSelectedValues((prev) => {
        if (prev.includes(value)) {
          return prev.filter(v => v !== value);
        }
        return [...prev, value];
      });
      setInputValue('');
    } else {
      setSelectedValues([value]);
      const item = itemMapRef.current.get(value);
      if (item) {
        setInputValue(item.textContent);
      }
    }
    if (closeOnSelect) {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  }, [multiple, closeOnSelect, setSelectedValues, setInputValue, setIsOpen]);

  const onDeselect = useCallback((value: string) => {
    setSelectedValues((prev) => prev.filter(v => v !== value));
  }, [setSelectedValues]);

  const isSelected = useCallback((value: string) => {
    return selectedValues.includes(value);
  }, [selectedValues]);

  const clearAll = useCallback(() => {
    setSelectedValues([]);
    setInputValue('');
    inputRef.current?.focus();
  }, [setSelectedValues, setInputValue]);

  // -------------------------------------------------------------------------
  // Input value change handler
  // -------------------------------------------------------------------------

  const handleInputValueChange = useCallback((value: string) => {
    setInputValue(value);
    if (!isOpen) {
      open();
    }
  }, [setInputValue, isOpen, open]);

  // -------------------------------------------------------------------------
  // IDs
  // -------------------------------------------------------------------------

  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const getItemId = useCallback((value: string) => `${baseId}-option-${value}`, [baseId]);

  return {
    selectedValues,
    multiple,
    onSelect,
    onDeselect,
    isSelected,
    clearAll,
    inputValue,
    onInputValueChange: handleInputValueChange,
    inputRef,
    isOpen,
    open,
    close,
    highlightedIndex,
    setHighlightedIndex,
    highlightedValue,
    registerItem,
    unregisterItem,
    getLabel,
    getVisibleItems,
    loading,
    closeOnSelect,
    openOnFocus,
    filterFn,
    baseId,
    listboxId,
    getItemId,
  };
}
