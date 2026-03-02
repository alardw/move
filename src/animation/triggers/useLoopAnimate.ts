import type { LoopAnimate } from '../types';

// =============================================================================
// useLoopAnimate — for continuous ambient animation (Spinner, Skeleton, Loader)
// =============================================================================

export interface UseLoopAnimateOptions {
  /** Animation configuration (false to disable) */
  animate?: LoopAnimate | false;
}

export interface UseLoopAnimateReturn {
  /** Ref to attach to the looping element */
  ref: React.RefObject<HTMLElement | null>;
}

export function useLoopAnimate(
  _options: UseLoopAnimateOptions = {}
): UseLoopAnimateReturn {
  // Stub — to be implemented
  throw new Error('useLoopAnimate is not yet implemented.');
}
