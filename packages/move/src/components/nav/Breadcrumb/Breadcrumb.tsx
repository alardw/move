'use client';
// Generated from Breadcrumb.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { Slot } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { Icon } from '../../../infrastructure/Icon';
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

export interface BreadcrumbLabels {
  /** aria-label for the breadcrumb nav landmark. */
  label: string;
}

const DEFAULT_LABELS: BreadcrumbLabels = {
  label: 'Breadcrumb',
};

export interface BreadcrumbRootProps extends Record<string, unknown> {
  separator?: React.ReactNode;
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
  size?: BreadcrumbSize;
  labels?: Partial<BreadcrumbLabels>;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'root' | 'list'>;
}

const BreadcrumbRoot = withMoveComponent<'root' | 'list', BreadcrumbRootProps, HTMLElement>({
  name: 'Breadcrumb',
  styles,
  slots: ['root', 'list'] as const,
  defaults: { size: 'md', itemsBeforeCollapse: 1, itemsAfterCollapse: 1 },
  moveProps: ['separator', 'maxItems', 'itemsBeforeCollapse', 'itemsAfterCollapse', 'size', 'labels'],

  setup({ props, ref, cx, sp, attrs }) {
    const labels = { ...DEFAULT_LABELS, ...(props.labels as Partial<BreadcrumbLabels>) };
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
        const rootSp = sp('root');
        const listSp = sp('list');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const { className: listSpClass, style: listSpStyle, ...listSpRest } = listSp as Record<string, unknown>;

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
              {...spRest}
              ref={ref}
              aria-label={labels.label}
              className={cx('root', className, spClass as string | undefined)}
              style={{ ...style, ...(spStyle as React.CSSProperties) }}
              data-size={size}
            >
              <ol
                {...listSpRest}
                className={cx('list', listSpClass as string | undefined)}
                style={listSpStyle as React.CSSProperties}
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
  sp?: SlotPropsMap<'item'>;
}

const BreadcrumbItem = withMoveComponent<'item', BreadcrumbItemProps, HTMLLIElement>({
  name: 'BreadcrumbItem',
  styles,
  slots: ['item'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;
        return (
          <li
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('item', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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
  sp?: SlotPropsMap<'link'>;
}

const BreadcrumbLink = withMoveComponent<'link', BreadcrumbLinkProps, HTMLAnchorElement>({
  name: 'BreadcrumbLink',
  styles,
  slots: ['link'] as const,
  defaults: { asChild: false },
  moveProps: ['asChild'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const linkSp = sp('link');
        const { className: spClass, style: spStyle, ...spRest } = linkSp as Record<string, unknown>;

        const Comp = props.asChild ? Slot.Root : 'a';

        return (
          <Comp
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('link', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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
  sp?: SlotPropsMap<'page'>;
}

const BreadcrumbPage = withMoveComponent<'page', BreadcrumbPageProps, HTMLSpanElement>({
  name: 'BreadcrumbPage',
  styles,
  slots: ['page'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const pageSp = sp('page');
        const { className: spClass, style: spStyle, ...spRest } = pageSp as Record<string, unknown>;
        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            role="link"
            aria-current="page"
            aria-disabled="true"
            className={cx('page', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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
  sp?: SlotPropsMap<'separator'>;
}

const BreadcrumbSeparator = withMoveComponent<'separator', BreadcrumbSeparatorProps, HTMLLIElement>({
  name: 'BreadcrumbSeparator',
  styles,
  slots: ['separator'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const context = useBreadcrumbContext();

    return {
      render() {
        const sepSp = sp('separator');
        const { className: spClass, style: spStyle, ...spRest } = sepSp as Record<string, unknown>;
        return (
          <li
            {...attrs}
            {...spRest}
            ref={ref}
            role="presentation"
            aria-hidden="true"
            className={cx('separator', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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
  sp?: SlotPropsMap<'ellipsis'>;
}

const BreadcrumbEllipsis = withMoveComponent<'ellipsis', BreadcrumbEllipsisProps, HTMLLIElement>({
  name: 'BreadcrumbEllipsis',
  styles,
  slots: ['ellipsis'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const ellipsisSp = sp('ellipsis');
        const { className: spClass, style: spStyle, ...spRest } = ellipsisSp as Record<string, unknown>;
        return (
          <li
            {...attrs}
            {...spRest}
            ref={ref}
            role="presentation"
            className={cx('ellipsis', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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
