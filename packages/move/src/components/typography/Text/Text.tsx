'use client';
import * as React from 'react';
// Generated from Text.spec.ts
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { TypographySize, Truncate } from '../../../shared/types';
import { resolveTruncate } from '../../../shared/truncate';
import { useTruncationTooltip } from '../../overlays/Tooltip';
import styles from './Text.module.css';

/** Re-exported for backwards-compatible imports. Prefer
 *  `TypographySize` from `'move'` directly going forward. */
export type TextSize = TypographySize;
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextColor = 'base' | 'muted' | 'subtle' | 'primary' | 'success' | 'warning' | 'error';
export type TextAlign = 'left' | 'center' | 'right';
export type TextAs = 'p' | 'span' | 'div' | 'em' | 'strong' | 'small' | 'del';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextAs;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  align?: TextAlign;
  /** Truncate overflowing text: `true`/`'end'`, `'start'`, or `'clamp'`. */
  truncate?: Truncate;
  /** Max lines for `truncate="clamp"` (default 2). */
  lines?: number;
  /** With `truncate`, show the full text in a tooltip on hover — but only when
   *  it's actually cut off. Requires string children. */
  tooltip?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Text = withMoveComponent<'root', TextProps, HTMLElement>({
  name: 'Text',
  styles,
  slots: ['root'] as const,
  defaults: {
    as: 'p' as TextAs,
    size: 'base' as TextSize,
    weight: 'normal' as TextWeight,
    color: 'base' as TextColor,
  },
  moveProps: ['as', 'size', 'weight', 'color', 'align', 'truncate', 'lines', 'tooltip'],

  setup({ props, ref, cx, sp, attrs }) {
    const truncate = props.truncate as Truncate | undefined;
    const trunc = resolveTruncate(truncate, props.lines as number, props.children);
    const fullText = typeof props.children === 'string' ? props.children : undefined;
    // The tooltip needs measurement + a string to show; skip it otherwise.
    const wantTooltip = !!props.tooltip && !!trunc.mode && fullText !== undefined;

    const { ref: truncRef, wrap } = useTruncationTooltip(wantTooltip, fullText);
    const mergedRef = useMergedRef<HTMLElement>(ref, truncRef);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const Comp = (props.as || 'p') as React.ElementType;

        return wrap(
          <Comp
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties), ...trunc.style }}
            data-size={props.size}
            data-weight={props.weight}
            data-color={props.color}
            {...(props.align ? { 'data-align': props.align } : {})}
            {...(trunc.mode ? { 'data-truncate': trunc.mode } : {})}
          >
            {trunc.content}
          </Comp>,
        );
      },
    };
  },
});
