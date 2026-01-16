// Move - Animated UI Component Library
// Built on Radix UI Primitives with CSS Modules

// Import system CSS (lighting, materials, shadows)
import './styles/system.css';

export * from './components';

// Lighting system
export { LightProvider, useLighting } from './lighting';
export type { LightProviderProps } from './lighting';

// Materials system
export { materialPresets } from './materials';
export type { MaterialKind, MaterialParams } from './materials';

// Shadows system
export { shadows, createShadow, createShadowPalette, shadowCSSVariables } from './shadows';
export type { ElevationLevel, ShadowElevation, CreateShadowOptions } from './shadows';

// Animation system
export {
  // Core
  springs,
  easings,
  getEase,
  isSpring,
  DEFAULT_DURATION,
  // Utilities
  prefersReducedMotion,
  resolveEasing,
  toAnimeParams,
  toInstantParams,
  mergeAnimateConfig,
  // Hooks
  useAnimateConfig,
  useInteractiveAnimate,
  // Presence
  Presence,
  usePresence,
  useIsPresent,
  // Defaults
  defaultAnimations,
} from './animation';
export type {
  SpringParams,
  SpringPreset,
  Easing,
  AnimationPreset,
  UseAnimateConfigOptions,
  UseAnimateConfigReturn,
  PresenceProps,
  PresenceContextValue,
  AnimatableValue,
  Animation,
  AnimationProperties,
  AnimateConfig,
  StaggerConfig,
  InteractiveAnimate,
  ExpandableAnimate,
  ToggleableAnimate,
  OverlayAnimate,
  MenuAnimate,
  MenuItemAnimate,
  ListAnimate,
  ListItemAnimate,
} from './animation';
