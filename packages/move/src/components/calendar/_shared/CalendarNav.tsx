'use client';
// Generated from Calendar.spec.ts — shared CalendarNav
// Provenance: original-components/calendar/_shared/CalendarNav.tsx

import * as React from 'react';
import { addMonths, formatMonth, getMonthNames } from './dateUtils';
import { useCalendarContext } from './CalendarContext';
import { Select } from '../../form/Select';
import { Button } from '../../core/Button';
import { Icon } from '../../../infrastructure/Icon';
import { snappy } from '../../../animation';
import styles from './CalendarNav.module.css';

export interface CalendarNavSp {
  prevButton?: React.HTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode };
  nextButton?: React.HTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode };
}

export interface CalendarNavProps {
  className?: string;
  sp?: CalendarNavSp;
}

export function CalendarNav({ className, sp }: CalendarNavProps) {
  const ctx = useCalendarContext();
  const { displayMonth, setDisplayMonth, locale, yearRange, labels } = ctx;

  const monthName = formatMonth(displayMonth, locale);
  const year = displayMonth.getFullYear();

  const monthNames = React.useMemo(() => getMonthNames(locale, 'long'), [locale]);

  const years = React.useMemo(() => {
    const start = year - yearRange;
    const end = year + yearRange;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [year, yearRange]);

  const goToPrevMonth = () => {
    setDisplayMonth(addMonths(displayMonth, -1));
  };

  const goToNextMonth = () => {
    setDisplayMonth(addMonths(displayMonth, 1));
  };

  // Measure the widest month name to fix the trigger width and prevent layout shift
  const [monthMinWidth, setMonthMinWidth] = React.useState<number | undefined>(undefined);
  const monthTriggerRef = React.useRef<HTMLButtonElement>(null);
  const monthValueRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const trigger = monthTriggerRef.current;
    const value = monthValueRef.current;
    if (!trigger || !value) return;

    // Compute the trigger's chrome (padding + icon + gap) by subtracting the
    // value span's width from the trigger's. Then measure each month name in
    // a detached probe element with the same font, and pick the widest.
    //
    // Why not write into `value` directly? Mutating React-owned DOM
    // (value.textContent = ...) puts React's vdom out of sync with the
    // real DOM. Future re-renders silently fail to update the displayed
    // month — picking a new month from the dropdown wouldn't refresh
    // the trigger's label. Probe is detached so React never sees it.
    const chrome =
      trigger.getBoundingClientRect().width - value.getBoundingClientRect().width;

    const computed = window.getComputedStyle(value);
    const probe = document.createElement('span');
    probe.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font:${computed.font}`;
    document.body.appendChild(probe);

    let maxText = 0;
    for (const name of monthNames) {
      probe.textContent = name;
      const w = probe.getBoundingClientRect().width;
      if (w > maxText) maxText = w;
    }

    document.body.removeChild(probe);
    setMonthMinWidth(Math.ceil(maxText + chrome));
  }, [monthNames]);

  const handleMonthChange = (value: string) => {
    const next = new Date(displayMonth);
    next.setMonth(Number(value));
    setDisplayMonth(next);
  };

  const handleYearChange = (value: string) => {
    const next = new Date(displayMonth);
    next.setFullYear(Number(value));
    setDisplayMonth(next);
  };

  return (
    <div className={`${styles.nav} ${className ?? ''}`} aria-live="polite">
      <Button
        variant="ghost"
        size="sm"
        animations={[{ trigger: 'Root.press', sequence: [{ animation: { scale: { to: 0.85, ease: snappy } } }] }]}
        onClick={goToPrevMonth}
        aria-label={labels.previousMonth}
        className={styles.navButton}
        {...(sp?.prevButton ?? {})}
      >
        {sp?.prevButton?.children ?? <Icon name="chevron-left" size="sm" />}
      </Button>

      <div className={styles.navLabels}>
        <Select.Root
          value={String(displayMonth.getMonth())}
          onValueChange={handleMonthChange}
        >
          <Select.Trigger ref={monthTriggerRef} width="auto" style={{ minWidth: monthMinWidth, gap: '0.25rem', paddingInline: '0.5rem' }}>
            <Select.Value ref={monthValueRef}>{monthName}</Select.Value>
            <Select.Icon />
          </Select.Trigger>
          <Select.Content align="center">
            {monthNames.map((name, i) => (
              <Select.Item key={i} value={String(i)}>
                {name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Select.Root
          value={String(year)}
          onValueChange={handleYearChange}
        >
          <Select.Trigger width="auto" style={{ minWidth: 0, gap: '0.25rem', paddingInline: '0.5rem' }}>
            <Select.Value>{year}</Select.Value>
            <Select.Icon />
          </Select.Trigger>
          <Select.Content align="center">
            {years.map((yr) => (
              <Select.Item key={yr} value={String(yr)}>
                {yr}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>

      <Button
        variant="ghost"
        size="sm"
        animations={[{ trigger: 'Root.press', sequence: [{ animation: { scale: { to: 0.85, ease: snappy } } }] }]}
        onClick={goToNextMonth}
        aria-label={labels.nextMonth}
        className={styles.navButton}
        {...(sp?.nextButton ?? {})}
      >
        {sp?.nextButton?.children ?? <Icon name="chevron-right" size="sm" />}
      </Button>
    </div>
  );
}
