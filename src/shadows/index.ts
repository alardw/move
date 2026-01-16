export { shadows, createShadow, createShadowPalette, shadowCSSVariables } from './shadows';
export type { CreateShadowPaletteOptions } from './shadows';
export type {
  ShadowElevation,
  CreateShadowOptions,
  ShadowLayer,
  ShadowPresets,
} from './types';

// Directional shadow system (CSS-based, responds to LightProvider)
export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const elevationValues: Record<ElevationLevel, number> = {
  0: 0,
  1: 2,
  2: 4,
  3: 8,
  4: 12,
  5: 20,
};
