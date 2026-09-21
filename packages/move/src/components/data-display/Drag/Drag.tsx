'use client';
// Generated from Drag.spec.ts

import * as React from 'react';
import { createPortal } from 'react-dom';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useDragRegistry, useDropTarget, useFileDropTarget } from '../../../hooks';
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
  /** Announced when files land on a file zone. */
  filesDropped: (count: number) => string;
  /** Announced when files are released on a file zone that refuses them. */
  filesRefused: (count: number) => string;
}

export const DEFAULT_DRAG_LABELS: DragLabels = {
  // Positions, not indices: "position 3 of 10" is what a person hears, where
  // "index 2" is what the array holds.
  lifted: (position, count) => `Lifted. Position ${position} of ${count}.`,
  dropped: (position, count) => `Dropped at position ${position} of ${count}.`,
  cancelled: 'Cancelled. Returned to the original position.',
  droppedOn: (target) => `Dropped on ${target}.`,
  filesDropped: (count) => `${count} file${count === 1 ? '' : 's'} added.`,
  filesRefused: (count) => `${count} file${count === 1 ? '' : 's'} refused. Not an accepted type.`,
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
function DragRoot({ onDrop, labels: labelsProp, children }: DragRootProps) {
  const labels = React.useMemo(() => ({ ...DEFAULT_DRAG_LABELS, ...labelsProp }), [labelsProp]);
  // Names the zone a payload landed on. A drop at a POSITION is Sortable's to
  // announce, and it does; a drop on a zone had nobody saying anything at all.
  const announceDrop = React.useCallback(
    (event: DropEvent) => (event.target ? labels.droppedOn(event.target.id) : null),
    [labels],
  );
  const { value, message, Context } = useDragRegistry(onDrop, announceDrop);

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
      {/* The layer a dragged thing is drawn on, at the end of the body and so
          outside every clip on the page. A drag that stayed in place was cut
          off by any ancestor with `overflow: hidden` — a Drawer, a card with a
          rounded corner, a scroll region — and no z-index reaches past that,
          because it is containment rather than order. Empty and untouchable
          until something is lifted onto it. */}
      {createPortal(
        <div
          data-move-drag-layer=""
          className={styles.layer}
          ref={(node: HTMLDivElement | null) => {
            value.layerRef.current = node;
          }}
        />,
        document.body,
      )}
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

/**
 * A zone that takes files from outside the browser.
 *
 * Same three states as `Drag.Zone`, on the same attributes, so a drop target
 * reads the same whether what lands on it came from the page or the desktop.
 * The mechanism cannot be shared — files arrive only through the native drop
 * event's DataTransfer — so the hook differs and everything the reader
 * experiences does not.
 */
export interface DragFileZoneProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onDrop'> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Accepted types, as the `accept` attribute spells them (`image/*`, `.pdf`). */
  accept?: string[];
  disabled?: boolean;
  /** Called with the files once they land and are accepted. */
  onDrop?: (files: File[]) => void;
  labels?: Partial<DragLabels>;
  sp?: SlotPropsMap<'zone'>;
}

const DragFileZone = withMoveComponent<'zone', DragFileZoneProps, HTMLDivElement>({
  name: 'DragFileZone',
  styles,
  slots: ['zone'] as const,
  defaults: { disabled: false },
  moveProps: ['accept', 'disabled', 'onDrop', 'labels'],

  setup({ props, ref, cx, sp, attrs }) {
    const labels = React.useMemo(
      () => ({ ...DEFAULT_DRAG_LABELS, ...(props.labels as Partial<DragLabels>) }),
      [props.labels],
    );
    const announce = React.useCallback(
      (count: number, accepted: boolean) =>
        accepted ? labels.filesDropped(count) : labels.filesRefused(count),
      [labels],
    );

    const { handlers, isOver, canDrop, message } = useFileDropTarget({
      accept: props.accept as string[] | undefined,
      disabled: props.disabled as boolean,
      onDrop: props.onDrop as ((files: File[]) => void) | undefined,
      announce,
    });

    return {
      render() {
        const zoneSp = sp('zone');
        const { className: spClass, style: spStyle, ...spRest } = zoneSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            {...handlers}
            ref={ref}
            className={cx('zone', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-over={isOver ? '' : undefined}
            data-can-drop={isOver && canDrop ? '' : undefined}
            data-disabled={props.disabled ? '' : undefined}
          >
            {props.children as React.ReactNode}
            {/* Always rendered, never conditional — an aria-live element added at
                the moment its text arrives has not been observed yet, so the
                first announcement of every session would be silent. Its own,
                rather than Drag.Root's: a file zone is useful on its own and
                should not need a provider around it to be heard. */}
            <div
              aria-live="polite"
              aria-atomic="true"
              data-move-drag-announcer=""
              className={styles.announcer}
            >
              {message}
            </div>
          </div>
        );
      },
    };
  },
});

export const Drag = Object.assign(DragRoot, {
  Root: DragRoot,
  Zone: DragZone,
  FileZone: DragFileZone,
});
