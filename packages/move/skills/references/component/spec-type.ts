/**
 * Component Spec Type Definitions — canonical source moved.
 *
 * The single source of truth for the spec schema now lives at
 * `packages/move/src/spec-type.ts`, where every `<Name>.spec.ts` types itself
 * with `satisfies ComponentSpec` so tsc enforces conformance. This file just
 * re-exports it so the other reference files (and skills) resolve the same
 * types without a second copy to keep in sync.
 *
 * Reading the schema: see `packages/move/src/spec-type.ts`.
 */
export * from '../../../src/spec-type';
