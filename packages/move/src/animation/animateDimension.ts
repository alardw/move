import { animate, type JSAnimation } from 'animejs';
import { prefersReducedMotion } from './utils/helpers';
import type { Animation } from './types';

/**
 * Animate a measured dimension (height or width) with proper cleanup.
 *
 * Enter: measures natural size, animates from 0, restores `auto` + clears overflow on complete.
 * Exit: captures current size, animates to 0, collapses padding.
 *
 * @param el - Element to animate
 * @param prop - 'height' or 'width'
 * @param direction - 'enter' or 'exit'
 * @param cancelRef - Ref to store/cancel the running animation
 * @param config - Optional Animation overrides (extra props like opacity are spread alongside)
 */
export function animateDimension(
  el: HTMLElement | null,
  prop: 'height' | 'width',
  direction: 'enter' | 'exit',
  cancelRef: React.MutableRefObject<JSAnimation | null>,
  config?: Animation,
): JSAnimation | undefined {
  if (!el) return;

  if (cancelRef.current) cancelRef.current.pause();

  if (prefersReducedMotion()) {
    if (direction === 'enter') {
      el.style[prop] = 'auto';
      el.style.overflow = '';
      el.style.opacity = '1';
    }
    return;
  }

  if (direction === 'enter') {
    return animateDimensionEnter(el, prop, cancelRef, config);
  } else {
    return animateDimensionExit(el, prop, cancelRef, config);
  }
}

function animateDimensionEnter(
  el: HTMLElement,
  prop: 'height' | 'width',
  cancelRef: React.MutableRefObject<JSAnimation | null>,
  config?: Animation,
): JSAnimation {
  // Measure natural size
  el.style[prop] = 'auto';
  const targetSize = prop === 'height' ? el.offsetHeight : el.offsetWidth;

  // Set initial state
  el.style[prop] = '0px';
  el.style.overflow = 'hidden';
  el.style.opacity = '1';

  // Build params: hook owns from/to, config can override ease/duration
  const raw = (config ?? {}) as Record<string, unknown>;
  const { [prop]: propOverride, delay: configDelay, ...extraProps } = raw;

  const propParams: Record<string, unknown> = {
    from: 0,
    to: targetSize,
    ease: 'outQuart',
    duration: 250,
  };

  if (typeof propOverride === 'object' && propOverride !== null) {
    const po = propOverride as Record<string, unknown>;
    if (po.ease != null) propParams.ease = po.ease;
    if (po.duration != null) propParams.duration = po.duration;
  }

  const animParams: Record<string, unknown> = {
    ...extraProps,
    [prop]: propParams,
    onComplete: () => {
      el.style[prop] = 'auto';
      el.style.overflow = '';
    },
  };

  if (configDelay != null) animParams.delay = configDelay;

  const anim = animate(el, animParams as any);
  cancelRef.current = anim;
  return anim;
}

function animateDimensionExit(
  el: HTMLElement,
  prop: 'height' | 'width',
  cancelRef: React.MutableRefObject<JSAnimation | null>,
  config?: Animation,
): JSAnimation {
  const currentSize = prop === 'height' ? el.offsetHeight : el.offsetWidth;
  el.style[prop] = `${currentSize}px`;
  el.style.overflow = 'hidden';

  // Build params
  const raw = (config ?? {}) as Record<string, unknown>;
  const { [prop]: propOverride, delay: configDelay, ...extraProps } = raw;

  const propParams: Record<string, unknown> = {
    from: currentSize,
    to: 0,
    ease: 'outQuart',
    duration: 200,
  };

  if (typeof propOverride === 'object' && propOverride !== null) {
    const po = propOverride as Record<string, unknown>;
    if (po.ease != null) propParams.ease = po.ease;
    if (po.duration != null) propParams.duration = po.duration;
  }

  const animParams: Record<string, unknown> = {
    ...extraProps,
    [prop]: propParams,
    paddingTop: { to: 0, ease: 'outQuart', duration: 200 },
    paddingBottom: { to: 0, ease: 'outQuart', duration: 200 },
  };

  if (configDelay != null) animParams.delay = configDelay;

  const anim = animate(el, animParams as any);
  cancelRef.current = anim;
  return anim;
}
