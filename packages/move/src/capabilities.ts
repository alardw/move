/**
 * Capabilities — the contracts a component signs up to.
 *
 * A capability is one thing a component does that other components also do, and
 * that has requirements worth holding it to. It names the slot KINDS it
 * constrains rather than slot names, so a contract written once applies to every
 * component regardless of what each calls its parts.
 *
 * The test for whether something belongs here: **a capability must state a
 * requirement that some component fails.** "Renders text" passes trivially for
 * everything and is a tag, not a contract. "Owns a surface" fails for the two
 * components that set `data-surface` without providing the React context, which
 * is why it earns its place.
 *
 * Named as verb phrases with an object — `takes-focus`, not `focusable`. The
 * verb makes the subject unambiguous, and a verb phrase can never collide with
 * a SlotKind, which is always a noun.
 *
 * Checked in BOTH directions by check:capabilities. A declared capability whose
 * contract does not hold is a failure; so is source that exhibits a capability
 * without declaring it. The second direction is the one that matters — every
 * defect this repo found by eye was something nobody had written down.
 */

/** How a capability's contract is verified against the source. */
export interface CapabilityContract {
  /** Slot kinds this capability constrains. */
  targets: readonly string[];
  /**
   * Whether having a targeted slot IMPLIES the capability.
   *
   * True where the kind and the capability are the same fact: a `surface` slot
   * paints a ground, so it owns a surface; a `scrollport` scrolls. Then a
   * component with the slot and no declaration is a failure, which is what
   * catches the things nobody wrote down.
   *
   * False where the capability is a CHOICE the kind does not settle. Having an
   * `item` slot does not mean the rows are striped — Toast and ToggleGroup have
   * items and stripe nothing. Inferring it there would flag every list in the
   * library for not being a table.
   */
  impliedByKind: boolean;
  /** Identifiers the component's source must reference. */
  sourceCalls?: readonly string[];
  /** A `data-*` attribute the component's source must set. */
  attribute?: string;
  /** A CSS declaration the targeted slots' rules must contain. */
  cssDeclaration?: string;
  /** An equally valid answer elsewhere in the stylesheet, if one exists. */
  cssAlternative?: string;
  /** CSS custom properties the targeted slots' rules must resolve to. */
  cssTokens?: readonly string[];
  /** Why this contract exists — shown when the check fails. */
  why: string;
}

export const CAPABILITIES = {
  'owns-surface': {
    targets: ['surface'],
    impliedByKind: true,
    sourceCalls: ['useSurfaceFlip', 'SurfaceProvider'],
    attribute: 'data-surface',
    why:
      'Painting a ground and declaring a tone must be one act. Setting the attribute ' +
      'without providing the context leaves the CSS saying one tone while React ' +
      'context still reports the parent’s, so any descendant that flips computes ' +
      'off the wrong base. Alert and Select shipped exactly that.',
  },

  'scrolls-content': {
    targets: ['scrollport'],
    impliedByKind: true,
    cssDeclaration: ':focus-visible',
    /** A wrapper lighting up on :focus-within is an equally good answer, and is
     *  what a field does — Textarea styles .root:focus-within, so its inner
     *  textarea needs no ring of its own. */
    cssAlternative: ':focus-within',
    why:
      'A scrollport takes keyboard focus when nothing inside it can — arrow keys ' +
      'are then the only way to reach what is hidden — so it has to say what focus ' +
      'looks like, or the browser draws its own in the OS accent colour. Sixteen of ' +
      'seventeen said nothing.',
  },

  'stripes-rows': {
    targets: ['item', 'separator'],
    impliedByKind: false,
    cssTokens: ['--move-stripe', '--move-rule', '--move-state-hover'],
    why:
      'Alternating rows, hover and dividers are marks ON a ground, not grounds. ' +
      'Drawn from the surface ramp they can only ever be one rung from something ' +
      'else’s ground; derived from the foreground they hold the same strength ' +
      'wherever they land, and cannot collide.',
  },
} as const satisfies Record<string, CapabilityContract>;

export type CapabilityName = keyof typeof CAPABILITIES;
