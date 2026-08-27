// General-purpose, subsystem-agnostic hooks (and their thin wrapper components).
// Factory-coupled hooks live in `engine/`; animation hooks live in `animation/`.

export { useInView } from './useInView';
export type { UseInViewOptions, UseInViewReturn } from './useInView';

export { useTruncate } from './useTruncate';
export type { UseTruncateOptions, UseTruncateReturn } from './useTruncate';

export { useOverflow } from './useOverflow';
export type { OverflowAxis, UseOverflowOptions, UseOverflowReturn } from './useOverflow';

export { Deferred } from './Deferred';
export type { DeferredProps } from './Deferred';
