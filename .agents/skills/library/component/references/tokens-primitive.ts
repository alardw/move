/**
 * Primitive Token Inventory
 *
 * Every primitive token from src/styles/tokens/primitives/.
 * Reference only — these are the raw values available for semantic tokens.
 */

// =============================================================================
// Colors
// =============================================================================

export const COLORS = {
  gray: {
    '--move-gray-50': '#fafafa',
    '--move-gray-100': '#f4f4f5',
    '--move-gray-200': '#e4e4e7',
    '--move-gray-300': '#d4d4d8',
    '--move-gray-400': '#a1a1aa',
    '--move-gray-500': '#71717a',
    '--move-gray-600': '#52525b',
    '--move-gray-700': '#3f3f46',
    '--move-gray-800': '#27272a',
    '--move-gray-900': '#18181b',
    '--move-gray-950': '#09090b',
  },
  sage: {
    '--move-sage-50': '#f2f7f3',
    '--move-sage-100': '#dfeae1',
    '--move-sage-200': '#bfd6c4',
    '--move-sage-300': '#94b89d',
    '--move-sage-400': '#6c9a76',
    '--move-sage-500': '#507f59',
    '--move-sage-600': '#3d6647',
    '--move-sage-700': '#325339',
    '--move-sage-800': '#2a4330',
    '--move-sage-900': '#243828',
    '--move-sage-950': '#121f15',
  },
  blue: {
    '--move-blue-50': '#eff6ff',
    '--move-blue-100': '#dbeafe',
    '--move-blue-200': '#bfdbfe',
    '--move-blue-300': '#93c5fd',
    '--move-blue-400': '#60a5fa',
    '--move-blue-500': '#3b82f6',
    '--move-blue-600': '#2563eb',
    '--move-blue-700': '#1d4ed8',
    '--move-blue-800': '#1e40af',
    '--move-blue-900': '#1e3a8a',
    '--move-blue-950': '#172554',
  },
  green: {
    '--move-green-50': '#f0fdf4',
    '--move-green-100': '#dcfce7',
    '--move-green-200': '#bbf7d0',
    '--move-green-300': '#86efac',
    '--move-green-400': '#4ade80',
    '--move-green-500': '#22c55e',
    '--move-green-600': '#16a34a',
    '--move-green-700': '#15803d',
    '--move-green-800': '#166534',
    '--move-green-900': '#14532d',
    '--move-green-950': '#052e16',
  },
  red: {
    '--move-red-50': '#fef2f2',
    '--move-red-100': '#fee2e2',
    '--move-red-200': '#fecaca',
    '--move-red-300': '#fca5a5',
    '--move-red-400': '#f87171',
    '--move-red-500': '#ef4444',
    '--move-red-600': '#dc2626',
    '--move-red-700': '#b91c1c',
    '--move-red-800': '#991b1b',
    '--move-red-900': '#7f1d1d',
    '--move-red-950': '#450a0a',
  },
  yellow: {
    '--move-yellow-50': '#fefce8',
    '--move-yellow-100': '#fef9c3',
    '--move-yellow-200': '#fef08a',
    '--move-yellow-300': '#fde047',
    '--move-yellow-400': '#facc15',
    '--move-yellow-500': '#eab308',
    '--move-yellow-600': '#ca8a04',
    '--move-yellow-700': '#a16207',
    '--move-yellow-800': '#854d0e',
    '--move-yellow-900': '#713f12',
    '--move-yellow-950': '#422006',
  },
  orange: {
    '--move-orange-50': '#fff7ed',
    '--move-orange-100': '#ffedd5',
    '--move-orange-200': '#fed7aa',
    '--move-orange-300': '#fdba74',
    '--move-orange-400': '#fb923c',
    '--move-orange-500': '#f97316',
    '--move-orange-600': '#ea580c',
    '--move-orange-700': '#c2410c',
    '--move-orange-800': '#9a3412',
    '--move-orange-900': '#7c2d12',
    '--move-orange-950': '#431407',
  },
  static: {
    '--move-white': '#ffffff',
    '--move-black': '#000000',
    '--move-transparent': 'transparent',
  },
} as const;

// =============================================================================
// Spacing
// =============================================================================

export const SPACING = {
  '--move-space-0': '0',
  '--move-space-1': '0.25rem',
  '--move-space-2': '0.5rem',
  '--move-space-3': '0.75rem',
  '--move-space-4': '1rem',
  '--move-space-5': '1.25rem',
  '--move-space-6': '1.5rem',
  '--move-space-8': '2rem',
  '--move-space-10': '2.5rem',
  '--move-space-12': '3rem',
  '--move-space-16': '4rem',
  '--move-space-20': '5rem',
  '--move-space-24': '6rem',
} as const;

// =============================================================================
// Border Radius
// =============================================================================

export const RADII = {
  '--move-radius-0': '0',
  '--move-radius-1': '0.125rem',
  '--move-radius-2': '0.25rem',
  '--move-radius-3': '0.375rem',
  '--move-radius-4': '0.5rem',
  '--move-radius-6': '0.75rem',
  '--move-radius-8': '1rem',
  '--move-radius-12': '1.5rem',
  '--move-radius-full': '9999px',
} as const;

// =============================================================================
// Typography
// =============================================================================

export const TYPOGRAPHY = {
  families: {
    '--move-font-sans': "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
    '--move-font-mono': "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
  },
  sizes: {
    '--move-text-xs': '0.75rem',
    '--move-text-sm': '0.875rem',
    '--move-text-base': '1rem',
    '--move-text-lg': '1.125rem',
    '--move-text-xl': '1.25rem',
    '--move-text-2xl': '1.5rem',
    '--move-text-3xl': '1.875rem',
    '--move-text-4xl': '2.25rem',
  },
  weights: {
    '--move-weight-normal': '400',
    '--move-weight-medium': '500',
    '--move-weight-semibold': '600',
    '--move-weight-bold': '700',
  },
  lineHeights: {
    '--move-leading-none': '1',
    '--move-leading-tight': '1.25',
    '--move-leading-snug': '1.375',
    '--move-leading-normal': '1.5',
    '--move-leading-relaxed': '1.625',
  },
  tracking: {
    '--move-tracking-tight': '-0.025em',
    '--move-tracking-normal': '0',
    '--move-tracking-wide': '0.025em',
  },
} as const;

// =============================================================================
// Shadows
// =============================================================================

export const SHADOWS = {
  '--move-shadow-none': 'none',
  '--move-shadow-xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  '--move-shadow-sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  '--move-shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  '--move-shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  '--move-shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '--move-shadow-2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  glow: {
    '--move-shadow-glow-sm': '0 0 10px -3px',
    '--move-shadow-glow-md': '0 0 20px -5px',
    '--move-shadow-glow-lg': '0 0 30px -5px',
  },
} as const;

// =============================================================================
// Z-Index
// =============================================================================

export const Z_INDEX = {
  '--move-z-hide': '-1',
  '--move-z-base': '0',
  '--move-z-dropdown': '100',
  '--move-z-sticky': '200',
  '--move-z-overlay': '300',
  '--move-z-modal': '400',
  '--move-z-popover': '500',
  '--move-z-toast': '600',
  '--move-z-tooltip': '700',
  '--move-z-max': '9999',
} as const;

// =============================================================================
// Animation
// =============================================================================

export const ANIMATION = {
  durations: {
    '--move-duration-instant': '0ms',
    '--move-duration-fast': '100ms',
    '--move-duration-normal': '200ms',
    '--move-duration-slow': '300ms',
    '--move-duration-slower': '400ms',
    '--move-duration-slowest': '500ms',
  },
  easings: {
    '--move-ease-linear': 'linear',
    '--move-ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    '--move-ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    '--move-ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    '--move-ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    '--move-ease-bounce': 'cubic-bezier(0.34, 1.4, 0.64, 1)',
    '--move-ease-snap': 'cubic-bezier(0.5, 0, 0.1, 1)',
    '--move-ease-overlay-in': 'cubic-bezier(0.32, 0.72, 0, 1)',
    '--move-ease-overlay-out': 'cubic-bezier(0.32, 0.72, 0, 1)',
  },
  delays: {
    '--move-delay-none': '0ms',
    '--move-delay-short': '75ms',
    '--move-delay-medium': '150ms',
    '--move-delay-long': '300ms',
  },
} as const;
