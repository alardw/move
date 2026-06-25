'use client';
// Generated from Pagination.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { scaleUp, scaleDown, popIn, pagination as paginationEase, useAnimations, resolveAnimationsConfig } from '../../../animation';
import type { AnimationTrigger, AnimationState } from '../../../animation';
import { usePagination } from './usePagination';
import type { UsePaginationReturn } from './usePagination';
import { useResolvedIcon } from '../../../infrastructure/Icon';
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

// Spring config now from barrel as 'pagination' preset

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
  sp?: SlotPropsMap<'root'>;
}

const PaginationRoot = withMoveComponent<'root', PaginationRootProps, HTMLElement>({
  name: 'PaginationRoot',
  styles,
  slots: ['root'] as const,
  defaults: { size: 'md', variant: 'default', siblings: 1, boundaries: 1 },
  moveProps: ['total', 'page', 'defaultPage', 'onChange', 'siblings', 'boundaries', 'size', 'variant'],

  setup({ props, ref, cx, sp, attrs }) {
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
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <PaginationContext.Provider value={contextValue}>
            <nav
              {...attrs}
              {...spRest}
              ref={ref}
              aria-label="Pagination"
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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
  animations?: AnimationTrigger[] | false;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseUp?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLButtonElement>;
  sp?: SlotPropsMap<'prev'>;
}

const PaginationPrevTrigger = withMoveComponent<'prev', PaginationPrevTriggerProps, HTMLButtonElement>({
  name: 'PaginationPrevTrigger',
  styles,
  slots: ['prev'] as const,
  moveProps: ['animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const { previous, canPrevious } = usePaginationContext();

    const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
      { trigger: 'Prev.hover', sequence: [{ animation: scaleUp }] },
      { trigger: 'Prev.press', sequence: [{ animation: scaleDown }] },
    ];

    const animationsProp = props.animations as AnimationTrigger[] | false | undefined;
    const animConfig = animationsProp === false
      ? null
      : resolveAnimationsConfig(DEFAULT_ANIMATIONS, animationsProp);

    const btnRef = React.useRef<HTMLElement | null>(null);
    const btnRefs = React.useMemo(() => ({ Prev: btnRef }), []);
    const { handlers } = useAnimations(animConfig, btnRefs);
    const mergedRef = useMergedRef<HTMLButtonElement>(ref, btnRef as React.Ref<HTMLButtonElement>);
    const isDisabled = !canPrevious;
    const defaultIcon = useResolvedIcon('chevron-left', 16);

    return {
      render() {
        const prevSp = sp('prev');
        const { className: spClass, style: spStyle, ...spRest } = prevSp as Record<string, unknown>;

        return (
          <button
            {...attrs}
            {...spRest}
            ref={mergedRef}
            type="button"
            aria-label="Go to previous page"
            disabled={!canPrevious}
            className={cx('prev', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={previous}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isDisabled) handlers.Prev?.onMouseEnter?.();
              (props.onMouseEnter as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isDisabled) handlers.Prev?.onMouseLeave?.();
              (props.onMouseLeave as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isDisabled) handlers.Prev?.onMouseDown?.();
              (props.onMouseDown as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isDisabled) handlers.Prev?.onMouseUp?.();
              (props.onMouseUp as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
          >
            {props.children ?? defaultIcon}
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
  animations?: AnimationTrigger[] | false;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseUp?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLButtonElement>;
  sp?: SlotPropsMap<'next'>;
}

const PaginationNextTrigger = withMoveComponent<'next', PaginationNextTriggerProps, HTMLButtonElement>({
  name: 'PaginationNextTrigger',
  styles,
  slots: ['next'] as const,
  moveProps: ['animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const { next, canNext } = usePaginationContext();

    const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
      { trigger: 'Next.hover', sequence: [{ animation: scaleUp }] },
      { trigger: 'Next.press', sequence: [{ animation: scaleDown }] },
    ];

    const animationsProp = props.animations as AnimationTrigger[] | false | undefined;
    const animConfig = animationsProp === false
      ? null
      : resolveAnimationsConfig(DEFAULT_ANIMATIONS, animationsProp);

    const btnRef = React.useRef<HTMLElement | null>(null);
    const btnRefs = React.useMemo(() => ({ Next: btnRef }), []);
    const { handlers } = useAnimations(animConfig, btnRefs);
    const mergedRef = useMergedRef<HTMLButtonElement>(ref, btnRef as React.Ref<HTMLButtonElement>);
    const isDisabled = !canNext;
    const defaultIcon = useResolvedIcon('chevron-right', 16);

    return {
      render() {
        const nextSp = sp('next');
        const { className: spClass, style: spStyle, ...spRest } = nextSp as Record<string, unknown>;

        return (
          <button
            {...attrs}
            {...spRest}
            ref={mergedRef}
            type="button"
            aria-label="Go to next page"
            disabled={!canNext}
            className={cx('next', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={next}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isDisabled) handlers.Next?.onMouseEnter?.();
              (props.onMouseEnter as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isDisabled) handlers.Next?.onMouseLeave?.();
              (props.onMouseLeave as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isDisabled) handlers.Next?.onMouseDown?.();
              (props.onMouseDown as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isDisabled) handlers.Next?.onMouseUp?.();
              (props.onMouseUp as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
          >
            {props.children ?? defaultIcon}
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
  sp?: SlotPropsMap<'items'>;
}

const PaginationItems = withMoveComponent<'items' | 'item' | 'ellipsis' | 'indicator', PaginationItemsProps, HTMLUListElement>({
  name: 'PaginationItems',
  styles,
  slots: ['items', 'item', 'ellipsis', 'indicator'] as const,

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const { range, page, setPage } = usePaginationContext();
    const prevNumbersRef = React.useRef<Set<number>>(new Set());
    const prevPageRef = React.useRef(page);

    // --- Sliding indicator via animatePosition ---
    const indicatorRef = React.useRef<HTMLElement | null>(null);

    const activeRef = React.useMemo(() => {
      const ref = { current: null as HTMLElement | null };
      Object.defineProperty(ref, 'current', {
        get() { return internalRef.current?.querySelector<HTMLElement>('[data-state="active"]') ?? null; },
        set() { /* no-op — always queries live DOM */ },
      });
      return ref;
    }, [internalRef]);

    const STATES: AnimationState[] = [
      { name: 'activeChange', slot: 'Items', source: 'data-state', value: 'active' },
    ];

    const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
      { trigger: 'Items.enter', sequence: [{ children: 'li', animation: popIn, stagger: { delay: 30 } }] },
      { trigger: 'activeChange', sequence: [{ target: 'Indicator', fn: 'animatePosition', animation: {
        translateX: { to: '$Active.x' },
        translateY: { to: '$Active.y' },
        width: { to: '$Active.width' },
        height: { to: '$Active.height' },
      } }] },
    ];

    const animRefs = React.useMemo(() => ({
      Items: internalRef as React.RefObject<HTMLElement | null>,
      Indicator: indicatorRef,
      Active: activeRef,
    }), [internalRef]);
    useAnimations(DEFAULT_ANIMATIONS, animRefs, STATES);

    // Horizontal slide animation for newly appearing page numbers via deps trigger
    const rangeKey = JSON.stringify(range);

    const slideConfig: AnimationTrigger[] = React.useMemo(() => [{
      trigger: 'Items.slide',
      deps: [rangeKey],
      sequence: [{
        target: 'Items',
        children: '[data-entering]',
        stagger: { delay: 20 },
        animation: {
          opacity: { to: 1, ease: paginationEase },
          translateX: { to: 0, ease: paginationEase },
          scale: { to: 1, ease: paginationEase },
        },
      }],
      vars: (el: HTMLElement) => {
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

        // Clear previous data-entering attrs
        el.querySelectorAll('[data-entering]').forEach((child) => {
          (child as HTMLElement).removeAttribute('data-entering');
        });

        if (newNumbers.size === 0) return {};

        const liElements = el.querySelectorAll<HTMLElement>('li');
        const offset = direction * 16;
        range.forEach((item, i) => {
          if (typeof item === 'number' && newNumbers.has(item) && liElements[i]) {
            const li = liElements[i];
            li.setAttribute('data-entering', '');
            li.style.opacity = '0';
            li.style.transform = `translateX(${offset}px) scale(0.9)`;
          }
        });

        return {};
      },
      onComplete: () => {
        const ul = internalRef.current;
        if (ul) {
          ul.querySelectorAll('[data-entering]').forEach((child) => {
            (child as HTMLElement).removeAttribute('data-entering');
          });
        }
      },
    }], [rangeKey, range, page]); // eslint-disable-line react-hooks/exhaustive-deps

    useAnimations(slideConfig, animRefs);

    return {
      render() {
        const itemsSp = sp('items');
        const { className: itemsSpClass, style: itemsSpStyle, ...itemsSpRest } = itemsSp as Record<string, unknown>;
        const itemSp = sp('item');
        const { className: itemSpClass, style: itemSpStyle, ...itemSpRest } = itemSp as Record<string, unknown>;
        const ellipsisSp = sp('ellipsis');
        const { className: ellipsisSpClass, style: ellipsisSpStyle, ...ellipsisSpRest } = ellipsisSp as Record<string, unknown>;
        const indicatorSp = sp('indicator');
        const { className: indSpClass, style: indSpStyle, ...indSpRest } = indicatorSp as Record<string, unknown>;

        let dotsIndex = 0;

        return (
          <ul
            {...attrs}
            {...itemsSpRest}
            ref={ref}
            className={cx('items', props.className, itemsSpClass as string | undefined)}
            style={{ ...props.style, ...(itemsSpStyle as React.CSSProperties) }}
          >
            {range.map((item) => {
              if (item === 'dots') {
                const key = `dots-${dotsIndex++}`;
                return (
                  <li key={key} aria-hidden="true">
                    <span
                      {...ellipsisSpRest}
                      className={cx('ellipsis', ellipsisSpClass as string | undefined)}
                      style={ellipsisSpStyle as React.CSSProperties}
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
                    itemSpRest={itemSpRest}
                    itemSpClass={itemSpClass as string | undefined}
                    itemSpStyle={itemSpStyle as React.CSSProperties | undefined}
                    cx={cx}
                    isActive={isActive}
                    pageNumber={item}
                    onSelect={setPage}
                  />
                </li>
              );
            })}
            <div
              {...indSpRest}
              ref={indicatorRef as React.Ref<HTMLDivElement>}
              aria-hidden="true"
              className={cx('indicator', indSpClass as string | undefined)}
              style={indSpStyle as React.CSSProperties}
            />
          </ul>
        );
      },
    };
  },
});

// =============================================================================
// PageButton -- internal component with interactive animation per item
// =============================================================================

const PAGE_BUTTON_ANIMATIONS: AnimationTrigger[] = [
  { trigger: 'Btn.hover', sequence: [{ animation: scaleUp }] },
  { trigger: 'Btn.press', sequence: [{ animation: scaleDown }] },
];

interface PageButtonProps {
  itemSpRest: Record<string, unknown>;
  itemSpClass: string | undefined;
  itemSpStyle: React.CSSProperties | undefined;
  cx: (...args: any[]) => string;
  isActive: boolean;
  pageNumber: number;
  onSelect: (page: number) => void;
}

function PageButton({ itemSpRest, itemSpClass, itemSpStyle, cx, isActive, pageNumber, onSelect }: PageButtonProps) {
  const btnRef = React.useRef<HTMLElement | null>(null);
  const btnRefs = React.useMemo(() => ({ Btn: btnRef }), []);
  const { handlers } = useAnimations(PAGE_BUTTON_ANIMATIONS, btnRefs);

  return (
    <button
      {...itemSpRest}
      ref={btnRef as React.Ref<HTMLButtonElement>}
      type="button"
      aria-label={`Go to page ${pageNumber}`}
      aria-current={isActive ? 'page' : undefined}
      data-state={isActive ? 'active' : undefined}
      className={cx('item', itemSpClass)}
      style={itemSpStyle}
      onClick={() => onSelect(pageNumber)}
      onMouseEnter={() => handlers.Btn?.onMouseEnter?.()}
      onMouseLeave={() => handlers.Btn?.onMouseLeave?.()}
      onMouseDown={() => handlers.Btn?.onMouseDown?.()}
      onMouseUp={() => handlers.Btn?.onMouseUp?.()}
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
