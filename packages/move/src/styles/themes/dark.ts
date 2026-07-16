import { defineTheme } from './defineTheme';
import { MOVE_SEED } from './moveSeed';

/**
 * Move's default dark theme — GENERATED from MOVE_SEED by the same engine
 * consumers use (dogfooding), so every color it ships is contrast-clamped to
 * WCAG 2.2 AA rather than hand-picked. To restyle, pass your own seed to
 * `defineThemes` instead of editing tokens here.
 */
export const darkTheme = defineTheme({ ...MOVE_SEED, name: 'dark', appearance: 'dark' });
