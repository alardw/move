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

// ─── Color palette ───────────────────────────────────────────────────
//
// The Open Color palette names that drive every "color" prop on
// components like Avatar, Badge, ChatBubble, Stepper, Timeline.
// Sage and Primary were intentionally removed when the palette was
// reduced to the 14-stop set; brand color is mapped to `'indigo'`.

/** The 14 named color palettes (Open Color + Move gray). */
export type Color =
  | 'gray' | 'red' | 'pink' | 'grape' | 'violet' | 'indigo'
  | 'blue' | 'cyan' | 'teal' | 'green' | 'lime' | 'yellow' | 'orange';

// ─── Radius ──────────────────────────────────────────────────────────
//
// Image / media radius scale. `'full'` is the only non-token entry —
// it pins to 50% rounding for circular crops.

/** Border-radius scale for media surfaces (Image, AudioPlayer,
 *  VideoPlayer). */
export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'full';
