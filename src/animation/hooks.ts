import { useRef, useEffect, useCallback } from 'react';
import { animate, type JSAnimation } from 'animejs';
import {
  toAnimeParams,
  toInstantParams,
  prefersReducedMotion,
  mergeAnimateConfig,
} from './utils';
import { defaultAnimations, type IndicatorAnimate, type ContentAnimate, type Animation } from './types';

// =============================================================================
// Shared: animateWithCancel
// =============================================================================

const activeAnimations = new WeakMap<HTMLElement, JSAnimation>();

function animateWithCancel(el: HTMLElement, props: Parameters<typeof animate>[1]): JSAnimation {
  const existing = activeAnimations.get(el);
  if (existing) existing.pause();
  const anim = animate(el, props);
  activeAnimations.set(el, anim);
  return anim;
}

// =============================================================================
// useToggleAnimation — for Checkbox, Switch, Radio
// =============================================================================

export interface UseToggleAnimationOptions {
  /** Animation configuration (false to disable) */
  animate?: IndicatorAnimate | false;
  /** Initial checked state (for setting initial styles without animation) */
  initialChecked?: boolean;
  /** Whether the element is disabled */
  disabled?: boolean;
}

export interface UseToggleAnimationReturn {
  /** Ref to attach to the root element (for press animation) */
  rootRef: React.RefObject<HTMLElement | null>;
  /** Ref to attach to the indicator element (for checked/unchecked animation) */
  indicatorRef: React.RefObject<HTMLElement | null>;
  /** Trigger checked animation on the indicator */
  animateChecked: () => void;
  /** Trigger unchecked animation on the indicator */
  animateUnchecked: () => void;
  /** Mouse/keyboard handlers for press animation on root */
  pressHandlers: {
    onMouseDown: () => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
  };
}

export function useToggleAnimation(
  options: UseToggleAnimationOptions = {}
): UseToggleAnimationReturn {
  const { animate: animateProp, initialChecked = false, disabled = false } = options;

  const rootRef = useRef<HTMLElement | null>(null);
  const indicatorRef = useRef<HTMLElement | null>(null);
  const isPressing = useRef(false);
  const hasInitialized = useRef(false);

  // Resolve config
  const configRef = useRef<IndicatorAnimate>(defaultAnimations.indicator);
  configRef.current =
    animateProp === false
      ? { press: false, checked: undefined, unchecked: undefined }
      : mergeAnimateConfig(defaultAnimations.indicator, animateProp);

  // Set initial indicator state (no animation on mount)
  useEffect(() => {
    const el = indicatorRef.current;
    if (!el || hasInitialized.current) return;
    hasInitialized.current = true;

    el.style.opacity = initialChecked ? '1' : '0';
    el.style.transform = initialChecked ? 'scale(1)' : 'scale(0.5)';
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const animateElement = useCallback((el: HTMLElement, animation: Animation) => {
    const params = prefersReducedMotion()
      ? toInstantParams(animation)
      : toAnimeParams(animation);
    animateWithCancel(el, params);
  }, []);

  const resetScale = useCallback((el: HTMLElement) => {
    animateWithCancel(el, {
      scale: 1,
      duration: prefersReducedMotion() ? 0 : 150,
      ease: 'outQuad',
    });
  }, []);

  const animateChecked = useCallback(() => {
    const el = indicatorRef.current;
    if (!el) return;
    const config = configRef.current;
    if (config.checked) animateElement(el, config.checked);
  }, [animateElement]);

  const animateUnchecked = useCallback(() => {
    const el = indicatorRef.current;
    if (!el) return;
    const config = configRef.current;
    if (config.unchecked) animateElement(el, config.unchecked);
  }, [animateElement]);

  const pressHandlers = {
    onMouseDown: () => {
      const root = rootRef.current;
      if (!root || disabled) return;
      const config = configRef.current;
      if (!config.press) return;
      isPressing.current = true;
      animateElement(root, config.press);
    },
    onMouseUp: () => {
      const root = rootRef.current;
      if (!root || !isPressing.current || disabled) return;
      isPressing.current = false;
      resetScale(root);
    },
    onMouseLeave: () => {
      const root = rootRef.current;
      if (!root || !isPressing.current) return;
      isPressing.current = false;
      resetScale(root);
    },
  };

  return {
    rootRef,
    indicatorRef,
    animateChecked,
    animateUnchecked,
    pressHandlers,
  };
}

// =============================================================================
// useExpandAnimation — for Accordion Content, Collapsible
// =============================================================================

export interface UseExpandAnimationOptions {
  /** Animation configuration */
  animate?: ContentAnimate;
  /** Whether this content is entering (opening) */
  isEntering?: boolean;
  /** Whether this content is exiting (closing) */
  isExiting?: boolean;
  /** Callback when enter animation completes */
  onEnterComplete?: () => void;
  /** Callback when exit animation completes */
  onExitComplete?: () => void;
}

export interface UseExpandAnimationReturn {
  /** Ref for the outer content element (height animation) */
  contentRef: React.RefObject<HTMLDivElement | null>;
  /** Ref for the inner content element (opacity animation) */
  innerRef: React.RefObject<HTMLDivElement | null>;
}

// Track content animations per element
const contentAnimations = new WeakMap<HTMLElement, { height?: JSAnimation; opacity?: JSAnimation }>();

export function useExpandAnimation(
  options: UseExpandAnimationOptions = {}
): UseExpandAnimationReturn {
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
