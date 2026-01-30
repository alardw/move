// Core utilities
export { springs, easings, getEase, isSpring, DEFAULT_DURATION } from './springs';
export type { SpringParams, SpringPreset, Easing, AnimationPreset } from './springs';

// Animation utilities
export {
  prefersReducedMotion,
  resolveEasing,
  toAnimeParams,
  toInstantParams,
  mergeAnimateConfig,
  getInitialStyles,
} from './utils';

// Hooks
export { useAnimateConfig, useInteractiveAnimate } from './useAnimateConfig';
export type { UseAnimateConfigOptions, UseAnimateConfigReturn } from './useAnimateConfig';

// Presence system
export { Presence } from './Presence';
export type { PresenceProps } from './Presence';

export { usePresence, useIsPresent } from './PresenceContext';
export type { PresenceContextValue } from './PresenceContext';

// Animation config types
export type {
  AnimatableValue,
  Animation,
  AnimationProperties,
  AnimateConfig,
  StaggerConfig,
  // Component-specific types
  InteractiveAnimate,
  ExpandableAnimate,
  ToggleableAnimate,
  OverlayAnimate,
  MenuAnimate,
  MenuItemAnimate,
  ListAnimate,
  ListItemAnimate,
} from './types';

export { defaultAnimations } from './types';
