// z-layers.ts — the canonical stacking layers and their CSS tokens.
//
// Components never write raw z-index numbers in their CSS — they reference the
// per-layer token, so the scale is centralized here. Surfaced in the docs
// "Stacking" page.

/** Named stacking layers, ordered low → high. */
export type Z =
  | { kind: 'sticky' }
  | { kind: 'app-shell' }
  | { kind: 'overlay-backdrop' }
  | { kind: 'overlay' }
  | { kind: 'popover' }
  | { kind: 'tooltip' }
  | { kind: 'toast' };

/** Numeric z-index and CSS token per layer. */
export const Z_LAYERS = {
  'sticky': { value: 1020, token: '--move-z-sticky' },
  'app-shell': { value: 1030, token: '--move-z-app-shell' },
  'overlay-backdrop': { value: 1040, token: '--move-z-overlay-backdrop' },
  'overlay': { value: 1050, token: '--move-z-overlay' },
  'popover': { value: 1060, token: '--move-z-popover' },
  'tooltip': { value: 1070, token: '--move-z-tooltip' },
  'toast': { value: 1080, token: '--move-z-toast' },
} as const;

export type ZLayers = typeof Z_LAYERS;
export type ZKind = Z['kind'];
