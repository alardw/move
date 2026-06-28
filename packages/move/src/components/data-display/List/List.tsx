'use client';
// Generated from List.spec.ts (schemaVersion: 7, specHash: PLACEHOLDER)

import * as React from 'react';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import {
  useAnimations,
  resolveAnimationsConfig,
} from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import styles from './List.module.css';

// ============================================================================
// Default animations
// ============================================================================

const DEFAULT_LIST_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Root.enter',
    sequence: [{
      target: 'Root',
      children: `.${styles.item}`,
      stagger: { delay: 60 },
      animation: {
        opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 },
        translateY: { from: 8, to: 0, ease: 'outQuart', duration: 200 },
      },
    }],
  },
];

// ============================================================================
// Types
// ============================================================================

export type ListSize = 'sm' | 'md' | 'lg';
export type ListDensity = 'compact' | 'default' | 'comfortable';
export type ListDescriptionLines = 1 | 2 | 3 | 'none';

// ============================================================================
// Context
// ============================================================================

interface ListContextValue {
  size: ListSize;
  density: ListDensity;
  hover: boolean;
}

const ListContext = React.createContext<ListContextValue | null>(null);

// ============================================================================
// Root
// ============================================================================

export type ListRadius = 'none' | 'sm' | 'md' | 'lg';

export interface ListRootProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  size?: ListSize;
  dividers?: boolean;
  separator?: boolean;
  density?: ListDensity;
  hover?: boolean;
  /** Border radius applied to hover/active item highlights. */
  radius?: ListRadius;
  /** When this value changes, the stagger entrance animation replays. Useful for filter/sort transitions. */
  animateKey?: unknown;
  animations?: AnimationTrigger[] | false;
  sp?: SlotPropsMap<'root'>;
}

const ListRoot = withMoveComponent<'root', ListRootProps, HTMLUListElement>({
  name: 'List',
  styles,
  slots: ['root'] as const,
  defaults: {
    size: 'md' as ListSize,
    dividers: true,
    separator: true,
    density: 'default' as ListDensity,
    hover: false,
    radius: 'sm' as ListRadius,
  },
  moveProps: ['size', 'dividers', 'separator', 'density', 'hover', 'radius', 'animations', 'animateKey'],

  setup({ props, ref, cx, sp, attrs }) {
    const rootRef = React.useRef<HTMLUListElement>(null);
    const mergedRef = useMergedRef<HTMLUListElement>(ref, rootRef);

    const animateKey = props.animateKey;

    const animConfig = React.useMemo(() => {
      const base = resolveAnimationsConfig(
        DEFAULT_LIST_ANIMATIONS,
        props.animations as AnimationTrigger[] | false | undefined,
      );
      if (!base || animateKey === undefined) return base;

      // Find the enter trigger's animation to reuse for deps-based replay
      const enterTrigger = base.find(t => t.trigger === 'Root.enter');
      if (!enterTrigger) return base;

      return [
        ...base,
        {
          ...enterTrigger,
          trigger: 'Root.replay',
          deps: [animateKey],
        } satisfies AnimationTrigger,
      ];
    }, [props.animations, animateKey]);

    const rootRefs = React.useMemo(() => ({
      Root: rootRef as React.RefObject<HTMLElement | null>,
    }), []);

    useAnimations(animConfig, rootRefs);

    const ctx: ListContextValue = {
      size: props.size as ListSize,
      density: props.density as ListDensity,
      hover: props.hover as boolean,
    };

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <ListContext.Provider value={ctx}>
            <ul
              {...attrs}
              {...spRest}
              ref={mergedRef}
              role="list"
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
              data-size={props.size as string}
              data-density={props.density as string}
              data-radius={props.radius as string}
              data-dividers={(props.dividers && !props.separator) ? '' : undefined}
              data-hover={props.hover ? '' : undefined}
            >
              {props.separator
                ? React.Children.toArray(props.children).reduce<React.ReactNode[]>(
                    (acc, child, i) => {
                      if (i > 0) acc.push(<li key={`sep-${i}`} role="separator" aria-hidden className={styles.separator} />);
                      acc.push(child);
                      return acc;
                    },
                    [],
                  )
                : props.children}
            </ul>
          </ListContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// Item
// ============================================================================

export type ListItemElement = 'li' | 'a' | 'button';

export interface ListItemProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  as?: ListItemElement;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  /** Force the row to render as a click target — adds cursor: pointer,
   *  hover tint, focus ring, and Enter/Space activation. Auto-derived
   *  from `href`, `onClick`, or `as="a"|"button"` when omitted. Shared
   *  opt-in pattern with `Table.Row` and `Image`. */
  interactive?: boolean;
  sp?: SlotPropsMap<'item'>;
}

const ListItem = withMoveComponent<'item', ListItemProps, HTMLLIElement>({
  name: 'ListItem',
  styles,
  slots: ['item'] as const,
  moveProps: ['as', 'href', 'active', 'disabled', 'interactive'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;

        const href = props.href as string | undefined;
        const onClick = props.onClick as (() => void) | undefined;
        const asProp = props.as as ListItemElement | undefined;
        const active = props.active as boolean | undefined;
        const disabled = props.disabled as boolean | undefined;

        // Determine rendered element
        const Element = href ? 'a' : asProp || 'li';
        const interactiveProp = props.interactive as boolean | undefined;
        const isInteractive = interactiveProp ?? !!(href || onClick || asProp === 'a' || asProp === 'button');

        const elementProps: Record<string, unknown> = {
          ...attrs,
          ...spRest,
          ref,
          className: cx('item', props.className, spClass as string | undefined),
          style: { ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) },
          'data-active': active ? '' : undefined,
          'data-disabled': disabled ? '' : undefined,
          'data-interactive': isInteractive ? '' : undefined,
        };

        if (href && !disabled) {
          elementProps.href = href;
        }

        if (onClick && !disabled) {
          elementProps.onClick = onClick;
        }

        if (disabled && Element === 'button') {
          elementProps.disabled = true;
        }

        return React.createElement(
          Element,
          elementProps,
          props.children,
        );
      },
    };
  },
});

// ============================================================================
// Leading
// ============================================================================

export interface ListLeadingProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'leading'>;
}

const ListLeading = withMoveComponent<'leading', ListLeadingProps, HTMLDivElement>({
  name: 'ListLeading',
  styles,
  slots: ['leading'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const leadingSp = sp('leading');
        const { className: spClass, style: spStyle, ...spRest } = leadingSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('leading', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Content
// ============================================================================

export interface ListContentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'content'>;
}

const ListContent = withMoveComponent<'content', ListContentProps, HTMLDivElement>({
  name: 'ListContent',
  styles,
  slots: ['content'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const contentSp = sp('content');
        const { className: spClass, style: spStyle, ...spRest } = contentSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('content', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Title
// ============================================================================

export interface ListTitleProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'title'>;
}

const ListTitle = withMoveComponent<'title', ListTitleProps, HTMLDivElement>({
  name: 'ListTitle',
  styles,
  slots: ['title'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const titleSp = sp('title');
        const { className: spClass, style: spStyle, ...spRest } = titleSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('title', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Description
// ============================================================================

export interface ListDescriptionProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  lines?: ListDescriptionLines;
  sp?: SlotPropsMap<'description'>;
}

const ListDescription = withMoveComponent<'description', ListDescriptionProps, HTMLDivElement>({
  name: 'ListDescription',
  styles,
  slots: ['description'] as const,
  // Default to `none` — text wraps naturally so the component stays
  // responsive out of the box. Consumers opt into truncation with
  // lines={1 | 2 | 3} when they actually need it.
  defaults: { lines: 'none' as unknown as undefined },
  moveProps: ['lines'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const descSp = sp('description');
        const { className: spClass, style: spStyle, ...spRest } = descSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('description', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
            data-lines={String(props.lines)}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Trailing
// ============================================================================

export interface ListTrailingProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'trailing'>;
}

const ListTrailing = withMoveComponent<'trailing', ListTrailingProps, HTMLDivElement>({
  name: 'ListTrailing',
  styles,
  slots: ['trailing'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const trailingSp = sp('trailing');
        const { className: spClass, style: spStyle, ...spRest } = trailingSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('trailing', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
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

export const List = Object.assign(ListRoot, {
  Root: ListRoot,
  Item: ListItem,
  Leading: ListLeading,
  Content: ListContent,
  Title: ListTitle,
  Description: ListDescription,
  Trailing: ListTrailing,
});
