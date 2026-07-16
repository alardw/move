'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useControlledState } from '../../../engine';
import { useCarouselAnimation } from './useCarouselAnimation';
import { prefersReducedMotion } from '../../../animation';
import type { Animation } from '../../../animation';

// =============================================================================
// Types
// =============================================================================

export type CarouselOrientation = 'horizontal' | 'vertical';
export type CarouselAlign = 'start' | 'center' | 'end';

export type CarouselAnimate = { enter?: Animation } | false;

export interface UseCarouselOptions {
  /** Controlled active page (0-indexed). */
  page?: number;
  /** Initial page when uncontrolled. */
  defaultPage?: number;
  /** Called when the active page changes. */
  onPageChange?: (page: number) => void;
  /** Scroll orientation. */
  orientation?: CarouselOrientation;
  /** Snap alignment for slides. */
  align?: CarouselAlign;
  /** Number of slides visible at once. */
  slidesPerView?: number;
  /** Loop back to the start after the last slide. */
  loop?: boolean;
  /** Auto-advance interval in milliseconds. 0 = off. */
  autoplay?: number;
  /** Allow drag/swipe navigation. */
  draggable?: boolean;
  /** Slide transition animation. */
  animations?: CarouselAnimate | false;
}

export interface UseCarouselReturn {
  /** The current page index. */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Whether the carousel can scroll backward. */
  canScrollPrev: boolean;
  /** Whether the carousel can scroll forward. */
  canScrollNext: boolean;
  /** Go to a specific page. */
  scrollToPage: (page: number) => void;
  /** Go to the previous page. */
  scrollPrev: () => void;
  /** Go to the next page. */
  scrollNext: () => void;
  /** Ref to attach to the viewport (scroll container). */
  viewportRef: React.RefObject<HTMLDivElement | null>;
  /** Orientation. */
  orientation: CarouselOrientation;
  /** Align. */
  align: CarouselAlign;
  /** Slides per view. */
  slidesPerView: number;
  /** Loop. */
  loop: boolean;
  /** Draggable. */
  draggable: boolean;
  /** Number of registered slides. */
  slideCount: number;
  /** Register a slide (returns unregister fn). */
  registerSlide: () => () => void;
}

// =============================================================================
// Hook
// =============================================================================

export function useCarousel(options: UseCarouselOptions = {}): UseCarouselReturn {
  const {
    orientation = 'horizontal',
    align = 'start',
    slidesPerView = 1,
    loop = false,
    autoplay = 0,
    draggable = true,
    animations: animationsConfig,
  } = options;

  const [page, setPage] = useControlledState<number>({
    value: options.page,
    defaultValue: options.defaultPage ?? 0,
    onChange: options.onPageChange,
  });

  const [slideCount, setSlideCount] = useState(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef(false);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const { animateScroll, cancel } = useCarouselAnimation({ animations: animationsConfig });

  // Page count based on slides and slidesPerView
  const pageCount = useMemo(() => {
    if (slideCount === 0) return 0;
    return Math.max(1, Math.ceil(slideCount / slidesPerView));
  }, [slideCount, slidesPerView]);

  // Register/unregister slides
  const registerSlide = useCallback(() => {
    setSlideCount((prev) => prev + 1);
    return () => setSlideCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Scroll to a given page index
  const scrollToPage = useCallback(
    (targetPage: number) => {
      const viewport = viewportRef.current;
      if (!viewport || pageCount === 0) return;

      let resolved = targetPage;
      if (loop) {
        resolved = ((targetPage % pageCount) + pageCount) % pageCount;
      } else {
        resolved = Math.max(0, Math.min(targetPage, pageCount - 1));
      }

      const isHorizontal = orientation === 'horizontal';
      const slideElements = Array.from(viewport.children) as HTMLElement[];
      const maxStartIndex = Math.max(0, slideElements.length - slidesPerView);
      const targetIndex = Math.min(resolved * slidesPerView, maxStartIndex);

      if (targetIndex >= slideElements.length) return;

      const targetSlide = slideElements[targetIndex];
      if (!targetSlide) return;

      isScrollingRef.current = true;
      const scrollPos = isHorizontal ? targetSlide.offsetLeft : targetSlide.offsetTop;

      const axis = isHorizontal ? 'scrollLeft' : 'scrollTop';
      const currentPos = isHorizontal ? viewport.scrollLeft : viewport.scrollTop;

      const previousSnapType = viewport.style.scrollSnapType;
      viewport.style.scrollSnapType = 'none';
      animateScroll({
        viewport,
        axis,
        from: currentPos,
        to: scrollPos,
        onComplete: () => {
          viewport.style.scrollSnapType =
            previousSnapType || (isHorizontal ? 'x mandatory' : 'y mandatory');
          isScrollingRef.current = false;
        },
      });

      setPage(resolved);
    },
    [orientation, slidesPerView, pageCount, loop, setPage, animateScroll],
  );

  const scrollPrev = useCallback(() => {
    scrollToPage(page - 1);
  }, [page, scrollToPage]);

  const scrollNext = useCallback(() => {
    scrollToPage(page + 1);
  }, [page, scrollToPage]);

  const canScrollPrev = loop || page > 0;
  const canScrollNext = loop || page < pageCount - 1;

  // Detect page from scroll position (scrollend / scroll)
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const detectPage = () => {
      if (isScrollingRef.current) return;

      const isHorizontal = orientation === 'horizontal';
      const scrollPos = isHorizontal ? viewport.scrollLeft : viewport.scrollTop;
      const slideElements = Array.from(viewport.children) as HTMLElement[];

      if (slideElements.length === 0) return;

      const maxStartIndex = Math.max(0, slideElements.length - slidesPerView);

      let detectedPage = 0;
      let closestPageDist = Infinity;
      for (let p = 0; p < pageCount; p++) {
        const pageStartIndex = Math.min(p * slidesPerView, maxStartIndex);
        const pageSlide = slideElements[pageStartIndex];
        if (!pageSlide) continue;

        const pagePos = isHorizontal ? pageSlide.offsetLeft : pageSlide.offsetTop;
        const pageDist = Math.abs(scrollPos - pagePos);
        if (pageDist < closestPageDist) {
          closestPageDist = pageDist;
          detectedPage = p;
        }
      }

      setPage((prev: number) => (prev !== detectedPage ? detectedPage : prev));
    };

    // Use debounced scroll listener for page detection
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(detectPage, 150);
    };
    viewport.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      viewport.removeEventListener('scroll', onScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [orientation, slidesPerView, pageCount, setPage]);

  // Autoplay — gated by autoplayPaused so hover/focus can suspend AND resume it,
  // and skipped entirely under prefers-reduced-motion (auto-advancing slides are
  // motion the user didn't initiate — WCAG 2.2.2 / 2.3.3).
  useEffect(() => {
    if (autoplay <= 0 || pageCount <= 1 || autoplayPaused || prefersReducedMotion()) return;

    autoplayTimerRef.current = setInterval(() => {
      scrollToPage(loop ? page + 1 : Math.min(page + 1, pageCount - 1));
    }, autoplay);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [autoplay, page, pageCount, loop, scrollToPage, autoplayPaused]);

  // Pause autoplay on hover/focus, RESUME on leave/blur. (Without the resume
  // listeners autoplay died permanently after the first hover.)
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || autoplay <= 0) return;

    const pause = () => setAutoplayPaused(true);
    const resume = () => setAutoplayPaused(false);

    viewport.addEventListener('mouseenter', pause);
    viewport.addEventListener('mouseleave', resume);
    viewport.addEventListener('focusin', pause);
    viewport.addEventListener('focusout', resume);

    return () => {
      viewport.removeEventListener('mouseenter', pause);
      viewport.removeEventListener('mouseleave', resume);
      viewport.removeEventListener('focusin', pause);
      viewport.removeEventListener('focusout', resume);
    };
  }, [autoplay]);

  useEffect(() => cancel, [cancel]);

  // Drag/swipe support
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !draggable) return;

    const isHorizontal = orientation === 'horizontal';
    let startPos = 0;
    let startScroll = 0;
    let isDragging = false;

    const onPointerDown = (e: PointerEvent) => {
      // Only main button
      if (e.button !== 0) return;
      isDragging = true;
      startPos = isHorizontal ? e.clientX : e.clientY;
      startScroll = isHorizontal ? viewport.scrollLeft : viewport.scrollTop;
      viewport.setPointerCapture(e.pointerId);
      viewport.style.scrollSnapType = 'none';
      viewport.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const currentPos = isHorizontal ? e.clientX : e.clientY;
      const delta = startPos - currentPos;
      if (isHorizontal) {
        viewport.scrollLeft = startScroll + delta;
      } else {
        viewport.scrollTop = startScroll + delta;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      viewport.releasePointerCapture(e.pointerId);
      viewport.style.scrollSnapType = '';
      viewport.style.cursor = '';
    };

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerUp);

    return () => {
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', onPointerUp);
    };
  }, [draggable, orientation]);

  return {
    page,
    pageCount,
    canScrollPrev,
    canScrollNext,
    scrollToPage,
    scrollPrev,
    scrollNext,
    viewportRef,
    orientation,
    align,
    slidesPerView,
    loop,
    draggable,
    slideCount,
    registerSlide,
  };
}
