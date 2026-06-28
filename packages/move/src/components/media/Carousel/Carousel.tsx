'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useResolvedIcon } from '../../../infrastructure/Icon';
import { useCarousel } from './useCarousel';
import type { UseCarouselOptions, CarouselOrientation, CarouselAlign, CarouselAnimate } from './useCarousel';
import styles from './Carousel.module.css';

// =============================================================================
// Context
// =============================================================================

interface CarouselContextValue {
  page: number;
  pageCount: number;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollToPage: (page: number) => void;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  orientation: CarouselOrientation;
  align: CarouselAlign;
  slidesPerView: number;
  loop: boolean;
  draggable: boolean;
  registerSlide: () => () => void;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarouselContext() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error('Carousel compound components must be used within Carousel.Root');
  return ctx;
}

// =============================================================================
// Root
// =============================================================================

export interface CarouselRootProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Scroll orientation. */
  orientation?: CarouselOrientation;
  /** Snap alignment. */
  align?: CarouselAlign;
  /** Number of slides visible at once. */
  slidesPerView?: number;
  /** Loop back to start. */
  loop?: boolean;
  /** Auto-advance interval in ms. 0 = off. */
  autoplay?: number;
  /** Allow drag/swipe navigation. */
  draggable?: boolean;
  /** Slide transition animation. */
  animations?: CarouselAnimate | false;
  /** Controlled active page. */
  page?: number;
  /** Initial page when uncontrolled. */
  defaultPage?: number;
  /** Called when the active page changes. */
  onPageChange?: (page: number) => void;
  /** Render built-in prev/next triggers. */
  showTriggers?: boolean;
  /** Render built-in indicators. */
  showIndicators?: boolean;
  /** Placement strategy for built-in triggers. */
  triggerPlacement?: 'none' | 'top' | 'bottom' | 'overlay' | 'indicator-sides';
  /** Alignment for top/bottom rows and indicator-sides row. */
  triggerAlign?: 'start' | 'center' | 'end';
  /** Trigger size for built-in controls. */
  triggerSize?: 'sm' | 'md' | 'lg';
  /** Trigger visual variant for built-in controls. */
  triggerVariant?: 'surface' | 'ghost' | 'solid';
  /** Horizontal inset for overlay trigger placement. */
  overlayInset?: string | number;
  /** Vertical offset for overlay trigger placement. */
  overlayOffsetY?: string | number;
  /** Hide overlay triggers until hover/focus. */
  overlayHideUntilHover?: boolean;
  /** Placement for built-in indicators. */
  indicatorPlacement?: 'inside-bottom' | 'below';
  /** Override indicator gap token. */
  indicatorGap?: string | number;
  /** Horizontal inset for inside-bottom indicators. */
  indicatorInset?: string | number;
}

const CarouselRoot: React.FC<CarouselRootProps> = ({
  children,
  className,
  style,
  orientation = 'horizontal',
  align = 'start',
  slidesPerView = 1,
  loop = false,
  autoplay = 0,
  draggable = true,
  animations,
  page,
  defaultPage,
  onPageChange,
  showTriggers = false,
  showIndicators = false,
  triggerPlacement = 'top',
  triggerAlign = 'end',
  triggerSize = 'md',
  triggerVariant = 'surface',
  overlayInset = 'var(--move-spacing-sm)',
  overlayOffsetY = '50%',
  overlayHideUntilHover = false,
  indicatorPlacement = 'below',
  indicatorGap,
  indicatorInset = 'var(--move-spacing-sm)',
}) => {
  const carousel = useCarousel({
    page,
    defaultPage,
    onPageChange,
    orientation,
    align,
    slidesPerView,
    loop,
    autoplay,
    draggable,
    animations,
  } as UseCarouselOptions);

  const ctx = React.useMemo<CarouselContextValue>(
    () => ({
      page: carousel.page,
      pageCount: carousel.pageCount,
      canScrollPrev: carousel.canScrollPrev,
      canScrollNext: carousel.canScrollNext,
      scrollPrev: carousel.scrollPrev,
      scrollNext: carousel.scrollNext,
      scrollToPage: carousel.scrollToPage,
      viewportRef: carousel.viewportRef,
      orientation: carousel.orientation,
      align: carousel.align,
      slidesPerView: carousel.slidesPerView,
      loop: carousel.loop,
      draggable: carousel.draggable,
      registerSlide: carousel.registerSlide,
    }),
    [carousel],
  );

  const toCssValue = React.useCallback((value: string | number | undefined) => {
    if (value == null) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
  }, []);

  const rootStyle: React.CSSProperties = {
    ...style,
    ...(indicatorGap != null
      ? { ['--move-carousel-indicator-gap' as string]: toCssValue(indicatorGap) }
      : undefined),
    ...(indicatorInset != null
      ? { ['--move-carousel-indicator-inset' as string]: toCssValue(indicatorInset) }
      : undefined),
    ...(overlayInset != null
      ? { ['--move-carousel-overlay-inset' as string]: toCssValue(overlayInset) }
      : undefined),
    ...(overlayOffsetY != null
      ? { ['--move-carousel-overlay-offset-y' as string]: toCssValue(overlayOffsetY) }
      : undefined),
  };

  const showAutoTriggers = showTriggers && triggerPlacement !== 'none';
  const showIndicatorSidesLayout = triggerPlacement === 'indicator-sides' && (showTriggers || showIndicators);

  const renderTriggerPair = () => (
    <>
      <CarouselPrevTrigger size={triggerSize} variant={triggerVariant} />
      <CarouselNextTrigger size={triggerSize} variant={triggerVariant} />
    </>
  );

  return (
    <CarouselContext.Provider value={ctx}>
      <div
        className={`${styles.root}${className ? ` ${className}` : ''}`}
        style={rootStyle}
        data-orientation={orientation}
        data-overlay-hide={overlayHideUntilHover || undefined}
        role="region"
        aria-roledescription="carousel"
      >
        {showAutoTriggers && triggerPlacement === 'top' && (
          <div className={styles.autoRow} data-align={triggerAlign} data-position="top">
            {renderTriggerPair()}
          </div>
        )}

        <div className={styles.frame}>
          {children}

          {showAutoTriggers && triggerPlacement === 'overlay' && (
            <div className={styles.overlayNav}>
              {renderTriggerPair()}
            </div>
          )}

          {showIndicators && indicatorPlacement === 'inside-bottom' && !showIndicatorSidesLayout && (
            <div className={styles.insideIndicators}>
              <CarouselIndicatorGroup />
            </div>
          )}
        </div>

        {showIndicatorSidesLayout && (
          <div className={styles.indicatorSides} data-align={triggerAlign}>
            {showTriggers ? <CarouselPrevTrigger size={triggerSize} variant={triggerVariant} /> : null}
            {showIndicators ? <CarouselIndicatorGroup /> : null}
            {showTriggers ? <CarouselNextTrigger size={triggerSize} variant={triggerVariant} /> : null}
          </div>
        )}

        {showAutoTriggers && triggerPlacement === 'bottom' && (
          <div className={styles.autoRow} data-align={triggerAlign} data-position="bottom">
            {renderTriggerPair()}
          </div>
        )}

        {showIndicators && indicatorPlacement === 'below' && !showIndicatorSidesLayout && (
          <CarouselIndicatorGroup />
        )}
      </div>
    </CarouselContext.Provider>
  );
};
CarouselRoot.displayName = 'Carousel.Root';

// =============================================================================
// Viewport
// =============================================================================

export interface CarouselViewportProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'viewport'>;
}

const CarouselViewport = withMoveComponent<'viewport', CarouselViewportProps, HTMLDivElement>({
  name: 'CarouselViewport',
  styles,
  slots: ['viewport'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { viewportRef, orientation, align, slidesPerView, draggable } = useCarouselContext();

    // Merge refs
    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        (viewportRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref && typeof ref === 'object') (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref, viewportRef],
    );

    return {
      render() {
        const viewportSp = sp('viewport');
        const { className: spClass, style: spStyle, ...spRest } = viewportSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('viewport', props.className, spClass as string | undefined)}
            style={{
              ...props.style,
              ...(spStyle as React.CSSProperties),
              ...(slidesPerView > 1
                ? { ['--move-carousel-slides-per-view' as string]: slidesPerView }
                : undefined),
            }}
            data-orientation={orientation}
            data-align={align}
            data-draggable={draggable || undefined}
            aria-live="polite"
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// =============================================================================
// Slide
// =============================================================================

export interface CarouselSlideProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'slide'>;
}

const CarouselSlide = withMoveComponent<'slide', CarouselSlideProps, HTMLDivElement>({
  name: 'CarouselSlide',
  styles,
  slots: ['slide'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { registerSlide, orientation } = useCarouselContext();

    React.useEffect(() => {
      return registerSlide();
    }, [registerSlide]);

    return {
      render() {
        const slideSp = sp('slide');
        const { className: spClass, style: spStyle, ...spRest } = slideSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            role="group"
            aria-roledescription="slide"
            className={cx('slide', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-orientation={orientation}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// =============================================================================
// PrevTrigger
// =============================================================================

export interface CarouselPrevTriggerProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Aria label for the button. */
  'aria-label'?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'surface' | 'ghost' | 'solid';
  sp?: SlotPropsMap<'prevTrigger'>;
}

const CarouselPrevTrigger = withMoveComponent<'prevTrigger', CarouselPrevTriggerProps, HTMLButtonElement>({
  name: 'CarouselPrevTrigger',
  styles,
  slots: ['prevTrigger'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { scrollPrev, canScrollPrev, orientation } = useCarouselContext();
    const iconName = orientation === 'horizontal' ? 'chevron-left' : 'chevron-up';
    const fallbackIcon = useResolvedIcon(iconName, 18);

    return {
      render() {
        const triggerSp = sp('prevTrigger');
        const { className: spClass, style: spStyle, ...spRest } = triggerSp as Record<string, unknown>;
        const { onClick: userOnClick, ...restAttrs } = attrs as Record<string, unknown>;

        return (
          <button
            {...restAttrs}
            {...spRest}
            ref={ref}
            type="button"
            aria-label={(props['aria-label'] as string) || 'Previous slide'}
            disabled={!canScrollPrev}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              scrollPrev();
              (userOnClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            className={cx('prevTrigger', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-orientation={orientation}
            data-size={props.size}
            data-variant={props.variant}
          >
            {props.children || fallbackIcon}
          </button>
        );
      },
    };
  },
});

// =============================================================================
// NextTrigger
// =============================================================================

export interface CarouselNextTriggerProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Aria label for the button. */
  'aria-label'?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'surface' | 'ghost' | 'solid';
  sp?: SlotPropsMap<'nextTrigger'>;
}

const CarouselNextTrigger = withMoveComponent<'nextTrigger', CarouselNextTriggerProps, HTMLButtonElement>({
  name: 'CarouselNextTrigger',
  styles,
  slots: ['nextTrigger'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { scrollNext, canScrollNext, orientation } = useCarouselContext();
    const iconName = orientation === 'horizontal' ? 'chevron-right' : 'chevron-down';
    const fallbackIcon = useResolvedIcon(iconName, 18);

    return {
      render() {
        const triggerSp = sp('nextTrigger');
        const { className: spClass, style: spStyle, ...spRest } = triggerSp as Record<string, unknown>;
        const { onClick: userOnClick, ...restAttrs } = attrs as Record<string, unknown>;

        return (
          <button
            {...restAttrs}
            {...spRest}
            ref={ref}
            type="button"
            aria-label={(props['aria-label'] as string) || 'Next slide'}
            disabled={!canScrollNext}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              scrollNext();
              (userOnClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            className={cx('nextTrigger', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-orientation={orientation}
            data-size={props.size}
            data-variant={props.variant}
          >
            {props.children || fallbackIcon}
          </button>
        );
      },
    };
  },
});

// =============================================================================
// IndicatorGroup
// =============================================================================

export interface CarouselIndicatorGroupProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Accessible label for the indicator group. */
  'aria-label'?: string;
  sp?: SlotPropsMap<'indicatorGroup'>;
}

const CarouselIndicatorGroup = withMoveComponent<'indicatorGroup', CarouselIndicatorGroupProps, HTMLDivElement>({
  name: 'CarouselIndicatorGroup',
  styles,
  slots: ['indicatorGroup'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { pageCount, page, scrollToPage } = useCarouselContext();

    return {
      render() {
        const groupSp = sp('indicatorGroup');
        const { className: spClass, style: spStyle, ...spRest } = groupSp as Record<string, unknown>;

        // If children provided, render them; otherwise generate indicators automatically
        const content = props.children || Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            type="button"
            className={styles.indicator}
            data-active={i === page || undefined}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => scrollToPage(i)}
          />
        ));

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            role="tablist"
            aria-label={(props['aria-label'] as string) || 'Slide indicators'}
            className={cx('indicatorGroup', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {content}
          </div>
        );
      },
    };
  },
});

// =============================================================================
// Indicator
// =============================================================================

export interface CarouselIndicatorProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** The page index this indicator targets. */
  index: number;
  sp?: SlotPropsMap<'indicator'>;
}

const CarouselIndicator = withMoveComponent<'indicator', CarouselIndicatorProps, HTMLButtonElement>({
  name: 'CarouselIndicator',
  styles,
  slots: ['indicator'] as const,
  moveProps: ['index'],

  setup({ props, ref, cx, sp, attrs }) {
    const { page, scrollToPage } = useCarouselContext();
    const index = props.index as number;

    return {
      render() {
        const indicatorSp = sp('indicator');
        const { className: spClass, style: spStyle, ...spRest } = indicatorSp as Record<string, unknown>;
        const { onClick: userOnClick, ...restAttrs } = attrs as Record<string, unknown>;

        return (
          <button
            {...restAttrs}
            {...spRest}
            ref={ref}
            type="button"
            role="tab"
            aria-selected={page === index}
            aria-label={`Go to slide ${index + 1}`}
            data-active={page === index || undefined}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              scrollToPage(index);
              (userOnClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            className={cx('indicator', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </button>
        );
      },
    };
  },
});

// =============================================================================
// Export
// =============================================================================

export const Carousel = {
  Root: CarouselRoot,
  Viewport: CarouselViewport,
  Slide: CarouselSlide,
  PrevTrigger: CarouselPrevTrigger,
  NextTrigger: CarouselNextTrigger,
  IndicatorGroup: CarouselIndicatorGroup,
  Indicator: CarouselIndicator,
};
