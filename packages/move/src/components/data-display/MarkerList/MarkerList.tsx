'use client';
// Generated from MarkerList.spec.ts

import * as React from 'react';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { Icon } from '../../../infrastructure/Icon';
import styles from './MarkerList.module.css';

// ============================================================================
// Types
// ============================================================================

export type Marker = 'disc' | 'circle' | 'square' | 'decimal' | 'alpha' | 'roman';
export type MarkerListSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg';

const BULLET_GLYPH: Record<string, string> = { disc: '•', circle: '◦', square: '▪' };
const ORDERED_MARKERS = new Set<Marker>(['decimal', 'alpha', 'roman']);

// ============================================================================
// Context — carries depth + the inherited per-level marker map so nested lists
// select their own marker automatically.
// ============================================================================

interface MarkerListContextValue {
  depth: number;
  markers?: Marker[];
  /** Effective marker for THIS level's items. */
  marker: Marker;
  icon: string | null;
  ordered: boolean;
  center: boolean;
}

const MarkerListContext = React.createContext<MarkerListContextValue | null>(null);

// ============================================================================
// Root
// ============================================================================

export interface MarkerListRootProps extends React.HTMLAttributes<HTMLElement> {
  /** Ordered <ol> (numbered) instead of unordered <ul> (bulleted). */
  ordered?: boolean;
  /** Marker style for this level. `null` derives disc (unordered) / decimal (ordered). */
  marker?: Marker | null;
  /** Per-depth marker styles (level 0, 1, 2…), inherited by nested lists. */
  markers?: Marker[];
  /** Use a resolved Icon (by name) as the marker for every item at this level. */
  icon?: string | null;
  /** Vertical gap between items. */
  spacing?: MarkerListSpacing;
  /** Indentation added per nested level. */
  indent?: MarkerListSpacing;
  /** Vertically center each marker to its item (default: align to the first line). */
  center?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'root'>;
}

const MarkerListRoot = withMoveComponent<'root', MarkerListRootProps, HTMLElement>({
  name: 'MarkerList',
  styles,
  slots: ['root'] as const,
  defaults: {
    ordered: false,
    icon: null as unknown as undefined,
    marker: null as unknown as undefined,
    spacing: 'xs' as MarkerListSpacing,
    indent: 'md' as MarkerListSpacing,
    center: false,
  },
  moveProps: ['ordered', 'marker', 'markers', 'icon', 'spacing', 'indent', 'center'],

  setup({ props, ref, cx, sp, attrs }) {
    const parent = React.useContext(MarkerListContext);
    const rootRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRef<HTMLElement>(ref, rootRef);

    const depth = parent ? parent.depth + 1 : 0;
    const ordered = props.ordered as boolean;
    // `markers` (the per-level map) is the one inherited field — a nested list
    // that doesn't set its own reuses the parent's map and picks markers[depth].
    const markers = (props.markers as Marker[] | undefined) ?? parent?.markers;
    const explicit = props.marker as Marker | null;
    const marker: Marker = explicit ?? markers?.[depth] ?? (ordered ? 'decimal' : 'disc');
    const icon = (props.icon as string | null) ?? null;
    const center = props.center as boolean;

    const ctx: MarkerListContextValue = { depth, markers, marker, icon, ordered, center };

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const Element = ordered ? 'ol' : 'ul';

        return (
          <MarkerListContext.Provider value={ctx}>
            {React.createElement(
              Element,
              {
                ...attrs,
                ...spRest,
                ref: mergedRef,
                role: 'list',
                className: cx('root', props.className, spClass as string | undefined),
                style: {
                  ...(props.style as React.CSSProperties),
                  ...(spStyle as React.CSSProperties),
                },
                'data-ordered': ordered ? '' : undefined,
                'data-marker': marker,
                'data-spacing': props.spacing as string,
                'data-indent': props.indent as string,
                'data-center': center ? '' : undefined,
                'data-depth': depth,
              },
              props.children,
            )}
          </MarkerListContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// Item
// ============================================================================

export interface MarkerListItemProps extends React.HTMLAttributes<HTMLElement> {
  /** Override this item's marker style. */
  marker?: Marker | null;
  /** Override this item's marker with a resolved Icon (by name). */
  icon?: string | null;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'item'>;
}

const MarkerListItem = withMoveComponent<'item', MarkerListItemProps, HTMLLIElement>({
  name: 'MarkerListItem',
  styles,
  slots: ['item'] as const,
  defaults: {
    marker: null as unknown as undefined,
    icon: null as unknown as undefined,
  },
  moveProps: ['marker', 'icon'],

  setup({ props, ref, cx, sp, attrs }) {
    const ctx = React.useContext(MarkerListContext);

    return {
      render() {
        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;

        // Precedence: item.icon → item.marker → list.icon → list.marker → default.
        const marker: Marker = (props.marker as Marker | null) ?? ctx?.marker ?? 'disc';
        const icon = (props.icon as string | null) ?? ctx?.icon ?? null;
        const isOrdered = ORDERED_MARKERS.has(marker);

        // Icon marker → <Icon>. Bullet → glyph. Ordered number → rendered by the
        // CSS counter on the marker cell (::before), so no JS content here.
        let markerContent: React.ReactNode = null;
        if (icon) markerContent = <Icon name={icon} />;
        else if (!isOrdered) markerContent = BULLET_GLYPH[marker] ?? BULLET_GLYPH.disc;

        return (
          <li
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('item', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
            data-marker={marker}
          >
            <span
              className={styles.marker}
              data-marker={marker}
              data-icon={icon ? '' : undefined}
              aria-hidden
            >
              {markerContent}
            </span>
            <div className={styles.content}>{props.children}</div>
          </li>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const MarkerList = Object.assign(MarkerListRoot, {
  Root: MarkerListRoot,
  Item: MarkerListItem,
});
