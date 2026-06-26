'use client';
// Generated from CalendarView.spec.ts — AgendaView sub-component
// Provenance: original-components/date-time/CalendarView/AgendaView.tsx

import * as React from 'react';
import { addDays, isSameDay, isToday as checkIsToday } from '../_shared/dateUtils';
import type { CalendarEvent, RenderEvent } from '../_shared/types';
import { EventSlot } from '../_shared/EventSlot';
import styles from './AgendaView.module.css';

export interface AgendaViewProps {
  startDate: Date;
  events: CalendarEvent[];
  locale?: string;
  daysToShow?: number;
  renderEvent?: RenderEvent;
  onEventClick?: (event: CalendarEvent, e: React.MouseEvent) => void;
  noEventsLabel?: string;
}

interface DayGroup {
  date: Date;
  events: CalendarEvent[];
}

export function AgendaView({
  startDate,
  events,
  locale = 'en-US',
  daysToShow = 30,
  renderEvent,
  onEventClick,
  noEventsLabel = 'No events in this period',
}: AgendaViewProps) {
  const dayGroups = React.useMemo(() => {
    const groups: DayGroup[] = [];
    for (let i = 0; i < daysToShow; i++) {
      const date = addDays(startDate, i);
      const dayEvts = events
        .filter((e) => isSameDay(e.start, date))
        .sort((a, b) => {
          if (a.allDay && !b.allDay) return -1;
          if (!a.allDay && b.allDay) return 1;
          return a.start.getTime() - b.start.getTime();
        });
      if (dayEvts.length > 0) {
        groups.push({ date, events: dayEvts });
      }
    }
    return groups;
  }, [startDate, events, daysToShow]);

  if (dayGroups.length === 0) {
    return (
      <div className={styles.agendaView} data-testid="agenda-view">
        <div className={styles.emptyMessage}>{noEventsLabel}</div>
      </div>
    );
  }

  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  const monthDayFormatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.agendaView} data-testid="agenda-view">
      {dayGroups.map(({ date, events: dayEvts }) => {
        const today = checkIsToday(date);
        return (
          <div key={date.toISOString()} className={styles.dayGroup}>
            <div className={styles.dayHeader}>
              <span
                className={styles.dayHeaderDate}
                {...(today ? { 'data-today': '' } : {})}
              >
                {date.getDate()}
              </span>
              <span
                className={styles.dayHeaderDay}
                {...(today ? { 'data-today': '' } : {})}
              >
                {weekdayFormatter.format(date)}, {monthDayFormatter.format(date)}
              </span>
            </div>
            <div className={styles.eventList}>
              {dayEvts.map((evt) => (
                <EventSlot
                  key={evt.id}
                  event={evt}
                  locale={locale}
                  view="agenda"
                  renderEvent={renderEvent}
                  onClick={onEventClick}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
