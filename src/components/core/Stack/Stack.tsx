'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import styles from './Stack.module.css';

// ============================================================================
// Types
// ============================================================================

export type StackDirection = 'row' | 'column';
export type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'evenly';

export interface StackProps extends Record<string, unknown> {
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  collapseBelow?: string;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'root'>;
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
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const JUSTIFY_MAP: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  evenly: 'space-evenly',
};

// ============================================================================
// Stack
// ============================================================================

export const Stack = withMoveComponent<'root', StackProps, HTMLDivElement>({
  name: 'Stack',
  styles,
  slots: ['root'] as const,
  defaults: {
    direction: 'column' as StackDirection,
    gap: 'md' as StackGap,
    align: 'stretch' as StackAlign,
    justify: 'start' as StackJustify,
    wrap: false,
  },
  moveProps: ['direction', 'gap', 'align', 'justify', 'wrap', 'collapseBelow'],

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

        const direction = props.direction as StackDirection;
        const gap = props.gap as string;
        const align = props.align as string;
        const justify = props.justify as string;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', spClass as string | undefined)}
            style={{
              gap: GAP_MAP[gap] || gap,
              alignItems: ALIGN_MAP[align] || align,
              justifyContent: JUSTIFY_MAP[justify] || justify,
              flexWrap: props.wrap ? 'wrap' : undefined,
              ...(props.style as React.CSSProperties),
              ...(spStyle as React.CSSProperties),
            }}
            data-direction={direction}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});
