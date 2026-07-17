// Generated from Autocomplete.spec.ts
'use client';

import { useState, useCallback, useRef, useId, useMemo, useEffect } from 'react';
import { useControlledState } from '../../../engine';
import type { AsyncResource } from '../../../adapters';

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
  /** Async data source for the options list. When set, it drives loading/error
   *  state (superseding the `loading` boolean) and exposes `retry` to RetryTrigger.
   *  The data payload is not consumed — items are still rendered as children. */
  resource?: AsyncResource<unknown>;
  closeOnSelect?: boolean;
  /** Animated close requested on select (set by the component to the dismissable
   *  close, so selecting an item plays the exit animation instead of snapping). */
  requestClose?: () => void;
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

  // Browse-all (chevron click): show every item regardless of input filter,
  // until the user types. Cleared on input change and close.
  bypassFilter: boolean;
  setBypassFilter: (v: boolean) => void;

  // Keyboard navigation
  highlightedIndex: number;
  setHighlightedIndex: (i: number) => void;
  highlightedValue: string | null;

  // Item registry
  registerItem: (
    value: string,
    label: React.ReactNode,
    textContent: string,
    disabled: boolean,
    ref: React.RefObject<HTMLElement | null>,
  ) => void;
  unregisterItem: (value: string) => void;
  primeLabelCache: (value: string, label: React.ReactNode) => void;
  getLabel: (value: string) => React.ReactNode | undefined;
  getVisibleItems: () => RegisteredItem[];

  // Behavior
  loading: boolean;
  hasError: boolean;
  retry?: () => void;
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
    loading: loadingProp = false,
    resource,
    openOnFocus = true,
    allowCustomValue = false,
    filterFn = defaultFilter,
  } = options;

  // A `resource` (AsyncResource) supersedes the bare `loading` boolean and is the
  // only source of the error/retry state. Status-only: the data payload is unused
  // (items render as children).
  const loading = resource ? resource.status === 'loading' : loadingProp;
  const hasError = resource?.status === 'error';
  const retry = resource?.status === 'error' ? resource.retry : undefined;

  const closeOnSelect = options.closeOnSelect ?? !multiple;
  const requestClose = options.requestClose;

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

  const [bypassFilter, setBypassFilter] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    setBypassFilter(false);
    // Single mode: restore input to selected label
    if (!multiple && selectedValues.length > 0 && !allowCustomValue) {
      const label = itemMapRef.current.get(selectedValues[0]);
      if (label) {
        setInputValue(label.textContent);
      }
    }
  }, [setIsOpen, multiple, selectedValues, allowCustomValue, setInputValue]);

  // Close the popup on viewport changes — scroll (any ancestor) or
  // resize. Without this the popover floats away from the trigger
  // when the page or a parent ScrollArea scrolls. capture: true so
  // we catch scroll events on nested scroll containers, not just
  // window. passive: true so we don't block the scroll itself.
  //
  // Arm the listener only after a short delay so that the scroll the
  // browser fires when it scrolls the input into view on focus (which
  // happens right when we open the popover) doesn't immediately close
  // what we just opened.
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    let armed = false;
    const armTimer = window.setTimeout(() => {
      armed = true;
    }, 150);
    const onViewportChange = () => {
      if (armed) setIsOpen(false);
    };
    window.addEventListener('scroll', onViewportChange, { capture: true, passive: true });
    window.addEventListener('resize', onViewportChange);
    return () => {
      window.clearTimeout(armTimer);
      window.removeEventListener('scroll', onViewportChange, { capture: true });
      window.removeEventListener('resize', onViewportChange);
    };
  }, [isOpen, setIsOpen]);

  // -------------------------------------------------------------------------
  // Item registry
  // -------------------------------------------------------------------------

  const itemMapRef = useRef<Map<string, RegisteredItem>>(new Map());
  // Persistent label cache — survives Item unmount (Radix Popover unmounts
  // Content+Items on close). Keeps tag labels available when the dropdown
  // is closed. Live operations (getVisibleItems, keyboard nav) use itemMapRef.
  const labelCacheRef = useRef<Map<string, React.ReactNode>>(new Map());
  const [, forceUpdate] = useState(0);

  const registerItem = useCallback(
    (
      value: string,
      label: React.ReactNode,
      textContent: string,
      disabled: boolean,
      ref: React.RefObject<HTMLElement | null>,
    ) => {
      labelCacheRef.current.set(value, label);
      const prev = itemMapRef.current.get(value);
      if (
        !prev ||
        prev.label !== label ||
        prev.disabled !== disabled ||
        prev.textContent !== textContent
      ) {
        itemMapRef.current.set(value, { value, label, textContent, disabled, ref });
        forceUpdate((n) => n + 1);
      }
    },
    [],
  );

  const unregisterItem = useCallback((value: string) => {
    if (itemMapRef.current.has(value)) {
      itemMapRef.current.delete(value);
      forceUpdate((n) => n + 1);
    }
  }, []);

  const primeLabelCache = useCallback((value: string, label: React.ReactNode) => {
    labelCacheRef.current.set(value, label);
  }, []);

  const getLabel = useCallback((value: string) => {
    return itemMapRef.current.get(value)?.label ?? labelCacheRef.current.get(value);
  }, []);

  const getVisibleItems = useCallback((): RegisteredItem[] => {
    const items: RegisteredItem[] = [];
    itemMapRef.current.forEach((item) => {
      if (bypassFilter || filterFn(inputValue, item.value, item.textContent)) {
        items.push(item);
      }
    });
    return items;
  }, [inputValue, filterFn, bypassFilter]);

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

  // When the dropdown opens (single-mode, no filter), highlight the currently
  // selected value so arrow-nav starts from there rather than from the first
  // item. If nothing is selected, leave the highlight at 0.
  useEffect(() => {
    if (!isOpen || multiple || inputValue !== '') return;
    const currentValue = selectedValues[0];
    if (!currentValue) return;
    const visible = getVisibleItems();
    const idx = visible.findIndex((item) => item.value === currentValue);
    if (idx >= 0) setHighlightedIndex(idx);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------------------------------------------------------
  // Selection
  // -------------------------------------------------------------------------

  const onSelect = useCallback(
    (value: string) => {
      if (multiple) {
        setSelectedValues((prev) => {
          if (prev.includes(value)) {
            return prev.filter((v) => v !== value);
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
        // Prefer the animated close (sets isClosing → plays the exit) over an
        // instant setIsOpen(false), so selecting matches outside-click/Escape.
        if (requestClose) requestClose();
        else setIsOpen(false);
        setHighlightedIndex(-1);
      }
    },
    [multiple, closeOnSelect, setSelectedValues, setInputValue, setIsOpen, requestClose],
  );

  const onDeselect = useCallback(
    (value: string) => {
      setSelectedValues((prev) => prev.filter((v) => v !== value));
    },
    [setSelectedValues],
  );

  const isSelected = useCallback(
    (value: string) => {
      return selectedValues.includes(value);
    },
    [selectedValues],
  );

  const clearAll = useCallback(() => {
    setSelectedValues([]);
    setInputValue('');
    inputRef.current?.focus();
  }, [setSelectedValues, setInputValue]);

  // -------------------------------------------------------------------------
  // Input value change handler
  // -------------------------------------------------------------------------

  const handleInputValueChange = useCallback(
    (value: string) => {
      setInputValue(value);
      setBypassFilter(false);
      if (!isOpen) {
        open();
      }
    },
    [setInputValue, isOpen, open],
  );

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
    bypassFilter,
    setBypassFilter,
    highlightedIndex,
    setHighlightedIndex,
    highlightedValue,
    registerItem,
    unregisterItem,
    primeLabelCache,
    getLabel,
    getVisibleItems,
    loading,
    hasError,
    retry,
    closeOnSelect,
    openOnFocus,
    filterFn,
    baseId,
    listboxId,
    getItemId,
  };
}
