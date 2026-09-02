'use client';
// Generated from Checkbox.spec.ts
import * as React from 'react';
import { useRef, useCallback } from 'react';
import { composeHandlers, useMergedRef, withMoveComponent } from '../../../engine';
import { useFieldControl } from '../FormField/FormField';
import type { SlotPropsMap } from '../../../engine/types';
import { useCheckbox } from './useCheckbox';
import {
  useAnimations,
  resolveAnimationsConfig,
  scaleIn,
  scaleOut,
  fadeIn,
  fadeOut,
  scaleDown,
} from '../../../animation';
import type { AnimationTrigger, AnimationState } from '../../../animation';
import { useResolvedIcon } from '../../../infrastructure/Icon';
import styles from './Checkbox.module.css';

// =============================================================================
// Types
// =============================================================================

type CheckboxSlots = 'root' | 'indicator' | 'icon';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Controlled checked state */
  checked?: boolean;
  /**
   * Render the checkbox VISUAL only — no role, not focusable, aria-hidden,
   * pointer-events off — driven purely by `checked`. For embedding the box
   * inside a control that already owns the interaction and accessible state
   * (e.g. a Dropdown menuitemcheckbox), where a nested role="checkbox" would be
   * invalid. Not a form control on its own.
   */
  decorative?: boolean;
  /** Default checked state for uncontrolled mode */
  defaultChecked?: boolean;
  /** Indeterminate (mixed) state */
  indeterminate?: boolean;
  /** Called when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Icon name for the check indicator (resolved via useResolvedIcon) */
  icon?: string;
  /** Toggle animation config or false to disable */
  animations?: AnimationTrigger[] | false;
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
  ),
);
CheckboxGroup.displayName = 'Checkbox.Group';

// =============================================================================
// Checkbox component
// =============================================================================

const CheckboxRoot = withMoveComponent<
  CheckboxSlots,
  CheckboxProps,
  HTMLButtonElement,
  { Group: typeof CheckboxGroup }
>({
  name: 'Checkbox',
  styles,
  slots: ['root', 'indicator', 'icon'] as const,
  defaults: { icon: 'check', disabled: false },
  moveProps: [
    'checked',
    'defaultChecked',
    'indeterminate',
    'onCheckedChange',
    'icon',
    'animations',
    'size',
    'invalid',
    'name',
    'value',
    'required',
    'decorative',
  ],
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
      animations: animationsProp,
      size,
      disabled,
      invalid,
      name,
      value,
      children,
    } = props;

    // Headless checkbox state
    const checkbox = useCheckbox({
      checked: controlledChecked as boolean | undefined,
      defaultChecked: defaultChecked as boolean | undefined,
      indeterminate: indeterminate as boolean | undefined,
      onChange: onCheckedChange as ((checked: boolean) => void) | undefined,
    });

    const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
      {
        trigger: 'checked',
        sequence: [{ target: 'indicator', animation: { ...scaleIn(0.5), ...fadeIn() } }],
      },
      {
        trigger: 'unchecked',
        sequence: [{ target: 'indicator', animation: { ...scaleOut(0.5), ...fadeOut() } }],
      },
      {
        trigger: 'Root.press',
        sequence: [{ animation: scaleDown(0.9) }],
      },
    ];

    const STATES: AnimationState[] = [
      { name: 'checked', slot: 'Root', source: 'data-state', value: 'checked' },
      { name: 'unchecked', slot: 'Root', source: 'data-state', value: 'unchecked' },
    ];

    const animConfig = resolveAnimationsConfig(
      DEFAULT_ANIMATIONS,
      animationsProp as AnimationTrigger[] | false | undefined,
    );

    const indicatorRef = useRef<HTMLSpanElement>(null);
    const rootRef = useRef<HTMLButtonElement>(null);

    const refs = React.useMemo(
      () => ({
        Root: rootRef as React.RefObject<HTMLElement | null>,
        indicator: indicatorRef as React.RefObject<HTMLElement | null>,
      }),
      [],
    );

    const { handlers } = useAnimations(animConfig, refs, STATES);

    // Press handlers on root
    const handlePressDown = useCallback(() => {
      if (disabled) return;
      handlers.Root?.onMouseDown?.();
    }, [disabled, handlers]);

    const handlePressUp = useCallback(() => {
      handlers.Root?.onMouseUp?.();
    }, [handlers]);

    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 17;
    // A partially-selected group shows a RULE, not a tick. Every browser draws
    // one natively for `indeterminate`, and the whole point of the state is that
    // it is distinguishable from checked — `aria-checked="mixed"` said so while
    // the box showed the same tick, so it was announced and not shown.
    //
    // Both resolved unconditionally, and the rule by a literal name: hooks
    // cannot be called in a branch, and `check:icon-usage` reads literal icon
    // names out of the source to keep the spec's `iconsUsed` honest — a name
    // arriving through a variable is invisible to it.
    const checkedIcon = useResolvedIcon(icon as string, iconSize);
    const indeterminateIcon = useResolvedIcon('minus', iconSize);
    const resolvedIcon = indeterminate ? indeterminateIcon : checkedIcon;

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, rootRef);
    // A role="checkbox" button isn't named by a wrapping <label>, so name it from
    // its own children via aria-labelledby. Plus the shared field wiring.
    const labelId = React.useId();
    const controlProps = useFieldControl(attrs as Record<string, unknown>, {
      invalid: !!invalid,
      ref: rootRef,
    });

    const handleClick = () => {
      if (disabled) return;
      checkbox.toggle();
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

        const {
          className: rootSpClass,
          style: rootSpStyle,
          ...rootSpRest
        } = rootSp as Record<string, unknown>;
        const {
          className: indSpClass,
          style: indSpStyle,
          ...indSpRest
        } = indicatorSp as Record<string, unknown>;
        const {
          className: iconSpClass,
          style: iconSpStyle,
          ...iconSpRest
        } = iconSp as Record<string, unknown>;

        const dataState = checkbox.indeterminate
          ? 'indeterminate'
          : checkbox.checked
            ? 'checked'
            : 'unchecked';

        // The box + checkmark visual, shared by the interactive and decorative
        // renders so there is exactly one checkbox appearance.
        const box = (
          <span
            {...indSpRest}
            ref={indicatorRef}
            className={cx('indicator', indSpClass as string | undefined)}
            style={indSpStyle as React.CSSProperties}
          >
            <span
              {...iconSpRest}
              className={cx('icon', iconSpClass as string | undefined)}
              style={iconSpStyle as React.CSSProperties}
            >
              {resolvedIcon || (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
          </span>
        );

        // Decorative: just the visual, no role/focus/interaction — a parent
        // control owns the state (e.g. Dropdown.CheckboxItem).
        if (props.decorative) {
          return (
            <span
              {...attrs}
              {...rootSpRest}
              ref={mergedRef}
              aria-hidden="true"
              data-state={dataState}
              {...(size && size !== 'md' ? { 'data-size': size } : {})}
              className={cx('root', className, rootSpClass as string | undefined)}
              style={{
                ...style,
                ...(rootSpStyle as React.CSSProperties),
                pointerEvents: 'none',
              }}
            >
              {box}
            </span>
          );
        }

        return (
          <label
            className={styles.wrapper}
            {...(disabled ? { 'data-disabled': '' } : {})}
            onMouseDown={handlePressDown}
            onMouseUp={handlePressUp}
            onMouseLeave={handlePressUp}
          >
            <button
              {...controlProps}
              {...rootSpRest}
              ref={mergedRef}
              type="button"
              role="checkbox"
              aria-checked={checkbox.indeterminate ? 'mixed' : checkbox.checked}
              aria-labelledby={
                [
                  controlProps['aria-labelledby'] as string | undefined,
                  children != null ? labelId : undefined,
                ]
                  .filter(Boolean)
                  .join(' ') || undefined
              }
              aria-required={props.required ? true : undefined}
              data-state={dataState}
              {...(size && size !== 'md' ? { 'data-size': size } : {})}
              {...(invalid ? { 'data-invalid': '' } : {})}
              disabled={disabled as boolean}
              className={cx('root', className, rootSpClass as string | undefined)}
              style={{ ...style, ...(rootSpStyle as React.CSSProperties) }}
              onClick={composeHandlers(controlProps.onClick, handleClick)}
              onKeyDown={composeHandlers(controlProps.onKeyDown, handleKeyDown)}
            >
              {box}
            </button>
            {name && (
              <input
                type="hidden"
                name={name as string}
                value={checkbox.checked ? ((value as string) ?? 'on') : ''}
              />
            )}
            {children != null && <span id={labelId}>{children}</span>}
          </label>
        );
      },
    };
  },
});

export const Checkbox = CheckboxRoot;
