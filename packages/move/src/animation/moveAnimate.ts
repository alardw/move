import { animate, type JSAnimation } from 'animejs';
import { prefersReducedMotion, toEndValues } from './utils/helpers';
import type { Animation } from './types';
import { seedFromState } from './utils/seed';

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
  /**
   * Which end of a transition this is.
   *
   * Handing properties back means letting state 2 apply. An ENTER has one: the
   * class for where it arrived. An exit does not — what holds an element once
   * it has gone is a property of how that component is built, not of the
   * animation. Most unmount, so there is no element left to hold anything;
   * where one persists, whatever keeps it hidden is the component's own
   * business. Either way there is nothing for the animation to defer to, so an
   * exit keeps what it wrote.
   *
   * Handing back regardless returned a closing panel toward visible for the
   * frames before it unmounted, which read as a stutter on close.
   */
  direction: 'enter' | 'exit' = 'enter',
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
  // Seed the start synchronously. anime does not write its first frame until the
  // next tick, and the class this is taking over from stops matching the instant
  // the pointer leaves — so without this there is one frame belonging to neither,
  // and a hover-out snaps to rest before the reverse animation plays.
  seedFromState(el, params);

  const props = params.loop || direction === 'exit' ? [] : writtenProperties(params);
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
