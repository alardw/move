'use client';
// Generated from ColorPicker.spec.ts

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
  | 'root'
  | 'saturation'
  | 'hue'
  | 'alpha'
  | 'swatches'
  | 'inputRow'
  | 'formatSelect'
  | 'channelInput'
  | 'alphaInput';

export interface ColorPickerLabels {
  /** Saturation area accessible label */
  saturation: string;
  /** Hue slider accessible label */
  hue: string;
  /** Alpha slider accessible label */
  alpha: string;
  /** Format selector accessible label */
  format: string;
  /** Hex input accessible label */
  hex: string;
  /** Alpha input accessible label */
  alphaInput: string;
  /** Red channel input accessible label */
  red: string;
  /** Green channel input accessible label */
  green: string;
  /** Blue channel input accessible label */
  blue: string;
  /** Hue channel input accessible label */
  hueChannel: string;
  /** Saturation channel input accessible label */
  saturationChannel: string;
  /** Lightness channel input accessible label */
  lightness: string;
}

const DEFAULT_LABELS: ColorPickerLabels = {
  saturation: 'Color saturation and brightness',
  hue: 'Hue',
  alpha: 'Opacity',
  format: 'Color format',
  hex: 'Hex color value',
  alphaInput: 'Alpha',
  red: 'Red',
  green: 'Green',
  blue: 'Blue',
  hueChannel: 'Hue',
  saturationChannel: 'Saturation',
  lightness: 'Lightness',
};

export interface ColorPickerProps extends React.HTMLAttributes<HTMLElement> {
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
  labels?: Partial<ColorPickerLabels>;
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

const CHANNEL_LABEL_KEYS: Record<string, keyof ColorPickerLabels> = {
  R: 'red',
  G: 'green',
  B: 'blue',
  H: 'hueChannel',
  S: 'saturationChannel',
  L: 'lightness',
};

// ============================================================================
// Drag helper
// ============================================================================

/**
 * onStart runs on pointer-down BEFORE the first move; it may return a revert
 * function used to abort. Pressing Escape mid-drag calls it (restoring the
 * pre-drag value) and ends the drag without committing — WCAG 2.5.2 Pointer
 * Cancellation (completion is on pointer-up; Escape is the abort mechanism).
 */
function useDrag(
  onMove: (x: number, y: number) => void,
  onEnd?: () => void,
  onStart?: () => (() => void) | void,
) {
  const onMoveRef = React.useRef(onMove);
  onMoveRef.current = onMove;
  const onEndRef = React.useRef(onEnd);
  onEndRef.current = onEnd;
  const onStartRef = React.useRef(onStart);
  onStartRef.current = onStart;

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();

    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);

    const abort = onStartRef.current?.();

    const rect = el.getBoundingClientRect();
    const clampedX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const clampedY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    onMoveRef.current(clampedX, clampedY);

    const handlePointerMove = (ev: PointerEvent) => {
      const x = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (ev.clientY - rect.top) / rect.height));
      onMoveRef.current(x, y);
    };

    const cleanup = () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
    };

    const handlePointerUp = () => {
      cleanup();
      onEndRef.current?.();
    };

    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        cleanup();
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          /* capture already released */
        }
        abort?.();
      }
    };

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);
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
    'root',
    'saturation',
    'hue',
    'alpha',
    'swatches',
    'inputRow',
    'formatSelect',
    'channelInput',
    'alphaInput',
  ] as const,
  defaults: {
    format: 'hex' as ColorFormat,
    size: 'md' as ColorPickerSize,
    withPicker: true,
    swatchesPerRow: 7,
  },
  moveProps: [
    'format',
    'value',
    'defaultValue',
    'onValueChange',
    'onChangeEnd',
    'onFormatChange',
    'formatOptions',
    'swatches',
    'swatchesPerRow',
    'withPicker',
    'fullWidth',
    'labels',
    'readOnly',
  ],

  setup({ props, ref, cx, sp, slot, attrs }) {
    const labels = { ...DEFAULT_LABELS, ...(props.labels as Partial<ColorPickerLabels>) };

    const hookOptions: UseColorPickerOptions = {
      value: props.value as string | undefined,
      defaultValue: props.defaultValue as string | undefined,
      onValueChange: props.onValueChange as ((v: string) => void) | undefined,
      onChangeEnd: props.onChangeEnd as ((v: string) => void) | undefined,
      onFormatChange: props.onFormatChange as ((f: ColorFormat) => void) | undefined,
      format: props.format as ColorFormat,
    };

    const cp = useColorPicker(hookOptions);

    // Snapshot the current colour on drag start; Escape reverts to it (2.5.2).
    const snapshotColor = React.useCallback(() => {
      const before = cp.value;
      return () => cp.setFromString(before);
    }, [cp]);

    // Saturation area drag
    const saturationDrag = useDrag(
      React.useCallback(
        (x: number, y: number) => {
          cp.setSaturationValue(x * 100, (1 - y) * 100);
        },
        [cp],
      ),
      cp.commitChange,
      snapshotColor,
    );

    // Hue slider drag — clamp to 359 to prevent wrapping (360° === 0°)
    const hueDrag = useDrag(
      React.useCallback(
        (x: number) => {
          cp.setHue(Math.min(x * 360, 359));
        },
        [cp],
      ),
      cp.commitChange,
      snapshotColor,
    );

    // Alpha slider drag
    const alphaDrag = useDrag(
      React.useCallback(
        (x: number) => {
          cp.setAlpha(x);
        },
        [cp],
      ),
      cp.commitChange,
      snapshotColor,
    );

    // Keyboard control for the sliders. role="slider" + tabIndex=0 means arrows
    // MUST move them (WCAG 2.1.1 / 4.1.2) — pointer drag alone isn't enough.
    // Shift = ×10 coarse step; Home/End jump to the ends; each press commits
    // like the end of a drag. Disabled/read-only pickers stay inert.
    const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
    const hueKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (props.disabled || props.readOnly) return;
        const step = e.shiftKey ? 10 : 1;
        let h = cp.hsv.h;
        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowDown':
            h = clamp(h - step, 0, 359);
            break;
          case 'ArrowRight':
          case 'ArrowUp':
            h = clamp(h + step, 0, 359);
            break;
          case 'Home':
            h = 0;
            break;
          case 'End':
            h = 359;
            break;
          default:
            return;
        }
        e.preventDefault();
        cp.setHue(h);
        cp.commitChange();
      },
      [cp, props.disabled, props.readOnly],
    );
    const alphaKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (props.disabled || props.readOnly) return;
        const step = e.shiftKey ? 0.1 : 0.01;
        let a = cp.hsv.a;
        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowDown':
            a = clamp(a - step, 0, 1);
            break;
          case 'ArrowRight':
          case 'ArrowUp':
            a = clamp(a + step, 0, 1);
            break;
          case 'Home':
            a = 0;
            break;
          case 'End':
            a = 1;
            break;
          default:
            return;
        }
        e.preventDefault();
        cp.setAlpha(a);
        cp.commitChange();
      },
      [cp, props.disabled, props.readOnly],
    );
    const saturationKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (props.disabled || props.readOnly) return;
        const step = e.shiftKey ? 10 : 1;
        let { s, v } = cp.hsv;
        switch (e.key) {
          case 'ArrowLeft':
            s = clamp(s - step, 0, 100);
            break;
          case 'ArrowRight':
            s = clamp(s + step, 0, 100);
            break;
          case 'ArrowUp':
            v = clamp(v + step, 0, 100);
            break;
          case 'ArrowDown':
            v = clamp(v - step, 0, 100);
            break;
          case 'Home':
            s = 0;
            break;
          case 'End':
            s = 100;
            break;
          default:
            return;
        }
        e.preventDefault();
        cp.setSaturationValue(s, v);
        cp.commitChange();
      },
      [cp, props.disabled, props.readOnly],
    );

    // Format change handler
    const handleFormatChange = React.useCallback(
      (value: string) => {
        const base = value as BaseColorFormat;
        const newFormat = formatWithAlpha(base, cp.showAlpha);
        cp.setActiveFormat(newFormat);
      },
      [cp],
    );

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

    const handleChannelFocus = React.useCallback(
      (index: number) => {
        setFocusedChannel(index);
        setChannelTexts(cp.channels.map((ch) => String(ch.value)));
      },
      [cp.channels],
    );

    const handleChannelBlur = React.useCallback(
      (index: number) => {
        setFocusedChannel(null);
        const num = parseInt(channelTexts[index], 10);
        if (!isNaN(num)) {
          cp.setChannel(index, num);
          cp.commitChange();
        }
      },
      [channelTexts, cp],
    );

    const handleChannelChange = React.useCallback(
      (index: number, text: string) => {
        const num = parseInt(text, 10);
        const ch = cp.channels[index];
        // Clamped to the channel's own range for the same reason as alpha: the
        // model clamps, so an unclamped draft shows a value the colour is not.
        const shown = isNaN(num) || !ch ? text : String(Math.max(ch.min, Math.min(ch.max, num)));
        setChannelTexts((prev) => {
          const next = [...prev];
          next[index] = shown;
          return next;
        });
        if (!isNaN(num)) cp.setChannel(index, num);
      },
      [cp],
    );

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

    const handleAlphaChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const num = parseInt(raw, 10);
        if (isNaN(num)) {
          setAlphaText(raw);
          return;
        }
        // Clamp the DRAFT too, not just the committed value. The model always
        // clamped, so an out-of-range draft left the field reading 500% over a
        // colour that was fully opaque.
        const clamped = Math.max(0, Math.min(100, num));
        setAlphaText(String(clamped));
        cp.setAlpha(clamped / 100);
      },
      [cp],
    );

    // Key handler for the numeric inputs: Enter to blur, Arrow up/down to
    // nudge. Bounds are the driven channel's own — unclamped, ArrowUp at the
    // top wrote 101 into the alpha field and 256 into R, so the text read 101%
    // while the committed color was still 100%: the model clamps on every
    // keystroke, the display did not, and the two drifted apart on screen.
    const makeNudgeKeyDown = React.useCallback(
      (min: number, max: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          (e.target as HTMLInputElement).blur();
          return;
        }
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const delta = e.key === 'ArrowUp' ? step : -step;
        const input = e.target as HTMLInputElement;
        const current = parseInt(input.value, 10);
        if (isNaN(current)) return;
        const newVal = Math.max(min, Math.min(max, current + delta));
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value',
        )?.set;
        nativeInputValueSetter?.call(input, String(newVal));
        input.dispatchEvent(new Event('input', { bubbles: true }));
      },
      [],
    );

    return {
      render() {
        const rootSp = sp('root');
        const {
          className: rootSpClass,
          style: rootSpStyle,
          ...rootSpRest
        } = rootSp as Record<string, unknown>;
        const satSp = sp('saturation');
        const {
          className: satSpClass,
          style: satSpStyle,
          ...satSpRest
        } = satSp as Record<string, unknown>;
        const hueSp = sp('hue');
        const {
          className: hueSpClass,
          style: hueSpStyle,
          ...hueSpRest
        } = hueSp as Record<string, unknown>;
        const alphaSp = sp('alpha');
        const {
          className: alphaSpClass,
          style: alphaSpStyle,
          ...alphaSpRest
        } = alphaSp as Record<string, unknown>;
        const swatchesSp = sp('swatches');
        const {
          className: swatchesSpClass,
          style: swatchesSpStyle,
          ...swatchesSpRest
        } = swatchesSp as Record<string, unknown>;
        const inputRowSp = sp('inputRow');
        const {
          className: inputRowSpClass,
          style: inputRowSpStyle,
          ...inputRowSpRest
        } = inputRowSp as Record<string, unknown>;
        const formatSelectSp = sp('formatSelect');
        const {
          className: formatSelectSpClass,
          style: formatSelectSpStyle,
          ...formatSelectSpRest
        } = formatSelectSp as Record<string, unknown>;

        const size = props.size as string;
        const disabled = props.disabled as boolean | undefined;
        const readOnly = props.readOnly as boolean | undefined;
        const withPicker = props.withPicker as boolean;
        const fullWidth = props.fullWidth as boolean | undefined;
        const swatches = props.swatches as string[] | undefined;
        const swatchesPerRow = props.swatchesPerRow as number;
        const formatOptions =
          (props.formatOptions as BaseColorFormat[] | undefined) || DEFAULT_FORMAT_OPTIONS;

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
            className={cx(
              'root',
              props.className as string | undefined,
              rootSpClass as string | undefined,
            )}
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
                  aria-label={labels.saturation}
                  aria-valuetext={`Saturation ${Math.round(cp.hsv.s)}%, Brightness ${Math.round(cp.hsv.v)}%`}
                  className={cx('saturation', satSpClass as string | undefined)}
                  style={{
                    backgroundColor: pureHueHex,
                    ...(satSpStyle as React.CSSProperties),
                  }}
                  onPointerDown={saturationDrag}
                  onKeyDown={saturationKeyDown}
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
                  aria-label={labels.hue}
                  aria-valuemin={0}
                  aria-valuemax={360}
                  aria-valuenow={Math.round(cp.hsv.h)}
                  className={cx('hue', hueSpClass as string | undefined)}
                  style={hueSpStyle as React.CSSProperties}
                  onPointerDown={hueDrag}
                  onKeyDown={hueKeyDown}
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
                    aria-label={labels.alpha}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(cp.hsv.a * 100)}
                    className={cx('alpha', alphaSpClass as string | undefined)}
                    style={alphaSpStyle as React.CSSProperties}
                    onPointerDown={alphaDrag}
                    onKeyDown={alphaKeyDown}
                  >
                    <div
                      className={styles.alphaGradient}
                      style={{
                        background: `linear-gradient(to right, transparent, ${currentHex})`,
                      }}
                    />
                    <div className={styles.sliderThumb} style={{ left: `${cp.hsv.a * 100}%` }} />
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
                  aria-label={labels.format}
                >
                  <Select.Value />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Content>
                  <Select.Viewport>
                    {formatOptions.map((f) => (
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
                  {...slot('channelInput')}
                  data-channel="hex"
                  value={isHexFocused ? hexText : cp.hexString}
                  onChange={handleHexChange}
                  onFocus={handleHexFocus}
                  onBlur={handleHexBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                  }}
                  disabled={disabled}
                  readOnly={readOnly}
                  aria-label={labels.hex}
                />
              ) : (
                cp.channels.map((ch, i) => (
                  <input
                    key={ch.label}
                    type="text"
                    inputMode="numeric"
                    {...slot('channelInput')}
                    data-channel={ch.label.toLowerCase()}
                    value={focusedChannel === i ? channelTexts[i] : String(ch.value)}
                    onChange={(e) => handleChannelChange(i, e.target.value)}
                    onFocus={() => handleChannelFocus(i)}
                    onBlur={() => handleChannelBlur(i)}
                    onKeyDown={makeNudgeKeyDown(ch.min, ch.max)}
                    disabled={disabled}
                    readOnly={readOnly}
                    aria-label={
                      CHANNEL_LABEL_KEYS[ch.label] ? labels[CHANNEL_LABEL_KEYS[ch.label]] : ch.label
                    }
                  />
                ))
              )}

              {/* Alpha input */}
              {cp.showAlpha && (
                <>
                  <input
                    type="text"
                    inputMode="numeric"
                    {...slot('alphaInput')}
                    value={isAlphaFocused ? alphaText : String(Math.round(cp.hsv.a * 100))}
                    onChange={handleAlphaChange}
                    onFocus={handleAlphaFocus}
                    onBlur={handleAlphaBlur}
                    onKeyDown={makeNudgeKeyDown(0, 100)}
                    disabled={disabled}
                    readOnly={readOnly}
                    aria-label={labels.alphaInput}
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
