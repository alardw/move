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
 * The canonical "reveal children on mount" stagger trigger.
 *
 * IMPORTANT: it animates ONLY `opacity` + `scale`, because those are the two
 * properties `staggerAnimate` seeds an initial (`from`) state for. Animating
 * other properties (e.g. translateY) through the child-stagger path leaves the
 * first frame unseeded and looks wrong. Components MUST build their entrance
 * stagger via this helper rather than hand-writing the trigger, so every
 * component staggers identically and only with runtime-supported properties.
 *
 * Used by Stack, Grid (opt-in `stagger` prop). The List/Table/Timeline pattern
 * predates this helper and inlines its own config.
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
