'use client';
// Generated from Badge.spec.ts (schemaVersion: 6, specHash: ddc033c4)
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
  defaults: { variant: 'primary' as BadgeVariant, size: 'md' as BadgeSize },
  moveProps: [],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
            data-variant={props.variant as string}
            data-size={props.size as string}
          >
            {props.children}
          </span>
        );
      },
    };
  },
});
