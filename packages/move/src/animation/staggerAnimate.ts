import { animate, type JSAnimation } from 'animejs';
import { quick } from './easings';
import { prefersReducedMotion } from './utils/helpers';
import type { Animation, StaggerConfig } from './types';
import { seedFromState } from './utils/seed';

/** anime.js transform shorthands — these compose into a single `transform`. */

const DEFAULT_MAX_TOTAL = 240;

/**
 * How far apart the children should actually be, which is not always the delay
 * asked for.
 *
 * A fixed per-child gap is fine at six items and a drag at twenty: at 30ms the
 * twentieth row lands 570ms after the first, which is not a stagger any more, it
 * is a queue. So the whole reveal is held to a budget and the gap closes up to
 * fit, which means a long menu and a short one take about the same time to
 * arrive rather than the tail growing with the list.
 *
 * Only the upper end is adjusted. Short menus stagger like any other — the gap
 * between three rows is small enough to read as one movement, and skipping the
 * reveal there made them appear flatly beside menus that did not.
 */
export function resolveStagger(asked: number, count: number, stagger?: StaggerConfig): number {
  if (count < 2) return asked;
  const maxTotal = stagger?.maxTotal ?? DEFAULT_MAX_TOTAL;
  return Math.min(asked, maxTotal / (count - 1));
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

  const staggerDelay = resolveStagger(stagger?.delay ?? 30, items.length, stagger);

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
      delay: (_el: any, i: number) => i * staggerDelay,
    } as any);

    cancelRef.current = anim;
    return anim;
  } else {
    // Exit: reverse order, and quicker — leaving should not be dwelt on.
    const itemCount = items.length;
    const exitDelay = Math.min(staggerDelay, 20);

    const anim = animate(items, {
      ...params,
      delay: (_el: any, i: number) => (itemCount - 1 - i) * exitDelay,
    } as any);

    cancelRef.current = anim;
    return anim;
  }
}
