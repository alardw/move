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
  /**
   * Whether a slot that COMPOSES a Move component satisfies this by inheritance.
   *
   * A media player's play button renders <Button>, so its focus ring, its
   * disabled treatment and its press already have a contract — checked on
   * Button, where it belongs. Re-checking here would only duplicate that, and
   * the CSS it would look for does not exist because the component it composes
   * owns it. Slots declare which case they are through `element`: a lowercase
   * tag is hand-rolled, a capitalised one composes.
   */
  composedInherits?: boolean;
  /** CSS custom properties the targeted slots' rules must resolve to. */
  cssTokens?: readonly string[];
  /**
   * Every check that enforces some part of this, `check:` prefix dropped.
   *
   * A contract is rarely held by one gate. `takes-focus` is three: the rule must
   * exist (this check), the space around it must be there (focus-ring-room), and
   * whether it actually paints is a browser test. Naming them together is how a
   * reader sees which part is covered and which is not — and it is validated, so
   * a check that is renamed or deleted cannot leave a contract claiming cover it
   * no longer has.
   */
  enforcedBy: readonly string[];
  /** Why this contract exists — shown when the check fails. */
  why: string;
}

export const CAPABILITIES = {
  'owns-surface': {
    enforcedBy: ['capabilities'],
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
    enforcedBy: ['capabilities', 'focus-ring-room'],
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

  'takes-focus': {
    enforcedBy: ['capabilities', 'focus-ring-room'],
    targets: ['control', 'scrollport'],
    impliedByKind: true,
    cssDeclaration: ':focus-visible',
    cssAlternative: ':focus-within',
    composedInherits: true,
    why:
      'A keyboard user has to see where they are. Fifty-nine control slots draw a ring today and ' +
      'not one of them is required to — the ring is a convention, and a convention with nothing ' +
      'holding it is what drifts. Without a rule the browser draws its own, in the OS accent ' +
      'colour, which belongs to neither the theme nor the page.',
  },

  'takes-disabled': {
    enforcedBy: ['capabilities'],
    targets: ['control'],
    impliedByKind: false,
    cssDeclaration: ':disabled',
    cssAlternative: '[data-disabled]',
    composedInherits: true,
    why:
      'Disabled has to be visible, not just announced. Dimming the box while the label stays at ' +
      'full strength reads as enabled — that is what a checkbox shipped, 0.6 opacity over a ' +
      'near-white fill, about a three percent shift, on the least visible half of the control.',
  },

  'has-label': {
    enforcedBy: ['capabilities', 'type-scale', 'rendered-label', 'aria-label-name'],
    targets: ['label'],
    impliedByKind: true,
    composedInherits: false,
    why:
      'A control names itself the same way everywhere. The point is the DECLARATION: an unclassed ' +
      'span is not a slot, so it carries no typography role, so check:type-scale has nothing to ' +
      'compare and cannot see it. That is how two controls shipped labels at body copy while every ' +
      'other one rendered at the ui step.',
  },
} as const satisfies Record<string, CapabilityContract>;

export type CapabilityName = keyof typeof CAPABILITIES;
