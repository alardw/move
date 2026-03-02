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

    // Primary (sage)
    '--move-primary': 'var(--move-sage-600)',
    '--move-primary-hover': 'var(--move-sage-700)',
    '--move-primary-active': 'var(--move-sage-800)',
    '--move-primary-subtle': 'var(--move-sage-100)',
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

    // Focus
    '--move-focus-ring-color': 'var(--move-sage-600)',

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
