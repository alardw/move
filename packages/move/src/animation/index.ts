// Core utilities
export { springs, easings, getEase, isSpring, DEFAULT_DURATION } from './easings';
export type { SpringParams, SpringPreset, Easing, AnimationPreset } from './easings';

// Re-export anime.js JSAnimation type so components don't import animejs directly
export type { JSAnimation } from 'animejs';

// Pre-computed spring constants — use directly as `ease` in per-property params
export { snappy, quick, poppy, gentle, slow, lazy, jelly, stiff, tooltip, sidebar, pagination } from './easings';

// Animation utilities
export {
  prefersReducedMotion,
  mergeAnimateConfig,
  toEndValues,
  getFromStyles,
} from './utils/helpers';

// =============================================================================
// Core animation functions
// =============================================================================

/** Core apply function — every animation flows through this */
export { moveAnimate } from './moveAnimate';

/** Dimension reveal/collapse with cleanup */
export { animateDimension } from './animateDimension';

/** Position animation with slot/var expression resolution */
export { animatePosition } from './animatePosition';

/** Animate children with staggered delay */
export { staggerAnimate } from './staggerAnimate';

// =============================================================================
// Trigger-sequence orchestrator
// =============================================================================

/** Core orchestrator — trigger-sequence config → event handlers */
export { useAnimations } from './useAnimations';

/** Merge user animation overrides with component defaults */
export { resolveAnimationsConfig, extractSteps } from './resolveAnimationsConfig';

// =============================================================================
// Presets — animation atoms + event bundles + registry
// =============================================================================

export {
  // Atoms
  fadeIn,
  fadeOut,
  popIn,
  popOut,
  scaleUp,
  scaleDown,
  scaleIn,
  // Event bundles
  interactive,
  revealHeight,
  staggerItems,
  toggleIndicator,
  expandContent,
  // Registry
  PRESET_REGISTRY,
} from './presets';

// =============================================================================
// Position tracking
// =============================================================================

export { usePositionTracker, useSlidingIndicator } from './utils/usePositionTracker';
export type { UsePositionTrackerOptions, UsePositionTrackerReturn, UseSlidingIndicatorOptions, UseSlidingIndicatorReturn } from './utils/usePositionTracker';

// =============================================================================
// Morph height
// =============================================================================

export { useMorphHeight } from './useMorphHeight';
export type { UseMorphHeightOptions } from './useMorphHeight';

// =============================================================================
// Presence system
// =============================================================================

export { Presence } from './presence/Presence';
export type { PresenceProps } from './presence/Presence';

export { usePresence, useIsPresent } from './presence/PresenceContext';
export type { PresenceContextValue } from './presence/PresenceContext';

// =============================================================================
// Animation config types
// =============================================================================

export type {
  Animation,
  StaggerConfig,
  AnimationState,
  AnimationStep,
  SequenceItem,
  AnimationTrigger,
} from './types';
