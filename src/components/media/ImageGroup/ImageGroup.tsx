'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import styles from './ImageGroup.module.css';

// =============================================================================
// Types
// =============================================================================

export type ImageGroupGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ImageGroupSlots = 'root';

// =============================================================================
// ImageGroup
// =============================================================================

export interface ImageGroupProps extends Record<string, unknown> {
  columns?: number;
  gap?: ImageGroupGap;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<ImageGroupSlots>;
}

export const ImageGroup = withMoveComponent<ImageGroupSlots, ImageGroupProps, HTMLDivElement>({
  name: 'ImageGroup',
  styles,
  slots: ['root'] as const,
  defaults: { columns: 3, gap: 'md' },
  moveProps: ['columns', 'gap'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const rootPt = ptm('root');
        const { className: rootPtClass, style: rootPtStyle, ...rootPtRest } = rootPt as Record<string, unknown>;

        const columns = props.columns as number;

        const rootStyle: React.CSSProperties = {
          '--move-imagegroup-columns': columns,
          ...props.style,
          ...(rootPtStyle as React.CSSProperties),
        } as React.CSSProperties;

        return (
          <div className={styles.wrapper}>
            <div
              {...attrs}
              {...rootPtRest}
              ref={ref}
              data-columns={columns}
              data-gap={props.gap}
              className={cx('root', props.className, rootPtClass as string | undefined)}
              style={rootStyle}
            >
              {props.children}
            </div>
          </div>
        );
      },
    };
  },
});
