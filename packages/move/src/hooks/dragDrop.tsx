import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  registerTarget: (target: RegisteredTarget) => () => void;
  beginDrag: (payload: DragPayload) => void;
  updateDrag: (x: number, y: number) => void;
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
export function useDragRegistry(onDrop?: (event: DropEvent) => void) {
  const [active, setActive] = useState<DragPayload | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const targets = useRef(new Map<string, RegisteredTarget>());
  const overRef = useRef<string | null>(null);
  const activeRef = useRef<DragPayload | null>(null);

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
    for (const target of targets.current.values()) {
      if (target.disabled) continue;
      const r = target.element.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        hit = target.id;
        break;
      }
    }
    if (hit !== overRef.current) {
      overRef.current = hit;
      setOverId(hit);
    }
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
      }
      onDrop?.(event);
    },
    [onDrop],
  );

  const value = useMemo<DragContextValue>(
    () => ({
      active,
      overId,
      registerTarget,
      beginDrag,
      updateDrag,
      endDrag,
      announce: setMessage,
    }),
    [active, overId, registerTarget, beginDrag, updateDrag, endDrag],
  );

  return { value, message, Context: DragContext };
}

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
  isDragging: boolean;
  /** Pointer displacement since the lift, for a consumer that wants to read it. */
  delta: { x: number; y: number };
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
 * target. Add `DragProvider` when something has to catch it.
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
        el.setAttribute('data-dragging', '');
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
      el.style.translate = `${dx}px ${dy}px`;
      setDelta({ x: dx, y: dy });
      ctx?.updateDrag(e.clientX, e.clientY);
    };

    const finish = (commit: boolean) => {
      const wasDragging = phase === 'dragging';
      start.current = null;
      // A committed drop lands; an abandoned one is seen returning.
      clear(!commit);
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

  // A drag still running when the item unmounts would leave the transform behind
  // on a recycled node. Nothing is watching by then, so it never travels.
  useEffect(() => () => clear(false), [clear]);

  return {
    ref,
    handleProps: {
      ref: setHandleRef,
      onPointerDown,
      ...(disabled ? ({ 'aria-disabled': true } as const) : {}),
    },
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
 * Requires a `DragProvider` above it — a target with nothing to register into
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
