'use client';

import * as React from 'react';
import { Switch as RadixSwitch } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import { useToggleAnimation, type UseToggleAnimationReturn } from '../../../animation/hooks';
import type { IndicatorAnimate } from '../../../animation/types';
import styles from './Switch.module.css';

// ============================================================================
// Context (shares toggle animation between Root and Thumb)
// ============================================================================

interface SwitchContextValue {
  toggleAnim: UseToggleAnimationReturn;
}

const SwitchContext = React.createContext<SwitchContextValue | null>(null);

// ============================================================================
// Root
// ============================================================================

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Whether the switch is in an invalid state */
  invalid?: boolean;
  /** Optional label displayed beside the switch */
  label?: React.ReactNode;
  /** Size of the switch */
  size?: SwitchSize;
  /** Animation configuration */
  animate?: IndicatorAnimate | false;
  required?: boolean;
  name?: string;
  value?: string;
  sp?: SlotPropsMap<'root'>;
}

const SwitchRoot = withMoveComponent<'root', SwitchRootProps, HTMLButtonElement>({
  name: 'SwitchRoot',
  styles,
  slots: ['root'] as const,
  moveProps: ['checked', 'defaultChecked', 'onCheckedChange', 'disabled', 'invalid', 'label', 'size', 'animate', 'required', 'name', 'value'],

  setup({ props, ref, cx, sp, attrs }) {
    const toggleAnim = useToggleAnimation({
      animate: props.animate as IndicatorAnimate | false | undefined,
      disabled: !!props.disabled,
      initialChecked: false,
      onSetup: (el) => {
        const root = el.parentElement;
        if (!root) return { initialStyle: { transform: 'translateX(0px)' }, checked: { x: 0, easing: 'snappy' as const }, unchecked: { x: 0, easing: 'snappy' as const } };
        const rootStyle = getComputedStyle(root);
        const contentWidth = root.clientWidth - parseFloat(rootStyle.paddingLeft) - parseFloat(rootStyle.paddingRight);
        const thumbWidth = el.getBoundingClientRect().width;
        const dist = contentWidth - thumbWidth;
        const isChecked = el.getAttribute('data-state') === 'checked';
        return {
          initialStyle: { transform: isChecked ? `translateX(${dist}px)` : 'translateX(0px)' },
          checked: { x: dist, easing: 'snappy' as const },
          unchecked: { x: 0, easing: 'snappy' as const },
        };
      },
    });

    const contextValue = React.useMemo(() => ({ toggleAnim }), [toggleAnim]);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const switchEl = (
          <SwitchContext.Provider value={contextValue}>
            <RadixSwitch.Root
              {...attrs}
              {...spRest}
              ref={ref}
              data-size={props.size}
              checked={props.checked as boolean}
              defaultChecked={props.defaultChecked as boolean}
              onCheckedChange={props.onCheckedChange as (checked: boolean) => void}
              disabled={props.disabled as boolean}
              required={props.required as boolean}
              name={props.name as string}
              value={props.value as string}
              {...(props.invalid ? { 'data-invalid': '' } : {})}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
              onMouseDown={toggleAnim.pressHandlers.onMouseDown}
              onMouseUp={toggleAnim.pressHandlers.onMouseUp}
              onMouseLeave={toggleAnim.pressHandlers.onMouseLeave}
            >
              {props.children}
            </RadixSwitch.Root>
          </SwitchContext.Provider>
        );

        if (props.label != null) {
          return (
            <label className={styles.wrapper} {...(props.disabled ? { 'data-disabled': '' } : {})}>
              {switchEl}
              <span className={styles.label}>{props.label as React.ReactNode}</span>
            </label>
          );
        }

        return switchEl;
      },
    };
  },
});

// ============================================================================
// Thumb
// ============================================================================

export interface SwitchThumbProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'thumb'>;
}

const SwitchThumb = withMoveComponent<'thumb', SwitchThumbProps, HTMLSpanElement>({
  name: 'SwitchThumb',
  styles,
  slots: ['thumb'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const ctx = React.useContext(SwitchContext);
    const toggleAnim = ctx?.toggleAnim;

    // Merge forwarded ref with both rootRef (press target) and indicatorRef (toggle target)
    const thumbCallback = React.useCallback(
      (node: HTMLSpanElement | null) => {
        if (toggleAnim) {
          (toggleAnim.rootRef as React.MutableRefObject<HTMLElement | null>).current = node;
          (toggleAnim.indicatorRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
        if (typeof ref === 'function') (ref as (el: HTMLSpanElement | null) => void)(node);
        else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
      },
      [ref, toggleAnim],
    );

    return {
      render() {
        const thumbSp = sp('thumb');
        const { className: spClass, style: spStyle, ...spRest } = thumbSp as Record<string, unknown>;
        return (
          <RadixSwitch.Thumb
            {...attrs}
            {...spRest}
            ref={thumbCallback}
            className={cx('thumb', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          />
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Switch = {
  Root: SwitchRoot,
  Thumb: SwitchThumb,
};
