'use client';
import * as React from 'react';
import { Slot } from 'radix-ui';

/**
 * Compose onto someone else's element without taking its state.
 *
 * `asChild` puts two components on one DOM node. Classes concatenate and
 * handlers compose, so sharing those is harmless — but `data-state` holds one
 * value, and every Radix primitive writes that same key. The outer one wins and
 * the inner one's state is simply gone: a selected ToggleGroup item whose
 * `[data-state='on']` rules can never match, with no error and no warning.
 *
 * There is a host and a guest on a merged node. The host renders the element
 * and its CSS is written against it, so the host keeps the plain key. The guest
 * is arriving somewhere it does not own, and puts its state under its own name.
 *
 *     <button data-state="on" data-move-tooltip-state="closed">
 *
 * Both are readable, and two guests on one node do not collide either, because
 * the owner is part of the name.
 */
export interface ScopedSlotProps {
  /** The guest's name — `'tooltip'` gives `data-move-tooltip-state`. */
  owner: string;
  children?: React.ReactNode;
}

export const ScopedSlot = React.forwardRef<HTMLElement, ScopedSlotProps>(function ScopedSlot(
  { owner, children, ...forwarded },
  ref,
) {
  // These arrive from the primitive above via its own Slot, so they are whatever
  // it wanted on the element — all of it passes through but the state key.
  const { 'data-state': state, ...rest } = forwarded as Record<string, unknown>;
  const scoped = state === undefined ? null : { [`data-move-${owner}-state`]: state };
  return (
    <Slot.Root ref={ref} {...rest} {...scoped}>
      {children}
    </Slot.Root>
  );
});
