// Single import surface for the spec contract.
//
// import type { Spec } from 'move/contract'
//
// Internal modules can import from this package's `src/contract/` and
// the public re-export still has the `move/contract` shape so consumers
// can read it without depending on internal file structure.

export * from './taxonomies';
export * from './spec';
export * from './derive';
