// Move — cross-cutting adapters
// =============================================================================
// The canonical home for adapter CONTRACTS that are shared across components
// (as opposed to component-specific contracts, which co-locate with the
// component, e.g. FileUpload's `FileUploadAdapter` in its own `types.ts`).
//
// An adapter is just a function (or value) satisfying a typed contract a
// component declares — there is no framework, no provider to wrap, no registry.
// Components import these contracts from here; the generated `integrationPoints`
// mechanism resolves `from: 'adapters'` to this module.
//
// Design notes live in `notes/adapters-integration.md`.
// =============================================================================

// --- Existing cross-cutting contracts (re-exported as the single catalogue) ---
// These keep their runtime home (the provider/hook lives with its subsystem);
// only the typed contract is surfaced here so there is ONE place to discover
// every shared adapter. Type-only re-exports — no runtime coupling, no cycles.

export type { IconResolver, IconRoleOverrides } from '../infrastructure/Icon';
export type { CodeHighlighterFn, HighlightResult } from '../components/typography/Code';

// --- AsyncResource<T> ---------------------------------------------------------
// A typed contract for asynchronously-loaded data, so data-driven components are
// source-agnostic: the consumer brings React Query / SWR / RSC / plain fetch and
// maps it onto this shape. A discriminated union (not a flat record) so a
// component physically cannot render `data` while still loading.
//
// There is deliberately no `idle` variant: a not-yet-started resource is modeled
// by the prop being `undefined` (`resource?: AsyncResource<T>`), which keeps the
// rendered state machine to the three cases every async UI must handle.

export type AsyncResource<T, E = Error> =
  | { status: 'loading' }
  | { status: 'error'; error: E; retry?: () => void }
  | { status: 'success'; data: T; refreshing?: boolean };

/**
 * The flat shape most async-data libraries already return (React Query, SWR,
 * etc.). `asyncResource.from()` maps it onto the discriminated union so wiring a
 * real data source is a one-liner.
 */
export interface AsyncStateInput<T, E = Error> {
  /** The loaded value. `undefined` means "not loaded yet". */
  data?: T | undefined;
  /** A load/refresh failure. */
  error?: E | null | undefined;
  /** First load, no data yet. (React Query `isLoading`.) */
  isLoading?: boolean;
  /** Any request in flight, including background refetch. (React Query `isFetching`, SWR `isValidating`.) */
  isFetching?: boolean;
  /** Re-run the request. (React Query `refetch`, SWR `mutate`.) */
  refetch?: () => void;
}

/** Constructors + bridge for `AsyncResource`. */
export const asyncResource = {
  loading<T, E = Error>(): AsyncResource<T, E> {
    return { status: 'loading' };
  },

  success<T, E = Error>(data: T, opts?: { refreshing?: boolean }): AsyncResource<T, E> {
    return { status: 'success', data, refreshing: opts?.refreshing };
  },

  error<T, E = Error>(error: E, retry?: () => void): AsyncResource<T, E> {
    return { status: 'error', error, retry };
  },

  /**
   * Map a flat `{ data, error, isLoading, isFetching, refetch }` state — the
   * shape React Query / SWR return — onto an `AsyncResource`.
   * Precedence: error → data present (success) → loading.
   */
  from<T, E = Error>(state: AsyncStateInput<T, E>): AsyncResource<T, E> {
    if (state.error != null) {
      return { status: 'error', error: state.error, retry: state.refetch };
    }
    if (state.data !== undefined) {
      return { status: 'success', data: state.data, refreshing: !!state.isFetching };
    }
    return { status: 'loading' };
  },
} as const;
