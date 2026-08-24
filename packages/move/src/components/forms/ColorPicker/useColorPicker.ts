'use client';
// Generated from ColorPicker.spec.ts

import { useCallback, useMemo, useRef, useState } from 'react';
import type { HsvColor, ColorFormat, ColorChannel } from './colorUtils';
import {
  parseColor,
  formatColor,
  hasAlphaChannel,
  getColorChannels,
  setChannelFromInput,
  getHexString,
} from './colorUtils';

// ============================================================================
// Types
// ============================================================================

export interface UseColorPickerOptions {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onChangeEnd?: (value: string) => void;
  onFormatChange?: (format: ColorFormat) => void;
  format?: ColorFormat;
}

export interface UseColorPickerReturn {
  hsv: HsvColor;
  value: string;
  showAlpha: boolean;
  activeFormat: ColorFormat;
  channels: ColorChannel[];
  hexString: string;
  setHue: (h: number) => void;
  setSaturationValue: (s: number, v: number) => void;
  setAlpha: (a: number) => void;
  setFromString: (value: string) => void;
  setChannel: (index: number, value: number) => void;
  setActiveFormat: (format: ColorFormat) => void;
  commitChange: () => void;
}

// ============================================================================
// Default color
// ============================================================================

const DEFAULT_HSV: HsvColor = { h: 0, s: 100, v: 100, a: 1 };

// ============================================================================
// Hook
// ============================================================================

export function useColorPicker(options: UseColorPickerOptions = {}): UseColorPickerReturn {
  const { format = 'hex', onValueChange, onChangeEnd, onFormatChange } = options;

  const isControlled = options.value !== undefined;

  // Active format state (user can switch via selector)
  const [internalFormat, setInternalFormat] = useState<ColorFormat>(format);
  const activeFormat = internalFormat;
  const showAlpha = hasAlphaChannel(activeFormat);

  // Parse initial value
  const initialHsv = (() => {
    const v = options.value ?? options.defaultValue;
    if (v) {
      const parsed = parseColor(v);
      if (parsed) return parsed;
    }
    return DEFAULT_HSV;
  })();

  const [internalHsv, setInternalHsv] = useState<HsvColor>(initialHsv);

  /**
   * The last string this hook emitted. Controlled consumers hand it straight
   * back as `value`, and re-parsing it would rebuild HSV from RGB — a
   * conversion that cannot carry hue or saturation at the edges of the space.
   * Drag to the bottom of the saturation area and every colour is #000000, so
   * the round trip returns h=0, s=0: the cursor jumped to the left edge and the
   * hue reset to red mid-drag. Elsewhere, 8-bit quantisation moved the
   * recovered s/v a little off the dragged position, so the cursor wobbled
   * under the pointer. HSV is the source of truth; a controlled value is
   * adopted only when it is genuinely new.
   */
  const lastEmittedRef = useRef<string | null>(null);

  // For controlled mode, derive HSV from props — unless this is our own echo.
  const controlledHsv = (() => {
    if (!isControlled || !options.value) return null;
    if (options.value === lastEmittedRef.current) return null;
    return parseColor(options.value);
  })();

  const hsv = controlledHsv ?? internalHsv;
  const value = formatColor(hsv, activeFormat);

  // Computed channel values
  const channels = useMemo(() => getColorChannels(hsv, activeFormat), [hsv, activeFormat]);
  const hexString = useMemo(() => getHexString(hsv), [hsv]);

  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;
  const onChangeEndRef = useRef(onChangeEnd);
  onChangeEndRef.current = onChangeEnd;
  const onFormatChangeRef = useRef(onFormatChange);
  onFormatChangeRef.current = onFormatChange;
  const formatRef = useRef(activeFormat);
  formatRef.current = activeFormat;

  /** Format, record, report. Recording is what lets the echo be recognised. */
  const emit = useCallback((newHsv: HsvColor, fmt?: ColorFormat) => {
    const formatted = formatColor(newHsv, fmt ?? formatRef.current);
    lastEmittedRef.current = formatted;
    onValueChangeRef.current?.(formatted);
    return formatted;
  }, []);

  const update = useCallback(
    (newHsv: HsvColor) => {
      setInternalHsv(newHsv);
      emit(newHsv);
    },
    [emit],
  );

  const setHue = useCallback(
    (h: number) => {
      setInternalHsv((prev) => {
        const current = controlledHsv ?? prev;
        const newHsv = { ...current, h: Math.max(0, Math.min(360, h)) };
        emit(newHsv);
        return newHsv;
      });
    },
    [controlledHsv, emit],
  );

  const setSaturationValue = useCallback(
    (s: number, v: number) => {
      setInternalHsv((prev) => {
        const current = controlledHsv ?? prev;
        const newHsv = {
          ...current,
          s: Math.max(0, Math.min(100, s)),
          v: Math.max(0, Math.min(100, v)),
        };
        emit(newHsv);
        return newHsv;
      });
    },
    [controlledHsv, emit],
  );

  const setAlpha = useCallback(
    (a: number) => {
      setInternalHsv((prev) => {
        const current = controlledHsv ?? prev;
        const newHsv = { ...current, a: Math.max(0, Math.min(1, a)) };
        emit(newHsv);
        return newHsv;
      });
    },
    [controlledHsv, emit],
  );

  const setFromString = useCallback(
    (colorString: string) => {
      const parsed = parseColor(colorString);
      if (parsed) {
        update(parsed);
      }
    },
    [update],
  );

  const setChannel = useCallback(
    (index: number, val: number) => {
      setInternalHsv((prev) => {
        const current = controlledHsv ?? prev;
        const newHsv = setChannelFromInput(current, formatRef.current, index, val);
        emit(newHsv);
        return newHsv;
      });
    },
    [controlledHsv, emit],
  );

  const setActiveFormat = useCallback(
    (newFormat: ColorFormat) => {
      setInternalFormat(newFormat);
      formatRef.current = newFormat;
      onFormatChangeRef.current?.(newFormat);
      // Re-emit value in the new format
      setInternalHsv((prev) => {
        const current = controlledHsv ?? prev;
        emit(current, newFormat);
        return current;
      });
    },
    [controlledHsv, emit],
  );

  const commitChange = useCallback(() => {
    setInternalHsv((prev) => {
      const current = controlledHsv ?? prev;
      const formatted = formatColor(current, formatRef.current);
      onChangeEndRef.current?.(formatted);
      return current;
    });
  }, [controlledHsv]);

  return {
    hsv,
    value,
    showAlpha,
    activeFormat,
    channels,
    hexString,
    setHue,
    setSaturationValue,
    setAlpha,
    setFromString,
    setChannel,
    setActiveFormat,
    commitChange,
  };
}
