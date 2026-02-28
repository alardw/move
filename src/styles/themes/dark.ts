import type { Theme } from './types';
import { createShadowPalette } from '../visual/shadows';

// Dark theme uses subtle light glow for elevation visibility
const darkShadows = createShadowPalette({
  color: '220deg 10% 80%',
  angle: 135, // Light from top-left
  opacity: 0.08,
  oomph: 0.12,
  crispy: 0.14,
  resolution: 0,
});

export const darkTheme: Theme = {
  name: 'dark',
  tokens: {
    // Background
    '--move-bg-base': 'var(--move-gray-950)',
    '--move-bg-subtle': 'var(--move-gray-900)',
    '--move-bg-muted': 'var(--move-gray-800)',
    '--move-bg-emphasis': 'var(--move-gray-700)',
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

    // Primary (violet)
    '--move-primary': 'var(--move-violet-600)',
    '--move-primary-hover': 'var(--move-violet-500)',
    '--move-primary-active': 'var(--move-violet-700)',
    '--move-primary-subtle': 'var(--move-violet-950)',
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
    '--move-error': 'var(--move-red-400)',
    '--move-error-hover': 'var(--move-red-300)',
    '--move-error-subtle': 'var(--move-red-950)',
    '--move-error-fg': 'var(--move-black)',

    // Info
    '--move-info': 'var(--move-blue-500)',
    '--move-info-hover': 'var(--move-blue-400)',
    '--move-info-subtle': 'var(--move-blue-950)',
    '--move-info-fg': 'var(--move-white)',

    // Focus
    '--move-focus-ring-color': 'var(--move-violet-500)',

    // Overlay
    '--move-overlay': 'rgba(0, 0, 0, 0.5)',

    // Scrollbar
    '--move-scrollbar-thumb': 'var(--move-gray-700)',
    '--move-scrollbar-track': 'transparent',

    // Shadows - subtle light glow for dark theme visibility
    '--move-shadow-color': '220deg 10% 80%',
    '--move-shadow-sm': darkShadows.sm,
    '--move-shadow-md': darkShadows.md,
    '--move-shadow-lg': darkShadows.lg,
    '--move-shadow-xl': darkShadows.xl,
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
