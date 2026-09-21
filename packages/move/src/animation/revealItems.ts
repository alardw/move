import type { AnimationTrigger, StaggerConfig } from './types';

/**
 * How a list of data reveals itself.
 *
 * Table, Timeline and List all do the same thing — rows arrive in sequence when
 * the data does — and all three described it separately, so they drifted: a
 * table rose 8px and never scaled, a timeline rose 12 and scaled to 0.95, a list
 * scaled from a width-relative ratio and never rose. Three vocabularies for one
 * idea, none of them chosen against the others.
 *
 * So the vocabulary lives here and the values stay with the caller. What is
 * fixed is WHAT moves — opacity and the block axis, on the same easing over the
 * same duration. What each component chooses is how far and how far apart,
 * because a timeline event and a table row are not the same size and do not
 * arrive at the same rate.
 *
 * Deliberately not `staggerEnter`, which reveals arbitrary children of a layout
 * primitive and scales rather than rises. This is the data-display idiom: the
 * rows of a thing you can filter.
 */
export interface RevealItemsOptions {
  /**
   * The lifecycle trigger, written out — `'Body.enter'`, not composed from a
   * slot name. The slot is read back off it, so the caller repeats nothing.
   *
   * Spelled at the call site on purpose: check:animation-spec-drift reads
   * `trigger: '...'` literals out of component source to hold the spec to what
   * the component actually fires, and a trigger assembled inside a helper is
   * invisible to it. A shared builder that costs the tooling its ability to
   * read the component is not worth having.
   */
  trigger: `${string}.enter`;
  /** Selector for the rows, relative to `target`. */
  children: string;
  /** Spacing between rows. The caller's, because rate depends on row size. */
  stagger: StaggerConfig;
  /** How far each row rises, in px (default 64). */
  distance?: number;
  /** Per-row duration in ms (default 200). */
  duration?: number;
  /** Trigger-scoped vars, passed through untouched. */
  vars?: AnimationTrigger['vars'];
}

/** The shared reveal: fade up, in sequence. */
export function revealItems({
  trigger,
  children,
  stagger,
  distance = 64,
  duration = 200,
  vars,
}: RevealItemsOptions): AnimationTrigger {
  const target = trigger.slice(0, trigger.lastIndexOf('.'));
  return {
    trigger,
    ...(vars ? { vars } : {}),
    sequence: [
      {
        target,
        children,
        stagger,
        animation: {
          opacity: { from: 0, to: 1, ease: 'outQuart', duration },
          translateY: { from: distance, to: 0, ease: 'outQuart', duration },
        },
      },
    ],
  };
}
