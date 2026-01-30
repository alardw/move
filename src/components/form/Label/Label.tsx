'use client';

import * as React from 'react';
import { Label as RadixLabel } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import styles from './Label.module.css';

// ============================================================================
// Label
// ============================================================================

export interface LabelProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  disabled?: boolean;
  pt?: PassThrough<'root' | 'asterisk'>;
}

const LabelRoot = withMoveComponent<'root' | 'asterisk', LabelProps, HTMLLabelElement>({
  name: 'Label',
  styles,
  slots: ['root', 'asterisk'] as const,
  moveProps: ['htmlFor', 'required', 'disabled'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const rootPt = ptm('root');
        const asteriskPt = ptm('asterisk');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;
        const { className: astPtClass, style: astPtStyle, ...astPtRest } = asteriskPt as Record<string, unknown>;

        return (
          <RadixLabel.Root
            {...attrs}
            {...ptRest}
            ref={ref}
            htmlFor={props.htmlFor as string}
            className={cx('root', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
            {...(props.disabled ? { 'data-disabled': '' } : {})}
          >
            {props.children}
            {props.required && (
              <span
                {...astPtRest}
                className={cx('asterisk', astPtClass as string | undefined)}
                style={astPtStyle as React.CSSProperties}
                aria-hidden="true"
              >
                *
              </span>
            )}
          </RadixLabel.Root>
        );
      },
    };
  },
});

export const Label = LabelRoot;
