import { animate, type JSAnimation } from 'animejs';
import { quick } from './easings';
import { prefersReducedMotion } from './utils/helpers';
import type { Animation, StaggerConfig } from './types';

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
    // Set initial styles from 'from' values
    items.forEach((item) => {
      const el = item as HTMLElement;
      for (const [key, value] of Object.entries(params)) {
        if (key === 'delay' || key === 'stagger') continue;
        if (typeof value === 'object' && value !== null && 'from' in value) {
          const from = (value as { from: unknown }).from;
          if (key === 'opacity') el.style.opacity = String(from);
          else if (key === 'scale') el.style.transform = `scale(${from})`;
        }
      }
    });

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
