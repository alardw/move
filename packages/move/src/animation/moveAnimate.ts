import { animate, type JSAnimation } from 'animejs';
import { prefersReducedMotion, toEndValues } from './utils/helpers';
import type { Animation } from './types';

/**
 * Which CSS property anime.js writes for each animatable key.
 *
 * Everything spatial lands in `transform`, so several keys collapse to one
 * property — animating scale AND translateX leaves a single declaration to
 * remove, not two.
 */
const CSS_PROPERTY: Record<string, string> = {
  scale: 'transform',
  scaleX: 'transform',
  scaleY: 'transform',
  rotate: 'transform',
  rotateX: 'transform',
  rotateY: 'transform',
  rotateZ: 'transform',
  translateX: 'transform',
  translateY: 'transform',
  translateZ: 'transform',
  skewX: 'transform',
  skewY: 'transform',
  x: 'transform',
  y: 'transform',
  opacity: 'opacity',
  width: 'width',
  height: 'height',
  backgroundColor: 'background-color',
  color: 'color',
  borderColor: 'border-color',
  filter: 'filter',
};

/** Keys that configure the animation rather than name something to animate. */
const NOT_A_PROPERTY = new Set([
  'delay',
  'duration',
  'ease',
  'loop',
  'alternate',
  'onComplete',
  'onRender',
  'onBegin',
  'onUpdate',
  'composition',
  'autoplay',
  'direction',
  'modifier',
]);

/** The inline declarations this animation will write, so they can be handed back. */
function writtenProperties(params: Animation): string[] {
  const props = new Set<string>();
  for (const key of Object.keys(params)) {
    if (NOT_A_PROPERTY.has(key)) continue;
    const css = CSS_PROPERTY[key];
    if (css) props.add(css);
  }
  return [...props];
}

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

  // Hand the properties back when it finishes. anime.js writes INLINE styles,
  // which outrank any stylesheet rule, so an animation that leaves them behind
  // is holding the state rather than arriving at it — the class it was supposed
  // to hand over to can never apply, and `animations={false}` or reduced motion
  // (where nothing writes them at all) becomes a different component.
  //
  // Anything that visibly SNAPS when this runs was using the animation to hold a
  // state that CSS never declared. That is the bug, not this.
  //
  // A looping animation is exempt: it has no end to hand back at.
  const props = params.loop ? [] : writtenProperties(params);
  const anim = animate(el, {
    ...(params as any),
    onComplete: (self: JSAnimation) => {
      (params as { onComplete?: (self: JSAnimation) => void }).onComplete?.(self);
      for (const prop of props) el.style.removeProperty(prop);
    },
  });
  if (cancelRef) cancelRef.current = anim;
  return anim;
}
