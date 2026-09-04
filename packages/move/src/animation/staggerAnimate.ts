import { animate, type JSAnimation } from 'animejs';
import { quick } from './easings';
import { prefersReducedMotion } from './utils/helpers';
import type { Animation, StaggerConfig } from './types';
import { seedFromState } from './utils/seed';

/** anime.js transform shorthands — these compose into a single `transform`. */

const DEFAULT_THRESHOLD = 5;
const DEFAULT_MAX_TOTAL = 240;

/**
 * The delay to actually use between children, which is not always the one asked
 * for — a fixed per-child delay is wrong at both ends of the range.
 *
 * Below the threshold there is no sequence to perceive: a menu of three is taken
 * in at a glance, so revealing them one after another reads as the menu lagging
 * rather than as motion. They move together instead.
 *
 * Above it the whole reveal is held to a budget. At the asked-for 30ms twenty
 * items put the last one 570ms after the first, which is not a stagger any more,
 * it is a queue. The gap closes up to fit rather than the tail running on, so a
 * long menu and a short one take about the same time to arrive.
 */
export function resolveDelay(asked: number, count: number, stagger?: StaggerConfig): number {
  const threshold = stagger?.threshold ?? DEFAULT_THRESHOLD;
  if (count < threshold) return 0;
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

  const staggerDelay = resolveDelay(stagger?.delay ?? 30, items.length, stagger);

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
