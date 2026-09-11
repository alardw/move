/**
 * How much an option row grows under the pointer.
 *
 * A row scales by a few PIXELS, not by a ratio: the same 2% on a 400px menu and
 * a 120px one are 8px and 2px of travel, and the wide one lurches while the
 * narrow one does nothing. So the ratio is derived from the width it will be
 * applied at — `(width + 4) / width` — and every list that highlights rows uses
 * the same four pixels.
 *
 * The clamp is the part that was missing. The width handed in is the TRIGGER's,
 * and a menu hangs off whatever opened it: Select's trigger is a full-width
 * combobox, but a Dropdown's is often an icon button. At a 32px trigger the
 * ratio is 1.125 — a row growing an eighth of its size, overflowing the panel it
 * sits in, because the number it was derived from has nothing to do with the row
 * it scales. Select clamped and the other two did not, which is why the same
 * gesture looked calm in one list and wrong in another.
 *
 * @param triggerWidth Measured width of the control the list hangs off, in px.
 */
export function optionHoverScale(triggerWidth: number): number {
  const width = Math.max(triggerWidth, OPTION_HOVER_MIN_WIDTH_PX);
  return (width + OPTION_HOVER_GROWTH_PX) / width;
}

/** The travel, in px — what the row grows by, at any width. */
export const OPTION_HOVER_GROWTH_PX = 4;

/**
 * The narrowest width the ratio is derived from. Below it the trigger is an
 * affordance (an icon button, a caret) rather than a measure of the list.
 */
export const OPTION_HOVER_MIN_WIDTH_PX = 120;
