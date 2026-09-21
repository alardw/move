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
 * How far apart items must be to read as sequential rather than simultaneous,
 * as a fraction of the per-item duration. Below roughly a tenth they arrive
 * together; a quarter is comfortably a wave.
 */
const READABLE_GAP = 0.22;

/**
 * How many items deep the eye tracks individual arrivals before it stops
 * counting and reads the leading edge of the wave instead. Past this the exact
 * spacing stops being information, which is what lets the tail compress.
 */
const WAVE_DEPTH = 9;

/** The budget a reveal gets when the caller doesn't name one. */
export const defaultMaxTotal = (duration: number): number =>
  Math.round(READABLE_GAP * duration * WAVE_DEPTH);

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
