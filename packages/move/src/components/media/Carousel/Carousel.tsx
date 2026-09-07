'use client';

import * as React from 'react';
import { composeHandlers, useMergedRef, withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { resolveAnimationsConfig, scaleDown, scaleUp, useAnimations } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import { useIcon } from '../../../infrastructure/Icon';
import { Tooltip } from '../../overlays/Tooltip';
import { useCarousel } from './useCarousel';
import type {
  UseCarouselOptions,
  CarouselOrientation,
  CarouselAlign,
  CarouselAnimate,
} from './useCarousel';
import styles from './Carousel.module.css';

// =============================================================================
// Labels
// =============================================================================

export interface CarouselLabels {
  /** Names the previous trigger, for assistive tech and in its tooltip. */
  previousSlide: string;
  /** Names the next trigger, for assistive tech and in its tooltip. */
  nextSlide: string;
  /** Names the indicator group. */
  slideIndicators: string;
  /** Names one indicator. Receives the 1-based slide number. */
  goToSlide: (n: number) => string;
}

const DEFAULT_LABELS: CarouselLabels = {
  previousSlide: 'Previous slide',
  nextSlide: 'Next slide',
  slideIndicators: 'Slide indicators',
  goToSlide: (n) => `Go to slide ${n}`,
};

// =============================================================================
// Context
// =============================================================================

interface CarouselContextValue {
  labels: CarouselLabels;
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
  /** User-facing strings. Each names a control for assistive tech and in its tooltip. */
  labels?: Partial<CarouselLabels>;
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

const toCssValue = (value: string | number | undefined) =>
  value == null ? undefined : typeof value === 'number' ? `${value}px` : value;

/** The spacing custom properties a caller actually set, as inline style. */
function spacingVars(o: {
  indicatorGap?: string | number;
  indicatorInset?: string | number;
  overlayInset?: string | number;
  overlayOffsetY?: string | number;
}): React.CSSProperties {
  const vars: Record<string, string | undefined> = {};
  const set = (name: string, value: string | number | undefined) => {
    if (value != null) vars[name] = toCssValue(value);
  };
  set('--move-carousel-indicator-gap', o.indicatorGap);
  set('--move-carousel-indicator-inset', o.indicatorInset);
  set('--move-carousel-overlay-inset', o.overlayInset);
  set('--move-carousel-overlay-offset-y', o.overlayOffsetY);
  return vars as React.CSSProperties;
}

/** Triggers flanking the indicators, as one row. */
function IndicatorSides({
  showTriggers,
  showIndicators,
  align,
  size,
  variant,
}: {
  showTriggers: boolean;
  showIndicators: boolean;
  align: string;
  size: 'sm' | 'md' | 'lg';
  variant: 'surface' | 'ghost' | 'solid';
}) {
  return (
    <div className={styles.indicatorSides} data-align={align}>
      {showTriggers && <CarouselPrevTrigger size={size} variant={variant} />}
      {showIndicators && <CarouselIndicatorGroup />}
      {showTriggers && <CarouselNextTrigger size={size} variant={variant} />}
    </div>
  );
}

/**
 * Which optional regions this configuration shows, and where.
 *
 * The placement rules read as one table here rather than as a chain of tests
 * spread through the render tree — where they are answering the same question
 * five times and it is hard to see that `indicator-sides` suppresses the others.
 */
function resolveRegions(o: {
  showTriggers: boolean;
  showIndicators: boolean;
  triggerPlacement: string;
  indicatorPlacement: string;
}) {
  const autoTriggers = o.showTriggers && o.triggerPlacement !== 'none';
  // The sides layout owns both triggers and indicators, so it stands in for
  // every other placement rather than sitting alongside them.
  const indicatorSides =
    o.triggerPlacement === 'indicator-sides' && (o.showTriggers || o.showIndicators);
  const looseIndicators = o.showIndicators && !indicatorSides;
  return {
    triggersTop: autoTriggers && o.triggerPlacement === 'top',
    triggersOverlay: autoTriggers && o.triggerPlacement === 'overlay',
    triggersBottom: autoTriggers && o.triggerPlacement === 'bottom',
    indicatorsInside: looseIndicators && o.indicatorPlacement === 'inside-bottom',
    indicatorsBelow: looseIndicators && o.indicatorPlacement === 'below',
    indicatorSides,
  };
}

/**
 * The chrome a Carousel draws around its slides, with every fallback in one
 * place. Read as a table rather than as two dozen defaults spread across a
 * destructure, where it is hard to see which knobs belong together.
 */
function chromeDefaults(p: CarouselRootProps) {
  return {
    showTriggers: p.showTriggers ?? false,
    showIndicators: p.showIndicators ?? false,
    triggerPlacement: p.triggerPlacement ?? 'top',
    triggerAlign: p.triggerAlign ?? 'end',
    triggerSize: p.triggerSize ?? 'md',
    triggerVariant: p.triggerVariant ?? 'surface',
    overlayInset: p.overlayInset ?? 'var(--move-spacing-sm)',
    overlayOffsetY: p.overlayOffsetY ?? '50%',
    overlayHideUntilHover: p.overlayHideUntilHover ?? false,
    indicatorPlacement: p.indicatorPlacement ?? 'below',
    indicatorGap: p.indicatorGap,
    indicatorInset: p.indicatorInset ?? 'var(--move-spacing-sm)',
  } as const;
}

const CarouselRoot: React.FC<CarouselRootProps> = (props) => {
  const {
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
  } = props;
  const {
    showTriggers,
    showIndicators,
    triggerPlacement,
    triggerAlign,
    triggerSize,
    triggerVariant,
    overlayInset,
    overlayOffsetY,
    overlayHideUntilHover,
    indicatorPlacement,
    indicatorGap,
    indicatorInset,
  } = chromeDefaults(props);

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

  const labels = React.useMemo<CarouselLabels>(
    () => ({ ...DEFAULT_LABELS, ...props.labels }),
    [props.labels],
  );

  const ctx = React.useMemo<CarouselContextValue>(
    () => ({
      labels,
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
    [carousel, labels],
  );

  const rootStyle: React.CSSProperties = {
    ...style,
    ...spacingVars({ indicatorGap, indicatorInset, overlayInset, overlayOffsetY }),
  };

  const at = resolveRegions({
    showTriggers,
    showIndicators,
    triggerPlacement,
    indicatorPlacement,
  });

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
        {at.triggersTop && (
          <div className={styles.autoRow} data-align={triggerAlign} data-position="top">
            {renderTriggerPair()}
          </div>
        )}

        <div className={styles.frame}>
          {children}

          {at.triggersOverlay && <div className={styles.overlayNav}>{renderTriggerPair()}</div>}

          {at.indicatorsInside && (
            <div className={styles.insideIndicators}>
              <CarouselIndicatorGroup />
            </div>
          )}
        </div>

        {at.indicatorSides && (
          <IndicatorSides
            showTriggers={showTriggers}
            showIndicators={showIndicators}
            align={triggerAlign}
            size={triggerSize}
            variant={triggerVariant}
          />
        )}

        {at.triggersBottom && (
          <div className={styles.autoRow} data-align={triggerAlign} data-position="bottom">
            {renderTriggerPair()}
          </div>
        )}

        {at.indicatorsBelow && <CarouselIndicatorGroup />}
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
        else if (ref && typeof ref === 'object')
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref, viewportRef],
    );

    return {
      render() {
        const viewportSp = sp('viewport');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = viewportSp as Record<string, unknown>;

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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = slideSp as Record<string, unknown>;

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
// Trigger press
// =============================================================================

/**
 * The press contract every other control in the library has.
 *
 * These triggers are hand-rolled `<button>` elements: they reimplement a
 * button's LOOK — size, radius, border, ground, shadow — on a raw element, and
 * so inherited none of its BEHAVIOUR. They sat flat under the pointer while
 * every neighbouring button sprang.
 *
 * Class → animation → class, as everywhere else: CSS holds the resting states so
 * `animations={false}` and reduced motion still feel like a button, and the
 * animation only travels between them. A fixed ratio is right here where it is
 * not on Button — these are fixed squares, so there is no wide-control case for
 * the travel to exaggerate.
 */
function useTriggerPress(
  animationsProp: AnimationTrigger[] | false | undefined,
  ref: React.Ref<HTMLButtonElement>,
) {
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const config = resolveAnimationsConfig(
    [
      { trigger: 'Trigger.hover', sequence: [{ animation: scaleUp() }] },
      { trigger: 'Trigger.press', sequence: [{ animation: scaleDown() }] },
    ],
    animationsProp,
  );
  const refs = React.useMemo(() => ({ Trigger: btnRef }), []);
  const { handlers } = useAnimations(config, refs);
  return {
    pressRef: useMergedRef<HTMLButtonElement>(ref, btnRef as React.Ref<HTMLButtonElement>),
    pressHandlers: {
      onMouseEnter: handlers.Trigger?.onMouseEnter,
      onMouseLeave: handlers.Trigger?.onMouseLeave,
      onMouseDown: handlers.Trigger?.onMouseDown,
      onMouseUp: handlers.Trigger?.onMouseUp,
    },
  };
}

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
  /** Override or disable the hover/press motion. */
  animations?: AnimationTrigger[] | false;
  sp?: SlotPropsMap<'prevTrigger'>;
}

const CarouselPrevTrigger = withMoveComponent<
  'prevTrigger',
  CarouselPrevTriggerProps,
  HTMLButtonElement
>({
  name: 'CarouselPrevTrigger',
  styles,
  slots: ['prevTrigger'] as const,
  moveProps: ['size', 'variant', 'animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const { scrollPrev, canScrollPrev, orientation, labels } = useCarouselContext();
    const { pressRef, pressHandlers } = useTriggerPress(
      props.animations as AnimationTrigger[] | false | undefined,
      ref,
    );
    const fallbackIcon = useIcon('previous', 18);

    return {
      render() {
        const triggerSp = sp('prevTrigger');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = triggerSp as Record<string, unknown>;
        const { onClick: userOnClick, ...restAttrs } = attrs as Record<string, unknown>;

        const label = (props['aria-label'] as string) || labels.previousSlide;

        return (
          <Tooltip label={label} side={orientation === 'vertical' ? 'right' : 'bottom'}>
            <button
              // Before the spread, the way PlayerButton sets it: a caller who
              // passes their own aria-label overrides this, and `label` already
              // read theirs back — so the tooltip says the same thing.
              aria-label={label}
              {...restAttrs}
              {...spRest}
              ref={pressRef}
              {...pressHandlers}
              type="button"
              disabled={!canScrollPrev}
              onClick={composeHandlers(
                restAttrs.onClick,
                (e: React.MouseEvent<HTMLButtonElement>) => {
                  scrollPrev();
                  (userOnClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
                },
              )}
              className={cx('prevTrigger', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
              data-orientation={orientation}
              data-size={props.size}
              data-variant={props.variant}
            >
              {props.children || fallbackIcon}
            </button>
          </Tooltip>
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
  /** Override or disable the hover/press motion. */
  animations?: AnimationTrigger[] | false;
  sp?: SlotPropsMap<'nextTrigger'>;
}

const CarouselNextTrigger = withMoveComponent<
  'nextTrigger',
  CarouselNextTriggerProps,
  HTMLButtonElement
>({
  name: 'CarouselNextTrigger',
  styles,
  slots: ['nextTrigger'] as const,
  moveProps: ['size', 'variant', 'animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const { scrollNext, canScrollNext, orientation, labels } = useCarouselContext();
    const { pressRef, pressHandlers } = useTriggerPress(
      props.animations as AnimationTrigger[] | false | undefined,
      ref,
    );
    const fallbackIcon = useIcon('next', 18);

    return {
      render() {
        const triggerSp = sp('nextTrigger');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = triggerSp as Record<string, unknown>;
        const { onClick: userOnClick, ...restAttrs } = attrs as Record<string, unknown>;

        const label = (props['aria-label'] as string) || labels.nextSlide;

        return (
          <Tooltip label={label} side={orientation === 'vertical' ? 'right' : 'bottom'}>
            <button
              // Before the spread, the way PlayerButton sets it: a caller who
              // passes their own aria-label overrides this, and `label` already
              // read theirs back — so the tooltip says the same thing.
              aria-label={label}
              {...restAttrs}
              {...spRest}
              ref={pressRef}
              {...pressHandlers}
              type="button"
              disabled={!canScrollNext}
              onClick={composeHandlers(
                restAttrs.onClick,
                (e: React.MouseEvent<HTMLButtonElement>) => {
                  scrollNext();
                  (userOnClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
                },
              )}
              className={cx('nextTrigger', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
              data-orientation={orientation}
              data-size={props.size}
              data-variant={props.variant}
            >
              {props.children || fallbackIcon}
            </button>
          </Tooltip>
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

const CarouselIndicatorGroup = withMoveComponent<
  'indicatorGroup',
  CarouselIndicatorGroupProps,
  HTMLDivElement
>({
  name: 'CarouselIndicatorGroup',
  styles,
  slots: ['indicatorGroup'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { pageCount, page, scrollToPage, labels } = useCarouselContext();

    return {
      render() {
        const groupSp = sp('indicatorGroup');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = groupSp as Record<string, unknown>;

        // If children provided, render them; otherwise generate indicators automatically
        const content =
          props.children ||
          Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === page}
              className={styles.indicator}
              data-active={i === page || undefined}
              aria-label={labels.goToSlide(i + 1)}
              onClick={() => scrollToPage(i)}
            />
          ));

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            role="tablist"
            aria-label={(props['aria-label'] as string) || labels.slideIndicators}
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

const CarouselIndicator = withMoveComponent<'indicator', CarouselIndicatorProps, HTMLButtonElement>(
  {
    name: 'CarouselIndicator',
    styles,
    slots: ['indicator'] as const,
    moveProps: ['index'],

    setup({ props, ref, cx, sp, attrs }) {
      const { page, scrollToPage, labels } = useCarouselContext();
      const index = props.index as number;

      return {
        render() {
          const indicatorSp = sp('indicator');
          const {
            className: spClass,
            style: spStyle,
            ...spRest
          } = indicatorSp as Record<string, unknown>;
          const { onClick: userOnClick, ...restAttrs } = attrs as Record<string, unknown>;

          return (
            <button
              aria-label={labels.goToSlide(index + 1)}
              {...restAttrs}
              {...spRest}
              ref={ref}
              type="button"
              role="tab"
              aria-selected={page === index}
              data-active={page === index || undefined}
              onClick={composeHandlers(
                restAttrs.onClick,
                (e: React.MouseEvent<HTMLButtonElement>) => {
                  scrollToPage(index);
                  (userOnClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
                },
              )}
              className={cx('indicator', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            >
              {props.children}
            </button>
          );
        },
      };
    },
  },
);

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
