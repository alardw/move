'use client';
// Generated from Label.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { Label as RadixLabel } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import styles from './Label.module.css';

export type LabelSize = 'sm' | 'md' | 'lg';

export interface LabelProps extends React.HTMLAttributes<HTMLElement> {
  htmlFor?: string;
  required?: boolean;
  disabled?: boolean;
  size?: LabelSize;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Label = withMoveComponent<'root' | 'asterisk', LabelProps, HTMLLabelElement>({
  name: 'Label',
  styles,
  slots: ['root', 'asterisk'] as const,
  defaults: { size: 'md' as LabelSize },
  moveProps: ['htmlFor', 'required', 'disabled'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const asteriskSp = sp('asterisk');
        const {
          className: astSpClass,
          style: astSpStyle,
          ...astSpRest
        } = asteriskSp as Record<string, unknown>;

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
