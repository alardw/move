/**
 * Canonical prop unions shared across the library.
 *
 * Components import from here instead of inlining literal unions in
 * their own type aliases. Doing it this way:
 *
 *   - eliminates string-typo drift (`'small'` instead of `'sm'`)
 *   - makes cross-component drift checks structurally impossible to
 *     fail (the spec linter verifies a prop named `size` references
 *     `Size` here, not a copy of the same string somewhere else)
 *   - lets us add a new size value (`'2xl'`) in one place rather than
 *     rewriting 50 component types and 50 specs
 *
 * Keep these types small, opinionated, and only add a new one when a
 * second component needs it. Per-component variants (CardVariant,
 * BadgeVariant, etc.) stay local — those families are legitimately
 * different and should not be lumped together.
 */

// ─── Size ────────────────────────────────────────────────────────────
//
// `Size` is the canonical 3-step scale most components use. The other
// three are *supersets* — strict extensions of `Size` so a component
// can accept a wider range without breaking the canonical contract.

/** Default size scale. Use this on most components. */
export type Size = 'sm' | 'md' | 'lg';

/**
 * A CSS length: a **number is pixels**, a string is any CSS length or
 * percentage (`'240px'`, `'38%'`, `'20rem'`, `'50vh'`).
 *
 * Distinct from `Size` and friends, which are scale TOKENS ('sm' | 'md' | 'lg').
 * A prop takes one or the other, never both: `size` is always the scale, and any
 * prop naming an axis or a measurement (`width`, `minHeight`, `defaultSize`)
 * takes a Dimension. Before this existed the same idea was spelled five ways
 * across the library — `React.CSSProperties['width']`, `string | number`,
 * `number | string`, bare `number`, and inline unions.
 *
 * The type is deliberately axis-free: the axis belongs to the prop name, which
 * is what lets Splitter's `defaultSize` mean width when horizontal and height
 * when vertical without a second type.
 */
export type Dimension = number | string;

/** Adds `'xs'` for tighter contexts (icon buttons, dense avatars). */
export type SizeWithXS = 'xs' | Size;

/** Adds `'xs'` and `'xl'` for components that scale across more
 *  contexts (Avatar, Card hero variants). */
export type SizeWithXL = 'xs' | Size | 'xl';

/** Full scale including a viewport-filling option. Use for surfaces
 *  that can take over the screen (Drawer, Dialog). */
export type SizeFull = 'xs' | Size | 'xl' | 'full';

// ─── Typography scale ────────────────────────────────────────────────
//
// Typography is anchored on `'base'` (the body reading size) rather
// than `'md'` because everything in a typographic system is sized
// *relative to* the body. This matches the underlying CSS tokens
// (`--move-text-base` is the canonical body size). Controls use
// `Size` above because they have no inherent default — `'md'` is just
// "the middle option."
//
// Don't try to merge these two scales. Renaming `'base'` to `'md'`
// for symmetry would break the convention that lets `'2xl'` /
// `'3xl'` chain naturally above `base` in display sizes.

/** Body-text-anchored scale used by inline typography components
 *  (Text, Code, Link). */
export type TypographySize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';

/** Extended typography scale for display-level text — adds the
 *  larger header sizes used by Heading. Strict superset of
 *  `TypographySize`. */
export type DisplaySize = TypographySize | '2xl' | '3xl' | '4xl';

// ─── Spacing scale ───────────────────────────────────────────────────
//
// Used for `gap` and `padding` props on layout components. `'none'`
// is included because zero-gap layouts are common — keeping it in the
// union saves consumers a separate `gap === 'none'` branch.

/** Spacing scale for `gap` and `padding` on layout components
 *  (Stack, Grid, Align). */
export type Gap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';

/** Extended spacing scale for very tall containers (page padding,
 *  wide hero stacks). Strict superset of `Gap`. */
export type GapWithXL2 = Gap | '2xl' | '3xl';

// ─── Text truncation ─────────────────────────────────────────────────
//
// Shared by the text primitives (Text, Heading, Code, Link, Label) and any
// component that sets `data-truncate` on a text element. All values are pure
// CSS via the global `[data-truncate]` utility (styles/truncate.css) — they
// respond to available space with no measurement. `middle` (pinned-tail) and
// measured strategies are a separate, opt-in layer.

/** How to truncate overflowing text. `true` is an alias for `'end'`.
 *  - `end`    — single line, ellipsis at the end (default).
 *  - `start`  — single line, ellipsis at the start (keeps the tail visible).
 *  - `clamp`  — wrap up to N lines (`lines` prop), then ellipsis.
 *  - `middle` — single line, ellipsis in the middle with a pinned tail
 *    (filename / hash); requires string children, else falls back to `end`. */
export type Truncate = boolean | 'end' | 'start' | 'clamp' | 'middle';

// ─── Color: the accent palette ───────────────────────────────────────
//
// The categorical palette that drives every `color` prop (Avatar, Badge,
// ChatBubble, Stepper, Timeline). These are named palette *roles*, not raw
// shade primitives — `color="green"` means "the green role", resolved by
// the theme (which decides whether green reads as moss, vibrant, or soft).
// Raw shades (`--move-green-600`) are implementation tokens and are never
// a component value.
//
// The palette is THEME-OWNED. The library ships the 13 built-in palettes;
// a consumer theme redefines the vocabulary by augmenting `MoveColors` from
// the package entry — e.g. a brand with three greens:
//
//   declare module 'move' {
//     interface MoveColors { sage: true; forest: true; mint: true }
//   }

/**
 * The color palette registry. Keys are the accent names a `color` prop
 * accepts. Augment this interface from `'move'` to add theme-specific colors.
 */
export interface MoveColors {
  gray: true;
  red: true;
  pink: true;
  grape: true;
  violet: true;
  indigo: true;
  blue: true;
  cyan: true;
  teal: true;
  green: true;
  lime: true;
  yellow: true;
  orange: true;
}

/** A categorical color role from the theme's palette. Defaults to the 13
 *  built-in palettes; theme-extensible via `MoveColors` augmentation. */
export type Color = keyof MoveColors;

// ─── Radius ──────────────────────────────────────────────────────────
//
// Image / media radius scale. `'full'` is the only non-token entry —
// it pins to 50% rounding for circular crops.

/** Border-radius scale for media surfaces (Image, AudioPlayer,
 *  VideoPlayer). */
export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'full';
