'use client';

import * as React from 'react';
import { animate, spring } from 'animejs';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import { useInteractiveAnimate, prefersReducedMotion } from '../../../animation';
import { defaultAnimations, type ElementAnimate } from '../../../animation/types';
import { usePagination } from './usePagination';
import type { UsePaginationReturn } from './usePagination';
import styles from './Pagination.module.css';

// =============================================================================
// Context
// =============================================================================

const PaginationContext = React.createContext<
  (UsePaginationReturn & { size?: PaginationSize; variant?: PaginationVariant }) | null
>(null);

function usePaginationContext() {
  const ctx = React.useContext(PaginationContext);
  if (!ctx) {
    throw new Error('Pagination compound components must be used within Pagination.Root');
  }
  return ctx;
}

// =============================================================================
// Spring config for stagger entrance
// =============================================================================

const springConfig = { mass: 1, stiffness: 400, damping: 26, velocity: 0 };

// =============================================================================
// Types
// =============================================================================

export type PaginationSize = 'sm' | 'md' | 'lg';
export type PaginationVariant = 'default' | 'outline';

// =============================================================================
// Root
// =============================================================================

export interface PaginationRootProps extends Record<string, unknown> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Total number of pages */
  total: number;
  /** Controlled active page (1-based) */
  page?: number;
  /** Uncontrolled initial page (1-based) */
  defaultPage?: number;
  /** Called when the active page changes */
  onChange?: (page: number) => void;
  /** Pages shown on each side of active page */
  siblings?: number;
  /** Pages pinned at start and end */
  boundaries?: number;
  /** Size of pagination controls */
  size?: PaginationSize;
  /** Visual variant */
  variant?: PaginationVariant;
  pt?: PassThrough<'root'>;
}

const PaginationRoot = withMoveComponent<'root', PaginationRootProps, HTMLElement>({
  name: 'PaginationRoot',
  styles,
  slots: ['root'] as const,
  defaults: { size: 'md', variant: 'default', siblings: 1, boundaries: 1 },
  moveProps: ['total', 'page', 'defaultPage', 'onChange', 'siblings', 'boundaries', 'size', 'variant'],

  setup({ props, ref, cx, ptm, attrs }) {
    const pagination = usePagination({
      total: props.total as number,
      page: props.page as number | undefined,
      defaultPage: props.defaultPage as number | undefined,
      onChange: props.onChange as ((page: number) => void) | undefined,
      siblings: props.siblings as number | undefined,
      boundaries: props.boundaries as number | undefined,
    });

    const contextValue = React.useMemo(
      () => ({
        ...pagination,
        size: props.size as PaginationSize,
        variant: props.variant as PaginationVariant,
      }),
      [pagination, props.size, props.variant]
    );

    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;

        return (
          <PaginationContext.Provider value={contextValue}>
            <nav
              {...attrs}
              {...ptRest}
              ref={ref}
              aria-label="Pagination"
              className={cx('root', props.className, ptClass as string | undefined)}
              style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
              data-size={props.size}
              data-variant={props.variant}
            >
              {props.children}
            </nav>
          </PaginationContext.Provider>
        );
      },
    };
  },
});

// =============================================================================
// PrevTrigger
// =============================================================================

export interface PaginationPrevTriggerProps extends Record<string, unknown> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  animate?: ElementAnimate | false;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseUp?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLButtonElement>;
  pt?: PassThrough<'prev'>;
}

const PaginationPrevTrigger = withMoveComponent<'prev', PaginationPrevTriggerProps, HTMLButtonElement>({
  name: 'PaginationPrevTrigger',
  styles,
  slots: ['prev'] as const,
  moveProps: ['animate'],

  setup({ props, ref, cx, ptm, attrs }) {
    const { previous, canPrevious } = usePaginationContext();

    const animateConfig = (props.animate as ElementAnimate | false | undefined) === false
      ? { hover: false as const, press: false as const }
      : { ...((props.animate as ElementAnimate | undefined) || {}) };

    const { ref: animRef, handlers } = useInteractiveAnimate({
      animate: animateConfig as ElementAnimate,
      defaults: defaultAnimations.element,
      disabled: !canPrevious,
    });

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, animRef as React.Ref<HTMLButtonElement>);

    return {
      render() {
        const prevPt = ptm('prev');
        const { className: ptClass, style: ptStyle, ...ptRest } = prevPt as Record<string, unknown>;

        return (
          <button
            {...attrs}
            {...ptRest}
            ref={mergedRef}
            type="button"
            aria-label="Go to previous page"
            disabled={!canPrevious}
            className={cx('prev', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
            onClick={previous}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseEnter();
              (props.onMouseEnter as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseLeave();
              (props.onMouseLeave as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseDown();
              (props.onMouseDown as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseUp();
              (props.onMouseUp as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
              handlers.onKeyDown(e);
              (props.onKeyDown as React.KeyboardEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLButtonElement>) => {
              handlers.onKeyUp(e);
              (props.onKeyUp as React.KeyboardEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
          >
            {props.children ?? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            )}
          </button>
        );
      },
    };
  },
});

// =============================================================================
// NextTrigger
// =============================================================================

export interface PaginationNextTriggerProps extends Record<string, unknown> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  animate?: ElementAnimate | false;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseUp?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLButtonElement>;
  pt?: PassThrough<'next'>;
}

const PaginationNextTrigger = withMoveComponent<'next', PaginationNextTriggerProps, HTMLButtonElement>({
  name: 'PaginationNextTrigger',
  styles,
  slots: ['next'] as const,
  moveProps: ['animate'],

  setup({ props, ref, cx, ptm, attrs }) {
    const { next, canNext } = usePaginationContext();

    const animateConfig = (props.animate as ElementAnimate | false | undefined) === false
      ? { hover: false as const, press: false as const }
      : { ...((props.animate as ElementAnimate | undefined) || {}) };

    const { ref: animRef, handlers } = useInteractiveAnimate({
      animate: animateConfig as ElementAnimate,
      defaults: defaultAnimations.element,
      disabled: !canNext,
    });

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, animRef as React.Ref<HTMLButtonElement>);

    return {
      render() {
        const nextPt = ptm('next');
        const { className: ptClass, style: ptStyle, ...ptRest } = nextPt as Record<string, unknown>;

        return (
          <button
            {...attrs}
            {...ptRest}
            ref={mergedRef}
            type="button"
            aria-label="Go to next page"
            disabled={!canNext}
            className={cx('next', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
            onClick={next}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseEnter();
              (props.onMouseEnter as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseLeave();
              (props.onMouseLeave as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseDown();
              (props.onMouseDown as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseUp();
              (props.onMouseUp as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
              handlers.onKeyDown(e);
              (props.onKeyDown as React.KeyboardEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLButtonElement>) => {
              handlers.onKeyUp(e);
              (props.onKeyUp as React.KeyboardEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
          >
            {props.children ?? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            )}
          </button>
        );
      },
    };
  },
});

// =============================================================================
// Items
// =============================================================================

export interface PaginationItemsProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  pt?: PassThrough<'items'>;
}

const PaginationItems = withMoveComponent<'items' | 'item' | 'ellipsis' | 'indicator', PaginationItemsProps, HTMLUListElement>({
  name: 'PaginationItems',
  styles,
  slots: ['items', 'item', 'ellipsis', 'indicator'] as const,

  setup({ props, ref, internalRef, cx, ptm, attrs }) {
    const { range, page, setPage } = usePaginationContext();
    const staggerAnimRef = React.useRef<ReturnType<typeof animate> | null>(null);
    const slideAnimRef = React.useRef<ReturnType<typeof animate> | null>(null);
    const indicatorRef = React.useRef<HTMLDivElement | null>(null);
    const isFirstIndicatorRun = React.useRef(true);
    const suppressIndicator = React.useRef(false);
    const hasMounted = React.useRef(false);
    const prevNumbersRef = React.useRef<Set<number>>(new Set());
    const prevPageRef = React.useRef(page);

    // --- Sliding indicator logic (like Tabs) ---
    const updateIndicator = React.useCallback(() => {
      if (suppressIndicator.current) return;

      const ul = internalRef.current;
      const indicator = indicatorRef.current;
      if (!ul || !indicator) return;

      const active = ul.querySelector<HTMLElement>('[data-state="active"]');
      if (!active) {
        indicator.style.opacity = '0';
        return;
      }

      const ulRect = ul.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      const left = activeRect.left - ulRect.left + ul.scrollLeft;
      const width = activeRect.width;
      const height = activeRect.height;

      if (isFirstIndicatorRun.current || prefersReducedMotion()) {
        isFirstIndicatorRun.current = false;
        indicator.style.opacity = '1';
        indicator.style.transform = `translateX(${left}px)`;
        indicator.style.width = `${width}px`;
        indicator.style.height = `${height}px`;
        return;
      }

      indicator.style.opacity = '1';

      animate(indicator, {
        translateX: left,
        width,
        height,
        ease: spring({ mass: 1, stiffness: 500, damping: 30, velocity: 0 }),
      });
    }, [internalRef]);

    // Observe data-state changes to update indicator position
    React.useEffect(() => {
      const ul = internalRef.current;
      if (!ul) return;

      updateIndicator();

      const observer = new MutationObserver(updateIndicator);
      observer.observe(ul, {
        attributes: true,
        attributeFilter: ['data-state'],
        subtree: true,
      });

      return () => observer.disconnect();
    }, [internalRef, updateIndicator]);

    // Mark mounted after initial render cycle (runs after layout effects)
    React.useEffect(() => {
      prevNumbersRef.current = new Set(
        range.filter((item): item is number => typeof item === 'number')
      );
      prevPageRef.current = page;
      hasMounted.current = true;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Staggered scale entrance animation on mount (left to right)
    React.useLayoutEffect(() => {
      const ul = internalRef.current;
      if (!ul || prefersReducedMotion()) return;

      const items = ul.querySelectorAll<HTMLElement>('li');
      if (items.length === 0) return;

      // Hide indicator during stagger entrance
      suppressIndicator.current = true;
      if (indicatorRef.current) {
        indicatorRef.current.style.opacity = '0';
      }

      // Set initial state
      items.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
      });

      staggerAnimRef.current = animate(items, {
        opacity: 1,
        scale: 1,
        ease: spring(springConfig),
        delay: (_el: any, i: number) => i * 30,
      });

      // Show indicator once items are visually at full size
      const totalStaggerDelay = items.length * 30;
      setTimeout(() => {
        suppressIndicator.current = false;
        updateIndicator();
      }, totalStaggerDelay + 100);

      return () => {
        if (staggerAnimRef.current) {
          staggerAnimRef.current.pause();
          items.forEach((item) => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
          suppressIndicator.current = false;
        }
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Horizontal slide animation for newly appearing page numbers
    const rangeKey = JSON.stringify(range);
    React.useLayoutEffect(() => {
      if (!hasMounted.current) return;

      const ul = internalRef.current;
      if (!ul || prefersReducedMotion()) return;

      const currentNumbers = new Set(
        range.filter((item): item is number => typeof item === 'number')
      );
      const prevNumbers = prevNumbersRef.current;
      const direction = page >= prevPageRef.current ? 1 : -1;

      const newNumbers = new Set<number>();
      currentNumbers.forEach((n) => {
        if (!prevNumbers.has(n)) newNumbers.add(n);
      });

      prevNumbersRef.current = currentNumbers;
      prevPageRef.current = page;

      if (newNumbers.size === 0) return;

      const liElements = ul.querySelectorAll<HTMLElement>('li');
      const newLis: HTMLElement[] = [];
      range.forEach((item, i) => {
        if (typeof item === 'number' && newNumbers.has(item) && liElements[i]) {
          newLis.push(liElements[i]);
        }
      });

      if (newLis.length === 0) return;

      if (slideAnimRef.current) {
        slideAnimRef.current.pause();
      }

      const offset = direction * 16;
      newLis.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = `translateX(${offset}px) scale(0.9)`;
      });

      slideAnimRef.current = animate(newLis, {
        opacity: 1,
        translateX: 0,
        scale: 1,
        ease: spring(springConfig),
        delay: (_el: any, i: number) => i * 20,
      });
    }, [rangeKey]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
      render() {
        const itemsPt = ptm('items');
        const { className: itemsPtClass, style: itemsPtStyle, ...itemsPtRest } = itemsPt as Record<string, unknown>;
        const itemPt = ptm('item');
        const { className: itemPtClass, style: itemPtStyle, ...itemPtRest } = itemPt as Record<string, unknown>;
        const ellipsisPt = ptm('ellipsis');
        const { className: ellipsisPtClass, style: ellipsisPtStyle, ...ellipsisPtRest } = ellipsisPt as Record<string, unknown>;
        const indicatorPt = ptm('indicator');
        const { className: indPtClass, style: indPtStyle, ...indPtRest } = indicatorPt as Record<string, unknown>;

        let dotsIndex = 0;

        return (
          <ul
            {...attrs}
            {...itemsPtRest}
            ref={ref}
            className={cx('items', props.className, itemsPtClass as string | undefined)}
            style={{ ...props.style, ...(itemsPtStyle as React.CSSProperties) }}
          >
            {range.map((item) => {
              if (item === 'dots') {
                const key = `dots-${dotsIndex++}`;
                return (
                  <li key={key} aria-hidden="true">
                    <span
                      {...ellipsisPtRest}
                      className={cx('ellipsis', ellipsisPtClass as string | undefined)}
                      style={ellipsisPtStyle as React.CSSProperties}
                    >
                      &hellip;
                    </span>
                  </li>
                );
              }

              const isActive = item === page;
              return (
                <li key={item}>
                  <PageButton
                    itemPtRest={itemPtRest}
                    itemPtClass={itemPtClass as string | undefined}
                    itemPtStyle={itemPtStyle as React.CSSProperties | undefined}
                    cx={cx}
                    isActive={isActive}
                    pageNumber={item}
                    onSelect={setPage}
                  />
                </li>
              );
            })}
            <div
              {...indPtRest}
              ref={indicatorRef}
              aria-hidden="true"
              className={cx('indicator', indPtClass as string | undefined)}
              style={indPtStyle as React.CSSProperties}
            />
          </ul>
        );
      },
    };
  },
});

// =============================================================================
// PageButton — internal component with interactive animation per item
// =============================================================================

interface PageButtonProps {
  itemPtRest: Record<string, unknown>;
  itemPtClass: string | undefined;
  itemPtStyle: React.CSSProperties | undefined;
  cx: (...args: any[]) => string;
  isActive: boolean;
  pageNumber: number;
  onSelect: (page: number) => void;
}

function PageButton({ itemPtRest, itemPtClass, itemPtStyle, cx, isActive, pageNumber, onSelect }: PageButtonProps) {
  const { ref: animRef, handlers } = useInteractiveAnimate({
    animate: {} as ElementAnimate,
    defaults: defaultAnimations.element,
    disabled: false,
  });

  return (
    <button
      {...itemPtRest}
      ref={animRef as React.Ref<HTMLButtonElement>}
      type="button"
      aria-label={`Go to page ${pageNumber}`}
      aria-current={isActive ? 'page' : undefined}
      data-state={isActive ? 'active' : undefined}
      className={cx('item', itemPtClass)}
      style={itemPtStyle}
      onClick={() => onSelect(pageNumber)}
      onMouseEnter={handlers.onMouseEnter}
      onMouseLeave={handlers.onMouseLeave}
      onMouseDown={handlers.onMouseDown}
      onMouseUp={handlers.onMouseUp}
      onKeyDown={handlers.onKeyDown}
      onKeyUp={handlers.onKeyUp}
    >
      {pageNumber}
    </button>
  );
}

// =============================================================================
// Export
// =============================================================================

export const Pagination = {
  Root: PaginationRoot,
  PrevTrigger: PaginationPrevTrigger,
  NextTrigger: PaginationNextTrigger,
  Items: PaginationItems,
};
