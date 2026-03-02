// Core utilities
export { springs, easings, getEase, isSpring, DEFAULT_DURATION } from './easings';
export type { SpringParams, SpringPreset, Easing, AnimationPreset } from './easings';

// Animation utilities
export {
  prefersReducedMotion,
  resolveEasing,
  toAnimeParams,
  toInstantParams,
  mergeAnimateConfig,
  getInitialStyles,
} from './utils';

// Base hook (internal)
export { useAnimateConfig } from './utils';
export type { UseAnimateConfigOptions, UseAnimateConfigReturn } from './utils';

// 1:1 trigger hooks
export {
  useLifecycleAnimate,
  useInteractionAnimate,
  useToggleAnimate,
  useExpandAnimate,
  useValueAnimate,
  useLoopAnimate,
} from './triggers';
export type {
  UseLifecycleAnimateOptions,
  UseLifecycleAnimateReturn,
  UseToggleAnimateOptions,
  UseToggleAnimateReturn,
  UseExpandAnimateOptions,
  UseExpandAnimateReturn,
  UseValueAnimateOptions,
  UseValueAnimateReturn,
  UseLoopAnimateOptions,
  UseLoopAnimateReturn,
} from './triggers';

// Utility hooks (not triggers)
export { usePositionTracker, useSlidingIndicator } from './utils';
export type { UsePositionTrackerOptions, UsePositionTrackerReturn, UseSlidingIndicatorOptions, UseSlidingIndicatorReturn } from './utils';

// Legacy hook names (original-components compatibility)
export { useInteractiveAnimate, useInteractionAnimate as useInteractionAnimate_ } from './utils';
export {
  useToggleAnimation,
  useExpandAnimation,
} from './triggers';
export type {
  UseToggleAnimationOptions,
  UseToggleAnimationReturn,
  UseExpandAnimationOptions,
  UseExpandAnimationReturn,
} from './triggers';

// Legacy popup/layer — now useLifecycleAnimate, but kept for original-components
// Original-components that import these will need migration
export { useLifecycleAnimate as usePopupAnimation } from './triggers';
export { useLifecycleAnimate as useLayerAnimation } from './triggers';

// Presence system
export { Presence } from './presence/Presence';
export type { PresenceProps } from './presence/Presence';

export { usePresence, useIsPresent } from './presence/PresenceContext';
export type { PresenceContextValue } from './presence/PresenceContext';

// Animation config types
export type {
  AnimatableValue,
  Animation,
  AnimationProperties,
  AnimateConfig,
  StaggerConfig,
  // Core trigger types
  LifecycleAnimate,
  InteractionAnimate,
  ToggleAnimate,
  ExpandAnimate,
  ValueAnimate,
  LoopAnimate,
  // Modifiers
  StaggerModifier,
  DelayModifier,
} from './types';

export { defaultAnimations } from './types';
