import { useRef, useEffect } from 'react';
import { animate, type JSAnimation } from 'animejs';
import {
  toAnimeParams,
  prefersReducedMotion,
} from '../utils';
import { defaultAnimations, type ExpandAnimate, type Animation } from '../types';

// =============================================================================
// useExpandAnimate — for Accordion Content, Collapsible
// =============================================================================

export interface UseExpandAnimateOptions {
  /** Animation configuration */
  animate?: ExpandAnimate;
  /** Whether this content is entering (opening) */
  isEntering?: boolean;
  /** Whether this content is exiting (closing) */
  isExiting?: boolean;
  /** Callback when enter animation completes */
  onEnterComplete?: () => void;
  /** Callback when exit animation completes */
  onExitComplete?: () => void;
}

export interface UseExpandAnimateReturn {
  /** Ref for the outer content element (height animation) */
  contentRef: React.RefObject<HTMLDivElement | null>;
  /** Ref for the inner content element (opacity animation) */
  innerRef: React.RefObject<HTMLDivElement | null>;
}

// Track content animations per element
const contentAnimations = new WeakMap<HTMLElement, { height?: JSAnimation; opacity?: JSAnimation }>();

export function useExpandAnimate(
  options: UseExpandAnimateOptions = {}
): UseExpandAnimateReturn {
  const {
    animate: config = defaultAnimations.content,
    isEntering = false,
    isExiting = false,
    onEnterComplete,
    onExitComplete,
  } = options;

  const contentRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  // Enter animation
  useEffect(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content || !inner || !isEntering) return;

    if (!config.open) {
      content.style.height = 'auto';
      inner.style.opacity = '1';
      onEnterComplete?.();
      return;
    }

    const reducedMotion = prefersReducedMotion();
    const anims = contentAnimations.get(content) || {};

    if (anims.height) anims.height.pause();
    if (anims.opacity) anims.opacity.pause();

    if (reducedMotion) {
      content.style.height = 'auto';
      inner.style.opacity = '1';
      onEnterComplete?.();
      return;
    }

    // Set initial state
    content.style.height = '0px';
    inner.style.opacity = '0';

    // Measure target height
    content.style.height = 'auto';
    const targetHeight = content.scrollHeight;
    content.style.height = '0px';

    // Animate height, then opacity
    const openAnim = config.open as Animation;
    const heightParams = toAnimeParams({
      height: openAnim.height,
      easing: openAnim.easing,
      duration: openAnim.duration,
    });

    anims.height = animate(content, {
      height: [0, targetHeight],
      ease: heightParams.ease || 'outQuart',
      duration: heightParams.duration || 300,
      onComplete: () => {
        content.style.height = 'auto';

        const opacityParams = toAnimeParams({
          opacity: openAnim.opacity,
          easing: openAnim.easing,
        });

        anims.opacity = animate(inner, {
          ...opacityParams,
          onComplete: () => {
            onEnterComplete?.();
          },
        });
        contentAnimations.set(content, anims);
      },
    });

    contentAnimations.set(content, anims);
  }, [isEntering]); // eslint-disable-line react-hooks/exhaustive-deps

  // Exit animation
  useEffect(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content || !inner || !isExiting) return;

    if (!config.close) {
      onExitComplete?.();
      return;
    }

    const reducedMotion = prefersReducedMotion();
    const anims = contentAnimations.get(content) || {};

    if (anims.height) anims.height.pause();
    if (anims.opacity) anims.opacity.pause();

    if (reducedMotion) {
      content.style.height = '0px';
      inner.style.opacity = '0';
      onExitComplete?.();
      return;
    }

    const currentHeight = content.scrollHeight;

    // Animate opacity first, then height
    const closeAnim = config.close as Animation;
    const opacityParams = toAnimeParams({
      opacity: closeAnim.opacity,
      easing: closeAnim.easing,
      duration: closeAnim.duration,
    });

    anims.opacity = animate(inner, {
      ...opacityParams,
      onComplete: () => {
        const heightParams = toAnimeParams({
          height: closeAnim.height,
          easing: closeAnim.easing,
          duration: closeAnim.duration,
        });

        anims.height = animate(content, {
          height: [currentHeight, 0],
          ease: heightParams.ease || 'outQuart',
          duration: heightParams.duration || 200,
          onComplete: () => {
            onExitComplete?.();
          },
        });

        contentAnimations.set(content, anims);
      },
    });

    contentAnimations.set(content, anims);
  }, [isExiting]); // eslint-disable-line react-hooks/exhaustive-deps

  // Set initial state on mount
  useEffect(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content || !inner) return;

    const state = content.getAttribute('data-state');
    if (state === 'closed') {
      content.style.height = '0px';
      inner.style.opacity = '0';
    }
  }, []);

  return { contentRef, innerRef };
}

// Legacy alias
export { useExpandAnimate as useExpandAnimation };
export type { UseExpandAnimateOptions as UseExpandAnimationOptions };
export type { UseExpandAnimateReturn as UseExpandAnimationReturn };
