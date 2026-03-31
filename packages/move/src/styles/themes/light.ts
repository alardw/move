import type { Theme } from './types';
import { createThemeShadows } from '../visual/shadows';

const lightShadows = createThemeShadows({
  angle: 135,
  color: '220 3% 15%',
  oomph: 0.5,
  crispy: 0.5,
  surfaces: {
    base:     { strength: 0.30 },
    subtle:   { strength: 0.35 },
    muted:    { strength: 0.40 },
    emphasis: { strength: 0.45 },
    inverse:  { color: '220 3% 90%', strength: 0.50 },
  },
});

export const lightTheme: Theme = {
  name: 'light',
  tokens: {
    // Background
    '--move-bg-base': 'var(--move-white)',
    '--move-bg-subtle': 'var(--move-gray-50)',
    '--move-bg-muted': 'var(--move-gray-100)',
    '--move-bg-emphasis': 'var(--move-gray-200)',
    '--move-bg-inverse': 'var(--move-gray-900)',

    // Foreground
    '--move-fg-base': 'var(--move-gray-900)',
    '--move-fg-muted': 'var(--move-gray-600)',
    '--move-fg-subtle': 'var(--move-gray-400)',
    '--move-fg-inverse': 'var(--move-gray-50)',

    // Border
    '--move-border-base': 'var(--move-gray-200)',
    '--move-border-muted': 'var(--move-gray-300)',
    '--move-border-emphasis': 'var(--move-gray-400)',

    // Primary (indigo)
    '--move-primary': 'var(--move-indigo-700)',
    '--move-primary-hover': 'var(--move-indigo-800)',
    '--move-primary-active': 'var(--move-indigo-600)',
    '--move-primary-subtle': 'var(--move-indigo-50)',
    '--move-primary-fg': 'var(--move-white)',

    // Secondary
    '--move-secondary': 'var(--move-gray-200)',
    '--move-secondary-hover': 'var(--move-gray-300)',
    '--move-secondary-active': 'var(--move-gray-100)',
    '--move-secondary-fg': 'var(--move-gray-900)',

    // Success
    '--move-success': 'var(--move-green-600)',
    '--move-success-hover': 'var(--move-green-700)',
    '--move-success-subtle': 'var(--move-green-100)',
    '--move-success-fg': 'var(--move-white)',

    // Warning
    '--move-warning': 'var(--move-yellow-600)',
    '--move-warning-hover': 'var(--move-yellow-700)',
    '--move-warning-subtle': 'var(--move-yellow-100)',
    '--move-warning-fg': 'var(--move-black)',

    // Error
    '--move-error': 'var(--move-red-600)',
    '--move-error-hover': 'var(--move-red-700)',
    '--move-error-subtle': 'var(--move-red-100)',
    '--move-error-fg': 'var(--move-white)',

    // Info
    '--move-info': 'var(--move-blue-600)',
    '--move-info-hover': 'var(--move-blue-700)',
    '--move-info-subtle': 'var(--move-blue-100)',
    '--move-info-fg': 'var(--move-white)',

    // Palette — light theme overrides (darker text, lighter soft bg)
    '--move-gray-text': 'var(--move-gray-700)',       '--move-gray-soft-bg': 'var(--move-gray-100)',
    '--move-red-text': 'var(--move-red-900)',         '--move-red-soft-bg': 'var(--move-red-50)',
    '--move-pink-text': 'var(--move-pink-800)',       '--move-pink-soft-bg': 'var(--move-pink-50)',
    '--move-grape-text': 'var(--move-grape-800)',     '--move-grape-soft-bg': 'var(--move-grape-50)',
    '--move-violet-text': 'var(--move-violet-700)',   '--move-violet-soft-bg': 'var(--move-violet-50)',
    '--move-indigo-text': 'var(--move-indigo-800)',   '--move-indigo-soft-bg': 'var(--move-indigo-50)',
    '--move-blue-text': 'var(--move-blue-800)',       '--move-blue-soft-bg': 'var(--move-blue-50)',
    '--move-cyan-text': 'var(--move-cyan-900)',       '--move-cyan-soft-bg': 'var(--move-cyan-50)',
    '--move-teal-text': 'var(--move-teal-900)',       '--move-teal-soft-bg': 'var(--move-teal-50)',
    '--move-green-text': 'var(--move-green-950)',     '--move-green-soft-bg': 'var(--move-green-50)',
    '--move-lime-text': 'var(--move-lime-950)',       '--move-lime-soft-bg': 'var(--move-lime-50)',
    '--move-yellow-text': 'var(--move-yellow-950)',   '--move-yellow-soft-bg': 'var(--move-yellow-50)',
    '--move-orange-text': 'var(--move-orange-950)',   '--move-orange-soft-bg': 'var(--move-orange-50)',

    // Focus
    '--move-focus-ring-color': 'var(--move-indigo-500)',

    // Overlay
    '--move-overlay': 'rgba(0, 0, 0, 0.4)',

    // Scrollbar
    '--move-scrollbar-thumb': 'var(--move-gray-200)',
    '--move-scrollbar-track': 'transparent',

    // Shadows — per-surface
    ...lightShadows,
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
