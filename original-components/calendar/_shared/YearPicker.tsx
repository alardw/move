'use client';

import * as React from 'react';
import styles from './YearPicker.module.css';

export interface YearPickerProps {
  selectedYear: number;
  onSelect: (year: number) => void;
  range?: number;
  ariaLabel?: string;
}

export function YearPicker({ selectedYear, onSelect, range = 12, ariaLabel = 'Select year' }: YearPickerProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const selectedRef = React.useRef<HTMLButtonElement>(null);

  const startYear = selectedYear - range;
  const endYear = selectedYear + range;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  React.useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      selectedRef.current.scrollIntoView({ block: 'center' });
    }
  }, []);

  return (
    <div
      ref={scrollRef}
      className={styles.yearPicker}
      role="listbox"
      aria-label={ariaLabel}
    >
      {years.map((yr) => (
        <button
          key={yr}
          ref={yr === selectedYear ? selectedRef : undefined}
          type="button"
          role="option"
          aria-selected={yr === selectedYear}
          className={styles.yearOption}
          {...(yr === selectedYear ? { 'data-selected': '' } : {})}
          onClick={() => onSelect(yr)}
        >
          {yr}
        </button>
      ))}
    </div>
  );
}
