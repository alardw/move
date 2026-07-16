import type { ThemeSeed } from './defineTheme';

/**
 * The official Move brand seed — one neutral + one accent, rendered into both a
 * light and a dark theme by the SAME engine consumers use. The shipped
 * `lightTheme`/`darkTheme` are generated from this (see light.ts / dark.ts), so
 * they inherit every contrast clamp the engine guarantees (WCAG 2.2 AA — text,
 * links, focus ring, control borders) instead of being hand-tuned token maps
 * that silently drift below the floor.
 *
 * Accent hue 277 + chroma 0.19 is the measured OKLCH of the brand indigo
 * (Open Color indigo-600, #4f46e5) — so the generated primary reproduces it
 * rather than skewing blue. Consumers who want a different brand pass their own
 * seed to `defineThemes`.
 */
export const MOVE_SEED: Omit<ThemeSeed, 'appearance' | 'name'> = {
  neutral: { hue: 250, chroma: 0.008 },
  accent: { hue: 277, chroma: 0.23 },
};
