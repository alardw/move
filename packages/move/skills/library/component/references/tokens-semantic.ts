/**
 * Semantic Token Inventory
 *
 * Every semantic token from src/styles/tokens/semantic.css.
 * These are the tokens components should reference — never primitives directly.
 */

// =============================================================================
// Color — Background
// =============================================================================

export const BG_TOKENS = {
  '--move-bg-base': 'var(--move-gray-950)',
  '--move-bg-subtle': 'var(--move-gray-900)',
  '--move-bg-muted': 'var(--move-gray-800)',
  '--move-bg-emphasis': 'var(--move-gray-700)',
  '--move-bg-inverse': 'var(--move-gray-50)',
} as const;

// =============================================================================
// Color — Foreground / Text
// =============================================================================

export const FG_TOKENS = {
  '--move-fg-base': 'var(--move-gray-50)',
  '--move-fg-muted': 'var(--move-gray-400)',
  '--move-fg-subtle': 'var(--move-gray-500)',
  '--move-fg-inverse': 'var(--move-gray-950)',
} as const;

// =============================================================================
// Color — Border
// =============================================================================

export const BORDER_TOKENS = {
  '--move-border-base': 'var(--move-gray-800)',
  '--move-border-muted': 'var(--move-gray-700)',
  '--move-border-emphasis': 'var(--move-gray-600)',
} as const;

// =============================================================================
// Color — Primary (brand)
// =============================================================================

export const PRIMARY_TOKENS = {
  '--move-primary': 'var(--move-indigo-600)',
  '--move-primary-hover': 'var(--move-indigo-500)',
  '--move-primary-active': 'var(--move-indigo-700)',
  '--move-primary-subtle': 'var(--move-indigo-950)',
  '--move-primary-fg': 'var(--move-white)',
} as const;

// =============================================================================
// Color — Secondary
// =============================================================================

export const SECONDARY_TOKENS = {
  '--move-secondary': 'var(--move-gray-700)',
  '--move-secondary-hover': 'var(--move-gray-600)',
  '--move-secondary-active': 'var(--move-gray-800)',
  '--move-secondary-fg': 'var(--move-gray-50)',
} as const;

// =============================================================================
// Color — Success
// =============================================================================

export const SUCCESS_TOKENS = {
  '--move-success': 'var(--move-green-600)',
  '--move-success-hover': 'var(--move-green-500)',
  '--move-success-subtle': 'var(--move-green-950)',
  '--move-success-fg': 'var(--move-white)',
} as const;

// =============================================================================
// Color — Warning
// =============================================================================

export const WARNING_TOKENS = {
  '--move-warning': 'var(--move-yellow-500)',
  '--move-warning-hover': 'var(--move-yellow-400)',
  '--move-warning-subtle': 'var(--move-yellow-950)',
  '--move-warning-fg': 'var(--move-black)',
} as const;

// =============================================================================
// Color — Error / Danger
// =============================================================================

export const ERROR_TOKENS = {
  '--move-error': 'var(--move-red-600)',
  '--move-error-hover': 'var(--move-red-500)',
  '--move-error-subtle': 'var(--move-red-950)',
  '--move-error-fg': 'var(--move-white)',
} as const;

// =============================================================================
// Color — Info
// =============================================================================

export const INFO_TOKENS = {
  '--move-info': 'var(--move-blue-600)',
  '--move-info-hover': 'var(--move-blue-500)',
  '--move-info-subtle': 'var(--move-blue-950)',
  '--move-info-fg': 'var(--move-white)',
} as const;

// =============================================================================
// Selection
// =============================================================================

export const SELECTION_TOKENS = {
  '--move-selection-bg': 'var(--move-primary)',
  '--move-selection-fg': 'var(--move-primary-fg)',
} as const;

// =============================================================================
// Selected (UI item selection — rows, list items)
// =============================================================================

export const SELECTED_TOKENS = {
  '--move-selected-bg': 'var(--move-primary-subtle)',
  '--move-selected-fg': 'var(--move-fg-base)',
} as const;

// =============================================================================
// Focus Ring
// =============================================================================

export const FOCUS_TOKENS = {
  '--move-focus-ring-color': 'var(--move-indigo-400)',
  '--move-focus-ring-width': '2px',
  '--move-focus-ring-offset': '2px',
  '--move-focus-ring': 'var(--move-focus-ring-width) solid var(--move-focus-ring-color)',
} as const;

// =============================================================================
// Interactive Element Heights
// =============================================================================

export const CONTROL_HEIGHT_TOKENS = {
  '--move-control-height-sm': '2rem',
  '--move-control-height-md': '2.375rem',
  '--move-control-height-lg': '2.75rem',
} as const;

// =============================================================================
// Disabled State
// =============================================================================

export const DISABLED_TOKENS = {
  '--move-disabled-opacity': '0.6',
} as const;

// =============================================================================
// Spacing — Semantic
// =============================================================================

export const SPACING_TOKENS = {
  '--move-spacing-xs': 'var(--move-space-1)',
  '--move-spacing-sm': 'var(--move-space-2)',
  '--move-spacing-md': 'var(--move-space-4)',
  '--move-spacing-lg': 'var(--move-space-6)',
  '--move-spacing-xl': 'var(--move-space-8)',
} as const;

// =============================================================================
// Border Radius — Semantic
// =============================================================================

export const RADIUS_TOKENS = {
  '--move-rounded-none': 'var(--move-radius-0)',
  '--move-rounded-sm': 'var(--move-radius-2)',
  '--move-rounded-md': 'var(--move-radius-4)',
  '--move-rounded-lg': 'var(--move-radius-6)',
  '--move-rounded-xl': 'var(--move-radius-8)',
  '--move-rounded-full': 'var(--move-radius-full)',
} as const;

// =============================================================================
// Typography — Semantic
// =============================================================================

export const TYPOGRAPHY_TOKENS = {
  '--move-font-body': 'var(--move-font-sans)',
  '--move-font-code': 'var(--move-font-mono)',
  '--move-size-xs': 'var(--move-text-xs)',
  '--move-size-sm': 'var(--move-text-sm)',
  '--move-size-base': 'var(--move-text-base)',
  '--move-size-lg': 'var(--move-text-lg)',
  '--move-size-xl': 'var(--move-text-xl)',
} as const;

// =============================================================================
// Scrollbar
// =============================================================================

export const SCROLLBAR_TOKENS = {
  '--move-scrollbar-thumb': 'var(--move-gray-700)',
  '--move-scrollbar-track': 'transparent',
} as const;

// =============================================================================
// Overlay Backdrop
// =============================================================================

export const OVERLAY_TOKENS = {
  '--move-overlay-light': 'color-mix(in srgb, var(--move-black) 30%, transparent)',
  '--move-overlay': 'color-mix(in srgb, var(--move-black) 50%, transparent)',
  '--move-overlay-heavy': 'color-mix(in srgb, var(--move-black) 70%, transparent)',
  '--move-overlay-blur': '4px',
} as const;

// =============================================================================
// Surfaces — levels that affect shadow context
// =============================================================================

export const SURFACE_LEVELS = ['base', 'subtle', 'muted', 'emphasis', 'inverse'] as const;

// =============================================================================
// Shadows — Per-surface tokens (resolved by [data-surface] in surface.css)
// Active tokens: --move-shadow-sm/md/lg/xl (resolved from current surface)
// Per-surface: --move-shadow-{surface}-{size} (set by theme via createThemeShadows)
// =============================================================================

export const SHADOW_TOKENS = {
  // Semantic aliases — components use these
  '--move-shadow-subtle': 'var(--move-shadow-sm)',
  '--move-shadow-default': 'var(--move-shadow-md)',
  '--move-shadow-elevated': 'var(--move-shadow-lg)',
  '--move-shadow-overlay': 'var(--move-shadow-xl)',
} as const;

// =============================================================================
// Animation — Semantic
// =============================================================================

export const ANIMATION_TOKENS = {
  '--move-transition-fast': 'var(--move-duration-fast)',
  '--move-transition-normal': 'var(--move-duration-normal)',
  '--move-transition-slow': 'var(--move-duration-slow)',
  '--move-ease-default': 'var(--move-ease-out)',
  '--move-ease-interactive': 'var(--move-ease-spring)',
  '--move-ease-enter': 'var(--move-ease-overlay-in)',
  '--move-ease-exit': 'var(--move-ease-overlay-out)',
} as const;

// =============================================================================
// Z-Index — Semantic
// =============================================================================

export const Z_INDEX_TOKENS = {
  '--move-layer-base': 'var(--move-z-base)',
  '--move-layer-dropdown': 'var(--move-z-dropdown)',
  '--move-layer-overlay': 'var(--move-z-overlay)',
  '--move-layer-modal': 'var(--move-z-modal)',
  '--move-layer-popover': 'var(--move-z-popover)',
  '--move-layer-toast': 'var(--move-z-toast)',
  '--move-layer-tooltip': 'var(--move-z-tooltip)',
} as const;

// =============================================================================
// Complete semantic token list (for validation)
// =============================================================================

export const ALL_SEMANTIC_TOKENS = {
  ...BG_TOKENS,
  ...FG_TOKENS,
  ...BORDER_TOKENS,
  ...PRIMARY_TOKENS,
  ...SECONDARY_TOKENS,
  ...SUCCESS_TOKENS,
  ...WARNING_TOKENS,
  ...ERROR_TOKENS,
  ...INFO_TOKENS,
  ...SELECTION_TOKENS,
  ...FOCUS_TOKENS,
  ...CONTROL_HEIGHT_TOKENS,
  ...DISABLED_TOKENS,
  ...SPACING_TOKENS,
  ...RADIUS_TOKENS,
  ...TYPOGRAPHY_TOKENS,
  ...SCROLLBAR_TOKENS,
  ...OVERLAY_TOKENS,
  ...SHADOW_TOKENS,
  ...ANIMATION_TOKENS,
  ...Z_INDEX_TOKENS,
} as const;
