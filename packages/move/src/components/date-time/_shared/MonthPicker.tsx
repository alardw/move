'use client';
// Generated from Calendar.spec.ts — shared MonthPicker
// Provenance: original-components/date-time/_shared/MonthPicker.tsx

import * as React from 'react';
import { getMonthNames } from './dateUtils';
import styles from './MonthPicker.module.css';

export interface MonthPickerProps {
  locale: string;
  selectedMonth: number;
  onSelect: (month: number) => void;
  ariaLabel?: string;
}

export function MonthPicker({ locale, selectedMonth, onSelect, ariaLabel = 'Select month' }: MonthPickerProps) {
  const months = React.useMemo(() => getMonthNames(locale, 'short'), [locale]);

  return (
    <div className={styles.monthPicker} role="listbox" aria-label={ariaLabel}>
      {months.map((name, i) => (
        <button
          key={i}
          type="button"
          role="option"
          aria-selected={i === selectedMonth}
          className={styles.monthOption}
          {...(i === selectedMonth ? { 'data-selected': '' } : {})}
          onClick={() => onSelect(i)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
