// Core utilities
export { springs, easings, getEase, isSpring, DEFAULT_DURATION } from './easings';
export type { SpringParams, SpringPreset, Easing, AnimationPreset } from './easings';

// Re-export anime.js JSAnimation type so components don't import animejs directly
export type { JSAnimation } from 'animejs';

// Pre-computed spring constants — use directly as `ease` in per-property params
export { snappy, quick, poppy, brisk, smooth } from './easings';

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

/** Canonical "reveal children on mount" stagger trigger builder (opacity + scale) */
export { staggerEnter } from './staggerEnter';
export type { StaggerEnterOptions } from './staggerEnter';

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
  // Motions (self-explaining builders)
  fadeIn,
  fadeOut,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  scaleIn,
  scaleOut,
  scaleUp,
  scaleDown,
  rotate,
  expand,
  collapse,
  // Sequence helpers
  interactive,
  revealHeight,
  staggerItems,
  toggleIndicator,
  expandContent,
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

export { useDismissable, useDismissableExit } from './useDismissable';
export type { Dismissable, DismissableOptions, DismissableExitOptions } from './useDismissable';

// =============================================================================
// Split text (Tier-2 textSplit capability)
// =============================================================================

export { useSplitText } from './useSplitText';
export type {
  UseSplitTextOptions,
  UseSplitTextReturn,
  SplitTextBy,
  SplitTextEffect,
  SplitTextTrigger,
} from './useSplitText';

export { useAutoLayout } from './useAutoLayout';
export type {
  UseAutoLayoutOptions,
  UseAutoLayoutReturn,
  LayoutEnterExit,
} from './useAutoLayout';

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
