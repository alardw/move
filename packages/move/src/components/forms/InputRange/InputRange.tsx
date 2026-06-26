'use client';
// Generated from InputRange.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)

import * as React from 'react';
import { Slider } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { scaleUp, scaleDown, useAnimations, resolveAnimationsConfig } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import type { SlotPropsMap } from '../../../engine';
import { useInputRange } from './useInputRange';
import type { InputRangeValue } from './useInputRange';
import styles from './InputRange.module.css';

// ============================================================================
// Types
// ============================================================================

export type InputRangeSlots = 'root' | 'track' | 'range' | 'thumb' | 'value';
export type InputRangeSize = 'sm' | 'md' | 'lg';

export interface InputRangeProps extends Record<string, unknown> {
  min?: number;
  max?: number;
  step?: number;
  value?: InputRangeValue;
  defaultValue?: InputRangeValue;
  onValueChange?: (value: number[]) => void;
  size?: InputRangeSize;
  disabled?: boolean;
  invalid?: boolean;
  orientation?: 'horizontal' | 'vertical';
  width?: React.CSSProperties['width'];
  name?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  animations?: AnimationTrigger[] | false;
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<InputRangeSlots>;
}

// ============================================================================
// Component
// ============================================================================

const defaultFormatValue = (v: number) => String(v);

export const InputRange = withMoveComponent<InputRangeSlots, InputRangeProps, HTMLSpanElement>({
  name: 'InputRange',
  styles,
  slots: ['root', 'track', 'range', 'thumb', 'value'] as const,
  moveProps: [
    'min', 'max', 'step', 'value', 'defaultValue', 'onValueChange',
    'size', 'invalid', 'orientation', 'width', 'showValue', 'formatValue', 'animations',
  ],
  defaults: {
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    orientation: 'horizontal',
  },

  setup({ props, ref, cx, sp, attrs }) {
    const { values, setValues } = useInputRange({
      value: props.value as InputRangeValue | undefined,
      defaultValue: props.defaultValue as InputRangeValue | undefined,
      onValueChange: props.onValueChange as ((value: number[]) => void) | undefined,
    });

    const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
      { trigger: 'Thumb.hover', sequence: [{ animation: scaleUp }] },
      { trigger: 'Thumb.press', sequence: [{ animation: scaleDown }] },
    ];
    const animConfig = (props.animations as AnimationTrigger[] | false | undefined) === false
      ? null
      : resolveAnimationsConfig(DEFAULT_ANIMATIONS, props.animations as AnimationTrigger[] | undefined);

    const thumbElRef = React.useRef<HTMLElement | null>(null);
    const thumbRefs = React.useMemo(() => ({ Thumb: thumbElRef }), []);
    const { handlers } = useAnimations(animConfig, thumbRefs);
    const isDisabled = !!props.disabled;

    const mergedThumbRef = useMergedRef<HTMLSpanElement>(thumbElRef as React.Ref<HTMLSpanElement>);

    return {
      render() {
        const rootSp = sp('root');
        const { className: rootSpClass, style: rootSpStyle, ...rootSpRest } = rootSp as Record<string, unknown>;

        const trackSp = sp('track');
        const { className: trackSpClass, style: trackSpStyle, ...trackSpRest } = trackSp as Record<string, unknown>;

        const rangeSp = sp('range');
        const { className: rangeSpClass, style: rangeSpStyle, ...rangeSpRest } = rangeSp as Record<string, unknown>;

        const thumbSp = sp('thumb');
        const { className: thumbSpClass, style: thumbSpStyle, ...thumbSpRest } = thumbSp as Record<string, unknown>;

        const valueSp = sp('value');
        const { className: valueSpClass, style: valueSpStyle, ...valueSpRest } = valueSp as Record<string, unknown>;

        const showValue = props.showValue as boolean | undefined;
        const format = (props.formatValue as ((v: number) => string) | undefined) ?? defaultFormatValue;
        const isRange = values.length > 1;
        const orientation = props.orientation as string;

        const rootStyle: React.CSSProperties = {
          ...(showValue ? {} : props.style),
          ...(showValue ? {} : props.width ? { width: props.width as React.CSSProperties['width'] } : {}),
          ...(rootSpStyle as React.CSSProperties),
        };

        const wrapperStyle: React.CSSProperties | undefined = showValue
          ? {
              ...props.style,
              ...(props.width ? { width: props.width as React.CSSProperties['width'] } : {}),
            }
          : undefined;

        const valueClassName = cx('value', valueSpClass as string | undefined);
        const valueStyle = valueSpStyle as React.CSSProperties | undefined;

        const slider = (
          <Slider.Root
            {...attrs}
            {...rootSpRest}
            ref={ref}
            value={values}
            onValueChange={setValues}
            min={props.min as number}
            max={props.max as number}
            step={props.step as number}
            disabled={props.disabled as boolean}
            orientation={orientation as 'horizontal' | 'vertical'}
            name={props.name as string}
            data-size={props.size as string}
            {...(props.invalid ? { 'data-invalid': '' } : {})}
            className={cx('root', showValue ? undefined : props.className, rootSpClass as string | undefined)}
            style={rootStyle}
          >
            <Slider.Track
              {...trackSpRest}
              className={cx('track', trackSpClass as string | undefined)}
              style={trackSpStyle as React.CSSProperties}
            >
              <Slider.Range
                {...rangeSpRest}
                className={cx('range', rangeSpClass as string | undefined)}
                style={rangeSpStyle as React.CSSProperties}
              />
            </Slider.Track>
            {values.map((_, i) => (
              <Slider.Thumb
                key={i}
                {...thumbSpRest}
                {...(i === 0 ? { ref: mergedThumbRef } : {})}
                className={cx('thumb', thumbSpClass as string | undefined)}
                style={thumbSpStyle as React.CSSProperties}
                onMouseEnter={() => { if (!isDisabled && i === 0) handlers.Thumb?.onMouseEnter?.(); }}
                onMouseLeave={() => { if (!isDisabled && i === 0) handlers.Thumb?.onMouseLeave?.(); }}
                onMouseDown={() => { if (!isDisabled && i === 0) handlers.Thumb?.onMouseDown?.(); }}
                onMouseUp={() => { if (!isDisabled && i === 0) handlers.Thumb?.onMouseUp?.(); }}
              />
            ))}
          </Slider.Root>
        );

        if (!showValue) return slider;

        return (
          <div
            className={[styles.wrapper, props.className].filter(Boolean).join(' ')}
            style={wrapperStyle}
            data-orientation={orientation}
          >
            {isRange && (
              <span {...valueSpRest} className={valueClassName} style={valueStyle}>
                {format(values[0])}
              </span>
            )}
            {slider}
            <span {...valueSpRest} className={valueClassName} style={valueStyle}>
              {format(values[values.length - 1])}
            </span>
          </div>
        );
      },
    };
  },
});
