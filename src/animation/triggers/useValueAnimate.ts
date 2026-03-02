import type { ValueAnimate } from '../types';

// =============================================================================
// useValueAnimate — for continuous value change animation (ProgressBar, etc.)
// =============================================================================

export interface UseValueAnimateOptions {
  /** Animation configuration (false to disable) */
  animate?: ValueAnimate | false;
}

export interface UseValueAnimateReturn {
  /** Ref to attach to the animated element */
  ref: React.RefObject<HTMLElement | null>;
}

export function useValueAnimate(
  _options: UseValueAnimateOptions = {}
): UseValueAnimateReturn {
  // Stub — to be implemented
  throw new Error('useValueAnimate is not yet implemented.');
}
