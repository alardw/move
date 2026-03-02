'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine/useMergedRef';
import type { SlotPropsMap } from '../../../engine/types';
import styles from './InputText.module.css';

export type InputTextVariant = 'outlined' | 'filled';
export type InputTextSize = 'sm' | 'md' | 'lg';

type InputTextSlots = 'root' | 'input' | 'iconLeft' | 'iconRight';

export interface InputTextProps extends Record<string, unknown> {
  variant?: InputTextVariant;
  size?: InputTextSize;
  invalid?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  width?: React.CSSProperties['width'];
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  type?: string;
  name?: string;
  id?: string;
  required?: boolean;
  autoFocus?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  sp?: SlotPropsMap<InputTextSlots>;
}

export const InputText = withMoveComponent<InputTextSlots, InputTextProps, HTMLInputElement>({
  name: 'InputText',
  styles,
  slots: ['root', 'input', 'iconLeft', 'iconRight'] as const,
  defaults: { variant: 'outlined', size: 'md', type: 'text' },
  moveProps: ['variant', 'size', 'invalid', 'iconLeft', 'iconRight', 'width'],

  setup({ props, ref, cx, sp, attrs }) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRef<HTMLInputElement>(ref, inputRef);

    // Click on wrapper focuses the input
    const handleRootClick = () => {
      inputRef.current?.focus();
    };

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const inputSp = sp('input');
        const { className: inSpClass, style: inSpStyle, ...inSpRest } = inputSp as Record<string, unknown>;
        const leftSp = sp('iconLeft');
        const { className: leftSpClass, style: leftSpStyle, ...leftSpRest } = leftSp as Record<string, unknown>;
        const rightSp = sp('iconRight');
        const { className: rightSpClass, style: rightSpStyle, ...rightSpRest } = rightSp as Record<string, unknown>;

        return (
          <div
            {...spRest}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(props.width != null ? { width: props.width } : {}), ...(spStyle as React.CSSProperties) }}
            data-variant={props.variant}
            data-size={props.size}
            {...(props.invalid ? { 'data-invalid': '' } : {})}
            {...(props.disabled ? { 'data-disabled': '' } : {})}
            {...(props.readOnly ? { 'data-readonly': '' } : {})}
            onClick={handleRootClick}
          >
            {props.iconLeft && (
              <span
                {...leftSpRest}
                className={cx('iconLeft', leftSpClass as string | undefined)}
                style={leftSpStyle as React.CSSProperties}
                aria-hidden="true"
              >
                {props.iconLeft as React.ReactNode}
              </span>
            )}
            <input
              {...attrs}
              {...inSpRest}
              ref={mergedRef}
              className={cx('input', inSpClass as string | undefined)}
              style={inSpStyle as React.CSSProperties}
              disabled={props.disabled as boolean}
            />
            {props.iconRight && (
              <span
                {...rightSpRest}
                className={cx('iconRight', rightSpClass as string | undefined)}
                style={rightSpStyle as React.CSSProperties}
                aria-hidden="true"
              >
                {props.iconRight as React.ReactNode}
              </span>
            )}
          </div>
        );
      },
    };
  },
});
