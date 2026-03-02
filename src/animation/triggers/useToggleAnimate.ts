import { useRef, useEffect, useCallback } from 'react';
import {
  toAnimeParams,
  toInstantParams,
  prefersReducedMotion,
  mergeAnimateConfig,
} from '../utils';
import { defaultAnimations, type ToggleAnimate, type InteractionAnimate, type Animation } from '../types';
import { animateWithCancel } from './_animateWithCancel';

// =============================================================================
// useToggleAnimate — for Checkbox, Switch, Radio
// =============================================================================

export interface UseToggleAnimateOptions {
  /** Animation configuration (false to disable) */
  animate?: (ToggleAnimate & InteractionAnimate) | false;
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

export interface UseToggleAnimateReturn {
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

export function useToggleAnimate(
  options: UseToggleAnimateOptions = {}
): UseToggleAnimateReturn {
  const { animate: animateProp, initialChecked = false, disabled = false } = options;

  const rootRef = useRef<HTMLElement | null>(null);
  const indicatorRef = useRef<HTMLElement | null>(null);
  const isPressing = useRef(false);
  const hasInitialized = useRef(false);

  // Resolve config
  const configRef = useRef<ToggleAnimate & InteractionAnimate>(defaultAnimations.indicator);
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

// Legacy alias
export { useToggleAnimate as useToggleAnimation };
export type { UseToggleAnimateOptions as UseToggleAnimationOptions };
export type { UseToggleAnimateReturn as UseToggleAnimationReturn };
