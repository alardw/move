import { animate as animeAnimate, spring } from 'animejs';
import { springs, isSpring, DEFAULT_DURATION, type AnimationPreset } from './springs';
import type { Animation, AnimateConfig } from './types';

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Resolve easing preset to anime.js easing value
 */
export function resolveEasing(
  easing: AnimationPreset | undefined,
  fallback: AnimationPreset = 'gentle'
): ReturnType<typeof spring> | string {
  const preset = easing ?? fallback;

  if (preset === 'none') {
    return 'linear';
  }

  if (isSpring(preset)) {
    return spring(springs[preset]);
  }

  return preset;
}

/**
 * Check if a value is a per-property easing object
 */
function isPerPropertyEasing(value: unknown): value is { value: unknown; easing?: AnimationPreset } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    !Array.isArray(value)
  );
}

/**
 * Check if easing is a spring (needs no duration)
 */
function isSpringEasing(easing: AnimationPreset | undefined): boolean {
  if (!easing || easing === 'none') return false;
  return isSpring(easing);
}

/**
 * Convert Animation config to anime.js params
 * Supports per-property easing: { opacity: { value: [0, 1], easing: 'outQuart' } }
 */
export function toAnimeParams(
  animation: Animation,
  fallbackEasing: AnimationPreset = 'gentle'
): Parameters<typeof animeAnimate>[1] {
  const { easing: animationEasing, duration, delay, ...properties } = animation;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = {};
  let hasSpringProperty = false;
  let hasNonSpringProperty = false;

  // Process each property
  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined) continue;

    if (isPerPropertyEasing(value)) {
      // Per-property easing: { value: [0, 1], easing: 'bouncy' } or { value: 0, easing: 'bouncy' }
      const propEasing = value.easing ?? animationEasing ?? fallbackEasing;
      const resolvedEase = resolveEasing(propEasing);
      const isArray = Array.isArray(value.value);

      if (isSpringEasing(propEasing)) {
        hasSpringProperty = true;
        if (isArray) {
          const [fromVal, toVal] = value.value as [unknown, unknown];
          result[key] = { value: [fromVal, toVal], ease: resolvedEase };
        } else {
          // Single value: animate TO this value from current state
          result[key] = { value: value.value, ease: resolvedEase };
        }
      } else {
        hasNonSpringProperty = true;
        if (isArray) {
          const [fromVal, toVal] = value.value as [unknown, unknown];
          result[key] = {
            value: [fromVal, toVal],
            ease: resolvedEase,
            duration: duration ?? DEFAULT_DURATION,
          };
        } else {
          // Single value: animate TO this value from current state
          result[key] = {
            value: value.value,
            ease: resolvedEase,
            duration: duration ?? DEFAULT_DURATION,
          };
        }
      }
    } else {
      // Simple value, use animation-level easing
      result[key] = value;
    }
  }

  // If no per-property easings, apply animation-level easing
  const hasPerPropertyEasings = Object.values(properties).some(isPerPropertyEasing);

  if (!hasPerPropertyEasings) {
    const preset = animationEasing ?? fallbackEasing;
    result.ease = resolveEasing(preset);

    if (!isSpringEasing(preset)) {
      result.duration = duration ?? DEFAULT_DURATION;
    }
  } else {
    // Mixed easings: set a default duration for the animation
    // Individual spring properties will ignore it
    if (hasNonSpringProperty) {
      result.duration = duration ?? DEFAULT_DURATION;
    }
  }

  if (delay !== undefined) {
    result.delay = delay;
  }

  return result;
}

/**
 * Convert Animation to instant (no animation) params for reduced motion
 */
export function toInstantParams(
  animation: Animation
): Parameters<typeof animeAnimate>[1] {
  const { easing, duration, delay, ...properties } = animation;

  // Extract end values from arrays and per-property objects
  const endValues: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined) continue;

    let actualValue: unknown = value;

    // Unwrap per-property easing object
    if (isPerPropertyEasing(value)) {
      actualValue = value.value;
    }

    // Get end value from array
    if (Array.isArray(actualValue)) {
      endValues[key] = actualValue[actualValue.length - 1];
    } else {
      endValues[key] = actualValue;
    }
  }

  return {
    ...endValues,
    duration: 0,
  };
}

/**
 * Merge animation configs with defaults
 */
export function mergeAnimateConfig<T extends Partial<AnimateConfig>>(
  defaults: T,
  overrides?: Partial<AnimateConfig>
): T {
  if (!overrides) return defaults;

  return {
    ...defaults,
    ...overrides,
  } as T;
}

/**
 * Extract initial (from) styles from an Animation config.
 * Used to set inline styles before animating so elements start in their "from" state.
 */
export function getInitialStyles(animation: Animation): React.CSSProperties {
  const { easing, duration, delay, ...properties } = animation;
  const styles: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined) continue;

    let actualValue: unknown = value;

    // Unwrap per-property easing object
    if (isPerPropertyEasing(value)) {
      actualValue = value.value;
    }

    // Get initial (from) value from array, or use the value directly
    if (Array.isArray(actualValue)) {
      styles[key] = actualValue[0];
    } else {
      // Single value means animate TO this value, so we don't set initial
      // (the element should already be in a neutral state)
    }
  }

  // Convert animation property names to CSS property names
  const cssStyles: React.CSSProperties = {};

  if ('opacity' in styles) {
    cssStyles.opacity = styles.opacity as number;
  }
  if ('scale' in styles || 'x' in styles || 'y' in styles || 'rotate' in styles) {
    const transforms: string[] = [];
    if ('scale' in styles) transforms.push(`scale(${styles.scale})`);
    if ('x' in styles) transforms.push(`translateX(${styles.x}px)`);
    if ('y' in styles) transforms.push(`translateY(${styles.y}px)`);
    if ('rotate' in styles) transforms.push(`rotate(${styles.rotate}deg)`);
    cssStyles.transform = transforms.join(' ');
  }

  return cssStyles;
}
