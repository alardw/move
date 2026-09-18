// z-layers.ts — the canonical stacking layers, and the SOURCE they are checked from.
//
// TWO KINDS OF STACKING, and only one of them belongs here.
//
// LOCAL — a component ordering its own parts inside its own box. ToggleGroup
// lifting the active segment over its neighbours' borders, Timeline's dot over
// its line, a player's controls over the scrim. These are small integers,
// meaningful only against each other, and a raw `z-index: 1` is the right and
// only way to write them. Giving them a layer token would set them all to the
// same number and destroy the ordering they exist for.
//
// LAYERED — a component that must sit above OTHER components. A dialog over the
// page, a tooltip over the dialog, a dragged row over the drawer it came from.
// These take a token from this file, because the only way to order things that
// do not know about each other is a scale they both read from.
//
// The old rule here said "never write raw z-index", which is not the rule and
// cannot be: twenty-three legitimate local ones were already in the library when
// it was written, so the line taught everyone that this header could be skipped.
//
// Surfaced in the docs "Stacking" page, and exported, so a consumer can place
// their own chrome in the same scale.
//
// THIS FILE IS THE SOURCE. `check:z-layers` proves the CSS matches it in both
// directions: every layer here has a `--move-z-*` token defined at exactly this
// value, and no such token exists that is not declared here.
//
// It was not always. This registry used to carry invented values (1020–1080)
// that nothing rendered at, while components stacked on a separate token scale
// running 0–700. The two disagreed about which of toast and tooltip sits on top,
// and since this is public API, a consumer reading `Z_LAYERS.popover.value` got
// 1060 — above everything Move draws — and would have covered their own dialogs
// without ever learning why. Two definitions of one fact, with nothing able to
// notice them parting.

/** Named stacking layers, ordered low → high. */
export type Z =
  | { kind: 'base' }
  | { kind: 'sticky' }
  | { kind: 'overlay' }
  | { kind: 'modal' }
  | { kind: 'popover' }
  | { kind: 'drag' }
  | { kind: 'toast' }
  | { kind: 'tooltip' };

/**
 * Numeric z-index and CSS token per layer.
 *
 * The values ARE the ones that render — this is the same scale the components
 * use, not a parallel description of it.
 */
export const Z_LAYERS = {
  'base': { value: 0, token: '--move-z-base' },
  'sticky': { value: 200, token: '--move-z-sticky' },
  'overlay': { value: 300, token: '--move-z-overlay' },
  'modal': { value: 400, token: '--move-z-modal' },
  'popover': { value: 500, token: '--move-z-popover' },
  'drag': { value: 600, token: '--move-z-drag' },
  'toast': { value: 700, token: '--move-z-toast' },
  'tooltip': { value: 800, token: '--move-z-tooltip' },
} as const;

export type ZLayers = typeof Z_LAYERS;
export type ZKind = Z['kind'];
