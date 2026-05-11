// derive.ts — computed properties read FROM a Spec.
//
// These are derivations that the spec itself doesn't declare — they
// fall out of other taxonomies. Tooling (CSS pipeline, docs page,
// validator) imports from here so there's a single canonical answer.
//
// If a derivation can't produce the right value for some component,
// the fix is to refine the underlying taxonomy (e.g. split a coarse
// kind into more specific variants), not to add an override field
// to Spec.

import type { Spec } from './spec';
import type { Z } from './taxonomies';

/**
 * Stacking layer this component lives at, derived from `behaviors[]`
 * and `a11y`. Returns `undefined` for components that live at the
 * base layer (no z-index needed).
 *
 * Order of precedence (highest signal wins):
 *   1. a11y.tooltip → tooltip layer (above other popovers)
 *   2. behaviors.notification-floating → toast layer
 *   3. behaviors.modal-overlay → overlay layer
 *   4. behaviors.popup-anchored → popover layer
 *   5. anything else → base (undefined)
 */
export function deriveZ(spec: Spec): Z | undefined {
  if (spec.taxonomies.a11y?.kind === 'tooltip') return { kind: 'tooltip' };

  for (const b of spec.taxonomies.behaviors ?? []) {
    if (b.kind === 'notification-floating') return { kind: 'toast' };
    if (b.kind === 'modal-overlay') return { kind: 'overlay' };
    if (b.kind === 'popup-anchored') return { kind: 'popover' };
  }

  // app-shell / sticky have no clean derivation rule today and would
  // signal that another taxonomy is too coarse. Add specific
  // behaviour kinds when those cases appear.
  return undefined;
}
