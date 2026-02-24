'use client';

import * as React from 'react';
import { Slot } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import { Icon } from '../../core/Icon';
import styles from './Breadcrumb.module.css';

// ============================================================================
// Context
// ============================================================================

interface BreadcrumbContextValue {
  separator: React.ReactNode;
}

const BreadcrumbContext = React.createContext<BreadcrumbContextValue | null>(null);

function useBreadcrumbContext() {
  const context = React.useContext(BreadcrumbContext);
  if (!context) throw new Error('Breadcrumb components must be used within Breadcrumb');
  return context;
}

// ============================================================================
// Root
// ============================================================================

export type BreadcrumbSize = 'sm' | 'md' | 'lg';

export interface BreadcrumbRootProps extends Record<string, unknown> {
  separator?: React.ReactNode;
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
  size?: BreadcrumbSize;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'root' | 'list'>;
}

const BreadcrumbRoot = withMoveComponent<'root' | 'list', BreadcrumbRootProps, HTMLElement>({
  name: 'Breadcrumb',
  styles,
  slots: ['root', 'list'] as const,
  defaults: { size: 'md', itemsBeforeCollapse: 1, itemsAfterCollapse: 1 },
  moveProps: ['separator', 'maxItems', 'itemsBeforeCollapse', 'itemsAfterCollapse', 'size'],

  setup({ props, ref, cx, ptm, attrs }) {
    const {
      className,
      style,
      children,
      separator,
      maxItems,
      itemsBeforeCollapse,
      itemsAfterCollapse,
      size,
    } = props;

    const separatorNode = separator ?? <Icon name="chevron-right" size="xs" />;

    const contextValue: BreadcrumbContextValue = { separator: separatorNode };

    return {
      render() {
        const rootPt = ptm('root');
        const listPt = ptm('list');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;
        const { className: listPtClass, style: listPtStyle, ...listPtRest } = listPt as Record<string, unknown>;

        // Collect Item children for separator injection & collapsing
        const items = React.Children.toArray(children);

        let visibleItems: React.ReactNode[];

        if (maxItems != null && items.length > (maxItems as number)) {
          const before = items.slice(0, itemsBeforeCollapse as number);
          const after = items.slice(items.length - (itemsAfterCollapse as number));
          visibleItems = [
            ...before,
            <BreadcrumbEllipsis key="__breadcrumb-ellipsis__" />,
            ...after,
          ];
        } else {
          visibleItems = items;
        }

        // Inject separators between visible items
        const withSeparators: React.ReactNode[] = [];
        visibleItems.forEach((item, i) => {
          if (i > 0) {
            withSeparators.push(
              <BreadcrumbSeparator key={`__sep-${i}__`} />
            );
          }
          withSeparators.push(item);
        });

        return (
          <BreadcrumbContext.Provider value={contextValue}>
            <nav
              {...attrs}
              {...ptRest}
              ref={ref}
              aria-label="Breadcrumb"
              className={cx('root', className, ptClass as string | undefined)}
              style={{ ...style, ...(ptStyle as React.CSSProperties) }}
              data-size={size}
            >
              <ol
                {...listPtRest}
                className={cx('list', listPtClass as string | undefined)}
                style={listPtStyle as React.CSSProperties}
              >
                {withSeparators}
              </ol>
            </nav>
          </BreadcrumbContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// Item
// ============================================================================

export interface BreadcrumbItemProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'item'>;
}

const BreadcrumbItem = withMoveComponent<'item', BreadcrumbItemProps, HTMLLIElement>({
  name: 'BreadcrumbItem',
  styles,
  slots: ['item'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const itemPt = ptm('item');
        const { className: ptClass, style: ptStyle, ...ptRest } = itemPt as Record<string, unknown>;
        return (
          <li
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('item', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children}
          </li>
        );
      },
    };
  },
});

// ============================================================================
// Link
// ============================================================================

export interface BreadcrumbLinkProps extends Record<string, unknown> {
  asChild?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'link'>;
}

const BreadcrumbLink = withMoveComponent<'link', BreadcrumbLinkProps, HTMLAnchorElement>({
  name: 'BreadcrumbLink',
  styles,
  slots: ['link'] as const,
  defaults: { asChild: false },
  moveProps: ['asChild'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const linkPt = ptm('link');
        const { className: ptClass, style: ptStyle, ...ptRest } = linkPt as Record<string, unknown>;

        const Comp = props.asChild ? Slot.Root : 'a';

        return (
          <Comp
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('link', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children}
          </Comp>
        );
      },
    };
  },
});

// ============================================================================
// Page
// ============================================================================

export interface BreadcrumbPageProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'page'>;
}

const BreadcrumbPage = withMoveComponent<'page', BreadcrumbPageProps, HTMLSpanElement>({
  name: 'BreadcrumbPage',
  styles,
  slots: ['page'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const pagePt = ptm('page');
        const { className: ptClass, style: ptStyle, ...ptRest } = pagePt as Record<string, unknown>;
        return (
          <span
            {...attrs}
            {...ptRest}
            ref={ref}
            role="link"
            aria-current="page"
            aria-disabled="true"
            className={cx('page', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children}
          </span>
        );
      },
    };
  },
});

// ============================================================================
// Separator
// ============================================================================

export interface BreadcrumbSeparatorProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'separator'>;
}

const BreadcrumbSeparator = withMoveComponent<'separator', BreadcrumbSeparatorProps, HTMLLIElement>({
  name: 'BreadcrumbSeparator',
  styles,
  slots: ['separator'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    const context = useBreadcrumbContext();

    return {
      render() {
        const sepPt = ptm('separator');
        const { className: ptClass, style: ptStyle, ...ptRest } = sepPt as Record<string, unknown>;
        return (
          <li
            {...attrs}
            {...ptRest}
            ref={ref}
            role="presentation"
            aria-hidden="true"
            className={cx('separator', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children ?? context.separator}
          </li>
        );
      },
    };
  },
});

// ============================================================================
// Ellipsis
// ============================================================================

export interface BreadcrumbEllipsisProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'ellipsis'>;
}

const BreadcrumbEllipsis = withMoveComponent<'ellipsis', BreadcrumbEllipsisProps, HTMLLIElement>({
  name: 'BreadcrumbEllipsis',
  styles,
  slots: ['ellipsis'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const ellipsisPt = ptm('ellipsis');
        const { className: ptClass, style: ptStyle, ...ptRest } = ellipsisPt as Record<string, unknown>;
        return (
          <li
            {...attrs}
            {...ptRest}
            ref={ref}
            role="presentation"
            className={cx('ellipsis', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children ?? '\u2026'}
          </li>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis,
});
