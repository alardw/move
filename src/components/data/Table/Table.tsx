'use client';

import * as React from 'react';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import {
  useAnimations,
  resolveAnimationsConfig,
} from '../../../animation';
import type {
  AnimationTrigger,
} from '../../../animation';
import styles from './Table.module.css';

// ============================================================================
// Default animations
// ============================================================================

const DEFAULT_TABLE_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Body.enter',
    sequence: [{
      target: 'Body',
      children: 'tr',
      stagger: { delay: 40 },
      animation: {
        opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 },
        translateY: { from: 8, to: 0, ease: 'outQuart', duration: 200 },
      },
    }],
  },
];

// ============================================================================
// Context
// ============================================================================

interface TableContextValue {
  animConfig: AnimationTrigger[] | false | null;
}

const TableContext = React.createContext<TableContextValue | null>(null);

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
  animations?: AnimationTrigger[] | false;
  sp?: SlotPropsMap<'root'>;
}

const TableRoot = withMoveComponent<'root', TableRootProps, HTMLTableElement>({
  name: 'Table',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'default', size: 'md' },
  moveProps: ['variant', 'size', 'bordered', 'hoverable', 'stickyHeader', 'animations'],

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
      animations: animationsProp,
    } = props;

    const animConfig = resolveAnimationsConfig(
      DEFAULT_TABLE_ANIMATIONS,
      animationsProp as AnimationTrigger[] | false | undefined,
    );

    const contextValue: TableContextValue = { animConfig };

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
    const tableCtx = React.useContext(TableContext);
    const bodyRef = React.useRef<HTMLTableSectionElement>(null);
    const mergedRef = useMergedRef<HTMLTableSectionElement>(ref, bodyRef);

    const bodyRefs = React.useMemo(() => ({
      Body: bodyRef as React.RefObject<HTMLElement | null>,
    }), []);

    useAnimations(tableCtx?.animConfig ?? null, bodyRefs);

    return {
      render() {
        const bodySp = sp('body');
        const { className: spClass, style: spStyle, ...spRest } = bodySp as Record<string, unknown>;
        return (
          <tbody
            {...attrs}
            {...spRest}
            ref={mergedRef}
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
  animations?: AnimationTrigger[] | false;
  sp?: SlotPropsMap<'row'>;
}

const TableRow = withMoveComponent<'row', TableRowProps, HTMLTableRowElement>({
  name: 'TableRow',
  styles,
  slots: ['row'] as const,
  moveProps: ['selected', 'animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const { className, style, children, selected, animations: animationsProp } = props;
    const rowRef = React.useRef<HTMLTableRowElement | null>(null);

    const mergedRef = useMergedRef<HTMLTableRowElement>(ref, rowRef);

    // Row-level event animations (hover/press) — users opt in via animations prop
    const DEFAULT_ANIMATIONS: AnimationTrigger[] = [];
    const animConfig = (animationsProp as AnimationTrigger[] | false | undefined) === false
      ? null
      : resolveAnimationsConfig(DEFAULT_ANIMATIONS, animationsProp as AnimationTrigger[] | undefined);

    const rowRefs = React.useMemo(() => ({ Row: rowRef as React.RefObject<HTMLElement | null> }), []);
    const { handlers } = useAnimations(animConfig, rowRefs);

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
            style={{ ...style, ...(spStyle as React.CSSProperties) }}
            data-state={selected ? 'selected' : undefined}
            onMouseEnter={() => handlers.Row?.onMouseEnter?.()}
            onMouseLeave={() => handlers.Row?.onMouseLeave?.()}
            onMouseDown={() => handlers.Row?.onMouseDown?.()}
            onMouseUp={() => handlers.Row?.onMouseUp?.()}
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
