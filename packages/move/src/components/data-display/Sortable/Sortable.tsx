'use client';
// Generated from Sortable.spec.ts

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import {
  useSortable,
  useDragContext,
  DEFAULT_SORTABLE_LABELS as HOOK_LABELS,
} from '../../../hooks';
import type { SortableChange, SortableMoveAction, UseSortableLabels } from '../../../hooks';
import { Drag } from '../Drag';
import { Dropdown } from '../../overlays/Dropdown';
import { Button } from '../../actions/Button';
import { Icon } from '../../../infrastructure/Icon';
import { LayoutGroup } from '../../layout/LayoutGroup';
import styles from './Sortable.module.css';

export type SortableAxis = 'vertical' | 'horizontal';
/**
 * Where the grab point is.
 *
 * `start` and `end` have Item render the handle itself, which is the common case
 * and wants no wiring. `self` makes the whole row the grab point — right for a
 * card, which already reads as liftable, and wrong for a row holding other
 * controls. `custom` means you place `<Sortable.Handle />` yourself, for a row
 * whose handle belongs after the avatar and before the status.
 */
export type SortableHandlePlacement = 'start' | 'end' | 'self' | 'custom';

/**
 * Everything the hook speaks, plus the one string only the component renders.
 * Extended rather than restated, so the move names and the announcements have
 * one definition between the two layers.
 */
export interface SortableLabels extends UseSortableLabels {
  /** Accessible name for the handle, which is otherwise an unlabelled icon button. */
  dragHandle: (label: string) => string;
}

export const DEFAULT_SORTABLE_LABELS: SortableLabels = {
  ...HOOK_LABELS,
  dragHandle: (label) => (label ? `Reorder ${label}` : 'Reorder'),
};

interface SortableContextValue {
  list?: string;
  axis: SortableAxis;
  count: number;
  onReorder?: (change: SortableChange) => void;
  labels: SortableLabels;
  /**
   * Which row is being carried and where it would land, broadcast so every OTHER
   * row can step out of the way. A list that only draws a line leaves the person
   * to imagine the result; a list that opens the gap shows it.
   */
  drag: { from: number; to: number; offset: number } | null;
  setDrag: (d: { from: number; to: number; offset: number } | null) => void;
  /**
   * Set by a row committing a DRAG, read by Root on the render that follows.
   * A drag has already moved every row to where it belongs, one step at a time,
   * so the FLIP that normally welcomes a new order would be the second motion
   * for the same move — the flip you see on drop. A move made from the menu has
   * had no such preamble and still wants it.
   */
  skipFlip: React.RefObject<boolean>;
}

const SortableContext = React.createContext<SortableContextValue | null>(null);

/** What a placed Handle needs from its row. Nothing the call site has to pass. */
interface SortableItemContextValue {
  handleProps: {
    ref: React.RefCallback<HTMLElement>;
    onPointerDown: (e: React.PointerEvent) => void;
    'aria-disabled'?: true;
  };
  onHandleKeyDown: (e: React.KeyboardEvent) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  moveActions: SortableMoveAction[];
  label: string;
  labels: SortableLabels;
  disabled: boolean;
}

const SortableItemContext = React.createContext<SortableItemContextValue | null>(null);

function useSortableItemContext() {
  const ctx = React.useContext(SortableItemContext);
  if (!ctx) throw new Error('Sortable.Handle must be used within Sortable.Item');
  return ctx;
}

function useSortableContext() {
  const ctx = React.useContext(SortableContext);
  if (!ctx) throw new Error('Sortable.Item must be used within Sortable.Root');
  return ctx;
}

export interface SortableRootProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The only call-site obligation. Applying the move is the consumer's, so the
   * order lives with the rest of their data.
   */
  onReorder?: (change: SortableChange) => void;
  /** Names this list. Two ids under one Drag.Root is what lets a row move between them. */
  list?: string;
  axis?: SortableAxis;
  /** Rows slide to their new places after a move. */
  animate?: boolean;
  labels?: Partial<SortableLabels>;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'root' | 'placeholder'>;
}

const SortableRoot = withMoveComponent<'root' | 'placeholder', SortableRootProps, HTMLDivElement>({
  name: 'SortableRoot',
  styles,
  slots: ['root', 'placeholder'] as const,
  defaults: { axis: 'vertical' as SortableAxis, animate: true },
  moveProps: ['onReorder', 'list', 'labels'],

  setup({ props, ref, cx, sp, attrs }) {
    const labels = React.useMemo(
      () => ({ ...DEFAULT_SORTABLE_LABELS, ...(props.labels as Partial<SortableLabels>) }),
      [props.labels],
    );
    const [drag, setDrag] = React.useState<SortableContextValue['drag']>(null);
    const skipFlip = React.useRef(false);
    // Cleared after every render, so the skip lasts exactly the one it was set
    // for. A move made from the menu next time still gets its FLIP.
    React.useEffect(() => {
      skipFlip.current = false;
    });
    const count = React.Children.count(props.children);
    const outerCtx = useDragContext();

    const value = React.useMemo<SortableContextValue>(
      () => ({
        list: props.list as string | undefined,
        axis: props.axis as SortableAxis,
        count,
        onReorder: props.onReorder as ((c: SortableChange) => void) | undefined,
        labels,
        drag,
        setDrag,
        skipFlip,
      }),
      [props.list, props.axis, count, props.onReorder, labels, drag],
    );

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        // The gap the rows have opened is empty space, and empty space says
        // nothing on its own. A quiet outline standing in it says the row is
        // going HERE — the same job the old line did, in the shape of the
        // result rather than a mark beside it.
        //
        // Positioned on the list rather than drawn per-row: the placeholder sits
        // at one index, and every per-row version needs a special case for the
        // last position, which has no row after it to hang from.
        const phSp = sp('placeholder');
        const { className: phClass, style: phStyle, ...phRest } = phSp as Record<string, unknown>;
        const placeholder =
          drag && drag.from !== drag.to ? (
            <div
              {...phRest}
              aria-hidden="true"
              className={cx('placeholder', phClass as string | undefined)}
              style={
                {
                  '--move-sortable-placeholder-at': `${drag.to * drag.offset}px`,
                  '--move-sortable-placeholder-size': `${drag.offset}px`,
                  ...(phStyle as React.CSSProperties),
                } as React.CSSProperties
              }
            />
          ) : null;

        const list = (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-axis={props.axis}
          >
            {props.children}
            {placeholder}
          </div>
        );

        // LayoutGroup slides the rows to their new places — a FLIP on the
        // container, already built. Nothing here re-implements it. It is skipped
        // for the render that lands a drag, because the rows arrived there
        // themselves while the pointer was down.
        // OFF for the whole drag, not just the render that lands it.
        //
        // LayoutGroup FLIPs by comparing getBoundingClientRect between renders,
        // and a rect includes `translate` — which is exactly what the shift
        // writes. So every step aside looked to it like a layout change worth
        // animating, and it animated rows the shift was already moving. The
        // placeholder mounting is a childList mutation, which woke it again.
        // Two systems moving the same rows, disagreeing about where they are.
        //
        // While a drag is in flight the rows belong to the shift. LayoutGroup
        // gets them back for a move made from the menu, which has no shift and
        // genuinely needs the positions interpolated.
        //
        // `disabled` rather than unwrapping: taking it out of the tree for one
        // render changes the shape, which unmounts and remounts every row —
        // losing their state and flashing the thing this is meant to calm.
        const body = (
          <LayoutGroup
            asChild
            duration={200}
            disabled={!props.animate || skipFlip.current || drag !== null}
          >
            {list}
          </LayoutGroup>
        );

        const inner = <SortableContext.Provider value={value}>{body}</SortableContext.Provider>;

        // A single list needs no wrapper: Root brings its own drag context when
        // there is none above it. Nested under a Drag.Root it uses that instead,
        // which is what lets two lists exchange a row.
        return outerCtx ? inner : <Drag.Root>{inner}</Drag.Root>;
      },
    };
  },
});

export interface SortableItemProps extends React.HTMLAttributes<HTMLElement> {
  /** Identifies the row across a move. */
  id: string;
  /** This row's position. */
  index: number;
  /**
   * Where the grab point sits. `start` and `end` have Item render it; `self`
   * makes the whole row draggable — right for a card, which already reads as
   * liftable, and wrong for a row that holds other controls; `custom` means you
   * place `Sortable.Handle` yourself.
   */
  handle?: SortableHandlePlacement;
  /** A row that cannot move. It keeps its place while others reorder around it. */
  disabled?: boolean;
  /** Names this row for the handle and the announcements. */
  label?: string;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'item'>;
}

const SortableItem = withMoveComponent<'item', SortableItemProps, HTMLDivElement>({
  name: 'SortableItem',
  styles,
  slots: ['item'] as const,
  defaults: { handle: 'start' as SortableHandlePlacement, disabled: false },
  moveProps: ['index', 'label'],

  setup({ props, ref, cx, sp, attrs }) {
    const ctx = useSortableContext();
    const index = props.index as number;
    const label = (props.label as string | undefined) ?? '';

    // The menu is the KEYBOARD path and only that. It opens from Enter or Space
    // on a focused handle and never from a pointer press — a pointer user is
    // dragging, and a menu opening under their finger both competes with the
    // drag and stands there after the drop.
    const [menuOpen, setMenuOpen] = React.useState(false);

    // The broadcast is cleared in the SAME tick as the reorder, so React batches
    // the two into one render. Left to the effect cleanup below it lands a tick
    // later, and in between the new order renders while the old shifts are still
    // applied — every row steps aside a second time, for one frame, which reads
    // as the list swapping twice on drop.
    const { setDrag } = ctx;
    const handleReorder = React.useCallback(
      (change: SortableChange) => {
        // Read before setDrag clears it: a drag in flight means the rows are
        // already standing in the new order, so the FLIP is skipped.
        ctx.skipFlip.current = ctx.drag !== null;
        setDrag(null);
        ctx.onReorder?.(change);
      },
      [setDrag, ctx],
    );

    const {
      ref: itemRef,
      handleProps,
      isDragging,
      dropIndex,
      moveActions,
    } = useSortable<HTMLDivElement>({
      id: props.id as string,
      index,
      count: ctx.count,
      list: ctx.list,
      disabled: props.disabled as boolean,
      axis: ctx.axis,
      onReorder: handleReorder,
      label,
      labels: ctx.labels,
    });

    // Only the carried row knows where it would land, so it publishes that —
    // along with how far one place is, measured from its own box plus the gap.
    // Every other row reads it and steps aside.
    React.useEffect(() => {
      if (!isDragging || dropIndex === null) return;
      const el = itemRef.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      const gap = parseFloat(getComputedStyle(el.parentElement ?? el).gap || '0');
      const offset = (ctx.axis === 'vertical' ? box.height : box.width) + (gap || 0);
      setDrag({ from: index, to: dropIndex, offset });
    }, [isDragging, dropIndex, index, ctx.axis, setDrag, itemRef]);

    // A safety net for the ways a drag can end without a reorder at all — the
    // row unmounting mid-drag, a pointercancel from the browser.
    React.useEffect(() => {
      if (!isDragging) return;
      return () => setDrag(null);
    }, [isDragging, setDrag]);

    /**
     * How far this row steps aside. Only the rows BETWEEN the old place and the
     * new one move, and they move by exactly one place — which is what turns the
     * list into a gap the carried row can be seen to fit.
     */
    const shift = (() => {
      const d = ctx.drag;
      if (!d || isDragging || d.from === d.to) return 0;
      if (d.from < d.to && index > d.from && index <= d.to) return -d.offset;
      if (d.from > d.to && index >= d.to && index < d.from) return d.offset;
      return 0;
    })();

    // Written through the ref, NOT React's style prop. The hook writes the
    // carried row's transform imperatively every frame; the moment React owns
    // this element's style attribute it reconciles that transform away on the
    // next render, and the row stops following the pointer. Every drag-time
    // style stays on the same side of that line.
    const wasShifted = React.useRef(false);
    // LAYOUT effect, not a plain one. A plain effect runs AFTER the browser has
    // painted, and the render that clears the shift is the same render that
    // reorders the list — so the row would be moved into its new DOM position
    // while still carrying the old translate, and paint once a full row height
    // away from where it belongs. Same one-frame displacement the carried row
    // had, on the rows that stepped aside for it.
    React.useLayoutEffect(() => {
      const el = itemRef.current;
      if (!el) return;
      if (shift !== 0) {
        wasShifted.current = true;
        el.removeAttribute('data-settling');
        el.style.setProperty('--move-sortable-shift', `${shift}px`);
        return;
      }

      // Only a row that actually STEPPED ASIDE has anything to settle.
      //
      // This used to run the whole dance for every row in the list, because the
      // "a drag just landed" flag is true for all of them — so a four-row list
      // forced four synchronous layouts in one commit, three of them for rows
      // that had never moved. Reading offsetHeight mid-commit makes the browser
      // lay out then and there, and doing it once per row is enough work to be
      // seen.
      const settling = wasShifted.current && ctx.skipFlip.current;
      wasShifted.current = false;
      if (!settling) {
        el.style.removeProperty('--move-sortable-shift');
        return;
      }
      // Going back to zero because a drag landed is not a movement: the row is
      // already where the new order puts it, and easing the shift away would
      // slide it a second time for one move. The forced layout is what makes the
      // browser take the no-transition state before the value changes.
      el.setAttribute('data-settling', '');
      el.style.removeProperty('--move-sortable-shift');
      void el.offsetHeight;
      el.removeAttribute('data-settling');
    }, [shift, itemRef, ctx.skipFlip]);

    const onHandleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setMenuOpen(true);
      }
    }, []);

    const itemCtx = React.useMemo<SortableItemContextValue>(
      () => ({
        handleProps,
        onHandleKeyDown,
        menuOpen,
        setMenuOpen,
        moveActions,
        label,
        labels: ctx.labels,
        disabled: props.disabled as boolean,
      }),
      [handleProps, onHandleKeyDown, menuOpen, moveActions, label, ctx.labels, props.disabled],
    );

    return {
      render() {
        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;
        const placement = props.handle as SortableHandlePlacement;
        const auto = placement === 'start' || placement === 'end';
        const grip = auto && !props.disabled ? <SortableHandle /> : null;

        // `self`: the whole row is the grab point, so the drag listeners go on
        // the row itself rather than on a handle inside it.
        const rowDragProps = placement === 'self' && !props.disabled ? handleProps : {};

        return (
          <SortableItemContext.Provider value={itemCtx}>
            <div
              {...attrs}
              {...spRest}
              {...rowDragProps}
              ref={(node: HTMLDivElement | null) => {
                itemRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
              }}
              className={cx('item', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
              data-handle={placement}
              data-disabled={props.disabled ? '' : undefined}
              data-shifted={shift !== 0 ? '' : undefined}
            >
              {placement === 'start' && grip}
              {props.children}
              {placement === 'end' && grip}
            </div>
          </SortableItemContext.Provider>
        );
      },
    };
  },
});

export interface SortableHandleProps {
  sp?: SlotPropsMap<'handle'>;
  className?: string;
}

/**
 * The grab point.
 *
 * Item renders one for you at the start or end — `handle="custom"` when you want
 * it somewhere else, after an avatar or before a status. It takes no props on
 * purpose: everything that makes a handle correct (the icon, the touch target,
 * the cursor, and the keyboard menu that is the whole non-pointer path) belongs
 * to the component, and placing it should never turn back into assembling it.
 */
const SortableHandle = withMoveComponent<'handle', SortableHandleProps, HTMLButtonElement>({
  name: 'SortableHandle',
  styles,
  slots: ['handle'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const item = useSortableItemContext();

    // The drag needs this node and so may the call site. Both get it.
    const setRefs = React.useCallback<React.RefCallback<HTMLButtonElement>>(
      (node) => {
        item.handleProps.ref(node);
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [item.handleProps, ref],
    );

    return {
      render() {
        if (item.disabled) return null;
        const handleSp = sp('handle');
        const { className: hClass, ...spRest } = handleSp as Record<string, unknown>;

        return (
          <Dropdown.Root
            open={item.menuOpen}
            // Closing is always honoured; opening only from the keydown below,
            // so a pointer press on the handle starts a drag and nothing else.
            onOpenChange={(open) => {
              if (!open) item.setMenuOpen(false);
            }}
          >
            <Dropdown.Trigger asChild>
              <Button
                // The default name goes BEFORE attrs, so a caller who supplies
                // their own aria-label wins rather than being silently replaced.
                aria-label={item.labels.dragHandle(item.label)}
                {...attrs}
                {...spRest}
                {...item.handleProps}
                ref={setRefs}
                variant="ghost"
                size="sm"
                className={cx('handle', props.className, hClass as string | undefined)}
                // Composed, not replaced: opening the menu is this component's
                // business, and whatever the caller wanted to do is theirs.
                onKeyDown={(e: React.KeyboardEvent) => {
                  item.onHandleKeyDown(e);
                  (attrs.onKeyDown as ((e: React.KeyboardEvent) => void) | undefined)?.(e);
                }}
              >
                <Icon name="grip-vertical" />
              </Button>
            </Dropdown.Trigger>
            <Dropdown.Content>
              {item.moveActions.map((a) => (
                <Dropdown.Item
                  key={a.id}
                  disabled={a.disabled}
                  onSelect={() => {
                    a.perform();
                    // The row has moved, so the menu's own actions no longer
                    // describe where it is.
                    item.setMenuOpen(false);
                  }}
                >
                  {a.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown.Root>
        );
      },
    };
  },
});

export const Sortable = Object.assign(SortableRoot, {
  Root: SortableRoot,
  Item: SortableItem,
  Handle: SortableHandle,
});
