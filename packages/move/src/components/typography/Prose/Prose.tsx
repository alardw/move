'use client';

import React from 'react';
import { withMoveComponent } from '../../../engine';
import styles from './Prose.module.css';

export type ProseSize = 'sm' | 'base' | 'lg';

export interface ProseProps extends React.HTMLAttributes<HTMLElement> {
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

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-size={props.size}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});
