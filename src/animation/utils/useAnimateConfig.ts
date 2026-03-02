import { useRef, useCallback, useEffect } from 'react';
import { animate as animeAnimate, type JSAnimation } from 'animejs';
import { usePresence } from '../presence/PresenceContext';
import { toAnimeParams, toInstantParams, prefersReducedMotion } from './helpers';
import type { Animation, AnimateConfig } from '../types';

export interface UseAnimateConfigOptions<T extends Partial<AnimateConfig>> {
  /** Animation configuration */
  animate?: T;
  /** Default animation configuration (merged under animate) */
  defaults?: T;
  /** Disable all animations */
  disabled?: boolean;
}

export interface UseAnimateConfigReturn {
  /** Ref to attach to the animated element */
  ref: React.RefObject<HTMLElement | null>;
  /** Whether element is present (for Presence integration) */
  isPresent: boolean;
  /** Trigger a specific animation state */
  trigger: (state: keyof AnimateConfig) => JSAnimation | undefined;
  /** Get animation config for a state (resolved with defaults) */
  getAnimation: (state: keyof AnimateConfig) => Animation | false | undefined;
}

/**
 * Hook for applying animation configurations to elements
 */
export function useAnimateConfig<T extends Partial<AnimateConfig>>(
  options: UseAnimateConfigOptions<T> = {}
): UseAnimateConfigReturn {
  const { animate, defaults, disabled = false } = options;

  const ref = useRef<HTMLElement | null>(null);
  const animationRef = useRef<JSAnimation | null>(null);
  const [isPresent, safeToRemove] = usePresence();
  const hasAnimatedEnter = useRef(false);
  const hasAnimatedExit = useRef(false);

  // Store config in ref to avoid dependency issues
  const configRef = useRef<Partial<AnimateConfig>>({});
  configRef.current = { ...defaults, ...animate };

  const getAnimation = useCallback(
    (state: keyof AnimateConfig): Animation | false | undefined => {
      const value = configRef.current[state];
      if (value === false) return false;
      if (value === undefined) return undefined;
      // Skip non-object values (like easing string)
      if (typeof value !== 'object') return undefined;
      // Skip stagger config (has 'from' property)
      if ('from' in value) return undefined;
      return value as Animation;
    },
    []
  );

  const trigger = useCallback(
    (state: keyof AnimateConfig): JSAnimation | undefined => {
      if (disabled || !ref.current) return undefined;

      const animation = getAnimation(state);
      if (!animation) return undefined;

      // Cancel previous animation
      if (animationRef.current) {
        animationRef.current.pause();
      }

      // Use instant animation if user prefers reduced motion
      const params = prefersReducedMotion()
        ? toInstantParams(animation)
        : toAnimeParams(animation);

      const instance = animeAnimate(ref.current, params);
      animationRef.current = instance;

      return instance;
    },
    [disabled, getAnimation]
  );

  // Auto-trigger enter animation on mount
  useEffect(() => {
    if (disabled || hasAnimatedEnter.current) return;

    const enterAnim = getAnimation('enter');
    if (enterAnim && ref.current) {
      hasAnimatedEnter.current = true;
      trigger('enter');
    }
  }, [disabled, getAnimation, trigger]);

  // Auto-trigger exit animation when removed from Presence
  useEffect(() => {
    if (disabled || isPresent || hasAnimatedExit.current) return;

    hasAnimatedExit.current = true;
    const exitAnim = getAnimation('exit');

    if (exitAnim && ref.current) {
      const anim = trigger('exit');
      if (anim) {
        anim.then(() => safeToRemove());
      } else {
        safeToRemove();
      }
    } else {
      safeToRemove();
    }
  }, [disabled, isPresent, getAnimation, trigger, safeToRemove]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, []);

  return {
    ref,
    isPresent,
    trigger,
    getAnimation,
  };
}

/**
 * Hook for interactive elements (hover, press)
 */
export function useInteractiveAnimate<T extends Partial<AnimateConfig>>(
  options: UseAnimateConfigOptions<T> = {}
) {
  const { ref, trigger, getAnimation, isPresent } = useAnimateConfig(options);
  const isHovered = useRef(false);
  const isPressed = useRef(false);
  const configRef = useRef<Partial<AnimateConfig>>({});
  configRef.current = { ...options.defaults, ...options.animate };

  const animateToNeutral = useCallback(
    (fromAnimation: Animation) => {
      if (!ref.current) return;

      const neutralProps: Record<string, number> = {};
      if ('scale' in fromAnimation) neutralProps.scale = 1;
      if ('x' in fromAnimation) neutralProps.x = 0;
      if ('y' in fromAnimation) neutralProps.y = 0;
      if ('rotate' in fromAnimation) neutralProps.rotate = 0;

      if (Object.keys(neutralProps).length > 0) {
        // Use the same easing as the original animation
        const animation: Animation = {
          ...neutralProps,
          easing: fromAnimation.easing,
        };
        const params = prefersReducedMotion()
          ? toInstantParams(animation)
          : toAnimeParams(animation);
        animeAnimate(ref.current, params);
      }
    },
    [ref]
  );

  const onMouseEnter = useCallback(() => {
    if (getAnimation('hover') === false) return;
    isHovered.current = true;
    trigger('hover');
  }, [trigger, getAnimation]);

  const onMouseLeave = useCallback(() => {
    if (getAnimation('hover') === false) return;
    isHovered.current = false;
    if (!isPressed.current) {
      const hoverAnim = getAnimation('hover');
      if (hoverAnim) {
        animateToNeutral(hoverAnim);
      }
    }
  }, [getAnimation, animateToNeutral]);

  const onMouseDown = useCallback(() => {
    if (getAnimation('press') === false) return;
    isPressed.current = true;
    trigger('press');
  }, [trigger, getAnimation]);

  const onMouseUp = useCallback(() => {
    if (getAnimation('press') === false) return;
    isPressed.current = false;
    if (isHovered.current && getAnimation('hover') !== false) {
      trigger('hover');
    } else {
      const pressAnim = getAnimation('press');
      if (pressAnim) {
        animateToNeutral(pressAnim);
      }
    }
  }, [trigger, getAnimation, animateToNeutral]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onMouseDown();
      }
    },
    [onMouseDown]
  );

  const onKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onMouseUp();
      }
    },
    [onMouseUp]
  );

  return {
    ref,
    isPresent,
    trigger,
    getAnimation,
    handlers: {
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onKeyDown,
      onKeyUp,
    },
  };
}

/** Alias — 1:1 with InteractionAnimate trigger type */
export const useInteractionAnimate = useInteractiveAnimate;
