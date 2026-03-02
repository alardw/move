'use client';

import * as React from 'react';
import { RadioGroup as RadixRadioGroup } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine/useMergedRef';
import type { SlotPropsMap } from '../../../engine/types';
import { useToggleAnimation } from '../../../animation/hooks';
import type { IndicatorAnimate } from '../../../animation/types';
import styles from './RadioGroup.module.css';

// ============================================================================
// Root
// ============================================================================

export interface RadioGroupRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  /** Whether the radio group is in an invalid state */
  invalid?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  sp?: SlotPropsMap<'root'>;
}

const RadioGroupRoot = withMoveComponent<'root', RadioGroupRootProps, HTMLDivElement>({
  name: 'RadioGroupRoot',
  styles,
  slots: ['root'] as const,
  moveProps: ['value', 'defaultValue', 'onValueChange', 'disabled', 'invalid', 'size', 'name', 'required', 'orientation', 'loop'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        return (
          <RadixRadioGroup.Root
            {...attrs}
            {...spRest}
            ref={ref}
            value={props.value as string}
            defaultValue={props.defaultValue as string}
            onValueChange={props.onValueChange as (value: string) => void}
            disabled={props.disabled as boolean}
            name={props.name as string}
            required={props.required as boolean}
            orientation={props.orientation as 'horizontal' | 'vertical'}
            loop={props.loop as boolean}
            {...(props.invalid ? { 'data-invalid': '' } : {})}
            {...(props.size && props.size !== 'md' ? { 'data-size': props.size } : {})}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixRadioGroup.Root>
        );
      },
    };
  },
});

// ============================================================================
// Item
// ============================================================================

export interface RadioGroupItemProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
  /** Animation configuration */
  animate?: IndicatorAnimate | false;
  sp?: SlotPropsMap<'item' | 'indicator' | 'dot'>;
}

const RadioGroupItem = withMoveComponent<'item' | 'indicator' | 'dot', RadioGroupItemProps, HTMLButtonElement>({
  name: 'RadioGroupItem',
  styles,
  slots: ['item', 'indicator', 'dot'] as const,
  moveProps: ['value', 'disabled', 'animate'],

  setup({ props, ref, cx, sp, attrs }) {
    const toggleAnim = useToggleAnimation({
      animate: props.animate as IndicatorAnimate | false | undefined,
      initialChecked: false,
      disabled: !!props.disabled,
      // watchRef defaults to rootRef — watches data-state on the button
    });

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, toggleAnim.rootRef as React.Ref<HTMLButtonElement>);

    const handleWrapperClick = () => {
      if (props.disabled) return;
      (toggleAnim.rootRef.current as HTMLButtonElement)?.click();
    };

    return {
      render() {
        const itemSp = sp('item');
        const indicatorSp = sp('indicator');
        const dotSp = sp('dot');

        const { className: itemSpClass, style: itemSpStyle, ...itemSpRest } = itemSp as Record<string, unknown>;
        const { className: indSpClass, style: indSpStyle, ...indSpRest } = indicatorSp as Record<string, unknown>;
        const { className: dotSpClass, style: dotSpStyle, ...dotSpRest } = dotSp as Record<string, unknown>;

        return (
          <span
            className={styles.wrapper}
            onMouseDown={toggleAnim.pressHandlers.onMouseDown}
            onMouseUp={toggleAnim.pressHandlers.onMouseUp}
            onMouseLeave={toggleAnim.pressHandlers.onMouseLeave}
            onClick={handleWrapperClick}
          >
            <RadixRadioGroup.Item
              {...attrs}
              {...itemSpRest}
              ref={mergedRef}
              value={props.value as string}
              disabled={props.disabled as boolean}
              className={cx('item', props.className, itemSpClass as string | undefined)}
              style={{ ...props.style, ...(itemSpStyle as React.CSSProperties) }}
            >
              <RadixRadioGroup.Indicator
                {...indSpRest}
                ref={toggleAnim.indicatorRef as React.RefObject<HTMLSpanElement>}
                className={cx('indicator', indSpClass as string | undefined)}
                style={indSpStyle as React.CSSProperties}
                forceMount
              >
                <span
                  {...dotSpRest}
                  className={cx('dot', dotSpClass as string | undefined)}
                  style={dotSpStyle as React.CSSProperties}
                />
              </RadixRadioGroup.Indicator>
            </RadixRadioGroup.Item>
            {props.children}
          </span>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
};
