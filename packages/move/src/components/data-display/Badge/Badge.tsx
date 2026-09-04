'use client';
import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { Color } from '../../../shared/types';
import styles from './Badge.module.css';

export type BadgeVariant = 'solid' | 'soft' | 'surface' | 'outline' | 'dot';
export type BadgeSize = 'sm' | 'md' | 'lg';
/** Themeable palette color role. @see Color */
export type BadgeColor = Color;

export interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual style: solid fill, soft tint, surface (tint + border), outline, or dot indicator. */
  variant?: BadgeVariant;
  /** Size. */
  size?: BadgeSize;
  /** Palette color role from the theme (e.g. 'green', 'violet'). */
  color?: BadgeColor;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Badge = withMoveComponent<'root', BadgeProps, HTMLSpanElement>({
  name: 'Badge',
  styles,
  slots: ['root'] as const,
  defaults: {
    variant: 'solid' as BadgeVariant,
    size: 'md' as BadgeSize,
    color: 'gray' as BadgeColor,
  },
  moveProps: ['color'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const color = props.color as string;

        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
            data-variant={props.variant as string}
            data-size={props.size as string}
            data-color={color}
          >
            {props.variant === 'dot' && <span className={styles.dot} data-color={color} />}
            {props.children}
          </span>
        );
      },
    };
  },
});
