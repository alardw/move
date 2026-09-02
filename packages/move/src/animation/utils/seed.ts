import type { Animation } from '../types';

/**
 * Seeding the start of an animation, synchronously.
 *
 * anime.js does not write its first frame until the next tick, which leaves one
 * frame where neither it nor the rule it is taking over from is in charge. On a
 * hover-out that frame is visible: the `:hover` class stops matching the moment
 * the pointer leaves, so the element snaps to rest and the reverse animation
 * then plays from a value nobody saw. Writing the `from` state before starting
 * covers that gap in both directions.
 */
const TRANSFORM_PROPS = new Set([
  'translateX',
  'translateY',
  'translateZ',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'scaleX',
  'scaleY',
  'scaleZ',
  'skew',
  'skewX',
  'skewY',
  'perspective',
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
export function seedFromState(el: HTMLElement, params: Animation): void {
  const transforms: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (
      key === 'delay' ||
      key === 'stagger' ||
      key === 'ease' ||
      key === 'duration' ||
      key === 'loop' ||
      key === 'alternate'
    )
      continue;
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
