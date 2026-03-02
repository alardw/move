'use client';

import * as React from 'react';
import { animate, type JSAnimation } from 'animejs';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import {
  toAnimeParams,
  prefersReducedMotion,
  mergeAnimateConfig,
  getInitialStyles,
} from '../../../animation';
import type {
  LifecycleAnimate,
  InteractionAnimate,
  StaggerModifier,
  Animation,
  StaggerConfig,
} from '../../../animation';
import styles from './Table.module.css';

// ============================================================================
// Local type aliases (spec refers to these as ListAnimate / ListItemAnimate)
// ============================================================================

type ListAnimate = LifecycleAnimate & StaggerModifier;
type ListItemAnimate = InteractionAnimate;

// ============================================================================
// Context
// ============================================================================

interface TableContextValue {
  stagger?: StaggerConfig;
  enterAnimation?: Animation;
  getRowIndex: () => number;
}

const TableContext = React.createContext<TableContextValue | null>(null);

function useTableContext() {
  return React.useContext(TableContext);
}

// ============================================================================
// Root
// ============================================================================

export type TableVariant = 'default' | 'striped';
export type TableSize = 'sm' | 'md' | 'lg';

export interface TableRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  variant?: TableVariant;
  size?: TableSize;
  bordered?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;
  animate?: ListAnimate | false;
  sp?: SlotPropsMap<'root'>;
}

const defaultRootAnimation: ListAnimate = {
  enter: {
    opacity: { value: [0, 1], easing: 'outQuart' },
    translateY: { value: [8, 0], easing: 'outQuart' },
  },
  stagger: { delay: 40 },
};

const TableRoot = withMoveComponent<'root', TableRootProps, HTMLTableElement>({
  name: 'Table',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'default', size: 'md' },
  moveProps: ['variant', 'size', 'bordered', 'hoverable', 'stickyHeader', 'animate'],

  setup({ props, ref, cx, sp, attrs }) {
    const {
      className,
      style,
      children,
      variant,
      size,
      bordered,
      hoverable,
      stickyHeader,
      animate: animateProp,
    } = props;

    const rowIndexRef = React.useRef(0);

    const config = animateProp === false
      ? { enter: undefined, stagger: undefined }
      : mergeAnimateConfig(defaultRootAnimation, animateProp as ListAnimate | undefined);

    const getRowIndex = React.useCallback(() => rowIndexRef.current++, []);

    React.useEffect(() => { rowIndexRef.current = 0; });

    const contextValue: TableContextValue = {
      stagger: config.stagger,
      enterAnimation: config.enter,
      getRowIndex,
    };

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        return (
          <TableContext.Provider value={contextValue}>
            <table
              {...attrs}
              {...spRest}
              ref={ref}
              className={cx('root', className, spClass as string | undefined)}
              style={{ ...style, ...(spStyle as React.CSSProperties) }}
              data-variant={variant}
              data-size={size}
              data-bordered={bordered ? '' : undefined}
              data-hoverable={hoverable ? '' : undefined}
              data-sticky-header={stickyHeader ? '' : undefined}
            >
              {children}
            </table>
          </TableContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// Header
// ============================================================================

export interface TableHeaderProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'header'>;
}

const TableHeader = withMoveComponent<'header', TableHeaderProps, HTMLTableSectionElement>({
  name: 'TableHeader',
  styles,
  slots: ['header'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const headerSp = sp('header');
        const { className: spClass, style: spStyle, ...spRest } = headerSp as Record<string, unknown>;
        return (
          <thead
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('header', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </thead>
        );
      },
    };
  },
});

// ============================================================================
// Body
// ============================================================================

export interface TableBodyProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'body'>;
}

const TableBody = withMoveComponent<'body', TableBodyProps, HTMLTableSectionElement>({
  name: 'TableBody',
  styles,
  slots: ['body'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const bodySp = sp('body');
        const { className: spClass, style: spStyle, ...spRest } = bodySp as Record<string, unknown>;
        return (
          <tbody
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('body', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </tbody>
        );
      },
    };
  },
});

// ============================================================================
// Footer
// ============================================================================

export interface TableFooterProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'footer'>;
}

const TableFooter = withMoveComponent<'footer', TableFooterProps, HTMLTableSectionElement>({
  name: 'TableFooter',
  styles,
  slots: ['footer'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const footerSp = sp('footer');
        const { className: spClass, style: spStyle, ...spRest } = footerSp as Record<string, unknown>;
        return (
          <tfoot
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('footer', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </tfoot>
        );
      },
    };
  },
});

// ============================================================================
// Row
// ============================================================================

export interface TableRowProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  selected?: boolean;
  animate?: ListItemAnimate | false;
  sp?: SlotPropsMap<'row'>;
}

const defaultRowAnimation: ListItemAnimate = {};

const rowHoverAnims = new WeakMap<HTMLElement, JSAnimation>();

const TableRow = withMoveComponent<'row', TableRowProps, HTMLTableRowElement>({
  name: 'TableRow',
  styles,
  slots: ['row'] as const,
  moveProps: ['selected', 'animate'],

  setup({ props, ref, cx, sp, attrs }) {
    const { className, style, children, selected, animate: animateProp } = props;
    const tableContext = useTableContext();
    const indexRef = React.useRef<number | null>(null);
    const rowRef = React.useRef<HTMLTableRowElement | null>(null);
    const hasAnimated = React.useRef(false);

    const mergedRef = useMergedRef<HTMLTableRowElement>(ref, rowRef);

    if (indexRef.current === null && tableContext) {
      indexRef.current = tableContext.getRowIndex();
    }

    const config = animateProp === false
      ? { enter: undefined, hover: undefined }
      : mergeAnimateConfig(defaultRowAnimation, animateProp as ListItemAnimate | undefined);

    // Stagger enter animation from table context
    const enterAnim = tableContext?.enterAnimation;
    const staggerConfig = tableContext?.stagger;

    const initialStyles = React.useMemo(() => {
      if (!enterAnim) return {};
      return getInitialStyles(enterAnim);
    }, [enterAnim]);

    React.useEffect(() => {
      const el = rowRef.current;
      if (!el || !enterAnim || hasAnimated.current) return;

      hasAnimated.current = true;
      const reducedMotion = prefersReducedMotion();
      const index = indexRef.current ?? 0;
      const delay = (staggerConfig?.delay ?? 0) * index;

      if (reducedMotion) {
        el.style.opacity = '1';
        el.style.transform = '';
        return;
      }

      const params = toAnimeParams(enterAnim);
      animate(el, { ...params, delay });
    }, [enterAnim, staggerConfig]);

    // Row-level hover animation
    const handleMouseEnter = () => {
      if (!rowRef.current || !config.hover || typeof config.hover === 'boolean') return;
      const existing = rowHoverAnims.get(rowRef.current);
      if (existing) existing.pause();
      const params = prefersReducedMotion()
        ? { scale: 1, duration: 0 }
        : toAnimeParams(config.hover);
      const anim = animate(rowRef.current, params);
      rowHoverAnims.set(rowRef.current, anim);
    };

    const handleMouseLeave = () => {
      if (!rowRef.current || !config.hover) return;
      const existing = rowHoverAnims.get(rowRef.current);
      if (existing) existing.pause();
      const anim = animate(rowRef.current, {
        scale: 1,
        duration: prefersReducedMotion() ? 0 : 150,
        ease: 'outQuad',
      });
      rowHoverAnims.set(rowRef.current, anim);
    };

    return {
      render() {
        const rowSp = sp('row');
        const { className: spClass, style: spStyle, ...spRest } = rowSp as Record<string, unknown>;
        return (
          <tr
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('row', className, spClass as string | undefined)}
            style={{ ...initialStyles, ...style, ...(spStyle as React.CSSProperties) }}
            data-state={selected ? 'selected' : undefined}
            onMouseEnter={config.hover ? handleMouseEnter : undefined}
            onMouseLeave={config.hover ? handleMouseLeave : undefined}
          >
            {children}
          </tr>
        );
      },
    };
  },
});

// ============================================================================
// Head
// ============================================================================

export interface TableHeadProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | false;
  onSort?: () => void;
  sp?: SlotPropsMap<'head'>;
}

const TableHead = withMoveComponent<'head', TableHeadProps, HTMLTableCellElement>({
  name: 'TableHead',
  styles,
  slots: ['head'] as const,
  moveProps: ['sortable', 'sorted', 'onSort'],

  setup({ props, ref, cx, sp, attrs }) {
    const { className, style, children, sortable, sorted, onSort } = props;

    const handleClick = () => {
      if (sortable && onSort) onSort();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (sortable && onSort && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onSort();
      }
    };

    return {
      render() {
        const headSp = sp('head');
        const { className: spClass, style: spStyle, ...spRest } = headSp as Record<string, unknown>;
        return (
          <th
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('head', className, spClass as string | undefined)}
            style={{ ...style, ...(spStyle as React.CSSProperties) }}
            data-sortable={sortable ? '' : undefined}
            data-sorted={sorted || undefined}
            aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
            onClick={sortable ? handleClick : undefined}
            onKeyDown={sortable ? handleKeyDown : undefined}
            tabIndex={sortable ? 0 : undefined}
            role={sortable ? 'columnheader' : undefined}
          >
            <span className={styles.headContent}>
              {children}
              {sortable && (
                <span className={styles.sortIcon} aria-hidden="true">
                  {sorted === 'asc' ? '\u2191' : sorted === 'desc' ? '\u2193' : '\u2195'}
                </span>
              )}
            </span>
          </th>
        );
      },
    };
  },
});

// ============================================================================
// Cell
// ============================================================================

export interface TableCellProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'cell'>;
}

const TableCell = withMoveComponent<'cell', TableCellProps, HTMLTableCellElement>({
  name: 'TableCell',
  styles,
  slots: ['cell'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const cellSp = sp('cell');
        const { className: spClass, style: spStyle, ...spRest } = cellSp as Record<string, unknown>;
        return (
          <td
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('cell', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </td>
        );
      },
    };
  },
});

// ============================================================================
// Caption
// ============================================================================

export interface TableCaptionProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'caption'>;
}

const TableCaption = withMoveComponent<'caption', TableCaptionProps, HTMLTableCaptionElement>({
  name: 'TableCaption',
  styles,
  slots: ['caption'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const captionSp = sp('caption');
        const { className: spClass, style: spStyle, ...spRest } = captionSp as Record<string, unknown>;
        return (
          <caption
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('caption', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </caption>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
});
