'use client';

import { withMoveComponent } from '../../../engine';
import styles from './Badge.module.css';

export type BadgeVariant = 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends Record<string, unknown> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Badge = withMoveComponent<'root', BadgeProps, HTMLSpanElement>({
  name: 'Badge',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'primary', size: 'md' },
  moveProps: ['variant', 'size'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;

        return (
          <span
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('root', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
            data-variant={props.variant}
            data-size={props.size}
          >
            {props.children}
          </span>
        );
      },
    };
  },
});
