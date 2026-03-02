'use client';

import * as React from 'react';
import { addMonths, formatMonth, getMonthNames } from './dateUtils';
import { useCalendarContext } from './CalendarContext';
import { Select } from '../../form/Select';
import { Button } from '../../core/Button';
import { Icon } from '../../core/Icon';
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

    const original = value.textContent;
    let maxWidth = 0;

    for (const name of monthNames) {
      value.textContent = name;
      const w = trigger.getBoundingClientRect().width;
      if (w > maxWidth) maxWidth = w;
    }

    value.textContent = original;
    setMonthMinWidth(Math.ceil(maxWidth));
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
        animate={{ press: { scale: 0.85, easing: 'snappy' } }}
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
          <Select.Portal>
            <Select.Content align="center">
              {monthNames.map((name, i) => (
                <Select.Item key={i} value={String(i)}>
                  {name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <Select.Root
          value={String(year)}
          onValueChange={handleYearChange}
        >
          <Select.Trigger width="auto" style={{ minWidth: 0, gap: '0.25rem', paddingInline: '0.5rem' }}>
            <Select.Value>{year}</Select.Value>
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content align="center">
              {years.map((yr) => (
                <Select.Item key={yr} value={String(yr)}>
                  {yr}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <Button
        variant="ghost"
        size="sm"
        animate={{ press: { scale: 0.85, easing: 'snappy' } }}
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
