'use client';
// Generated from Grid.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import styles from './Grid.module.css';

// ============================================================================
// Types
// ============================================================================

export type GridGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';

export type GridPadding = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';

export interface GridProps extends Record<string, unknown> {
  /** Equal-width columns (shorthand for repeat(N, 1fr)) */
  cols?: number;
  /** Equal-height rows (shorthand for repeat(N, 1fr)) */
  rows?: number;
  /** Total columns for span-based mode (default 12) */
  columns?: number;
  /** Auto-fit: minimum child width before wrapping (e.g. "200px") */
  minChildWidth?: string;
  /** Gap between grid items */
  gap?: GridGap;
  /** Row gap override */
  rowGap?: GridGap;
  /** Column gap override */
  columnGap?: GridGap;
  /** Padding using spacing scale */
  padding?: GridPadding;
  /** Container width (px) below which grid collapses to 1 column */
  collapseBelow?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'root'>;
}

export interface GridCellProps extends Record<string, unknown> {
  /** Column span */
  span?: number;
  /** Row span */
  rowSpan?: number;
  /** Columns to skip before this cell */
  offset?: number;
  /** Visual order */
  order?: number;
  /** Self-alignment within the grid cell */
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'cell'>;
}

// ============================================================================
// Helpers
// ============================================================================

const GAP_MAP: Record<string, string> = {
  none: '0',
  xs: 'var(--move-spacing-xs)',
  sm: 'var(--move-spacing-sm)',
  md: 'var(--move-spacing-md)',
  lg: 'var(--move-spacing-lg)',
  xl: 'var(--move-spacing-xl)',
};

const ALIGN_SELF_MAP: Record<string, string> = {
  start: 'start',
  center: 'center',
  end: 'end',
  stretch: 'stretch',
};

function resolveGap(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return GAP_MAP[value] || value;
}

function getGridTemplate(props: GridProps): string {
  const minChildWidth = props.minChildWidth as string | undefined;
  const cols = props.cols as number | undefined;
  const columns = props.columns as number | undefined;

  if (minChildWidth) {
    return `repeat(auto-fill, minmax(${minChildWidth}, 1fr))`;
  }
  if (cols) {
    return `repeat(${cols}, 1fr)`;
  }
  if (columns) {
    return `repeat(${columns}, 1fr)`;
  }
  return 'repeat(12, 1fr)';
}

// ============================================================================
// Grid (Root)
// ============================================================================

const GridRoot = withMoveComponent<'root', GridProps, HTMLDivElement>({
  name: 'Grid',
  styles,
  slots: ['root'] as const,
  defaults: { gap: 'md' as GridGap },
  moveProps: ['cols', 'rows', 'columns', 'minChildWidth', 'rowGap', 'columnGap', 'padding', 'collapseBelow'],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const collapseBelow = props.collapseBelow as string | undefined;

    React.useEffect(() => {
      const el = internalRef.current;
      if (!el || !collapseBelow) return;

      const threshold = parseFloat(collapseBelow);
      if (isNaN(threshold)) return;

      const observer = new ResizeObserver((entries) => {
        const width = entries[0].contentRect.width;
        if (width < threshold) {
          el.dataset.collapsed = '';
        } else {
          delete el.dataset.collapsed;
        }
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, [collapseBelow, internalRef]);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const gap = props.gap as string;
        const rowGap = props.rowGap as string | undefined;
        const columnGap = props.columnGap as string | undefined;
        const rows = props.rows as number | undefined;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            data-padding={props.padding as string | undefined}
            style={{
              '--_grid-template': getGridTemplate(props as GridProps),
              '--_grid-rows': rows ? `repeat(${rows}, 1fr)` : undefined,
              gap: resolveGap(gap),
              rowGap: resolveGap(rowGap),
              columnGap: resolveGap(columnGap),
              ...(props.style as React.CSSProperties),
              ...(spStyle as React.CSSProperties),
            } as React.CSSProperties}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Grid.Cell
// ============================================================================

const GridCell = withMoveComponent<'cell', GridCellProps, HTMLDivElement>({
  name: 'GridCell',
  styles,
  slots: ['cell'] as const,
  moveProps: ['span', 'rowSpan', 'offset', 'order', 'align'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const cellSp = sp('cell');
        const { className: spClass, style: spStyle, ...spRest } = cellSp as Record<string, unknown>;

        const span = props.span as number | undefined;
        const rowSpan = props.rowSpan as number | undefined;
        const offset = props.offset as number | undefined;
        const order = props.order as number | undefined;
        const align = props.align as string | undefined;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('cell', props.className, spClass as string | undefined)}
            style={{
              gridColumn: span
                ? offset
                  ? `${offset + 1} / span ${span}`
                  : `span ${span}`
                : offset
                  ? `${offset + 1}`
                  : undefined,
              gridRow: rowSpan ? `span ${rowSpan}` : undefined,
              order,
              alignSelf: align ? ALIGN_SELF_MAP[align] : undefined,
              ...(props.style as React.CSSProperties),
              ...(spStyle as React.CSSProperties),
            }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Grid = Object.assign(GridRoot, {
  Cell: GridCell,
});
