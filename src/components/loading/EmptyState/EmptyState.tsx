'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
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
  sp?: SlotPropsMap<EmptyStateSlots>;
}

export const EmptyState = withMoveComponent<EmptyStateSlots, EmptyStateProps, HTMLDivElement>({
  name: 'EmptyState',
  styles,
  slots: ['root', 'icon', 'title', 'description', 'action'] as const,
  defaults: { size: 'md' },
  moveProps: ['icon', 'title', 'description', 'action', 'size'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: rootSpClass, style: rootSpStyle, ...rootSpRest } = rootSp as Record<string, unknown>;

        const iconSp = sp('icon');
        const { className: iconSpClass, style: iconSpStyle, ...iconSpRest } = iconSp as Record<string, unknown>;

        const titleSp = sp('title');
        const { className: titleSpClass, style: titleSpStyle, ...titleSpRest } = titleSp as Record<string, unknown>;

        const descriptionSp = sp('description');
        const { className: descSpClass, style: descSpStyle, ...descSpRest } = descriptionSp as Record<string, unknown>;

        const actionSp = sp('action');
        const { className: actionSpClass, style: actionSpStyle, ...actionSpRest } = actionSp as Record<string, unknown>;

        const iconName = props.icon as string | undefined;
        const iconSize = props.size === 'sm' ? 32 : props.size === 'lg' ? 56 : 44;

        return (
          <div
            {...attrs}
            {...rootSpRest}
            ref={ref}
            data-size={props.size}
            className={cx('root', props.className, rootSpClass as string | undefined)}
            style={{ ...props.style, ...(rootSpStyle as React.CSSProperties) }}
          >
            {iconName && (
              <span
                {...iconSpRest}
                className={cx('icon', iconSpClass as string | undefined)}
                style={iconSpStyle as React.CSSProperties}
                aria-hidden="true"
              >
                <Icon name={iconName} size={iconSize} />
              </span>
            )}

            {props.title && (
              <div
                {...titleSpRest}
                className={cx('title', titleSpClass as string | undefined)}
                style={titleSpStyle as React.CSSProperties}
              >
                {props.title as React.ReactNode}
              </div>
            )}

            {props.description && (
              <div
                {...descSpRest}
                className={cx('description', descSpClass as string | undefined)}
                style={descSpStyle as React.CSSProperties}
              >
                {props.description as React.ReactNode}
              </div>
            )}

            {props.action && (
              <div
                {...actionSpRest}
                className={cx('action', actionSpClass as string | undefined)}
                style={actionSpStyle as React.CSSProperties}
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
