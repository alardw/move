import type { CreateShadowOptions, ShadowElevation, ShadowLayer, ShadowPresets } from './types';

/**
 * Default shadow color CSS variable
 */
const DEFAULT_SHADOW_COLOR = 'var(--move-shadow-color, 220deg 3% 15%)';

/**
 * Convert light source angle to shadow offset multipliers
 * Angle represents where the light is coming FROM:
 * 0deg = top, 90deg = right, 180deg = bottom, 270deg = left
 * Shadow falls in the opposite direction of the light source
 */
function angleToOffset(angle: number): { x: number; y: number } {
  const radians = (angle * Math.PI) / 180;
  // Light from angle means shadow falls opposite direction
  // sin gives X component, -cos gives Y (CSS Y-axis is inverted)
  return {
    x: Math.sin(radians),
    y: -Math.cos(radians),
  };
}

/**
 * Generate layered shadow configuration for a given elevation
 * Based on Josh Comeau's shadow design principles:
 * - Multiple layers for realistic light scattering
 * - Offset, blur, and opacity scale together with elevation
 * - Configurable oomph (spread), crispy (sharpness), and layer count
 */
function generateShadowLayers(
  elevation: number,
  options: {
    opacity?: number;
    oomph?: number;
    crispy?: number;
    resolution?: number;
  } = {}
): ShadowLayer[] {
  const {
    opacity: baseOpacity = 0.07,
    oomph = 0,
    crispy = 0,
    resolution = 0.31,
  } = options;

  // Resolution determines layers per elevation (like Josh's generator)
  // elevation 1 (sm) -> 2 layers, elevation 2 (md) -> 3 layers, etc.
  const baseLayers = Math.round(1 + elevation * resolution * 3);
  const layerCount = Math.max(2, Math.min(8, baseLayers));

  const result: ShadowLayer[] = [];

  // Clamp values to valid ranges
  const clampedOomph = Math.max(0, Math.min(1, oomph));
  const clampedCrispy = Math.max(0, Math.min(1, crispy));

  // Oomph affects overall shadow spread (0.5-2x multiplier)
  const oomphMultiplier = 0.5 + clampedOomph * 1.5;

  // Crispy affects blur-to-offset ratio
  // Low crispy = more blur relative to offset (softer)
  // High crispy = less blur relative to offset (sharper)
  const blurRatio = 2 - clampedCrispy * 1.5; // 2.0 to 0.5

  // As elevation increases, opacity per layer decreases
  // This creates the effect of shadows becoming more diffuse at higher elevations
  const opacityMultiplier = 1 - (elevation - 1) * 0.1;

  for (let i = 0; i < layerCount; i++) {
    // Each layer progressively increases in size
    const progress = i / (layerCount - 1 || 1);
    const layerMultiplier = 1 + progress * (elevation * 2);

    const baseOffset = elevation * oomphMultiplier * layerMultiplier;

    result.push({
      offsetX: baseOffset,
      offsetY: baseOffset,
      blur: baseOffset * blurRatio,
      spread: 0,
      opacity: baseOpacity * opacityMultiplier * (1 - progress * 0.3),
    });
  }

  return result;
}

/**
 * Convert shadow layers to CSS box-shadow string
 */
function layersToCSS(
  layers: ShadowLayer[],
  color: string,
  angle: number
): string {
  const { x, y } = angleToOffset(angle);

  return layers
    .map((layer) => {
      const offsetX = (layer.offsetX * x).toFixed(1);
      const offsetY = (layer.offsetY * y).toFixed(1);
      const blur = layer.blur.toFixed(1);
      const opacity = layer.opacity.toFixed(3);

      return `${offsetX}px ${offsetY}px ${blur}px hsl(${color} / ${opacity})`;
    })
    .join(',\n  ');
}

/**
 * Create a custom shadow with specified options
 *
 * @example
 * ```ts
 * // Basic usage
 * createShadow({ elevation: 3 })
 *
 * // Custom color and angle
 * createShadow({
 *   elevation: 4,
 *   color: '220deg 60% 50%',
 *   angle: 120
 * })
 *
 * // Full customization (Josh Comeau style)
 * createShadow({
 *   elevation: 3,
 *   oomph: 0.7,    // more spread
 *   crispy: 0.3,   // softer blur
 *   layers: 5,     // more layers
 *   opacity: 0.1,  // stronger shadows
 * })
 * ```
 */
export function createShadow(options: CreateShadowOptions): string {
  const {
    elevation,
    color = DEFAULT_SHADOW_COLOR,
    angle = 135,
    opacity,
    oomph,
    crispy,
    resolution,
  } = options;

  const shadowLayers = generateShadowLayers(elevation, {
    opacity,
    oomph,
    crispy,
    resolution,
  });
  return layersToCSS(shadowLayers, color, angle);
}

/**
 * Pre-defined shadow presets for common elevation levels
 * These use CSS variables for theme-aware shadow colors
 *
 * @example
 * ```css
 * .card {
 *   box-shadow: var(--move-shadow-md);
 * }
 * ```
 *
 * @example
 * ```tsx
 * <div style={{ boxShadow: shadows.lg }} />
 * ```
 */
export const shadows: ShadowPresets = {
  sm: createShadow({ elevation: 1 }),
  md: createShadow({ elevation: 2 }),
  lg: createShadow({ elevation: 3 }),
  xl: createShadow({ elevation: 5 }),
};

/**
 * Options for creating a shadow palette
 */
export interface CreateShadowPaletteOptions {
  /** Shadow color in HSL format */
  color?: string;
  /** Light source angle in degrees */
  angle?: number;
  /** Base opacity for shadow layers (0-1) */
  opacity?: number;
  /** Shadow intensity/spread (0-1) */
  oomph?: number;
  /** Shadow sharpness (0-1) */
  crispy?: number;
  /** Resolution - controls layer count per elevation (0-1), default 0.31 */
  resolution?: number;
}

/**
 * Generate a complete shadow palette for all elevations
 * Useful for creating theme-specific shadow sets
 *
 * @example
 * ```ts
 * // Basic usage with color
 * const blueShadows = createShadowPalette({
 *   color: '220deg 60% 50%',
 * });
 *
 * // Full customization
 * const customShadows = createShadowPalette({
 *   color: '220deg 40% 2%',
 *   oomph: 0.6,
 *   crispy: 0.4,
 *   layers: 4,
 *   opacity: 0.12,
 * });
 * ```
 */
export function createShadowPalette(options?: CreateShadowPaletteOptions): ShadowPresets {
  const { color, angle, opacity, oomph, crispy, resolution } = options ?? {};

  return {
    sm: createShadow({ elevation: 1, color, angle, opacity, oomph, crispy, resolution }),
    md: createShadow({ elevation: 2, color, angle, opacity, oomph, crispy, resolution }),
    lg: createShadow({ elevation: 3, color, angle, opacity, oomph, crispy, resolution }),
    xl: createShadow({ elevation: 5, color, angle, opacity, oomph, crispy, resolution }),
  };
}

/**
 * CSS custom properties for shadows
 * Can be injected into :root or theme providers
 */
export const shadowCSSVariables = {
  '--move-shadow-sm': shadows.sm,
  '--move-shadow-md': shadows.md,
  '--move-shadow-lg': shadows.lg,
  '--move-shadow-xl': shadows.xl,
} as const;
