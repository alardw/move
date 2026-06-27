import { spring } from 'animejs';

export interface SpringParams {
  mass: number;
  stiffness: number;
  damping: number;
  velocity: number;
}

// Spring presets - organized by use case
export const springs = {
  // === Quick & Responsive - for small UI elements, buttons ===
  snappy: { mass: 1, stiffness: 500, damping: 30, velocity: 0 },
  quick: { mass: 0.6, stiffness: 400, damping: 20, velocity: 0 },

  // === Bouncy & Playful - for scale animations, popovers ===
  poppy: { mass: 0.8, stiffness: 350, damping: 12, velocity: 0 },

  // === Smooth & Professional - for modals, overlays ===
  sidebar: { mass: 1, stiffness: 300, damping: 25, velocity: 0 },
  gentle: { mass: 1, stiffness: 80, damping: 12, velocity: 0 },

  // === Slow & Elegant - for page transitions, large elements ===
  slow: { mass: 2, stiffness: 100, damping: 20, velocity: 0 },
  lazy: { mass: 3, stiffness: 80, damping: 25, velocity: 0 },

  // === Wobbly & Fun - for playful interactions, notifications ===
  jelly: { mass: 0.5, stiffness: 150, damping: 6, velocity: 0 },

  // === Stiff & Controlled - minimal overshoot ===
  stiff: { mass: 1, stiffness: 400, damping: 35, velocity: 0 },

  // === Pagination — moderate overshoot for slide-in items ===
  pagination: { mass: 1, stiffness: 400, damping: 26, velocity: 0 },
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
export const gentle = spring(springs.gentle);
export const slow = spring(springs.slow);
export const lazy = spring(springs.lazy);
export const jelly = spring(springs.jelly);
export const stiff = spring(springs.stiff);
export const sidebar = spring(springs.sidebar);
export const pagination = spring(springs.pagination);
