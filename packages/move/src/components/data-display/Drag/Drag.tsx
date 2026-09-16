'use client';
// Generated from Drag.spec.ts

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useDragRegistry, useDropTarget } from '../../../hooks';
import type { DragPayload, DropEvent } from '../../../hooks';
import styles from './Drag.module.css';

export interface DragLabels {
  /** Announced on pick up. Receives the 1-based position and the total. */
  lifted: (position: number, count: number) => string;
  /** Announced on a completed move. */
  dropped: (position: number, count: number) => string;
  /** Announced when a drag is abandoned. */
  cancelled: string;
  /** Announced when a payload lands on a named zone rather than a position. */
  droppedOn: (target: string) => string;
}

export const DEFAULT_DRAG_LABELS: DragLabels = {
  // Positions, not indices: "position 3 of 10" is what a person hears, where
  // "index 2" is what the array holds.
  lifted: (position, count) => `Lifted. Position ${position} of ${count}.`,
  dropped: (position, count) => `Dropped at position ${position} of ${count}.`,
  cancelled: 'Cancelled. Returned to the original position.',
  droppedOn: (target) => `Dropped on ${target}.`,
};

export interface DragRootProps {
  /**
   * Fires for every drop in the tree, after the target's own handler — for a
   * consumer who keeps one reducer rather than a handler per zone.
   */
  onDrop?: (event: DropEvent) => void;
  /** Strings the live region speaks. */
  labels?: Partial<DragLabels>;
  children?: React.ReactNode;
}

/**
 * The context every drag and every drop target in the tree shares.
 *
 * Not a factory component and not a wrapper element: it renders the live region
 * and nothing else, so it can be dropped anywhere in a tree without becoming a
 * layout box the consumer then has to work around. The layout stays theirs.
 */
function DragRoot({ onDrop, children }: DragRootProps) {
  const { value, message, Context } = useDragRegistry(onDrop);

  return (
    <Context.Provider value={value}>
      {children}
      {/* Always rendered, never conditional. An `aria-live` element added at the
          moment its text arrives has not been observed yet, so the first
          announcement of every session would be silent. */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        data-move-drag-announcer=""
        className={styles.announcer}
      >
        {message}
      </div>
    </Context.Provider>
  );
}
DragRoot.displayName = 'DragRoot';

// `onDrop` is deliberately redefined: the native one belongs to the HTML5
// drag-and-drop API, which this does not use — it is pointer events throughout,
// because HTML5 drag has no touch support and no control over its own preview.
export interface DragZoneProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onDrop'> {
  /** Identifies the target in the drop event. */
  id: string;
  /** Names a group of targets, carried into the drop event. */
  group?: string;
  /**
   * Refuse a payload. The zone shows the refusal while the pointer is still
   * over it, so the answer arrives before the release rather than after.
   */
  accepts?: (payload: DragPayload) => boolean;
  /** Called when a payload this zone accepts is released over it. */
  onDrop?: (event: DropEvent) => void;
  /** Catches nothing, and does not highlight. */
  disabled?: boolean;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'zone'>;
}

/**
 * A drop target.
 *
 * This is the half reordering cannot express: a slot that stays visible while
 * empty holds no item to reorder, and a second list is somewhere an item leaves
 * the first entirely.
 */
const DragZone = withMoveComponent<'zone', DragZoneProps, HTMLDivElement>({
  name: 'DragZone',
  styles,
  slots: ['zone'] as const,
  defaults: { disabled: false },
  moveProps: ['group', 'accepts', 'onDrop'],

  setup({ props, ref, cx, sp, attrs }) {
    const {
      ref: zoneRef,
      isOver,
      isDragActive,
      canDrop,
    } = useDropTarget<HTMLDivElement>({
      id: props.id as string,
      group: props.group as string | undefined,
      accepts: props.accepts as ((p: DragPayload) => boolean) | undefined,
      onDrop: props.onDrop as ((e: DropEvent) => void) | undefined,
      disabled: props.disabled as boolean,
    });

    return {
      render() {
        const zoneSp = sp('zone');
        const { className: spClass, style: spStyle, ...spRest } = zoneSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={(node: HTMLDivElement | null) => {
              zoneRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }}
            className={cx('zone', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            // Three attributes rather than one, because they answer different
            // questions: something is being dragged somewhere, it is over THIS
            // zone, and this zone would take it. A zone that refuses says so
            // while the pointer is on it.
            data-drag-active={isDragActive ? '' : undefined}
            data-over={isOver ? '' : undefined}
            data-can-drop={canDrop ? '' : undefined}
            data-disabled={props.disabled ? '' : undefined}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

export const Drag = Object.assign(DragRoot, {
  Root: DragRoot,
  Zone: DragZone,
});
