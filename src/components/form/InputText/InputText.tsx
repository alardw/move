'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine/useMergedRef';
import type { PassThrough } from '../../../engine/types';
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
  pt?: PassThrough<InputTextSlots>;
}

export const InputText = withMoveComponent<InputTextSlots, InputTextProps, HTMLInputElement>({
  name: 'InputText',
  styles,
  slots: ['root', 'input', 'iconLeft', 'iconRight'] as const,
  defaults: { variant: 'outlined', size: 'md', type: 'text' },
  moveProps: ['variant', 'size', 'invalid', 'iconLeft', 'iconRight', 'width'],

  setup({ props, ref, cx, ptm, attrs }) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRef<HTMLInputElement>(ref, inputRef);

    // Click on wrapper focuses the input
    const handleRootClick = () => {
      inputRef.current?.focus();
    };

    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;
        const inputPt = ptm('input');
        const { className: inPtClass, style: inPtStyle, ...inPtRest } = inputPt as Record<string, unknown>;
        const leftPt = ptm('iconLeft');
        const { className: leftPtClass, style: leftPtStyle, ...leftPtRest } = leftPt as Record<string, unknown>;
        const rightPt = ptm('iconRight');
        const { className: rightPtClass, style: rightPtStyle, ...rightPtRest } = rightPt as Record<string, unknown>;

        return (
          <div
            {...ptRest}
            className={cx('root', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(props.width != null ? { width: props.width } : {}), ...(ptStyle as React.CSSProperties) }}
            data-variant={props.variant}
            data-size={props.size}
            {...(props.invalid ? { 'data-invalid': '' } : {})}
            {...(props.disabled ? { 'data-disabled': '' } : {})}
            {...(props.readOnly ? { 'data-readonly': '' } : {})}
            onClick={handleRootClick}
          >
            {props.iconLeft && (
              <span
                {...leftPtRest}
                className={cx('iconLeft', leftPtClass as string | undefined)}
                style={leftPtStyle as React.CSSProperties}
                aria-hidden="true"
              >
                {props.iconLeft as React.ReactNode}
              </span>
            )}
            <input
              {...attrs}
              {...inPtRest}
              ref={mergedRef}
              className={cx('input', inPtClass as string | undefined)}
              style={inPtStyle as React.CSSProperties}
              disabled={props.disabled as boolean}
            />
            {props.iconRight && (
              <span
                {...rightPtRest}
                className={cx('iconRight', rightPtClass as string | undefined)}
                style={rightPtStyle as React.CSSProperties}
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
