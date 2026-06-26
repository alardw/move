// Generated from CalendarView.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
// Provenance: original-components/date-time/CalendarView/useCalendarView.ts

import React, { useCallback, useMemo } from 'react';
import { useControlledState } from '../../../engine';
import type { CalendarEvent, CalendarViewMode, RenderEvent } from '../_shared/types';
import {
  addDays,
  addMonths,
  getWeekRange,
  getLocaleFirstDay,
} from '../_shared/dateUtils';

export interface CalendarViewLabels {
  today?: string;
  previous?: string;
  next?: string;
  calendarView?: string;
  day?: string;
  week?: string;
  month?: string;
  agenda?: string;
  allDay?: string;
  noEvents?: string;
  more?: (count: number) => string;
}

const DEFAULT_LABELS: Required<CalendarViewLabels> = {
  today: 'Today',
  previous: 'Previous',
  next: 'Next',
  calendarView: 'Calendar view',
  day: 'Day',
  week: 'Week',
  month: 'Month',
  agenda: 'Agenda',
  allDay: 'All day',
  noEvents: 'No events in this period',
  more: (count: number) => `+${count} more`,
};

export interface UseCalendarViewOptions {
  view?: CalendarViewMode;
  defaultView?: CalendarViewMode;
  onViewChange?: (view: CalendarViewMode) => void;
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  events?: CalendarEvent[];
  locale?: string;
  weekStartsOn?: number;
  startHour?: number;
  endHour?: number;
  slotHeight?: string;
  slotInterval?: 30 | 60;
  maxEventsPerCell?: number;
  renderEvent?: RenderEvent;
  onEventClick?: (event: CalendarEvent, e: React.MouseEvent) => void;
  onSlotClick?: (date: Date, e: React.MouseEvent) => void;
  onDayClick?: (date: Date, e: React.MouseEvent) => void;
  onAllDayClick?: (date: Date, e: React.MouseEvent) => void;
  /** Always show the all-day section in day/week views */
  showAllDay?: boolean;
  labels?: CalendarViewLabels;
}

export interface UseCalendarViewReturn {
  view: CalendarViewMode;
  setView: (view: CalendarViewMode) => void;
  date: Date;
  setDate: (date: Date) => void;
  events: CalendarEvent[];
  locale: string;
  weekStartsOn: number;
  startHour: number;
  endHour: number;
  slotHeight?: string;
  slotInterval: 30 | 60;
  maxEventsPerCell: number;
  renderEvent?: RenderEvent;
  onEventClick?: (event: CalendarEvent, e: React.MouseEvent) => void;
  onSlotClick?: (date: Date, e: React.MouseEvent) => void;
  onDayClick?: (date: Date, e: React.MouseEvent) => void;
  onAllDayClick?: (date: Date, e: React.MouseEvent) => void;
  showAllDay: boolean;
  labels: Required<CalendarViewLabels>;
  title: string;
  goToToday: () => void;
  goToPrev: () => void;
  goToNext: () => void;
}

export function useCalendarView(
  options: UseCalendarViewOptions = {}
): UseCalendarViewReturn {
  const {
    events = [],
    locale = 'en-US',
    weekStartsOn: weekStartsOnProp,
    startHour = 0,
    endHour = 24,
    slotHeight,
    slotInterval = 60,
    maxEventsPerCell = 3,
    renderEvent,
    onEventClick,
    onSlotClick,
    onDayClick,
    onAllDayClick,
    showAllDay: showAllDayProp = false,
    labels: labelsProp,
  } = options;

  const labels = useMemo(
    () => ({ ...DEFAULT_LABELS, ...labelsProp }),
    [labelsProp]
  );

  const weekStartsOn = weekStartsOnProp ?? getLocaleFirstDay(locale);

  const [view, setView] = useControlledState<CalendarViewMode>({
    value: options.view,
    defaultValue: options.defaultView ?? 'month',
    onChange: options.onViewChange,
  });

  const [date, setDate] = useControlledState<Date>({
    value: options.date,
    defaultValue: options.defaultDate ?? new Date(),
    onChange: options.onDateChange,
  });

  const title = useMemo(() => {
    switch (view) {
      case 'day':
        return new Intl.DateTimeFormat(locale, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).format(date);
      case 'week': {
        const { start, end } = getWeekRange(date, weekStartsOn);
        const startFmt = new Intl.DateTimeFormat(locale, {
          month: 'short',
          day: 'numeric',
        }).format(start);
        const endFmt = new Intl.DateTimeFormat(locale, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(end);
        return `${startFmt} \u2013 ${endFmt}`;
      }
      case 'month':
        return new Intl.DateTimeFormat(locale, {
          month: 'long',
          year: 'numeric',
        }).format(date);
      case 'agenda':
        return new Intl.DateTimeFormat(locale, {
          month: 'long',
          year: 'numeric',
        }).format(date);
      default:
        return '';
    }
  }, [view, date, locale, weekStartsOn]);

  const goToToday = useCallback(() => {
    setDate(new Date());
  }, [setDate]);

  const goToPrev = useCallback(() => {
    switch (view) {
      case 'day':
        setDate(addDays(date, -1));
        break;
      case 'week':
        setDate(addDays(date, -7));
        break;
      case 'month':
      case 'agenda':
        setDate(addMonths(date, -1));
        break;
    }
  }, [view, date, setDate]);

  const goToNext = useCallback(() => {
    switch (view) {
      case 'day':
        setDate(addDays(date, 1));
        break;
      case 'week':
        setDate(addDays(date, 7));
        break;
      case 'month':
      case 'agenda':
        setDate(addMonths(date, 1));
        break;
    }
  }, [view, date, setDate]);

  return {
    view,
    setView,
    date,
    setDate,
    events,
    locale,
    weekStartsOn,
    startHour,
    endHour,
    slotHeight,
    slotInterval,
    maxEventsPerCell,
    renderEvent,
    onEventClick,
    onSlotClick,
    onDayClick,
    onAllDayClick,
    showAllDay: showAllDayProp,
    labels,
    title,
    goToToday,
    goToPrev,
    goToNext,
  };
}
