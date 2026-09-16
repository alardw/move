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
import type { SortableChange, UseSortableLabels } from '../../../hooks';
import { Drag } from '../Drag';
import { Dropdown } from '../../overlays/Dropdown';
import { Button } from '../../actions/Button';
import { Icon } from '../../../infrastructure/Icon';
import { LayoutGroup } from '../../layout/LayoutGroup';
import styles from './Sortable.module.css';

export type SortableAxis = 'vertical' | 'horizontal';
export type SortableHandlePlacement = 'start' | 'end' | 'none';

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
  /** Where the carried row would land, broadcast so every row can draw its edge. */
  dropIndex: number | null;
  setDropIndex: (index: number | null) => void;
}

const SortableContext = React.createContext<SortableContextValue | null>(null);

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
  sp?: SlotPropsMap<'root'>;
}

const SortableRoot = withMoveComponent<'root', SortableRootProps, HTMLDivElement>({
  name: 'SortableRoot',
  styles,
  slots: ['root'] as const,
  defaults: { axis: 'vertical' as SortableAxis, animate: true },
  moveProps: ['onReorder', 'list', 'labels'],

  setup({ props, ref, cx, sp, attrs }) {
    const labels = React.useMemo(
      () => ({ ...DEFAULT_SORTABLE_LABELS, ...(props.labels as Partial<SortableLabels>) }),
      [props.labels],
    );
    const [dropIndex, setDropIndex] = React.useState<number | null>(null);
    const count = React.Children.count(props.children);
    const outerCtx = useDragContext();

    const value = React.useMemo<SortableContextValue>(
      () => ({
        list: props.list as string | undefined,
        axis: props.axis as SortableAxis,
        count,
        onReorder: props.onReorder as ((c: SortableChange) => void) | undefined,
        labels,
        dropIndex,
        setDropIndex,
      }),
      [props.list, props.axis, count, props.onReorder, labels, dropIndex],
    );

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

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
          </div>
        );

        // LayoutGroup is what slides the rows to their new places — a FLIP on the
        // container, already built. Nothing here re-implements it.
        const body = props.animate ? (
          <LayoutGroup asChild duration={200}>
            {list}
          </LayoutGroup>
        ) : (
          list
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
   * Where the grab point sits, or `none` to make the whole row draggable — right
   * for a card, which already reads as liftable, and wrong for a row that holds
   * other controls.
   */
  handle?: SortableHandlePlacement;
  /** A row that cannot move. It keeps its place while others reorder around it. */
  disabled?: boolean;
  /** Names this row for the handle and the announcements. */
  label?: string;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'item' | 'handle'>;
}

const SortableItem = withMoveComponent<'item' | 'handle', SortableItemProps, HTMLDivElement>({
  name: 'SortableItem',
  styles,
  slots: ['item', 'handle'] as const,
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
      onReorder: ctx.onReorder,
      labels: ctx.labels,
    });

    // Only the carried row knows where it would land; every row has to draw it.
    const { setDropIndex } = ctx;
    React.useEffect(() => {
      if (isDragging) setDropIndex(dropIndex);
    }, [isDragging, dropIndex, setDropIndex]);
    React.useEffect(() => {
      if (!isDragging) return;
      return () => setDropIndex(null);
    }, [isDragging, setDropIndex]);

    const showEdge = ctx.dropIndex !== null && !isDragging && ctx.dropIndex === index;
    const isLast = index === ctx.count - 1;

    const onHandleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setMenuOpen(true);
      }
    };

    return {
      render() {
        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;
        const handleSp = sp('handle');
        const { className: hClass, ...hRest } = handleSp as Record<string, unknown>;

        const placement = props.handle as SortableHandlePlacement;
        const grip =
          placement === 'none' || props.disabled ? null : (
            <Dropdown.Root
              open={menuOpen}
              // Closing is always honoured; opening only from the keydown above,
              // so a pointer press on the handle starts a drag and nothing else.
              onOpenChange={(open) => {
                if (!open) setMenuOpen(false);
              }}
            >
              <Dropdown.Trigger asChild>
                <Button
                  {...handleProps}
                  {...hRest}
                  variant="ghost"
                  size="sm"
                  className={cx('handle', hClass as string | undefined)}
                  aria-label={ctx.labels.dragHandle(label)}
                  onKeyDown={onHandleKeyDown}
                >
                  <Icon name="grip-vertical" />
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Content>
                {moveActions.map((a) => (
                  <Dropdown.Item
                    key={a.id}
                    disabled={a.disabled}
                    onSelect={() => {
                      a.perform();
                      // The row has moved, so the menu's own actions no longer
                      // describe where it is.
                      setMenuOpen(false);
                    }}
                  >
                    {a.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown.Root>
          );

        // With no handle the whole row is the grab point, so the drag listeners
        // go on the row itself.
        const rowDragProps = placement === 'none' && !props.disabled ? handleProps : {};

        return (
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
            // The indicator draws between two positions. The last row carries the
            // trailing edge because there is no row after it to carry one.
            data-drop-before={showEdge && !isLast ? '' : undefined}
            data-drop-after={showEdge && isLast ? '' : undefined}
          >
            {placement === 'start' && grip}
            {props.children}
            {placement === 'end' && grip}
          </div>
        );
      },
    };
  },
});

export const Sortable = Object.assign(SortableRoot, {
  Root: SortableRoot,
  Item: SortableItem,
});
