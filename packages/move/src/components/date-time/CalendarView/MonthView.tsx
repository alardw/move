'use client';
// Generated from CalendarView.spec.ts — MonthView sub-component
// Provenance: original-components/date-time/CalendarView/MonthView.tsx

import * as React from 'react';
import {
  getMonthGrid,
  getWeekDayNames,
  isSameDay,
  isSameMonth,
  isToday as checkIsToday,
} from '../_shared/dateUtils';
import type { CalendarEvent, RenderEvent } from '../_shared/types';
import { EventSlot } from '../_shared/EventSlot';
import styles from './MonthView.module.css';

export interface MonthViewProps {
  date: Date;
  events: CalendarEvent[];
  locale?: string;
  weekStartsOn?: number;
  maxEventsPerCell?: number;
  renderEvent?: RenderEvent;
  onEventClick?: (event: CalendarEvent, e: React.MouseEvent) => void;
  onDayClick?: (date: Date, e: React.MouseEvent) => void;
  moreLabel?: (count: number) => string;
}

export function MonthView({
  date,
  events,
  locale = 'en-US',
  weekStartsOn = 0,
  maxEventsPerCell = 3,
  renderEvent,
  onEventClick,
  onDayClick,
  moreLabel = (count: number) => `+${count} more`,
}: MonthViewProps) {
  const grid = React.useMemo(
    () => getMonthGrid(date.getFullYear(), date.getMonth(), weekStartsOn),
    [date, weekStartsOn],
  );

  const weekDayNames = React.useMemo(
    () => getWeekDayNames(locale, 'short', weekStartsOn),
    [locale, weekStartsOn],
  );

  const getEventsForDate = React.useCallback(
    (d: Date) => events.filter((e) => isSameDay(e.start, d)),
    [events],
  );

  return (
    <div className={styles.monthView} data-testid="month-view">
      <div className={styles.weekHeader}>
        {weekDayNames.map((name, i) => (
          <div key={i} className={styles.weekHeaderCell}>
            {name}
          </div>
        ))}
      </div>

      {grid.map((week, wi) => (
        <div key={wi} className={styles.weekRow}>
          {week.map((day, di) => {
            const dayEvts = getEventsForDate(day);
            const outside = !isSameMonth(day, date);
            const today = checkIsToday(day);
            const visibleEvents = dayEvts.slice(0, maxEventsPerCell);
            const overflowCount = dayEvts.length - maxEventsPerCell;

            return (
              <div
                key={di}
                className={styles.dayCell}
                {...(today ? { 'data-today': '' } : {})}
                {...(outside ? { 'data-outside': '' } : {})}
                onClick={(e) => onDayClick?.(day, e)}
              >
                <span className={styles.dayNumber} {...(today ? { 'data-today': '' } : {})}>
                  {day.getDate()}
                </span>
                <div className={styles.dayEvents}>
                  {visibleEvents.map((evt) => (
                    <EventSlot
                      key={evt.id}
                      event={evt}
                      locale={locale}
                      view="month"
                      isCompact
                      renderEvent={renderEvent}
                      onClick={onEventClick}
                    />
                  ))}
                  {overflowCount > 0 && (
                    <button className={styles.moreButton} onClick={(e) => e.stopPropagation()}>
                      {moreLabel(overflowCount)}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
