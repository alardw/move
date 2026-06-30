'use client';

import * as React from 'react';
import { withMoveComponent, useMergedRef, useControlledState } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useAnimations, resolveAnimationsConfig } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import styles from './Table.module.css';

// ============================================================================
// Default animations
// ============================================================================

const DEFAULT_TABLE_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Body.enter',
    sequence: [
      {
        target: 'Body',
        children: 'tr',
        stagger: { delay: 40 },
        animation: {
          opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 },
          translateY: { from: 8, to: 0, ease: 'outQuart', duration: 200 },
        },
      },
    ],
  },
];

// ============================================================================
// Context
// ============================================================================

interface TableContextValue {
  animConfig: AnimationTrigger[] | false | null;
  /** Column labels, ordered by position in the header row. Populated by
   *  Table.Header's effect; consumed by body rows to inject data-label
   *  onto each cell for stack-mode column labeling. */
  headerLabels: string[];
  registerHeaderLabels: (labels: string[]) => void;
}

const TableContext = React.createContext<TableContextValue | null>(null);

/** Truthy when the current row is rendered inside <Table.Body>. Body
 *  rows get data-label injection; header/footer rows do not. */
const TableBodyContext = React.createContext(false);

/** Provided by Table.Group — GroupHeader reads this to wire its
 *  toggle and chevron, and to know whether this group is collapsible
 *  at all. Rows further down read `open` to honor the current state. */
interface TableGroupContextValue {
  open: boolean;
  setOpen: (value: boolean) => void;
  collapsible: boolean;
}
const TableGroupContext = React.createContext<TableGroupContextValue | null>(null);

// ============================================================================
// Utilities
// ============================================================================

function extractText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node))
    return extractText((node.props as { children?: React.ReactNode }).children);
  return '';
}

// ============================================================================
// Root
// ============================================================================

export type TableVariant = 'surface' | 'lines' | 'bordered' | 'ghost';
export type TableSize = 'sm' | 'md' | 'lg';
export type TableResponsive = 'scroll' | 'stack' | 'none';

export interface TableRootProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  variant?: TableVariant;
  size?: TableSize;
  /** Zebra-stripe body rows. Composes with any variant. */
  striped?: boolean;
  /** Tint rows on hover. */
  hoverable?: boolean;
  /** Stick the header to the top while the body scrolls. */
  stickyHeader?: boolean;
  /** Responsive strategy.
   *  - `scroll` (default): wrap in an overflow-x container
   *  - `stack`: flip to per-row stacked blocks below `stackBelow`
   *  - `none`: opt out of any wrapper behavior
   */
  responsive?: TableResponsive;
  /** Container-width breakpoint (in px) below which stack mode
   *  activates. Only used when `responsive === 'stack'`. Default 640. */
  stackBelow?: number;
  animations?: AnimationTrigger[] | false;
  sp?: SlotPropsMap<'root'>;
}

const TableRoot = withMoveComponent<'root', TableRootProps, HTMLTableElement>({
  name: 'Table',
  styles,
  slots: ['root'] as const,
  defaults: {
    variant: 'lines' as TableVariant,
    size: 'md' as TableSize,
    responsive: 'scroll' as TableResponsive,
    stackBelow: 640,
  },
  moveProps: [
    'variant',
    'size',
    'striped',
    'hoverable',
    'stickyHeader',
    'responsive',
    'stackBelow',
    'animations',
  ],

  setup({ props, ref, cx, sp, attrs }) {
    const {
      className,
      style,
      children,
      variant,
      size,
      striped,
      hoverable,
      stickyHeader,
      responsive,
      stackBelow,
      animations: animationsProp,
    } = props;

    const animConfig = resolveAnimationsConfig(
      DEFAULT_TABLE_ANIMATIONS,
      animationsProp as AnimationTrigger[] | false | undefined,
    );

    const [headerLabels, setHeaderLabels] = React.useState<string[]>([]);
    const registerHeaderLabels = React.useCallback((labels: string[]) => {
      setHeaderLabels((prev) => {
        if (prev.length === labels.length && prev.every((l, i) => l === labels[i])) return prev;
        return labels;
      });
    }, []);

    const contextValue = React.useMemo<TableContextValue>(
      () => ({ animConfig, headerLabels, registerHeaderLabels }),
      [animConfig, headerLabels, registerHeaderLabels],
    );

    // Stack-mode detection — observe the wrapper's width when responsive
    // is 'stack' and toggle a data attribute on the table when below the
    // breakpoint. Uses ResizeObserver rather than a @container query
    // because CSS container queries can't accept dynamic values.
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const [isStacked, setIsStacked] = React.useState(false);

    React.useEffect(() => {
      if (responsive !== 'stack') {
        setIsStacked(false);
        return;
      }
      const el = wrapperRef.current;
      if (!el || typeof ResizeObserver === 'undefined') return;
      const threshold = typeof stackBelow === 'number' ? stackBelow : 640;
      const ro = new ResizeObserver(([entry]) => {
        if (!entry) return;
        setIsStacked(entry.contentRect.width < threshold);
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [responsive, stackBelow]);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const table = (
          <table
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', className, spClass as string | undefined)}
            style={{ ...style, ...(spStyle as React.CSSProperties) }}
            data-variant={variant as string}
            data-size={size as string}
            data-striped={striped ? '' : undefined}
            data-hoverable={hoverable ? '' : undefined}
            data-sticky-header={stickyHeader ? '' : undefined}
            data-stack={isStacked ? '' : undefined}
          >
            {children}
          </table>
        );

        return (
          <TableContext.Provider value={contextValue}>
            <div
              ref={wrapperRef}
              className={styles.scrollWrapper}
              data-responsive={responsive as string}
            >
              {table}
            </div>
          </TableContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// Header
// ============================================================================

export interface TableHeaderProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'header'>;
}

/**
 * Walk <Table.Header>'s children to pull text out of each <th> (Table.Head)
 * in the first row. Used as the label source for stack-mode cells.
 */
function collectHeaderLabels(children: React.ReactNode): string[] {
  const labels: string[] = [];
  React.Children.forEach(children, (row) => {
    if (!React.isValidElement(row)) return;
    const rowChildren = (row.props as { children?: React.ReactNode }).children;
    React.Children.forEach(rowChildren, (cell) => {
      if (!React.isValidElement(cell)) return;
      labels.push(extractText((cell.props as { children?: React.ReactNode }).children));
    });
  });
  return labels;
}

const TableHeader = withMoveComponent<'header', TableHeaderProps, HTMLTableSectionElement>({
  name: 'TableHeader',
  styles,
  slots: ['header'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const tableCtx = React.useContext(TableContext);
    const childrenForEffect = props.children;

    React.useEffect(() => {
      if (!tableCtx) return;
      tableCtx.registerHeaderLabels(collectHeaderLabels(childrenForEffect));
    }, [tableCtx, childrenForEffect]);

    return {
      render() {
        const headerSp = sp('header');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = headerSp as Record<string, unknown>;
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

export interface TableBodyProps extends React.HTMLAttributes<HTMLElement> {
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

    const bodyRefs = React.useMemo(
      () => ({
        Body: bodyRef as React.RefObject<HTMLElement | null>,
      }),
      [],
    );

    useAnimations(tableCtx?.animConfig ?? null, bodyRefs);

    return {
      render() {
        const bodySp = sp('body');
        const { className: spClass, style: spStyle, ...spRest } = bodySp as Record<string, unknown>;
        return (
          <TableBodyContext.Provider value={true}>
            <tbody
              {...attrs}
              {...spRest}
              ref={mergedRef}
              className={cx('body', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            >
              {props.children}
            </tbody>
          </TableBodyContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// Footer
// ============================================================================

export interface TableFooterProps extends React.HTMLAttributes<HTMLElement> {
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = footerSp as Record<string, unknown>;
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

export interface TableRowProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  selected?: boolean;
  /** Make the whole row clickable. Adds role="button", tabIndex=0,
   *  keyboard (Enter/Space) → onClick, hover tint, and cursor pointer.
   *  Does not give link semantics — use an anchor overlay inside a
   *  cell if you need middle-click / right-click "open in new tab". */
  interactive?: boolean;
  onClick?: (event: React.MouseEvent<HTMLTableRowElement>) => void;
  animations?: AnimationTrigger[] | false;
  sp?: SlotPropsMap<'row'>;
}

const TableRow = withMoveComponent<'row', TableRowProps, HTMLTableRowElement>({
  name: 'TableRow',
  styles,
  slots: ['row'] as const,
  moveProps: ['selected', 'interactive', 'animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const { className, style, children, selected, interactive, animations: animationsProp } = props;
    const onClick = props.onClick as
      ((e: React.MouseEvent<HTMLTableRowElement>) => void) | undefined;
    const tableCtx = React.useContext(TableContext);
    const inBody = React.useContext(TableBodyContext);

    const rowRef = React.useRef<HTMLTableRowElement | null>(null);
    const mergedRef = useMergedRef<HTMLTableRowElement>(ref, rowRef);

    // Row-level event animations (hover/press) — users opt in via animations prop
    const DEFAULT_ANIMATIONS: AnimationTrigger[] = [];
    const animConfig =
      (animationsProp as AnimationTrigger[] | false | undefined) === false
        ? null
        : resolveAnimationsConfig(
            DEFAULT_ANIMATIONS,
            animationsProp as AnimationTrigger[] | undefined,
          );

    const rowRefs = React.useMemo(
      () => ({ Row: rowRef as React.RefObject<HTMLElement | null> }),
      [],
    );
    const { handlers } = useAnimations(animConfig, rowRefs);

    return {
      render() {
        const rowSp = sp('row');
        const { className: spClass, style: spStyle, ...spRest } = rowSp as Record<string, unknown>;

        // Only body rows get column-label injection — header rows ARE
        // the label source, and footers typically render totals that
        // don't line up 1:1 with column headers.
        let content = children;
        if (inBody && tableCtx && tableCtx.headerLabels.length > 0) {
          const labels = tableCtx.headerLabels;
          content = React.Children.map(children, (child, idx) => {
            if (!React.isValidElement(child)) return child;
            const label = labels[idx];
            if (!label) return child;
            return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
              'data-label': label,
            });
          });
        }

        const interactiveHandlers = interactive
          ? {
              role: 'button' as const,
              tabIndex: 0,
              onKeyDown: (e: React.KeyboardEvent<HTMLTableRowElement>) => {
                if (!onClick) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  // Synthesize a click so downstream handlers see the
                  // same event shape they'd see from a mouse click.
                  (e.currentTarget as HTMLElement).click();
                }
              },
            }
          : {};

        return (
          <tr
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('row', className, spClass as string | undefined)}
            style={{ ...style, ...(spStyle as React.CSSProperties) }}
            data-state={selected ? 'selected' : undefined}
            data-interactive={interactive ? '' : undefined}
            onClick={onClick}
            onMouseEnter={() => handlers.Row?.onMouseEnter?.()}
            onMouseLeave={() => handlers.Row?.onMouseLeave?.()}
            onMouseDown={() => handlers.Row?.onMouseDown?.()}
            onMouseUp={() => handlers.Row?.onMouseUp?.()}
            {...interactiveHandlers}
          >
            {content}
          </tr>
        );
      },
    };
  },
});

// ============================================================================
// Head
// ============================================================================

export type TableAlign = 'start' | 'center' | 'end';

export interface TableHeadProps extends Omit<
  React.ThHTMLAttributes<HTMLTableCellElement>,
  'align'
> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | false;
  onSort?: () => void;
  /** Column alignment — applies to the head and propagates as a
   *  convention to the cells in that column (consumer sets it
   *  explicitly on each Cell for now). */
  align?: TableAlign;
  sp?: SlotPropsMap<'head'>;
}

const TableHead = withMoveComponent<'head', TableHeadProps, HTMLTableCellElement>({
  name: 'TableHead',
  styles,
  slots: ['head'] as const,
  moveProps: ['sortable', 'sorted', 'onSort', 'align'],

  setup({ props, ref, cx, sp, attrs }) {
    const { className, style, children, sortable, sorted, onSort, align } = props;

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
            data-align={align as string | undefined}
            aria-sort={
              sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined
            }
            onClick={sortable ? handleClick : undefined}
            onKeyDown={sortable ? handleKeyDown : undefined}
            tabIndex={sortable ? 0 : undefined}
            role={sortable ? 'columnheader' : undefined}
          >
            <span className={styles.headContent}>
              {children}
              {sortable && (
                <span className={styles.sortIcon} aria-hidden="true">
                  {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}
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

export interface TableCellProps extends Omit<
  React.TdHTMLAttributes<HTMLTableCellElement>,
  'align'
> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Column alignment. */
  align?: TableAlign;
  /** When set, the cell renders its children as a primary line with
   *  this muted description below — the TW-Plus "Name / email" cell. */
  description?: React.ReactNode;
  sp?: SlotPropsMap<'cell'>;
}

const TableCell = withMoveComponent<'cell', TableCellProps, HTMLTableCellElement>({
  name: 'TableCell',
  styles,
  slots: ['cell'] as const,
  moveProps: ['align', 'description'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const cellSp = sp('cell');
        const { className: spClass, style: spStyle, ...spRest } = cellSp as Record<string, unknown>;

        const description = props.description as React.ReactNode;
        const content =
          description != null ? (
            <div className={styles.cellStack}>
              <div className={styles.cellPrimary}>{props.children}</div>
              <div className={styles.cellDescription}>{description}</div>
            </div>
          ) : (
            props.children
          );

        return (
          <td
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('cell', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-align={props.align as string | undefined}
          >
            {content}
          </td>
        );
      },
    };
  },
});

// ============================================================================
// Caption
// ============================================================================

export interface TableCaptionProps extends React.HTMLAttributes<HTMLElement> {
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = captionSp as Record<string, unknown>;
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
// Group — one <tbody> per group, toggles open/close via context
// ============================================================================

export interface TableGroupProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** When true (default), the group can be collapsed by clicking its
   *  GroupHeader. When false, the group is a static section — its
   *  header renders without a chevron or click behavior. */
  collapsible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  sp?: SlotPropsMap<'group'>;
}

const TableGroup = withMoveComponent<'group', TableGroupProps, HTMLTableSectionElement>({
  name: 'TableGroup',
  styles,
  slots: ['group'] as const,
  defaults: { defaultOpen: true, collapsible: true },
  moveProps: ['collapsible', 'open', 'defaultOpen', 'onOpenChange'],

  setup({ props, ref, cx, sp, attrs }) {
    const collapsible = (props.collapsible as boolean | undefined) ?? true;
    const [open, setOpen] = useControlledState<boolean>({
      value: props.open as boolean | undefined,
      defaultValue: (props.defaultOpen as boolean | undefined) ?? true,
      onChange: props.onOpenChange as ((v: boolean) => void) | undefined,
    });

    // Static groups are always "open" — the state machine is skipped
    // so there's no way for a child to put a non-collapsible group
    // into a closed state.
    const effectiveOpen = collapsible ? open : true;
    const groupCtx = React.useMemo(
      () => ({ open: effectiveOpen, setOpen, collapsible }),
      [effectiveOpen, setOpen, collapsible],
    );

    return {
      render() {
        const groupSp = sp('group');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = groupSp as Record<string, unknown>;

        return (
          // Each Group is its own <tbody> so rows don't interleave with
          // other groups and HTML semantics stay clean. Multiple tbodys
          // per table are valid.
          <TableBodyContext.Provider value={true}>
            <TableGroupContext.Provider value={groupCtx}>
              <tbody
                {...attrs}
                {...spRest}
                ref={ref}
                className={cx('group', props.className, spClass as string | undefined)}
                style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
                data-open={effectiveOpen ? 'true' : 'false'}
                data-collapsible={collapsible ? '' : undefined}
              >
                {props.children}
              </tbody>
            </TableGroupContext.Provider>
          </TableBodyContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// GroupHeader — clickable row that toggles the enclosing Group
// ============================================================================

export interface TableGroupHeaderProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Number of columns the header spans. Defaults to the column count
   *  inferred from Table's header row. */
  colSpan?: number;
  sp?: SlotPropsMap<'groupHeader'>;
}

const TableGroupHeader = withMoveComponent<
  'groupHeader',
  TableGroupHeaderProps,
  HTMLTableRowElement
>({
  name: 'TableGroupHeader',
  styles,
  slots: ['groupHeader'] as const,
  moveProps: ['colSpan'],

  setup({ props, ref, cx, sp, attrs }) {
    const tableCtx = React.useContext(TableContext);
    const groupCtx = React.useContext(TableGroupContext);
    if (!groupCtx) {
      throw new Error('Table.GroupHeader must be used inside Table.Group');
    }

    const toggle = () => groupCtx.setOpen(!groupCtx.open);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    };

    const inferredSpan = tableCtx?.headerLabels.length || 1;
    const span = (props.colSpan as number | undefined) ?? inferredSpan;

    return {
      render() {
        const ghSp = sp('groupHeader');
        const { className: spClass, style: spStyle, ...spRest } = ghSp as Record<string, unknown>;
        const collapsible = groupCtx.collapsible;
        // Pass styles.row as an extra (it's the hashed CSS-module class)
        // so the tr carries both `row` and `groupHeader` hashed classes.
        // The `.row:not(.groupHeader)` selector in the stylesheet relies
        // on the :not() matching the hashed class on the element — we
        // can't pass 'row' as a second slot-literal because cx only
        // resolves the first argument against styles.
        return (
          <tr
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx(
              'groupHeader',
              styles.row,
              props.className,
              spClass as string | undefined,
            )}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            role={collapsible ? 'button' : undefined}
            tabIndex={collapsible ? 0 : undefined}
            aria-expanded={collapsible ? groupCtx.open : undefined}
            onClick={collapsible ? toggle : undefined}
            onKeyDown={collapsible ? handleKeyDown : undefined}
          >
            <td className={styles.groupHeaderCell} colSpan={span}>
              {collapsible && (
                <span className={styles.groupChevron} aria-hidden="true">
                  {'›'}
                </span>
              )}
              {props.children}
            </td>
          </tr>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Table = Object.assign(TableRoot, {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
  Group: TableGroup,
  GroupHeader: TableGroupHeader,
});
