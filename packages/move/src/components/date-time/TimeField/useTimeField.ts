// Generated from TimeField.spec.ts
import { useCallback, useRef, useMemo, useState } from 'react';
import { useControlledState } from '../../../engine';

export type SegmentType = 'hour' | 'minute' | 'second';
export type TimeFieldGranularity = 'hour' | 'minute' | 'second';

export interface UseTimeFieldOptions {
  /** Controlled value in 24h format: "HH", "HH:mm", or "HH:mm:ss" */
  value?: string;
  /** Default value for uncontrolled mode */
  defaultValue?: string;
  /** Called when value changes */
  onValueChange?: (value: string) => void;
  /** Which segments to show — default 'minute' */
  granularity?: TimeFieldGranularity;
  /** 12 or 24 hour cycle — default 24 */
  hourCycle?: 12 | 24;
  /** Min time constraint (24h format) */
  min?: string;
  /** Max time constraint (24h format) */
  max?: string;
  /** Arrow key increment in seconds — default 1 */
  step?: number;
  /** Disabled state */
  disabled?: boolean;
}

export interface SegmentInfo {
  type: SegmentType | 'period';
  value: string;
  placeholder: string;
}

export interface UseTimeFieldReturn {
  /** Current formatted value string */
  value: string;
  /** Set value directly */
  setValue: (value: string) => void;
  /** Ordered segment descriptors for rendering */
  segments: SegmentInfo[];
  /** Raw hours (0-23, always 24h internally) */
  hours: number;
  /** Raw minutes (0-59) */
  minutes: number;
  /** Raw seconds (0-59) */
  seconds: number;
  /** Current period for 12h display */
  period: 'AM' | 'PM';
  /** Set hours directly */
  setHours: (h: number) => void;
  /** Set minutes directly */
  setMinutes: (m: number) => void;
  /** Set seconds directly */
  setSeconds: (s: number) => void;
  /** Toggle or set period */
  setPeriod: (p: 'AM' | 'PM') => void;
  /** Increment a segment by step */
  increment: (segment: SegmentType | 'period') => void;
  /** Decrement a segment by step */
  decrement: (segment: SegmentType | 'period') => void;
  /** Type a digit into a segment — returns whether segment is "full" (auto-advance) */
  type: (segment: SegmentType | 'period', key: string) => boolean;
  /** Clear typing buffer for a segment */
  clearBuffer: (segment: SegmentType | 'period') => void;
  /** Granularity */
  granularity: TimeFieldGranularity;
  /** Hour cycle */
  hourCycle: 12 | 24;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseTimeString(str: string | undefined): { h: number; m: number; s: number } {
  if (!str) return { h: 0, m: 0, s: 0 };
  const parts = str.split(':').map(Number);
  return {
    h: clamp(parts[0] || 0, 0, 23),
    m: clamp(parts[1] || 0, 0, 59),
    s: clamp(parts[2] || 0, 0, 59),
  };
}

function formatTimeString(
  h: number,
  m: number,
  s: number,
  granularity: TimeFieldGranularity,
): string {
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  if (granularity === 'hour') return hh;
  if (granularity === 'minute') return `${hh}:${mm}`;
  return `${hh}:${mm}:${ss}`;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function to12Hour(h24: number): number {
  if (h24 === 0) return 12;
  if (h24 > 12) return h24 - 12;
  return h24;
}

function to24Hour(h12: number, period: 'AM' | 'PM'): number {
  if (period === 'AM') return h12 === 12 ? 0 : h12;
  return h12 === 12 ? 12 : h12 + 12;
}

function wrap(value: number, min: number, max: number, delta: number): number {
  const range = max - min + 1;
  return ((((value - min + delta) % range) + range) % range) + min;
}

/** Seconds since midnight for an h:m:s. */
function timeToSeconds(h: number, m: number, s: number): number {
  return h * 3600 + m * 60 + s;
}
/** h:m:s from seconds since midnight (wrapped into a single day). */
function secondsToHMS(total: number): { h: number; m: number; s: number } {
  const t = ((Math.round(total) % 86400) + 86400) % 86400;
  return { h: Math.floor(t / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTimeField(options: UseTimeFieldOptions = {}): UseTimeFieldReturn {
  const { granularity = 'minute', hourCycle = 24, step = 1, disabled = false } = options;

  // Typing buffer per segment (for two-digit entry)
  const bufferRef = useRef<Record<string, string>>({});
  const bufferTimerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Tracks the in-progress digit display per segment (e.g. "1" while waiting for second digit)
  const [typingDisplay, setTypingDisplay] = useState<Record<string, string>>({});

  const [value, setValueRaw] = useControlledState<string>({
    value: options.value,
    defaultValue: options.defaultValue ?? formatTimeString(0, 0, 0, granularity),
    onChange: options.onValueChange,
  });

  const parsed = useMemo(() => parseTimeString(value), [value]);
  const { h: hours, m: minutes, s: seconds } = parsed;
  const period: 'AM' | 'PM' = hours >= 12 ? 'PM' : 'AM';

  // Build value from parts
  const buildValue = useCallback(
    (h: number, m: number, s: number) => formatTimeString(h, m, s, granularity),
    [granularity],
  );

  const setValue = useCallback(
    (v: string) => {
      if (disabled) return;
      setValueRaw(v);
    },
    [disabled, setValueRaw],
  );

  // min/max time constraints, as seconds since midnight. Every change flows
  // through updatePart, so clamping here enforces them for typing, increment/
  // decrement, AM/PM, and direct setters alike.
  const minSeconds = useMemo(
    () =>
      options.min
        ? timeToSeconds(
            parseTimeString(options.min).h,
            parseTimeString(options.min).m,
            parseTimeString(options.min).s,
          )
        : null,
    [options.min],
  );
  const maxSeconds = useMemo(
    () =>
      options.max
        ? timeToSeconds(
            parseTimeString(options.max).h,
            parseTimeString(options.max).m,
            parseTimeString(options.max).s,
          )
        : null,
    [options.max],
  );

  const updatePart = useCallback(
    (newH: number, newM: number, newS: number) => {
      if (disabled) return;
      let h = newH,
        m = newM,
        s = newS;
      const total = timeToSeconds(h, m, s);
      if (minSeconds != null && total < minSeconds) ({ h, m, s } = secondsToHMS(minSeconds));
      else if (maxSeconds != null && total > maxSeconds) ({ h, m, s } = secondsToHMS(maxSeconds));
      setValueRaw(buildValue(h, m, s));
    },
    [disabled, buildValue, setValueRaw, minSeconds, maxSeconds],
  );

  const setHours = useCallback(
    (h: number) => updatePart(clamp(h, 0, 23), minutes, seconds),
    [updatePart, minutes, seconds],
  );
  const setMinutes = useCallback(
    (m: number) => updatePart(hours, clamp(m, 0, 59), seconds),
    [updatePart, hours, seconds],
  );
  const setSeconds = useCallback(
    (s: number) => updatePart(hours, minutes, clamp(s, 0, 59)),
    [updatePart, hours, minutes],
  );

  const setPeriod = useCallback(
    (p: 'AM' | 'PM') => {
      if (disabled) return;
      const h12 = to12Hour(hours);
      const newH = to24Hour(h12, p);
      updatePart(newH, minutes, seconds);
    },
    [disabled, hours, minutes, seconds, updatePart],
  );

  const increment = useCallback(
    (segment: SegmentType | 'period') => {
      if (disabled) return;
      if (segment === 'hour') {
        const maxH = hourCycle === 12 ? 12 : 23;
        const minH = hourCycle === 12 ? 1 : 0;
        if (hourCycle === 12) {
          const h12 = to12Hour(hours);
          const next = wrap(h12, minH, maxH, 1);
          updatePart(to24Hour(next, period), minutes, seconds);
        } else {
          updatePart(wrap(hours, minH, maxH, 1), minutes, seconds);
        }
      } else if (segment === 'minute') {
        updatePart(
          hours,
          wrap(minutes, 0, 59, step >= 60 ? 1 : Math.max(1, Math.round(step))),
          seconds,
        );
      } else if (segment === 'second') {
        updatePart(hours, minutes, wrap(seconds, 0, 59, Math.max(1, Math.round(step))));
      } else if (segment === 'period') {
        setPeriod(period === 'AM' ? 'PM' : 'AM');
      }
    },
    [disabled, hours, minutes, seconds, period, hourCycle, step, updatePart, setPeriod],
  );

  const decrement = useCallback(
    (segment: SegmentType | 'period') => {
      if (disabled) return;
      if (segment === 'hour') {
        const maxH = hourCycle === 12 ? 12 : 23;
        const minH = hourCycle === 12 ? 1 : 0;
        if (hourCycle === 12) {
          const h12 = to12Hour(hours);
          const next = wrap(h12, minH, maxH, -1);
          updatePart(to24Hour(next, period), minutes, seconds);
        } else {
          updatePart(wrap(hours, minH, maxH, -1), minutes, seconds);
        }
      } else if (segment === 'minute') {
        updatePart(
          hours,
          wrap(minutes, 0, 59, -(step >= 60 ? 1 : Math.max(1, Math.round(step)))),
          seconds,
        );
      } else if (segment === 'second') {
        updatePart(hours, minutes, wrap(seconds, 0, 59, -Math.max(1, Math.round(step))));
      } else if (segment === 'period') {
        setPeriod(period === 'AM' ? 'PM' : 'AM');
      }
    },
    [disabled, hours, minutes, seconds, period, hourCycle, step, updatePart, setPeriod],
  );

  const clearBuffer = useCallback((segment: SegmentType | 'period') => {
    delete bufferRef.current[segment];
    if (bufferTimerRef.current[segment]) {
      clearTimeout(bufferTimerRef.current[segment]);
      delete bufferTimerRef.current[segment];
    }
    setTypingDisplay((prev) => {
      if (!(segment in prev)) return prev;
      const next = { ...prev };
      delete next[segment];
      return next;
    });
  }, []);

  const type = useCallback(
    (segment: SegmentType | 'period', key: string): boolean => {
      if (disabled) return false;

      // Period segment: A→AM, P→PM
      if (segment === 'period') {
        const k = key.toUpperCase();
        if (k === 'A') {
          setPeriod('AM');
          return true;
        }
        if (k === 'P') {
          setPeriod('PM');
          return true;
        }
        return false;
      }

      // Digit input
      if (!/^\d$/.test(key)) return false;

      const prev = bufferRef.current[segment] || '';
      const combined = prev + key;

      // Clear existing timer
      if (bufferTimerRef.current[segment]) {
        clearTimeout(bufferTimerRef.current[segment]);
      }

      let num = parseInt(combined, 10);
      let isFull = false;

      if (segment === 'hour') {
        const maxH = hourCycle === 12 ? 12 : 23;
        const minH = hourCycle === 12 ? 1 : 0;
        if (combined.length >= 2) {
          num = clamp(num, minH, maxH);
          if (hourCycle === 12) {
            updatePart(to24Hour(num, period), minutes, seconds);
          } else {
            updatePart(num, minutes, seconds);
          }
          clearBuffer(segment);
          isFull = true;
        } else {
          // Single digit — if it can't form a valid two-digit number, auto-commit
          if (num > Math.floor(maxH / 10)) {
            num = clamp(num, minH, maxH);
            if (hourCycle === 12) {
              updatePart(to24Hour(num, period), minutes, seconds);
            } else {
              updatePart(num, minutes, seconds);
            }
            clearBuffer(segment);
            isFull = true;
          } else {
            bufferRef.current[segment] = combined;
            setTypingDisplay((prev) => ({ ...prev, [segment]: combined.padStart(2, '0') }));
            // Auto-clear buffer after 1s
            bufferTimerRef.current[segment] = setTimeout(() => {
              const buffered = bufferRef.current[segment];
              if (buffered) {
                const val = clamp(parseInt(buffered, 10), minH, maxH);
                if (hourCycle === 12) {
                  updatePart(to24Hour(val, period), minutes, seconds);
                } else {
                  updatePart(val, minutes, seconds);
                }
                clearBuffer(segment);
              }
            }, 1000);
          }
        }
      } else {
        // minute or second (0-59)
        if (combined.length >= 2) {
          num = clamp(num, 0, 59);
          if (segment === 'minute') {
            updatePart(hours, num, seconds);
          } else {
            updatePart(hours, minutes, num);
          }
          clearBuffer(segment);
          isFull = true;
        } else {
          if (num > 5) {
            num = clamp(num, 0, 59);
            if (segment === 'minute') {
              updatePart(hours, num, seconds);
            } else {
              updatePart(hours, minutes, num);
            }
            clearBuffer(segment);
            isFull = true;
          } else {
            bufferRef.current[segment] = combined;
            setTypingDisplay((prev) => ({ ...prev, [segment]: combined.padStart(2, '0') }));
            bufferTimerRef.current[segment] = setTimeout(() => {
              const buffered = bufferRef.current[segment];
              if (buffered) {
                const val = clamp(parseInt(buffered, 10), 0, 59);
                if (segment === 'minute') {
                  updatePart(hours, val, seconds);
                } else {
                  updatePart(hours, minutes, val);
                }
                clearBuffer(segment);
              }
            }, 1000);
          }
        }
      }

      return isFull;
    },
    [disabled, hours, minutes, seconds, period, hourCycle, updatePart, setPeriod, clearBuffer],
  );

  // Build segment descriptors
  const segments = useMemo((): SegmentInfo[] => {
    const result: SegmentInfo[] = [];
    const displayHour = hourCycle === 12 ? to12Hour(hours) : hours;

    result.push({
      type: 'hour',
      value: typingDisplay.hour ?? String(displayHour).padStart(2, '0'),
      placeholder: 'HH',
    });

    if (granularity === 'minute' || granularity === 'second') {
      result.push({
        type: 'minute',
        value: typingDisplay.minute ?? String(minutes).padStart(2, '0'),
        placeholder: 'MM',
      });
    }

    if (granularity === 'second') {
      result.push({
        type: 'second',
        value: typingDisplay.second ?? String(seconds).padStart(2, '0'),
        placeholder: 'SS',
      });
    }

    if (hourCycle === 12) {
      result.push({
        type: 'period',
        value: period,
        placeholder: 'AM',
      });
    }

    return result;
  }, [hours, minutes, seconds, period, granularity, hourCycle, typingDisplay]);

  return {
    value,
    setValue,
    segments,
    hours,
    minutes,
    seconds,
    period,
    setHours,
    setMinutes,
    setSeconds,
    setPeriod,
    increment,
    decrement,
    type,
    clearBuffer,
    granularity,
    hourCycle,
  };
}
