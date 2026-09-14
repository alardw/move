/**
 * How far an interactive control grows under the pointer — in PIXELS.
 *
 * `transform: scale()` takes a ratio, and a ratio is the wrong unit for this:
 * `scale(1.05)` moves a 320px button 16px and a 64px one 3px, so a row of
 * controls of different widths answers the same gesture by different amounts.
 * What a person sees is a distance, so the distance is what is written down —
 * and the ratio that delivers it is `(w + px) / w`, which depends on the
 * element.
 *
 * Scale is also the only property that grows the LABEL along with the box. A
 * length applied to a painted layer (`inset` on a pseudo-element) is absolute
 * without measuring anything, but it leaves the text at its original size,
 * which is a different effect. So the measurement is not avoidable — it is only
 * worth doing once, in one place, on the right element.
 *
 * The right element is the one being scaled. Every list in the library measured
 * its TRIGGER instead: a menu hangs off whatever opened it, often an icon
 * button, so at 32px the ratio came out at 1.125 — a row growing an eighth of
 * its size and overflowing the panel it sits in. Two of the three then differed
 * again on whether to clamp.
 *
 * And it is worth doing lazily. `vars` is handed the target element at the
 * moment the trigger fires, which is one `offsetWidth` read per hover on the
 * element about to move — no ResizeObserver, no state, no re-render, and
 * nothing measured for a control nobody touches.
 */

/** Hover grows the control by this much; a press takes this much back. */
export const CONTROL_GROW_PX = 4;
export const CONTROL_PRESS_PX = 6;

/** The ratio that moves an element of `width` by `px`. */
export function growScale(width: number, px: number): number {
  return width > 0 ? (width + px) / width : 1;
}

/**
 * Build the `vars` function for a grow trigger.
 *
 * It also writes the ratio to `cssVar` on the element, because the CSS class
 * fallback is what HOLDS the state the animation travels to: without a value
 * there, the control hands back to a stale literal on arrival and snaps to a
 * different size while the pointer is still on it. Measured here, so the
 * fallback carries the same number the animation just used.
 */
export function growVars(cssVar: string, px: number, varName = 'scaleHover') {
  return (el: HTMLElement): Record<string, unknown> => {
    const scale = growScale(el.offsetWidth, px);
    el.style.setProperty(cssVar, String(scale));
    return { [varName]: scale };
  };
}

/**
 * The `vars` an option row's hover trigger resolves `$scaleHover` from.
 *
 * Shared by Select, Dropdown and Autocomplete: one list is one list wherever it
 * appears, and this is the number that says so.
 */
export const ITEM_HOVER_VARS = growVars('--move-option-scale-hover', CONTROL_GROW_PX);
