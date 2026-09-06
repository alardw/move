'use client';

import * as React from 'react';
import { Tooltip } from '../../overlays/Tooltip';
import { Popover } from '../../overlays/Popover';
import { useIcon } from '../../../infrastructure/Icon';
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
  /**
   * Names the trigger on hover. Applied here rather than by the caller: the
   * trigger is handed to `Popover.Trigger asChild`, which clones it, so a
   * tooltip wrapped around it outside would be what Radix cloned instead of the
   * button.
   */
  triggerLabel?: string;
  side?: 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

// =============================================================================
// PlayerSettingsMenu
// =============================================================================

export function PlayerSettingsMenu({
  categories,
  open,
  onOpenChange,
  trigger,
  triggerLabel,
  side = 'top',
  align = 'center',
  sideOffset = 4,
}: PlayerSettingsMenuProps) {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  // Reset to main view when menu closes
  React.useEffect(() => {
    if (!open) setActiveCategory(null);
  }, [open]);

  // Resolve through the icon resolver (falls back to the built-in chevrons).
  const chevronRightIcon = useIcon('next', 14);
  const chevronLeftIcon = useIcon('previous', 14);

  if (categories.length === 0) return <>{trigger}</>;

  const activeCat = activeCategory ? categories.find((c) => c.id === activeCategory) : null;

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      {/* Tooltip OUTSIDE, Popover.Trigger inside. Both use `asChild`, so nested
          this way each clones the next and every handler reaches the button.
          Inverted — the tooltip inside — Popover.Trigger clones the Tooltip
          instead, which forwards nothing, and the menu stops opening. */}
      {triggerLabel ? (
        <Tooltip label={triggerLabel} side={side}>
          <Popover.Trigger asChild>{trigger}</Popover.Trigger>
        </Tooltip>
      ) : (
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      )}
      <Popover.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        // Plain className on the shell, not a slot prop. The dark look is set as
        // Popover's own tokens now, and those are declared on this shell and read
        // by the inner box — so they inherit down to where the surface is painted.
        // Overriding the properties directly is what forced reaching past this
        // element into the inner slot (the white-box bug).
        className={styles.menu}
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
      >
        {!activeCat ? (
          // Main view — list of categories
          categories.map((cat) => {
            const activeLabel =
              cat.options.find((o) => o.value === cat.activeValue)?.label ?? cat.activeValue;

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
                <span className={styles.categoryChevron}>{chevronRightIcon}</span>
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
              <span className={styles.backChevron}>{chevronLeftIcon}</span>
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
