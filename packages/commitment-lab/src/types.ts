// types.ts — the Spike-1 extension, LOCAL to the lab.
//
// We do NOT edit move's CompositeSpec. We import it read-only and INTERSECT the two new
// fields on top via `extends`. If the experiment proves out, `role` + `signature` graduate
// into move's own composite-spec.ts as a deliberate, separate step. Until then this file is
// the only place they exist, and deleting this package reverts everything.

import type { CompositeSpec } from '../../move/src/composite-spec';

// The verb taxonomy from the commitment model (notes/ui-architecture.md §6), tiered:
//   primary   — the user's goal on this unit
//   ambient   — always-present orientation / status
//   mechanic  — an interaction primitive
export type Verb =
  | 'find'
  | 'consume'
  | 'act'
  | 'create'
  | 'navigate'
  | 'authenticate' // primary
  | 'orient'
  | 'status'
  | 'notify' // ambient
  | 'disclose'
  | 'select'; // mechanic

// Closed — where the unit sits in the app.
export type Scope = 'app' | 'page' | 'region' | 'item';

/**
 * The DISCOVERABLE key of a commitment. `object` is the objective anchor (the adapter's
 * data shape — you can't rename it away); `verb` + `scope` are the closed intent overlay.
 * Two composites with the same signature are reuse candidates regardless of their labels.
 */
export interface CompositeSignature {
  verb: Verb;
  /** The data shape the unit serves, e.g. 'video' | 'video[]'. Adapter-derived. */
  object: string;
  scope: Scope;
}

/**
 * A composite spec PLUS the two fields the ledger hangs on. `role` is the emergent,
 * human-confirmed label (the semantic boundary); `signature` is what the matcher queries.
 * The ledger is the index of these across every composite — derived, never hand-authored.
 */
export interface LabComposite extends CompositeSpec {
  role: string;
  signature: CompositeSignature;
}
