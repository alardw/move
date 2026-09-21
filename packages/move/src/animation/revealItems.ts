import type { AnimationTrigger, StaggerConfig } from './types';
import { brisk } from './easings';

/**
 * How a list of data reveals itself.
 *
 * Table, Timeline and List all do the same thing — rows arrive in sequence when
 * the data does — and all three described it separately, so they drifted: a
 * table rose 8px and never scaled, a timeline rose 12 and scaled to 0.95, a list
 * scaled from a width-relative ratio and never rose. Three vocabularies for one
 * idea, none of them chosen against the others.
 *
 * So the motion lives here and nothing about it is a parameter. Rows fade in and
 * settle up from 0.95 on one spring: a spring rather than a duration because a
 * reveal is a thing arriving, not a thing timed, and one spring across every row
 * so the sequence reads as a single wave.
 *
 * What a caller still chooses is WHEN — the lifecycle trigger — and how far
 * apart, because rate depends on row size. Everything else is the same idiom
 * everywhere it is used.
 *
 * Deliberately not `staggerEnter`, which reveals arbitrary children of a layout
 * primitive. This is the data-display idiom: the rows of a thing you can filter.
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
  /**
   * Selector for the rows, relative to `target`.
   *
   * Defaults to the marker every staggered row in the library carries. A hashed
   * CSS-module class cannot be named by a consumer overriding this animation and
   * cannot be written down in a spec either, so a component that selects on one
   * ships a stagger its own spec describes wrongly.
   */
  children?: string;
  /** Spacing between rows. The caller's, because rate depends on row size. */
  stagger?: StaggerConfig;
  /** Trigger-scoped vars, passed through untouched. */
  vars?: AnimationTrigger['vars'];
}

/** What every staggered row in the library is marked with. */
export const STAGGER_ITEMS = '[data-move-stagger]';

/** The shared reveal: fade and settle, in sequence. */
export function revealItems({
  trigger,
  children = STAGGER_ITEMS,
  stagger = { delay: 30 },
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
          opacity: { from: 0, to: 1, ease: brisk },
          scale: { from: 0.95, to: 1, ease: brisk },
        },
      },
    ],
  };
}
