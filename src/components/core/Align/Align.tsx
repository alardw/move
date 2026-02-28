'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import styles from './Align.module.css';

// ============================================================================
// Types
// ============================================================================

export type AlignGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
export type AlignVertical = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

export interface AlignProps extends Record<string, unknown> {
  gap?: AlignGap;
  align?: AlignVertical;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'root'>;
}

export interface AlignSectionProps extends Record<string, unknown> {
  children?: React.ReactNode;
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

const ALIGN_MAP: Record<string, string> = {
  start: 'start',
  center: 'center',
  end: 'end',
  stretch: 'stretch',
  baseline: 'baseline',
};

// ============================================================================
// Align (Root)
// ============================================================================

const AlignRoot = withMoveComponent<'root', AlignProps, HTMLDivElement>({
  name: 'Align',
  styles,
  slots: ['root'] as const,
  defaults: { gap: 'md' as AlignGap, align: 'center' as AlignVertical },
  moveProps: ['gap', 'align'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const gap = props.gap as string;
        const align = props.align as string;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', spClass as string | undefined)}
            style={{
              gap: GAP_MAP[gap] || gap,
              alignItems: ALIGN_MAP[align] || align,
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
// Align.Start
// ============================================================================

const AlignStart = withMoveComponent<'start', AlignSectionProps, HTMLDivElement>({
  name: 'AlignStart',
  styles,
  slots: ['start'] as const,
  moveProps: [],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const startSp = sp('start');
        const { className: spClass, style: spStyle, ...spRest } = startSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('start', spClass as string | undefined)}
            style={{
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
// Align.Center
// ============================================================================

const AlignCenter = withMoveComponent<'center', AlignSectionProps, HTMLDivElement>({
  name: 'AlignCenter',
  styles,
  slots: ['center'] as const,
  moveProps: [],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const centerSp = sp('center');
        const { className: spClass, style: spStyle, ...spRest } = centerSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('center', spClass as string | undefined)}
            style={{
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
// Align.End
// ============================================================================

const AlignEnd = withMoveComponent<'end', AlignSectionProps, HTMLDivElement>({
  name: 'AlignEnd',
  styles,
  slots: ['end'] as const,
  moveProps: [],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const endSp = sp('end');
        const { className: spClass, style: spStyle, ...spRest } = endSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('end', spClass as string | undefined)}
            style={{
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

export const Align = Object.assign(AlignRoot, {
  Start: AlignStart,
  Center: AlignCenter,
  End: AlignEnd,
});
