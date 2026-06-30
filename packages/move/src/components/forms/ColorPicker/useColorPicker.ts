'use client';
// Generated from ColorPicker.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)

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

  // For controlled mode, derive HSV from props
  const controlledHsv = (() => {
    if (!isControlled || !options.value) return null;
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

  const update = useCallback((newHsv: HsvColor) => {
    setInternalHsv(newHsv);
    const formatted = formatColor(newHsv, formatRef.current);
    onValueChangeRef.current?.(formatted);
  }, []);

  const setHue = useCallback(
    (h: number) => {
      setInternalHsv((prev) => {
        const current = controlledHsv ?? prev;
        const newHsv = { ...current, h: Math.max(0, Math.min(360, h)) };
        const formatted = formatColor(newHsv, formatRef.current);
        onValueChangeRef.current?.(formatted);
        return newHsv;
      });
    },
    [controlledHsv],
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
        const formatted = formatColor(newHsv, formatRef.current);
        onValueChangeRef.current?.(formatted);
        return newHsv;
      });
    },
    [controlledHsv],
  );

  const setAlpha = useCallback(
    (a: number) => {
      setInternalHsv((prev) => {
        const current = controlledHsv ?? prev;
        const newHsv = { ...current, a: Math.max(0, Math.min(1, a)) };
        const formatted = formatColor(newHsv, formatRef.current);
        onValueChangeRef.current?.(formatted);
        return newHsv;
      });
    },
    [controlledHsv],
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
        const formatted = formatColor(newHsv, formatRef.current);
        onValueChangeRef.current?.(formatted);
        return newHsv;
      });
    },
    [controlledHsv],
  );

  const setActiveFormat = useCallback(
    (newFormat: ColorFormat) => {
      setInternalFormat(newFormat);
      formatRef.current = newFormat;
      onFormatChangeRef.current?.(newFormat);
      // Re-emit value in the new format
      setInternalHsv((prev) => {
        const current = controlledHsv ?? prev;
        const formatted = formatColor(current, newFormat);
        onValueChangeRef.current?.(formatted);
        return current;
      });
    },
    [controlledHsv],
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
