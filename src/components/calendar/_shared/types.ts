// Generated from Calendar.spec.ts & CalendarView.spec.ts — shared types
// Provenance: original-components/calendar/_shared/types.ts

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | (string & {});
  data?: Record<string, unknown>;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface CalendarConstraints {
  min?: Date;
  max?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[];
}

export type SelectionMode = 'single' | 'range' | 'multiple';

export type DayState =
  | 'selected'
  | 'range-start'
  | 'range-end'
  | 'in-range'
  | 'default';

export interface DayCellData {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isOutsideMonth: boolean;
  state: DayState;
  events: CalendarEvent[];
}

export type RenderDayCell = (
  date: Date,
  data: DayCellData
) => React.ReactNode;

export type RenderEvent = (
  event: CalendarEvent,
  context: { view?: string; isCompact?: boolean; isMultiDay?: boolean }
) => React.ReactNode;

export type CalendarViewMode = 'day' | 'week' | 'month' | 'agenda';
