'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import { Icon } from '../../core/Icon';
import styles from './EmptyState.module.css';

// =============================================================================
// Types
// =============================================================================

export type EmptyStateSize = 'sm' | 'md' | 'lg';
type EmptyStateSlots = 'root' | 'icon' | 'title' | 'description' | 'action';

// =============================================================================
// EmptyState
// =============================================================================

export interface EmptyStateProps extends Record<string, unknown> {
  icon?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  size?: EmptyStateSize;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<EmptyStateSlots>;
}

export const EmptyState = withMoveComponent<EmptyStateSlots, EmptyStateProps, HTMLDivElement>({
  name: 'EmptyState',
  styles,
  slots: ['root', 'icon', 'title', 'description', 'action'] as const,
  defaults: { size: 'md' },
  moveProps: ['icon', 'title', 'description', 'action', 'size'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const rootPt = ptm('root');
        const { className: rootPtClass, style: rootPtStyle, ...rootPtRest } = rootPt as Record<string, unknown>;

        const iconPt = ptm('icon');
        const { className: iconPtClass, style: iconPtStyle, ...iconPtRest } = iconPt as Record<string, unknown>;

        const titlePt = ptm('title');
        const { className: titlePtClass, style: titlePtStyle, ...titlePtRest } = titlePt as Record<string, unknown>;

        const descriptionPt = ptm('description');
        const { className: descPtClass, style: descPtStyle, ...descPtRest } = descriptionPt as Record<string, unknown>;

        const actionPt = ptm('action');
        const { className: actionPtClass, style: actionPtStyle, ...actionPtRest } = actionPt as Record<string, unknown>;

        const iconName = props.icon as string | undefined;
        const iconSize = props.size === 'sm' ? 32 : props.size === 'lg' ? 56 : 44;

        return (
          <div
            {...attrs}
            {...rootPtRest}
            ref={ref}
            data-size={props.size}
            className={cx('root', props.className, rootPtClass as string | undefined)}
            style={{ ...props.style, ...(rootPtStyle as React.CSSProperties) }}
          >
            {iconName && (
              <span
                {...iconPtRest}
                className={cx('icon', iconPtClass as string | undefined)}
                style={iconPtStyle as React.CSSProperties}
                aria-hidden="true"
              >
                <Icon name={iconName} size={iconSize} />
              </span>
            )}

            {props.title && (
              <div
                {...titlePtRest}
                className={cx('title', titlePtClass as string | undefined)}
                style={titlePtStyle as React.CSSProperties}
              >
                {props.title as React.ReactNode}
              </div>
            )}

            {props.description && (
              <div
                {...descPtRest}
                className={cx('description', descPtClass as string | undefined)}
                style={descPtStyle as React.CSSProperties}
              >
                {props.description as React.ReactNode}
              </div>
            )}

            {props.action && (
              <div
                {...actionPtRest}
                className={cx('action', actionPtClass as string | undefined)}
                style={actionPtStyle as React.CSSProperties}
              >
                {props.action as React.ReactNode}
              </div>
            )}

            {props.children}
          </div>
        );
      },
    };
  },
});
