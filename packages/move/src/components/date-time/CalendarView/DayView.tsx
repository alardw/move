'use client';
// Generated from CalendarView.spec.ts — DayView sub-component
// Provenance: original-components/date-time/CalendarView/DayView.tsx

import * as React from 'react';
import { isSameDay } from '../_shared/dateUtils';
import type { CalendarEvent, RenderEvent } from '../_shared/types';
import { TimeGrid } from '../_shared/TimeGrid';
import { EventSlot } from '../_shared/EventSlot';
import styles from './DayView.module.css';

export interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  locale?: string;
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

export function DayView({
  date,
  events,
  locale = 'en-US',
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
}: DayViewProps) {
  const dayEvents = events.filter((e) => isSameDay(e.start, date));
  const allDayEvents = dayEvents.filter((e) => e.allDay);
  const timedEvents = dayEvents.filter((e) => !e.allDay);
  const showAllDaySection = showAllDay || allDayEvents.length > 0;

  return (
    <div className={styles.dayView} data-testid="day-view">
      {showAllDaySection && (
        <div className={styles.allDaySection}>
          <span className={styles.allDayLabel}>{allDayLabel}</span>
          <div
            className={styles.allDayEvents}
            {...(allDayEvents.length === 0 && onAllDayClick
              ? {
                  role: 'button',
                  tabIndex: 0,
                  onClick: (e: React.MouseEvent) => onAllDayClick(date, e),
                  onKeyDown: (e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onAllDayClick(date, e as unknown as React.MouseEvent);
                    }
                  },
                }
              : {})}
          >
            {allDayEvents.map((evt) => (
              <EventSlot
                key={evt.id}
                event={evt}
                locale={locale}
                view="day"
                renderEvent={renderEvent}
                onClick={onEventClick}
              />
            ))}
          </div>
        </div>
      )}
      <TimeGrid
        dates={[date]}
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
