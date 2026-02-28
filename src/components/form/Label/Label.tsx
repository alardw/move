'use client';

import * as React from 'react';
import { Label as RadixLabel } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import styles from './Label.module.css';

// ============================================================================
// Label
// ============================================================================

export type LabelSize = 'sm' | 'md' | 'lg';

export interface LabelProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  disabled?: boolean;
  size?: LabelSize;
  sp?: SlotPropsMap<'root' | 'asterisk'>;
}

const LabelRoot = withMoveComponent<'root' | 'asterisk', LabelProps, HTMLLabelElement>({
  name: 'Label',
  styles,
  slots: ['root', 'asterisk'] as const,
  moveProps: ['htmlFor', 'required', 'disabled', 'size'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const asteriskSp = sp('asterisk');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const { className: astSpClass, style: astSpStyle, ...astSpRest } = asteriskSp as Record<string, unknown>;

        return (
          <RadixLabel.Root
            {...attrs}
            {...spRest}
            ref={ref}
            htmlFor={props.htmlFor as string}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-size={props.size}
            {...(props.disabled ? { 'data-disabled': '' } : {})}
          >
            {props.children}
            {props.required && (
              <span
                {...astSpRest}
                className={cx('asterisk', astSpClass as string | undefined)}
                style={astSpStyle as React.CSSProperties}
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
