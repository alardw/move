'use client';
// Generated from InputText.spec.ts
import * as React from 'react';
import type { Dimension } from '../../../shared/types';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useFieldControl } from '../FormField/FormField';
import styles from './InputText.module.css';

export type InputTextVariant = 'outlined' | 'filled';
export type InputTextSize = 'sm' | 'md' | 'lg';

export interface InputTextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: InputTextVariant;
  size?: InputTextSize;
  invalid?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  width?: Dimension;
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
  className?: string;
  style?: React.CSSProperties;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export const InputText = withMoveComponent<
  'root' | 'input' | 'iconLeft' | 'iconRight',
  InputTextProps,
  HTMLInputElement
>({
  name: 'InputText',
  styles,
  slots: ['root', 'input', 'iconLeft', 'iconRight'] as const,
  defaults: { variant: 'outlined' as InputTextVariant, size: 'md' as InputTextSize, type: 'text' },
  moveProps: ['variant', 'size', 'invalid', 'iconLeft', 'iconRight', 'width'],

  setup({ props, ref, cx, sp, attrs }) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRef<HTMLInputElement>(ref, inputRef);
    const controlProps = useFieldControl(attrs as Record<string, unknown>, {
      invalid: !!props.invalid,
      ref: inputRef,
    });

    const handleRootClick = () => {
      inputRef.current?.focus();
    };

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const inputSp = sp('input');
        const {
          className: inSpClass,
          style: inSpStyle,
          ...inSpRest
        } = inputSp as Record<string, unknown>;
        const leftSp = sp('iconLeft');
        const {
          className: leftSpClass,
          style: leftSpStyle,
          ...leftSpRest
        } = leftSp as Record<string, unknown>;
        const rightSp = sp('iconRight');
        const {
          className: rightSpClass,
          style: rightSpStyle,
          ...rightSpRest
        } = rightSp as Record<string, unknown>;

        return (
          <div
            {...spRest}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{
              ...props.style,
              ...(props.width != null ? { width: props.width } : {}),
              ...(spStyle as React.CSSProperties),
            }}
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
              {...controlProps}
              {...inSpRest}
              ref={mergedRef}
              type={props.type as string}
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
