// Generated from Accordion.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { useCallback, useRef } from 'react';
import { useControlledState } from '../../../engine';

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
  /** Allow closing all items in single mode (default true) */
  collapsible?: boolean;
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

export function useAccordion(options: UseAccordionOptions = {}): UseAccordionReturn {
  const {
    multiple = false,
    collapsible = true,
    selectOnFocus = false,
  } = options;

  const emptyValue = multiple ? [] : '';

  const [value, setValue] = useControlledState<string | string[]>({
    value: options.value,
    defaultValue: options.defaultValue ?? emptyValue,
    onChange: options.onValueChange,
  });

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
        if (value === itemValue) {
          if (collapsible) setValue('');
        } else {
          setValue(itemValue);
        }
      }
    },
    [value, multiple, collapsible, setValue]
  );

  const onHeaderClick = useCallback(
    (itemValue: string) => {
      updateValue(itemValue);
    },
    [updateValue]
  );

  const getTriggers = (currentTarget: EventTarget): HTMLElement[] => {
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
