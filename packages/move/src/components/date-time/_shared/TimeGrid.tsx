'use client';
// Generated from CalendarView.spec.ts — shared TimeGrid
// Provenance: original-components/date-time/_shared/TimeGrid.tsx

import * as React from 'react';
import { getTimeSlots, isSameDay, isToday as checkIsToday } from './dateUtils';
import type { CalendarEvent, RenderEvent } from './types';
import { EventSlot } from './EventSlot';
import styles from './TimeGrid.module.css';

export interface TimeGridProps {
  dates: Date[];
  events: CalendarEvent[];
  locale?: string;
  startHour?: number;
  endHour?: number;
  slotHeight?: string;
  slotInterval?: 30 | 60;
  renderEvent?: RenderEvent;
  onEventClick?: (event: CalendarEvent, e: React.MouseEvent) => void;
  onSlotClick?: (date: Date, e: React.MouseEvent) => void;
  showHeaders?: boolean;
  className?: string;
}

interface PositionedEvent {
  event: CalendarEvent;
  top: number;
  height: number;
  column: number;
  totalColumns: number;
}

function computeEventPositions(
  events: CalendarEvent[],
  startHour: number,
  _endHour: number,
  slotHeight: number = 48,
  slotInterval: number = 60,
): PositionedEvent[] {
  const sorted = [...events]
    .filter((e) => !e.allDay)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  // px per minute: each slot row is slotInterval minutes tall
  const pxPerMin = slotHeight / slotInterval;

  // Build entries with time ranges
  const entries = sorted.map((event) => {
    const startMin = (event.start.getHours() - startHour) * 60 + event.start.getMinutes();
    const endDate = event.end ?? new Date(event.start.getTime() + 60 * 60000);
    const endMin = (endDate.getHours() - startHour) * 60 + endDate.getMinutes();
    const top = startMin * pxPerMin;
    const height = Math.max((endMin - startMin) * pxPerMin, 20);
    return { event, startMin, endMin, top, height, column: 0, totalColumns: 1 };
  });

  // Group into overlapping clusters
  const clusters: (typeof entries)[] = [];
  for (const entry of entries) {
    const lastCluster = clusters[clusters.length - 1];
    if (lastCluster) {
      const clusterEnd = Math.max(...lastCluster.map((e) => e.endMin));
      if (entry.startMin < clusterEnd) {
        lastCluster.push(entry);
        continue;
      }
    }
    clusters.push([entry]);
  }

  // Assign columns within each cluster
  for (const cluster of clusters) {
    const columns: { end: number }[] = [];
    for (const entry of cluster) {
      let col = columns.findIndex((c) => c.end <= entry.startMin);
      if (col === -1) {
        col = columns.length;
        columns.push({ end: entry.endMin });
      } else {
        columns[col].end = entry.endMin;
      }
      entry.column = col;
    }
    const totalCols = columns.length || 1;
    for (const entry of cluster) {
      entry.totalColumns = totalCols;
    }
  }

  return entries.map(({ event, top, height, column, totalColumns }) => ({
    event,
    top,
    height,
    column,
    totalColumns,
  }));
}

export function TimeGrid({
  dates,
  events,
  locale = 'en-US',
  startHour = 0,
  endHour = 24,
  slotHeight: slotHeightProp,
  slotInterval = 60,
  renderEvent,
  onEventClick,
  onSlotClick,
  showHeaders = true,
  className,
}: TimeGridProps) {
  const slots = React.useMemo(
    () => getTimeSlots(startHour, endHour, slotInterval),
    [startHour, endHour, slotInterval],
  );

  const dayEvents = React.useMemo(() => {
    return dates.map((date) => ({
      date,
      events: events.filter((e) => isSameDay(e.start, date)),
    }));
  }, [dates, events]);

  // Measure actual rendered row-to-row distance for accurate event positioning.
  const slotRef0 = React.useRef<HTMLDivElement>(null);
  const slotRef1 = React.useRef<HTMLDivElement>(null);
  const [slotHeight, setSlotHeight] = React.useState(48);
  React.useLayoutEffect(() => {
    if (slotRef0.current && slotRef1.current) {
      const r0 = slotRef0.current.getBoundingClientRect();
      const r1 = slotRef1.current.getBoundingClientRect();
      setSlotHeight(r1.top - r0.top);
    } else if (slotRef0.current) {
      setSlotHeight(slotRef0.current.getBoundingClientRect().height);
    }
  }, []);

  // Now indicator
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`${styles.timeGrid} ${className ?? ''}`}
      style={
        slotHeightProp
          ? ({ '--move-calendar-timegrid-slot-height': slotHeightProp } as React.CSSProperties)
          : undefined
      }
    >
      {/* Column headers */}
      {showHeaders && dates.length > 1 && (
        <>
          <div />
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}>
            {dates.map((date, i) => (
              <div
                key={i}
                className={styles.dayColumnHeader}
                {...(checkIsToday(date) ? { 'data-today': '' } : {})}
              >
                {new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric' }).format(date)}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Time slots */}
      {slots.map((slot, si) => {
        const isHalfHourLabel = slot.getMinutes() !== 0;
        const isHalfHourBorder = (slot.getMinutes() + slotInterval) % 60 !== 0;
        return (
          <React.Fragment key={si}>
            <div
              className={styles.timeLabel}
              {...(si === 0 ? { 'data-first': '' } : {})}
              {...(isHalfHourLabel ? { 'data-half-hour': '' } : {})}
            >
              {new Intl.DateTimeFormat(locale, { hour: 'numeric' }).format(slot)}
            </div>
            <div
              ref={si === 0 ? slotRef0 : si === 1 ? slotRef1 : undefined}
              className={styles.timeSlot}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${dates.length}, 1fr)`,
              }}
              {...(si === 0 ? { 'data-first': '' } : {})}
              {...(isHalfHourBorder ? { 'data-half-hour': '' } : {})}
            >
              {dates.map((date, di) => {
                const dayEvts = dayEvents[di];
                const isFirst = si === 0;
                const positioned = isFirst
                  ? computeEventPositions(
                      dayEvts.events,
                      startHour,
                      endHour,
                      slotHeight,
                      slotInterval,
                    )
                  : [];

                const handleSlotClick = onSlotClick
                  ? (e: React.MouseEvent) => {
                      const clicked = new Date(date);
                      clicked.setHours(slot.getHours(), slot.getMinutes(), 0, 0);
                      onSlotClick(clicked, e);
                    }
                  : undefined;

                return (
                  <div
                    key={di}
                    className={styles.dayColumn}
                    onClick={handleSlotClick}
                    {...(onSlotClick ? { 'data-clickable': '' } : {})}
                  >
                    {/* Now indicator */}
                    {isFirst &&
                      checkIsToday(date) &&
                      (() => {
                        const minutesSinceStart =
                          (now.getHours() - startHour) * 60 + now.getMinutes();
                        const topPx = minutesSinceStart * (slotHeight / slotInterval);
                        const totalHeight =
                          (((endHour - startHour) * 60) / slotInterval) * slotHeight;
                        if (topPx >= 0 && topPx <= totalHeight) {
                          return <div className={styles.nowIndicator} style={{ top: topPx }} />;
                        }
                        return null;
                      })()}
                    {/* Events (only rendered in first slot row, absolutely positioned) */}
                    {isFirst &&
                      positioned.map((pe) => {
                        const width = `${100 / pe.totalColumns}%`;
                        const left = `${(pe.column / pe.totalColumns) * 100}%`;
                        return (
                          <div
                            key={pe.event.id}
                            className={styles.positionedEvent}
                            style={{
                              top: pe.top + 2,
                              height: pe.height - 4,
                              width,
                              left,
                            }}
                          >
                            <EventSlot
                              event={pe.event}
                              locale={locale}
                              view="time"
                              isCompact={pe.height < 30}
                              renderEvent={renderEvent}
                              onClick={onEventClick}
                              style={{ height: '100%' }}
                            />
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
