import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Interruptible open/close lifecycle for animated dismissables (popups,
 * overlays, popup-inputs).
 *
 * The hard part isn't opening or closing — it's the *exit animation*. While a
 * popup plays its close animation it is in a third state (`isClosing`), and a
 * deferred "close is done" callback is in flight. Two things must hold or the
 * trigger locks up:
 *
 *   1. NON-HANGING — if the exit animation stalls, the close must still
 *      complete. (Guaranteed in the engine: runExit()'s step promises are
 *      always armed with a fallback, so runExit() always resolves.)
 *   2. INTERRUPTIBLE — reopening MID-CLOSE must win. The naive guard
 *      `if (!isOpen && !isClosing) open()` *drops* that reopen, the exit then
 *      finishes and closes, and the popup "opens once, then nothing happens."
 *
 * This hook owns both: `open()` cancels an in-flight close (so reopen always
 * wins), and the deferred close-completion is guarded by an epoch token so a
 * superseded exit can never close a popup the user just reopened.
 *
 * Pairs with {@link useDismissableExit} on the (portaled) content side, which
 * wires the exit animation to this state machine.
 */
export interface DismissableOptions {
  /** Controlled open state (omit for uncontrolled). */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Fired with the new open state on open and on confirmed close. */
  onOpenChange?: (open: boolean) => void;
  /** Component-specific cleanup run when a close is confirmed (not cancelled). */
  onClosed?: () => void;
}

export interface Dismissable {
  /** True while open OR closing — i.e. the content should be mounted. */
  isOpen: boolean;
  /** True while the exit animation is playing. */
  isClosing: boolean;
  /** Open, or cancel an in-flight close (reopen always wins). */
  open: () => void;
  /** Begin closing (plays the exit animation). */
  close: () => void;
  /** Epoch token — bumped whenever an in-flight close is cancelled. Passed to
   *  {@link useDismissableExit} so a superseded exit's completion is ignored. */
  epoch: number;
  /** Called by the content side when an exit finishes; confirms the close only
   *  if its epoch is still current. */
  onExitDone: (epoch: number) => void;
}

export function useDismissable(options: DismissableOptions = {}): Dismissable {
  const { open: controlledOpen, defaultOpen, onOpenChange, onClosed } = options;
  const isControlled = controlledOpen !== undefined;

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const [isClosing, setIsClosing] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const epochRef = useRef(0);

  const isOpen = isControlled ? !!controlledOpen : uncontrolledOpen;

  // Refs mirror the latest state so open()/close() are STABLE callbacks that
  // always read current values. A stale `isClosing` closure would let a reopen
  // miss the cancel branch and fall through to a no-op — the close would then
  // finish and the rapid reopen would be lost.
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const isClosingRef = useRef(isClosing);
  isClosingRef.current = isClosing;

  const open = useCallback(() => {
    if (isClosingRef.current) {
      // Cancel the in-flight close: invalidate its deferred completion and drop
      // back to plain "open". isOpen was never lowered, so the popup stays open.
      epochRef.current += 1;
      setEpoch(epochRef.current);
      setIsClosing(false);
      return;
    }
    if (!isOpenRef.current) {
      if (!isControlled) setUncontrolledOpen(true);
      onOpenChange?.(true);
    }
  }, [isControlled, onOpenChange]);

  const close = useCallback(() => {
    setIsClosing(true);
  }, []);

  const onExitDone = useCallback(
    (ep: number) => {
      if (ep !== epochRef.current) return; // superseded by a reopen — ignore
      setIsClosing(false);
      if (!isControlled) setUncontrolledOpen(false);
      onClosed?.();
      onOpenChange?.(false);
    },
    [isControlled, onOpenChange, onClosed],
  );

  return { isOpen, isClosing, open, close, epoch, onExitDone };
}

/**
 * Content-side companion to {@link useDismissable}. Wires the exit animation
 * (`runExit`) to the lifecycle: on close it runs the exit then confirms via the
 * epoch-guarded `onExitDone`; if the close is CANCELLED mid-flight (reopened),
 * it stops the exit animation and re-snaps the content to its visible state so
 * it isn't left frozen half-faded.
 *
 * Lives in the content component (where the slot refs + useAnimations are), so
 * it must mount/unmount with the content per open.
 */
export interface DismissableExitOptions {
  isClosing: boolean;
  epoch: number;
  onExitDone: (epoch: number) => void;
  /** From useAnimations — runs the Content.exit sequence; always resolves. */
  runExit: () => Promise<void>;
  /** From useAnimations — re-runs the Content.enter sequence to restore the
   *  visible state when a close is cancelled (reopened mid-exit). Re-entering
   *  animates the container AND its staggered children back, so a half-played
   *  stagger can't be left frozen. */
  runEnter: () => Promise<void>;
  /** From useAnimations — pauses active animations (halts the cancelled exit). */
  pauseAll: () => void;
}

export function useDismissableExit({
  isClosing,
  epoch,
  onExitDone,
  runExit,
  runEnter,
  pauseAll,
}: DismissableExitOptions): void {
  const wasClosing = useRef(false);
  // Keep latest callbacks without re-running the exit effect on every render.
  const latest = useRef({ onExitDone, runExit, runEnter, pauseAll });
  latest.current = { onExitDone, runExit, runEnter, pauseAll };

  useEffect(() => {
    if (!isClosing) {
      if (wasClosing.current) {
        // The close was cancelled (reopened mid-exit): stop the exit and re-run
        // the enter so the container AND its staggered children animate back to
        // visible instead of freezing half-faded.
        wasClosing.current = false;
        latest.current.pauseAll();
        latest.current.runEnter();
      }
      return;
    }
    wasClosing.current = true;
    const ep = epoch;
    latest.current.runExit().then(() => latest.current.onExitDone(ep));
  }, [isClosing, epoch]);
}
