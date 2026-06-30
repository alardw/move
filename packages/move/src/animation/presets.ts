import type { Animation } from './types';
import { poppy, snappy } from './easings';

// =============================================================================
// Motions — self-explaining animation builders.
//
// A motion's NAME says WHAT animates + which direction; its PARAMETER says how
// much (sensible default, or required for `rotate`). Each carries its OWN
// default ease, fitting that property. Call a motion to get an Animation object;
// combine motions by spreading them into one object — they touch different
// properties, so they run together:
//
//   animation: { ...scaleIn(), ...fadeIn() }   // a pop-in
//
// Springs (the feel) live in easings.ts; sequences (over time/targets) live in
// the trigger/sequence config. This file is only the motion layer.
// =============================================================================

const OUT = 'outQuart';

/** opacity 0 → 1 */
export const fadeIn = (): Animation => ({ opacity: { from: 0, to: 1, ease: OUT, duration: 200 } });
/** opacity 1 → 0 */
export const fadeOut = (): Animation => ({ opacity: { to: 0, ease: OUT, duration: 150 } });

/** translateY: enters from `distance` below → 0 */
export const slideUp = (distance = 8): Animation => ({
  translateY: { from: distance, to: 0, ease: OUT, duration: 200 },
});
/** translateY: enters from `distance` above → 0 */
export const slideDown = (distance = 8): Animation => ({
  translateY: { from: -distance, to: 0, ease: OUT, duration: 200 },
});
/** translateX: enters from `distance` right → 0 */
export const slideLeft = (distance = 8): Animation => ({
  translateX: { from: distance, to: 0, ease: OUT, duration: 200 },
});
/** translateX: enters from `distance` left → 0 */
export const slideRight = (distance = 8): Animation => ({
  translateX: { from: -distance, to: 0, ease: OUT, duration: 200 },
});

/** scale: appears from `from` → 1 (bouncy) */
export const scaleIn = (from = 0.9): Animation => ({ scale: { from, to: 1, ease: poppy } });
/** scale: disappears 1 → `to` */
export const scaleOut = (to = 0.9): Animation => ({
  scale: { from: 1, to, ease: OUT, duration: 150 },
});
/** scale: momentary grow, springs back (hover) */
export const scaleUp = (to = 1.04): Animation => ({ scale: { to, ease: snappy } });
/** scale: momentary shrink, springs back (press) */
export const scaleDown = (to = 0.96): Animation => ({ scale: { to, ease: snappy } });

/** rotate: `from` → `to` degrees (required — no universal default) */
export const rotate = (from: number, to: number): Animation => ({
  rotate: { from, to, ease: OUT, duration: 300 },
});

/** height 0 → auto + fade in (disclosure open). Height has no duration so
 * `animateDimension` derives one proportional to the measured content. */
export const expand = (): Animation => ({
  height: { from: 0, to: 'auto', ease: OUT },
  opacity: { from: 0, to: 1, ease: OUT, duration: 250 },
});
/** height auto → 0 + fade out (disclosure close) */
export const collapse = (): Animation => ({
  height: { from: 'auto', to: 0, ease: OUT },
  opacity: { from: 1, to: 0, ease: OUT, duration: 150 },
});

// =============================================================================
// Sequence helpers — event/over-time bundles composed FROM motions. Not motions
// themselves (they carry enter/exit/stagger structure); a component spreads the
// relevant phase into its trigger config.
// =============================================================================

/** Button/ToggleButton/Link/DayCell — hover grow + press shrink */
export const interactive = { hover: scaleUp(), press: scaleDown() };

/** Select/Dropdown/Autocomplete/TimeField items — pop stagger */
export const staggerItems = {
  enter: { ...scaleIn(0.8), ...fadeIn() },
  exit: { ...scaleOut(0.8), ...fadeOut() },
  stagger: { delay: 30 },
};

/** Select/Dropdown/Autocomplete/TimeField content — height reveal with fade */
export const revealHeight = {
  enter: { height: { from: 0, ease: OUT, duration: 250 }, ...fadeIn() },
  exit: { height: { to: 0, ease: OUT, duration: 200 }, ...fadeOut(), delay: 50 },
};

/** Checkbox/RadioGroup indicator — toggle check/uncheck */
export const toggleIndicator = {
  checked: { ...scaleIn(0.5), opacity: { from: 0, to: 1, duration: 150 } },
  unchecked: { scale: { to: 0.5, duration: 150 }, opacity: { to: 0, duration: 150 } },
};

/** Accordion/Collapsible content — expand/collapse */
export const expandContent = { open: expand(), close: collapse() };
