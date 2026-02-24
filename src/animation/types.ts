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
export type ElementAnimate = Pick<
  AnimateConfig,
  'enter' | 'exit' | 'hover' | 'press'
>;

/** @deprecated Use ElementAnimate instead */
export type InteractiveAnimate = ElementAnimate;

/**
 * Animation config for expandable content (Accordion, Collapsible, etc)
 */
export type ContentAnimate = Pick<
  AnimateConfig,
  'enter' | 'exit' | 'open' | 'close' | 'stagger'
>;

/** @deprecated Use ContentAnimate instead */
export type ExpandableAnimate = ContentAnimate;

/**
 * Animation config for toggleable elements (Checkbox, Switch, Radio)
 */
export type IndicatorAnimate = Pick<
  AnimateConfig,
  'enter' | 'exit' | 'press' | 'checked' | 'unchecked'
>;

/** @deprecated Use IndicatorAnimate instead */
export type ToggleableAnimate = IndicatorAnimate;

/**
 * Animation config for overlay/modal content (Dialog, AlertDialog, Popover)
 */
export type LayerAnimate = Pick<
  AnimateConfig,
  'enter' | 'exit'
>;

/** @deprecated Use LayerAnimate instead */
export type OverlayAnimate = LayerAnimate;

/**
 * Animation config for popup content (Dropdown, Select, DatePicker)
 */
export type PopupAnimate = Pick<
  AnimateConfig,
  'enter' | 'exit' | 'stagger'
>;

/** @deprecated Use PopupAnimate instead */
export type MenuAnimate = PopupAnimate;

/**
 * Animation config for popup items
 */
export type PopupItemAnimate = Pick<
  AnimateConfig,
  'enter' | 'exit' | 'hover'
>;

/** @deprecated Use PopupItemAnimate instead */
export type MenuItemAnimate = PopupItemAnimate;

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
  element: {
    hover: { scale: 1.05, easing: 'snappy' },
    press: { scale: 0.95, easing: 'snappy' },
  } satisfies ElementAnimate,

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
  } satisfies LayerAnimate,

  /** Dialog, AlertDialog backdrop */
  layerBackdrop: {
    enter: { opacity: { value: [0, 1], easing: 'outQuart' }, duration: 200 },
    exit: { opacity: { value: [1, 0], easing: 'outQuart' }, duration: 150 },
  } satisfies LayerAnimate,

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
  } satisfies ContentAnimate,

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
    stagger: { delay: 30 },
  } satisfies PopupAnimate,

  /** Popup items */
  popupItem: {
    enter: { opacity: { value: [0, 1], easing: 'outQuart' } },
    hover: { scale: 1.02, easing: 'snappy' },
  } satisfies PopupItemAnimate,

  /** Checkbox, Switch, Radio */
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
  } satisfies IndicatorAnimate,
} as const;
