import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface UseTruncateOptions {
  /** Skip measurement (e.g. when no tooltip is wanted). Default `true`. */
  enabled?: boolean;
}

export interface UseTruncateReturn<T extends Element> {
  /** Attach to the truncated text element. */
  ref: React.RefObject<T | null>;
  /** Whether that element's text is actually clipped right now. */
  isTruncated: boolean;
}

/**
 * One pixel of slack, because the two numbers being compared are not measured
 * the same way: `scrollWidth`/`scrollHeight` round UP to an integer and
 * `clientWidth`/`clientHeight` round DOWN. A line box 20.4px tall in a 20.4px
 * box reports 21 against 20, and text that fits exactly claims to be cut off —
 * which on a single line is any element whose line-height lands on a fraction,
 * so most of them.
 */
const SLACK = 1;

const overflowsX = (el: Element) => el.scrollWidth > el.clientWidth + SLACK;
const overflowsY = (el: Element) => el.scrollHeight > el.clientHeight + SLACK;

/**
 * Only the axis the strategy actually cuts on.
 *
 * A single-line strategy sets `white-space: nowrap` and clips horizontally, so
 * its height never means anything — but it was being read anyway, and a
 * fractional line-height made it answer yes. That is a tooltip repeating text
 * that is fully visible, on hover, for every short label on the page.
 *
 * The strategy is on the element: the text primitives set `data-truncate` on
 * the same node this ref attaches to. With no attribute the element is someone
 * else's, truncated by CSS this hook cannot see, so both axes are read.
 */
/** Middle truncation clips a child head span, not the (flex) element itself. */
function headClipped(el: Element): boolean {
  const head = el.querySelector('[data-truncate-head]');
  return !!head && overflowsX(head);
}

/**
 * Is this element's text cut off right now?
 *
 * A single reading, taken when someone asks. Exported because the expensive
 * part of knowing is not the comparison — it is that `scrollWidth` forces the
 * browser to lay the page out before it can answer. Somewhere that only needs
 * the answer at one moment (a tooltip, at the instant a pointer arrives) should
 * pay for that moment and nothing else, rather than holding it as state that
 * has to be kept true.
 */
export function measureTruncated(el: Element): boolean {
  const mode = el.getAttribute('data-truncate');
  if (mode === 'middle') return headClipped(el);
  // Clamp wraps to N lines and cuts below them; nothing overflows sideways.
  if (mode === 'clamp') return overflowsY(el);
  // `end`, `start`, and `''` from the boolean alias: one line, cut at an edge.
  if (mode !== null) return overflowsX(el);
  return overflowsX(el) || overflowsY(el) || headClipped(el);
}

/**
 * Reports whether the referenced text element is *actually* truncated — its
 * content overflowing the box under a `truncate` strategy — so a caller can show
 * a tooltip only when text is really cut off. A tooltip on text that fits is
 * reading the label back to the person looking at it.
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
