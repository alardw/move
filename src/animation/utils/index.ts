// Utility functions
export {
  prefersReducedMotion,
  resolveEasing,
  toAnimeParams,
  toInstantParams,
  mergeAnimateConfig,
  getInitialStyles,
} from './helpers';

// Base hook
export { useAnimateConfig, useInteractiveAnimate, useInteractionAnimate } from './useAnimateConfig';
export type { UseAnimateConfigOptions, UseAnimateConfigReturn } from './useAnimateConfig';

// Position tracking utility
export { usePositionTracker, useSlidingIndicator } from './usePositionTracker';
export type { UsePositionTrackerOptions, UsePositionTrackerReturn, UseSlidingIndicatorOptions, UseSlidingIndicatorReturn } from './usePositionTracker';
