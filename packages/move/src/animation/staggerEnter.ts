import type { AnimationTrigger } from './types';
import { poppy } from './easings';
import { defaultMaxTotal } from './staggerAnimate';

export interface StaggerEnterOptions {
  /** ms between consecutive items (default 60). */
  delay?: number;
  /** Stagger origin (default 'first'). */
  from?: 'first' | 'last' | 'center';
  /** Child selector to stagger (default direct children). */
  children?: string;
  /** Per-item opacity duration in ms (default 220). */
  duration?: number;
  /**
   * Longest the whole reveal may take, in ms, however many children there are.
   *
   * Defaults to a value derived from `duration` rather than a constant, so the
   * two cannot drift apart: a budget is only meaningful next to the per-item
   * duration it has to accommodate. Raise it for a deliberately long reveal.
   */
  maxTotal?: number;
}

/**
 * The layout-primitive reveal: children of a Stack or a Grid, fading and
 * springing open on mount.
 *
 * It animates `opacity` and `scale`. That used to be a hard limit — the only
 * two properties `staggerAnimate` seeded a `from` state for, so anything else
 * flashed unseeded on the first frame — and this docstring said so in capitals
 * for a long time after `seedFromState` became generic. Seeding now covers
 * every property declared with a `from`, composing transforms into one
 * `transform`, so the set is no longer the constraint it was described as. What
 * survives of the old rule is narrower and still true: a property animated
 * through the child-stagger path must declare a `from`, or its first frame
 * belongs to whatever was there before.
 *
 * Used by Stack and Grid, through their opt-in `stagger` prop. `revealItems` is
 * the data-display counterpart, for the rows of a thing you can filter.
 */
export function staggerEnter(opts: StaggerEnterOptions = {}): AnimationTrigger {
  const {
    delay = 60,
    from = 'first',
    children = ':scope > *',
    duration = 220,
    maxTotal = defaultMaxTotal(duration),
  } = opts;
  return {
    trigger: 'Root.enter',
    sequence: [
      {
        target: 'Root',
        children,
        stagger: { delay, from, maxTotal },
        animation: {
          opacity: { from: 0, to: 1, ease: 'outQuart', duration },
          scale: { from: 0.9, to: 1, ease: poppy },
        },
      },
    ],
  };
}
