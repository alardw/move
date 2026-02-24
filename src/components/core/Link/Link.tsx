'use client';

import React from 'react';
import { Slot } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import styles from './Link.module.css';

export type LinkVariant = 'default' | 'muted' | 'subtle';
export type LinkUnderline = 'always' | 'hover' | 'none';
export type LinkSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';

export interface LinkProps extends Record<string, unknown> {
  variant?: LinkVariant;
  underline?: LinkUnderline;
  size?: LinkSize;
  external?: boolean;
  asChild?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Link = withMoveComponent<'root', LinkProps, HTMLAnchorElement>({
  name: 'Link',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'default', underline: 'hover', asChild: false },
  moveProps: ['variant', 'underline', 'size', 'external', 'asChild'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;

        const Comp = props.asChild ? Slot.Root : 'a';
        const externalProps = props.external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {};

        return (
          <Comp
            {...attrs}
            {...externalProps}
            {...ptRest}
            ref={ref}
            className={cx('root', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
            data-variant={props.variant}
            data-underline={props.underline}
            {...(props.size ? { 'data-size': props.size } : {})}
          >
            {props.children}
          </Comp>
        );
      },
    };
  },
});
