'use client';
// Generated from DatePicker.spec.ts

import * as React from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import { CalendarContext } from '../../date-time/_shared/CalendarContext';
import { CalendarNav } from '../../date-time/_shared/CalendarNav';
import { MonthGrid } from '../../date-time/_shared/MonthGrid';
import { useCalendar } from '../../date-time/Calendar/useCalendar';
import type { UseCalendarOptions } from '../../date-time/Calendar/useCalendar';
import type {
  CalendarEvent,
  CalendarConstraints,
  SelectionMode,
  DateRange,
  RenderDayCell,
  RenderEvent,
} from '../../date-time/_shared/types';
import {
  formatDate,
  parseDate,
  isDateDisabled,
  getLocaleDatePattern,
  isBefore,
  startOfDay,
} from '../../date-time/_shared/dateUtils';
import {
  useAnimations,
  resolveAnimationsConfig,
  staggerItems,
  quick,
  useDismissable,
  useDismissableExit,
} from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import { useMergedRef } from '../../../engine';
import { InputText } from '../../forms/InputText';
import { TimeField } from '../TimeField';
import { Button } from '../../actions/Button';
import { useIcon } from '../../../infrastructure/Icon';
import { useLayer } from '../../../infrastructure/Layer';
import styles from './DatePicker.module.css';

// =============================================================================
// Types
// =============================================================================

export type DatePickerSize = 'sm' | 'md' | 'lg';

export interface DatePickerRangeLabels {
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

const DEFAULT_LABELS: Required<DatePickerLabels> = {
  selectDate: 'Select date',
  datesSelected: (count: number) => `${count} dates selected`,
  openCalendar: 'Open calendar',
  startDate: 'Start date',
  endDate: 'End date',
  selectStartDate: 'Select start date',
  selectEndDate: 'Select end date',
};

// =============================================================================
// Animation defaults
// =============================================================================

const DEFAULT_DATEPICKER_ANIMATIONS: AnimationTrigger[] = [
  {
    // Shell only fades (Radix owns its transform). The scale lives on the inner
    // box; the gridcells stagger on top. All parallel (nested array).
    trigger: 'Content.enter',
    sequence: [
      [
        { target: 'Content', animation: { opacity: { from: 0, to: 1, duration: 150 } } },
        { target: 'ContentInner', animation: { scale: { from: 0.95, to: 1, ease: quick } } },
        {
          target: 'ContentInner',
          children: '[role="gridcell"]',
          stagger: { delay: 15 },
          animation: staggerItems.enter,
        },
      ],
    ],
  },
  {
    trigger: 'Content.exit',
    // Quick container fade only — NO per-cell exit stagger. A long staggered
    // exit keeps isClosing (and Radix's dismiss layer) alive for hundreds of ms,
    // which froze cells mid-stagger on rapid reopen and made a sibling popup's
    // first click get eaten by this one still closing. Same rule Select/TimeField
    // follow: the container fades, it never staggers out.
    sequence: [
      [
        { target: 'Content', animation: { opacity: { to: 0, duration: 150 } } },
        { target: 'ContentInner', animation: { scale: { to: 0.95, duration: 150 } } },
      ],
    ],
  },
];

// =============================================================================
// Context
// =============================================================================

interface DatePickerContextValue {
  isClosing: boolean;
  close: () => void;
  epoch: number;
  onExitDone: (epoch: number) => void;
  openPopover: () => void;
  focusCalendar: (cancelClose?: boolean) => void;
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
  animConfig: AnimationTrigger[] | null;
  showTime: boolean;
  timePlacement: 'inline' | 'popup';
  timeHourCycle: 12 | 24;
  timeValue: string;
  onTimeChange: (value: string) => void;
}

const DatePickerContext = React.createContext<DatePickerContextValue | null>(null);

// =============================================================================
// Root
// =============================================================================

export interface DatePickerRootProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  /** Animation config for open/close transitions */
  animations?: AnimationTrigger[] | false;

  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Open state change handler */
  onOpenChange?: (open: boolean) => void;
  /** Close popover after date selection */
  closeOnSelect?: boolean;

  /** Date selection mode */
  mode?: SelectionMode;
  /** Controlled selected value */
  value?: Date | DateRange | Date[] | null;
  /** Default selected value (uncontrolled) */
  defaultValue?: Date | DateRange | Date[] | null;
  /** Value change handler */
  onValueChange?: (value: any) => void;

  /** Calendar events to display */
  events?: CalendarEvent[];
  /** Locale for date formatting (BCP 47) */
  locale?: string;
  /** First day of week (0=Sun, 1=Mon, etc.) */
  weekStartsOn?: number;
  /** Date constraints (min, max, disabled dates) */
  constraints?: CalendarConstraints;
  /** Number of months to display simultaneously */
  numberOfMonths?: number;
  /** Show ISO week numbers */
  showWeekNumbers?: boolean;
  /** Year range for year picker navigation */
  yearRange?: number;
  /** Always show 6 weeks per month */
  fixedWeeks?: boolean;

  /** Custom day cell renderer */
  renderDayCell?: RenderDayCell;
  /** Custom event renderer */
  renderEvent?: RenderEvent;

  /** Input placeholder text */
  placeholder?: string;
  /** Custom labels for range from/to fields */
  rangeLabels?: DatePickerRangeLabels;
  /** Custom UI labels for accessibility and display */
  labels?: DatePickerLabels;

  /** Show time picker integration */
  showTime?: boolean | { hourCycle?: 12 | 24; placement?: 'inline' | 'popup' };
}

const DatePickerRoot: React.FC<DatePickerRootProps> = ({
  children,
  className,
  style,
  animations: animationsProp,
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
  const timePlacement =
    (typeof showTimeProp === 'object' ? showTimeProp.placement : undefined) ?? 'inline';
  const timeHourCycle =
    (typeof showTimeProp === 'object' ? showTimeProp.hourCycle : undefined) ?? 24;

  const labels = React.useMemo(() => ({ ...DEFAULT_LABELS, ...labelsProp }), [labelsProp]);
  const rangeLabels = rangeLabelsOverride ?? {
    from: labels.selectStartDate,
    to: labels.selectEndDate,
  };

  const animConfig = resolveAnimationsConfig(DEFAULT_DATEPICKER_ANIMATIONS, animationsProp);

  const [activeField, setActiveField] = React.useState<'from' | 'to' | null>(null);
  const [shouldFocusCalendar, setShouldFocusCalendar] = React.useState(false);

  // Interruptible open/close lifecycle (open cancels an in-flight close;
  // exit-completion is epoch-guarded so a reopened popup can't be closed by a
  // superseded exit). See useDismissable.
  const dismissable = useDismissable({
    open: controlledOpen,
    defaultOpen,
    onOpenChange,
    onClosed: () => {
      if (mode === 'range') setActiveField(null);
    },
  });
  const { isOpen, isClosing, epoch, onExitDone, open: openPopover, reopen, close } = dismissable;
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

  const dateRef = React.useRef<Date | null>(null);

  const onTimeChange = React.useCallback(
    (newTimeValue: string) => {
      setTimeValue(newTimeValue);
      if (mode === 'single' && onValueChange && dateRef.current) {
        const [hh, mm] = newTimeValue.split(':').map(Number);
        const combined = new Date(dateRef.current);
        combined.setHours(hh ?? 0, mm ?? 0, 0, 0);
        onValueChange(combined);
      }
    },
    [mode, onValueChange],
  );

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
  }, [activeField]); // eslint-disable-line react-hooks/exhaustive-deps

  // Wrap onSelect for close-on-select + field-aware range
  const originalOnSelect = calendar.onSelect;
  const calendarSetRangeValue = calendar.setRangeValue;
  const wrappedOnSelect = React.useCallback(
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
            setTimeout(() => close(), 120);
          }
          return;
        }
      }

      // Default behavior for single/multiple or range with no activeField
      originalOnSelect(date);

      if (!closeOnSelect) return;

      if (mode === 'single') {
        setTimeout(() => close(), 120);
      } else if (mode === 'range') {
        const current = calendar.value as DateRange | null;
        if (current?.from && !current?.to) {
          setTimeout(() => close(), 120);
        }
      }
    },
    [
      originalOnSelect,
      closeOnSelect,
      mode,
      calendar.value,
      activeField,
      calendarSetRangeValue,
      close,
    ],
  );

  const calendarCtx = React.useMemo(
    () => ({ ...calendar, onSelect: wrappedOnSelect }),
    [calendar, wrappedOnSelect],
  );

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      // Open (or cancel an in-flight close) via the lifecycle; ignore Radix's
      // own close — we drive the exit animation ourselves.
      if (newOpen) openPopover();
    },
    [openPopover],
  );

  // Close the popup on viewport changes — scroll (any ancestor) or
  // resize. Without this the popover floats away from the trigger
  // when the page or a parent ScrollArea scrolls. capture: true so
  // we catch scroll events on nested scroll containers, not just
  // window. passive: true so we don't block the scroll itself.
  React.useEffect(() => {
    if (!isOpen || isClosing || typeof window === 'undefined') return;
    const onViewportChange = () => close();
    window.addEventListener('scroll', onViewportChange, { capture: true, passive: true });
    window.addEventListener('resize', onViewportChange);
    return () => {
      window.removeEventListener('scroll', onViewportChange, { capture: true });
      window.removeEventListener('resize', onViewportChange);
    };
  }, [isOpen, isClosing, close]);

  const focusCalendar = React.useCallback(
    (cancelClose = false) => {
      // cancelClose=true only for an explicit icon re-click (cancels an in-flight
      // close so a rapid re-click reopens). Focus-driven opens pass nothing, so
      // they can't cancel a deliberate close-on-select.
      (cancelClose ? reopen : openPopover)();
      setShouldFocusCalendar(true);
    },
    [openPopover, reopen],
  );

  const clearFocusRequest = React.useCallback(() => {
    setShouldFocusCalendar(false);
  }, []);

  return (
    <DatePickerContext.Provider
      value={{
        isClosing,
        close,
        epoch,
        onExitDone,
        openPopover,
        focusCalendar,
        mode,
        anchorRef,
        activeField,
        setActiveField,
        shouldFocusCalendar,
        clearFocusRequest,
        inputRef,
        fromInputRef,
        toInputRef,
        rangeLabels,
        labels,
        isOpen: !!isOpen,
        animConfig,
        showTime,
        timePlacement,
        timeHourCycle,
        timeValue,
        onTimeChange,
      }}
    >
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

// =============================================================================
// Trigger (div, not button — a button containing inputs is invalid HTML)
// =============================================================================

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

// =============================================================================
// Input
// =============================================================================

export interface DatePickerInputProps {
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  size?: DatePickerSize;
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

// =============================================================================
// SingleInput (single + multiple modes)
// =============================================================================

interface SingleInputInternalProps {
  locale: string;
  mode: SelectionMode;
  value: any;
  calendarCtx: any;
  dpCtx: DatePickerContextValue | null;
  placeholder?: string;
  size: DatePickerSize;
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
  const calendarIcon = useIcon('calendar', 16);

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
    [isSingleMode, locale, calendarCtx],
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
    [isSingleMode, commitOrRevert, dpCtx],
  );

  const handleBlur = React.useCallback(() => {
    if (!isSingleMode) return;
    setTimeout(() => {
      commitOrRevert();
    }, 150);
  }, [isSingleMode, commitOrRevert]);

  const handleIconClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (dpCtx?.isOpen && !dpCtx?.isClosing) {
        dpCtx.close();
      } else {
        dpCtx?.focusCalendar(true);
      }
    },
    [dpCtx],
  );

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
        <span aria-hidden="true">{calendarIcon}</span>
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

// =============================================================================
// RangeInput (two typeable inputs sharing one wrapper)
// =============================================================================

interface RangeInputInternalProps {
  locale: string;
  value: DateRange | null;
  calendarCtx: any;
  dpCtx: DatePickerContextValue | null;
  size: DatePickerSize;
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
  const calendarIcon = useIcon('calendar', 16);

  const fromFormatted = React.useMemo(
    () => (value?.from ? formatDate(value.from, locale) : ''),
    [value?.from, locale],
  );
  const toFormatted = React.useMemo(
    () => (value?.to ? formatDate(value.to, locale) : ''),
    [value?.to, locale],
  );

  const [fromText, setFromText] = React.useState(fromFormatted);
  const [toText, setToText] = React.useState(toFormatted);
  const fromCommittedRef = React.useRef(fromFormatted);
  const toCommittedRef = React.useRef(toFormatted);

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
        calendarCtx.setRangeValue({ from: startOfDay(parsed), to: startOfDay(currentFrom) });
      } else {
        calendarCtx.setRangeValue({ from: currentFrom as any, to: startOfDay(parsed) });
      }
    } else {
      setToText(toCommittedRef.current);
    }
  }, [toText, locale, calendarCtx, value?.from]);

  const handleFromChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      setFromText(text);
      const parsed = parseDate(text, locale);
      if (parsed && calendarCtx) {
        calendarCtx.setDisplayMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
      }
    },
    [locale, calendarCtx],
  );

  const handleFromKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        dpCtx?.focusCalendar();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        commitFrom();
        dpCtx?.toInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setFromText(fromCommittedRef.current);
        dpCtx?.close();
      }
    },
    [commitFrom, dpCtx],
  );

  const handleFromFocus = React.useCallback(() => {
    dpCtx?.setActiveField('from');
  }, [dpCtx]);

  const handleFromBlur = React.useCallback(() => {
    setTimeout(() => commitFrom(), 150);
  }, [commitFrom]);

  const handleToChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      setToText(text);
      const parsed = parseDate(text, locale);
      if (parsed && calendarCtx) {
        calendarCtx.setDisplayMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
      }
    },
    [locale, calendarCtx],
  );

  const handleToKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    },
    [commitTo, dpCtx],
  );

  const handleToFocus = React.useCallback(() => {
    dpCtx?.setActiveField('to');
  }, [dpCtx]);

  const handleToBlur = React.useCallback(() => {
    setTimeout(() => commitTo(), 150);
  }, [commitTo]);

  const handleIconClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (dpCtx?.isOpen && !dpCtx?.isClosing) {
        dpCtx.close();
      } else {
        dpCtx?.setActiveField('from');
        dpCtx?.focusCalendar(true);
      }
    },
    [dpCtx],
  );

  return (
    <div className={`${styles.rangeWrapper} ${className ?? ''}`} style={style} data-size={size}>
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
      <span className={styles.rangeSeparator} aria-hidden="true">
        {'\u2014'}
      </span>
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
        <span aria-hidden="true">{calendarIcon}</span>
      </Button>
    </div>
  );
};

// =============================================================================
// Icon (custom icon slot override)
// =============================================================================

export interface DatePickerIconProps {
  className?: string;
  children?: React.ReactNode;
}

const DatePickerIcon: React.FC<DatePickerIconProps> = ({ className, children }) => {
  const calendarIcon = useIcon('calendar', 16);

  return <span className={`${styles.icon} ${className ?? ''}`}>{children ?? calendarIcon}</span>;
};
DatePickerIcon.displayName = 'DatePicker.Icon';

// =============================================================================
// Content (auto-portals to document.body)
// =============================================================================

export interface DatePickerContentProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Offset from trigger */
  sideOffset?: number;
  /** Alignment relative to trigger */
  align?: 'start' | 'center' | 'end';
  /** Custom portal mount target */
  container?: HTMLElement;
  [key: string]: unknown;
}

const DatePickerContentInner = React.forwardRef<
  HTMLDivElement,
  DatePickerContentProps & { layer: number }
>(function DatePickerContentInner(
  { children, className, style, sideOffset = 4, align = 'start', layer: rawLayer, ...rest },
  forwardedRef,
) {
  const layer = rawLayer as number;
  const dpCtx = React.useContext(DatePickerContext);
  const animConfig = dpCtx?.animConfig ?? null;

  const contentRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);

  const contentConfig = React.useMemo(
    () =>
      animConfig?.filter((t) => t.trigger === 'Content.enter' || t.trigger === 'Content.exit') ??
      null,
    [animConfig],
  );
  const contentRefs = React.useMemo(
    () => ({
      Content: contentRef as React.RefObject<HTMLElement | null>,
      ContentInner: innerRef as React.RefObject<HTMLElement | null>,
    }),
    [],
  );

  const { runExit, runEnter, pauseAll } = useAnimations(contentConfig, contentRefs);

  useDismissableExit({
    isClosing: dpCtx?.isClosing ?? false,
    epoch: dpCtx?.epoch ?? 0,
    onExitDone: dpCtx?.onExitDone ?? (() => {}),
    runExit,
    runEnter,
    pauseAll,
  });

  const mergedRef = useMergedRef(forwardedRef, contentRef as React.Ref<HTMLDivElement>);

  React.useEffect(() => {
    if (dpCtx?.shouldFocusCalendar && contentRef.current) {
      contentRef.current.focus();
      dpCtx.clearFocusRequest();
    }
  }, [dpCtx?.shouldFocusCalendar]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePointerDownOutside = (e: Event) => {
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
      {...rest}
      ref={mergedRef}
      sideOffset={sideOffset as number}
      align={align as 'start' | 'center' | 'end'}
      className={`${styles.content} ${className ?? ''}`}
      style={{ ...(style as React.CSSProperties), ...(layer > 0 ? { zIndex: layer + 1 } : {}) }}
      onPointerDownOutside={handlePointerDownOutside}
      onEscapeKeyDown={handleEscapeKeyDown}
      onOpenAutoFocus={(e) => e.preventDefault()}
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      <div ref={innerRef} className={styles.contentInner}>
        {dpCtx?.mode === 'range' && dpCtx.activeField && (
          <div className={styles.rangeInstruction}>
            {dpCtx.activeField === 'from' ? dpCtx.rangeLabels.from : dpCtx.rangeLabels.to}
          </div>
        )}
        {
          (children ?? (
            <>
              <CalendarNav />
              <MonthGrid />
            </>
          )) as React.ReactNode
        }
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
      </div>
    </RadixPopover.Content>
  );
});

const DatePickerContent = React.forwardRef<HTMLDivElement, DatePickerContentProps>(
  ({ container, ...rest }, forwardedRef) => {
    const layer = useLayer();
    return (
      <RadixPopover.Portal container={container as HTMLElement | undefined}>
        <DatePickerContentInner ref={forwardedRef} layer={layer} {...rest} />
      </RadixPopover.Portal>
    );
  },
);
DatePickerContent.displayName = 'DatePicker.Content';

// =============================================================================
// Export
// =============================================================================

export const DatePicker = {
  Root: DatePickerRoot,
  Trigger: DatePickerTrigger,
  Input: DatePickerInput,
  Icon: DatePickerIcon,
  Content: DatePickerContent,
};
