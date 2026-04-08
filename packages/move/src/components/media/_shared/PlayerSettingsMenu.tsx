'use client';

import * as React from 'react';
import { Popover } from '../../overlay/Popover';
import styles from './PlayerSettingsMenu.module.css';

// =============================================================================
// Types
// =============================================================================

export interface SettingsCategory {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  activeValue: string;
  onChange: (value: string) => void;
}

export interface PlayerSettingsMenuProps {
  categories: SettingsCategory[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  side?: 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

// =============================================================================
// Chevron icons (inline, no dependency on Icon resolver in portal)
// =============================================================================

function ChevronRightSmall() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ChevronLeftSmall() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

// =============================================================================
// PlayerSettingsMenu
// =============================================================================

export function PlayerSettingsMenu({
  categories,
  open,
  onOpenChange,
  trigger,
  side = 'top',
  align = 'center',
  sideOffset = 4,
}: PlayerSettingsMenuProps) {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  // Reset to main view when menu closes
  React.useEffect(() => {
    if (!open) setActiveCategory(null);
  }, [open]);

  if (categories.length === 0) return <>{trigger}</>;

  const activeCat = activeCategory ? categories.find((c) => c.id === activeCategory) : null;

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        {trigger}
      </Popover.Trigger>
      <Popover.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={styles.menu}
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
      >
          {!activeCat ? (
            // Main view — list of categories
            categories.map((cat) => {
              const activeLabel = cat.options.find((o) => o.value === cat.activeValue)?.label ?? cat.activeValue;

              if (cat.options.length <= 1) {
                // Single option — non-clickable indicator
                return (
                  <div key={cat.id} className={styles.indicatorRow}>
                    <span className={styles.categoryLabel}>{cat.label}</span>
                    <span className={styles.categoryValue}>{activeLabel}</span>
                  </div>
                );
              }

              return (
                <button
                  key={cat.id}
                  type="button"
                  className={styles.categoryRow}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span className={styles.categoryLabel}>{cat.label}</span>
                  <span className={styles.categoryValue}>{activeLabel}</span>
                  <span className={styles.categoryChevron}><ChevronRightSmall /></span>
                </button>
              );
            })
          ) : (
            // Sub-view — options for the active category
            <>
              <button
                type="button"
                className={styles.backRow}
                onClick={() => setActiveCategory(null)}
              >
                <span className={styles.backChevron}><ChevronLeftSmall /></span>
                <span className={styles.backLabel}>{activeCat.label}</span>
              </button>
              {activeCat.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={styles.optionRow}
                  data-active={opt.value === activeCat.activeValue}
                  onClick={() => {
                    activeCat.onChange(opt.value);
                    onOpenChange(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </>
          )}
      </Popover.Content>
    </Popover.Root>
  );
}
