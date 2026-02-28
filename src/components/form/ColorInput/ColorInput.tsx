'use client';

import * as React from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import { useResolvedIcon } from '../../core/Icon/useResolvedIcon';
import { usePopupAnimation } from '../../../animation/hooks';
import type { PopupAnimate } from '../../../animation/types';
import { ColorPicker } from '../ColorPicker/ColorPicker';
import type { ColorFormat, BaseColorFormat } from '../ColorPicker/colorUtils';
import { parseColor, formatColor, isValidColor } from '../ColorPicker/colorUtils';
import styles from './ColorInput.module.css';

// ============================================================================
// Types
// ============================================================================

export type ColorInputVariant = 'outlined' | 'filled';
export type ColorInputSize = 'sm' | 'md' | 'lg';
export type ColorInputSlots = 'root' | 'swatch' | 'input' | 'content' | 'contentInner';

export interface ColorInputProps extends Record<string, unknown> {
  variant?: ColorInputVariant;
  size?: ColorInputSize;
  format?: ColorFormat;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onChangeEnd?: (value: string) => void;
  onFormatChange?: (format: ColorFormat) => void;
  formatOptions?: BaseColorFormat[];
  swatches?: string[];
  swatchesPerRow?: number;
  withPicker?: boolean;
  withEyeDropper?: boolean;
  eyeDropperLabel?: string;
  closeOnColorSwatchClick?: boolean;
  invalid?: boolean;
  width?: React.CSSProperties['width'];
  swatchLabel?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  name?: string;
  id?: string;
  required?: boolean;
  autoFocus?: boolean;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<ColorInputSlots>;
}

// ============================================================================
// Icon size map
// ============================================================================

const ICON_SIZE_MAP: Record<string, number> = { sm: 14, md: 16, lg: 18 };

// Stable reference for popup animation config (avoids re-triggering effects)
const POPUP_ANIMATION: PopupAnimate = {};

// ============================================================================
// EyeDropper type
// ============================================================================

declare global {
  interface Window {
    EyeDropper?: new () => { open(): Promise<{ sRGBHex: string }> };
  }
}

// ============================================================================
// Component
// ============================================================================

export const ColorInput = withMoveComponent<ColorInputSlots, ColorInputProps, HTMLDivElement>({
  name: 'ColorInput',
  styles,
  slots: ['root', 'swatch', 'input', 'content', 'contentInner'] as const,
  defaults: {
    variant: 'outlined' as ColorInputVariant,
    size: 'md' as ColorInputSize,
    format: 'hex' as ColorFormat,
    swatchesPerRow: 7,
    withPicker: true,
    closeOnColorSwatchClick: true,
  },
  moveProps: [
    'variant', 'size', 'format', 'value', 'defaultValue', 'onValueChange', 'onChangeEnd',
    'onFormatChange', 'formatOptions',
    'swatches', 'swatchesPerRow', 'withPicker', 'withEyeDropper', 'eyeDropperLabel',
    'closeOnColorSwatchClick', 'invalid', 'width', 'readOnly', 'swatchLabel',
  ],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const [open, setOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [inputText, setInputText] = React.useState('');
    const [isInputFocused, setIsInputFocused] = React.useState(false);

    // Close with exit animation (same pattern as Dropdown)
    const close = React.useCallback(() => {
      setIsClosing(true);
    }, []);

    const handleCloseComplete = React.useCallback(() => {
      setIsClosing(false);
      setOpen(false);
    }, []);

    const handleOpenChange = React.useCallback((newOpen: boolean) => {
      if (newOpen) {
        setOpen(true);
      }
      // Ignore close from Radix — we coordinate via close()
    }, []);

    // Popup animation (same hook as Dropdown/Select)
    const { contentRef, innerRef } = usePopupAnimation({
      animate: (open || isClosing) ? POPUP_ANIMATION : null,
      isClosing,
      onCloseComplete: handleCloseComplete,
      animateHeight: true,
    });

    const format = props.format as ColorFormat;

    // Controlled/uncontrolled color value
    const isControlled = props.value !== undefined;
    const [internalValue, setInternalValue] = React.useState(() => {
      const v = (props.defaultValue as string) || '#000000';
      const parsed = parseColor(v);
      return parsed ? formatColor(parsed, format) : v;
    });

    const currentValue = isControlled ? (props.value as string) : internalValue;
    const onValueChange = props.onValueChange as ((v: string) => void) | undefined;
    const onChangeEnd = props.onChangeEnd as ((v: string) => void) | undefined;

    const handleValueChange = React.useCallback((value: string) => {
      if (!isControlled) setInternalValue(value);
      onValueChange?.(value);
    }, [isControlled, onValueChange]);

    const handleChangeEnd = React.useCallback((value: string) => {
      onChangeEnd?.(value);
    }, [onChangeEnd]);

    // Input field handlers
    const handleInputFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsInputFocused(true);
      setInputText(currentValue);
      (props.onFocus as React.FocusEventHandler<HTMLInputElement> | undefined)?.(e);
    }, [currentValue, props.onFocus]);

    const handleInputBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsInputFocused(false);
      if (isValidColor(inputText)) {
        const parsed = parseColor(inputText)!;
        const formatted = formatColor(parsed, format);
        handleValueChange(formatted);
        handleChangeEnd(formatted);
      }
      (props.onBlur as React.FocusEventHandler<HTMLInputElement> | undefined)?.(e);
    }, [inputText, format, handleValueChange, handleChangeEnd, props.onBlur]);

    const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setInputText(e.target.value);
    }, []);

    const handleInputKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        (e.target as HTMLInputElement).blur();
      } else if (e.key === 'ArrowDown' && !open) {
        e.preventDefault();
        setOpen(true);
      }
    }, [open]);

    // Swatch click toggles popover (close triggers exit animation)
    const handleSwatchClick = React.useCallback(() => {
      if (props.disabled || props.readOnly) return;
      if (open && !isClosing) {
        close();
      } else if (!open && !isClosing) {
        setOpen(true);
      }
    }, [props.disabled, props.readOnly, open, isClosing, close]);

    // Dismiss handlers — intercept to trigger exit animation
    const handlePointerDownOutside = React.useCallback((e: any) => {
      // If click was inside the root (swatch/input area), let handleSwatchClick deal with it
      const target = e.detail?.originalEvent?.target;
      if (target && internalRef.current?.contains(target as Node)) {
        e.preventDefault();
        return;
      }
      if (!e.defaultPrevented) close();
    }, [close, internalRef]);

    const handleEscapeKeyDown = React.useCallback((e: KeyboardEvent) => {
      if (!e.defaultPrevented) close();
    }, [close]);

    // Picker value change from popover
    const handlePickerChange = React.useCallback((value: string) => {
      handleValueChange(value);
    }, [handleValueChange]);

    const handlePickerChangeEnd = React.useCallback((value: string) => {
      handleChangeEnd(value);
    }, [handleChangeEnd]);

    // EyeDropper
    const handleEyeDropper = React.useCallback(async () => {
      if (typeof window === 'undefined' || !window.EyeDropper) return;
      try {
        const dropper = new window.EyeDropper();
        const result = await dropper.open();
        const parsed = parseColor(result.sRGBHex);
        if (parsed) {
          const formatted = formatColor(parsed, format);
          handleValueChange(formatted);
          handleChangeEnd(formatted);
        }
      } catch {
        // User cancelled
      }
    }, [format, handleValueChange, handleChangeEnd]);

    const size = (props.size as string) || 'md';
    const iconSize = ICON_SIZE_MAP[size] || 16;
    const pipetteIcon = useResolvedIcon('pipette', iconSize);

    return {
      render() {
        const rootSp = sp('root');
        const { className: rootSpClass, style: rootSpStyle, ...rootSpRest } = rootSp as Record<string, unknown>;
        const swatchSp = sp('swatch');
        const { className: swatchSpClass, style: swatchSpStyle, ...swatchSpRest } = swatchSp as Record<string, unknown>;
        const inputSpVal = sp('input');
        const { className: inputSpClass, style: inputSpStyle, ...inputSpRest } = inputSpVal as Record<string, unknown>;
        const contentSp = sp('content');
        const { className: contentSpClass, style: contentSpStyle, ...contentSpRest } = contentSp as Record<string, unknown>;
        const contentInnerSp = sp('contentInner');
        const { className: contentInnerSpClass, style: contentInnerSpStyle, ...contentInnerSpRest } = contentInnerSp as Record<string, unknown>;

        const variant = props.variant as string;
        const sizeVal = props.size as string;
        const invalid = props.invalid as boolean | undefined;
        const disabled = props.disabled as boolean | undefined;
        const readOnly = props.readOnly as boolean | undefined;
        const width = props.width as React.CSSProperties['width'] | undefined;
        const withEyeDropper = props.withEyeDropper as boolean | undefined;
        const eyeDropperLabel = (props.eyeDropperLabel as string) || 'Pick color from screen';
        const swatchLabel = (props.swatchLabel as string) || 'Open color picker';
        const showEyeDropper = withEyeDropper && typeof window !== 'undefined' && !!window.EyeDropper;

        return (
          <RadixPopover.Root open={open || isClosing} onOpenChange={handleOpenChange}>
            <RadixPopover.Anchor asChild>
              <div
                {...attrs}
                {...rootSpRest}
                ref={ref}
                className={cx('root', rootSpClass as string | undefined)}
                style={{
                  width,
                  ...(props.style as React.CSSProperties),
                  ...(rootSpStyle as React.CSSProperties),
                }}
                data-variant={variant}
                data-size={sizeVal}
                data-format={format}
                data-invalid={invalid || undefined}
                data-disabled={disabled || undefined}
                data-readonly={readOnly || undefined}
              >
                <div
                  {...swatchSpRest}
                  className={cx('swatch', swatchSpClass as string | undefined)}
                  style={{
                    backgroundColor: currentValue,
                    ...(swatchSpStyle as React.CSSProperties),
                  }}
                  onClick={handleSwatchClick}
                  role="button"
                  tabIndex={-1}
                  aria-label={swatchLabel}
                />

                <input
                  {...inputSpRest}
                  type="text"
                  className={cx('input', inputSpClass as string | undefined)}
                  style={inputSpStyle as React.CSSProperties}
                  value={isInputFocused ? inputText : currentValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onKeyDown={handleInputKeyDown}
                  disabled={disabled}
                  readOnly={readOnly}
                  placeholder={props.placeholder as string | undefined}
                  name={props.name as string | undefined}
                  id={props.id as string | undefined}
                  required={props.required as boolean | undefined}
                  autoFocus={props.autoFocus as boolean | undefined}
                />

                {showEyeDropper && (
                  <button
                    type="button"
                    className={styles.eyeDropper}
                    onClick={handleEyeDropper}
                    tabIndex={-1}
                    aria-label={eyeDropperLabel}
                    disabled={disabled}
                  >
                    {pipetteIcon}
                  </button>
                )}
              </div>
            </RadixPopover.Anchor>

            <RadixPopover.Portal>
              <RadixPopover.Content
                {...contentSpRest}
                ref={contentRef}
                sideOffset={4}
                align="start"
                className={cx('content', contentSpClass as string | undefined)}
                style={contentSpStyle as React.CSSProperties}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onPointerDownOutside={handlePointerDownOutside}
                onEscapeKeyDown={handleEscapeKeyDown as any}
                onInteractOutside={() => {}}
              >
                <div
                  ref={innerRef}
                  {...contentInnerSpRest}
                  className={cx('contentInner', contentInnerSpClass as string | undefined)}
                  style={contentInnerSpStyle as React.CSSProperties}
                >
                  <ColorPicker
                    value={currentValue}
                    onValueChange={handlePickerChange}
                    onChangeEnd={handlePickerChangeEnd}
                    format={format}
                    onFormatChange={props.onFormatChange as ((f: ColorFormat) => void) | undefined}
                    formatOptions={props.formatOptions as BaseColorFormat[] | undefined}
                    swatches={props.swatches as string[] | undefined}
                    swatchesPerRow={props.swatchesPerRow as number}
                    withPicker={props.withPicker as boolean}
                    size={sizeVal as 'sm' | 'md' | 'lg'}
                  />
                </div>
              </RadixPopover.Content>
            </RadixPopover.Portal>
          </RadixPopover.Root>
        );
      },
    };
  },
});
