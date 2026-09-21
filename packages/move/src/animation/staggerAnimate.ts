import { animate, type JSAnimation } from 'animejs';
import { quick } from './easings';
import { prefersReducedMotion } from './utils/helpers';
import type { Animation, StaggerConfig } from './types';
import { seedFromState } from './utils/seed';

/** anime.js transform shorthands — these compose into a single `transform`. */

const DEFAULT_MAX_TOTAL = 240;

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

    const enterParams: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(params)) {
      if (key === 'delay') continue;
      enterParams[key] = value;
    }

    const anim = animate(items, {
      ...enterParams,
      ease: enterParams.ease ?? quick,
      delay: (_el: any, i: number) => staggerOffset(i, asked, budget),
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

    const anim = animate(items, {
      ...params,
      delay: (_el: any, i: number) => staggerOffset(itemCount - 1 - i, exitAsked, budget),
    } as any);

    cancelRef.current = anim;
    return anim;
  }
}
