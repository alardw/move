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
  /**
   * Which axis the indicator lives on. Default: 'both'.
   *
   * This governs BOTH the dimension copied from the active element and the
   * direction the indicator travels — a horizontal indicator ('width', a tab
   * underline) slides in x and is pinned in y by CSS; a vertical one
   * ('height', a TOC or sub-nav rail) slides in y and is pinned in x. Moving
   * the pinned axis as well fights the CSS that placed it: a rail whose items
   * carry a left margin gets pushed off its own line, and a tab underline
   * would drop a row the moment the list wraps.
   */
  track?: 'width' | 'height' | 'both';
  /** Disable animation (snap instantly) */
  disabled?: boolean;
  /**
   * Whether there is anything to measure yet. Default: true.
   *
   * A container that renders nothing until it opens — a collapsed panel — is
   * absent when the hook first runs, and an effect with stable deps never
   * looks again: no measurement, and no observers for later changes either.
   * Passing the panel's open state here re-runs the setup once the container
   * has actually mounted.
   */
  enabled?: boolean;
}

export interface UsePositionTrackerReturn {
  /** Ref for the indicator element (position: absolute inside the container) */
  indicatorRef: React.RefObject<HTMLDivElement>;
  /** Force-update the indicator position (e.g., after a stagger animation) */
  update: () => void;
}

export function usePositionTracker(options: UsePositionTrackerOptions): UsePositionTrackerReturn {
  const {
    containerRef,
    activeSelector = '[data-state="active"], [data-state="on"]',
    track = 'both',
    disabled = false,
    enabled = true,
  } = options;

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

    const horizontal = track === 'width' || track === 'both';
    const vertical = track === 'height' || track === 'both';

    indicator.style.opacity = '1';
    if (horizontal) indicator.style.width = `${width}px`;
    if (vertical) indicator.style.height = `${height}px`;

    // Only the axis the indicator travels on. The other one belongs to CSS,
    // which has already pinned it (`bottom: 0` for an underline, `left: -2px`
    // for a rail) — writing a transform there would move it off that pin.
    const position = {
      ...(horizontal ? { translateX: left } : {}),
      ...(vertical ? { translateY: top } : {}),
    };

    if (isFirstRun.current || disabled || prefersReducedMotion()) {
      isFirstRun.current = false;
      if (animRef.current) animRef.current.pause();
      // Use anime.js for initial snap so it tracks values consistently
      animate(indicator, { ...position, duration: 0 });
      return;
    }

    if (animRef.current) animRef.current.pause();
    animRef.current = animate(indicator, {
      ...position,
      ...(horizontal ? { width } : {}),
      ...(vertical ? { height } : {}),
      ease: spring(defaultIndicatorSpring),
    });
  }, [containerRef, activeSelector, disabled, track]);

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    update();

    // `data-state` is how Radix-backed items (Tabs, ToggleGroup) say which one
    // is active; `data-active` is how route-driven ones do (a sidebar sub-nav,
    // where the router re-renders the attribute rather than toggling state).
    // Watching only the first left the second re-measuring by hand at the call
    // site, once per navigation.
    const observer = new MutationObserver(update);
    observer.observe(container, {
      attributes: true,
      attributeFilter: ['data-state', 'data-active'],
      subtree: true,
    });

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(container);

    const tabTriggers = container.querySelectorAll<HTMLElement>('[role="tab"]');
    tabTriggers.forEach((node) => resizeObserver.observe(node));

    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    const fonts =
      typeof document !== 'undefined'
        ? (document as Document & { fonts?: FontFaceSet }).fonts
        : undefined;
    void fonts?.ready.then(update).catch(() => undefined);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [containerRef, update, enabled]);

  return { indicatorRef, update };
}

// Legacy alias
export { usePositionTracker as useSlidingIndicator };
export type { UsePositionTrackerOptions as UseSlidingIndicatorOptions };
export type { UsePositionTrackerReturn as UseSlidingIndicatorReturn };
