import type { AnimationTrigger } from './types';
import { poppy } from './easings';

export interface StaggerEnterOptions {
  /** ms between consecutive items (default 60). */
  delay?: number;
  /** Stagger origin (default 'first'). */
  from?: 'first' | 'last' | 'center';
  /** Child selector to stagger (default direct children). */
  children?: string;
  /** Per-item opacity duration in ms (default 220). */
  duration?: number;
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
  const { delay = 60, from = 'first', children = ':scope > *', duration = 220 } = opts;
  return {
    trigger: 'Root.enter',
    sequence: [
      {
        target: 'Root',
        children,
        stagger: { delay, from },
        animation: {
          opacity: { from: 0, to: 1, ease: 'outQuart', duration },
          scale: { from: 0.9, to: 1, ease: poppy },
        },
      },
    ],
  };
}
