'use client';

import React from 'react';
import { withMoveComponent } from '../../../engine';
import styles from './Code.module.css';

export type CodeVariant = 'subtle' | 'outline' | 'ghost';
export type CodeSize = 'xs' | 'sm' | 'base' | 'lg';

export interface CodeProps extends Record<string, unknown> {
  variant?: CodeVariant;
  size?: CodeSize;
  block?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Code = withMoveComponent<'root', CodeProps, HTMLElement>({
  name: 'Code',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'subtle', size: 'sm' },
  moveProps: ['variant', 'size', 'block'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;

        const isBlock = !!props.block;

        if (isBlock) {
          return (
            <pre
              {...attrs}
              {...ptRest}
              ref={ref as React.Ref<HTMLPreElement>}
              className={cx('root', props.className, ptClass as string | undefined)}
              style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
              data-variant={props.variant}
              data-size={props.size}
              data-block=""
            >
              <code>{props.children}</code>
            </pre>
          );
        }

        return (
          <code
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('root', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
            data-variant={props.variant}
            data-size={props.size}
          >
            {props.children}
          </code>
        );
      },
    };
  },
});
