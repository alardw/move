'use client';
// Generated from Calendar.spec.ts — shared MonthGrid
// Provenance: original-components/date-time/_shared/MonthGrid.tsx

import * as React from 'react';
import { getMonthGrid, getWeekDayNames, getWeekNumber, addMonths } from './dateUtils';
import { useCalendarContext } from './CalendarContext';
import { mergeSlotProps } from '../../../engine';
import type { SlotProps } from '../../../engine';
import { DayCell } from './DayCell';
import styles from './MonthGrid.module.css';

/**
 * Per-slot overrides, mirroring `CalendarNavSp`. Calendar presents Nav and Grid
 * as peers, so they expose the same kind of surface: the nav's buttons, the
 * grid's structural rows and headers.
 */
export interface MonthGridSp {
  /** The `role="grid"` element for one month. */
  grid?: SlotProps;
  /** The weekday-name header row. */
  weekDayRow?: SlotProps;
  /** A single weekday-name cell. */
  weekDayHeader?: SlotProps;
  /** A row of day cells. */
  weekRow?: SlotProps;
  /** The week-number gutter cell, when `showWeekNumbers` is on. */
  weekNumber?: SlotProps;
}

export interface MonthGridProps {
  className?: string;
  sp?: MonthGridSp;
}

export function MonthGrid({ className, sp }: MonthGridProps) {
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
    entryDate,
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
    // Navigate from the entry day when nothing has been focused yet — arriving
    // by Tab (or a programmatic focus from DatePicker) lands on the entry cell
    // without setting focusedDate, and bailing here left arrows dead.
    const from = focusedDate ?? entryDate;
    if (!from) return;

    // Every surviving branch assigns; `default` returns, so there is no unset path.
    let next: Date;

    switch (e.key) {
      case 'ArrowRight':
        next = new Date(from);
        next.setDate(next.getDate() + 1);
        break;
      case 'ArrowLeft':
        next = new Date(from);
        next.setDate(next.getDate() - 1);
        break;
      case 'ArrowDown':
        next = new Date(from);
        next.setDate(next.getDate() + 7);
        break;
      case 'ArrowUp':
        next = new Date(from);
        next.setDate(next.getDate() - 7);
        break;
      case 'PageDown':
        e.preventDefault();
        next = new Date(from);
        next.setMonth(next.getMonth() + 1);
        break;
      case 'PageUp':
        e.preventDefault();
        next = new Date(from);
        next.setMonth(next.getMonth() - 1);
        break;
      case 'Home':
        e.preventDefault();
        next = new Date(from);
        next.setDate(1);
        break;
      case 'End':
        e.preventDefault();
        next = new Date(from);
        next.setMonth(next.getMonth() + 1);
        next.setDate(0);
        break;
      default:
        return;
    }

    e.preventDefault();
    setFocusedDate(next);
    // Auto-navigate if focused date moves outside displayed range
    const firstDisplayed = months[0].date;
    const lastDisplayed = addMonths(months[months.length - 1].date, 1);
    if (next < firstDisplayed || next >= lastDisplayed) {
      setDisplayMonth(new Date(next.getFullYear(), next.getMonth(), 1));
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
          onKeyDown={handleGridKeyDown}
          {...mergeSlotProps({ className: styles.grid }, sp?.grid)}
        >
          {/* Weekday headers */}
          <div
            role="row"
            {...(showWeekNumbers ? { 'data-has-week-numbers': '' } : {})}
            {...mergeSlotProps({ className: styles.weekRow }, sp?.weekDayRow)}
          >
            {showWeekNumbers && (
              <div {...mergeSlotProps({ className: styles.weekNumber }, sp?.weekNumber)} />
            )}
            {weekDayNames.map((name, i) => (
              <div
                key={i}
                role="columnheader"
                aria-label={name}
                {...mergeSlotProps({ className: styles.weekDayHeader }, sp?.weekDayHeader)}
              >
                {name}
              </div>
            ))}
          </div>

          {/* Week rows */}
          {m.grid.map((week, wi) => (
            <div
              key={wi}
              role="row"
              {...(showWeekNumbers ? { 'data-has-week-numbers': '' } : {})}
              {...mergeSlotProps({ className: styles.weekRow }, sp?.weekRow)}
            >
              {showWeekNumbers && (
                <div {...mergeSlotProps({ className: styles.weekNumber }, sp?.weekNumber)}>
                  {getWeekNumber(week[0])}
                </div>
              )}
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
