/**
 * Component family taxonomy.
 *
 * Components live on multiple orthogonal axes at once. A single
 * component might be in: behavior=`popup-anchored`, state=
 * `[controlled-value, controlled-open]`, animation=`scale-fade`,
 * a11y=`combobox`. Each axis generates its own consistency contract
 * (see `scripts/checks/family-*.mjs`).
 *
 * Per spec format: every axis value is **always an array**, even
 * when only one applies. Avoids `string | string[]` ambiguity for
 * downstream tooling.
 *
 *   families: {
 *     behavior:  ['popup-anchored'],
 *     state:     ['controlled-value', 'controlled-open'],
 *     animation: ['scale-fade'],
 *     a11y:      ['combobox'],
 *   }
 */

// ─── Behavior ────────────────────────────────────────────────────────
//
// What the component DOES at the page level.

export const BEHAVIOR_FAMILIES = [
  /** Opens a positioned popup anchored to a trigger element.
   *  Closes on outside click, Escape, scroll, resize. */
  'popup-anchored',
  /** Full-screen modal that traps focus and blocks the body. */
  'modal-overlay',
  /** Expand/collapse in place, no overlay. */
  'disclosure',
  /** Form input that holds a value. */
  'form-input',
  /** Renders a row inside a list/table/timeline. */
  'data-row',
  /** Layout primitive — composition only, no behavior. */
  'layout',
  /** Presents text, no interaction. */
  'typography',
  /** Loading / state-feedback display. */
  'loading',
  /** Navigation control linking to other places. */
  'navigation',
  /** Media player or media display. */
  'media',
  /** Notification or status banner. */
  'notification',
  /** Stateless display (Badge, Alert, etc.). */
  'display',
] as const;

export type BehaviorFamily = typeof BEHAVIOR_FAMILIES[number];

// ─── State shape ─────────────────────────────────────────────────────

export const STATE_FAMILIES = [
  /** Has `value` / `defaultValue` / `onValueChange` triple. */
  'controlled-value',
  /** Has `open` / `defaultOpen` / `onOpenChange` triple. */
  'controlled-open',
  /** Has a single index value (Carousel, Stepper, Tabs). */
  'controlled-index',
  /** No controlled state. */
  'stateless',
] as const;

export type StateFamily = typeof STATE_FAMILIES[number];

// ─── Animation pattern ───────────────────────────────────────────────

// Animation families — aligned with the pattern vocabulary (interactive, pop,
// slide, expand, toggle, loop, …) so specs, docs, and code share one naming.
export const ANIMATION_FAMILIES = [
  /** Pure opacity fade in/out. */
  'fade',
  /** Scale + fade — most popups (scaleIn + fadeIn). */
  'pop',
  /** Slide from an edge — drawers, sheets. */
  'slide',
  /** Animated height (and usually opacity) — accordions, expand/collapse. */
  'expand',
  /** Children stagger in sequence. */
  'stagger',
  /** Spring-driven transform — switch/checkbox thumb, etc. */
  'toggle',
  /** Looping animation — loaders, skeletons. */
  'loop',
  /** Hover / press scale used by interactive controls. */
  'interactive',
  /** No animation. */
  'none',
] as const;

export type AnimationFamily = typeof ANIMATION_FAMILIES[number];

// ─── Accessibility pattern ───────────────────────────────────────────

export const A11Y_FAMILIES = [
  'combobox',
  'listbox',
  'tablist',
  'dialog',
  'tooltip',
  'disclosure',
  'menu',
  'progressbar',
  'none',
] as const;

export type A11yFamily = typeof A11Y_FAMILIES[number];

// ─── Composite ───────────────────────────────────────────────────────

export interface ComponentFamilies {
  behavior:  BehaviorFamily[];
  state:     StateFamily[];
  animation: AnimationFamily[];
  a11y:      A11yFamily[];
}

// ─── Behavior contracts (per behavior family) ────────────────────────
//
// Behavior-family-specific declarations. A component declaring
// `behavior: ['popup-anchored']` is also expected to set `behavior.popup`
// with the four close-trigger flags. The drift checks read these and
// later (Playwright) verify the runtime matches.

export interface PopupBehavior {
  /** Closes when Escape is pressed while open. */
  closeOnEscape: boolean;
  /** Closes when the user clicks/touches outside the content. */
  closeOnOutsideClick: boolean;
  /** Closes when the page (or any ancestor) scrolls. */
  closeOnScroll: boolean;
  /** Closes when the viewport resizes. */
  closeOnResize: boolean;
}

// Components in the `data-row` family — Table.Row, List.Item, Image
// (when used in a gallery), Timeline.Item, etc. — share an opt-in
// click-affordance contract. The presentational tile becomes a
// keyboard-accessible click target without changing its rendered
// element.
export interface DataRowBehavior {
  /** The row exposes an `interactive` prop (or auto-derives from
   *  `href` / `onClick`) that, when truthy, sets the shared
   *  `data-interactive` attribute on the rendered element. */
  interactiveProp: boolean;
  /** With `interactive` set, the row becomes focusable (`tabIndex=0`)
   *  and Enter / Space activate the `onClick` handler. */
  keyboardActivate: boolean;
  /** With `interactive` set, the row gets the `cursor: pointer`,
   *  hover tint, and focus ring tokens shared across the family. */
  hoverAffordance: boolean;
  /** Optional Root-level modifier that tints rows on hover even
   *  when individual rows aren't `interactive`. Table calls this
   *  `hoverable`; List calls it `hover`. */
  rootHoverModifier: 'hoverable' | 'hover' | null;
}
