'use client';
// Generated from Password.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import { useResolvedIcon } from '../../../infrastructure/Icon';
import styles from './Password.module.css';

// =============================================================================
// Types
// =============================================================================

export type PasswordVariant = 'outlined' | 'filled';
export type PasswordSize = 'sm' | 'md' | 'lg';

type PasswordSlots = 'root' | 'input' | 'iconLeft' | 'toggle' | 'toggleIcon';

export interface PasswordLabels {
  showPassword: string;
  hidePassword: string;
}

const DEFAULT_LABELS: PasswordLabels = {
  showPassword: 'Show password',
  hidePassword: 'Hide password',
};

export interface PasswordProps extends React.HTMLAttributes<HTMLElement> {
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
  labels?: Partial<PasswordLabels>;
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
  sp?: SlotPropsMap<PasswordSlots>;
}

// =============================================================================
// Component
// =============================================================================

export const Password = withMoveComponent<PasswordSlots, PasswordProps, HTMLInputElement>({
  name: 'Password',
  styles,
  slots: ['root', 'input', 'iconLeft', 'toggle', 'toggleIcon'] as const,
  defaults: { variant: 'outlined', size: 'md', defaultVisible: false },
  moveProps: ['variant', 'size', 'invalid', 'iconLeft', 'showIcon', 'hideIcon', 'width', 'visible', 'defaultVisible', 'onVisibleChange', 'labels'],

  setup({ props, ref, cx, sp, attrs }) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRef<HTMLInputElement>(ref, inputRef);

    const labels = { ...DEFAULT_LABELS, ...(props.labels as Partial<PasswordLabels>) };

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

    // Default reveal/hide glyphs resolve through the icon resolver (fall back to
    // the built-in 'eye'/'eye-off'), so they re-skin with the app's icon set.
    const defaultShowIcon = useResolvedIcon('eye', 16);
    const defaultHideIcon = useResolvedIcon('eye-off', 16);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const inputSp = sp('input');
        const { className: inSpClass, style: inSpStyle, ...inSpRest } = inputSp as Record<string, unknown>;
        const leftSp = sp('iconLeft');
        const { className: leftSpClass, style: leftSpStyle, ...leftSpRest } = leftSp as Record<string, unknown>;
        const toggleSp = sp('toggle');
        const { className: toggleSpClass, style: toggleSpStyle, ...toggleSpRest } = toggleSp as Record<string, unknown>;
        const toggleIconSp = sp('toggleIcon');
        const { className: tiSpClass, style: tiSpStyle, ...tiSpRest } = toggleIconSp as Record<string, unknown>;

        const showIconNode = (props.showIcon as React.ReactNode) ?? defaultShowIcon;
        const hideIconNode = (props.hideIcon as React.ReactNode) ?? defaultHideIcon;

        return (
          <div
            {...spRest}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(props.width != null ? { width: props.width as React.CSSProperties['width'] } : {}), ...(spStyle as React.CSSProperties) }}
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
              type={shown ? 'text' : 'password'}
              className={cx('input', inSpClass as string | undefined)}
              style={inSpStyle as React.CSSProperties}
              disabled={props.disabled as boolean}
            />
            <button
              {...toggleSpRest}
              type="button"
              className={cx('toggle', toggleSpClass as string | undefined)}
              style={toggleSpStyle as React.CSSProperties}
              onClick={handleToggle}
              disabled={props.disabled as boolean}
              tabIndex={-1}
              aria-label={shown ? labels.hidePassword : labels.showPassword}
            >
              <span
                {...tiSpRest}
                className={cx('toggleIcon', tiSpClass as string | undefined)}
                style={tiSpStyle as React.CSSProperties}
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
