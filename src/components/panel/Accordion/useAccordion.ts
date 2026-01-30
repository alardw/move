import { useCallback, useRef } from 'react';
import { useControlledState } from '../../../engine/useControlledState';

// =============================================================================
// Types
// =============================================================================

export interface UseAccordionOptions {
  /** Controlled value (string for single, string[] for multiple) */
  value?: string | string[];
  /** Default value for uncontrolled mode */
  defaultValue?: string | string[];
  /** Allow multiple items open at once */
  multiple?: boolean;
  /** Called when value changes */
  onValueChange?: (value: string | string[]) => void;
  /** Whether to select the item on focus (during keyboard nav) */
  selectOnFocus?: boolean;
}

export interface UseAccordionReturn {
  /** Current value */
  value: string | string[];
  /** Update the value (open/close an item) */
  updateValue: (itemValue: string) => void;
  /** Check if an item is active (open) */
  isItemActive: (itemValue: string) => boolean;
  /** Click handler for header triggers */
  onHeaderClick: (itemValue: string) => void;
  /** Keyboard handler for header triggers */
  onHeaderKeyDown: (e: React.KeyboardEvent, itemValue: string) => void;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Headless accordion hook.
 * Handles value management (single/multiple), keyboard navigation
 * (Arrow Up/Down, Home/End, Enter/Space), focus management.
 */
export function useAccordion(options: UseAccordionOptions = {}): UseAccordionReturn {
  const {
    multiple = false,
    selectOnFocus = false,
  } = options;

  const emptyValue = multiple ? [] : '';

  const [value, setValue] = useControlledState<string | string[]>({
    value: options.value,
    defaultValue: options.defaultValue ?? emptyValue,
    onChange: options.onValueChange,
  });

  // Ref to the root element for DOM queries
  const rootRef = useRef<HTMLElement | null>(null);

  const isItemActive = useCallback(
    (itemValue: string): boolean => {
      if (multiple) {
        return Array.isArray(value) && value.includes(itemValue);
      }
      return value === itemValue;
    },
    [value, multiple]
  );

  const updateValue = useCallback(
    (itemValue: string) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        if (currentValues.includes(itemValue)) {
          setValue(currentValues.filter((v) => v !== itemValue));
        } else {
          setValue([...currentValues, itemValue]);
        }
      } else {
        // Single mode: toggle (collapsible)
        setValue(value === itemValue ? '' : itemValue);
      }
    },
    [value, multiple, setValue]
  );

  const onHeaderClick = useCallback(
    (itemValue: string) => {
      updateValue(itemValue);
    },
    [updateValue]
  );

  const getTriggers = (currentTarget: EventTarget): HTMLElement[] => {
    // Walk up to find the accordion root, then find all triggers
    const target = currentTarget as HTMLElement;
    const root = target.closest('[data-move-accordion-root]');
    if (!root) return [];
    return Array.from(root.querySelectorAll<HTMLElement>('[data-move-accordion-trigger]'));
  };

  const focusTrigger = (triggers: HTMLElement[], index: number) => {
    if (index < 0 || index >= triggers.length) return;
    triggers[index].focus();
    if (selectOnFocus) {
      const value = triggers[index].getAttribute('data-value');
      if (value) updateValue(value);
    }
  };

  const onHeaderKeyDown = useCallback(
    (e: React.KeyboardEvent, itemValue: string) => {
      const triggers = getTriggers(e.currentTarget);
      const currentIndex = triggers.indexOf(e.currentTarget as HTMLElement);

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const next = (currentIndex + 1) % triggers.length;
          focusTrigger(triggers, next);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prev = (currentIndex - 1 + triggers.length) % triggers.length;
          focusTrigger(triggers, prev);
          break;
        }
        case 'Home': {
          e.preventDefault();
          focusTrigger(triggers, 0);
          break;
        }
        case 'End': {
          e.preventDefault();
          focusTrigger(triggers, triggers.length - 1);
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          updateValue(itemValue);
          break;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateValue, selectOnFocus]
  );

  return {
    value,
    updateValue,
    isItemActive,
    onHeaderClick,
    onHeaderKeyDown,
  };
}
