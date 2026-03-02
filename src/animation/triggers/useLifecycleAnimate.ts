import { useRef, useEffect, useLayoutEffect } from 'react';
import { animate, spring, type JSAnimation } from 'animejs';
import {
  toAnimeParams,
  prefersReducedMotion,
} from '../utils';
import { defaultAnimations, type LifecycleAnimate, type StaggerModifier } from '../types';

// =============================================================================
// useLifecycleAnimate — unified enter/exit animation hook
//
// Handles all lifecycle patterns:
//   Alert/Toast:   single element, inline enter/exit
//   Dropdown:      content + stagger children, height animation
//   Dialog:        content + overlay/backdrop
// =============================================================================

const defaultStaggerSpring = { mass: 0.6, stiffness: 400, damping: 20, velocity: 0 };

export interface UseLifecycleAnimateOptions {
  /** Animation config (null/false = disabled) */
  animate?: LifecycleAnimate | false | null;

  /** Whether the element is closing (triggers exit animation) */
  isClosing?: boolean;
  /** Called when exit animation completes */
  onCloseComplete?: () => void;
  /** Called when enter animation completes */
  onOpenComplete?: () => void;

  /** Overlay/backdrop lifecycle (e.g., Dialog backdrop). Defaults to layerBackdrop preset when overlayRef is used. */
  overlayAnimate?: LifecycleAnimate | null;

  /** Stagger children on enter/exit */
  stagger?: {
    /** CSS selector for items to stagger */
    selector: string;
    /** Stagger config */
    config?: StaggerModifier;
  };

  /** Animate height from 0 to measured (popup pattern). Default: false. */
  animateHeight?: boolean;
  /** Called after measuring but before enter animation starts */
  onBeforeEnter?: (content: HTMLDivElement, inner: HTMLDivElement | null) => void;
}

export interface UseLifecycleAnimateReturn {
  /** Primary animated element ref */
  contentRef: React.RefObject<HTMLDivElement>;
  /** Secondary animated element ref (overlay/backdrop) */
  overlayRef: React.RefObject<HTMLDivElement>;
  /** Inner container ref (for stagger children) */
  innerRef: React.RefObject<HTMLDivElement>;
}

export function useLifecycleAnimate(
  options: UseLifecycleAnimateOptions = {}
): UseLifecycleAnimateReturn {
  const {
    animate: animateProp,
    isClosing = false,
    onCloseComplete,
    onOpenComplete,
    overlayAnimate: overlayAnimateProp,
    stagger,
    animateHeight = false,
    onBeforeEnter,
  } = options;

  const config = animateProp === false ? null : (animateProp ?? null);
  const overlayConfig = overlayAnimateProp !== undefined ? overlayAnimateProp : null;

  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const contentAnimRef = useRef<JSAnimation | null>(null);
  const overlayAnimRef = useRef<JSAnimation | null>(null);
  const itemsAnimRef = useRef<JSAnimation | null>(null);
  const isAnimatingOutRef = useRef(false);

  // =========================================================================
  // Enter animation
  // =========================================================================
  useLayoutEffect(() => {
    const content = contentRef.current;
    const overlay = overlayRef.current;
    const inner = innerRef.current;
    if (!content) return;

    const reduced = prefersReducedMotion();

    // Disabled or reduced motion → instant
    if (!config || reduced) {
      if (animateHeight) content.style.height = 'auto';
      content.style.opacity = '1';
      content.style.transform = '';
      if (overlay) overlay.style.opacity = '1';
      onOpenComplete?.();
      return;
    }

    // Cancel any in-flight animations
    if (contentAnimRef.current) contentAnimRef.current.pause();
    if (overlayAnimRef.current) overlayAnimRef.current.pause();
    if (itemsAnimRef.current) itemsAnimRef.current.pause();

    // --- Content enter ---
    if (animateHeight) {
      // Popup pattern: measure height, animate from 0 with scale
      content.style.height = 'auto';
      const targetHeight = content.offsetHeight;
      onBeforeEnter?.(content, inner);

      content.style.height = '0px';
      content.style.opacity = '1';
      content.style.transform = 'scale(0.5)';

      contentAnimRef.current = animate(content, {
        height: targetHeight,
        scale: 1,
        ease: 'outQuart',
        duration: 250,
        onComplete: () => {
          if (content) content.style.height = 'auto';
          onOpenComplete?.();
        },
      });
    } else if (config.enter) {
      // Config-driven enter (layer/presence pattern)
      const params = toAnimeParams(config.enter);
      contentAnimRef.current = animate(content, {
        ...params,
        onComplete: () => {
          onOpenComplete?.();
        },
      });
    } else {
      onOpenComplete?.();
    }

    // --- Overlay enter ---
    if (overlay) {
      const oConfig = overlayConfig ?? defaultAnimations.layerBackdrop;
      if (oConfig?.enter) {
        const params = toAnimeParams(oConfig.enter);
        overlayAnimRef.current = animate(overlay, params);
      } else {
        overlay.style.opacity = '1';
      }
    }

    // --- Stagger children enter ---
    if (stagger && inner) {
      const items = inner.querySelectorAll(stagger.selector);
      items.forEach((item) => {
        (item as HTMLElement).style.opacity = '0';
        (item as HTMLElement).style.transform = 'scale(0.8)';
      });

      const staggerDelay = stagger.config?.stagger?.delay ?? 30;
      itemsAnimRef.current = animate(items, {
        opacity: 1,
        scale: 1,
        ease: spring(defaultStaggerSpring),
        delay: (_el: any, i: number) => i * staggerDelay,
      });
    }
  }, [config]); // eslint-disable-line react-hooks/exhaustive-deps

  // =========================================================================
  // Exit animation (triggered by isClosing)
  // =========================================================================
  useEffect(() => {
    if (!isClosing || isAnimatingOutRef.current) return;
    isAnimatingOutRef.current = true;

    const content = contentRef.current;
    const overlay = overlayRef.current;
    const inner = innerRef.current;

    if (!content) {
      isAnimatingOutRef.current = false;
      onCloseComplete?.();
      return;
    }

    if (!config || prefersReducedMotion()) {
      isAnimatingOutRef.current = false;
      onCloseComplete?.();
      return;
    }

    // Cancel in-flight
    if (contentAnimRef.current) contentAnimRef.current.pause();
    if (overlayAnimRef.current) overlayAnimRef.current.pause();
    if (itemsAnimRef.current) itemsAnimRef.current.pause();

    // --- Stagger children exit (reverse) ---
    if (stagger && inner) {
      const items = inner.querySelectorAll(stagger.selector);
      const itemCount = items.length;
      itemsAnimRef.current = animate(items, {
        opacity: 0,
        scale: 0.8,
        ease: 'outQuart',
        duration: 150,
        delay: (_el: any, i: number) => (itemCount - 1 - i) * 20,
      });
    }

    // --- Content exit ---
    if (animateHeight) {
      // Popup pattern: animate height to 0 with fade
      content.style.height = `${content.offsetHeight}px`;

      contentAnimRef.current = animate(content, {
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        ease: 'outQuart',
        duration: 200,
        delay: 50,
        onComplete: () => {
          isAnimatingOutRef.current = false;
          onCloseComplete?.();
        },
      });

      animate(content, {
        opacity: 0,
        ease: 'outQuart',
        duration: 100,
        delay: 150,
      });
    } else if (config.exit) {
      // Config-driven exit (layer/presence pattern)
      const params = toAnimeParams(config.exit);
      contentAnimRef.current = animate(content, {
        ...params,
        onComplete: () => {
          isAnimatingOutRef.current = false;
          onCloseComplete?.();
        },
      });
    } else {
      isAnimatingOutRef.current = false;
      onCloseComplete?.();
    }

    // --- Overlay exit (fire-and-forget, content drives completion) ---
    if (overlay) {
      const oConfig = overlayConfig ?? defaultAnimations.layerBackdrop;
      if (oConfig?.exit) {
        const params = toAnimeParams(oConfig.exit);
        overlayAnimRef.current = animate(overlay, params);
      }
    }
  }, [isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

  return { contentRef, overlayRef, innerRef };
}
