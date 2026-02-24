'use client';

import * as React from 'react';
import { Slider } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine/useMergedRef';
import { useInteractiveAnimate } from '../../../animation';
import type { PassThrough } from '../../../engine/types';
import type { ElementAnimate } from '../../../animation';
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
  animate?: ElementAnimate | false;
  className?: string;
  style?: React.CSSProperties;
  pt?: PassThrough<InputRangeSlots>;
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
    'size', 'invalid', 'orientation', 'width', 'showValue', 'formatValue', 'animate',
  ],
  defaults: {
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    orientation: 'horizontal',
  },

  setup({ props, ref, cx, ptm, attrs }) {
    const { values, setValues } = useInputRange({
      value: props.value as InputRangeValue | undefined,
      defaultValue: props.defaultValue as InputRangeValue | undefined,
      onValueChange: props.onValueChange as ((value: number[]) => void) | undefined,
    });

    const { ref: animRef, handlers } = useInteractiveAnimate({
      animate: props.animate === false ? undefined : (props.animate as ElementAnimate | undefined),
      disabled: props.animate === false || props.disabled as boolean,
    });

    const mergedThumbRef = useMergedRef<HTMLSpanElement>(animRef as React.Ref<HTMLSpanElement>);

    return {
      render() {
        const rootPt = ptm('root');
        const { className: rootPtClass, style: rootPtStyle, ...rootPtRest } = rootPt as Record<string, unknown>;

        const trackPt = ptm('track');
        const { className: trackPtClass, style: trackPtStyle, ...trackPtRest } = trackPt as Record<string, unknown>;

        const rangePt = ptm('range');
        const { className: rangePtClass, style: rangePtStyle, ...rangePtRest } = rangePt as Record<string, unknown>;

        const thumbPt = ptm('thumb');
        const { className: thumbPtClass, style: thumbPtStyle, ...thumbPtRest } = thumbPt as Record<string, unknown>;

        const valuePt = ptm('value');
        const { className: valuePtClass, style: valuePtStyle, ...valuePtRest } = valuePt as Record<string, unknown>;

        const showValue = props.showValue as boolean | undefined;
        const format = (props.formatValue as ((v: number) => string) | undefined) ?? defaultFormatValue;
        const isRange = values.length > 1;
        const orientation = props.orientation as string;

        const rootStyle: React.CSSProperties = {
          ...(showValue ? {} : props.style),
          ...(showValue ? {} : props.width ? { width: props.width as React.CSSProperties['width'] } : {}),
          ...(rootPtStyle as React.CSSProperties),
        };

        const wrapperStyle: React.CSSProperties | undefined = showValue
          ? {
              ...props.style,
              ...(props.width ? { width: props.width as React.CSSProperties['width'] } : {}),
            }
          : undefined;

        const valueClassName = cx('value', valuePtClass as string | undefined);
        const valueStyle = valuePtStyle as React.CSSProperties | undefined;

        const slider = (
          <Slider.Root
            {...attrs}
            {...rootPtRest}
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
            className={cx('root', showValue ? undefined : props.className, rootPtClass as string | undefined)}
            style={rootStyle}
          >
            <Slider.Track
              {...trackPtRest}
              className={cx('track', trackPtClass as string | undefined)}
              style={trackPtStyle as React.CSSProperties}
            >
              <Slider.Range
                {...rangePtRest}
                className={cx('range', rangePtClass as string | undefined)}
                style={rangePtStyle as React.CSSProperties}
              />
            </Slider.Track>
            {values.map((_, i) => (
              <Slider.Thumb
                key={i}
                {...thumbPtRest}
                {...(i === 0 ? { ref: mergedThumbRef } : {})}
                className={cx('thumb', thumbPtClass as string | undefined)}
                style={thumbPtStyle as React.CSSProperties}
                {...handlers}
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
              <span {...valuePtRest} className={valueClassName} style={valueStyle}>
                {format(values[0])}
              </span>
            )}
            {slider}
            <span {...valuePtRest} className={valueClassName} style={valueStyle}>
              {format(values[values.length - 1])}
            </span>
          </div>
        );
      },
    };
  },
});
