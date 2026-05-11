import * as React from 'react';
import type { JSAnimation } from 'animejs';
import { moveAnimate } from './moveAnimate';

export interface UseMorphHeightOptions<K> {
  /** Value that, when it changes, triggers the morph. */
  key: K;
  /** The element whose height is animated from old → new natural size. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Optional inner wrapper — when provided, its opacity is faded from
   *  0 → 1 on each morph (matches the Accordion.Content pattern). The
   *  caller is responsible for keying this element so React remounts it. */
  innerRef?: React.RefObject<HTMLElement | null>;
  /** Duration for the height transition (ms). Default 280. */
  duration?: number;
  /** Easing for the height transition. Default 'outQuart'. */
  ease?: string;
  /** Duration for the inner fade-in (ms). Default 180. */
  fadeDuration?: number;
  /** Delay before the inner fade starts (ms). Default 100. */
  fadeDelay?: number;
}

/**
 * Animate an element's height between arbitrary natural sizes when a
 * key value changes — the content resize counterpart to
 * `animateDimension` (which only opens/closes between 0 and auto).
 *
 * Common use: a container whose children swap between variants of
 * different heights (view tabs, drawer steps, accordion-of-one). The
 * hook measures the old height via ResizeObserver before the swap
 * happens, reads the new natural height after React commits, locks
 * the element to the old size, and animates to the new size.
 *
 * When `innerRef` is passed, its opacity is faded in alongside the
 * height animation so the incoming content dissolves in rather than
 * popping.
 *
 * Respects `prefers-reduced-motion` via `moveAnimate`, and cancels
 * any in-flight animation automatically on repeat key changes.
 */
export function useMorphHeight<K>({
  key,
  containerRef,
  innerRef,
  duration = 280,
  ease = 'outQuart',
  fadeDuration = 180,
  fadeDelay = 100,
}: UseMorphHeightOptions<K>): void {
  const heightAnimRef = React.useRef<JSAnimation | null>(null);
  const fadeAnimRef = React.useRef<JSAnimation | null>(null);

  // Last observed "settled" height, updated continuously while no
  // animation is in flight. Captures the outgoing view's height before
  // the key changes and React commits the new content.
  const lastHeightRef = React.useRef<number | null>(null);
  const lastKeyRef = React.useRef<K>(key);
  const firstRunRef = React.useRef(true);

  // ResizeObserver tracks the container's rendered height at rest. We
  // use getBoundingClientRect so the reading is border-box consistent
  // with the later measurement taken during the morph effect.
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      if (heightAnimRef.current) return;
      lastHeightRef.current = el.getBoundingClientRect().height;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  React.useLayoutEffect(() => {
    // First commit — nothing to animate from.
    if (firstRunRef.current) {
      firstRunRef.current = false;
      lastKeyRef.current = key;
      return;
    }
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    const el = containerRef.current;
    const fromHeight = lastHeightRef.current;
    if (!el || fromHeight == null) return;

    // Let the new content settle at its natural height, measure it,
    // then snap back to the captured height before animating.
    el.style.height = 'auto';
    el.style.overflow = 'hidden';
    const toHeight = el.getBoundingClientRect().height;

    if (Math.abs(toHeight - fromHeight) < 1) {
      el.style.height = '';
      el.style.overflow = '';
    } else {
      el.style.height = `${fromHeight}px`;
      void el.offsetHeight; // force reflow so the animation starts from fromHeight

      moveAnimate(
        el,
        {
          height: { from: fromHeight, to: toHeight, ease, duration },
          onComplete: () => {
            el.style.height = '';
            el.style.overflow = '';
            lastHeightRef.current = toHeight;
          },
        },
        heightAnimRef,
      );
    }

    const inner = innerRef?.current;
    if (inner) {
      inner.style.opacity = '0';
      moveAnimate(
        inner,
        {
          opacity: { from: 0, to: 1, ease: 'linear', duration: fadeDuration },
          delay: fadeDelay,
          onComplete: () => {
            inner.style.opacity = '';
          },
        },
        fadeAnimRef,
      );
    }
  }, [key, containerRef, innerRef, duration, ease, fadeDuration, fadeDelay]);
}
