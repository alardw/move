// Generated from DatePicker.spec.ts (schemaVersion: 6, specHash: 891de3de)

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useCalendar } from '../../calendar/Calendar/useCalendar';
import type { UseCalendarOptions } from '../../calendar/Calendar/useCalendar';
import type { DateRange, SelectionMode } from '../../calendar/_shared/types';
import {
  formatDate,
  parseDate,
  isDateDisabled,
  getLocaleDatePattern,
  isBefore,
  startOfDay,
} from '../../calendar/_shared/dateUtils';

export type UseDatePickerOptions = UseCalendarOptions & {
  /** Close popover after date selection */
  closeOnSelect?: boolean;
  /** Input placeholder text */
  placeholder?: string;
  /** Show time picker. Pass true for 24h or object with hourCycle and placement options. */
  showTime?: boolean | { hourCycle?: 12 | 24; placement?: 'inline' | 'popup' };
};

export interface UseDatePickerReturn {
  calendarProps: ReturnType<typeof useCalendar>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openPopover: () => void;
  displayValue: string;
  activeField: 'from' | 'to' | null;
  setActiveField: (field: 'from' | 'to' | null) => void;
  inputProps: {
    value: string;
    placeholder: string;
    readOnly: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
  };
  fromInputProps?: {
    value: string;
    placeholder: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
    onBlur: React.FocusEventHandler<HTMLInputElement>;
    onFocus: React.FocusEventHandler<HTMLInputElement>;
  };
  toInputProps?: {
    value: string;
    placeholder: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
    onBlur: React.FocusEventHandler<HTMLInputElement>;
    onFocus: React.FocusEventHandler<HTMLInputElement>;
  };
  /** Time value (HH:mm) when showTime is active */
  timeValue: string;
  /** Update time value */
  onTimeChange: (value: string) => void;
  /** Whether showTime is active */
  showTime: boolean;
  /** Hour cycle for time display */
  timeHourCycle: 12 | 24;
}

export function useDatePicker(
  options: UseDatePickerOptions = {} as UseDatePickerOptions,
): UseDatePickerReturn {
  const {
    closeOnSelect = true,
    placeholder = 'Select date',
    showTime: showTimeProp,
    ...calendarOptions
  } = options;

  const showTime = !!showTimeProp;
  const timeHourCycle =
    (typeof showTimeProp === 'object' ? showTimeProp.hourCycle : undefined) ?? 24;

  const calendar = useCalendar(calendarOptions as UseCalendarOptions);
  const [isOpen, setIsOpen] = useState(false);
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const [timeValue, setTimeValue] = useState('00:00');

  const onTimeChange = useCallback((newTime: string) => {
    setTimeValue(newTime);
  }, []);

  const mode: SelectionMode = calendar.mode;
  const locale = calendar.locale;

  // Wrap onSelect to close on selection
  const originalOnSelect = calendar.onSelect;
  const calendarSetRangeValue = calendar.setRangeValue;

  const wrappedOnSelect = useCallback(
    (date: Date) => {
      if (mode === 'range' && activeField !== null && calendarSetRangeValue) {
        const currentRange = calendar.value as DateRange | null;
        if (activeField === 'from') {
          const existingTo = currentRange?.to;
          if (existingTo && isBefore(existingTo, date)) {
            calendarSetRangeValue({ from: startOfDay(date), to: undefined as any });
          } else {
            calendarSetRangeValue({ from: startOfDay(date), to: existingTo as any });
          }
          setActiveField('to');
          return;
        }
        if (activeField === 'to') {
          const from = currentRange?.from;
          if (from) {
            if (isBefore(date, from)) {
              calendarSetRangeValue({ from: startOfDay(date), to: startOfDay(from) });
            } else {
              calendarSetRangeValue({ from: startOfDay(from), to: startOfDay(date) });
            }
          } else {
            calendarSetRangeValue({ from: startOfDay(date), to: undefined as any });
          }
          if (closeOnSelect) {
            setTimeout(() => setIsOpen(false), 150);
          }
          return;
        }
      }

      originalOnSelect(date);

      if (closeOnSelect && mode === 'single') {
        setTimeout(() => setIsOpen(false), 150);
      }

      if (mode === 'range') {
        const current = calendar.value as DateRange | null;
        if (current?.from && !current?.to) {
          setTimeout(() => setIsOpen(false), 150);
        }
      }
    },
    [originalOnSelect, closeOnSelect, mode, calendar.value, activeField, calendarSetRangeValue],
  );

  const calendarProps = useMemo(
    () => ({ ...calendar, onSelect: wrappedOnSelect }),
    [calendar, wrappedOnSelect],
  );

  const openPopover = useCallback(() => {
    if (!isOpen) setIsOpen(true);
  }, [isOpen]);

  // Format display value
  const displayValue = useMemo(() => {
    const { value } = calendar;
    if (!value) return '';

    if (mode === 'single') {
      return formatDate(value as Date, locale);
    }

    if (mode === 'range') {
      const range = value as DateRange;
      if (!range.from) return '';
      if (!range.to) return formatDate(range.from, locale) + ' \u2014 ...';
      return `${formatDate(range.from, locale)} \u2014 ${formatDate(range.to, locale)}`;
    }

    if (mode === 'multiple') {
      const dates = value as Date[];
      if (dates.length === 0) return '';
      if (dates.length === 1) return formatDate(dates[0], locale);
      return `${dates.length} dates selected`;
    }

    return '';
  }, [calendar.value, mode, locale]);

  const isSingleMode = mode === 'single';
  const isRangeMode = mode === 'range';
  const pattern = getLocaleDatePattern(locale);

  // Typing state for single mode
  const [inputText, setInputText] = useState(displayValue);
  const lastCommittedRef = useRef(displayValue);

  useEffect(() => {
    setInputText(displayValue);
    lastCommittedRef.current = displayValue;
  }, [displayValue]);

  const commitOrRevert = useCallback(() => {
    const parsed = parseDate(inputText, locale);
    if (parsed && !isDateDisabled(parsed, calendar.constraints)) {
      wrappedOnSelect(parsed);
    } else {
      setInputText(lastCommittedRef.current);
    }
  }, [inputText, locale, calendar.constraints, wrappedOnSelect]);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      setInputText(text);
      const parsed = parseDate(text, locale);
      if (parsed) {
        calendar.setDisplayMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
      }
    },
    [locale, calendar],
  );

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openPopover();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        commitOrRevert();
        setTimeout(() => setIsOpen(false), 150);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setInputText(lastCommittedRef.current);
        setIsOpen(false);
      }
    },
    [commitOrRevert, openPopover],
  );

  const onInputBlur = useCallback(() => {
    setTimeout(() => commitOrRevert(), 150);
  }, [commitOrRevert]);

  // Range typing state
  const rangeValue = calendar.value as DateRange | null;
  const fromFormatted = useMemo(
    () => (rangeValue?.from ? formatDate(rangeValue.from, locale) : ''),
    [rangeValue?.from, locale],
  );
  const toFormatted = useMemo(
    () => (rangeValue?.to ? formatDate(rangeValue.to, locale) : ''),
    [rangeValue?.to, locale],
  );

  const [fromText, setFromText] = useState(fromFormatted);
  const [toText, setToText] = useState(toFormatted);
  const fromCommittedRef = useRef(fromFormatted);
  const toCommittedRef = useRef(toFormatted);

  useEffect(() => {
    setFromText(fromFormatted);
    fromCommittedRef.current = fromFormatted;
  }, [fromFormatted]);

  useEffect(() => {
    setToText(toFormatted);
    toCommittedRef.current = toFormatted;
  }, [toFormatted]);

  const commitFrom = useCallback(() => {
    if (!calendarSetRangeValue) return;
    if (fromText === fromCommittedRef.current) return;
    const parsed = parseDate(fromText, locale);
    if (parsed && !isDateDisabled(parsed, calendar.constraints)) {
      const currentTo = rangeValue?.to;
      if (currentTo && isBefore(currentTo, parsed)) {
        calendarSetRangeValue({ from: startOfDay(currentTo), to: startOfDay(parsed) });
      } else {
        calendarSetRangeValue({ from: startOfDay(parsed), to: currentTo as any });
      }
    } else {
      setFromText(fromCommittedRef.current);
    }
  }, [fromText, locale, calendarSetRangeValue, calendar.constraints, rangeValue?.to]);

  const commitTo = useCallback(() => {
    if (!calendarSetRangeValue) return;
    if (toText === toCommittedRef.current) return;
    const parsed = parseDate(toText, locale);
    if (parsed && !isDateDisabled(parsed, calendar.constraints)) {
      const currentFrom = rangeValue?.from;
      if (currentFrom && isBefore(parsed, currentFrom)) {
        calendarSetRangeValue({ from: startOfDay(parsed), to: startOfDay(currentFrom) });
      } else {
        calendarSetRangeValue({ from: currentFrom as any, to: startOfDay(parsed) });
      }
    } else {
      setToText(toCommittedRef.current);
    }
  }, [toText, locale, calendarSetRangeValue, calendar.constraints, rangeValue?.from]);

  // Build return
  const result: UseDatePickerReturn = {
    calendarProps,
    isOpen,
    setIsOpen,
    openPopover,
    displayValue,
    activeField,
    setActiveField,
    inputProps: isSingleMode
      ? {
          value: inputText,
          placeholder,
          readOnly: false,
          onChange: onInputChange,
          onKeyDown: onInputKeyDown,
          onBlur: onInputBlur,
        }
      : {
          value: displayValue,
          placeholder,
          readOnly: true,
        },
    timeValue,
    onTimeChange,
    showTime,
    timeHourCycle,
  };

  if (isRangeMode) {
    result.fromInputProps = {
      value: fromText,
      placeholder: pattern,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setFromText(text);
        const parsed = parseDate(text, locale);
        if (parsed) {
          calendar.setDisplayMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
        }
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          openPopover();
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          commitFrom();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setFromText(fromCommittedRef.current);
          setIsOpen(false);
        }
      },
      onBlur: () => {
        setTimeout(() => commitFrom(), 150);
      },
      onFocus: () => {
        setActiveField('from');
      },
    };

    result.toInputProps = {
      value: toText,
      placeholder: pattern,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setToText(text);
        const parsed = parseDate(text, locale);
        if (parsed) {
          calendar.setDisplayMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
        }
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          openPopover();
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          commitTo();
          if (closeOnSelect) {
            setTimeout(() => setIsOpen(false), 150);
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setToText(toCommittedRef.current);
          setIsOpen(false);
        }
      },
      onBlur: () => {
        setTimeout(() => commitTo(), 150);
      },
      onFocus: () => {
        setActiveField('to');
      },
    };
  }

  return result;
}
