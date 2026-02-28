import { useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { animate, spring, type JSAnimation } from 'animejs';
import { isSpring } from './springs';
import {
  toAnimeParams,
  toInstantParams,
  prefersReducedMotion,
  mergeAnimateConfig,
} from './utils';
import { defaultAnimations, type IndicatorAnimate, type ContentAnimate, type PopupAnimate, type LayerAnimate, type CarouselAnimate, type Animation } from './types';

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
  /**
   * Element to observe for data-state changes (auto-triggers animateChecked/animateUnchecked).
   * Useful for Radix-driven components (RadioGroup, Switch) where state changes externally.
   */
  watchRef?: React.RefObject<HTMLElement | null>;
  /** data-state value that means "checked" (default: 'checked') */
  checkedValue?: string;
  /**
   * Called once on mount with the indicator element. Return initial styles and
   * dynamic checked/unchecked animations (e.g., for Switch's computed translateX).
   * When provided, replaces the default opacity+scale initial styles.
   */
  onSetup?: (indicatorEl: HTMLElement) => {
    initialStyle: Record<string, string>;
    checked: Animation;
    unchecked: Animation;
  };
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

  // Dynamic animations from onSetup (for components like Switch with computed values)
  const dynamicAnimRef = useRef<{ checked: Animation; unchecked: Animation } | null>(null);

  // Set initial indicator state (no animation on mount)
  useEffect(() => {
    const el = indicatorRef.current;
    if (!el || hasInitialized.current) return;
    hasInitialized.current = true;

    if (options.onSetup) {
      const result = options.onSetup(el);
      Object.entries(result.initialStyle).forEach(([k, v]) => {
        (el.style as any)[k] = v;
      });
      dynamicAnimRef.current = { checked: result.checked, unchecked: result.unchecked };
    } else {
      el.style.opacity = initialChecked ? '1' : '0';
      el.style.transform = initialChecked ? 'scale(1)' : 'scale(0.5)';
    }
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
    const anim = dynamicAnimRef.current?.checked ?? configRef.current.checked;
    if (anim) animateElement(el, anim);
  }, [animateElement]);

  const animateUnchecked = useCallback(() => {
    const el = indicatorRef.current;
    if (!el) return;
    const anim = dynamicAnimRef.current?.unchecked ?? configRef.current.unchecked;
    if (anim) animateElement(el, anim);
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

  // Auto-trigger from data-state changes via MutationObserver
  const { watchRef, checkedValue = 'checked' } = options;
  const watchTarget = watchRef ?? rootRef;
  const wasCheckedRef = useRef(initialChecked);

  useEffect(() => {
    const el = watchTarget?.current;
    if (!el) return;

    wasCheckedRef.current = el.getAttribute('data-state') === checkedValue;

    const observer = new MutationObserver(() => {
      const isNowChecked = el.getAttribute('data-state') === checkedValue;
      if (isNowChecked === wasCheckedRef.current) return;
      wasCheckedRef.current = isNowChecked;

      if (isNowChecked) {
        animateChecked();
      } else {
        animateUnchecked();
      }
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-state'] });
    return () => observer.disconnect();
  }, [watchTarget, checkedValue, animateChecked, animateUnchecked]);

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

// =============================================================================
// useSlidingIndicator — for Tabs, Pagination, ToggleGroup
// =============================================================================

const defaultIndicatorSpring = { mass: 1, stiffness: 500, damping: 30, velocity: 0 };

export interface UseSlidingIndicatorOptions {
  /** Ref to the container element that holds the items and the indicator */
  containerRef: React.RefObject<HTMLElement | null>;
  /** CSS selector for the active element (default: '[data-state="active"], [data-state="on"]') */
  activeSelector?: string;
  /** Which dimensions to track from the active element. Default: 'both'. Use 'width' for horizontal indicators like tab underlines. */
  track?: 'width' | 'height' | 'both';
  /** Disable animation (snap instantly) */
  disabled?: boolean;
}

export interface UseSlidingIndicatorReturn {
  /** Ref for the indicator element (position: absolute inside the container) */
  indicatorRef: React.RefObject<HTMLDivElement>;
  /** Force-update the indicator position (e.g., after a stagger animation) */
  update: () => void;
}

export function useSlidingIndicator(
  options: UseSlidingIndicatorOptions
): UseSlidingIndicatorReturn {
  const { containerRef, activeSelector = '[data-state="active"], [data-state="on"]', track = 'both', disabled = false } = options;

  const indicatorRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);
  const animRef = useRef<JSAnimation | null>(null);

  const update = useCallback(() => {
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return;

    const active = container.querySelector<HTMLElement>(activeSelector);
    if (!active) {
      indicator.style.opacity = '0';
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const left = activeRect.left - containerRect.left + container.scrollLeft;
    const top = activeRect.top - containerRect.top + container.scrollTop;
    const width = activeRect.width;
    const height = activeRect.height;

    indicator.style.opacity = '1';
    if (track === 'width' || track === 'both') indicator.style.width = `${width}px`;
    if (track === 'height' || track === 'both') indicator.style.height = `${height}px`;

    if (isFirstRun.current || disabled || prefersReducedMotion()) {
      isFirstRun.current = false;
      if (animRef.current) animRef.current.pause();
      // Use anime.js for initial snap so it tracks values consistently
      animate(indicator, { translateX: left, translateY: top, duration: 0 });
      return;
    }

    if (animRef.current) animRef.current.pause();
    animRef.current = animate(indicator, {
      translateX: left,
      translateY: top,
      ...(track === 'width' || track === 'both' ? { width } : {}),
      ...(track === 'height' || track === 'both' ? { height } : {}),
      ease: spring(defaultIndicatorSpring),
    });
  }, [containerRef, activeSelector, disabled]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    update();

    const observer = new MutationObserver(update);
    observer.observe(container, {
      attributes: true,
      attributeFilter: ['data-state'],
      subtree: true,
    });

    return () => observer.disconnect();
  }, [containerRef, update]);

  return { indicatorRef, update };
}

// =============================================================================
// useCarouselAnimation — for Carousel slide transitions
// =============================================================================

export interface UseCarouselAnimationOptions {
  /** Slide transition config (false = disabled) */
  animate?: CarouselAnimate | false;
}

export interface UseCarouselAnimationReturn {
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

export function useCarouselAnimation(
  options: UseCarouselAnimationOptions = {}
): UseCarouselAnimationReturn {
  const { animate: animateProp } = options;
  const animRef = useRef<JSAnimation | null>(null);

  const configRef = useRef<CarouselAnimate>(defaultAnimations.carousel);
  configRef.current = animateProp === false
    ? {} as CarouselAnimate
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

// =============================================================================
// usePopupAnimation — for Dropdown, Select, Popover, DatePicker, TimeField
// =============================================================================

const defaultPopupSpring = { mass: 0.6, stiffness: 400, damping: 20, velocity: 0 };

export interface UsePopupAnimationOptions {
  /** Resolved animation config (null = disabled) */
  animate: PopupAnimate | null;
  /** Whether the popup is in closing state */
  isClosing: boolean;
  /** Called when close animation completes */
  onCloseComplete: () => void;
  /** Called when open animation completes (e.g., for focus management) */
  onOpenComplete?: () => void;
  /** Called after measuring but before enter animation starts (e.g., for pre-scroll) */
  onBeforeEnter?: (content: HTMLDivElement, inner: HTMLDivElement | null) => void;
  /** CSS selector for items to stagger (null = no stagger) */
  itemSelector?: string;
  /** Whether to animate height from 0 to measured (default: true) */
  animateHeight?: boolean;
}

export interface UsePopupAnimationReturn {
  /** Ref for the outer content element (height + scale animation) */
  contentRef: React.RefObject<HTMLDivElement>;
  /** Ref for the inner wrapper element (stagger target container) */
  innerRef: React.RefObject<HTMLDivElement>;
}

export function usePopupAnimation(
  options: UsePopupAnimationOptions
): UsePopupAnimationReturn {
  const {
    animate: config,
    isClosing,
    onCloseComplete,
    onOpenComplete,
    onBeforeEnter,
    itemSelector,
    animateHeight = true,
  } = options;

  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<JSAnimation | null>(null);
  const itemsAnimRef = useRef<JSAnimation | null>(null);
  const isAnimatingOutRef = useRef(false);

  // Enter animation
  useLayoutEffect(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content) return;

    if (!config || prefersReducedMotion()) {
      if (animateHeight) content.style.height = 'auto';
      content.style.opacity = '1';
      content.style.transform = '';
      onOpenComplete?.();
      return;
    }

    if (animRef.current) animRef.current.pause();
    if (itemsAnimRef.current) itemsAnimRef.current.pause();

    if (animateHeight) {
      // Measure the natural constrained height
      content.style.height = 'auto';
      const targetHeight = content.offsetHeight;
      onBeforeEnter?.(content, inner);

      content.style.height = '0px';
      content.style.opacity = '1';
      content.style.transform = 'scale(0.5)';

      animRef.current = animate(content, {
        height: targetHeight,
        scale: 1,
        ease: 'outQuart',
        duration: 250,
        onComplete: () => {
          if (content) content.style.height = 'auto';
          onOpenComplete?.();
        },
      });
    } else {
      content.style.opacity = '0';
      content.style.transform = 'scale(0.5)';

      animRef.current = animate(content, {
        opacity: 1,
        scale: 1,
        ease: 'outQuart',
        duration: 250,
        onComplete: () => {
          if (content) {
            content.style.removeProperty('opacity');
            content.style.removeProperty('transform');
          }
          onOpenComplete?.();
        },
      });
    }

    // Stagger items
    if (itemSelector && inner) {
      const items = inner.querySelectorAll(itemSelector);
      items.forEach((item) => {
        (item as HTMLElement).style.opacity = '0';
        (item as HTMLElement).style.transform = 'scale(0.8)';
      });

      const staggerDelay = config.stagger?.delay ?? 30;
      itemsAnimRef.current = animate(items, {
        opacity: 1,
        scale: 1,
        ease: spring(defaultPopupSpring),
        delay: (_el: any, i: number) => i * staggerDelay,
      });
    }
  }, [config]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close animation — triggered when isClosing becomes true
  useEffect(() => {
    if (!isClosing || isAnimatingOutRef.current) return;
    isAnimatingOutRef.current = true;

    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content) {
      isAnimatingOutRef.current = false;
      onCloseComplete();
      return;
    }

    if (!config || prefersReducedMotion()) {
      isAnimatingOutRef.current = false;
      onCloseComplete();
      return;
    }

    if (animRef.current) animRef.current.pause();
    if (itemsAnimRef.current) itemsAnimRef.current.pause();

    if (animateHeight) {
      content.style.height = `${content.offsetHeight}px`;

      // Reverse stagger items
      if (itemSelector && inner) {
        const items = inner.querySelectorAll(itemSelector);
        const itemCount = items.length;
        itemsAnimRef.current = animate(items, {
          opacity: 0,
          scale: 0.8,
          ease: 'outQuart',
          duration: 150,
          delay: (_el: any, i: number) => (itemCount - 1 - i) * 20,
        });
      }

      animRef.current = animate(content, {
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        ease: 'outQuart',
        duration: 200,
        delay: 50,
        onComplete: () => {
          isAnimatingOutRef.current = false;
          onCloseComplete();
        },
      });

      animate(content, {
        opacity: 0,
        ease: 'outQuart',
        duration: 100,
        delay: 150,
      });
    } else {
      animRef.current = animate(content, {
        opacity: 0,
        scale: 0.95,
        ease: 'outQuart',
        duration: 200,
        onComplete: () => {
          isAnimatingOutRef.current = false;
          onCloseComplete();
        },
      });
    }
  }, [isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

  return { contentRef, innerRef };
}

// =============================================================================
// useLayerAnimation — Dialog, AlertDialog, Sidebar, Sheet
// =============================================================================

export interface UseLayerAnimationOptions {
  /** Content animation config (null = instant) */
  animate: LayerAnimate | null;
  /** Overlay/backdrop animation config (null = follows content) */
  overlayAnimate?: LayerAnimate | null;
  /** Whether the layer is closing (triggers exit animation) */
  isClosing: boolean;
  /** Called when close animation finishes */
  onCloseComplete: () => void;
}

export interface UseLayerAnimationReturn {
  contentRef: React.RefObject<HTMLDivElement>;
  overlayRef: React.RefObject<HTMLDivElement>;
}

export function useLayerAnimation({
  animate: animateProp,
  overlayAnimate: overlayAnimateProp,
  isClosing,
  onCloseComplete,
}: UseLayerAnimationOptions): UseLayerAnimationReturn {
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentAnimRef = useRef<JSAnimation | null>(null);
  const overlayAnimRef = useRef<JSAnimation | null>(null);
  const isAnimatingOutRef = useRef(false);

  const config = animateProp ?? null;
  const overlayConfig = overlayAnimateProp !== undefined ? overlayAnimateProp : defaultAnimations.layerBackdrop;

  // Enter animation
  useLayoutEffect(() => {
    const content = contentRef.current;
    const overlay = overlayRef.current;

    if (!content) return;

    if (!config || prefersReducedMotion()) {
      content.style.opacity = '1';
      content.style.transform = '';
      if (overlay) overlay.style.opacity = '1';
      return;
    }

    // Animate content
    if (config.enter) {
      const params = toAnimeParams(config.enter);
      contentAnimRef.current = animate(content, params);
    }

    // Animate overlay
    if (overlay && overlayConfig?.enter) {
      const params = toAnimeParams(overlayConfig.enter);
      overlayAnimRef.current = animate(overlay, params);
    }
  }, [config]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close animation
  useEffect(() => {
    if (!isClosing || isAnimatingOutRef.current) return;
    isAnimatingOutRef.current = true;

    const content = contentRef.current;
    const overlay = overlayRef.current;

    if (!content) {
      isAnimatingOutRef.current = false;
      onCloseComplete();
      return;
    }

    if (!config || prefersReducedMotion()) {
      isAnimatingOutRef.current = false;
      onCloseComplete();
      return;
    }

    if (contentAnimRef.current) contentAnimRef.current.pause();
    if (overlayAnimRef.current) overlayAnimRef.current.pause();

    // Animate content exit
    if (config.exit) {
      const params = toAnimeParams(config.exit);
      contentAnimRef.current = animate(content, {
        ...params,
        onComplete: () => {
          isAnimatingOutRef.current = false;
          onCloseComplete();
        },
      });
    } else {
      isAnimatingOutRef.current = false;
      onCloseComplete();
    }

    // Animate overlay exit (fire-and-forget, content drives completion)
    if (overlay && overlayConfig?.exit) {
      const params = toAnimeParams(overlayConfig.exit);
      overlayAnimRef.current = animate(overlay, params);
    }
  }, [isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

  return { contentRef, overlayRef };
}
