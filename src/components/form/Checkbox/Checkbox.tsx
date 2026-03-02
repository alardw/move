'use client';
// Generated from Checkbox.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import { useCheckbox } from './useCheckbox';
import { useToggleAnimate, defaultAnimations } from '../../../animation';
import type { ToggleAnimate, InteractionAnimate } from '../../../animation';
import { useResolvedIcon } from '../../../infrastructure/Icon';
import styles from './Checkbox.module.css';

// =============================================================================
// Types
// =============================================================================

type CheckboxSlots = 'root' | 'indicator' | 'icon';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Controlled checked state */
  checked?: boolean;
  /** Default checked state for uncontrolled mode */
  defaultChecked?: boolean;
  /** Indeterminate (mixed) state */
  indeterminate?: boolean;
  /** Called when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Icon name for the check indicator (resolved via useResolvedIcon) */
  icon?: string;
  /** Toggle animation config or false to disable */
  animate?: (ToggleAnimate & InteractionAnimate) | false;
  /** Size of the checkbox */
  size?: CheckboxSize;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Whether the checkbox is in an invalid state */
  invalid?: boolean;
  /** Name for form submission (renders hidden input) */
  name?: string;
  /** Value for form submission */
  value?: string;
  /** Required for form validation */
  required?: boolean;
  /** Pass-through slot props */
  sp?: SlotPropsMap<CheckboxSlots>;
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
  moveProps: ['checked', 'defaultChecked', 'indeterminate', 'onCheckedChange', 'icon', 'animate', 'size', 'invalid', 'name', 'value', 'required'],
  subComponents: { Group: CheckboxGroup },

  setup({ props, ref, cx, sp, attrs }) {
    const {
      className,
      style,
      checked: controlledChecked,
      defaultChecked,
      indeterminate,
      onCheckedChange,
      icon,
      animate: animateProp,
      size,
      disabled,
      invalid,
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
    const toggleAnim = useToggleAnimate({
      animate: animateProp === false
        ? { checked: false as const, unchecked: false as const }
        : (animateProp as (ToggleAnimate & InteractionAnimate) | undefined) || {},
      initialChecked: checkbox.checked,
      disabled: !!disabled,
    });

    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 17;
    const resolvedIcon = useResolvedIcon(icon as string, iconSize);

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
        const rootSp = sp('root');
        const indicatorSp = sp('indicator');
        const iconSp = sp('icon');

        const { className: rootSpClass, style: rootSpStyle, ...rootSpRest } = rootSp as Record<string, unknown>;
        const { className: indSpClass, style: indSpStyle, ...indSpRest } = indicatorSp as Record<string, unknown>;
        const { className: iconSpClass, style: iconSpStyle, ...iconSpRest } = iconSp as Record<string, unknown>;

        const dataState = checkbox.indeterminate
          ? 'indeterminate'
          : checkbox.checked
            ? 'checked'
            : 'unchecked';

        return (
          <label
            className={styles.wrapper}
            {...(disabled ? { 'data-disabled': '' } : {})}
            onMouseDown={toggleAnim.pressHandlers.onMouseDown}
            onMouseUp={toggleAnim.pressHandlers.onMouseUp}
            onMouseLeave={toggleAnim.pressHandlers.onMouseLeave}
          >
            <button
              {...attrs}
              {...rootSpRest}
              ref={mergedRef}
              type="button"
              role="checkbox"
              aria-checked={checkbox.indeterminate ? 'mixed' : checkbox.checked}
              data-state={dataState}
              {...(size && size !== 'md' ? { 'data-size': size } : {})}
              {...(invalid ? { 'data-invalid': '' } : {})}
              disabled={disabled as boolean}
              className={cx('root', className, rootSpClass as string | undefined)}
              style={{ ...style, ...(rootSpStyle as React.CSSProperties) }}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
            >
              <span
                {...indSpRest}
                ref={toggleAnim.indicatorRef as React.RefObject<HTMLSpanElement>}
                className={cx('indicator', indSpClass as string | undefined)}
                style={indSpStyle as React.CSSProperties}
              >
                <span
                  {...iconSpRest}
                  className={cx('icon', iconSpClass as string | undefined)}
                  style={iconSpStyle as React.CSSProperties}
                >
                  {resolvedIcon || (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
              </span>
            </button>
            {name && (
              <input
                type="hidden"
                name={name as string}
                value={checkbox.checked ? (value as string ?? 'on') : ''}
              />
            )}
            {children}
          </label>
        );
      },
    };
  },
});

export const Checkbox = CheckboxRoot;
