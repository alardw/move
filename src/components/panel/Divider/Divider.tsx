'use client';

import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import styles from './Divider.module.css';

// ============================================================================
// Types
// ============================================================================

export type DividerSlots = 'root' | 'content';
export type DividerType = 'solid' | 'dashed' | 'dotted';
export type DividerAlign = 'left' | 'center' | 'right' | 'top' | 'bottom';
export type DividerSize = 'sm' | 'md' | 'lg';

export interface DividerProps extends Record<string, unknown> {
  orientation?: 'horizontal' | 'vertical';
  type?: DividerType;
  align?: DividerAlign;
  size?: DividerSize;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<DividerSlots>;
}

// ============================================================================
// Component
// ============================================================================

export const Divider = withMoveComponent<DividerSlots, DividerProps, HTMLDivElement>({
  name: 'Divider',
  styles,
  slots: ['root', 'content'] as const,
  moveProps: ['orientation', 'type', 'align', 'size'],
  defaults: {
    orientation: 'horizontal',
    type: 'solid',
    align: 'center',
    size: 'sm',
  },

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: rootSpClass, style: rootSpStyle, ...rootSpRest } = rootSp as Record<string, unknown>;

        const contentSp = sp('content');
        const { className: contentSpClass, style: contentSpStyle, ...contentSpRest } = contentSp as Record<string, unknown>;

        const hasContent = props.children != null;

        return (
          <div
            {...attrs}
            {...rootSpRest}
            ref={ref}
            data-size={props.size}
            role="separator"
            aria-orientation={props.orientation}
            data-orientation={props.orientation as string}
            data-type={props.type as string}
            {...(hasContent ? { 'data-has-content': '', 'data-align': props.align as string } : {})}
            className={cx('root', props.className, rootSpClass as string | undefined)}
            style={{ ...props.style, ...(rootSpStyle as React.CSSProperties) }}
          >
            {hasContent && (
              <span
                {...contentSpRest}
                className={cx('content', contentSpClass as string | undefined)}
                style={contentSpStyle as React.CSSProperties}
              >
                {props.children}
              </span>
            )}
          </div>
        );
      },
    };
  },
});
