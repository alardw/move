'use client';
// Generated from Calendar.spec.ts — shared DayCell
// Provenance: original-components/date-time/_shared/DayCell.tsx

import * as React from 'react';
import { isSameDay, isToday, isSameMonth, isDateDisabled, isWithinRange } from './dateUtils';
import { useCalendarContext } from './CalendarContext';
import { useAnimations, scaleDown } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import type { DayState, DayCellData, DateRange } from './types';
import styles from './DayCell.module.css';

export interface DayCellProps {
  date: Date;
  referenceMonth: Date;
  className?: string;
}

function getDayState(
  date: Date,
  mode: string,
  value: Date | DateRange | Date[] | null
): DayState {
  if (!value) return 'default';

  if (mode === 'single') {
    return isSameDay(date, value as Date) ? 'selected' : 'default';
  }

  if (mode === 'range') {
    const range = value as DateRange;
    if (!range.from) return 'default';
    if (!range.to) {
      return isSameDay(date, range.from) ? 'selected' : 'default';
    }
    if (isSameDay(date, range.from)) return 'range-start';
    if (isSameDay(date, range.to)) return 'range-end';
    if (isWithinRange(date, range.from, range.to)) return 'in-range';
    return 'default';
  }

  if (mode === 'multiple') {
    const dates = value as Date[];
    return dates.some((d) => isSameDay(date, d)) ? 'selected' : 'default';
  }

  return 'default';
}

export const DayCell = React.memo(function DayCell({
  date,
  referenceMonth,
  className,
}: DayCellProps) {
  const ctx = useCalendarContext();
  const {
    mode,
    value,
    onSelect,
    constraints,
    getEventsForDate,
    renderDayCell,
    focusedDate,
    setFocusedDate,
  } = ctx;

  const today = isToday(date);
  const outside = !isSameMonth(date, referenceMonth);
  const disabled = isDateDisabled(date, constraints);
  const state = getDayState(date, mode, value);
  const isSelected = state !== 'default' && state !== 'in-range';
  const dayEvents = getEventsForDate(date);
  const isFocused = focusedDate ? isSameDay(date, focusedDate) : false;

  const cellRef = React.useRef<HTMLButtonElement | null>(null);

  const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
    { trigger: 'Root.press', sequence: [{ animation: scaleDown }] },
  ];
  const refs = React.useMemo(() => ({ Root: cellRef as React.RefObject<HTMLElement | null> }), []);
  const { handlers } = useAnimations(DEFAULT_ANIMATIONS, refs);

  React.useEffect(() => {
    if (isFocused && cellRef.current) {
      cellRef.current.focus();
    }
  }, [isFocused]);

  const handleClick = () => {
    if (disabled) return;
    onSelect(date);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(date);
    }
  };

  const cellData: DayCellData = {
    date,
    isToday: today,
    isSelected,
    isDisabled: disabled,
    isOutsideMonth: outside,
    state,
    events: dayEvents,
  };

  if (renderDayCell) {
    return (
      <button
        ref={cellRef}
        type="button"
        role="gridcell"
        tabIndex={isFocused ? 0 : -1}
        aria-selected={isSelected}
        aria-disabled={disabled}
        data-state={state}
        {...(today ? { 'data-today': '' } : {})}
        {...(outside ? { 'data-outside': '' } : {})}
        {...(disabled ? { 'data-disabled': '' } : {})}
        className={`${styles.dayCell} ${className ?? ''}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseDown={() => { if (!disabled) handlers.Root?.onMouseDown?.(); }}
        onMouseUp={() => { if (!disabled) handlers.Root?.onMouseUp?.(); }}
        onMouseLeave={() => { if (!disabled) handlers.Root?.onMouseLeave?.(); }}
        onFocus={() => setFocusedDate(date)}
      >
        {renderDayCell(date, cellData)}
      </button>
    );
  }

  return (
    <button
      ref={cellRef}
      type="button"
      role="gridcell"
      tabIndex={isFocused ? 0 : -1}
      aria-selected={isSelected}
      aria-disabled={disabled}
      aria-label={date.toLocaleDateString()}
      data-state={state}
      {...(today ? { 'data-today': '' } : {})}
      {...(outside ? { 'data-outside': '' } : {})}
      {...(disabled ? { 'data-disabled': '' } : {})}
      className={`${styles.dayCell} ${className ?? ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={() => { if (!disabled) handlers.Root?.onMouseDown?.(); }}
      onMouseUp={() => { if (!disabled) handlers.Root?.onMouseUp?.(); }}
      onMouseLeave={() => { if (!disabled) handlers.Root?.onMouseLeave?.(); }}
      onFocus={() => setFocusedDate(date)}
    >
      <span className={styles.dayNumber}>{date.getDate()}</span>
      {dayEvents.length > 0 && (
        <span className={styles.dayEvents}>
          {dayEvents.slice(0, 3).map((evt) => (
            <span
              key={evt.id}
              className={styles.dayEventDot}
              style={
                evt.color && !['primary', 'success', 'warning', 'danger', 'info'].includes(evt.color)
                  ? { backgroundColor: evt.color }
                  : undefined
              }
              data-color={
                ['primary', 'success', 'warning', 'danger', 'info'].includes(evt.color ?? '')
                  ? evt.color
                  : undefined
              }
            />
          ))}
        </span>
      )}
    </button>
  );
});
