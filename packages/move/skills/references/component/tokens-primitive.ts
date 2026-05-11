/**
 * Primitive Token Inventory
 *
 * Every primitive token from src/styles/tokens/primitives/.
 * Reference only — these are the raw values available for semantic tokens.
 *
 * Color palettes: Open Color (MIT) + Move gray scale.
 * Each chromatic palette includes fg-solid and fg-subtle for WCAG AA legibility.
 */

// =============================================================================
// Colors — 13 palettes from Open Color + Move gray
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
  red: {
    '--move-red-50': '#fff5f5',
    '--move-red-100': '#ffe3e3',
    '--move-red-200': '#ffc9c9',
    '--move-red-300': '#ffa8a8',
    '--move-red-400': '#ff8787',
    '--move-red-500': '#ff6b6b',
    '--move-red-600': '#fa5252',
    '--move-red-700': '#f03e3e',
    '--move-red-800': '#e03131',
    '--move-red-900': '#c92a2a',
    '--move-red-950': '#7a1a1a',
    '--move-red-fg-solid': 'white',
    '--move-red-fg-subtle': '#ffa8a8',
  },
  pink: {
    '--move-pink-50': '#fff0f6',
    '--move-pink-100': '#ffdeeb',
    '--move-pink-200': '#fcc2d7',
    '--move-pink-300': '#faa2c1',
    '--move-pink-400': '#f783ac',
    '--move-pink-500': '#f06595',
    '--move-pink-600': '#e64980',
    '--move-pink-700': '#d6336c',
    '--move-pink-800': '#c2255c',
    '--move-pink-900': '#a61e4d',
    '--move-pink-950': '#6b1434',
    '--move-pink-fg-solid': 'white',
    '--move-pink-fg-subtle': '#fcc2d7',
  },
  grape: {
    '--move-grape-50': '#f8f0fc',
    '--move-grape-100': '#f3d9fa',
    '--move-grape-200': '#eebefa',
    '--move-grape-300': '#e599f7',
    '--move-grape-400': '#da77f2',
    '--move-grape-500': '#cc5de8',
    '--move-grape-600': '#be4bdb',
    '--move-grape-700': '#ae3ec9',
    '--move-grape-800': '#9c36b5',
    '--move-grape-900': '#862e9c',
    '--move-grape-950': '#5a1e6a',
    '--move-grape-fg-solid': 'white',
    '--move-grape-fg-subtle': '#eebefa',
  },
  violet: {
    '--move-violet-50': '#f3f0ff',
    '--move-violet-100': '#e5dbff',
    '--move-violet-200': '#d0bfff',
    '--move-violet-300': '#b197fc',
    '--move-violet-400': '#9775fa',
    '--move-violet-500': '#845ef7',
    '--move-violet-600': '#7950f2',
    '--move-violet-700': '#7048e8',
    '--move-violet-800': '#6741d9',
    '--move-violet-900': '#5f3dc4',
    '--move-violet-950': '#3d2880',
    '--move-violet-fg-solid': 'white',
    '--move-violet-fg-subtle': '#d0bfff',
  },
  indigo: {
    '--move-indigo-50': '#edf2ff',
    '--move-indigo-100': '#dbe4ff',
    '--move-indigo-200': '#bac8ff',
    '--move-indigo-300': '#91a7ff',
    '--move-indigo-400': '#748ffc',
    '--move-indigo-500': '#5c7cfa',
    '--move-indigo-600': '#4c6ef5',
    '--move-indigo-700': '#4263eb',
    '--move-indigo-800': '#3b5bdb',
    '--move-indigo-900': '#364fc7',
    '--move-indigo-950': '#233080',
    '--move-indigo-fg-solid': 'white',
    '--move-indigo-fg-subtle': '#bac8ff',
  },
  blue: {
    '--move-blue-50': '#e7f5ff',
    '--move-blue-100': '#d0ebff',
    '--move-blue-200': '#a5d8ff',
    '--move-blue-300': '#74c0fc',
    '--move-blue-400': '#4dabf7',
    '--move-blue-500': '#339af0',
    '--move-blue-600': '#228be6',
    '--move-blue-700': '#1c7ed6',
    '--move-blue-800': '#1971c2',
    '--move-blue-900': '#1864ab',
    '--move-blue-950': '#0f406e',
    '--move-blue-fg-solid': 'white',
    '--move-blue-fg-subtle': '#a5d8ff',
  },
  cyan: {
    '--move-cyan-50': '#e3fafc',
    '--move-cyan-100': '#c5f6fa',
    '--move-cyan-200': '#99e9f2',
    '--move-cyan-300': '#66d9e8',
    '--move-cyan-400': '#3bc9db',
    '--move-cyan-500': '#22b8cf',
    '--move-cyan-600': '#15aabf',
    '--move-cyan-700': '#1098ad',
    '--move-cyan-800': '#0c8599',
    '--move-cyan-900': '#0b7285',
    '--move-cyan-950': '#074a57',
    '--move-cyan-fg-solid': 'white',
    '--move-cyan-fg-subtle': '#99e9f2',
  },
  teal: {
    '--move-teal-50': '#e6fcf5',
    '--move-teal-100': '#c3fae8',
    '--move-teal-200': '#96f2d7',
    '--move-teal-300': '#63e6be',
    '--move-teal-400': '#38d9a9',
    '--move-teal-500': '#20c997',
    '--move-teal-600': '#12b886',
    '--move-teal-700': '#0ca678',
    '--move-teal-800': '#099268',
    '--move-teal-900': '#087f5b',
    '--move-teal-950': '#05503a',
    '--move-teal-fg-solid': 'white',
    '--move-teal-fg-subtle': '#96f2d7',
  },
  green: {
    '--move-green-50': '#ebfbee',
    '--move-green-100': '#d3f9d8',
    '--move-green-200': '#b2f2bb',
    '--move-green-300': '#8ce99a',
    '--move-green-400': '#69db7c',
    '--move-green-500': '#51cf66',
    '--move-green-600': '#40c057',
    '--move-green-700': '#37b24d',
    '--move-green-800': '#2f9e44',
    '--move-green-900': '#2b8a3e',
    '--move-green-950': '#1b5727',
    '--move-green-fg-solid': 'white',
    '--move-green-fg-subtle': '#b2f2bb',
  },
  lime: {
    '--move-lime-50': '#f4fce3',
    '--move-lime-100': '#e9fac8',
    '--move-lime-200': '#d8f5a2',
    '--move-lime-300': '#c0eb75',
    '--move-lime-400': '#a9e34b',
    '--move-lime-500': '#94d82d',
    '--move-lime-600': '#82c91e',
    '--move-lime-700': '#74b816',
    '--move-lime-800': '#66a80f',
    '--move-lime-900': '#5c940d',
    '--move-lime-950': '#3b5f09',
    '--move-lime-fg-solid': 'black',
    '--move-lime-fg-subtle': '#d8f5a2',
  },
  yellow: {
    '--move-yellow-50': '#fff9db',
    '--move-yellow-100': '#fff3bf',
    '--move-yellow-200': '#ffec99',
    '--move-yellow-300': '#ffe066',
    '--move-yellow-400': '#ffd43b',
    '--move-yellow-500': '#fcc419',
    '--move-yellow-600': '#fab005',
    '--move-yellow-700': '#f59f00',
    '--move-yellow-800': '#f08c00',
    '--move-yellow-900': '#e67700',
    '--move-yellow-950': '#8a4800',
    '--move-yellow-fg-solid': 'black',
    '--move-yellow-fg-subtle': '#ffec99',
  },
  orange: {
    '--move-orange-50': '#fff4e6',
    '--move-orange-100': '#ffe8cc',
    '--move-orange-200': '#ffd8a8',
    '--move-orange-300': '#ffc078',
    '--move-orange-400': '#ffa94d',
    '--move-orange-500': '#ff922b',
    '--move-orange-600': '#fd7e14',
    '--move-orange-700': '#f76707',
    '--move-orange-800': '#e8590c',
    '--move-orange-900': '#d9480f',
    '--move-orange-950': '#873008',
    '--move-orange-fg-solid': 'black',
    '--move-orange-fg-subtle': '#ffd8a8',
  },
  static: {
    '--move-white': '#ffffff',
    '--move-black': '#000000',
    '--move-transparent': 'transparent',
  },
} as const;

/**
 * Available palette names for the `color` prop on Badge, Timeline, Avatar, etc.
 * Components resolve `color` → solid/subtle token pairs with WCAG-safe fg.
 */
export const COLOR_NAMES = [
  'gray', 'red', 'pink', 'grape', 'violet', 'indigo',
  'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange',
] as const;

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
