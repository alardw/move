'use client';
// Generated from CalendarView.spec.ts — WeekView sub-component
// Provenance: original-components/date-time/CalendarView/WeekView.tsx

import * as React from 'react';
import { getWeekRange, addDays, isSameDay, isToday as checkIsToday } from '../_shared/dateUtils';
import type { CalendarEvent, RenderEvent } from '../_shared/types';
import { TimeGrid } from '../_shared/TimeGrid';
import { EventSlot } from '../_shared/EventSlot';
import styles from './WeekView.module.css';

export interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
  locale?: string;
  weekStartsOn?: number;
  startHour?: number;
  endHour?: number;
  slotHeight?: string;
  slotInterval?: 30 | 60;
  renderEvent?: RenderEvent;
  onEventClick?: (event: CalendarEvent, e: React.MouseEvent) => void;
  onSlotClick?: (date: Date, e: React.MouseEvent) => void;
  onAllDayClick?: (date: Date, e: React.MouseEvent) => void;
  /** Always show the all-day section (e.g. so users can add new all-day items) */
  showAllDay?: boolean;
  allDayLabel?: string;
}

export function WeekView({
  date,
  events,
  locale = 'en-US',
  weekStartsOn = 0,
  startHour = 0,
  endHour = 24,
  slotHeight,
  slotInterval,
  renderEvent,
  onEventClick,
  onSlotClick,
  onAllDayClick,
  showAllDay = false,
  allDayLabel = 'All day',
}: WeekViewProps) {
  const { start } = getWeekRange(date, weekStartsOn);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  const allDayEvents = events.filter(
    (e) => e.allDay && weekDates.some((d) => isSameDay(e.start, d)),
  );

  const timedEvents = events.filter(
    (e) => !e.allDay && weekDates.some((d) => isSameDay(e.start, d)),
  );

  const showAllDaySection = showAllDay || allDayEvents.length > 0;

  return (
    <div className={styles.weekView} data-testid="week-view">
      {/* Day headers */}
      <div className={styles.dayHeaders}>
        <div />
        {weekDates.map((d, i) => (
          <div
            key={i}
            className={styles.dayHeaderCell}
            {...(checkIsToday(d) ? { 'data-today': '' } : {})}
          >
            {new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric' }).format(d)}
          </div>
        ))}
      </div>

      {/* All-day events */}
      {showAllDaySection && (
        <div className={styles.allDaySection}>
          <span className={styles.allDayLabel}>{allDayLabel}</span>
          <div className={styles.allDayGrid} style={{ gridTemplateColumns: `repeat(${7}, 1fr)` }}>
            {weekDates.map((d, i) => {
              const evts = allDayEvents.filter((e) => isSameDay(e.start, d));
              return (
                <div
                  key={i}
                  className={
                    evts.length === 0 && onAllDayClick ? styles.allDaySlotEmpty : undefined
                  }
                  {...(evts.length === 0 && onAllDayClick
                    ? {
                        role: 'button',
                        tabIndex: 0,
                        onClick: (e: React.MouseEvent) => onAllDayClick(d, e),
                        onKeyDown: (e: React.KeyboardEvent) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onAllDayClick(d, e as unknown as React.MouseEvent);
                          }
                        },
                      }
                    : {})}
                >
                  {evts.map((evt) => (
                    <EventSlot
                      key={evt.id}
                      event={evt}
                      locale={locale}
                      view="week"
                      isCompact
                      renderEvent={renderEvent}
                      onClick={onEventClick}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <TimeGrid
        dates={weekDates}
        events={timedEvents}
        locale={locale}
        startHour={startHour}
        endHour={endHour}
        slotHeight={slotHeight}
        slotInterval={slotInterval}
        renderEvent={renderEvent}
        onEventClick={onEventClick}
        onSlotClick={onSlotClick}
        showHeaders={false}
      />
    </div>
  );
}
