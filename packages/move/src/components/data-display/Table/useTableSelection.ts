'use client';
import * as React from 'react';
import { useControlledState } from '../../../engine';

export interface UseTableSelectionOptions<T> {
  /** The full list of selectable items. Used by `toggleAll` and the
   *  all/some computed flags. */
  items: readonly T[];
  /** Extract a stable string id from each item. */
  getKey: (item: T) => string;
  /** Controlled value — array of selected keys. */
  value?: string[];
  /** Initial value when uncontrolled. */
  defaultValue?: string[];
  /** Fires on any change to the selection. */
  onChange?: (selected: string[]) => void;
}

export interface UseTableSelectionReturn {
  /** Set of currently selected keys. Stable reference per commit. */
  selected: Set<string>;
  /** Fast membership check. */
  isSelected: (key: string) => boolean;
  /** True when every item in `items` is selected. */
  isAllSelected: boolean;
  /** True when at least one (but not all) items are selected — use
   *  this to drive the indeterminate state on the header checkbox. */
  isSomeSelected: boolean;
  /** How many items are currently selected. */
  count: number;
  /** Toggle one item by key. */
  toggle: (key: string) => void;
  /** Toggle all-or-nothing. When any item is selected, clears the
   *  selection; otherwise selects everything. */
  toggleAll: () => void;
  /** Clear the selection. */
  clear: () => void;
}

/**
 * Coordinate row selection across a Table.
 *
 * The hook owns the selected-keys list (controlled or uncontrolled)
 * and exposes the handlers you wire onto checkboxes in the head and
 * body. It doesn't render anything — the consumer composes the
 * checkbox column with Move's existing `<Checkbox>` inside a cell.
 */
export function useTableSelection<T>(
  options: UseTableSelectionOptions<T>,
): UseTableSelectionReturn {
  const { items, getKey, value, defaultValue, onChange } = options;

  const [raw, setRaw] = useControlledState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange,
  });

  // Memo so consumers calling isSelected in tight loops don't rebuild
  // a Set on every call.
  const selected = React.useMemo(() => new Set(raw), [raw]);

  const allKeys = React.useMemo(() => items.map(getKey), [items, getKey]);

  const isAllSelected = allKeys.length > 0 && allKeys.every((k) => selected.has(k));
  const isSomeSelected = !isAllSelected && allKeys.some((k) => selected.has(k));

  const toggle = React.useCallback(
    (key: string) => {
      setRaw((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return Array.from(next);
      });
    },
    [setRaw],
  );

  const toggleAll = React.useCallback(() => {
    setRaw((prev) => {
      const anySelected = prev.length > 0;
      return anySelected ? [] : allKeys.slice();
    });
  }, [setRaw, allKeys]);

  const clear = React.useCallback(() => setRaw([]), [setRaw]);

  const isSelected = React.useCallback((key: string) => selected.has(key), [selected]);

  return {
    selected,
    isSelected,
    isAllSelected,
    isSomeSelected,
    count: selected.size,
    toggle,
    toggleAll,
    clear,
  };
}
