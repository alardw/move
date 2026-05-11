'use client';
// Generated from Calendar.spec.ts (schemaVersion: 6, specHash: 7dc1c820)
// Provenance: original-components/calendar/Calendar/Calendar.tsx

import * as React from 'react';
import { CalendarContext } from '../_shared/CalendarContext';
import { CalendarNav } from '../_shared/CalendarNav';
import { MonthGrid } from '../_shared/MonthGrid';
import { useCalendar } from './useCalendar';
import type { UseCalendarOptions } from './useCalendar';
import type {
  CalendarEvent,
  CalendarConstraints,
  SelectionMode,
  DateRange,
  RenderDayCell,
  RenderEvent,
} from '../_shared/types';
import type { CalendarLabels } from '../_shared/CalendarContext';
import type { CalendarNavSp } from '../_shared/CalendarNav';
import styles from './Calendar.module.css';

// ============================================================================
// Root
// ============================================================================

export interface CalendarRootProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

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

  // Labels
  labels?: CalendarLabels;
}

const CalendarRoot: React.FC<CalendarRootProps> = ({
  children,
  className,
  style,
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
  labels,
}) => {
  const calendarOptions: UseCalendarOptions = {
    mode,
    value: value as any,
    defaultValue: defaultValue as any,
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
    labels,
  } as UseCalendarOptions;

  const ctx = useCalendar(calendarOptions);

  const hasEvents = Array.isArray(events) && events.length > 0;

  return (
    <CalendarContext.Provider value={ctx}>
      <div
        className={`${styles.root} ${className ?? ''}`}
        style={style}
        data-has-events={hasEvents ? '' : undefined}
      >
        {children}
      </div>
    </CalendarContext.Provider>
  );
};
CalendarRoot.displayName = 'Calendar.Root';

// ============================================================================
// Nav (thin wrapper around shared CalendarNav)
// ============================================================================

export interface CalendarNavProps {
  className?: string;
  sp?: CalendarNavSp;
}

const CalendarNavComponent: React.FC<CalendarNavProps> = ({ className, sp }) => {
  return <CalendarNav className={className} sp={sp} />;
};
CalendarNavComponent.displayName = 'Calendar.Nav';

// ============================================================================
// Grid (thin wrapper around shared MonthGrid)
// ============================================================================

export interface CalendarGridProps {
  className?: string;
}

const CalendarGridComponent: React.FC<CalendarGridProps> = ({ className }) => {
  return <MonthGrid className={className} />;
};
CalendarGridComponent.displayName = 'Calendar.Grid';

// ============================================================================
// Export
// ============================================================================

export const Calendar = {
  Root: CalendarRoot,
  Nav: CalendarNavComponent,
  Grid: CalendarGridComponent,
};
