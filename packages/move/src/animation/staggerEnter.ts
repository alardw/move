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
 * `transform`, which is why `revealItems` can rise on the block axis. What
 * survives of the old rule is narrower and still true: a property animated
 * through the child-stagger path must declare a `from`, or its first frame
 * belongs to whatever was there before.
 *
 * Scale rather than a rise because a layout primitive holds ARBITRARY children
 * — cards, images, form fields — and cannot know which direction "in" is for
 * them. Growing into place makes no claim about that. Data rows do have an
 * answer, and `revealItems` gives it to them.
 *
 * Used by Stack and Grid, through their opt-in `stagger` prop.
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
