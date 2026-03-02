/**
 * Shadow elevation levels
 */
export type ShadowElevation = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Options for creating custom shadows.
 * Based on Josh Comeau's layered shadow approach.
 *
 * @see https://www.joshwcomeau.com/css/designing-shadows/
 */
export interface CreateShadowOptions {
  /**
   * Elevation level from 1-5.
   * Controls layer count:
   *   1 (sm) → 1 layer (tight contact shadow)
   *   2 (md) → 3 layers
   *   3 (lg) → 4 layers
   *   5 (xl) → 5+ layers
   */
  elevation: 1 | 2 | 3 | 4 | 5;

  /**
   * Shadow color in HSL format without the hsl() wrapper
   * e.g., "220deg 60% 50%"
   * Defaults to using var(--move-shadow-color)
   */
  color?: string;

  /**
   * Light source angle in degrees
   * 0 = light from top, 90 = light from right, 180 = light from bottom
   * Default: 135 (top-left light source)
   */
  angle?: number;

  /**
   * Total shadow opacity budget (0-1), split across layers.
   * More layers → lower per-layer opacity, same total strength.
   * Default: 0.35
   */
  opacity?: number;

  /**
   * Shadow reach — how far the outermost layer extends (0-1)
   * 0 = compact shadow, 1 = far-reaching shadow
   * Default: 0.5
   */
  oomph?: number;

  /**
   * Shadow sharpness — blur-to-offset ratio (0-1)
   * 0 = soft/diffuse (blur > offset), 1 = sharp/crisp (blur < offset)
   * Default: 0.5
   */
  crispy?: number;
}

/**
 * Shadow layer configuration
 */
export interface ShadowLayer {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  opacity: number;
}

/**
 * Preset shadow definitions
 */
export type ShadowPresets = Record<ShadowElevation, string>;
