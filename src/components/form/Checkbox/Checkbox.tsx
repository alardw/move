'use client';

import * as React from 'react';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import { useCheckbox } from './useCheckbox';
import { useToggleAnimation } from '../../../animation/hooks';
import type { ToggleableAnimate } from '../../../animation/types';
import { Icon } from '../../core/Icon/Icon';
import styles from './Checkbox.module.css';

// =============================================================================
// Types
// =============================================================================

type CheckboxSlots = 'root' | 'indicator' | 'icon';

export interface CheckboxProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Controlled checked state */
  checked?: boolean;
  /** Default checked state */
  defaultChecked?: boolean;
  /** Indeterminate state */
  indeterminate?: boolean;
  /** Called when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Icon name for the check indicator (requires IconProvider) */
  icon?: string;
  /** Animation configuration */
  animate?: ToggleableAnimate | false;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Name for form submission */
  name?: string;
  /** Value for form submission */
  value?: string;
  /** Required for form validation */
  required?: boolean;
  /** Pass-through slot props */
  pt?: PassThrough<CheckboxSlots>;
}

// =============================================================================
// Checkbox.Group sub-component
// =============================================================================

export interface CheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ children, style, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', ...style }}
      {...props}
    >
      {children}
    </div>
  )
);
CheckboxGroup.displayName = 'Checkbox.Group';

// =============================================================================
// Checkbox component
// =============================================================================

const CheckboxRoot = withMoveComponent<CheckboxSlots, CheckboxProps, HTMLButtonElement, { Group: typeof CheckboxGroup }>({
  name: 'Checkbox',
  styles,
  slots: ['root', 'indicator', 'icon'] as const,
  defaults: { icon: 'check', disabled: false },
  moveProps: ['checked', 'defaultChecked', 'indeterminate', 'onCheckedChange', 'icon', 'animate', 'disabled', 'name', 'value', 'required'],
  subComponents: { Group: CheckboxGroup },

  setup({ props, ref, cx, ptm, attrs }) {
    const {
      className,
      style,
      checked: controlledChecked,
      defaultChecked,
      indeterminate,
      onCheckedChange,
      icon,
      animate: animateProp,
      disabled,
      name,
      value,
      required,
      children,
    } = props;

    // Headless checkbox state
    const checkbox = useCheckbox({
      checked: controlledChecked as boolean | undefined,
      defaultChecked: defaultChecked as boolean | undefined,
      indeterminate: indeterminate as boolean | undefined,
      onChange: onCheckedChange as ((checked: boolean) => void) | undefined,
    });

    // Toggle animation
    const toggleAnim = useToggleAnimation({
      animate: animateProp as ToggleableAnimate | false | undefined,
      initialChecked: checkbox.checked,
      disabled,
    });

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, toggleAnim.rootRef as React.Ref<HTMLButtonElement>);

    const handleClick = () => {
      if (disabled) return;

      const newChecked = !checkbox.checked;
      checkbox.toggle();

      if (newChecked) {
        toggleAnim.animateChecked();
      } else {
        toggleAnim.animateUnchecked();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleClick();
      }
    };

    return {
      render() {
        const rootPt = ptm('root');
        const indicatorPt = ptm('indicator');
        const iconPt = ptm('icon');

        const { className: rootPtClass, style: rootPtStyle, ...rootPtRest } = rootPt as Record<string, unknown>;
        const { className: indPtClass, style: indPtStyle, ...indPtRest } = indicatorPt as Record<string, unknown>;
        const { className: iconPtClass, style: iconPtStyle, ...iconPtRest } = iconPt as Record<string, unknown>;

        const dataState = checkbox.indeterminate
          ? 'indeterminate'
          : checkbox.checked
            ? 'checked'
            : 'unchecked';

        return (
          <div
            className={styles.wrapper}
            onMouseDown={toggleAnim.pressHandlers.onMouseDown}
            onMouseUp={toggleAnim.pressHandlers.onMouseUp}
            onMouseLeave={toggleAnim.pressHandlers.onMouseLeave}
          >
            <button
              {...attrs}
              {...rootPtRest}
              ref={mergedRef}
              type="button"
              role="checkbox"
              aria-checked={checkbox.indeterminate ? 'mixed' : checkbox.checked}
              data-state={dataState}
              disabled={disabled}
              className={cx('root', className, rootPtClass as string | undefined)}
              style={{ ...style, ...(rootPtStyle as React.CSSProperties) }}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
            >
              <span
                {...indPtRest}
                ref={toggleAnim.indicatorRef as React.RefObject<HTMLSpanElement>}
                className={cx('indicator', indPtClass as string | undefined)}
                style={indPtStyle as React.CSSProperties}
              >
                <span
                  {...iconPtRest}
                  className={cx('icon', iconPtClass as string | undefined)}
                  style={iconPtStyle as React.CSSProperties}
                >
                  <Icon name={icon as string} size={18} />
                </span>
              </span>
            </button>
            {/* Hidden input for form submission */}
            {name && (
              <input
                type="hidden"
                name={name as string}
                value={checkbox.checked ? (value as string ?? 'on') : ''}
              />
            )}
            {children}
          </div>
        );
      },
    };
  },
});

export const Checkbox = CheckboxRoot;
