'use client';
// Generated from Calendar.spec.ts — shared CalendarContext
// Provenance: original-components/date-time/_shared/CalendarContext.tsx

import * as React from 'react';
import type {
  CalendarEvent,
  CalendarConstraints,
  SelectionMode,
  DateRange,
  RenderDayCell,
  RenderEvent,
} from './types';

export interface CalendarLabels {
  previousMonth?: string;
  nextMonth?: string;
  selectMonth?: string;
  selectYear?: string;
}

export const DEFAULT_CALENDAR_LABELS: Required<CalendarLabels> = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  selectMonth: 'Select month',
  selectYear: 'Select year',
};

export interface CalendarContextValue {
  // Display state
  displayMonth: Date;
  setDisplayMonth: (date: Date) => void;

  // Selection
  mode: SelectionMode;
  value: Date | DateRange | Date[] | null;
  onSelect: (date: Date) => void;
  setRangeValue?: (range: DateRange | null) => void;

  // Events
  events: CalendarEvent[];
  getEventsForDate: (date: Date) => CalendarEvent[];

  // Config
  locale: string;
  weekStartsOn: number;
  constraints?: CalendarConstraints;
  numberOfMonths: number;
  showWeekNumbers: boolean;
  yearRange: number;
  fixedWeeks: boolean;

  // Renderers
  renderDayCell?: RenderDayCell;
  renderEvent?: RenderEvent;

  // Focus management
  focusedDate: Date | null;
  setFocusedDate: (date: Date | null) => void;

  // Labels
  labels: Required<CalendarLabels>;
}

export const CalendarContext = React.createContext<CalendarContextValue | null>(null);

export function useCalendarContext(): CalendarContextValue {
  const ctx = React.useContext(CalendarContext);
  if (!ctx) {
    throw new Error(
      'Calendar sub-components must be used within Calendar.Root or DatePicker.Root'
    );
  }
  return ctx;
}
