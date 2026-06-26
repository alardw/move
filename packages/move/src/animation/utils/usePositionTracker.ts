import { useRef, useEffect, useCallback } from 'react';
import { animate, spring, type JSAnimation } from 'animejs';
import { prefersReducedMotion } from './helpers';

// =============================================================================
// usePositionTracker — tracks active element position for sliding indicators
// Used by Tabs, Pagination, ToggleGroup
// =============================================================================

const defaultIndicatorSpring = { mass: 1, stiffness: 500, damping: 30, velocity: 0 };

export interface UsePositionTrackerOptions {
  /** Ref to the container element that holds the items and the indicator */
  containerRef: React.RefObject<HTMLElement | null>;
  /** CSS selector for the active element (default: '[data-state="active"], [data-state="on"]') */
  activeSelector?: string;
  /** Which dimensions to track from the active element. Default: 'both'. Use 'width' for horizontal indicators like tab underlines. */
  track?: 'width' | 'height' | 'both';
  /** Disable animation (snap instantly) */
  disabled?: boolean;
}

export interface UsePositionTrackerReturn {
  /** Ref for the indicator element (position: absolute inside the container) */
  indicatorRef: React.RefObject<HTMLDivElement>;
  /** Force-update the indicator position (e.g., after a stagger animation) */
  update: () => void;
}

export function usePositionTracker(
  options: UsePositionTrackerOptions
): UsePositionTrackerReturn {
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

    // Measure in layout coordinates (offsetLeft/Top/Width/Height). Unlike
    // getBoundingClientRect these are unaffected by a CSS transform on an
    // ancestor (e.g. an isometric preview tilt), so the indicator stays aligned
    // inside transformed contexts. Walk the offsetParent chain up to the
    // container so nested positioned wrappers are accounted for.
    let left = 0;
    let top = 0;
    let node: HTMLElement | null = active;
    while (node && node !== container) {
      left += node.offsetLeft;
      top += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    const width = active.offsetWidth;
    const height = active.offsetHeight;

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
  }, [containerRef, activeSelector, disabled, track]);

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

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(container);

    const tabTriggers = container.querySelectorAll<HTMLElement>('[role="tab"]');
    tabTriggers.forEach((node) => resizeObserver.observe(node));

    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    const fonts = (typeof document !== 'undefined' ? (document as Document & { fonts?: FontFaceSet }).fonts : undefined);
    void fonts?.ready.then(update).catch(() => undefined);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [containerRef, update]);

  return { indicatorRef, update };
}

// Legacy alias
export { usePositionTracker as useSlidingIndicator };
export type { UsePositionTrackerOptions as UseSlidingIndicatorOptions };
export type { UsePositionTrackerReturn as UseSlidingIndicatorReturn };
