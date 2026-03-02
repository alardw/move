/**
 * Default Conventions
 *
 * Class-level token defaults and size/variant conventions.
 * All values reference semantic tokens, never hardcoded.
 */

// =============================================================================
// Input component tokens (InputText, Textarea, Password, NumberInput, etc.)
// =============================================================================

export const INPUT_TOKENS = {
  bg: 'var(--move-bg-subtle)',
  bgHover: 'var(--move-bg-muted)',
  bgFocus: 'var(--move-bg-subtle)',
  fg: 'var(--move-fg-base)',
  fgPlaceholder: 'var(--move-fg-subtle)',
  border: 'var(--move-border-base)',
  borderHover: 'var(--move-border-emphasis)',
  borderFocus: 'var(--move-focus-ring-color)',
  radius: 'var(--move-rounded-md)',
  paddingX: 'var(--move-spacing-sm)',
  paddingY: 'var(--move-spacing-xs)',
  font: 'var(--move-font-body)',
} as const;

// =============================================================================
// Overlay tokens (Dialog, Sidebar, Sheet)
// =============================================================================

export const OVERLAY_TOKENS = {
  bg: 'var(--move-bg-subtle)',
  fg: 'var(--move-fg-base)',
  border: 'var(--move-border-base)',
  radius: 'var(--move-rounded-lg)',
  shadow: 'var(--move-shadow-overlay)',
  backdrop: 'var(--move-overlay)',
  backdropBlur: 'var(--move-overlay-blur)',
  padding: 'var(--move-spacing-lg)',
  zIndex: 'var(--move-layer-modal)',
} as const;

// =============================================================================
// Popup tokens (Dropdown, Popover, Select, Tooltip)
// =============================================================================

export const POPUP_TOKENS = {
  bg: 'var(--move-bg-subtle)',
  fg: 'var(--move-fg-base)',
  border: 'var(--move-border-base)',
  radius: 'var(--move-rounded-md)',
  shadow: 'var(--move-shadow-elevated)',
  padding: 'var(--move-spacing-xs)',
  zIndex: 'var(--move-layer-popover)',
} as const;

// =============================================================================
// List item tokens (Dropdown items, Select items, Autocomplete items)
// =============================================================================

export const LIST_ITEM_TOKENS = {
  bg: 'transparent',
  bgHighlight: 'var(--move-bg-muted)',
  bgActive: 'var(--move-primary)',
  fg: 'var(--move-fg-base)',
  fgHighlight: 'var(--move-fg-base)',
  fgActive: 'var(--move-primary-fg)',
  radius: 'var(--move-rounded-sm)',
  paddingX: 'var(--move-spacing-sm)',
  paddingY: 'var(--move-spacing-xs)',
} as const;

// =============================================================================
// Toggle indicator tokens (Checkbox, Switch, Radio)
// =============================================================================

export const TOGGLE_TOKENS = {
  bg: 'var(--move-bg-muted)',
  bgChecked: 'var(--move-primary)',
  border: 'var(--move-border-emphasis)',
  borderChecked: 'var(--move-primary)',
  fg: 'var(--move-primary-fg)',
} as const;

// =============================================================================
// Button-like tokens (Button, ToggleButton)
// =============================================================================

export const BUTTON_TOKENS = {
  primaryBg: 'var(--move-primary)',
  primaryBgHover: 'var(--move-primary-hover)',
  primaryBgActive: 'var(--move-primary-active)',
  primaryFg: 'var(--move-primary-fg)',
  secondaryBg: 'var(--move-secondary)',
  secondaryBgHover: 'var(--move-secondary-hover)',
  secondaryBgActive: 'var(--move-secondary-active)',
  secondaryFg: 'var(--move-secondary-fg)',
  ghostBg: 'transparent',
  ghostBgHover: 'var(--move-bg-muted)',
  ghostFg: 'var(--move-fg-base)',
  dangerBg: 'var(--move-error)',
  dangerBgHover: 'var(--move-error-hover)',
  dangerFg: 'var(--move-error-fg)',
  radius: 'var(--move-rounded-md)',
} as const;

// =============================================================================
// Surface defaults per component class
// Components that create a background surface should set data-surface.
// The spec skill auto-fills from these defaults; user can override.
// =============================================================================

export const SURFACE_DEFAULTS: Record<string, { slot: string; level: string } | undefined> = {
  overlay_layer: { slot: 'content', level: 'subtle' },
  overlay_popup: { slot: 'content', level: 'subtle' },
  display:       { slot: 'root', level: 'subtle' },
  // Other classes: no surface (undefined)
} as const;

// =============================================================================
// Size conventions
// =============================================================================

export const SIZE_CONVENTIONS = {
  /** Standard sizes used across components */
  standard: ['sm', 'md', 'lg'] as const,

  /** Height mapping for control-like components (buttons, inputs) */
  controlHeights: {
    sm: 'var(--move-control-height-sm)',
    md: 'var(--move-control-height-md)',
    lg: 'var(--move-control-height-lg)',
  } as const,

  /** Font size mapping */
  fontSize: {
    sm: 'var(--move-size-sm)',
    md: 'var(--move-size-base)',
    lg: 'var(--move-size-lg)',
  } as const,

  /** Padding mapping */
  paddingX: {
    sm: 'var(--move-spacing-sm)',
    md: 'var(--move-spacing-md)',
    lg: 'var(--move-spacing-lg)',
  } as const,

  /** Default size for all components */
  default: 'md' as const,
  /** Typography components default to semantic text size */
  typographyDefault: 'base' as const,
} as const;

// =============================================================================
// Default heuristics by domain
// =============================================================================

/**
 * Form text/input-like fields use outlined by default.
 * Applies to components such as InputText, Textarea, NumberInput, Autocomplete,
 * Select, Password, ColorInput (unless extracted source/user override differs).
 */
export const FORM_FIELD_VARIANT_DEFAULT = 'outlined' as const;

// =============================================================================
// Common variant conventions
// =============================================================================

export const VARIANT_CONVENTIONS = {
  /** Standard variants for buttons */
  button: ['primary', 'secondary', 'ghost', 'danger'] as const,

  /** Standard variants for badges/alerts */
  semantic: ['primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const,

  /** Standard variants for outline-capable components */
  withOutline: ['primary', 'secondary', 'outline'] as const,
} as const;
