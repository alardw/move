'use client';

import * as React from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import { animate, spring } from 'animejs';
import { CalendarContext } from '../../calendar/_shared/CalendarContext';
import { useCalendar } from '../../calendar/Calendar/useCalendar';
import type { UseCalendarOptions } from '../../calendar/Calendar/useCalendar';
import type {
  CalendarEvent,
  CalendarConstraints,
  SelectionMode,
  DateRange,
  RenderDayCell,
  RenderEvent,
} from '../../calendar/_shared/types';
import { formatDate, parseDate, isDateDisabled, getLocaleDatePattern, isBefore, startOfDay } from '../../calendar/_shared/dateUtils';
import { mergeAnimateConfig, prefersReducedMotion } from '../../../animation/utils';
import type { PopupAnimate } from '../../../animation/types';
import { InputText } from '../InputText';
import { TimeField } from '../TimeField';
import { Button } from '../../core/Button';
import { Icon } from '../../core/Icon';
import styles from './DatePicker.module.css';

const springConfig = { mass: 0.6, stiffness: 400, damping: 20, velocity: 0 };

// ============================================================================
// Context (animation coordination + focus model)
// ============================================================================

interface DatePickerRangeLabels {
  from: string;
  to: string;
}

export interface DatePickerLabels {
  selectDate?: string;
  datesSelected?: (count: number) => string;
  openCalendar?: string;
  startDate?: string;
  endDate?: string;
  selectStartDate?: string;
  selectEndDate?: string;
}

const DEFAULT_DATEPICKER_LABELS: Required<DatePickerLabels> = {
  selectDate: 'Select date',
  datesSelected: (count: number) => `${count} dates selected`,
  openCalendar: 'Open calendar',
  startDate: 'Start date',
  endDate: 'End date',
  selectStartDate: 'Select start date',
  selectEndDate: 'Select end date',
};

interface DatePickerContextValue {
  isClosing: boolean;
  close: () => void;
  onCloseComplete: () => void;
  openPopover: () => void;
  focusCalendar: () => void;
  mode: SelectionMode;
  anchorRef: React.RefObject<HTMLElement | null>;
  activeField: 'from' | 'to' | null;
  setActiveField: (field: 'from' | 'to' | null) => void;
  shouldFocusCalendar: boolean;
  clearFocusRequest: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  fromInputRef: React.RefObject<HTMLInputElement | null>;
  toInputRef: React.RefObject<HTMLInputElement | null>;
  rangeLabels: DatePickerRangeLabels;
  labels: Required<DatePickerLabels>;
  isOpen: boolean;
  animateConfig: PopupAnimate | null;
  showTime: boolean;
  timePlacement: 'inline' | 'popup';
  timeHourCycle: 12 | 24;
  timeValue: string;
  onTimeChange: (value: string) => void;
}

const DatePickerContext = React.createContext<DatePickerContextValue | null>(null);

// ============================================================================
// Root
// ============================================================================

export interface DatePickerRootProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  // Animation
  animate?: PopupAnimate | false;

  // Popover
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnSelect?: boolean;

  // Selection
  mode?: SelectionMode;
  value?: Date | DateRange | Date[] | null;
  defaultValue?: Date | DateRange | Date[] | null;
  onValueChange?: (value: any) => void;

  // Events
  events?: CalendarEvent[];

  // Config
  locale?: string;
  weekStartsOn?: number;
  constraints?: CalendarConstraints;
  numberOfMonths?: number;
  showWeekNumbers?: boolean;
  yearRange?: number;
  fixedWeeks?: boolean;

  // Renderers
  renderDayCell?: RenderDayCell;
  renderEvent?: RenderEvent;

  placeholder?: string;
  rangeLabels?: DatePickerRangeLabels;
  labels?: DatePickerLabels;

  /** Show a time picker. Pass true for inline 24h, or an object with placement and hourCycle options. */
  showTime?: boolean | { hourCycle?: 12 | 24; placement?: 'inline' | 'popup' };
}

const defaultDatePickerAnimation: PopupAnimate = {
  enter: {
    opacity: { value: [0, 1], easing: 'outQuart' },
    scale: { value: [0.5, 1], easing: 'outQuart' },
  },
  exit: {
    opacity: { value: [1, 0], easing: 'outQuart' },
    scale: { value: [1, 0.95], easing: 'outQuart' },
    duration: 200,
  },
  stagger: { delay: 15 },
};

const DatePickerRoot: React.FC<DatePickerRootProps> = ({
  children,
  className,
  style,
  animate,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  closeOnSelect = true,
  mode = 'single',
  value,
  defaultValue,
  onValueChange,
  events,
  locale,
  weekStartsOn,
  constraints,
  numberOfMonths,
  showWeekNumbers,
  yearRange,
  fixedWeeks,
  renderDayCell,
  renderEvent,
  rangeLabels: rangeLabelsOverride,
  labels: labelsProp,
  showTime: showTimeProp,
}) => {
  // showTime resolution
  const showTime = !!showTimeProp;
  const timePlacement = (typeof showTimeProp === 'object' ? showTimeProp.placement : undefined) ?? 'inline';
  const timeHourCycle = (typeof showTimeProp === 'object' ? showTimeProp.hourCycle : undefined) ?? 24;
  const labels = React.useMemo(
    () => ({ ...DEFAULT_DATEPICKER_LABELS, ...labelsProp }),
    [labelsProp]
  );
  const rangeLabels = rangeLabelsOverride ?? { from: labels.selectStartDate, to: labels.selectEndDate };
  const animateConfig = animate === false ? null : mergeAnimateConfig(defaultDatePickerAnimation, animate);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [activeField, setActiveField] = React.useState<'from' | 'to' | null>(null);
  const [shouldFocusCalendar, setShouldFocusCalendar] = React.useState(false);
  const anchorRef = React.useRef<HTMLElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const fromInputRef = React.useRef<HTMLInputElement>(null);
  const toInputRef = React.useRef<HTMLInputElement>(null);

  // Time state for showTime integration
  const extractTimeFromDate = React.useCallback((d: Date | null | undefined) => {
    if (!d) return '00:00';
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }, []);

  const [timeValue, setTimeValue] = React.useState(() => {
    if (!showTime) return '00:00';
    const initial = (value ?? defaultValue) as Date | null | undefined;
    return extractTimeFromDate(initial instanceof Date ? initial : null);
  });

  // dateRef tracks the latest calendar date for the time-change callback
  const dateRef = React.useRef<Date | null>(null);

  const onTimeChange = React.useCallback((newTimeValue: string) => {
    setTimeValue(newTimeValue);
    if (mode === 'single' && onValueChange && dateRef.current) {
      const [hh, mm] = newTimeValue.split(':').map(Number);
      const combined = new Date(dateRef.current);
      combined.setHours(hh ?? 0, mm ?? 0, 0, 0);
      onValueChange(combined);
    }
  }, [mode, onValueChange]);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  // Wrap onValueChange to inject time when showTime is active
  const wrappedOnValueChange = React.useMemo(() => {
    if (!showTime || !onValueChange || mode !== 'single') return onValueChange;
    return (newDate: any) => {
      if (newDate instanceof Date) {
        const [hh, mm] = timeValue.split(':').map(Number);
        const combined = new Date(newDate);
        combined.setHours(hh ?? 0, mm ?? 0, 0, 0);
        onValueChange(combined);
        return;
      }
      onValueChange(newDate);
    };
  }, [showTime, onValueChange, mode, timeValue]);

  // Calendar state
  const calendarOptions: UseCalendarOptions = {
    mode,
    value: value as any,
    defaultValue: defaultValue as any,
    onValueChange: wrappedOnValueChange,
    events,
    locale,
    weekStartsOn,
    constraints,
    numberOfMonths,
    showWeekNumbers,
    yearRange,
    fixedWeeks,
    renderDayCell,
    renderEvent,
  } as UseCalendarOptions;

  const calendar = useCalendar(calendarOptions);

  // Keep dateRef in sync for time-change callback
  React.useEffect(() => {
    if (mode === 'single' && calendar.value instanceof Date) {
      dateRef.current = calendar.value;
    }
  }, [mode, calendar.value]);

  // Navigate calendar to the active field's date when activeField changes
  React.useEffect(() => {
    if (mode !== 'range' || !activeField) return;
    const range = calendar.value as DateRange | null;
    const target = activeField === 'from' ? range?.from : range?.to;
    if (target) {
      calendar.setDisplayMonth(new Date(target.getFullYear(), target.getMonth(), 1));
    }
  }, [activeField]);

  // Wrap onSelect for close-on-select + field-aware range
  const originalOnSelect = calendar.onSelect;
  const calendarSetRangeValue = calendar.setRangeValue;
  const wrappedOnSelect = React.useCallback(
    (date: Date) => {
      if (mode === 'range' && activeField !== null && calendarSetRangeValue) {
        const currentRange = calendar.value as DateRange | null;
        if (activeField === 'from') {
          // Set from, keep existing to
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
            setTimeout(() => setIsClosing(true), 120);
          }
          return;
        }
      }

      // Default behavior for single/multiple or range with no activeField
      originalOnSelect(date);

      if (!closeOnSelect) return;

      if (mode === 'single') {
        setTimeout(() => setIsClosing(true), 120);
      } else if (mode === 'range') {
        const current = calendar.value as DateRange | null;
        if (current?.from && !current?.to) {
          setTimeout(() => setIsClosing(true), 120);
        }
      }
    },
    [originalOnSelect, closeOnSelect, mode, calendar.value, activeField, calendarSetRangeValue]
  );

  const calendarCtx = React.useMemo(
    () => ({ ...calendar, onSelect: wrappedOnSelect }),
    [calendar, wrappedOnSelect]
  );

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (newOpen) {
      if (!isControlled) setUncontrolledOpen(true);
      onOpenChange?.(true);
    }
    // Ignore Radix close — we handle via animation
  }, [isControlled, onOpenChange]);

  const handleCloseComplete = React.useCallback(() => {
    if (mode === 'range') {
      setActiveField(null);
    }
    setIsClosing(false);
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
  }, [isControlled, onOpenChange, mode]);

  const close = React.useCallback(() => {
    setIsClosing(true);
  }, []);

  const openPopover = React.useCallback(() => {
    if (!isOpen && !isClosing) {
      if (!isControlled) setUncontrolledOpen(true);
      onOpenChange?.(true);
    }
  }, [isOpen, isClosing, isControlled, onOpenChange]);

  const focusCalendar = React.useCallback(() => {
    if (!isOpen && !isClosing) {
      if (!isControlled) setUncontrolledOpen(true);
      onOpenChange?.(true);
    }
    setShouldFocusCalendar(true);
  }, [isOpen, isClosing, isControlled, onOpenChange]);

  const clearFocusRequest = React.useCallback(() => {
    setShouldFocusCalendar(false);
  }, []);

  return (
    <DatePickerContext.Provider value={{
      isClosing, close, onCloseComplete: handleCloseComplete, openPopover, focusCalendar,
      mode, anchorRef, activeField, setActiveField,
      shouldFocusCalendar, clearFocusRequest,
      inputRef, fromInputRef, toInputRef, rangeLabels, labels, isOpen: !!isOpen,
      animateConfig,
      showTime, timePlacement, timeHourCycle, timeValue, onTimeChange,
    }}>
      <CalendarContext.Provider value={calendarCtx}>
        <RadixPopover.Root open={isOpen || isClosing} onOpenChange={handleOpenChange}>
          <div className={`${styles.root} ${className ?? ''}`} style={style}>
            {children}
          </div>
        </RadixPopover.Root>
      </CalendarContext.Provider>
    </DatePickerContext.Provider>
  );
};
DatePickerRoot.displayName = 'DatePicker.Root';

// ============================================================================
// Trigger (div, not button — a button containing inputs is invalid HTML)
// ============================================================================

export interface DatePickerTriggerProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DatePickerTrigger: React.FC<DatePickerTriggerProps> = ({ children, className, style }) => {
  const dpCtx = React.useContext(DatePickerContext);

  return (
    <RadixPopover.Anchor asChild>
      <div
        ref={dpCtx?.anchorRef as React.RefObject<HTMLDivElement>}
        className={`${styles.trigger} ${className ?? ''}`}
        style={style}
      >
        {children}
      </div>
    </RadixPopover.Anchor>
  );
};
DatePickerTrigger.displayName = 'DatePicker.Trigger';

// ============================================================================
// Input
// ============================================================================

export interface DatePickerInputProps {
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  size?: 'sm' | 'md' | 'lg';
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  placeholder,
  className,
  style,
  size = 'md',
}) => {
  const calendarCtx = React.useContext(CalendarContext);
  const dpCtx = React.useContext(DatePickerContext);
  const locale = calendarCtx?.locale ?? 'en-US';
  const mode = calendarCtx?.mode ?? 'single';
  const value = calendarCtx?.value;

  if (mode === 'range') {
    return (
      <RangeInput
        locale={locale}
        value={value as DateRange | null}
        calendarCtx={calendarCtx}
        dpCtx={dpCtx}
        size={size}
        className={className}
        style={style}
      />
    );
  }

  return (
    <SingleInput
      locale={locale}
      mode={mode}
      value={value}
      calendarCtx={calendarCtx}
      dpCtx={dpCtx}
      placeholder={placeholder}
      size={size}
      className={className}
      style={style}
    />
  );
};
DatePickerInput.displayName = 'DatePicker.Input';

// ============================================================================
// SingleInput (single + multiple modes)
// ============================================================================

interface SingleInputInternalProps {
  locale: string;
  mode: SelectionMode;
  value: any;
  calendarCtx: any;
  dpCtx: DatePickerContextValue | null;
  placeholder?: string;
  size: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

const SingleInput: React.FC<SingleInputInternalProps> = ({
  locale,
  mode,
  value,
  calendarCtx,
  dpCtx,
  placeholder,
  size,
  className,
  style,
}) => {
  const isSingleMode = mode === 'single';

  const formattedValue = React.useMemo(() => {
    if (!value) return '';
    if (mode === 'single') return formatDate(value as Date, locale);
    if (mode === 'multiple') {
      const dates = value as Date[];
      if (dates.length === 0) return '';
      if (dates.length === 1) return formatDate(dates[0], locale);
      return dpCtx?.labels.datesSelected(dates.length) ?? `${dates.length} dates selected`;
    }
    return '';
  }, [value, mode, locale, dpCtx?.labels]);

  const [inputText, setInputText] = React.useState(formattedValue);
  const lastCommittedRef = React.useRef(formattedValue);

  React.useEffect(() => {
    setInputText(formattedValue);
    lastCommittedRef.current = formattedValue;
  }, [formattedValue]);

  const commitOrRevert = React.useCallback(() => {
    if (!isSingleMode || !calendarCtx) return;
    if (inputText === lastCommittedRef.current) return;
    const parsed = parseDate(inputText, locale);
    if (parsed && !isDateDisabled(parsed, calendarCtx.constraints)) {
      calendarCtx.onSelect(parsed);
    } else {
      setInputText(lastCommittedRef.current);
    }
  }, [inputText, locale, isSingleMode, calendarCtx]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isSingleMode || !calendarCtx) return;
      const text = e.target.value;
      setInputText(text);
      const parsed = parseDate(text, locale);
      if (parsed) {
        calendarCtx.setDisplayMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
      }
    },
    [isSingleMode, locale, calendarCtx]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        dpCtx?.focusCalendar();
        return;
      }
      if (!isSingleMode) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        commitOrRevert();
        dpCtx?.close();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setInputText(lastCommittedRef.current);
        dpCtx?.close();
      }
    },
    [isSingleMode, commitOrRevert, dpCtx]
  );

  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (!isSingleMode) return;
      setTimeout(() => {
        commitOrRevert();
      }, 150);
    },
    [isSingleMode, commitOrRevert]
  );

  const handleIconClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dpCtx?.isOpen) {
      dpCtx.close();
    } else {
      dpCtx?.focusCalendar();
    }
  }, [dpCtx]);

  const resolvedPlaceholder = isSingleMode
    ? getLocaleDatePattern(locale)
    : (placeholder ?? dpCtx?.labels.selectDate ?? 'Select date');

  return (
    <div className={`${styles.singleWrapper} ${className ?? ''}`} style={style}>
      <InputText
        ref={dpCtx?.inputRef as React.RefObject<HTMLInputElement>}
        readOnly={!isSingleMode}
        value={isSingleMode ? inputText : formattedValue}
        placeholder={resolvedPlaceholder}
        size={size}
        onChange={isSingleMode ? handleChange : undefined}
        onKeyDown={handleKeyDown}
        onBlur={isSingleMode ? handleBlur : undefined}
        {...(isSingleMode ? { 'data-typing': '' } : {})}
      />
      <Button
        variant="secondary"
        size={size}
        className={styles.calendarButton}
        onClick={handleIconClick}
        aria-label={dpCtx?.labels.openCalendar ?? 'Open calendar'}
      >
        <Icon name="calendar" size="sm" />
      </Button>
      {dpCtx?.showTime && dpCtx.timePlacement === 'inline' && (
        <TimeField
          value={dpCtx.timeValue}
          onValueChange={dpCtx.onTimeChange}
          granularity="minute"
          hourCycle={dpCtx.timeHourCycle}
          size={size}
        />
      )}
    </div>
  );
};

// ============================================================================
// RangeInput (two typeable inputs sharing one wrapper)
// ============================================================================

interface RangeInputInternalProps {
  locale: string;
  value: DateRange | null;
  calendarCtx: any;
  dpCtx: DatePickerContextValue | null;
  size: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

const RangeInput: React.FC<RangeInputInternalProps> = ({
  locale,
  value,
  calendarCtx,
  dpCtx,
  size,
  className,
  style,
}) => {
  const pattern = getLocaleDatePattern(locale);

  // Formatted values from calendar state
  const fromFormatted = React.useMemo(() => (value?.from ? formatDate(value.from, locale) : ''), [value?.from, locale]);
  const toFormatted = React.useMemo(() => (value?.to ? formatDate(value.to, locale) : ''), [value?.to, locale]);

  // Typing state
  const [fromText, setFromText] = React.useState(fromFormatted);
  const [toText, setToText] = React.useState(toFormatted);
  const fromCommittedRef = React.useRef(fromFormatted);
  const toCommittedRef = React.useRef(toFormatted);

  // Sync when calendar value changes externally
  React.useEffect(() => {
    setFromText(fromFormatted);
    fromCommittedRef.current = fromFormatted;
  }, [fromFormatted]);

  React.useEffect(() => {
    setToText(toFormatted);
    toCommittedRef.current = toFormatted;
  }, [toFormatted]);

  const commitFrom = React.useCallback(() => {
    if (!calendarCtx?.setRangeValue) return;
    if (fromText === fromCommittedRef.current) return;
    const parsed = parseDate(fromText, locale);
    if (parsed && !isDateDisabled(parsed, calendarCtx.constraints)) {
      const currentTo = value?.to;
      if (currentTo && isBefore(currentTo, parsed)) {
        // Auto-swap
        calendarCtx.setRangeValue({ from: startOfDay(currentTo), to: startOfDay(parsed) });
      } else {
        calendarCtx.setRangeValue({ from: startOfDay(parsed), to: currentTo as any });
      }
    } else {
      setFromText(fromCommittedRef.current);
    }
  }, [fromText, locale, calendarCtx, value?.to]);

  const commitTo = React.useCallback(() => {
    if (!calendarCtx?.setRangeValue) return;
    if (toText === toCommittedRef.current) return;
    const parsed = parseDate(toText, locale);
    if (parsed && !isDateDisabled(parsed, calendarCtx.constraints)) {
      const currentFrom = value?.from;
      if (currentFrom && isBefore(parsed, currentFrom)) {
        // Auto-swap
        calendarCtx.setRangeValue({ from: startOfDay(parsed), to: startOfDay(currentFrom) });
      } else {
        calendarCtx.setRangeValue({ from: currentFrom as any, to: startOfDay(parsed) });
      }
    } else {
      setToText(toCommittedRef.current);
    }
  }, [toText, locale, calendarCtx, value?.from]);

  // From input handlers
  const handleFromChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setFromText(text);
    const parsed = parseDate(text, locale);
    if (parsed && calendarCtx) {
      calendarCtx.setDisplayMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
    }
  }, [locale, calendarCtx]);

  const handleFromKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      dpCtx?.focusCalendar();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      commitFrom();
      // Advance to "to" input
      dpCtx?.toInputRef.current?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setFromText(fromCommittedRef.current);
      dpCtx?.close();
    }
  }, [commitFrom, dpCtx]);

  const handleFromFocus = React.useCallback(() => {
    dpCtx?.setActiveField('from');
  }, [dpCtx]);

  const handleFromBlur = React.useCallback(() => {
    setTimeout(() => commitFrom(), 150);
  }, [commitFrom]);

  // To input handlers
  const handleToChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setToText(text);
    const parsed = parseDate(text, locale);
    if (parsed && calendarCtx) {
      calendarCtx.setDisplayMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
    }
  }, [locale, calendarCtx]);

  const handleToKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      dpCtx?.focusCalendar();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      commitTo();
      dpCtx?.close();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setToText(toCommittedRef.current);
      dpCtx?.close();
    }
  }, [commitTo, dpCtx]);

  const handleToFocus = React.useCallback(() => {
    dpCtx?.setActiveField('to');
  }, [dpCtx]);

  const handleToBlur = React.useCallback(() => {
    setTimeout(() => commitTo(), 150);
  }, [commitTo]);

  // Calendar icon click — always restart from→to flow
  const handleIconClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dpCtx?.isOpen) {
      dpCtx.close();
    } else {
      dpCtx?.setActiveField('from');
      dpCtx?.focusCalendar();
    }
  }, [dpCtx]);

  return (
    <div
      className={`${styles.rangeWrapper} ${className ?? ''}`}
      style={style}
      data-size={size}
    >
      <InputText
        ref={dpCtx?.fromInputRef as React.RefObject<HTMLInputElement>}
        value={fromText}
        placeholder={pattern}
        size={size}
        onChange={handleFromChange}
        onKeyDown={handleFromKeyDown}
        onFocus={handleFromFocus}
        onBlur={handleFromBlur}
        aria-label={dpCtx?.labels.startDate ?? 'Start date'}
        data-typing=""
      />
      <span className={styles.rangeSeparator} aria-hidden="true">{'\u2014'}</span>
      <InputText
        ref={dpCtx?.toInputRef as React.RefObject<HTMLInputElement>}
        value={toText}
        placeholder={pattern}
        size={size}
        onChange={handleToChange}
        onKeyDown={handleToKeyDown}
        onFocus={handleToFocus}
        onBlur={handleToBlur}
        aria-label={dpCtx?.labels.endDate ?? 'End date'}
        data-typing=""
      />
      <Button
        variant="secondary"
        size={size}
        className={styles.calendarButton}
        onClick={handleIconClick}
        aria-label={dpCtx?.labels.openCalendar ?? 'Open calendar'}
      >
        <Icon name="calendar" size="sm" />
      </Button>
    </div>
  );
};

// ============================================================================
// Icon (kept for backwards compat / custom icon slot)
// ============================================================================

export interface DatePickerIconProps {
  className?: string;
  children?: React.ReactNode;
}

const DatePickerIcon: React.FC<DatePickerIconProps> = ({ className, children }) => {
  return (
    <span className={`${styles.icon} ${className ?? ''}`}>
      {children ?? <Icon name="calendar" size="sm" />}
    </span>
  );
};
DatePickerIcon.displayName = 'DatePicker.Icon';

// ============================================================================
// Portal
// ============================================================================

export interface DatePickerPortalProps {
  children?: React.ReactNode;
  container?: HTMLElement;
}

const DatePickerPortal: React.FC<DatePickerPortalProps> = (props) => (
  <RadixPopover.Portal {...props} />
);
DatePickerPortal.displayName = 'DatePicker.Portal';

// ============================================================================
// Content
// ============================================================================

export interface DatePickerContentProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
}

const DatePickerContent: React.FC<DatePickerContentProps> = ({
  children,
  className,
  style,
  sideOffset = 4,
  align = 'start',
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const animRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const cellsAnimRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const dpCtx = React.useContext(DatePickerContext);
  const [isAnimatingOut, setIsAnimatingOut] = React.useState(false);

  // Focus calendar content when requested
  React.useEffect(() => {
    if (dpCtx?.shouldFocusCalendar && contentRef.current) {
      contentRef.current.focus();
      dpCtx.clearFocusRequest();
    }
  }, [dpCtx?.shouldFocusCalendar]);

  const animateConfig = dpCtx?.animateConfig ?? null;

  // Animate open
  React.useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // If animations are disabled or reduced motion preferred, just show content directly
    if (!animateConfig || prefersReducedMotion()) {
      el.style.opacity = '1';
      el.style.transform = 'scale(1)';
      return;
    }

    if (animRef.current) animRef.current.pause();
    if (cellsAnimRef.current) cellsAnimRef.current.pause();

    // Container: scale + opacity
    el.style.opacity = '0';
    el.style.transform = 'scale(0.5)';

    animRef.current = animate(el, {
      opacity: 1,
      scale: 1,
      ease: 'outQuart',
      duration: 250,
    });

    // Stagger day cells (opacity only — avoid inline transform on interactive elements)
    const cells = el.querySelectorAll('[role="gridcell"]');
    if (cells.length) {
      cells.forEach((cell) => {
        (cell as HTMLElement).style.opacity = '0';
      });
      cellsAnimRef.current = animate(cells, {
        opacity: 1,
        ease: spring(springConfig),
        delay: (_el: any, i: number) => i * 15,
        onComplete: () => {
          // Clean up inline styles so React can manage them
          cells.forEach((cell) => {
            (cell as HTMLElement).style.removeProperty('opacity');
          });
        },
      });
    }
  }, [animateConfig]);

  // When isClosing becomes true
  React.useEffect(() => {
    if (dpCtx?.isClosing && !isAnimatingOut) {
      setIsAnimatingOut(true);
    }
  }, [dpCtx?.isClosing, isAnimatingOut]);

  // Animate close
  React.useEffect(() => {
    if (!isAnimatingOut) return;
    const el = contentRef.current;
    if (!el) return;

    // If animations are disabled or reduced motion preferred, close immediately
    if (!animateConfig || prefersReducedMotion()) {
      dpCtx?.onCloseComplete();
      return;
    }

    if (animRef.current) animRef.current.pause();
    if (cellsAnimRef.current) cellsAnimRef.current.pause();

    // Stagger cells out in reverse
    const cells = el.querySelectorAll('[role="gridcell"]');
    const cellCount = cells.length;
    if (cellCount) {
      cellsAnimRef.current = animate(cells, {
        opacity: 0,
        ease: 'outQuart',
        duration: 150,
        delay: (_el: any, i: number) => (cellCount - 1 - i) * 10,
      });
    }

    animRef.current = animate(el, {
      opacity: 0,
      scale: 0.95,
      ease: 'outQuart',
      duration: 200,
      delay: 50,
      onComplete: () => dpCtx?.onCloseComplete(),
    });
  }, [isAnimatingOut, dpCtx, animateConfig]);

  const handlePointerDownOutside = (e: Event) => {
    // Ignore clicks on the anchor/trigger (input area)
    const target = e.target as Node;
    if (dpCtx?.anchorRef.current?.contains(target)) {
      e.preventDefault();
      return;
    }
    if (!e.defaultPrevented) dpCtx?.close();
  };

  const handleEscapeKeyDown = (e: KeyboardEvent) => {
    if (!e.defaultPrevented) dpCtx?.close();
  };

  return (
    <RadixPopover.Content
      ref={contentRef}
      sideOffset={sideOffset}
      align={align}
      className={`${styles.content} ${className ?? ''}`}
      style={style}
      onPointerDownOutside={handlePointerDownOutside}
      onEscapeKeyDown={handleEscapeKeyDown}
      onOpenAutoFocus={(e) => e.preventDefault()}
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      {dpCtx?.mode === 'range' && dpCtx.activeField && (
        <div className={styles.rangeInstruction}>
          {dpCtx.activeField === 'from' ? dpCtx.rangeLabels.from : dpCtx.rangeLabels.to}
        </div>
      )}
      {children}
      {dpCtx?.showTime && dpCtx.timePlacement === 'popup' && (
        <div className={styles.datePickerTime}>
          <span className={styles.datePickerTimeLabel}>Time</span>
          <TimeField
            value={dpCtx.timeValue}
            onValueChange={dpCtx.onTimeChange}
            granularity="minute"
            hourCycle={dpCtx.timeHourCycle}
            size="sm"
          />
        </div>
      )}
    </RadixPopover.Content>
  );
};
DatePickerContent.displayName = 'DatePicker.Content';

// ============================================================================
// Export
// ============================================================================

export const DatePicker = {
  Root: DatePickerRoot,
  Trigger: DatePickerTrigger,
  Input: DatePickerInput,
  Icon: DatePickerIcon,
  Portal: DatePickerPortal,
  Content: DatePickerContent,
};
