'use client';
// Generated from Stack.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
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
export type StackPadding = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
export type StackFlex = 1 | 'auto' | 'none';

export interface StackProps extends Record<string, unknown> {
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  padding?: StackPadding;
  flex?: StackFlex;
  fill?: boolean;
  wrap?: boolean;
  collapseBelow?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'root'>;
}

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
  moveProps: ['collapseBelow', 'fill'],

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

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
            data-direction={props.direction as string}
            data-gap={props.gap as string}
            data-align={props.align as string}
            data-justify={props.justify as string}
            data-padding={props.padding as string | undefined}
            data-flex={props.flex != null ? String(props.flex) : undefined}
            data-fill={props.fill ? '' : undefined}
            data-wrap={props.wrap ? '' : undefined}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});
