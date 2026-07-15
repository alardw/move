// General-purpose, subsystem-agnostic hooks (and their thin wrapper components).
// Factory-coupled hooks live in `engine/`; animation hooks live in `animation/`.

export { useInView } from './useInView';
export type { UseInViewOptions, UseInViewReturn } from './useInView';

export { useTruncate } from './useTruncate';
export type { UseTruncateOptions, UseTruncateReturn } from './useTruncate';

export { Deferred } from './Deferred';
export type { DeferredProps } from './Deferred';
