import type { CreateShadowOptions, ShadowLayer, ShadowPresets } from './types';

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
 * Generate layered shadow configuration for a given elevation.
 *
 * Follows Josh Comeau's shadow design approach:
 *
 *   small:  1 layer,  higher per-layer opacity  → tight contact shadow
 *   medium: 3 layers, moderate per-layer opacity → geometric progression
 *   large:  5 layers, lower per-layer opacity    → geometric doubling
 *
 * Key insight: more layers = lower per-layer opacity so total shadow
 * strength stays roughly the same while visual quality improves.
 * The offset/blur follow a geometric progression (1→2→4→8→16).
 *
 * @see https://www.joshwcomeau.com/css/designing-shadows/
 */
function generateShadowLayers(
  elevation: number,
  options: {
    opacity?: number;
    oomph?: number;
    crispy?: number;
  } = {},
): ShadowLayer[] {
  const { opacity: totalOpacity = 0.35, oomph = 0.5, crispy = 0.5 } = options;

  // Layer count scales with elevation:
  // sm (1) → 1 layer, md (2) → 3, lg (3) → 4, xl (5) → 5
  const layerCount = elevation === 1 ? 1 : Math.max(3, Math.min(7, 1 + elevation));

  const clampedOomph = Math.max(0, Math.min(1, oomph));
  const clampedCrispy = Math.max(0, Math.min(1, crispy));

  // Oomph scales how far the outermost layers reach (0.6× – 1.4×)
  const reach = 0.6 + clampedOomph * 0.8;

  // Crispy controls blur-to-offset ratio:
  //   0 → blur = 1.2× offset (soft, diffuse)
  //   1 → blur = 0.6× offset (sharp, crisp)
  const blurRatio = 1.2 - clampedCrispy * 0.6;

  // Per-layer opacity: total budget split across layers
  // Matches Josh's pattern: 1 layer → 0.7, 3 layers → 0.333, 5 layers → 0.2
  const perLayerOpacity = totalOpacity / layerCount;

  const result: ShadowLayer[] = [];

  for (let i = 0; i < layerCount; i++) {
    // Geometric progression: 1, 2, 4, 8, 16, 32 …
    const size = Math.pow(2, i) * reach;

    result.push({
      offsetX: size * 0.5, // X offset is half of Y (light from above)
      offsetY: size,
      blur: size * blurRatio,
      spread: 0,
      opacity: perLayerOpacity,
    });
  }

  return result;
}

/**
 * Convert shadow layers to CSS box-shadow string
 */
function layersToCSS(layers: ShadowLayer[], color: string, angle: number): string {
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
 * // Full customization
 * createShadow({
 *   elevation: 3,
 *   oomph: 0.7,    // far-reaching
 *   crispy: 0.3,   // softer blur
 *   opacity: 0.4,  // stronger shadows
 * })
 * ```
 */
export function createShadow(options: CreateShadowOptions): string {
  const { elevation, color = DEFAULT_SHADOW_COLOR, angle = 135, opacity, oomph, crispy } = options;

  const shadowLayers = generateShadowLayers(elevation, {
    opacity,
    oomph,
    crispy,
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
  /** Total shadow opacity budget, split across layers (0-1) */
  opacity?: number;
  /** Shadow reach (0-1) */
  oomph?: number;
  /** Shadow sharpness (0-1) */
  crispy?: number;
}

/**
 * Generate a complete shadow palette for all elevations
 *
 * @example
 * ```ts
 * const blueShadows = createShadowPalette({
 *   color: '220 60% 50%',
 *   oomph: 0.6,
 *   crispy: 0.4,
 *   opacity: 0.4,
 * });
 * ```
 */
export function createShadowPalette(options?: CreateShadowPaletteOptions): ShadowPresets {
  const { color, angle, opacity, oomph, crispy } = options ?? {};

  return {
    sm: createShadow({ elevation: 1, color, angle, opacity, oomph, crispy }),
    md: createShadow({ elevation: 2, color, angle, opacity, oomph, crispy }),
    lg: createShadow({ elevation: 3, color, angle, opacity, oomph, crispy }),
    xl: createShadow({ elevation: 5, color, angle, opacity, oomph, crispy }),
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

// =============================================================================
// Surface-aware shadow system
// =============================================================================

export type SurfaceLevel = 'base' | 'subtle' | 'muted' | 'emphasis' | 'inverse';

export interface SurfaceShadowConfig {
  /** Shadow strength/opacity for this surface (0-1) */
  strength: number;
  /** Override shadow color for this surface (HSL without deg, e.g. '220 3% 15%') */
  color?: string;
}

export interface ThemeShadowConfig {
  /** Light source angle in degrees (default: 135 = top-left) */
  angle?: number;
  /** Default shadow color (HSL, e.g. '220 3% 15%') */
  color: string;
  /** Per-surface configuration */
  surfaces: Record<SurfaceLevel, SurfaceShadowConfig>;
  /** Shadow oomph — spread intensity (0-1, default: 0.12) */
  oomph?: number;
  /** Shadow crispiness (0-1, default: 0.14) */
  crispy?: number;
}

type ShadowSize = 'sm' | 'md' | 'lg' | 'xl';

export type ThemeShadowTokens = {
  '--move-shadow-angle': string;
} & {
  [K in `--move-shadow-${SurfaceLevel}-${ShadowSize}`]: string;
};

/**
 * Generate per-surface shadow tokens for a theme.
 * Iterates surfaces, calls createShadowPalette() for each with the surface's
 * color/strength, and prefixes tokens with surface name.
 */
export function createThemeShadows(config: ThemeShadowConfig): ThemeShadowTokens {
  const { angle = 135, color, surfaces, oomph = 0.12, crispy = 0.14 } = config;

  const tokens: Record<string, string> = {
    '--move-shadow-angle': `${angle}`,
  };

  const surfaceNames: SurfaceLevel[] = ['base', 'subtle', 'muted', 'emphasis', 'inverse'];

  for (const surface of surfaceNames) {
    const surfaceConfig = surfaces[surface];
    const shadowColor = surfaceConfig.color ?? color;
    const palette = createShadowPalette({
      color: shadowColor,
      angle,
      opacity: surfaceConfig.strength,
      oomph,
      crispy,
    });

    tokens[`--move-shadow-${surface}-sm`] = palette.sm;
    tokens[`--move-shadow-${surface}-md`] = palette.md;
    tokens[`--move-shadow-${surface}-lg`] = palette.lg;
    tokens[`--move-shadow-${surface}-xl`] = palette.xl;
  }

  return tokens as ThemeShadowTokens;
}
