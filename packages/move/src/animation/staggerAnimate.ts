import { animate, type JSAnimation } from 'animejs';
import { quick } from './easings';
import { prefersReducedMotion } from './utils/helpers';
import type { Animation, StaggerConfig } from './types';
import { seedFromState } from './utils/seed';

/** anime.js transform shorthands — these compose into a single `transform`. */

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
 * The per-item duration the library reveals at — `staggerEnter`'s default, and
 * near enough every hand-written stagger's. Used to derive a budget for a
 * caller who passes a delay and no duration, so every stagger in the library is
 * governed by ONE rule rather than a derivation here and a constant there.
 */
const NOMINAL_DURATION = 220;

const DEFAULT_MAX_TOTAL = defaultMaxTotal(NOMINAL_DURATION);

/**
 * Where item `i` starts, in ms.
 *
 * A fixed per-child gap is fine at six items and a drag at twenty: at 30ms the
 * twentieth row lands 570ms after the first, which is not a stagger any more, it
 * is a queue. So the whole reveal is held to a budget.
 *
 * The budget is spent unevenly, on purpose. Dividing it by the child count —
 * the obvious way — starves every gap equally, the first one included, and the
 * first is the only gap anyone actually perceives. What decides whether a reveal
 * reads as sequential is the gap measured against the item's own duration: at a
 * 220ms fade, 60ms apart (27%) is a wave and 4ms apart (2%) is everything
 * arriving at once. A 60-item grid under an evenly-divided budget gets 4ms.
 *
 * So the offsets saturate instead. The first items are spaced by very nearly the
 * delay asked for, whatever the count, and the tail compresses asymptotically
 * toward the budget — which is where the eye has stopped tracking individual
 * items and is reading the leading edge of the wave.
 *
 *     offset(i) = maxTotal × (1 − e^(−i·delay / maxTotal))
 *
 * The total approaches `maxTotal` and never exceeds it, by construction — so the
 * bound holds for any child count without a special case. (Far enough out the
 * exponential underflows and the offset lands exactly on the budget, which is
 * the bound doing its job, not breaking it.)
 */
export function staggerOffset(i: number, asked: number, maxTotal = DEFAULT_MAX_TOTAL): number {
  if (i <= 0 || asked <= 0 || maxTotal <= 0) return 0;
  return maxTotal * (1 - Math.exp((-i * asked) / maxTotal));
}

/**
 * Fold the stagger offset into the animation params.
 *
 * A top-level `delay` is dropped: the stagger IS the delay, and honouring both
 * would mean every item waiting the same amount before a sequence whose whole
 * job is that they don't.
 *
 * A PER-PROPERTY delay is different, and used to be missed. anime resolves it
 * as `setValue(key.delay, globalDelay)` — the property's own value wins and the
 * global is only a fallback — so a step declaring `opacity: { …, delay: 80 }`
 * silently discarded the stagger function for that property and animated every
 * item at a flat 80ms. Two components did exactly that, and neither of their
 * reveals staggered at all.
 *
 * Stripping it would be symmetric and wrong: an 80ms lead before the sweep is a
 * deliberate hold. So it composes instead — the property keeps its delay as a
 * lead-in and the stagger offset is added on top, which is what the author of
 * `delay: 80` next to a stagger meant.
 */
export function withStaggerDelay(
  params: Animation,
  offset: (i: number) => number,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    // The stagger replaces a blanket delay.
    if (key === 'delay') continue;
    const own = (value as { delay?: unknown } | null)?.delay;
    if (typeof own === 'number') {
      out[key] = { ...(value as object), delay: (_el: unknown, i: number) => own + offset(i) };
    } else if (typeof own === 'function') {
      out[key] = {
        ...(value as object),
        delay: (el: unknown, i: number, total: number) =>
          (own as (...a: unknown[]) => number)(el, i, total) + offset(i),
      };
    } else {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Animate multiple children of a container with staggered delay.
 *
 * Sets initial styles on each child from the `from` values in params,
 * then animates them with incremental delay. Children keep their final values.
 *
 * @param container - Parent element to query children from
 * @param selector - CSS selector for child elements
 * @param params - Animation config applied to each child
 * @param stagger - Stagger timing config
 * @param cancelRef - Ref to store/cancel the running animation
 * @param direction - 'enter' (first→last) or 'exit' (last→first, capped delay)
 */
export function staggerAnimate(
  container: HTMLElement | null,
  selector: string,
  params: Animation | undefined,
  stagger: StaggerConfig | undefined,
  cancelRef: React.MutableRefObject<JSAnimation | null>,
  direction: 'enter' | 'exit' = 'enter',
): JSAnimation | undefined {
  if (!container || !params || prefersReducedMotion()) return;

  if (cancelRef.current) cancelRef.current.pause();

  const items = container.querySelectorAll(selector);
  if (items.length === 0) return;

  const asked = stagger?.delay ?? 30;
  const budget = stagger?.maxTotal ?? DEFAULT_MAX_TOTAL;

  if (direction === 'enter') {
    // Seed each item's initial (`from`) state to avoid a first-frame flash.
    items.forEach((item) => seedFromState(item as HTMLElement, params));

    const offset = (i: number) => staggerOffset(i, asked, budget);
    const enterParams = withStaggerDelay(params, offset);

    const anim = animate(items, {
      ...enterParams,
      ease: enterParams.ease ?? quick,
      delay: (_el: any, i: number) => offset(i),
    } as any);

    cancelRef.current = anim;
    return anim;
  } else {
    // Exit: reverse order, and quicker — leaving should not be dwelt on.
    const itemCount = items.length;
    // Same saturating shape, tighter gap. The old exit was a plain multiply and
    // so had no bound at all: twenty items left over 380ms and sixty over a
    // second, on the way out, which is the direction nobody is waiting to watch.
    const exitAsked = Math.min(asked, 20);

    const exitOffset = (i: number) => staggerOffset(itemCount - 1 - i, exitAsked, budget);
    const anim = animate(items, {
      ...withStaggerDelay(params, exitOffset),
      delay: (_el: any, i: number) => exitOffset(i),
    } as any);

    cancelRef.current = anim;
    return anim;
  }
}
