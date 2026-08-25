// patterns.ts — the live design patterns, re-exported read-only from move's source.
//
// Patterns are NOT in move's published dist barrel (they live in packages/move/patterns/),
// so the lab reaches them by deep source import. This is the ONLY coupling to move, and it
// is read-only: the lab resolves composites against the real, unmodified pattern specs.

export { mediaTile } from '../../move/patterns/media-tile';
export { itemGallery } from '../../move/patterns/item-gallery';
export { filter } from '../../move/patterns/filter';

import type { DesignPatternSpec } from '../../move/patterns/spec-type';
import { mediaTile } from '../../move/patterns/media-tile';
import { itemGallery } from '../../move/patterns/item-gallery';
import { filter } from '../../move/patterns/filter';

/** Registry slug (a composite's `fromPattern`) → its live DesignPatternSpec. */
export const PATTERNS: Record<string, DesignPatternSpec> = {
  'media-tile': mediaTile,
  'item-gallery': itemGallery,
  filter,
};
