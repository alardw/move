'use client';
// Generated from RadioGroup.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { useRef } from 'react';
import { RadioGroup as RadixRadioGroup } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import { useAnimations, resolveAnimationsConfig, poppy, snappy } from '../../../animation';
import type { AnimationTrigger, AnimationState } from '../../../animation';
import styles from './RadioGroup.module.css';

// ============================================================================
// Types
// ============================================================================

export type RadioGroupSize = 'sm' | 'md' | 'lg';

// ============================================================================
// Root
// ============================================================================

export interface RadioGroupRootProps extends React.HTMLAttributes<HTMLElement> {
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
  size?: RadioGroupSize;
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  sp?: SlotPropsMap<'root'>;
}

const RadioGroupRoot = withMoveComponent<'root', RadioGroupRootProps, HTMLDivElement>({
  name: 'RadioGroupRoot',
  styles,
  slots: ['root'] as const,
  moveProps: ['invalid', 'size'],

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

export interface RadioGroupItemProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
  /** Toggle animation config or false to disable */
  animations?: AnimationTrigger[] | false;
  sp?: SlotPropsMap<'item' | 'indicator' | 'dot'>;
}

const DEFAULT_RADIO_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'checked',
    sequence: [
      {
        target: 'Indicator',
        animation: {
          scale: { from: 0.5, to: 1, ease: poppy },
          opacity: { from: 0, to: 1, duration: 150 },
        },
      },
    ],
  },
  {
    trigger: 'unchecked',
    sequence: [
      {
        target: 'Indicator',
        animation: { scale: { to: 0.5, duration: 150 }, opacity: { to: 0, duration: 150 } },
      },
    ],
  },
  { trigger: 'Item.press', sequence: [{ animation: { scale: { to: 0.9, ease: snappy } } }] },
];

const RADIO_STATES: AnimationState[] = [
  { name: 'checked', slot: 'Item', source: 'data-state', value: 'checked' },
  { name: 'unchecked', slot: 'Item', source: 'data-state', value: 'unchecked' },
];

const RadioGroupItem = withMoveComponent<
  'item' | 'indicator' | 'dot',
  RadioGroupItemProps,
  HTMLButtonElement
>({
  name: 'RadioGroupItem',
  styles,
  slots: ['item', 'indicator', 'dot'] as const,
  moveProps: ['value', 'animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const animConfig = resolveAnimationsConfig(
      DEFAULT_RADIO_ANIMATIONS,
      props.animations as AnimationTrigger[] | false | undefined,
    );

    const itemRef = useRef<HTMLButtonElement>(null);
    const indicatorRef = useRef<HTMLSpanElement>(null);
    const mergedRef = useMergedRef<HTMLButtonElement>(ref, itemRef);

    const refs = React.useMemo(
      () => ({
        Item: itemRef as React.RefObject<HTMLElement | null>,
        Indicator: indicatorRef as React.RefObject<HTMLElement | null>,
      }),
      [],
    );

    const { handlers } = useAnimations(animConfig, refs, RADIO_STATES);
    const isDisabled = !!props.disabled;

    const handleWrapperClick = () => {
      if (isDisabled) return;
      (itemRef.current as HTMLButtonElement)?.click();
    };

    return {
      render() {
        const itemSp = sp('item');
        const indicatorSp = sp('indicator');
        const dotSp = sp('dot');

        const {
          className: itemSpClass,
          style: itemSpStyle,
          ...itemSpRest
        } = itemSp as Record<string, unknown>;
        const {
          className: indSpClass,
          style: indSpStyle,
          ...indSpRest
        } = indicatorSp as Record<string, unknown>;
        const {
          className: dotSpClass,
          style: dotSpStyle,
          ...dotSpRest
        } = dotSp as Record<string, unknown>;

        return (
          <span
            className={styles.wrapper}
            onClick={handleWrapperClick}
            onMouseDown={() => {
              if (!isDisabled) handlers.Item?.onMouseDown?.();
            }}
            onMouseUp={() => {
              if (!isDisabled) handlers.Item?.onMouseUp?.();
            }}
            onMouseLeave={() => {
              if (!isDisabled) handlers.Item?.onMouseLeave?.();
            }}
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
                ref={indicatorRef}
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
