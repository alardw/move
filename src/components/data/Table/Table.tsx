'use client';

import * as React from 'react';
import { animate, type JSAnimation } from 'animejs';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import {
  toAnimeParams,
  prefersReducedMotion,
  mergeAnimateConfig,
  getInitialStyles,
} from '../../../animation/utils';
import type {
  ListAnimate,
  ListItemAnimate,
  Animation,
  StaggerConfig,
} from '../../../animation/types';
import styles from './Table.module.css';

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
  pt?: PassThrough<'root'>;
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

  setup({ props, ref, cx, ptm, attrs }) {
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
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;
        return (
          <TableContext.Provider value={contextValue}>
            <table
              {...attrs}
              {...ptRest}
              ref={ref}
              className={cx('root', className, ptClass as string | undefined)}
              style={{ ...style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'header'>;
}

const TableHeader = withMoveComponent<'header', TableHeaderProps, HTMLTableSectionElement>({
  name: 'TableHeader',
  styles,
  slots: ['header'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const headerPt = ptm('header');
        const { className: ptClass, style: ptStyle, ...ptRest } = headerPt as Record<string, unknown>;
        return (
          <thead
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('header', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'body'>;
}

const TableBody = withMoveComponent<'body', TableBodyProps, HTMLTableSectionElement>({
  name: 'TableBody',
  styles,
  slots: ['body'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const bodyPt = ptm('body');
        const { className: ptClass, style: ptStyle, ...ptRest } = bodyPt as Record<string, unknown>;
        return (
          <tbody
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('body', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'footer'>;
}

const TableFooter = withMoveComponent<'footer', TableFooterProps, HTMLTableSectionElement>({
  name: 'TableFooter',
  styles,
  slots: ['footer'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const footerPt = ptm('footer');
        const { className: ptClass, style: ptStyle, ...ptRest } = footerPt as Record<string, unknown>;
        return (
          <tfoot
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('footer', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'row'>;
}

const defaultRowAnimation: ListItemAnimate = {};

const rowHoverAnims = new WeakMap<HTMLElement, JSAnimation>();

const TableRow = withMoveComponent<'row', TableRowProps, HTMLTableRowElement>({
  name: 'TableRow',
  styles,
  slots: ['row'] as const,
  moveProps: ['selected', 'animate'],

  setup({ props, ref, cx, ptm, attrs }) {
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
        const rowPt = ptm('row');
        const { className: ptClass, style: ptStyle, ...ptRest } = rowPt as Record<string, unknown>;
        return (
          <tr
            {...attrs}
            {...ptRest}
            ref={mergedRef}
            className={cx('row', className, ptClass as string | undefined)}
            style={{ ...initialStyles, ...style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'head'>;
}

const TableHead = withMoveComponent<'head', TableHeadProps, HTMLTableCellElement>({
  name: 'TableHead',
  styles,
  slots: ['head'] as const,
  moveProps: ['sortable', 'sorted', 'onSort'],

  setup({ props, ref, cx, ptm, attrs }) {
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
        const headPt = ptm('head');
        const { className: ptClass, style: ptStyle, ...ptRest } = headPt as Record<string, unknown>;
        return (
          <th
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('head', className, ptClass as string | undefined)}
            style={{ ...style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'cell'>;
}

const TableCell = withMoveComponent<'cell', TableCellProps, HTMLTableCellElement>({
  name: 'TableCell',
  styles,
  slots: ['cell'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const cellPt = ptm('cell');
        const { className: ptClass, style: ptStyle, ...ptRest } = cellPt as Record<string, unknown>;
        return (
          <td
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('cell', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'caption'>;
}

const TableCaption = withMoveComponent<'caption', TableCaptionProps, HTMLTableCaptionElement>({
  name: 'TableCaption',
  styles,
  slots: ['caption'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const captionPt = ptm('caption');
        const { className: ptClass, style: ptStyle, ...ptRest } = captionPt as Record<string, unknown>;
        return (
          <caption
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('caption', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
