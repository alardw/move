import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { PopupMechanism } from '../spec-type';

/**
 * Focus container for anchored popups — the runtime half of
 * `behavior.popup.mechanism`.
 *
 * REQUIRES A RADIX POPUP PRIMITIVE. The handlers it returns are
 * `onOpenAutoFocus` / `onCloseAutoFocus`, which are Radix's — spread them onto a
 * `Popover.Content`, `DropdownMenu.Content`, `Select.Content` or any surface with
 * the same two events. Those are the only points Radix guarantees run after its
 * own FocusScope has been set up and torn down, which is why the focus work
 * cannot live in a mount effect: the orderings race and Radix wins. Attached to
 * anything else the handlers simply never fire, so a dev-only warning below says
 * so out loud rather than leaving a popup silently unreachable.
 *
 * Every popup-anchored component used to hand-roll this, and they disagreed:
 * one focused the content conditionally on how it was opened, another
 * preventDefault'ed both auto-focus events and restored nothing, so Escape
 * dropped focus on `<body>` and stranded the keyboard user at the top of the
 * document. This hook is the one implementation, so the mechanism a spec
 * declares is the behaviour that ships.
 *
 * What it owns:
 *
 *   1. FOCUS-IN — for mechanisms whose contract is `focusOnOpen: 'popup'`,
 *      focus moves to the first tabbable control on EVERY open, pointer or
 *      keyboard alike. A portaled popup is not adjacent to its anchor in the
 *      tab order, so a panel that never receives focus is one the keyboard
 *      user can only reach by tabbing through the rest of the document and
 *      wrapping around.
 *   2. FOCUS-BACK — on close, focus returns to the declared target (the field
 *      or the trigger). Radix restores to its `Trigger`, which these
 *      components do not render — they anchor with `Anchor` — so left alone it
 *      restores to nothing.
 *   3. FOCUS-LEAVE — an open popup whose focus has moved elsewhere on the page
 *      is dismissed, so it cannot trail behind the user.
 *
 * Radix's `FocusScope` mounts with `loop: true`, which wraps Tab from the last
 * control back to the first even when `trapped` is false. So once focus is
 * inside, Tab cycles the panel and Escape is the way out — which is why (2)
 * has to work for the widget to be usable at all.
 */

/** Matches the first thing a user can Tab to. `[tabindex]:not([tabindex="-1"])`
 *  is what catches the composite widgets (a `div[role="slider"]`). */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** A floating surface rendered through a portal — the popper wrapper covers
 *  Popover/DropdownMenu/Select/Tooltip, the role selectors cover Dialog and
 *  Drawer, which portal without a popper. */
const FLOATING_LAYER_SELECTOR = [
  '[data-radix-popper-content-wrapper]',
  '[role="dialog"]',
  '[role="alertdialog"]',
].join(',');

export interface UsePopupFocusOptions {
  /** The declared mechanism. Fixes where focus goes on open and on close. */
  mechanism: PopupMechanism;
  /** The portaled content element. */
  contentRef: RefObject<HTMLElement | null>;
  /** Where focus returns on close — the field, or the trigger. */
  returnRef: RefObject<HTMLElement | null>;
  /** The anchor subtree. Focus inside it does not count as leaving. */
  anchorRef?: RefObject<HTMLElement | null>;
  /** Names the element focus should land on, when the first tabbable is the
   *  wrong answer — a grid's roving tab stop sits behind its nav buttons, and
   *  landing on a nav button means arrow keys never reach the grid. */
  getFocusTarget?: (content: HTMLElement) => HTMLElement | null;
  /** True while the popup is mounted (open or animating out). */
  isOpen: boolean;
  /** Dismiss request — fired when focus leaves the popup and its anchor. */
  onDismiss?: () => void;
}

export interface PopupFocusHandlers {
  /** Spread onto the popup content (Radix `Popover.Content` and friends). */
  onOpenAutoFocus: (event: Event) => void;
  onCloseAutoFocus: (event: Event) => void;
}

/** Whether focus enters the content for this mechanism. */
const entersPopup = (mechanism: PopupMechanism) =>
  mechanism === 'field-dialog' || mechanism === 'trigger-surface';

/**
 * Whether focus landing outside dismisses the popup.
 *
 * Deliberately decided HERE and not read from `POPUP_FOCUS_BY_MECHANISM`, even
 * though the two must agree. `check:keyboard-entry` compares the running
 * component against that table, and a runtime that derives its behaviour FROM
 * the table can never disagree with it — the assertion passes no matter what
 * either side says. Two independent statements and a referee is the whole point;
 * one statement read twice is theatre.
 *
 * Only the field-anchored panel qualifies: it takes focus and sits detached from
 * its field, so focus going elsewhere means the user is done with it. The
 * trigger-anchored surfaces delegate to Radix and are not driven by this hook.
 */
const dismissesOnFocusLeave = (mechanism: PopupMechanism) => mechanism === 'field-dialog';

// Bundlers (Vite, webpack, Next) statically replace `process.env.NODE_ENV`.
declare const process: { env: { NODE_ENV?: string } };

export function usePopupFocus({
  mechanism,
  contentRef,
  returnRef,
  anchorRef,
  getFocusTarget,
  isOpen,
  onDismiss,
}: UsePopupFocusOptions): PopupFocusHandlers {
  const takesFocus = entersPopup(mechanism);

  // Set by onOpenAutoFocus. If the popup is open and this is still false, the
  // handlers never reached a Radix content — see the warning below.
  const openAutoFocusFired = useRef(false);
  const warned = useRef(false);

  const onOpenAutoFocus = useCallback(
    (event: Event) => {
      openAutoFocusFired.current = true;
      // Always preventDefault: Radix would otherwise focus the bare content
      // container, which announces as an empty dialog and skips the controls.
      event.preventDefault();
      if (!takesFocus) return;
      const content = contentRef.current;
      if (!content) return;
      const target =
        getFocusTarget?.(content) ?? content.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (target ?? content).focus();
    },
    [takesFocus, contentRef, getFocusTarget],
  );

  const onCloseAutoFocus = useCallback(
    (event: Event) => {
      event.preventDefault();
      // Focus never left the field for these, so there is nothing to reclaim.
      if (mechanism === 'delegated' || mechanism === 'pointer-panel') return;
      const active = document.activeElement;
      // Only reclaim focus we actually own. Closing by clicking elsewhere on
      // the page must leave focus where the user put it — yanking it back to
      // the field would fight the click that dismissed the popup.
      const ownsFocus =
        active === null ||
        active === document.body ||
        (contentRef.current?.contains(active) ?? false);
      if (ownsFocus) returnRef.current?.focus();
    },
    [mechanism, contentRef, returnRef],
  );

  // Dev-only: catch the handlers not being wired to a Radix content at all.
  // Radix fires onOpenAutoFocus synchronously when its content mounts, so one
  // frame after the popup opens it must have run. Silence otherwise: the popup
  // opens with focus left wherever it was, and on a portaled surface that means
  // the keyboard can only reach it by tabbing the whole document and wrapping.
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!isOpen || warned.current) return;
    const id = setTimeout(() => {
      if (openAutoFocusFired.current || warned.current) return;
      warned.current = true;
      console.warn(
        '[move] usePopupFocus: onOpenAutoFocus never fired while the popup was open. ' +
          'Its handlers are Radix events — spread them onto a Radix Popover.Content, ' +
          'DropdownMenu.Content or Select.Content (or a surface with the same two ' +
          'events). Attached anywhere else they never run, and the popup opens ' +
          'unreachable by keyboard.',
      );
    }, 0);
    return () => clearTimeout(id);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) openAutoFocusFired.current = false;
  }, [isOpen]);

  // Focus-leave dismissal. Runs on `focusin` at the document, so it sees focus
  // arriving anywhere — including elements outside any React tree we own.
  const leaveEnabled = dismissesOnFocusLeave(mechanism);
  useEffect(() => {
    if (!isOpen || !leaveEnabled || !onDismiss || typeof document === 'undefined') return;
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      // The close path focuses the return target itself; that is the dismissal
      // completing, not a new one starting.
      if (contentRef.current?.contains(target)) return;
      if (anchorRef?.current?.contains(target)) return;
      if (returnRef.current?.contains(target)) return;

      // A popup opened FROM this one — a Select in the panel, a nested menu —
      // portals its surface to the end of <body>, so by DOM containment its
      // focus looks like focus leaving. It is not: the user is still working
      // inside this popup. Without this, opening a select inside the panel
      // dismissed the panel out from under it.
      const el = target instanceof Element ? target : target.parentElement;
      if (el?.closest(FLOATING_LAYER_SELECTOR)) return;

      onDismiss();
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, [isOpen, leaveEnabled, onDismiss, contentRef, anchorRef, returnRef]);

  return { onOpenAutoFocus, onCloseAutoFocus };
}
