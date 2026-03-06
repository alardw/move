import { animate, type JSAnimation } from 'animejs';
import { prefersReducedMotion, toEndValues } from './utils/helpers';
import type { Animation } from './types';

/**
 * Core animation apply function.
 *
 * Every animation in the system flows through this: fire-and-forget
 * with automatic cancellation of the previous animation on the same ref.
 *
 * Respects prefers-reduced-motion by instantly applying end values.
 */
export function moveAnimate(
  el: HTMLElement | null,
  params: Animation | undefined,
  cancelRef?: React.MutableRefObject<JSAnimation | null>,
): JSAnimation | undefined {
  if (!el || !params) return;

  if (cancelRef?.current) cancelRef.current.pause();

  if (prefersReducedMotion()) {
    const endValues = toEndValues(params);
    animate(el, endValues as any);
    if (cancelRef) cancelRef.current = null;
    return;
  }

  const anim = animate(el, params as any);
  if (cancelRef) cancelRef.current = anim;
  return anim;
}
