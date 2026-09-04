// Re-export for convenience
export type { AnimationPreset } from './easings';

/**
 * Animation config — passes straight to anime.js v4 animate().
 * Every animated property carries its own ease and duration as a per-property object:
 *   { from, to, ease, duration }
 *
 * Example:
 *   { opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 },
 *     scale: { from: 0.95, to: 1, ease: poppy } }
 */
export type Animation = Record<string, unknown> & {
  delay?: number;
  /** Loop count (true = infinite) */
  loop?: boolean | number;
  /** Alternate direction each loop iteration */
  alternate?: boolean;
};

/**
 * Stagger configuration for animating children
 */
export interface StaggerConfig {
  /** Delay between each child in ms */
  delay?: number;
  /** Direction to stagger from */
  from?: 'first' | 'last' | 'center';
  /**
   * Longest the whole reveal may take, in ms, however many children there are.
   *
   * A fixed per-child delay is fine at five items and a drag at twenty, where
   * the last one arrives more than half a second after the first. The delay
   * shrinks to fit rather than the tail growing. Default 240.
   */
  maxTotal?: number;
}

// =============================================================================
// Trigger → Sequence types
// =============================================================================

/**
 * Declares a named state derived from a DOM attribute.
 * The runtime observes `source` on the `slot` element and fires
 * the matching trigger when `value` matches.
 */
export interface AnimationState {
  /** Trigger name — matches `AnimationTrigger.trigger` */
  name: string;
  /** Which slot element to observe */
  slot: string;
  /** DOM attribute to watch (e.g. 'data-state') */
  source: string;
  /** Attribute value that activates this state */
  value: string;
  /** CSS selector — observe `refs[slot].current.closest(selector)` instead of the slot element itself */
  closest?: string;
  /** Whether to fire on initial attribute match (default true). Set false to skip mount-time fire. */
  initial?: boolean;
}

/**
 * A single step in an animation sequence.
 */
export interface AnimationStep {
  /** Target slot to animate (defaults to trigger's slot if omitted) */
  target?: string;
  /** Inline animation config (motions are spread into this object) */
  animation?: Animation;
  /** Runtime function: 'animateDimension' | 'animatePosition' (default: moveAnimate) */
  fn?: 'animateDimension' | 'animatePosition';
  /** CSS selector for stagger targets (implies staggerAnimate) */
  children?: string;
  /** Stagger timing config */
  stagger?: { delay?: number; from?: 'first' | 'last' | 'center' };
  /** Callback fired after this step's animation completes */
  onComplete?: () => void;
}

/**
 * A sequence item — either a single step or parallel steps (nested array).
 */
export type SequenceItem = AnimationStep | AnimationStep[];

/**
 * A trigger-sequence pair: when the trigger fires, execute the sequence.
 */
export interface AnimationTrigger {
  /** Trigger name — 'Slot.event' for events, bare name for states */
  trigger: string;
  /** Steps to execute (false to disable) */
  sequence: SequenceItem[] | false;
  /** Variable definitions for expression resolution. Function form receives the target element. */
  vars?: Record<string, unknown> | ((el: HTMLElement) => Record<string, unknown>);
  /** CSS selector for event delegation — attach listener on slot, animate matching child */
  delegate?: string;
  /** Callback fired after the entire sequence completes */
  onComplete?: () => void;
  /** Dependency values — when any dep changes (shallow compare), re-execute the sequence */
  deps?: unknown[];
  /** Direction for deps-triggered sequences (default: 'enter'). Controls animateDimension behavior. */
  direction?: 'enter' | 'exit';
}
