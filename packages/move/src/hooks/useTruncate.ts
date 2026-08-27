import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface UseTruncateOptions {
  /** Skip measurement (e.g. when no tooltip is wanted). Default `true`. */
  enabled?: boolean;
}

export interface UseTruncateReturn<T extends Element> {
  /** Attach to the truncated text element. */
  ref: React.RefObject<T>;
  /** Whether that element's text is actually clipped right now. */
  isTruncated: boolean;
}

function measureTruncated(el: Element): boolean {
  // Single-line (end/start) → horizontal overflow; clamp → vertical overflow.
  if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) return true;
  // Middle truncation clips a child head span, not the (flex) element itself.
  const head = el.querySelector('[data-truncate-head]');
  return !!head && head.scrollWidth > head.clientWidth;
}

/**
 * Reports whether the referenced text element is *actually* truncated — its
 * content overflowing the box under a `truncate` strategy — so a caller can show
 * a tooltip only when text is really cut off (not on text that happens to fit).
 * Measures on mount and after every render (catches content changes — a no-op
 * `setState` when unchanged keeps the per-render read cheap), and re-measures on
 * resize via `ResizeObserver` (truncation is a function of available space).
 *
 * Where `ResizeObserver` is unavailable it still measures on mount/render but
 * won't re-check on resize. On the server (no DOM) the effects never run, so it
 * stays `false`.
 */
export function useTruncate<T extends Element = HTMLElement>(
  options: UseTruncateOptions = {},
): UseTruncateReturn<T> {
  const { enabled = true } = options;
  const ref = useRef<T>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  // Resize-driven measurement (the "based on available space" case).
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) {
      setIsTruncated(false);
      return;
    }
    const measure = () => setIsTruncated(measureTruncated(el));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  // Content changes may alter overflow without a resize; re-read each render.
  // No dependency array on purpose: the read has to happen after EVERY render,
  // because content can change truncation without changing the element's size, and
  // a ResizeObserver only reports the latter. The state setter is a no-op when the
  // value is unchanged, so this cannot loop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && enabled) setIsTruncated(measureTruncated(el));
  });

  return { ref, isTruncated };
}
