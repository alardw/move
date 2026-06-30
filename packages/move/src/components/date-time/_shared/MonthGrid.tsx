'use client';
// Generated from Calendar.spec.ts — shared MonthGrid
// Provenance: original-components/date-time/_shared/MonthGrid.tsx

import * as React from 'react';
import { getMonthGrid, getWeekDayNames, getWeekNumber, addMonths } from './dateUtils';
import { useCalendarContext } from './CalendarContext';
import { DayCell } from './DayCell';
import styles from './MonthGrid.module.css';

export interface MonthGridProps {
  className?: string;
}

export function MonthGrid({ className }: MonthGridProps) {
  const ctx = useCalendarContext();
  const {
    displayMonth,
    locale,
    weekStartsOn,
    numberOfMonths,
    showWeekNumbers,
    fixedWeeks,
    focusedDate,
    setFocusedDate,
    setDisplayMonth,
  } = ctx;

  const weekDayNames = React.useMemo(
    () => getWeekDayNames(locale, 'short', weekStartsOn),
    [locale, weekStartsOn],
  );

  const months = React.useMemo(() => {
    return Array.from({ length: numberOfMonths }, (_, i) => {
      const month = addMonths(displayMonth, i);
      return {
        date: month,
        grid: getMonthGrid(month.getFullYear(), month.getMonth(), weekStartsOn, fixedWeeks),
      };
    });
  }, [displayMonth, numberOfMonths, weekStartsOn, fixedWeeks]);

  const handleGridKeyDown = (e: React.KeyboardEvent) => {
    if (!focusedDate) return;

    let next: Date | null = null;

    switch (e.key) {
      case 'ArrowRight':
        next = new Date(focusedDate);
        next.setDate(next.getDate() + 1);
        break;
      case 'ArrowLeft':
        next = new Date(focusedDate);
        next.setDate(next.getDate() - 1);
        break;
      case 'ArrowDown':
        next = new Date(focusedDate);
        next.setDate(next.getDate() + 7);
        break;
      case 'ArrowUp':
        next = new Date(focusedDate);
        next.setDate(next.getDate() - 7);
        break;
      case 'PageDown':
        e.preventDefault();
        next = new Date(focusedDate);
        next.setMonth(next.getMonth() + 1);
        break;
      case 'PageUp':
        e.preventDefault();
        next = new Date(focusedDate);
        next.setMonth(next.getMonth() - 1);
        break;
      case 'Home':
        e.preventDefault();
        next = new Date(focusedDate);
        next.setDate(1);
        break;
      case 'End':
        e.preventDefault();
        next = new Date(focusedDate);
        next.setMonth(next.getMonth() + 1);
        next.setDate(0);
        break;
      default:
        return;
    }

    if (next) {
      e.preventDefault();
      setFocusedDate(next);
      // Auto-navigate if focused date moves outside displayed range
      const firstDisplayed = months[0].date;
      const lastDisplayed = addMonths(months[months.length - 1].date, 1);
      if (next < firstDisplayed || next >= lastDisplayed) {
        setDisplayMonth(new Date(next.getFullYear(), next.getMonth(), 1));
      }
    }
  };

  return (
    <div className={`${numberOfMonths > 1 ? styles.monthsContainer : ''} ${className ?? ''}`}>
      {months.map((m) => (
        <div
          key={`${m.date.getFullYear()}-${m.date.getMonth()}`}
          role="grid"
          aria-label={new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
            m.date,
          )}
          className={styles.grid}
          onKeyDown={handleGridKeyDown}
        >
          {/* Weekday headers */}
          <div
            className={styles.weekRow}
            role="row"
            {...(showWeekNumbers ? { 'data-has-week-numbers': '' } : {})}
          >
            {showWeekNumbers && <div className={styles.weekNumber} />}
            {weekDayNames.map((name, i) => (
              <div key={i} className={styles.weekDayHeader} role="columnheader" aria-label={name}>
                {name}
              </div>
            ))}
          </div>

          {/* Week rows */}
          {m.grid.map((week, wi) => (
            <div
              key={wi}
              className={styles.weekRow}
              role="row"
              {...(showWeekNumbers ? { 'data-has-week-numbers': '' } : {})}
            >
              {showWeekNumbers && <div className={styles.weekNumber}>{getWeekNumber(week[0])}</div>}
              {week.map((day, di) => (
                <DayCell key={di} date={day} referenceMonth={m.date} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
