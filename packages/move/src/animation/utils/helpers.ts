import type { Animation } from '../types';

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Merge animation configs with defaults
 */
export function mergeAnimateConfig<T extends Record<string, unknown>>(
  defaults: T,
  overrides?: Record<string, unknown>,
): T {
  if (!overrides) return defaults;

  return {
    ...defaults,
    ...overrides,
  } as T;
}

/**
 * Extract end values from an Animation config for reduced motion (instant apply).
 * For per-property objects ({ from, to, ease, ... }), extracts the `to` value.
 * For plain values, passes them through.
 * Returns params with duration: 0.
 */
export function toEndValues(animation: Animation): Record<string, unknown> & { duration: number } {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(animation)) {
    if (key === 'delay') continue;
    if (value === undefined) continue;

    if (typeof value === 'object' && value !== null && 'to' in value) {
      result[key] = (value as { to: unknown }).to;
    } else {
      result[key] = value;
    }
  }

  result.duration = 0;
  return result as Record<string, unknown> & { duration: number };
}

/**
 * Extract initial (from) styles from an Animation config.
 * For per-property objects ({ from, to, ... }), extracts the `from` value.
 * Maps animation property names to CSS properties.
 */
export function getFromStyles(animation: Animation): React.CSSProperties {
  const styles: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(animation)) {
    if (key === 'delay') continue;
    if (value === undefined) continue;

    if (typeof value === 'object' && value !== null && 'from' in value) {
      styles[key] = (value as { from: unknown }).from;
    }
  }

  const cssStyles: React.CSSProperties = {};

  if ('opacity' in styles) {
    cssStyles.opacity = styles.opacity as number;
  }

  const transforms: string[] = [];
  if ('scale' in styles) transforms.push(`scale(${styles.scale})`);
  if ('x' in styles) transforms.push(`translateX(${styles.x}px)`);
  if ('y' in styles) transforms.push(`translateY(${styles.y}px)`);
  if ('translateX' in styles) transforms.push(`translateX(${styles.translateX}px)`);
  if ('translateY' in styles) transforms.push(`translateY(${styles.translateY}px)`);
  if ('rotate' in styles) transforms.push(`rotate(${styles.rotate}deg)`);

  if (transforms.length > 0) {
    cssStyles.transform = transforms.join(' ');
  }

  return cssStyles;
}
