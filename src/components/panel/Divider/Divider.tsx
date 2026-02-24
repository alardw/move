'use client';

import { withMoveComponent } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import styles from './Divider.module.css';

// ============================================================================
// Types
// ============================================================================

export type DividerSlots = 'root' | 'content';
export type DividerType = 'solid' | 'dashed' | 'dotted';
export type DividerAlign = 'left' | 'center' | 'right' | 'top' | 'bottom';

export interface DividerProps extends Record<string, unknown> {
  orientation?: 'horizontal' | 'vertical';
  type?: DividerType;
  align?: DividerAlign;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<DividerSlots>;
}

// ============================================================================
// Component
// ============================================================================

export const Divider = withMoveComponent<DividerSlots, DividerProps, HTMLDivElement>({
  name: 'Divider',
  styles,
  slots: ['root', 'content'] as const,
  moveProps: ['orientation', 'type', 'align'],
  defaults: {
    orientation: 'horizontal',
    type: 'solid',
    align: 'center',
  },

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const rootPt = ptm('root');
        const { className: rootPtClass, style: rootPtStyle, ...rootPtRest } = rootPt as Record<string, unknown>;

        const contentPt = ptm('content');
        const { className: contentPtClass, style: contentPtStyle, ...contentPtRest } = contentPt as Record<string, unknown>;

        const hasContent = props.children != null;

        return (
          <div
            {...attrs}
            {...rootPtRest}
            ref={ref}
            role="separator"
            aria-orientation={props.orientation}
            data-orientation={props.orientation as string}
            data-type={props.type as string}
            {...(hasContent ? { 'data-has-content': '', 'data-align': props.align as string } : {})}
            className={cx('root', props.className, rootPtClass as string | undefined)}
            style={{ ...props.style, ...(rootPtStyle as React.CSSProperties) }}
          >
            {hasContent && (
              <span
                {...contentPtRest}
                className={cx('content', contentPtClass as string | undefined)}
                style={contentPtStyle as React.CSSProperties}
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
