'use client';
import * as React from 'react';
// Generated from Text.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { withMoveComponent } from '../../../engine';
import type { TypographySize } from '../../../shared/types';
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
  truncate?: boolean;
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
  moveProps: ['as', 'size', 'weight', 'color', 'align', 'truncate'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const Comp = (props.as || 'p') as React.ElementType;

        return (
          <Comp
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-size={props.size}
            data-weight={props.weight}
            data-color={props.color}
            {...(props.align ? { 'data-align': props.align } : {})}
            {...(props.truncate ? { 'data-truncate': '' } : {})}
          >
            {props.children}
          </Comp>
        );
      },
    };
  },
});
