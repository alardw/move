/**
 * Shadow elevation levels
 */
export type ShadowElevation = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Options for creating custom shadows
 * Based on Josh Comeau's shadow palette generator principles
 */
export interface CreateShadowOptions {
  /**
   * Elevation level from 1-5
   * Higher = more pronounced shadow (element appears further from surface)
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
   * Base opacity for the shadow layers (0-1)
   * Default: 0.07
   */
  opacity?: number;

  /**
   * Shadow intensity/depth - how far shadows spread (0-1)
   * 0 = minimal spread, 1 = maximum spread
   * Default: 0.5
   */
  oomph?: number;

  /**
   * Shadow sharpness/crispness - blur-to-offset ratio (0-1)
   * 0 = very blurry/soft, 1 = sharp/crisp
   * Default: 0.5
   */
  crispy?: number;

  /**
   * Resolution - controls layer count per elevation (0-1)
   * Higher = more layers for smoother shadows
   * Default: 0.31
   */
  resolution?: number;
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
