'use client';

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
    renderDayCell,
    renderEvent,
    labels,
  } as UseCalendarOptions;

  const ctx = useCalendar(calendarOptions);

  return (
    <CalendarContext.Provider value={ctx}>
      <div className={`${styles.root} ${className ?? ''}`} style={style}>
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
  sp?: import('../_shared/CalendarNav').CalendarNavSp;
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
