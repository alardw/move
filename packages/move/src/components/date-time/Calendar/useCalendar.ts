// Generated from Calendar.spec.ts
// Provenance: original-components/date-time/Calendar/useCalendar.ts

import { useCallback, useMemo } from 'react';
import { useControlledState } from '../../../engine';
import type {
  CalendarEvent,
  CalendarConstraints,
  SelectionMode,
  DateRange,
  RenderDayCell,
  RenderEvent,
} from '../_shared/types';
import {
  isSameDay,
  isBefore,
  getLocaleFirstDay,
  isDateDisabled,
  startOfDay,
} from '../_shared/dateUtils';
import type { CalendarContextValue, CalendarLabels } from '../_shared/CalendarContext';
import { DEFAULT_CALENDAR_LABELS } from '../_shared/CalendarContext';

// ============================================================================
// Overloaded options
// ============================================================================

interface UseCalendarBaseOptions {
  locale?: string;
  weekStartsOn?: number;
  constraints?: CalendarConstraints;
  events?: CalendarEvent[];
  numberOfMonths?: number;
  showWeekNumbers?: boolean;
  yearRange?: number;
  fixedWeeks?: boolean;
  renderDayCell?: RenderDayCell;
  renderEvent?: RenderEvent;
  labels?: CalendarLabels;
}

export interface UseCalendarSingleOptions extends UseCalendarBaseOptions {
  mode?: 'single';
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
}

export interface UseCalendarRangeOptions extends UseCalendarBaseOptions {
  mode: 'range';
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (value: DateRange | null) => void;
}

export interface UseCalendarMultipleOptions extends UseCalendarBaseOptions {
  mode: 'multiple';
  value?: Date[];
  defaultValue?: Date[];
  onValueChange?: (value: Date[]) => void;
}

export type UseCalendarOptions =
  UseCalendarSingleOptions | UseCalendarRangeOptions | UseCalendarMultipleOptions;

export interface UseCalendarReturn extends CalendarContextValue {}

// ============================================================================
// Hook
// ============================================================================

export function useCalendar(options: UseCalendarOptions = {}): UseCalendarReturn {
  const {
    locale = 'en-US',
    weekStartsOn: weekStartsOnProp,
    constraints,
    events = [],
    numberOfMonths = 1,
    showWeekNumbers = false,
    yearRange = 12,
    fixedWeeks = false,
    renderDayCell,
    renderEvent,
    labels: labelsProp,
  } = options;

  const labels = useMemo(() => ({ ...DEFAULT_CALENDAR_LABELS, ...labelsProp }), [labelsProp]);

  const mode: SelectionMode = options.mode ?? 'single';

  const weekStartsOn = weekStartsOnProp ?? getLocaleFirstDay(locale);

  // ---- Display month state ----
  const initialDisplayMonth = (() => {
    if (mode === 'single' && options.value)
      return new Date((options.value as Date).getFullYear(), (options.value as Date).getMonth(), 1);
    if (mode === 'single' && options.defaultValue)
      return new Date(
        (options.defaultValue as Date).getFullYear(),
        (options.defaultValue as Date).getMonth(),
        1,
      );
    if (mode === 'range' && (options as UseCalendarRangeOptions).value?.from) {
      const from = (options as UseCalendarRangeOptions).value!.from;
      return new Date(from.getFullYear(), from.getMonth(), 1);
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  })();

  const [displayMonth, setDisplayMonth] = useControlledState<Date>({
    defaultValue: initialDisplayMonth,
  });

  // ---- Selection state ----
  const [singleValue, setSingleValue] = useControlledState<Date | null>({
    value: mode === 'single' ? (options as UseCalendarSingleOptions).value : undefined,
    defaultValue:
      mode === 'single' ? ((options as UseCalendarSingleOptions).defaultValue ?? null) : null,
    onChange: mode === 'single' ? (options as UseCalendarSingleOptions).onValueChange : undefined,
  });

  const [rangeValue, setRangeValue] = useControlledState<DateRange | null>({
    value: mode === 'range' ? (options as UseCalendarRangeOptions).value : undefined,
    defaultValue:
      mode === 'range' ? ((options as UseCalendarRangeOptions).defaultValue ?? null) : null,
    onChange: mode === 'range' ? (options as UseCalendarRangeOptions).onValueChange : undefined,
  });

  const [multipleValue, setMultipleValue] = useControlledState<Date[]>({
    value: mode === 'multiple' ? (options as UseCalendarMultipleOptions).value : undefined,
    defaultValue:
      mode === 'multiple' ? ((options as UseCalendarMultipleOptions).defaultValue ?? []) : [],
    onChange:
      mode === 'multiple' ? (options as UseCalendarMultipleOptions).onValueChange : undefined,
  });

  // ---- Focus state ----
  const [focusedDate, setFocusedDate] = useControlledState<Date | null>({
    defaultValue: null,
  });

  // ---- Current value ----
  const value = mode === 'single' ? singleValue : mode === 'range' ? rangeValue : multipleValue;

  // ---- Grid entry day ----
  // The grid needs exactly one tab stop at all times, including before the user
  // has focused anything. With focusedDate still null every cell would take
  // tabIndex -1 and Tab would skip the grid entirely, leaving only the month/year
  // nav reachable — and arrow keys would have no date to move from.
  //
  // Deliberately NOT the same thing as focusedDate: this only decides which cell
  // is tabbable. Nothing focuses it, so rendering a calendar never pulls focus.
  const entryDate = useMemo(() => {
    const inDisplayedMonths = (d: Date) => {
      const first = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1);
      const afterLast = new Date(
        displayMonth.getFullYear(),
        displayMonth.getMonth() + numberOfMonths,
        1,
      );
      return d >= first && d < afterLast;
    };

    const selected =
      mode === 'single'
        ? singleValue
        : mode === 'range'
          ? (rangeValue?.from ?? null)
          : (multipleValue[0] ?? null);

    if (selected && inDisplayedMonths(selected) && !isDateDisabled(selected, constraints)) {
      return startOfDay(selected);
    }

    const today = startOfDay(new Date());
    if (inDisplayedMonths(today) && !isDateDisabled(today, constraints)) return today;

    // Fall back to the first day of the displayed month that can be selected;
    // a fully disabled month yields no tab stop, which is the honest answer.
    const first = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1);
    const afterLast = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth() + numberOfMonths,
      1,
    );
    for (const d = new Date(first); d < afterLast; d.setDate(d.getDate() + 1)) {
      if (!isDateDisabled(d, constraints)) return startOfDay(d);
    }
    return null;
  }, [mode, singleValue, rangeValue, multipleValue, displayMonth, numberOfMonths, constraints]);

  // ---- Selection handler ----
  const onSelect = useCallback(
    (date: Date) => {
      if (isDateDisabled(date, constraints)) return;

      if (mode === 'single') {
        setSingleValue(date);
      } else if (mode === 'range') {
        setRangeValue((prev) => {
          const current = prev as DateRange | null;
          if (!current || !current.from || current.to) {
            // Start new range
            return { from: startOfDay(date), to: undefined as any };
          }
          // Complete range
          const from = current.from;
          if (isBefore(date, from)) {
            return { from: startOfDay(date), to: startOfDay(from) };
          }
          return { from: startOfDay(from), to: startOfDay(date) };
        });
      } else if (mode === 'multiple') {
        setMultipleValue((prev) => {
          const current = (prev as Date[]) ?? [];
          const exists = current.findIndex((d) => isSameDay(d, date));
          if (exists >= 0) {
            return current.filter((_, i) => i !== exists);
          }
          return [...current, startOfDay(date)];
        });
      }
    },
    [mode, constraints, setSingleValue, setRangeValue, setMultipleValue],
  );

  // ---- Events helper ----
  const getEventsForDate = useCallback(
    (date: Date): CalendarEvent[] => {
      return events.filter((evt) => isSameDay(evt.start, date));
    },
    [events],
  );

  return {
    displayMonth,
    setDisplayMonth,
    mode,
    value,
    onSelect,
    ...(mode === 'range' ? { setRangeValue } : {}),
    events,
    getEventsForDate,
    locale,
    weekStartsOn,
    constraints,
    numberOfMonths,
    showWeekNumbers,
    yearRange,
    fixedWeeks,
    renderDayCell,
    renderEvent,
    focusedDate,
    setFocusedDate,
    entryDate,
    labels,
  };
}
