import { animate, type JSAnimation } from 'animejs';
import { quick } from './easings';
import { prefersReducedMotion } from './utils/helpers';
import type { Animation, StaggerConfig } from './types';

/** anime.js transform shorthands — these compose into a single `transform`. */
const TRANSFORM_PROPS = new Set([
  'translateX', 'translateY', 'translateZ',
  'rotate', 'rotateX', 'rotateY', 'rotateZ',
  'scale', 'scaleX', 'scaleY', 'scaleZ',
  'skew', 'skewX', 'skewY', 'perspective',
]);

/** Add a default unit to a numeric transform value (matches anime.js). */
function transformUnit(prop: string, value: unknown): string {
  if (typeof value !== 'number') return String(value); // already a string with unit
  if (prop.startsWith('scale')) return String(value); // unitless
  if (prop.startsWith('rotate') || prop.startsWith('skew')) return `${value}deg`;
  return `${value}px`; // translate*, perspective
}

/**
 * Seed each item's initial (`from`) state so there's no first-frame flash.
 *
 * Generic: every property declared with a `from` is applied — plain CSS props
 * (opacity, filter, …) set directly, transform shorthands composed into one
 * `transform`. (Previously only opacity + scale were seeded, so any other
 * property — e.g. translateY — flashed on the first frame.)
 */
function seedFromState(el: HTMLElement, params: Animation): void {
  const transforms: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (key === 'delay' || key === 'stagger' || key === 'ease' || key === 'duration' || key === 'loop' || key === 'alternate') continue;
    if (typeof value === 'object' && value !== null && 'from' in value) {
      const from = (value as { from: unknown }).from;
      if (TRANSFORM_PROPS.has(key)) {
        transforms.push(`${key}(${transformUnit(key, from)})`);
      } else {
        el.style.setProperty(key, String(from));
      }
    }
  }
  if (transforms.length) el.style.transform = transforms.join(' ');
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

  const staggerDelay = stagger?.delay ?? 30;

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
    // Exit: reverse order, capped delay
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
