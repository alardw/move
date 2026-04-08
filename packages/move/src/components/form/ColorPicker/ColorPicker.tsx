'use client';
// Generated from ColorPicker.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useColorPicker } from './useColorPicker';
import type { UseColorPickerOptions } from './useColorPicker';
import type { ColorFormat, BaseColorFormat } from './colorUtils';
import { hsvToRgb, rgbToHex, parseColor, getBaseFormat, formatWithAlpha } from './colorUtils';
import { Select } from '../Select/Select';
import styles from './ColorPicker.module.css';

// ============================================================================
// Types
// ============================================================================

export type ColorPickerSize = 'sm' | 'md' | 'lg';
export type ColorPickerSlots =
  'root' | 'saturation' | 'hue' | 'alpha' | 'swatches' |
  'inputRow' | 'formatSelect' | 'channelInput' | 'alphaInput';

export interface ColorPickerProps extends Record<string, unknown> {
  size?: ColorPickerSize;
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
  fullWidth?: boolean;
  saturationLabel?: string;
  hueLabel?: string;
  alphaLabel?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<ColorPickerSlots>;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_FORMAT_OPTIONS: BaseColorFormat[] = ['hex', 'rgb', 'hsl'];

const CHANNEL_ARIA_LABELS: Record<string, string> = {
  R: 'Red', G: 'Green', B: 'Blue',
  H: 'Hue', S: 'Saturation', L: 'Lightness',
};

// ============================================================================
// Drag helper
// ============================================================================

function useDrag(
  onMove: (x: number, y: number) => void,
  onEnd?: () => void,
) {
  const onMoveRef = React.useRef(onMove);
  onMoveRef.current = onMove;
  const onEndRef = React.useRef(onEnd);
  onEndRef.current = onEnd;

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();

    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);

    const rect = el.getBoundingClientRect();
    const clampedX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const clampedY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    onMoveRef.current(clampedX, clampedY);

    const handlePointerMove = (ev: PointerEvent) => {
      const x = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (ev.clientY - rect.top) / rect.height));
      onMoveRef.current(x, y);
    };

    const handlePointerUp = () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerup', handlePointerUp);
      onEndRef.current?.();
    };

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerup', handlePointerUp);
  }, []);

  return handlePointerDown;
}

// ============================================================================
// Component
// ============================================================================

export const ColorPicker = withMoveComponent<ColorPickerSlots, ColorPickerProps, HTMLDivElement>({
  name: 'ColorPicker',
  styles,
  slots: [
    'root', 'saturation', 'hue', 'alpha', 'swatches',
    'inputRow', 'formatSelect', 'channelInput', 'alphaInput',
  ] as const,
  defaults: {
    format: 'hex' as ColorFormat,
    size: 'md' as ColorPickerSize,
    withPicker: true,
    swatchesPerRow: 7,
  },
  moveProps: [
    'format', 'value', 'defaultValue', 'onValueChange', 'onChangeEnd',
    'onFormatChange', 'formatOptions',
    'swatches', 'swatchesPerRow', 'withPicker', 'fullWidth',
    'saturationLabel', 'hueLabel', 'alphaLabel', 'readOnly',
  ],

  setup({ props, ref, cx, sp, attrs }) {
    const hookOptions: UseColorPickerOptions = {
      value: props.value as string | undefined,
      defaultValue: props.defaultValue as string | undefined,
      onValueChange: props.onValueChange as ((v: string) => void) | undefined,
      onChangeEnd: props.onChangeEnd as ((v: string) => void) | undefined,
      onFormatChange: props.onFormatChange as ((f: ColorFormat) => void) | undefined,
      format: props.format as ColorFormat,
    };

    const cp = useColorPicker(hookOptions);

    // Saturation area drag
    const saturationDrag = useDrag(
      React.useCallback((x: number, y: number) => {
        cp.setSaturationValue(x * 100, (1 - y) * 100);
      }, [cp]),
      cp.commitChange,
    );

    // Hue slider drag — clamp to 359 to prevent wrapping (360° === 0°)
    const hueDrag = useDrag(
      React.useCallback((x: number) => {
        cp.setHue(Math.min(x * 360, 359));
      }, [cp]),
      cp.commitChange,
    );

    // Alpha slider drag
    const alphaDrag = useDrag(
      React.useCallback((x: number) => {
        cp.setAlpha(x);
      }, [cp]),
      cp.commitChange,
    );

    // Format change handler
    const handleFormatChange = React.useCallback((value: string) => {
      const base = value as BaseColorFormat;
      const newFormat = formatWithAlpha(base, cp.showAlpha);
      cp.setActiveFormat(newFormat);
    }, [cp]);

    // Hex input state
    const [hexText, setHexText] = React.useState('');
    const [isHexFocused, setIsHexFocused] = React.useState(false);

    const handleHexFocus = React.useCallback(() => {
      setIsHexFocused(true);
      setHexText(cp.hexString);
    }, [cp.hexString]);

    const handleHexBlur = React.useCallback(() => {
      setIsHexFocused(false);
      const parsed = parseColor('#' + hexText);
      if (parsed) {
        cp.setFromString('#' + hexText);
        cp.commitChange();
      }
    }, [hexText, cp]);

    const handleHexChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setHexText(e.target.value);
    }, []);

    // Channel input state (for intermediate editing of RGB/HSL fields)
    const [focusedChannel, setFocusedChannel] = React.useState<number | null>(null);
    const [channelTexts, setChannelTexts] = React.useState<string[]>([]);

    const handleChannelFocus = React.useCallback((index: number) => {
      setFocusedChannel(index);
      setChannelTexts(cp.channels.map(ch => String(ch.value)));
    }, [cp.channels]);

    const handleChannelBlur = React.useCallback((index: number) => {
      setFocusedChannel(null);
      const num = parseInt(channelTexts[index], 10);
      if (!isNaN(num)) {
        cp.setChannel(index, num);
        cp.commitChange();
      }
    }, [channelTexts, cp]);

    const handleChannelChange = React.useCallback((index: number, text: string) => {
      setChannelTexts(prev => {
        const next = [...prev];
        next[index] = text;
        return next;
      });
      const num = parseInt(text, 10);
      if (!isNaN(num)) {
        cp.setChannel(index, num);
      }
    }, [cp]);

    // Alpha text input state
    const [alphaText, setAlphaText] = React.useState('');
    const [isAlphaFocused, setIsAlphaFocused] = React.useState(false);

    const handleAlphaFocus = React.useCallback(() => {
      setIsAlphaFocused(true);
      setAlphaText(String(Math.round(cp.hsv.a * 100)));
    }, [cp.hsv.a]);

    const handleAlphaBlur = React.useCallback(() => {
      setIsAlphaFocused(false);
      const num = parseInt(alphaText, 10);
      if (!isNaN(num)) {
        cp.setAlpha(Math.max(0, Math.min(100, num)) / 100);
        cp.commitChange();
      }
    }, [alphaText, cp]);

    const handleAlphaChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setAlphaText(e.target.value);
      const num = parseInt(e.target.value, 10);
      if (!isNaN(num)) {
        cp.setAlpha(Math.max(0, Math.min(100, num)) / 100);
      }
    }, [cp]);

    // Shared key handler for all inputs (Enter to blur, Arrow up/down to nudge)
    const handleInputKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        (e.target as HTMLInputElement).blur();
        return;
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const delta = e.key === 'ArrowUp' ? step : -step;
        const input = e.target as HTMLInputElement;
        const current = parseInt(input.value, 10);
        if (!isNaN(current)) {
          const newVal = current + delta;
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value',
          )?.set;
          nativeInputValueSetter?.call(input, String(newVal));
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }, []);

    return {
      render() {
        const rootSp = sp('root');
        const { className: rootSpClass, style: rootSpStyle, ...rootSpRest } = rootSp as Record<string, unknown>;
        const satSp = sp('saturation');
        const { className: satSpClass, style: satSpStyle, ...satSpRest } = satSp as Record<string, unknown>;
        const hueSp = sp('hue');
        const { className: hueSpClass, style: hueSpStyle, ...hueSpRest } = hueSp as Record<string, unknown>;
        const alphaSp = sp('alpha');
        const { className: alphaSpClass, style: alphaSpStyle, ...alphaSpRest } = alphaSp as Record<string, unknown>;
        const swatchesSp = sp('swatches');
        const { className: swatchesSpClass, style: swatchesSpStyle, ...swatchesSpRest } = swatchesSp as Record<string, unknown>;
        const inputRowSp = sp('inputRow');
        const { className: inputRowSpClass, style: inputRowSpStyle, ...inputRowSpRest } = inputRowSp as Record<string, unknown>;
        const formatSelectSp = sp('formatSelect');
        const { className: formatSelectSpClass, style: formatSelectSpStyle, ...formatSelectSpRest } = formatSelectSp as Record<string, unknown>;

        const size = props.size as string;
        const disabled = props.disabled as boolean | undefined;
        const readOnly = props.readOnly as boolean | undefined;
        const withPicker = props.withPicker as boolean;
        const fullWidth = props.fullWidth as boolean | undefined;
        const swatches = props.swatches as string[] | undefined;
        const swatchesPerRow = props.swatchesPerRow as number;
        const saturationLabel = (props.saturationLabel as string) || 'Color saturation and brightness';
        const hueLabel = (props.hueLabel as string) || 'Hue';
        const alphaLabel = (props.alphaLabel as string) || 'Opacity';
        const formatOptions = (props.formatOptions as BaseColorFormat[] | undefined) || DEFAULT_FORMAT_OPTIONS;

        // Compute display values
        const pureHueRgb = hsvToRgb(cp.hsv.h, 100, 100);
        const pureHueHex = rgbToHex(pureHueRgb.r, pureHueRgb.g, pureHueRgb.b);
        const currentRgb = hsvToRgb(cp.hsv.h, cp.hsv.s, cp.hsv.v);
        const currentHex = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);
        const isHexFormat = getBaseFormat(cp.activeFormat) === 'hex';

        return (
          <div
            {...attrs}
            {...rootSpRest}
            ref={ref}
            className={cx('root', props.className as string | undefined, rootSpClass as string | undefined)}
            style={{
              ...(props.style as React.CSSProperties),
              ...(rootSpStyle as React.CSSProperties),
            }}
            data-size={size}
            data-format={cp.activeFormat}
            data-disabled={disabled || undefined}
            data-readonly={readOnly || undefined}
            data-fullwidth={fullWidth || undefined}
          >
            {withPicker && (
              <>
                {/* Saturation/Brightness area */}
                <div
                  {...satSpRest}
                  role="slider"
                  tabIndex={0}
                  aria-label={saturationLabel}
                  aria-valuetext={`Saturation ${Math.round(cp.hsv.s)}%, Brightness ${Math.round(cp.hsv.v)}%`}
                  className={cx('saturation', satSpClass as string | undefined)}
                  style={{
                    backgroundColor: pureHueHex,
                    ...(satSpStyle as React.CSSProperties),
                  }}
                  onPointerDown={saturationDrag}
                >
                  <div
                    className={styles.saturationCursor}
                    style={{
                      left: `${cp.hsv.s}%`,
                      top: `${100 - cp.hsv.v}%`,
                      backgroundColor: currentHex,
                    }}
                  />
                </div>

                {/* Hue slider */}
                <div
                  {...hueSpRest}
                  role="slider"
                  tabIndex={0}
                  aria-label={hueLabel}
                  aria-valuemin={0}
                  aria-valuemax={360}
                  aria-valuenow={Math.round(cp.hsv.h)}
                  className={cx('hue', hueSpClass as string | undefined)}
                  style={hueSpStyle as React.CSSProperties}
                  onPointerDown={hueDrag}
                >
                  <div
                    className={styles.sliderThumb}
                    style={{ left: `${(cp.hsv.h / 360) * 100}%` }}
                  />
                </div>

                {/* Alpha slider */}
                {cp.showAlpha && (
                  <div
                    {...alphaSpRest}
                    role="slider"
                    tabIndex={0}
                    aria-label={alphaLabel}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(cp.hsv.a * 100)}
                    className={cx('alpha', alphaSpClass as string | undefined)}
                    style={alphaSpStyle as React.CSSProperties}
                    onPointerDown={alphaDrag}
                  >
                    <div
                      className={styles.alphaGradient}
                      style={{
                        background: `linear-gradient(to right, transparent, ${currentHex})`,
                      }}
                    />
                    <div
                      className={styles.sliderThumb}
                      style={{ left: `${cp.hsv.a * 100}%` }}
                    />
                  </div>
                )}
              </>
            )}

            {/* Swatches */}
            {swatches && swatches.length > 0 && (
              <div
                {...swatchesSpRest}
                className={cx('swatches', swatchesSpClass as string | undefined)}
                style={{
                  gridTemplateColumns: `repeat(${swatchesPerRow}, 1fr)`,
                  ...(swatchesSpStyle as React.CSSProperties),
                }}
              >
                {swatches.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={styles.swatch}
                    style={{ backgroundColor: color }}
                    aria-label={color}
                    onClick={() => {
                      cp.setFromString(color);
                      cp.commitChange();
                    }}
                  />
                ))}
              </div>
            )}

            {/* Input row: format selector + channel inputs */}
            <div
              {...inputRowSpRest}
              className={cx('inputRow', inputRowSpClass as string | undefined)}
              style={inputRowSpStyle as React.CSSProperties}
            >
              {/* Format selector */}
              <Select.Root
                value={getBaseFormat(cp.activeFormat)}
                onValueChange={handleFormatChange}
              >
                <Select.Trigger
                  {...formatSelectSpRest}
                  size="sm"
                  className={cx('formatSelect', formatSelectSpClass as string | undefined)}
                  style={formatSelectSpStyle as React.CSSProperties}
                  disabled={disabled}
                  aria-label="Color format"
                >
                  <Select.Value />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Content>
                  <Select.Viewport>
                    {formatOptions.map(f => (
                      <Select.Item key={f} value={f}>
                        {f.toUpperCase()}
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>

              {/* Channel inputs */}
              {isHexFormat ? (
                <input
                  type="text"
                  className={cx('channelInput')}
                  data-channel="hex"
                  value={isHexFocused ? hexText : cp.hexString}
                  onChange={handleHexChange}
                  onFocus={handleHexFocus}
                  onBlur={handleHexBlur}
                  onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                  disabled={disabled}
                  readOnly={readOnly}
                  aria-label="Hex color value"
                />
              ) : (
                cp.channels.map((ch, i) => (
                  <input
                    key={ch.label}
                    type="text"
                    inputMode="numeric"
                    className={cx('channelInput')}
                    data-channel={ch.label.toLowerCase()}
                    value={focusedChannel === i ? channelTexts[i] : String(ch.value)}
                    onChange={(e) => handleChannelChange(i, e.target.value)}
                    onFocus={() => handleChannelFocus(i)}
                    onBlur={() => handleChannelBlur(i)}
                    onKeyDown={handleInputKeyDown}
                    disabled={disabled}
                    readOnly={readOnly}
                    aria-label={CHANNEL_ARIA_LABELS[ch.label] || ch.label}
                  />
                ))
              )}

              {/* Alpha input */}
              {cp.showAlpha && (
                <>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={cx('alphaInput')}
                    value={isAlphaFocused ? alphaText : String(Math.round(cp.hsv.a * 100))}
                    onChange={handleAlphaChange}
                    onFocus={handleAlphaFocus}
                    onBlur={handleAlphaBlur}
                    onKeyDown={handleInputKeyDown}
                    disabled={disabled}
                    readOnly={readOnly}
                    aria-label="Alpha"
                  />
                  <span className={styles.channelSuffix}>%</span>
                </>
              )}
            </div>
          </div>
        );
      },
    };
  },
});
