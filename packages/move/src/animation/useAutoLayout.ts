'use client';
import * as React from 'react';
import { animate } from 'animejs';
import { prefersReducedMotion } from './utils/helpers';

/**
 * useAutoLayout — Tier-2 `layoutFlip` animation primitive.
 *
 * FLIP-animates a container's direct children whenever the set or order changes
 * (filter / sort / reorder / add / remove). The animated node set is data-driven
 * and only known at runtime, so it can't be expressed by the declarative trigger
 * system — hence this primitive.
 *
 * Strategy (AutoAnimate-style, no React AnimatePresence needed):
 *  - keep a per-child rect cache;
 *  - a MutationObserver fires (as a microtask, before paint) on childList change;
 *  - remaining children: invert (old → new delta) then animate the transform to 0;
 *  - added children: play the `enter` animation;
 *  - removed children: re-home the detached node to <body> at its last viewport
 *    rect (position: fixed, aria-hidden), play `exit`, then drop it — so React
 *    never has to defer the unmount.
 *
 * Reduced motion / `disabled`: the cache is kept current but nothing animates.
 */

export type LayoutEnterExit = 'fade' | 'scale' | 'fade-scale' | 'none';

export interface UseAutoLayoutOptions {
  /** Entrance animation for added children. */
  enter?: LayoutEnterExit;
  /** Exit animation for removed children. */
  exit?: LayoutEnterExit;
  /** ms for the position move + enter/exit. */
  duration?: number;
  /** ms between consecutive children (0 = off). */
  stagger?: number;
  /** Also play the `enter` animation (staggered) for the children present at
   *  mount — a one-time entrance reveal. */
  initial?: boolean;
  /** Skip all animation — children jump to their final layout. */
  disabled?: boolean;
}

export interface UseAutoLayoutReturn {
  /** Attach to the container whose direct children should animate. */
  ref: React.RefObject<HTMLElement | null>;
}

/** anime.js from→to params for the entrance of an added child. */
function enterParams(mode: LayoutEnterExit): Record<string, unknown> {
  switch (mode) {
    case 'fade':
      return { opacity: [0, 1] };
    case 'scale':
      return { scale: [0.9, 1] };
    case 'fade-scale':
      return { opacity: [0, 1], scale: [0.9, 1] };
    default:
      return {};
  }
}

/** Synchronously set an entering child's hidden start state (and suppress its own
 *  CSS transition), so it doesn't paint at full opacity/scale for a frame, and so
 *  the child's transition can't fight the anime tween. */
function seedEnter(el: HTMLElement, mode: LayoutEnterExit): void {
  el.style.transition = 'none';
  if (mode === 'fade' || mode === 'fade-scale') el.style.opacity = '0';
  if (mode === 'scale' || mode === 'fade-scale') el.style.transform = 'scale(0.9)';
}

/** anime.js from→to params for the exit of a removed child. */
function exitParams(mode: LayoutEnterExit): Record<string, unknown> {
  switch (mode) {
    case 'fade':
      return { opacity: [1, 0] };
    case 'scale':
      return { scale: [1, 0.9] };
    case 'fade-scale':
      return { opacity: [1, 0], scale: [1, 0.9] };
    default:
      return {};
  }
}

export function useAutoLayout(options: UseAutoLayoutOptions = {}): UseAutoLayoutReturn {
  const ref = React.useRef<HTMLElement | null>(null);
  const latest = React.useRef(options);
  latest.current = options;

  React.useLayoutEffect(() => {
    const container = ref.current;
    if (!container || typeof MutationObserver === 'undefined') return;

    // Per-child position cached RELATIVE to the container (so scrolling can never
    // corrupt a FLIP delta). Refreshed on mount, on container resize (covers async
    // image/font settle + responsive reflow), and after each mutation — NOT every
    // frame, so an idle page does ZERO layout work. Elements mid-animation are
    // skipped so the cache stays the natural layout box, not the transformed one.
    type Pos = { left: number; top: number; width: number; height: number };
    const coords = new WeakMap<Element, Pos>();
    const animating = new WeakSet<Element>();

    const measureAll = () => {
      const cr = container.getBoundingClientRect();
      for (const child of Array.from(container.children)) {
        if (animating.has(child)) continue;
        const r = child.getBoundingClientRect();
        coords.set(child, {
          left: r.left - cr.left,
          top: r.top - cr.top,
          width: r.width,
          height: r.height,
        });
      }
    };
    measureAll();

    // Re-measure only when layout can shift WITHOUT a mutation. rAF-throttled.
    let refreshRaf = 0;
    let refreshQueued = false;
    const scheduleRefresh = () => {
      if (refreshQueued) return;
      refreshQueued = true;
      refreshRaf = requestAnimationFrame(() => {
        refreshQueued = false;
        measureAll();
      });
    };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleRefresh) : null;
    ro?.observe(container);
    window.addEventListener('resize', scheduleRefresh);

    const skip = () => latest.current.disabled || prefersReducedMotion();

    // One-time staggered entrance for the children present at mount (opt-in).
    if (latest.current.initial && !skip()) {
      const { duration = 350, stagger = 0, enter = 'fade-scale' } = latest.current;
      if (enter !== 'none') {
        Array.from(container.children).forEach((child, i) => {
          const el = child as HTMLElement;
          animating.add(el);
          seedEnter(el, enter);
          animate(el, {
            ...enterParams(enter),
            ease: 'outQuart',
            duration,
            delay: stagger ? i * stagger : 0,
            onComplete: () => {
              el.style.transform = '';
              el.style.opacity = '';
              el.style.transition = '';
              animating.delete(el);
            },
          } as Parameters<typeof animate>[1]);
        });
      }
    }

    const observer = new MutationObserver((records) => {
      const { duration = 350, enter = 'fade-scale', exit = 'fade-scale' } = latest.current;

      if (skip()) return;

      // --- Exit: re-home TRULY removed nodes to <body> at their last rect, animate
      // out. A reorder moves DOM nodes (insertBefore), which the observer also
      // reports in removedNodes — those are still in the container, so skip them
      // (they're handled as moves below). Only nodes no longer contained exited.
      if (exit !== 'none') {
        const removed = new Set<HTMLElement>();
        for (const record of records) {
          for (const node of Array.from(record.removedNodes)) {
            if (node.nodeType === 1 && !container.contains(node)) removed.add(node as HTMLElement);
          }
        }
        const exitCr = container.getBoundingClientRect();
        for (const el of removed) {
          const rect = coords.get(el);
          if (!rect) continue;
          el.setAttribute('aria-hidden', 'true');
          Object.assign(el.style, {
            position: 'fixed',
            // cache is container-relative → reconstruct the viewport rect.
            top: `${rect.top + exitCr.top}px`,
            left: `${rect.left + exitCr.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            margin: '0',
            transform: 'none',
            transition: 'none',
            pointerEvents: 'none',
          });
          document.body.appendChild(el);
          animate(el, {
            ...exitParams(exit),
            ease: 'outQuart',
            duration,
            onComplete: () => el.remove(),
          } as Parameters<typeof animate>[1]);
        }
      }

      // Nodes actually inserted this mutation — the only true "enter" candidates.
      // A survivor missing from a cold cache also has no prev rect, but it is NOT
      // in addedNodes, so it must not be enter-animated (that was the first-click
      // "everything animates in" bug).
      const added = new Set<Node>();
      for (const record of records) {
        for (const node of Array.from(record.addedNodes)) {
          if (node.nodeType === 1) added.add(node);
        }
      }

      // --- Move + enter: walk current children, diff against the cache.
      const cr = container.getBoundingClientRect();
      const current = Array.from(container.children) as HTMLElement[];
      current.forEach((el) => {
        const prev = coords.get(el);
        const r = el.getBoundingClientRect();
        const next = {
          left: r.left - cr.left,
          top: r.top - cr.top,
          width: r.width,
          height: r.height,
        };
        coords.set(el, next);

        if (!prev) {
          // No cached rect: a real entrance only if it was inserted this mutation.
          // Otherwise it's a cold-cache survivor — cache it silently, no animation.
          if (added.has(el) && enter !== 'none') {
            animating.add(el);
            seedEnter(el, enter);
            // Ongoing entrances are synchronized — staggering filter-time inserts
            // makes them cascade in top-to-bottom ("animated in from the top").
            // Stagger is reserved for the one-time `initial` reveal.
            animate(el, {
              ...enterParams(enter),
              ease: 'outQuart',
              duration,
              // Clear anime's inline styles on finish so the next run starts from
              // the element's natural CSS baseline (no accumulation between runs).
              onComplete: () => {
                el.style.transform = '';
                el.style.opacity = '';
                el.style.transition = '';
                animating.delete(el);
              },
            } as Parameters<typeof animate>[1]);
          }
          return;
        }

        // Existing child that shifted → FLIP (invert old→new delta, play to 0).
        const dx = prev.left - next.left;
        const dy = prev.top - next.top;
        if (dx || dy) {
          animating.add(el);
          // Apply the invert SYNCHRONOUSLY (before the browser paints the new
          // layout) so the card never flashes at its final spot for a frame
          // before anime's first tick — that flash read as "position, bounce
          // away, back".
          // Suppress the child's OWN css transition (e.g. ComponentCard's hover
          // `transition: transform`) — otherwise it animates the inline invert
          // back toward the old position and fights the anime FLIP. anime/Move
          // still drives the whole animation.
          el.style.transition = 'none';
          el.style.transform = `translateX(${dx}px) translateY(${dy}px)`;
          animate(el, {
            translateX: [dx, 0],
            translateY: [dy, 0],
            // Non-overshoot ease: a spring overshoots, and the overshoot scales
            // with distance — far-moving items visibly shoot past their target and
            // back ("comes from top"). Duration-based ease settles clean at any
            // distance.
            ease: 'outQuint',
            duration,
            // Moves are synchronized (no per-index stagger) — staggering the FLIP
            // makes a filter look chaotic ("items flying around"). Stagger is for
            // entrances only.
            onComplete: () => {
              el.style.transform = '';
              el.style.transition = '';
              animating.delete(el);
            },
          } as Parameters<typeof animate>[1]);
        }
      });
    });

    observer.observe(container, { childList: true });
    return () => {
      cancelAnimationFrame(refreshRaf);
      ro?.disconnect();
      window.removeEventListener('resize', scheduleRefresh);
      observer.disconnect();
    };
  }, []);

  return { ref };
}
