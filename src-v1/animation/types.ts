import type { AnimationPreset } from './springs';

// Re-export for convenience
export type { AnimationPreset } from './springs';

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
 * Full animation configuration supporting all possible states
 */
export interface AnimateConfig {
  // Lifecycle
  /** Animation when element enters/mounts */
  enter?: Animation;
  /** Animation when element exits/unmounts */
  exit?: Animation;

  // Interaction
  /** Animation on mouse enter (false to disable) */
  hover?: Animation | false;
  /** Animation on mouse down / active (false to disable) */
  press?: Animation | false;

  // Expandable content
  /** Animation when content opens/expands */
  open?: Animation;
  /** Animation when content closes/collapses */
  close?: Animation;

  // Toggle state
  /** Animation when toggled on/checked */
  checked?: Animation;
  /** Animation when toggled off/unchecked */
  unchecked?: Animation;

  // Children
  /** Stagger configuration for direct children */
  stagger?: StaggerConfig;
}

// =============================================================================
// Component-specific animation types
// =============================================================================

/**
 * Animation config for interactive elements (Button, Link, etc)
 */
export type InteractiveAnimate = Pick<
  AnimateConfig,
  'enter' | 'exit' | 'hover' | 'press'
>;

/**
 * Animation config for expandable content (Accordion, Collapsible, etc)
 */
export type ExpandableAnimate = Pick<
  AnimateConfig,
  'enter' | 'exit' | 'open' | 'close' | 'stagger'
>;

/**
 * Animation config for toggleable elements (Checkbox, Switch, Radio)
 */
export type ToggleableAnimate = Pick<
  AnimateConfig,
  'enter' | 'exit' | 'press' | 'checked' | 'unchecked'
>;

/**
 * Animation config for overlay/modal content (Dialog, AlertDialog, Popover)
 */
export type OverlayAnimate = Pick<
  AnimateConfig,
  'enter' | 'exit'
>;

/**
 * Animation config for menu/dropdown content
 */
export type MenuAnimate = Pick<
  AnimateConfig,
  'enter' | 'exit' | 'stagger'
>;

/**
 * Animation config for menu items
 */
export type MenuItemAnimate = Pick<
  AnimateConfig,
  'enter' | 'exit' | 'hover'
>;

/**
 * Animation config for list containers
 */
export type ListAnimate = Pick<
  AnimateConfig,
  'enter' | 'exit' | 'stagger'
>;

/**
 * Animation config for list items
 */
export type ListItemAnimate = Pick<
  AnimateConfig,
  'enter' | 'exit' | 'hover' | 'press'
>;

// =============================================================================
// Default animations (shared across components of same category)
// =============================================================================

export const defaultAnimations = {
  /** Button, Link, clickable elements */
  interactive: {
    hover: { scale: 1.05, easing: 'snappy' },
    press: { scale: 0.95, easing: 'snappy' },
  } satisfies InteractiveAnimate,

  /** Dialog, AlertDialog, Popover, Sheet content */
  overlay: {
    enter: {
      opacity: { value: [0, 1], easing: 'outQuart' },
      scale: { value: [0.9, 1], easing: 'snappy' },
    },
    exit: {
      opacity: { value: [1, 0], easing: 'outQuart' },
      scale: { value: [1, 0.95], easing: 'outQuart' },
      duration: 150,
    },
  } satisfies OverlayAnimate,

  /** Dialog, AlertDialog backdrop */
  overlayBackdrop: {
    enter: { opacity: { value: [0, 1], easing: 'outQuart' }, duration: 200 },
    exit: { opacity: { value: [1, 0], easing: 'outQuart' }, duration: 150 },
  } satisfies OverlayAnimate,

  /** Accordion, Collapsible */
  expandable: {
    open: {
      height: { value: [0, 'auto'], easing: 'outQuart' },
      opacity: { value: [0, 1], easing: 'outQuart' },
    },
    close: {
      height: { value: ['auto', 0], easing: 'outQuart' },
      opacity: { value: [1, 0], easing: 'outQuart' },
      duration: 200,
    },
  } satisfies ExpandableAnimate,

  /** DropdownMenu, ContextMenu, Select */
  menu: {
    enter: {
      opacity: { value: [0, 1], easing: 'outQuart' },
      scale: { value: [0.95, 1], easing: 'poppy' },
    },
    exit: {
      opacity: { value: [1, 0], easing: 'outQuart' },
      scale: { value: [1, 0.95], easing: 'outQuart' },
      duration: 150,
    },
    stagger: { delay: 30 },
  } satisfies MenuAnimate,

  /** Menu items */
  menuItem: {
    enter: { opacity: { value: [0, 1], easing: 'outQuart' } },
    hover: { scale: 1.02, easing: 'snappy' },
  } satisfies MenuItemAnimate,

  /** Checkbox, Switch, Radio */
  toggleable: {
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
  } satisfies ToggleableAnimate,
} as const;
