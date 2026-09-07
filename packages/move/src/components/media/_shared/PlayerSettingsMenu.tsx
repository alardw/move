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


  // One category needs no drill-down: the list of categories would be a single
  // row you click to reach the options behind it. Opening straight onto the
  // options lets a one-subject menu — a subtitle picker — use this component
  // rather than being hand-rolled beside it, which is how the video player
  // ended up with two menus built two different ways.
  const soleCategory = categories.length === 1 ? categories[0] : null;
  const activeCat = soleCategory ?? (activeCategory ? categories.find((c) => c.id === activeCategory) : null);


  /**
   * Roving focus over the rows, in both views.
   *
   * A popup you choose from owes this: Arrow keys move between options, Home and
   * End jump to the ends, and the keypress is consumed so the PAGE does not
   * scroll behind the open menu. Without it these were plain buttons in a
   * Popover — arrows reached nothing and scrolled the document instead.
   *
   * `data-highlighted` is the same attribute Radix sets on a Select option, so
   * the highlight styling is the one from Select rather than a second look for
   * the same state.
   */
  // A callback ref, not useRef: Popover.Content mounts through Presence, a
  // commit AFTER `open` flips, so an effect keyed on `open` runs while the rows
  // do not exist yet. This fires when the list itself attaches.
  const [list, setList] = React.useState<HTMLDivElement | null>(null);

  // The tooltip and the menu hang off the same button, so once the menu is open
  // the tooltip sits on top of it naming a button you can no longer see. Kept
  // controlled and forced shut while the menu is open, rather than conditionally
  // rendered — swapping the wrapper would remount the trigger Radix is holding.
  const [tipOpen, setTipOpen] = React.useState(false);
  const [highlighted, setHighlighted] = React.useState(0);

  const rows = React.useCallback(
    () => Array.from(list?.querySelectorAll<HTMLElement>('[data-row]') ?? []),
    [list],
  );

  // Back to the first row whenever the view changes — the old index pointed into
  // a list that is no longer on screen.
  React.useEffect(() => setHighlighted(0), [activeCategory, open]);

  React.useEffect(() => {
    if (!open) return;
    const items = rows();
    // Set on the element rather than in JSX: the index runs over whichever list
    // is on screen, and the two views render different rows.
    items.forEach((el, i) => {
      if (i === highlighted) el.setAttribute('data-highlighted', '');
      else el.removeAttribute('data-highlighted');
    });
    items[highlighted]?.focus();
  }, [highlighted, open, activeCategory, rows, list]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const items = rows();
    if (!items.length) return;
    const move = (next: number) => {
      e.preventDefault();
      // …and stop it here. The player handles Arrow keys itself for volume and
      // seeking, so an arrow press inside the open menu moved the highlight AND
      // changed the volume behind it.
      e.stopPropagation();
      setHighlighted(((next % items.length) + items.length) % items.length);
    };
    if (e.key === 'ArrowDown') move(highlighted + 1);
    else if (e.key === 'ArrowUp') move(highlighted - 1);
    else if (e.key === 'Home') move(0);
    else if (e.key === 'End') move(items.length - 1);
  };

  // After the hooks, never before: a return above them changes the hook count
  // between renders.
  if (categories.length === 0) return <>{trigger}</>;

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      {/* Tooltip OUTSIDE, Popover.Trigger inside. Both use `asChild`, so nested
          this way each clones the next and every handler reaches the button.
          Inverted — the tooltip inside — Popover.Trigger clones the Tooltip
          instead, which forwards nothing, and the menu stops opening. */}
      {triggerLabel ? (
        <Tooltip
          label={triggerLabel}
          side={side}
          open={tipOpen && !open}
          onOpenChange={setTipOpen}
        >
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
        {/* A plain div we own. Popover.Content is a wrapped component and its ref
            is not ours to borrow — the rows have to be queried from an element
            this file created, the same reason Select keeps its stagger container
            inside the Radix Viewport rather than on it. */}
        <div ref={setList} role="menu" onKeyDown={onKeyDown} className={styles.list}>
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
                data-row
                role="menuitem"
                tabIndex={-1}
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
            {/* A sole category still says what it is. Skipping the drill-down
                removed the row that named the subject — the menu opened onto a
                list of speeds with nothing saying "Speed". Not a button here,
                because there is nowhere to go back to. */}
            {soleCategory && (
              <div className={styles.indicatorRow} aria-hidden="true">
                <span className={styles.categoryLabel}>{soleCategory.label}</span>
              </div>
            )}
            {!soleCategory && (
            <button
              type="button"
              className={styles.backRow}
              data-row
              role="menuitem"
              tabIndex={-1}
              onClick={() => setActiveCategory(null)}
            >
              <span className={styles.backChevron}>{chevronLeftIcon}</span>
              <span className={styles.backLabel}>{activeCat.label}</span>
            </button>
            )}
            {activeCat.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={styles.optionRow}
                data-row
                role="menuitemradio"
                aria-checked={opt.value === activeCat.activeValue}
                tabIndex={-1}
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
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
