'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine/useMergedRef';
import type { PassThrough } from '../../../engine/types';
import { useResolvedIcon } from '../../core/Icon/useResolvedIcon';
import styles from './Password.module.css';

export type PasswordVariant = 'outlined' | 'filled';
export type PasswordSize = 'sm' | 'md' | 'lg';

type PasswordSlots = 'root' | 'input' | 'iconLeft' | 'toggle' | 'toggleIcon';

export interface PasswordProps extends Record<string, unknown> {
  variant?: PasswordVariant;
  size?: PasswordSize;
  invalid?: boolean;
  iconLeft?: React.ReactNode;
  showIcon?: React.ReactNode;
  hideIcon?: React.ReactNode;
  width?: React.CSSProperties['width'];
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  name?: string;
  id?: string;
  required?: boolean;
  autoFocus?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  pt?: PassThrough<PasswordSlots>;
}

export const Password = withMoveComponent<PasswordSlots, PasswordProps, HTMLInputElement>({
  name: 'Password',
  styles,
  slots: ['root', 'input', 'iconLeft', 'toggle', 'toggleIcon'] as const,
  defaults: { variant: 'outlined', size: 'md' },
  moveProps: ['variant', 'size', 'invalid', 'iconLeft', 'showIcon', 'hideIcon', 'width', 'visible', 'defaultVisible', 'onVisibleChange'],

  setup({ props, ref, cx, ptm, attrs }) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRef<HTMLInputElement>(ref, inputRef);

    const isControlled = props.visible !== undefined;
    const [internalVisible, setInternalVisible] = React.useState(
      () => (props.defaultVisible as boolean | undefined) ?? false,
    );
    const shown = isControlled ? (props.visible as boolean) : internalVisible;

    const handleToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (props.disabled) return;
      const next = !shown;
      if (!isControlled) setInternalVisible(next);
      (props.onVisibleChange as ((v: boolean) => void) | undefined)?.(next);
    };

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
        const togglePt = ptm('toggle');
        const { className: togglePtClass, style: togglePtStyle, ...togglePtRest } = togglePt as Record<string, unknown>;
        const toggleIconPt = ptm('toggleIcon');
        const { className: tiPtClass, style: tiPtStyle, ...tiPtRest } = toggleIconPt as Record<string, unknown>;

        const defaultShowIcon = (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
        const defaultHideIcon = (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
            <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
            <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
            <path d="m2 2 20 20" />
          </svg>
        );

        const showIconNode = (props.showIcon as React.ReactNode) ?? defaultShowIcon;
        const hideIconNode = (props.hideIcon as React.ReactNode) ?? defaultHideIcon;

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
              type={shown ? 'text' : 'password'}
              className={cx('input', inPtClass as string | undefined)}
              style={inPtStyle as React.CSSProperties}
              disabled={props.disabled as boolean}
            />
            <button
              {...togglePtRest}
              type="button"
              className={cx('toggle', togglePtClass as string | undefined)}
              style={togglePtStyle as React.CSSProperties}
              onClick={handleToggle}
              disabled={props.disabled as boolean}
              tabIndex={-1}
              aria-label={shown ? 'Hide password' : 'Show password'}
            >
              <span
                {...tiPtRest}
                className={cx('toggleIcon', tiPtClass as string | undefined)}
                style={tiPtStyle as React.CSSProperties}
                aria-hidden="true"
              >
                {shown ? hideIconNode : showIconNode}
              </span>
            </button>
          </div>
        );
      },
    };
  },
});
