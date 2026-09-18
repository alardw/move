import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/**
 * What a drag carries. `id` identifies the thing being moved; everything else is
 * the consumer's, handed back untouched on drop so the call site never has to
 * keep a side table keyed by id.
 */
export interface DragPayload {
  id: string;
  /** Names the container it came from — a list id, a column, a slot grid. */
  group?: string;
  /** The consumer's own data. */
  data?: unknown;
}

export interface DropEvent {
  payload: DragPayload;
  /** The target it landed on, or null when it was dropped nowhere. */
  target: { id: string; group?: string } | null;
  /**
   * The drag was abandoned (Escape) rather than released. Distinct from
   * `target: null`, which is a real drop that simply landed on nothing — a
   * consumer that treats the two alike either loses a move or invents one.
   */
  cancelled: boolean;
}

interface RegisteredTarget {
  id: string;
  group?: string;
  element: HTMLElement;
  disabled?: boolean;
  accepts?: (payload: DragPayload) => boolean;
  onDrop?: (event: DropEvent) => void;
}

export interface DragContextValue {
  /** The drag in flight, or null. */
  active: DragPayload | null;
  /** The drop target the pointer is over, or null. */
  overId: string | null;
  /**
   * Whether the target under the pointer would take what is being carried.
   * False while over one that refuses — which is what turns the cursor into
   * `not-allowed`, the signal every platform already uses for this.
   */
  overAccepts: boolean;
  /**
   * Where a dragged thing is DRAWN, which is not where it lives.
   *
   * An element dragged in place is subject to every ancestor it happens to sit
   * under: a `Drawer` clips it at its own edge with `overflow: hidden`, and an
   * ancestor that paints — a transform, a filter, an opacity below 1 — makes a
   * stacking context the item cannot leave however high its z-index goes. That
   * was reported as a dragged row being cut in half by the panel it was in.
   *
   * No z-index fixes it, because the problem is containment rather than order.
   * The only answer is to draw the thing somewhere else: `Drag.Root` puts this
   * layer at the end of `document.body`, outside every clip in the page, and
   * the drag is drawn there for as long as it lasts.
   *
   * A ref rather than state: it is read once per drag, and publishing it as
   * state would re-render every draggable in the tree when the layer attaches.
   */
  layerRef: React.RefObject<HTMLElement | null>;
  registerTarget: (target: RegisteredTarget) => () => void;
  beginDrag: (payload: DragPayload) => void;
  /**
   * Reports the hit back, rather than only storing it. A caller acting on the
   * state instead would be reading the PREVIOUS render's value — so the cursor
   * would lag a move behind the pointer and say the wrong thing on exactly the
   * frame the answer changed.
   */
  updateDrag: (x: number, y: number) => { overId: string | null; accepts: boolean };
  endDrag: (commit: boolean) => void;
  announce: (message: string) => void;
}

export const DragContext = createContext<DragContextValue | null>(null);

/**
 * Everything the shared half of dragging KNOWS, with nothing it draws.
 *
 * Three things cannot live on a single item: the drag in flight (a drop target
 * has to know what is coming), the registry of targets (hit-testing needs all of
 * them), and the announcement (one region, or each item announces into whichever
 * happened to mount). This hook owns all three as state; `Drag.Root` renders the
 * region and publishes the value, because a hook cannot render and an ARIA live
 * region is a rendered thing.
 *
 * Split this way so the logic stays testable without a DOM wrapper, and so the
 * component layer above stays thin enough to read.
 */
export function useDragRegistry(
  onDrop?: (event: DropEvent) => void,
  /** Announces a drop that lands on a named zone rather than at a position. */
  announceDrop?: (event: DropEvent) => string | null,
) {
  const [active, setActive] = useState<DragPayload | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [overAccepts, setOverAccepts] = useState(false);
  const [message, setMessage] = useState('');
  const targets = useRef(new Map<string, RegisteredTarget>());
  const overRef = useRef<string | null>(null);
  const activeRef = useRef<DragPayload | null>(null);
  const layerRef = useRef<HTMLElement | null>(null);

  const registerTarget = useCallback((target: RegisteredTarget) => {
    targets.current.set(target.id, target);
    return () => {
      targets.current.delete(target.id);
    };
  }, []);

  const beginDrag = useCallback((payload: DragPayload) => {
    activeRef.current = payload;
    setActive(payload);
  }, []);

  const updateDrag = useCallback((x: number, y: number) => {
    // Hit-test on every move rather than caching rects: a drop target can grow
    // as items move aside under it, so a rect measured at lift goes stale in
    // exactly the case that matters.
    let hit: string | null = null;
    let accepts = false;
    for (const target of targets.current.values()) {
      if (target.disabled) continue;
      const r = target.element.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        hit = target.id;
        const payload = activeRef.current;
        accepts = !target.accepts || (payload !== null && target.accepts(payload));
        break;
      }
    }
    if (hit !== overRef.current) {
      overRef.current = hit;
      setOverId(hit);
    }
    // Tracked separately from `overId`: the same target can change its answer
    // while the pointer sits still on it, if what is being carried changes.
    setOverAccepts(accepts);
    return { overId: hit, accepts };
  }, []);

  const endDrag = useCallback(
    (commit: boolean) => {
      // Read from the ref, not state: endDrag is called from a pointer handler
      // in the same tick the drag ends, before React has re-rendered.
      const payload = activeRef.current;
      const target = commit && overRef.current ? targets.current.get(overRef.current) : undefined;
      overRef.current = null;
      activeRef.current = null;
      setOverId(null);
      setActive(null);
      if (!payload) return;
      const event: DropEvent = {
        payload,
        target: target ? { id: target.id, group: target.group } : null,
        cancelled: !commit,
      };
      if (target && !target.disabled && (!target.accepts || target.accepts(payload))) {
        target.onDrop?.(event);
        // A drop onto a zone has no position to report, so nothing else was
        // saying it happened — a screen reader heard the lift and then silence.
        const said = announceDrop?.(event);
        if (said) setMessage(said);
      }
      onDrop?.(event);
    },
    [onDrop, announceDrop],
  );

  const value = useMemo<DragContextValue>(
    () => ({
      active,
      overId,
      overAccepts,
      layerRef,
      registerTarget,
      beginDrag,
      updateDrag,
      endDrag,
      announce: setMessage,
    }),
    [active, overId, overAccepts, registerTarget, beginDrag, updateDrag, endDrag],
  );

  return { value, message, Context: DragContext };
}

/**
 * `Drag.Root` is the provider. Kept as a hook rather than a component because a
 * hook cannot render, and the provider has a live region to put in the DOM.
 */
/** Null outside a provider — every consumer here degrades rather than throws. */
export function useDragContext(): DragContextValue | null {
  return useContext(DragContext);
}

export interface UseDraggableOptions {
  id: string;
  group?: string;
  data?: unknown;
  disabled?: boolean;
  axis?: 'vertical' | 'horizontal' | 'both';
  /**
   * Pixels the pointer must travel before this counts as a drag. Default `4`.
   * Below it the gesture is a click and never becomes a drag at all — which is
   * what lets the same handle also be a menu trigger.
   */
  activationDistance?: number;
  /** Fires on drop, whether or not a target caught it. */
  onDragEnd?: (event: DropEvent) => void;
}

export interface UseDraggableReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  handleProps: {
    ref: React.RefCallback<HTMLElement>;
    onPointerDown: (e: React.PointerEvent) => void;
    'aria-disabled'?: true;
  };
  /**
   * For when the element IS its own handle — a chip, a card, anything grabbed
   * anywhere. One spread, one ref.
   *
   * Spreading `handleProps` onto the same element as `ref` does NOT work, and
   * fails quietly: `handleProps` carries its own ref, so whichever comes second
   * wins and the other is dropped. Losing the handle ref costs the `cursor:
   * grab` and the `touch-action: none` — so the thing has no sign it can be
   * dragged, and on a trackpad the gesture scrolls the page instead. That is a
   * trap, so this exists to make the case it traps people in the easy one.
   */
  dragProps: {
    ref: React.RefCallback<T>;
    onPointerDown: (e: React.PointerEvent) => void;
    'aria-disabled'?: true;
  };
  isDragging: boolean;
  /** Pointer displacement since the lift, for a consumer that wants to read it. */
  delta: { x: number; y: number };
}

/**
 * Take a copy of the element and put it on the layer, at the pixel the original
 * occupies right now.
 *
 * A COPY, not the element itself. Moving the real node out of its parent and
 * back is the tempting version — nothing to keep in sync, and whatever the
 * element is carrying comes with it — but React holds the node as the reference
 * point for its siblings. Inserting one (Sortable adds a placeholder mid-drag)
 * calls `insertBefore` against a node that is no longer in that parent, which
 * throws where it stands. So the original stays exactly where React put it, and
 * a copy does the travelling.
 *
 * The copy is frozen on arrival. Inserting a node is a first appearance as far
 * as the browser is concerned, so every CSS animation inside it starts over —
 * which is a fade-in playing on something that has been on screen for minutes,
 * on the one frame it is picked up.
 */
function lift(el: HTMLElement, layer: HTMLElement): HTMLElement {
  // Measured before the copy is made and INCLUDING any transform: whatever the
  // element looks like at the moment of the lift is what should appear under
  // the pointer. A row already stepped aside is lifted from where it stepped.
  const rect = el.getBoundingClientRect();
  const copy = el.cloneNode(true) as HTMLElement;

  // Whatever is meant to identify ONE element stays behind with it. A duplicate
  // `id` silently breaks every `aria-labelledby` and `<label for>` aimed at the
  // original, and a duplicate test id turns a query that found the row into one
  // that finds two and throws — in the consumer's test suite, for a copy they
  // never asked for.
  for (const attr of ['id', 'data-testid']) {
    copy.removeAttribute(attr);
    copy.querySelectorAll(`[${attr}]`).forEach((node) => node.removeAttribute(attr));
  }
  // It is a picture of the thing, and the thing itself is still in the list.
  copy.setAttribute('aria-hidden', 'true');
  copy.setAttribute('data-drag-preview', '');
  // So everything already written for a dragged element reaches it here.
  copy.setAttribute('data-dragging', '');

  copy.style.position = 'absolute';
  copy.style.left = `${rect.left}px`;
  copy.style.top = `${rect.top}px`;
  copy.style.width = `${rect.width}px`;
  copy.style.height = `${rect.height}px`;
  copy.style.margin = '0';
  // The rect already accounts for any translate the element carries, so keeping
  // it would apply the same displacement twice.
  copy.style.translate = 'none';
  copy.style.transition = 'none';
  copy.style.animation = 'none';

  layer.appendChild(copy);

  // Now settle it. Inserting a node is a first appearance as far as the browser
  // is concerned, so every CSS animation inside starts from the beginning: a
  // fade-in replaying on an avatar that has been on screen for minutes, on the
  // frame the row is picked up. Overriding them in CSS would mean outranking
  // rules this hook cannot see — it attaches to any element, including ones
  // Move does not ship — so the animations are ended rather than out-argued.
  // Ended, not stopped: the end state IS what the thing looked like a moment
  // ago, which is what a picture of it should show. A loop has no end to jump
  // to and is dropped instead.
  void copy.offsetHeight;
  copy.getAnimations?.({ subtree: true }).forEach((animation) => {
    try {
      animation.finish();
    } catch {
      animation.cancel();
    }
  });
  return copy;
}

/**
 * Send the copy back to where it was lifted from, then take it away.
 *
 * An abandoned drag should be SEEN returning — the journey is what says the move
 * did not happen. The copy is the only thing that moved, so it is the only thing
 * with anywhere to go back to.
 *
 * Removed on arrival, and again on a timer: a transition that never starts fires
 * no `transitionend`, which is what happens under reduced motion and in a
 * background tab. A copy left behind would sit over the page for good.
 */
function returnHome(copy: HTMLElement) {
  const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const done = () => copy.remove();
  if (still) {
    done();
    return;
  }
  copy.style.transition = 'translate 160ms cubic-bezier(0.22, 1, 0.36, 1)';
  copy.style.translate = 'none';
  copy.addEventListener('transitionend', done, { once: true });
  window.setTimeout(done, 400);
}

/**
 * Makes one element follow the pointer.
 *
 * THE OFFSET IS WRITTEN THROUGH THE REF, not returned for the call site to
 * spread, and that is what lets this be a hook at all. A dragging element needs
 * a transform on every pointer move; handed back as a style object it would land
 * in app source as an inline `style=`, which `purity-2` refuses. Purity walks
 * composed code and never library internals, so a hook that owns the element
 * writes the same transform with nothing to excuse — where the prop-getter shape
 * dnd-kit uses would need an escape hatch at every call site.
 *
 * Works with no provider above it: it just drags, and reports a drop with no
 * target. Add `Drag.Root` when something has to catch it.
 */
export function useDraggable<T extends HTMLElement = HTMLElement>(
  options: UseDraggableOptions,
): UseDraggableReturn<T> {
  const {
    id,
    group,
    data,
    disabled = false,
    axis = 'vertical',
    activationDistance = 4,
    onDragEnd,
  } = options;
  const ctx = useDragContext();

  const ref = useRef<T>(null);
  const handleRef = useRef<HTMLElement | null>(null);
  // 'pending' is the gap between pressing and having moved far enough to mean
  // it. A press that never crosses the threshold ends as a click, with no drag
  // reported — otherwise every click on the handle would fire a drop.
  const [phase, setPhase] = useState<'idle' | 'pending' | 'dragging'>('idle');
  const [delta, setDelta] = useState({ x: 0, y: 0 });
  const start = useRef<{ x: number; y: number } | null>(null);
  const isDragging = phase === 'dragging';
  /** A committed drop whose offset is being held until the new order lands. */
  const landing = useRef(false);
  /** The copy on the drag layer, while there is one. */
  const preview = useRef<HTMLElement | null>(null);

  // A callback ref so the handle can be any element, and so the two properties
  // that make it a handle land the moment it attaches. Both are written here
  // rather than returned, per the note above.
  //
  // `touch-action: none` stops the browser scrolling the page instead of
  // starting the drag. `cursor: grab` is the only cue most people get that a
  // thing is draggable at all — an icon alone does not say it, and a consumer
  // cannot add it themselves, because an inline style in app code is what
  // `purity-2` refuses. So the hook owes them both.
  const setHandleRef = useCallback<React.RefCallback<HTMLElement>>((node) => {
    handleRef.current = node;
    if (node) {
      node.style.touchAction = 'none';
      node.style.cursor = 'grab';
    }
  }, []);

  /**
   * Put the element back where CSS wants it.
   *
   * `travel` decides whether it is SEEN going back, and the two answers mean
   * different things. A drag that was abandoned should visibly return — that
   * journey is the feedback, and it says the move did not happen. A drag that
   * was dropped should not: the element is where it was put, and animating it
   * home afterwards reads as the drop having been refused, which is the opposite
   * of what occurred.
   *
   * Suppressing it means killing any transition the element carries — its own,
   * or one inherited from whatever component it happens to be — for the single
   * frame in which the transform is removed.
   */
  const clear = useCallback((travel: boolean) => {
    const el = ref.current;
    const copy = preview.current;
    preview.current = null;
    if (copy) {
      if (travel) returnHome(copy);
      else copy.remove();
    }
    if (el) {
      if (travel) {
        el.style.translate = '';
      } else {
        const previous = el.style.transition;
        el.style.transition = 'none';
        el.style.translate = '';
        // Force the style change to land before the transition is restored,
        // or the browser coalesces the two and animates anyway.
        void el.offsetHeight;
        el.style.transition = previous;
      }
      el.removeAttribute('data-dragging');
      el.removeAttribute('data-drag-source');
    }
    if (handleRef.current) handleRef.current.style.cursor = 'grab';
    document.body.style.cursor = '';
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || e.button !== 0) return;
      const el = ref.current;
      if (!el) return;
      start.current = { x: e.clientX, y: e.clientY };
      handleRef.current?.setPointerCapture?.(e.pointerId);
      setPhase('pending');
      setDelta({ x: 0, y: 0 });
    },
    [disabled],
  );

  useEffect(() => {
    if (phase === 'idle') return;

    const onMove = (e: PointerEvent) => {
      const from = start.current;
      const el = ref.current;
      if (!from || !el) return;
      const rawX = e.clientX - from.x;
      const rawY = e.clientY - from.y;

      if (phase === 'pending') {
        if (Math.hypot(rawX, rawY) < activationDistance) return;
        const layer = ctx?.layerRef.current ?? null;
        if (layer) preview.current = lift(el, layer);
        // The original is left behind, and says so. Without a layer there is
        // nowhere else to draw it, so the element itself is the thing lifted —
        // which is what `useDraggable` does on its own, with no provider above.
        el.setAttribute(preview.current ? 'data-drag-source' : 'data-dragging', '');
        // The closed hand, on the handle AND the document: the pointer leaves
        // the handle almost immediately, and without the document rule the
        // cursor reverts to an arrow for the rest of the drag.
        if (handleRef.current) handleRef.current.style.cursor = 'grabbing';
        document.body.style.cursor = 'grabbing';
        setPhase('dragging');
        ctx?.beginDrag({ id, group, data });
      }

      const dx = axis === 'vertical' ? 0 : rawX;
      const dy = axis === 'horizontal' ? 0 : rawY;
      // `translate`, NOT `transform`. Any Move component with a hover or press
      // animation owns `transform` — Button grows a few pixels under the
      // pointer — and anime.js writes the whole property. Sharing it means the
      // moment that animation runs it animates FROM the drag offset back to
      // nothing, which looks exactly like the drop being rejected. `translate`
      // is its own property and composes with whatever transform the component
      // is doing, so neither has to know about the other.
      //
      // Written to the copy when there is one — the original has not moved and
      // must not, or the thing would be in two places at once.
      (preview.current ?? el).style.translate = `${dx}px ${dy}px`;
      setDelta({ x: dx, y: dy });
      const hit = ctx?.updateDrag(e.clientX, e.clientY);
      // `not-allowed` over a target that refuses. This is the one signal a
      // person already knows without being taught it — every desktop platform
      // uses it, and unlike a colour change it does not ask them to compare a
      // border against the one it had a moment ago.
      // On the HANDLE as well as the document. setPointerCapture routes every
      // pointer event to the handle for the rest of the gesture, and the cursor
      // is taken from the capturing element — so the handle's own `grabbing`
      // wins and a rule on body is never consulted. That is why the refusal was
      // invisible.
      const refusing = hit != null && hit.overId !== null && !hit.accepts;
      const shape = refusing ? 'not-allowed' : 'grabbing';
      if (handleRef.current) handleRef.current.style.cursor = shape;
      document.body.style.cursor = shape;
    };

    const finish = (commit: boolean) => {
      const wasDragging = phase === 'dragging';
      start.current = null;
      if (commit) {
        // DO NOT clear the offset yet.
        //
        // Clearing here puts the element back at its original slot, and the new
        // order does not exist until the consumer has applied it and React has
        // re-rendered — a whole turn later. In between, the element is drawn at
        // the place it was dragged FROM. That one frame is the flash: the thing
        // jumps home and then reappears where it was dropped.
        //
        // The layout effect below clears it after React has moved the node and
        // before the browser paints, so there is no frame in which the element
        // is anywhere but under the pointer or at its destination.
        landing.current = true;
      } else {
        // Abandoned: the journey back IS the feedback, so it happens now and is
        // seen.
        clear(true);
      }
      setPhase('idle');
      setDelta({ x: 0, y: 0 });
      // A press that never became a drag is a click. Nothing to report.
      if (!wasDragging) return;
      // Read the target before the provider clears it.
      const targetId = commit ? (ctx?.overId ?? null) : null;
      ctx?.endDrag(commit);
      onDragEnd?.({
        payload: { id, group, data },
        target: targetId ? { id: targetId } : null,
        cancelled: !commit,
      });
    };

    const onUp = () => finish(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        finish(false);
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('keydown', onKey);
    };
  }, [phase, axis, activationDistance, ctx, clear, id, group, data, onDragEnd]);

  // Runs after React has applied the new order to the DOM and before paint.
  useLayoutEffect(() => {
    if (phase !== 'idle' || !landing.current) return;
    landing.current = false;
    clear(false);
  });

  // A drag still running when the item unmounts would leave the offset behind
  // on a recycled node. Nothing is watching by then, so it never travels.
  useEffect(() => () => clear(false), [clear]);

  // One node playing both parts, so both refs land on it.
  const setBothRefs = useCallback<React.RefCallback<T>>(
    (node) => {
      ref.current = node;
      setHandleRef(node);
    },
    [setHandleRef],
  );

  const activator = {
    onPointerDown,
    ...(disabled ? ({ 'aria-disabled': true } as const) : {}),
  };

  return {
    ref,
    handleProps: { ref: setHandleRef, ...activator },
    dragProps: { ref: setBothRefs, ...activator },
    isDragging,
    delta,
  };
}

export interface UseDropTargetOptions {
  id: string;
  group?: string;
  /** Catches nothing and does not highlight. */
  disabled?: boolean;
  /** Refuse a payload — a slot that only takes one kind of thing. */
  accepts?: (payload: DragPayload) => boolean;
  onDrop?: (event: DropEvent) => void;
}

export interface UseDropTargetReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  /** The pointer is over this target with a drag in flight. */
  isOver: boolean;
  /** Something is being dragged somewhere — for dimming or outlining targets. */
  isDragActive: boolean;
  /** `isOver` and this target would take it. False while `accepts` refuses. */
  canDrop: boolean;
}

/**
 * Makes one element catch a drag.
 *
 * This is what a sortable list cannot express on its own: a fixed slot that
 * stays visible while empty is a drop target with nothing in it to reorder, and
 * a second list is a drop target that is not the one the item came from. Both
 * are why the system is draggable + target rather than reorder alone.
 *
 * Requires a `Drag.Root` above it — a target with nothing to register into
 * reports `isOver: false` forever rather than throwing.
 */
export function useDropTarget<T extends HTMLElement = HTMLElement>(
  options: UseDropTargetOptions,
): UseDropTargetReturn<T> {
  const { id, group, accepts, onDrop, disabled = false } = options;
  const ctx = useDragContext();
  const ref = useRef<T>(null);

  // The registration holds the live handlers, so a re-registration each render
  // is deliberate — a stale `onDrop` would fire the previous closure's data.
  useEffect(() => {
    const el = ref.current;
    if (!el || !ctx) return;
    return ctx.registerTarget({ id, group, element: el, accepts, onDrop, disabled });
  }, [ctx, id, group, accepts, onDrop, disabled]);

  const isOver = !disabled && ctx?.overId === id && ctx?.active != null;
  const active = ctx?.active ?? null;

  return {
    ref,
    isOver,
    isDragActive: active !== null,
    canDrop: isOver && (!accepts || (active !== null && accepts(active))),
  };
}
