'use client';
// Generated from NumberInput.spec.ts
import * as React from 'react';
import type { Dimension } from '../../../shared/types';
import { withMoveComponent } from '../../../engine';
import { useFieldControl } from '../FormField/FormField';
import type { SlotPropsMap } from '../../../engine/types';
import { useIcon } from '../../../infrastructure/Icon';
import { useNumberInput } from './useNumberInput';
import type { UseNumberInputOptions } from './useNumberInput';
import styles from './NumberInput.module.css';

// ============================================================================
// Types
// ============================================================================

export type NumberInputVariant = 'outlined' | 'filled';
export type NumberInputSize = 'sm' | 'md' | 'lg';
export type NumberInputSlots =
  'root' | 'input' | 'iconLeft' | 'controls' | 'increment' | 'decrement';

export interface NumberInputLabels {
  /** Aria label for the increment button */
  increment: string;
  /** Aria label for the decrement button */
  decrement: string;
}

const DEFAULT_LABELS: NumberInputLabels = {
  increment: 'Increment',
  decrement: 'Decrement',
};

export interface NumberInputProps extends React.HTMLAttributes<HTMLElement> {
  variant?: NumberInputVariant;
  size?: NumberInputSize;
  value?: number | string;
  defaultValue?: number | string;
  onValueChange?: (value: number | undefined, displayValue: string) => void;
  min?: number;
  max?: number;
  step?: number;
  shiftStep?: number;
  clampBehavior?: 'blur' | 'strict' | 'none';
  allowDecimal?: boolean;
  decimalScale?: number;
  allowNegative?: boolean;
  hideControls?: boolean;
  invalid?: boolean;
  width?: Dimension;
  iconLeft?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  labels?: Partial<NumberInputLabels>;
  formatValue?: (v: number) => string;
  parseValue?: (s: string) => number | undefined;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  name?: string;
  id?: string;
  required?: boolean;
  autoFocus?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<NumberInputSlots>;
}

// ============================================================================
// Icon size map
// ============================================================================

const ICON_SIZE_MAP: Record<string, number> = { sm: 12, md: 14, lg: 16 };

// ============================================================================
// Component
// ============================================================================

export const NumberInput = withMoveComponent<NumberInputSlots, NumberInputProps, HTMLDivElement>({
  name: 'NumberInput',
  styles,
  slots: ['root', 'input', 'iconLeft', 'controls', 'increment', 'decrement'] as const,
  defaults: {
    variant: 'outlined' as NumberInputVariant,
    size: 'md' as NumberInputSize,
    step: 1,
    clampBehavior: 'blur' as const,
    allowDecimal: true,
    allowNegative: true,
    hideControls: false,
  },
  moveProps: [
    'variant',
    'size',
    'value',
    'defaultValue',
    'onValueChange',
    'min',
    'max',
    'step',
    'shiftStep',
    'clampBehavior',
    'allowDecimal',
    'decimalScale',
    'allowNegative',
    'hideControls',
    'invalid',
    'width',
    'iconLeft',
    'prefix',
    'suffix',
    'labels',
    'formatValue',
    'parseValue',
  ],

  setup({ props, ref, cx, sp, attrs }) {
    const labels = { ...DEFAULT_LABELS, ...(props.labels as Partial<NumberInputLabels>) };
    const inputRef = React.useRef<HTMLInputElement>(null);
    const controlProps = useFieldControl(attrs as Record<string, unknown>, {
      invalid: !!props.invalid,
      ref: inputRef,
    });

    const holdTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const holdIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

    const hookOptions: UseNumberInputOptions = {
      value: props.value as number | string | undefined,
      defaultValue: props.defaultValue as number | string | undefined,
      onValueChange: props.onValueChange as
        ((v: number | undefined, d: string) => void) | undefined,
      min: props.min as number | undefined,
      max: props.max as number | undefined,
      step: props.step as number,
      shiftStep: props.shiftStep as number | undefined,
      clampBehavior: props.clampBehavior as 'blur' | 'strict' | 'none',
      allowDecimal: props.allowDecimal as boolean,
      decimalScale: props.decimalScale as number | undefined,
      allowNegative: props.allowNegative as boolean,
      disabled: props.disabled as boolean | undefined,
      readOnly: props.readOnly as boolean | undefined,
      prefix: props.prefix as string | undefined,
      suffix: props.suffix as string | undefined,
      formatValue: props.formatValue as ((v: number) => string) | undefined,
      parseValue: props.parseValue as ((s: string) => number | undefined) | undefined,
    };

    const ni = useNumberInput(hookOptions);
    // Live ref so the press-and-hold interval calls the LATEST increment/
    // decrement (which reads the current value), not the one captured at
    // pointer-down — otherwise holding re-applies the same step forever.
    const niRef = React.useRef(ni);
    niRef.current = ni;

    const size = (props.size as string) || 'md';
    const iconSize = ICON_SIZE_MAP[size] || 14;
    const chevronUpIcon = useIcon('increment', iconSize);
    const chevronDownIcon = useIcon('decrement', iconSize);

    const startHold = React.useCallback((action: () => void) => {
      action();
      holdTimerRef.current = setTimeout(() => {
        holdIntervalRef.current = setInterval(action, 50);
      }, 300);
    }, []);

    const stopHold = React.useCallback(() => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
      }
    }, []);

    React.useEffect(() => stopHold, [stopHold]);

    const handleRootClick = React.useCallback(() => {
      inputRef.current?.focus();
    }, []);

    return {
      render() {
        const rootSp = sp('root');
        const {
          className: rootSpClass,
          style: rootSpStyle,
          ...rootSpRest
        } = rootSp as Record<string, unknown>;
        const inputSp = sp('input');
        const {
          className: inputSpClass,
          style: inputSpStyle,
          ...inputSpRest
        } = inputSp as Record<string, unknown>;
        const iconLeftSp = sp('iconLeft');
        const {
          className: ilSpClass,
          style: ilSpStyle,
          ...ilSpRest
        } = iconLeftSp as Record<string, unknown>;
        const controlsSp = sp('controls');
        const {
          className: ctrlSpClass,
          style: ctrlSpStyle,
          ...ctrlSpRest
        } = controlsSp as Record<string, unknown>;
        const incrementSp = sp('increment');
        const {
          className: incSpClass,
          style: incSpStyle,
          ...incSpRest
        } = incrementSp as Record<string, unknown>;
        const decrementSp = sp('decrement');
        const {
          className: decSpClass,
          style: decSpStyle,
          ...decSpRest
        } = decrementSp as Record<string, unknown>;

        const variant = props.variant as string;
        const sizeVal = props.size as string;
        const invalid = props.invalid as boolean | undefined;
        const disabled = props.disabled as boolean | undefined;
        const readOnly = props.readOnly as boolean | undefined;
        const hideControls = props.hideControls as boolean;
        const width = props.width as React.CSSProperties['width'] | undefined;
        const iconLeft = props.iconLeft as React.ReactNode | undefined;

        return (
          <div
            {...rootSpRest}
            ref={ref}
            className={cx('root', props.className, rootSpClass as string | undefined)}
            style={{
              ...(width != null ? { width } : {}),
              ...props.style,
              ...(rootSpStyle as React.CSSProperties),
            }}
            data-variant={variant}
            data-size={sizeVal}
            {...(invalid ? { 'data-invalid': '' } : {})}
            {...(disabled ? { 'data-disabled': '' } : {})}
            {...(readOnly ? { 'data-readonly': '' } : {})}
            onClick={handleRootClick}
          >
            {iconLeft && (
              <span
                {...ilSpRest}
                className={cx('iconLeft', ilSpClass as string | undefined)}
                style={ilSpStyle as React.CSSProperties}
                aria-hidden="true"
              >
                {iconLeft}
              </span>
            )}

            {/* `controlProps` already carries the id — `props.id` when the consumer
                set one, otherwise the id a wrapping FormField.Label points its
                `for` at. Restating `id={props.id}` below the spread overwrote it
                with undefined whenever no explicit id was passed, which left the
                label dangling and the field with no accessible name. */}
            <input
              {...controlProps}
              {...inputSpRest}
              ref={inputRef}
              className={cx('input', inputSpClass as string | undefined)}
              style={inputSpStyle as React.CSSProperties}
              type="text"
              inputMode="decimal"
              role="spinbutton"
              aria-valuemin={props.min as number | undefined}
              aria-valuemax={props.max as number | undefined}
              aria-valuenow={ni.numericValue}
              value={ni.displayValue}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={props.placeholder as string | undefined}
              name={props.name as string | undefined}
              required={props.required as boolean | undefined}
              autoFocus={props.autoFocus as boolean | undefined}
              onChange={ni.handleChange}
              onKeyDown={(e) => {
                ni.handleKeyDown(e);
                (props.onKeyDown as React.KeyboardEventHandler<HTMLInputElement> | undefined)?.(e);
              }}
              onBlur={(e) => {
                ni.handleBlur(e);
                (props.onBlur as React.FocusEventHandler<HTMLInputElement> | undefined)?.(e);
              }}
              onFocus={props.onFocus as React.FocusEventHandler<HTMLInputElement> | undefined}
            />

            {!hideControls && (
              <div
                {...ctrlSpRest}
                className={cx('controls', ctrlSpClass as string | undefined)}
                style={ctrlSpStyle as React.CSSProperties}
              >
                <button
                  {...incSpRest}
                  type="button"
                  className={cx('increment', incSpClass as string | undefined)}
                  style={incSpStyle as React.CSSProperties}
                  tabIndex={-1}
                  disabled={disabled}
                  aria-label={labels.increment}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    startHold(() => niRef.current.increment(e.shiftKey));
                  }}
                  onPointerUp={stopHold}
                  onPointerLeave={stopHold}
                >
                  {chevronUpIcon}
                </button>
                <button
                  {...decSpRest}
                  type="button"
                  className={cx('decrement', decSpClass as string | undefined)}
                  style={decSpStyle as React.CSSProperties}
                  tabIndex={-1}
                  disabled={disabled}
                  aria-label={labels.decrement}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    startHold(() => niRef.current.decrement(e.shiftKey));
                  }}
                  onPointerUp={stopHold}
                  onPointerLeave={stopHold}
                >
                  {chevronDownIcon}
                </button>
              </div>
            )}
          </div>
        );
      },
    };
  },
});
