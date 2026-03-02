import type { AnimationPreset } from './easings';

// Re-export for convenience
export type { AnimationPreset } from './easings';

/**
 * A property value with optional per-property easing
 */
export type AnimatableValue<T> = T | { value: T; easing?: AnimationPreset };

/**
 * Properties that can be animated
 * Each property can be a simple value or an object with { value, easing }
 */
export interface AnimationProperties {
  // Transform
  scale?: AnimatableValue<number | [number, number]>;
  scaleX?: AnimatableValue<number | [number, number]>;
  scaleY?: AnimatableValue<number | [number, number]>;
  x?: AnimatableValue<number | [number, number]>;
  y?: AnimatableValue<number | [number, number]>;
  rotate?: AnimatableValue<number | [number, number]>;
  rotateX?: AnimatableValue<number | [number, number]>;
  rotateY?: AnimatableValue<number | [number, number]>;
  skewX?: AnimatableValue<number | [number, number]>;
  skewY?: AnimatableValue<number | [number, number]>;

  // Appearance
  opacity?: AnimatableValue<number | [number, number]>;

  // Dimensions
  width?: AnimatableValue<number | string | [number | string, number | string]>;
  height?: AnimatableValue<number | string | [number | string, number | string]>;

  // Other
  [key: string]: unknown;
}

/**
 * A single animation definition with properties and timing
 */
export interface Animation extends AnimationProperties {
  /** Easing preset for this animation (overrides config-level easing) */
  easing?: AnimationPreset;
  /** Duration in ms (ignored for spring easings) */
  duration?: number;
  /** Delay before animation starts in ms */
  delay?: number;
}

/**
 * Stagger configuration for animating children
 */
export interface StaggerConfig {
  /** Delay between each child in ms */
  delay?: number;
  /** Direction to stagger from */
  from?: 'first' | 'last' | 'center';
}

/**
 * Full animation configuration — union of all triggers and modifiers.
 * Used internally. Components should intersect specific triggers instead.
 */
export type AnimateConfig = LifecycleAnimate &
  InteractionAnimate &
  ToggleAnimate &
  ExpandAnimate &
  ValueAnimate &
  LoopAnimate &
  StaggerModifier &
  DelayModifier;

// =============================================================================
// Core trigger types — atomic, composable
//
// Each trigger type maps 1:1 to an animation hook.
// Components intersect triggers on the `animate` prop:
//   animate?: LifecycleAnimate & InteractionAnimate
// =============================================================================

/** Mount/unmount animation */
export interface LifecycleAnimate {
  enter?: Animation;
  exit?: Animation;
}

/** User hover/press animation */
export interface InteractionAnimate {
  hover?: Animation | false;
  press?: Animation | false;
}

/** Binary state animation (checkbox, switch) */
export interface ToggleAnimate {
  checked?: Animation;
  unchecked?: Animation;
}

/** Content reveal/hide animation (accordion, collapsible) */
export interface ExpandAnimate {
  open?: Animation;
  close?: Animation;
}

/** Continuous value change animation (progress bar) */
export interface ValueAnimate {
  value?: Animation;
}

/** Continuous ambient animation (spinner, skeleton) */
export interface LoopAnimate {
  loop?: Animation;
}

// =============================================================================
// Modifiers — mix into any trigger type
// =============================================================================

/** Sequenced children modifier */
export interface StaggerModifier {
  stagger?: StaggerConfig;
}

/** Animation delay modifier */
export interface DelayModifier {
  delay?: number;
}

// =============================================================================
// Default animations (shared across components of same category)
// =============================================================================

export const defaultAnimations = {
  /** Button, Link, clickable elements */
  element: {
    hover: { scale: 1.05, easing: 'snappy' },
    press: { scale: 0.95, easing: 'snappy' },
  } satisfies InteractionAnimate,

  /** Inline dismissible elements (Alert, Toast) */
  presence: {
    enter: {
      opacity: { value: [0, 1], easing: 'outQuart' },
      scale: { value: [0.95, 1], easing: 'snappy' },
    },
    exit: {
      opacity: { value: [1, 0], easing: 'outQuart' },
      scale: { value: [1, 0.95], easing: 'outQuart' },
      duration: 150,
    },
  } satisfies LifecycleAnimate,

  /** Dialog, AlertDialog, Popover, Sheet content */
  layer: {
    enter: {
      opacity: { value: [0, 1], easing: 'outQuart' },
      scale: { value: [0.9, 1], easing: 'snappy' },
    },
    exit: {
      opacity: { value: [1, 0], easing: 'outQuart' },
      scale: { value: [1, 0.95], easing: 'outQuart' },
      duration: 150,
    },
  } satisfies LifecycleAnimate,

  /** Dialog, AlertDialog backdrop */
  layerBackdrop: {
    enter: { opacity: { value: [0, 1], easing: 'outQuart' }, duration: 200 },
    exit: { opacity: { value: [1, 0], easing: 'outQuart' }, duration: 150 },
  } satisfies LifecycleAnimate,

  /** Accordion, Collapsible */
  content: {
    open: {
      height: { value: [0, 'auto'], easing: 'outQuart' },
      opacity: { value: [0, 1], easing: 'outQuart' },
      duration: 400,
    },
    close: {
      height: { value: ['auto', 0], easing: 'outQuart' },
      opacity: { value: [1, 0], easing: 'outQuart' },
      duration: 300,
    },
  } satisfies ExpandAnimate,

  /** Dropdown, ContextMenu, Select */
  popup: {
    enter: {
      opacity: { value: [0, 1], easing: 'outQuart' },
      scale: { value: [0.95, 1], easing: 'poppy' },
    },
    exit: {
      opacity: { value: [1, 0], easing: 'outQuart' },
      scale: { value: [1, 0.95], easing: 'outQuart' },
      duration: 150,
    },
  } satisfies LifecycleAnimate,

  /** Stagger defaults for popup children */
  popupStagger: {
    stagger: { delay: 30 },
  } satisfies StaggerModifier,

  /** Carousel slide transition */
  carousel: {
    enter: {
      easing: 'outQuart',
    },
  } satisfies LifecycleAnimate,

  /** Popup items — lifecycle + interaction */
  popupItem: {
    enter: { opacity: { value: [0, 1], easing: 'outQuart' } },
    hover: { scale: 1.02, easing: 'snappy' },
  } satisfies LifecycleAnimate & InteractionAnimate,

  /** Checkbox, Switch, Radio — toggle + interaction */
  indicator: {
    press: { scale: 0.9, easing: 'snappy' },
    checked: {
      opacity: { value: [0, 1], easing: 'outQuart' },
      scale: { value: [0.5, 1], easing: 'poppy' },
    },
    unchecked: {
      opacity: { value: [1, 0], easing: 'outQuart' },
      scale: { value: [1, 0.5], easing: 'outQuart' },
      duration: 150,
    },
  } satisfies ToggleAnimate & InteractionAnimate,
} as const;
