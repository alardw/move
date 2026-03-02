import { useRef, useEffect, useCallback } from 'react';
import { animate, type JSAnimation } from 'animejs';
import { isSpring } from '../../../animation';
import {
  toAnimeParams,
  toInstantParams,
  prefersReducedMotion,
  mergeAnimateConfig,
} from '../../../animation';
import { defaultAnimations, type LifecycleAnimate, type Animation } from '../../../animation';

// =============================================================================
// useCarouselAnimate — for Carousel slide transitions
// =============================================================================

export interface UseCarouselAnimateOptions {
  /** Slide transition config (false = disabled) */
  animate?: LifecycleAnimate | false;
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

export function useCarouselAnimate(
  options: UseCarouselAnimateOptions = {}
): UseCarouselAnimateReturn {
  const { animate: animateProp } = options;
  const animRef = useRef<JSAnimation | null>(null);

  const configRef = useRef<LifecycleAnimate>(defaultAnimations.carousel);
  configRef.current = animateProp === false
    ? {} as LifecycleAnimate
    : mergeAnimateConfig(defaultAnimations.carousel, animateProp);

  const cancel = useCallback(() => {
    if (animRef.current) {
      animRef.current.pause();
      animRef.current = null;
    }
  }, []);

  const animateScroll = useCallback(({
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
    if (!enter) {
      viewport[axis] = to;
      onComplete?.();
      return;
    }

    cancel();

    const resolvedEasing = enter.easing ?? 'outQuart';
    const useDynamicDuration = (
      enter.duration === undefined &&
      resolvedEasing !== 'none' &&
      !isSpring(resolvedEasing)
    );

    let dynamicDuration: number | undefined;
    if (useDynamicDuration) {
      const distance = Math.abs(to - from);
      const span = axis === 'scrollLeft' ? viewport.clientWidth : viewport.clientHeight;
      const ratio = span > 0 ? distance / span : 1;
      dynamicDuration = Math.round(Math.max(150, Math.min(300, 150 + ratio * 110)));
    }

    const transition: Animation = {
      ...enter,
      duration: enter.duration ?? dynamicDuration,
      [axis]: {
        value: [from, to],
        easing: resolvedEasing,
      },
    };

    const params = prefersReducedMotion()
      ? toInstantParams(transition)
      : toAnimeParams(transition);

    animRef.current = animate(viewport, {
      ...params,
      onComplete: () => {
        animRef.current = null;
        onComplete?.();
      },
    });
  }, [cancel]);

  useEffect(() => cancel, [cancel]);

  return { animateScroll, cancel };
}

// Legacy alias
export { useCarouselAnimate as useCarouselAnimation };
export type { UseCarouselAnimateOptions as UseCarouselAnimationOptions };
export type { UseCarouselAnimateReturn as UseCarouselAnimationReturn };
