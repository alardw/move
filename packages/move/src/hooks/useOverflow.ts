import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export type OverflowAxis = 'vertical' | 'horizontal' | 'both';

export interface UseOverflowOptions {
  /** Which axis to measure. Default `'vertical'`. */
  axis?: OverflowAxis;
  /** Skip measurement. Default `true`. */
  enabled?: boolean;
}

export interface UseOverflowReturn<T extends Element> {
  /** Attach to the scrollable element. */
  ref: React.RefObject<T>;
  /** Whether that element's content overflows it right now. */
  isOverflowing: boolean;
}

function measureOverflow(el: Element, axis: OverflowAxis): boolean {
  const vertical = el.scrollHeight > el.clientHeight;
  const horizontal = el.scrollWidth > el.clientWidth;
  if (axis === 'vertical') return vertical;
  if (axis === 'horizontal') return horizontal;
  return vertical || horizontal;
}

/**
 * Reports whether the referenced element's content currently overflows it — so
 * a caller can treat the element as a scroll region only when there is
 * something to scroll (a scrollport with nothing hidden needs no keyboard
 * affordance, and an always-on one is a tab stop that does nothing).
 *
 * Measures on mount and after every render (catches content growth, which
 * changes overflow without resizing the element — a no-op `setState` when
 * unchanged keeps the per-render read cheap), and re-measures on resize via
 * `ResizeObserver` (overflow is a function of available space).
 *
 * Where `ResizeObserver` is unavailable it still measures on mount/render but
 * won't re-check on resize. On the server (no DOM) the effects never run, so it
 * stays `false`.
 */
export function useOverflow<T extends Element = HTMLElement>(
  options: UseOverflowOptions = {},
): UseOverflowReturn<T> {
  const { axis = 'vertical', enabled = true } = options;
  const ref = useRef<T>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Resize-driven measurement (the "available space changed" case).
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) {
      setIsOverflowing(false);
      return;
    }
    const measure = () => setIsOverflowing(measureOverflow(el, axis));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [axis, enabled]);

  // Content changes alter overflow without a resize; re-read each render.
  // No dependency array on purpose: the read has to happen after EVERY render,
  // because content can change overflow without changing the element's size, and
  // a ResizeObserver only reports the latter. The state setter is a no-op when the
  // value is unchanged, so this cannot loop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && enabled) setIsOverflowing(measureOverflow(el, axis));
  });

  return { ref, isOverflowing };
}
