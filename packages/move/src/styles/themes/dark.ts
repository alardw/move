import type { Theme } from './types';
import { createThemeShadows } from '../visual/shadows';

const darkShadows = createThemeShadows({
  angle: 135,
  color: '220 40% 2%',
  oomph: 0.5,
  crispy: 0.5,
  surfaces: {
    base: { strength: 0.55 },
    subtle: { strength: 0.6 },
    muted: { strength: 0.65 },
    emphasis: { strength: 0.7 },
    inverse: { color: '220 3% 90%', strength: 0.25 },
  },
});

export const darkTheme: Theme = {
  name: 'dark',
  tokens: {
    // Background — surface scale shifted one step lighter from the
    // OLED-black baseline. bg-base at gray-950 reads too stark for
    // long sessions on most displays.
    '--move-bg-base': 'var(--move-gray-900)',
    '--move-bg-subtle': 'var(--move-gray-800)',
    '--move-bg-muted': 'var(--move-gray-700)',
    '--move-bg-emphasis': 'var(--move-gray-600)',
    '--move-bg-inverse': 'var(--move-gray-50)',

    // Foreground
    '--move-fg-base': 'var(--move-gray-50)',
    '--move-fg-muted': 'var(--move-gray-400)',
    '--move-fg-subtle': 'var(--move-gray-500)',
    '--move-fg-inverse': 'var(--move-gray-950)',

    // Border
    '--move-border-base': 'var(--move-gray-700)',
    '--move-border-muted': 'var(--move-gray-600)',
    '--move-border-emphasis': 'var(--move-gray-500)',

    // Primary (indigo)
    '--move-primary': 'var(--move-indigo-600)',
    '--move-primary-hover': 'var(--move-indigo-500)',
    '--move-primary-active': 'var(--move-indigo-700)',
    '--move-primary-subtle': 'var(--move-indigo-950)',
    '--move-primary-fg': 'var(--move-white)',

    // Secondary
    '--move-secondary': 'var(--move-gray-700)',
    '--move-secondary-hover': 'var(--move-gray-600)',
    '--move-secondary-active': 'var(--move-gray-800)',
    '--move-secondary-fg': 'var(--move-gray-50)',

    // Success
    '--move-success': 'var(--move-green-600)',
    '--move-success-hover': 'var(--move-green-500)',
    '--move-success-subtle': 'var(--move-green-950)',
    '--move-success-fg': 'var(--move-white)',

    // Warning
    '--move-warning': 'var(--move-yellow-500)',
    '--move-warning-hover': 'var(--move-yellow-400)',
    '--move-warning-subtle': 'var(--move-yellow-950)',
    '--move-warning-fg': 'var(--move-black)',

    // Error
    '--move-error': 'var(--move-red-600)',
    '--move-error-hover': 'var(--move-red-500)',
    '--move-error-subtle': 'var(--move-red-950)',
    '--move-error-fg': 'var(--move-white)',

    // Info
    '--move-info': 'var(--move-blue-500)',
    '--move-info-hover': 'var(--move-blue-400)',
    '--move-info-subtle': 'var(--move-blue-950)',
    '--move-info-fg': 'var(--move-white)',

    // Palette — dark theme overrides (lighter text, darker soft bg)
    '--move-gray-text': 'var(--move-gray-300)',
    '--move-gray-soft-bg': 'var(--move-gray-950)',
    '--move-red-text': 'var(--move-red-300)',
    '--move-red-soft-bg': 'var(--move-red-950)',
    '--move-pink-text': 'var(--move-pink-300)',
    '--move-pink-soft-bg': 'var(--move-pink-950)',
    '--move-grape-text': 'var(--move-grape-300)',
    '--move-grape-soft-bg': 'var(--move-grape-950)',
    '--move-violet-text': 'var(--move-violet-300)',
    '--move-violet-soft-bg': 'var(--move-violet-950)',
    '--move-indigo-text': 'var(--move-indigo-300)',
    '--move-indigo-soft-bg': 'var(--move-indigo-950)',
    '--move-blue-text': 'var(--move-blue-300)',
    '--move-blue-soft-bg': 'var(--move-blue-950)',
    '--move-cyan-text': 'var(--move-cyan-300)',
    '--move-cyan-soft-bg': 'var(--move-cyan-950)',
    '--move-teal-text': 'var(--move-teal-300)',
    '--move-teal-soft-bg': 'var(--move-teal-950)',
    '--move-green-text': 'var(--move-green-300)',
    '--move-green-soft-bg': 'var(--move-green-950)',
    '--move-lime-text': 'var(--move-lime-300)',
    '--move-lime-soft-bg': 'var(--move-lime-950)',
    '--move-yellow-text': 'var(--move-yellow-300)',
    '--move-yellow-soft-bg': 'var(--move-yellow-950)',
    '--move-orange-text': 'var(--move-orange-300)',
    '--move-orange-soft-bg': 'var(--move-orange-950)',

    // Focus
    '--move-focus-ring-color': 'var(--move-indigo-400)',

    // Overlay
    '--move-overlay': 'rgba(0, 0, 0, 0.5)',

    // Scrollbar
    '--move-scrollbar-thumb': 'var(--move-gray-700)',
    '--move-scrollbar-track': 'transparent',

    // Shadows — per-surface
    ...darkShadows,
  },
  animation: {
    spring: {
      mass: 0.8,
      stiffness: 500,
      damping: 15,
    },
    duration: {
      fast: 100,
      normal: 200,
      slow: 300,
    },
    reducedMotion: false,
  },
};
