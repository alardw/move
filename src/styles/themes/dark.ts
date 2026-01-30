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
    '--move-bg-base': '#0a0a0b',
    '--move-bg-subtle': '#141417',
    '--move-bg-muted': '#1f1f23',
    '--move-bg-emphasis': '#2e2e33',
    '--move-bg-inverse': '#fafafa',

    // Foreground
    '--move-fg-base': '#fafafa',
    '--move-fg-muted': '#a1a1aa',
    '--move-fg-subtle': '#71717a',
    '--move-fg-inverse': '#0a0a0b',

    // Border
    '--move-border-base': '#27272a',
    '--move-border-muted': '#3f3f46',
    '--move-border-emphasis': '#52525b',

    // Primary (violet)
    '--move-primary': '#7c3aed',
    '--move-primary-hover': '#8b5cf6',
    '--move-primary-active': '#6d28d9',
    '--move-primary-subtle': '#2e1065',
    '--move-primary-fg': '#ffffff',

    // Secondary
    '--move-secondary': '#3f3f46',
    '--move-secondary-hover': '#52525b',
    '--move-secondary-active': '#27272a',
    '--move-secondary-fg': '#fafafa',

    // Success
    '--move-success': '#16a34a',
    '--move-success-hover': '#22c55e',
    '--move-success-subtle': '#052e16',
    '--move-success-fg': '#ffffff',

    // Warning
    '--move-warning': '#eab308',
    '--move-warning-hover': '#facc15',
    '--move-warning-subtle': '#422006',
    '--move-warning-fg': '#000000',

    // Error
    '--move-error': '#dc2626',
    '--move-error-hover': '#ef4444',
    '--move-error-subtle': '#450a0a',
    '--move-error-fg': '#ffffff',

    // Info
    '--move-info': '#2563eb',
    '--move-info-hover': '#3b82f6',
    '--move-info-subtle': '#172554',
    '--move-info-fg': '#ffffff',

    // Focus
    '--move-focus-ring-color': '#8b5cf6',

    // Overlay
    '--move-overlay': 'rgba(0, 0, 0, 0.5)',

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
