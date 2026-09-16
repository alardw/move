import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDraggable, useDragContext } from './dragDrop';
import type { DropEvent } from './dragDrop';

/** Where a move started, and where it ended up. `destination: null` = dropped nowhere. */
export interface SortableChange {
  source: { list?: string; index: number };
  destination: { list?: string; index: number } | null;
}

/** One named way to move the focused item — the keyboard path. */
export interface SortableMoveAction {
  /** Stable key: 'up' | 'down' | 'top' | 'bottom'. */
  id: string;
  /** Human label, already resolved from `labels`. */
  label: string;
  /** True at the ends of the list, where the move would do nothing. */
  disabled: boolean;
  /** Performs the move: calls `onReorder` and announces it. */
  perform: () => void;
}

export interface UseSortableLabels {
  moveUp: string;
  moveDown: string;
  moveToTop: string;
  moveToBottom: string;
  /** Announced on pick up. Receives the 1-based position and the total. */
  lifted: (position: number, count: number) => string;
  /** Announced on drop. Receives the 1-based position and the total. */
  dropped: (position: number, count: number) => string;
  /** Announced when a drag is abandoned. */
  cancelled: string;
}

export const DEFAULT_SORTABLE_LABELS: UseSortableLabels = {
  moveUp: 'Move up',
  moveDown: 'Move down',
  moveToTop: 'Move to top',
  moveToBottom: 'Move to bottom',
  // Positions, not indices: "position 3 of 10" is what a person hears, where
  // "index 2" is what the array holds.
  lifted: (position, count) => `Lifted. Position ${position} of ${count}.`,
  dropped: (position, count) => `Dropped at position ${position} of ${count}.`,
  cancelled: 'Cancelled. Returned to the original position.',
};

export interface UseSortableOptions {
  /** Identifies this item. Carried on the drag payload. */
  id: string;
  /** This item's current position in the consumer's array. */
  index: number;
  /** How many items the list holds — bounds the moves and the announcements. */
  count: number;
  /** Identifies the list. Two lists with different ids is what cross-list needs. */
  list?: string;
  /** An item that cannot move — a closed point, a pinned row. */
  disabled?: boolean;
  /** The axis the list runs along. Default `'vertical'`. */
  axis?: 'vertical' | 'horizontal';
  /** The only call-site obligation: apply the move to your own data. */
  onReorder?: (change: SortableChange) => void;
  labels?: Partial<UseSortableLabels>;
}

export interface UseSortableReturn<T extends HTMLElement> {
  /** Attach to the item — any element, or any Move component (they forward ref). */
  ref: React.RefObject<T | null>;
  /** Spread onto the drag handle. Carries no `style`. */
  handleProps: {
    ref: React.RefCallback<HTMLElement>;
    onPointerDown: (e: React.PointerEvent) => void;
    'aria-disabled'?: true;
  };
  /** True while this item is following the pointer. */
  isDragging: boolean;
  /** Where the item would land if dropped now, or `null` when not dragging. */
  dropIndex: number | null;
  /** The keyboard path: render these in a menu off the handle. */
  moveActions: SortableMoveAction[];
}

/** Marks an item so its siblings can be measured at lift. */
const ITEM_ATTR = 'data-sortable-item';

/**
 * Reordering within an ordered list — the common case, as a preset over
 * `useDraggable`.
 *
 * It is a preset rather than the system because two of the things a list needs
 * are not reordering at all: a fixed slot that stays visible while empty holds
 * no item to reorder, and dropping into a second list leaves this one entirely.
 * Both are `useDropTarget`, which is why the layer below exists. Reach for this
 * hook when items swap places inside one container, and for the pair underneath
 * when something has to catch a drag.
 *
 * Component-agnostic by construction: what comes back is a `ref`, so it attaches
 * to a `List.Item`, a `Card`, a `Timeline.Item` or a bare element equally. No
 * component grows a `reorderable` prop, and nothing is rewritten to become
 * sortable.
 *
 * The keyboard path is `moveActions` — named moves for the focused item, meant
 * for a menu off the handle. Deliberately not an arrow-key drag: Atlassian,
 * having written and maintained the reference implementation of arrow-key
 * dragging, now recommend against it, because the movement does not generalise
 * across layouts, costs too many keystrokes on a long list, and fights screen
 * readers. Named outcomes work from one focus stop.
 *
 * Items moving aside is NOT this hook's job — that is a FLIP on the container,
 * which `useAutoLayout` already does. Wrap the list in `LayoutGroup`.
 */
export function useSortable<T extends HTMLElement = HTMLElement>(
  options: UseSortableOptions,
): UseSortableReturn<T> {
  const {
    id,
    index,
    count,
    list,
    disabled = false,
    axis = 'vertical',
    onReorder,
    labels: labelsProp,
  } = options;

  const labels = useMemo(() => ({ ...DEFAULT_SORTABLE_LABELS, ...labelsProp }), [labelsProp]);
  const ctx = useDragContext();
  const announce = useCallback((m: string) => ctx?.announce(m), [ctx]);

  const [dropIndex, setDropIndex] = useState<number | null>(null);
  /** Sibling midpoints along the axis, measured once at lift. */
  const midpoints = useRef<number[]>([]);
  /** This item's own midpoint at lift, before any transform moved it. */
  const origin = useRef(0);
  /** Where this item sits among the measured siblings. */
  const originPos = useRef(0);
  const target = useRef(index);

  const commit = useCallback(
    (to: number) => {
      if (to === index || to < 0 || to > count - 1) return;
      onReorder?.({ source: { list, index }, destination: { list, index: to } });
      announce(labels.dropped(to + 1, count));
    },
    [index, count, list, onReorder, announce, labels],
  );

  const onDragEnd = useCallback(
    (event: DropEvent) => {
      setDropIndex(null);
      // A drop caught by a target elsewhere is that target's business — it
      // already has the payload, and reordering this list would move the item
      // twice.
      if (event.target && event.target.id !== list) return;
      if (event.cancelled || target.current === index) {
        onReorder?.({ source: { list, index }, destination: null });
        announce(labels.cancelled);
        return;
      }
      commit(target.current);
    },
    [commit, index, list, onReorder, announce, labels],
  );

  const draggable = useDraggable<T>({
    id,
    group: list,
    disabled,
    axis,
    onDragEnd,
  });
  const { ref, isDragging } = draggable;

  // Measure siblings at lift. Reading rects per move would thrash layout, and
  // they cannot shift while one item is out of flow.
  useEffect(() => {
    if (!isDragging) return;
    const el = ref.current;
    if (!el) return;
    const siblings = Array.from(
      el.parentElement?.querySelectorAll<HTMLElement>(`[${ITEM_ATTR}]`) ?? [],
    );
    // One measurement pass, this item included — its own midpoint is the origin
    // the displacement is added to. Re-reading its rect during the drag would
    // read the transform back and chase its own tail.
    midpoints.current = siblings.map((s) => {
      const r = s.getBoundingClientRect();
      return axis === 'vertical' ? r.top + r.height / 2 : r.left + r.width / 2;
    });
    const self = siblings.indexOf(el);
    originPos.current = Math.max(0, self);
    origin.current = self >= 0 ? midpoints.current[self] : 0;
    target.current = index;
    setDropIndex(index);
    announce(labels.lifted(index + 1, count));
  }, [isDragging, axis, index, count, ref, announce, labels]);

  // Which slot the item is over, from the displacement the draggable reports
  // against the midpoint it started at.
  const { delta } = draggable;
  useEffect(() => {
    if (!isDragging) return;
    const moved = origin.current + (axis === 'vertical' ? delta.y : delta.x);
    // Its OWN midpoint is skipped. Counting it means the row is past one
    // boundary the instant it moves down at all — a single pixel of travel
    // reads as a move, and every downward drag lands one place too far.
    let next = 0;
    midpoints.current.forEach((mid, i) => {
      if (i === originPos.current) return;
      if (moved > mid) next += 1;
    });
    next = Math.max(0, Math.min(count - 1, next));
    if (next !== target.current) {
      target.current = next;
      setDropIndex(next);
    }
  }, [isDragging, delta, axis, count]);

  // Marks the item so a lift can find its siblings to measure.
  useEffect(() => {
    ref.current?.setAttribute(ITEM_ATTR, '');
  }, [ref]);

  const moveActions = useMemo<SortableMoveAction[]>(() => {
    if (disabled) return [];
    const first = index === 0;
    const last = index === count - 1;
    return [
      { id: 'up', label: labels.moveUp, disabled: first, perform: () => commit(index - 1) },
      { id: 'down', label: labels.moveDown, disabled: last, perform: () => commit(index + 1) },
      { id: 'top', label: labels.moveToTop, disabled: first, perform: () => commit(0) },
      {
        id: 'bottom',
        label: labels.moveToBottom,
        disabled: last,
        perform: () => commit(count - 1),
      },
    ];
  }, [disabled, index, count, labels, commit]);

  return {
    ref,
    handleProps: draggable.handleProps,
    isDragging,
    dropIndex,
    moveActions,
  };
}
