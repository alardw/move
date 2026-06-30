import { useRef, useEffect, useCallback } from 'react';
import { moveAnimate, prefersReducedMotion } from '../../../animation';
import type { Animation, JSAnimation } from '../../../animation';

// =============================================================================
// useCarouselAnimate — for Carousel slide transitions
// =============================================================================

export interface UseCarouselAnimateOptions {
  /** Slide transition config (false = disabled) */
  animations?: { enter?: Animation } | false;
}

export interface UseCarouselAnimateReturn {
  /** Animate viewport scroll along one axis */
  animateScroll: (options: {
    viewport: HTMLElement;
    axis: 'scrollLeft' | 'scrollTop';
    from: number;
    to: number;
    onComplete?: () => void;
  }) => void;
  /** Cancel in-flight scroll animation */
  cancel: () => void;
}

const defaultConfig = {
  enter: { ease: 'outQuart' } as Animation,
};

export function useCarouselAnimate(
  options: UseCarouselAnimateOptions = {},
): UseCarouselAnimateReturn {
  const { animations: animationsProp } = options;
  const animRef = useRef<JSAnimation | null>(null);

  const configRef = useRef<typeof defaultConfig>(defaultConfig);
  configRef.current =
    animationsProp === false
      ? ({} as typeof defaultConfig)
      : { ...defaultConfig, ...animationsProp };

  const cancel = useCallback(() => {
    if (animRef.current) {
      animRef.current.pause();
      animRef.current = null;
    }
  }, []);

  const animateScroll = useCallback(
    ({
      viewport,
      axis,
      from,
      to,
      onComplete,
    }: {
      viewport: HTMLElement;
      axis: 'scrollLeft' | 'scrollTop';
      from: number;
      to: number;
      onComplete?: () => void;
    }) => {
      const enter = configRef.current.enter;
      if (!enter || prefersReducedMotion()) {
        viewport[axis] = to;
        onComplete?.();
        return;
      }

      cancel();

      const ease = ((enter as Record<string, unknown>).ease ?? 'outQuart') as string;

      // Dynamic duration based on scroll distance if not specified
      let duration = (enter as Record<string, unknown>).duration as number | undefined;
      if (duration === undefined) {
        const distance = Math.abs(to - from);
        const span = axis === 'scrollLeft' ? viewport.clientWidth : viewport.clientHeight;
        const ratio = span > 0 ? distance / span : 1;
        duration = Math.round(Math.max(150, Math.min(300, 150 + ratio * 110)));
      }

      moveAnimate(
        viewport,
        {
          [axis]: [from, to],
          ease,
          duration,
          onComplete: () => {
            animRef.current = null;
            onComplete?.();
          },
        },
        animRef,
      );
    },
    [cancel],
  );

  useEffect(() => cancel, [cancel]);

  return { animateScroll, cancel };
}

// Legacy alias
export { useCarouselAnimate as useCarouselAnimation };
export type { UseCarouselAnimateOptions as UseCarouselAnimationOptions };
export type { UseCarouselAnimateReturn as UseCarouselAnimationReturn };
