'use client';

import React from 'react';
import { withMoveComponent } from '../../../engine';
import styles from './Prose.module.css';

export type ProseSize = 'sm' | 'base' | 'lg';

export interface ProseProps extends Record<string, unknown> {
  size?: ProseSize;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Prose = withMoveComponent<'root', ProseProps, HTMLDivElement>({
  name: 'Prose',
  styles,
  slots: ['root'] as const,
  defaults: { size: 'base' },
  moveProps: ['size'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('root', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
            data-size={props.size}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});
