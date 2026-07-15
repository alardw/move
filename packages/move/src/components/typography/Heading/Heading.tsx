'use client';
import * as React from 'react';
// Generated from Heading.spec.ts
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { DisplaySize, Truncate } from '../../../shared/types';
import { resolveTruncate } from '../../../shared/truncate';
import { useTruncationTooltip } from '../../overlays/Tooltip';
import styles from './Heading.module.css';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
/** Re-exported for backwards-compatible imports. Prefer `DisplaySize`
 *  from `'move'` directly going forward. */
export type HeadingSize = DisplaySize;
export type HeadingWeight =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';
export type HeadingColor = 'base' | 'muted' | 'subtle';
export type HeadingTracking = 'tight' | 'normal';
export type HeadingAlign = 'left' | 'center' | 'right';

const levelToSize: Record<HeadingLevel, HeadingSize> = {
  1: '4xl',
  2: '3xl',
  3: '2xl',
  4: 'xl',
  5: 'lg',
  6: 'base',
};

export interface HeadingProps extends React.HTMLAttributes<HTMLElement> {
  level?: HeadingLevel;
  weight?: HeadingWeight;
  color?: HeadingColor;
  tracking?: HeadingTracking;
  align?: HeadingAlign;
  /** Truncate overflowing text: `true`/`'end'`, `'start'`, or `'clamp'`. */
  truncate?: Truncate;
  /** Max lines for `truncate="clamp"` (default 2). */
  lines?: number;
  /** With `truncate`, show the full text in a tooltip when it's cut off. */
  tooltip?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Heading = withMoveComponent<'root', HeadingProps, HTMLHeadingElement>({
  name: 'Heading',
  styles,
  slots: ['root'] as const,
  defaults: {
    level: 2 as HeadingLevel,
    color: 'base' as HeadingColor,
    tracking: 'tight' as HeadingTracking,
  },
  moveProps: ['align', 'truncate', 'lines', 'tooltip', 'weight'],

  setup({ props, ref, cx, sp, attrs }) {
    const trunc = resolveTruncate(
      props.truncate as Truncate | undefined,
      props.lines as number,
      props.children,
    );
    const fullText = typeof props.children === 'string' ? props.children : undefined;
    const wantTooltip = !!props.tooltip && !!trunc.mode && fullText !== undefined;
    const { ref: truncRef, wrap } = useTruncationTooltip(wantTooltip, fullText);
    const mergedRef = useMergedRef<HTMLElement>(ref, truncRef);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const level = props.level || 2;
        const resolvedSize = levelToSize[level as HeadingLevel];
        const Comp = `h${level}` as React.ElementType;

        return wrap(
          <Comp
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties), ...trunc.style }}
            data-size={resolvedSize}
            data-weight={props.weight}
            data-color={props.color}
            data-tracking={props.tracking}
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
