import type { Theme } from './types';
import { createShadowPalette } from '../visual/shadows';

const lightShadows = createShadowPalette({
  color: '220deg 3% 15%',
  angle: 135, // Light from top-left
  opacity: 0.1,
  oomph: 0.12,
  crispy: 0.14,
  resolution: 0,
});

export const lightTheme: Theme = {
  name: 'light',
  tokens: {
    // Background
    '--move-bg-base': '#ffffff',
    '--move-bg-subtle': '#fafafa',
    '--move-bg-muted': '#f4f4f5',
    '--move-bg-emphasis': '#e4e4e7',
    '--move-bg-inverse': '#18181b',

    // Foreground
    '--move-fg-base': '#18181b',
    '--move-fg-muted': '#52525b',
    '--move-fg-subtle': '#a1a1aa',
    '--move-fg-inverse': '#fafafa',

    // Border
    '--move-border-base': '#e4e4e7',
    '--move-border-muted': '#d4d4d8',
    '--move-border-emphasis': '#a1a1aa',

    // Primary (violet)
    '--move-primary': '#7c3aed',
    '--move-primary-hover': '#6d28d9',
    '--move-primary-active': '#5b21b6',
    '--move-primary-subtle': '#ede9fe',
    '--move-primary-fg': '#ffffff',

    // Secondary
    '--move-secondary': '#e4e4e7',
    '--move-secondary-hover': '#d4d4d8',
    '--move-secondary-active': '#f4f4f5',
    '--move-secondary-fg': '#18181b',

    // Success
    '--move-success': '#16a34a',
    '--move-success-hover': '#15803d',
    '--move-success-subtle': '#dcfce7',
    '--move-success-fg': '#ffffff',

    // Warning
    '--move-warning': '#ca8a04',
    '--move-warning-hover': '#a16207',
    '--move-warning-subtle': '#fef9c3',
    '--move-warning-fg': '#000000',

    // Error
    '--move-error': '#dc2626',
    '--move-error-hover': '#b91c1c',
    '--move-error-subtle': '#fee2e2',
    '--move-error-fg': '#ffffff',

    // Info
    '--move-info': '#2563eb',
    '--move-info-hover': '#1d4ed8',
    '--move-info-subtle': '#dbeafe',
    '--move-info-fg': '#ffffff',

    // Focus
    '--move-focus-ring-color': '#7c3aed',

    // Overlay
    '--move-overlay': 'rgba(0, 0, 0, 0.4)',

    // Shadows - softer for light theme
    '--move-shadow-color': '220deg 3% 15%',
    '--move-shadow-sm': lightShadows.sm,
    '--move-shadow-md': lightShadows.md,
    '--move-shadow-lg': lightShadows.lg,
    '--move-shadow-xl': lightShadows.xl,
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
