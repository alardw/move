'use client';
import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import styles from './Badge.module.css';

export type BadgeVariant = 'solid' | 'soft' | 'surface' | 'outline' | 'dot';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeColor =
  | 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  | 'gray' | 'red' | 'pink' | 'grape' | 'violet' | 'indigo'
  | 'blue' | 'cyan' | 'teal' | 'green' | 'lime' | 'yellow' | 'orange';

export interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual style: solid fill, soft tint, surface (tint + border), outline, or dot indicator. */
  variant?: BadgeVariant;
  /** Size. */
  size?: BadgeSize;
  /** Color intent or palette name. Semantic intents (primary, success, etc.) resolve to their palette. */
  color?: BadgeColor;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** Map semantic color names to their underlying palette. */
const COLOR_MAP: Record<string, string> = {
  default: 'gray',
  primary: 'indigo',
  success: 'green',
  warning: 'yellow',
  danger: 'red',
  info: 'blue',
};

export const Badge = withMoveComponent<'root', BadgeProps, HTMLSpanElement>({
  name: 'Badge',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'solid' as BadgeVariant, size: 'md' as BadgeSize, color: 'default' as BadgeColor },
  moveProps: ['color'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const resolvedColor = COLOR_MAP[props.color as string] ?? (props.color as string);

        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
            data-variant={props.variant as string}
            data-size={props.size as string}
            data-color={resolvedColor}
          >
            {props.variant === 'dot' && <span className={styles.dot} data-color={resolvedColor} />}
            {props.children}
          </span>
        );
      },
    };
  },
});
