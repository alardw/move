import { spring } from 'animejs';

export interface SpringParams {
  mass: number;
  stiffness: number;
  damping: number;
  velocity: number;
}

// Springs — named by FEEL (character), never by component or use-case.
export const springs = {
  // Strak, minimale overshoot — micro-interacties (press/lift)
  snappy: { mass: 1, stiffness: 500, damping: 30, velocity: 0 },
  // Licht & vlug — overlays
  quick: { mass: 0.6, stiffness: 400, damping: 20, velocity: 0 },
  // Stuiterig — scale-pops
  poppy: { mass: 0.8, stiffness: 350, damping: 12, velocity: 0 },
  // Kwiek, lichte veer — slide-in lijsten
  brisk: { mass: 1, stiffness: 400, damping: 26, velocity: 0 },
  // Soepel glijden, weinig overshoot — breedte/grote vlakken
  smooth: { mass: 1, stiffness: 300, damping: 25, velocity: 0 },
} as const satisfies Record<string, SpringParams>;

export type SpringPreset = keyof typeof springs;

// Standard easings
export const easings = [
  'linear',
  'inQuad', 'outQuad', 'inOutQuad',
  'inCubic', 'outCubic', 'inOutCubic',
  'inQuart', 'outQuart', 'inOutQuart',
  'inExpo', 'outExpo', 'inOutExpo',
  'inCirc', 'outCirc', 'inOutCirc',
  'inBack', 'outBack', 'inOutBack',
  'inElastic', 'outElastic', 'inOutElastic',
  'inBounce', 'outBounce', 'inOutBounce',
] as const;

export type Easing = typeof easings[number];

export type AnimationPreset = 'none' | SpringPreset | Easing;

// Helper to check if preset is a spring
export const isSpring = (preset: Exclude<AnimationPreset, 'none'>): preset is SpringPreset => {
  return preset in springs;
};

// Helper to get ease value from preset
export const getEase = (preset: Exclude<AnimationPreset, 'none'>) => {
  if (isSpring(preset)) {
    return spring(springs[preset]);
  }
  return preset as Easing;
};

// Default duration for non-spring easings
export const DEFAULT_DURATION = 200;

// Pre-computed spring constants — use directly as `ease` in anime.js per-property params
export const snappy = spring(springs.snappy);
export const quick = spring(springs.quick);
export const poppy = spring(springs.poppy);
export const brisk = spring(springs.brisk);
export const smooth = spring(springs.smooth);
