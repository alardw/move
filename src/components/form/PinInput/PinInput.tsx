'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import { usePinInput } from './usePinInput';
import styles from './PinInput.module.css';

export type PinInputSize = 'sm' | 'md' | 'lg';

type PinInputSlots = 'root' | 'slot';

export interface PinInputProps extends Record<string, unknown> {
  /** Number of input slots */
  length?: number;
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled mode */
  defaultValue?: string;
  /** Called when the value changes */
  onChange?: (value: string) => void;
  /** Called when all slots are filled */
  onComplete?: (value: string) => void;
  /** Character validation: 'number', 'alphanumeric', or a RegExp */
  type?: 'number' | 'alphanumeric' | RegExp;
  /** Mask input like a password field */
  mask?: boolean;
  /** Placeholder character per slot */
  placeholder?: string;
  /** Enable autocomplete="one-time-code" for SMS autofill */
  oneTimeCode?: boolean;
  /** Grouping pattern, e.g. [3,3] splits 6 into two visual groups */
  grouping?: number[];
  /** Invalid state */
  invalid?: boolean;
  /** Size variant */
  size?: PinInputSize;
  /** Accessible label for the hidden input */
  ariaLabel?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Hidden input name for form submission */
  name?: string;
  /** Auto focus the input on mount */
  autoFocus?: boolean;
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<PinInputSlots>;
}

export const PinInput = withMoveComponent<PinInputSlots, PinInputProps, HTMLDivElement>({
  name: 'PinInput',
  styles,
  slots: ['root', 'slot'] as const,
  defaults: { length: 4, size: 'md', type: 'number', oneTimeCode: true },
  moveProps: [
    'length', 'value', 'defaultValue', 'onChange', 'onComplete',
    'type', 'mask', 'placeholder', 'oneTimeCode', 'grouping',
    'invalid', 'size', 'ariaLabel',
  ],

  setup({ props, ref, cx, sp, attrs }) {
    const pin = usePinInput({
      value: props.value as string | undefined,
      defaultValue: props.defaultValue as string | undefined,
      onChange: props.onChange as ((value: string) => void) | undefined,
      onComplete: props.onComplete as ((value: string) => void) | undefined,
      length: props.length as number,
      type: props.type as 'number' | 'alphanumeric' | RegExp,
      mask: props.mask as boolean | undefined,
      placeholder: props.placeholder as string | undefined,
      oneTimeCode: props.oneTimeCode as boolean | undefined,
      disabled: props.disabled as boolean | undefined,
      grouping: props.grouping as number[] | undefined,
    });

    // Auto-focus on mount
    React.useEffect(() => {
      if (props.autoFocus) {
        pin.focus();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRootClick = () => {
      if (!props.disabled) {
        pin.focus();
      }
    };

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const slotSp = sp('slot');
        const { className: slotSpClass, style: slotSpStyle, ...slotSpRest } = slotSp as Record<string, unknown>;

        // Build slot elements grouped by the grouping pattern
        let slotIndex = 0;
        const groupElements: React.ReactNode[] = [];

        for (let g = 0; g < pin.groups.length; g++) {
          const groupSize = pin.groups[g];
          const slots: React.ReactNode[] = [];

          for (let i = 0; i < groupSize; i++) {
            const idx = slotIndex;
            const char = pin.getSlotChar(idx);
            const filled = pin.isSlotFilled(idx);
            const active = pin.isSlotActive(idx);
            const showPlaceholder = !filled && !active && char !== '';

            slots.push(
              <div
                key={idx}
                {...slotSpRest}
                className={cx('slot', slotSpClass as string | undefined)}
                style={slotSpStyle as React.CSSProperties}
                {...(active ? { 'data-active': '' } : {})}
                {...(showPlaceholder ? { 'data-placeholder': '' } : {})}
              >
                {active && !filled ? (
                  <div className={styles.caret} />
                ) : (
                  char
                )}
              </div>
            );
            slotIndex++;
          }

          groupElements.push(
            <div key={`group-${g}`} className={styles.group}>
              {slots}
            </div>
          );

          // Add separator between groups (not after last)
          if (g < pin.groups.length - 1) {
            groupElements.push(
              <div key={`sep-${g}`} className={styles.separator} aria-hidden="true">
                {'\u2013'}
              </div>
            );
          }
        }

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-size={props.size}
            {...(props.invalid ? { 'data-invalid': '' } : {})}
            {...(props.disabled ? { 'data-disabled': '' } : {})}
            onClick={handleRootClick}
          >
            <input
              ref={pin.inputRef as React.Ref<HTMLInputElement>}
              className={styles.hiddenInput}
              {...pin.inputProps}
              aria-label={props.ariaLabel as string || 'PIN input'}
              tabIndex={0}
              style={{ pointerEvents: 'auto' }}
            />
            {groupElements}
          </div>
        );
      },
    };
  },
});
