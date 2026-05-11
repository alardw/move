import type { Animation } from './types';
import { snappy, poppy } from './easings';

// =============================================================================
// Animation atoms — single animation params, maximum reuse
// =============================================================================

/** Fade in — general purpose enter opacity */
export const fadeIn: Animation = { opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 } };

/** Fade out — general purpose exit opacity */
export const fadeOut: Animation = { opacity: { to: 0, ease: 'outQuart', duration: 150 } };

/** Pop in — scale up from small with bounce, for list items entering */
export const popIn: Animation = { scale: { from: 0.8, to: 1, ease: poppy }, opacity: { from: 0, to: 1 } };

/** Pop out — scale down quickly, for list items exiting */
export const popOut: Animation = { scale: { to: 0.8, ease: 'outQuart', duration: 150 }, opacity: { to: 0, duration: 150 } };

/** Scale up — subtle grow for hover */
export const scaleUp: Animation = { scale: { to: 1.05, ease: snappy } };

/** Scale down — subtle shrink for press */
export const scaleDown: Animation = { scale: { to: 0.95, ease: snappy } };

/** Scale in — appear from half size with bounce, for indicators/avatars */
export const scaleIn: Animation = { scale: { from: 0.5, to: 1, ease: poppy } };

// =============================================================================
// Event bundles — bag of events, compose atoms
// =============================================================================

/** Button, ToggleButton, Link, Pagination, DayCell — hover grow + press shrink */
export const interactive = { hover: scaleUp, press: scaleDown };

/** Select/Dropdown/Autocomplete/TimeField content — height reveal with fade */
export const revealHeight = {
  enter: { height: { from: 0, ease: 'outQuart', duration: 250 }, ...fadeIn },
  exit: { height: { to: 0, ease: 'outQuart', duration: 200 }, ...fadeOut, delay: 50 },
};

/** Select/Dropdown/Autocomplete/TimeField items — pop stagger */
export const staggerItems = {
  enter: popIn,
  exit: popOut,
  stagger: { delay: 30 },
};

/** Checkbox/RadioGroup indicator — toggle check/uncheck */
export const toggleIndicator = {
  checked: { ...scaleIn, opacity: { from: 0, to: 1, duration: 150 } },
  unchecked: { scale: { to: 0.5, duration: 150 }, opacity: { to: 0, duration: 150 } },
};

/** Accordion/Collapsible content — expand/collapse with opacity.
 * Height has no explicit duration so `animateDimension` computes one
 * proportional to the measured content size (short panels reveal quickly,
 * long panels take proportionally longer, clamped to sane bounds). */
export const expandContent = {
  open: { height: { from: 0, to: 'auto', ease: 'outQuart' }, opacity: { from: 0, to: 1, ease: 'outQuart', duration: 250 } },
  close: { height: { from: 'auto', to: 0, ease: 'outQuart' }, opacity: { from: 1, to: 0, ease: 'outQuart', duration: 150 } },
};

// =============================================================================
// Preset registry — name → Animation lookup for declarative references
// =============================================================================

export const PRESET_REGISTRY: Record<string, Animation> = {
  scaleUp,
  scaleDown,
  scaleIn,
  fadeIn,
  fadeOut,
  popIn,
  popOut,
};

// =============================================================================
// Legacy aliases (will be removed after migration)
// =============================================================================

/** @deprecated Use `revealHeight` instead */
export const popupContentAnimate = {
  enter: revealHeight.enter,
  exit: revealHeight.exit,
};

/** @deprecated Use `staggerItems` instead */
export const popupItemAnimate = {
  ...staggerItems,
};
