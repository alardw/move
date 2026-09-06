/**
 * Families — named bundles of promises, joined by components that are the same
 * kind of thing.
 *
 * A capability is one promise shared by otherwise-unrelated components: Code,
 * Textarea, ScrollArea and Dialog all scroll, and nobody would call them a
 * family. A family is the other shape — components that ARE the same thing, and
 * therefore agree on many axes at once. Dialog and Drawer agree on keyboard,
 * focus, controlled, dismiss, ARIA and capabilities. That is the difference, and
 * it is measurable rather than a matter of taste.
 *
 * Two tests a family has to pass:
 *
 *   It bundles something. A family that guarantees nothing is a category — a
 *   useful way to group things in documentation, and not a contract. `navigation`
 *   and `layout` were exactly this: their members were null on every behavioural
 *   axis.
 *
 *   It has more than one member. `notification` held Toast alone.
 *
 * And one it does NOT pass on: shared anatomy. Alert, Toast and EmptyState all
 * render an icon, a heading and some text, and they are not a family — a Toast
 * dismisses on a timer, an Alert sits inline, an EmptyState is static. Looking
 * alike is not being alike.
 *
 * Families compose. `popup-list` and `popup-content` are genuinely different —
 * one navigates options, the other holds arbitrary content — but they dismiss
 * identically, own a surface and hang off a trigger. That shared core is written
 * once, in the family they both include, because a core written twice is a core
 * that drifts. `families.state` was written seventy-one times and eleven copies
 * disagreed.
 */

/** What joining a family commits a component to. */
export interface FamilyContract {
  /** A family whose contract this one also keeps. Walked transitively. */
  includes?: string;
  /** Capabilities every member declares (see src/capabilities.ts). */
  capabilities?: readonly string[];
  /** Permitted choreographies. A member declaring one outside this set fails. */
  choreography?: readonly string[];
  /** Permitted ARIA patterns. */
  ariaPattern?: readonly string[];
  /** Slots every member owns, by name — the shared anatomy. */
  slots?: readonly string[];
  /** Scalar spec fields every member declares with this exact value. */
  fields?: Readonly<Record<string, string>>;
  /** Animation triggers every member declares. */
  triggers?: readonly string[];
  /**
   * Internal components every member builds from.
   *
   * Motion can be composed rather than declared — a player's settings menu
   * animates because Popover does, so the player's own spec names no
   * choreography. Requiring the shared component is what keeps that motion
   * identical across the family, and it is stronger than requiring a
   * choreography name would be.
   */
  composes?: readonly string[];
  /** Controlled prop triads every member exposes, by base name (`open`). */
  propTriads?: readonly string[];
  /** `behavior.<name>` blocks every member declares. */
  behaviorBlocks?: readonly string[];
  /**
   * `behavior.<block>.<flag>` booleans every member states explicitly.
   *
   * Optional in the type, so nothing else forces them. Stated either way, a
   * popup that does not close on scroll has SAID so — the alternative is a flag
   * nobody ever considered, which reads identically to one deliberately off.
   */
  behaviorFlags?: readonly string[];
  /** Sub-components every member exports. */
  subComponents?: readonly string[];
  /** Why this family exists — shown when a member fails it. */
  why: string;
}

export const FAMILIES = {
  'overlay-panel': {
    capabilities: ['owns-surface', 'scrolls-content'],
    ariaPattern: ['dialog'],
    fields: { focus: 'trap', controlled: 'open', dismissBehavior: 'unmountAfterExit' },
    // The shape, not the choreography: Drawer's slide is the shared `sidePanel`
    // pattern, Dialog's is its own, and spec-type is explicit that a
    // single-component animation is not a pattern. What both owe is a backdrop
    // and a panel that animate in and out together.
    triggers: ['Overlay.enter', 'Overlay.exit', 'Content.enter', 'Content.exit'],
    why:
      'A panel that takes the screen: focus goes in and cannot leave, the page behind stops ' +
      'scrolling, and Escape closes it. Every one of these has to behave the same or the ' +
      'escape route changes depending on which one you opened.',
  },

  // The shared core of the two popup families, written once. Both hang off a
  // trigger, and both leave the same way.
  'anchored-popup': {
    fields: { dismissBehavior: 'unmountAfterExit' },
    // A consumer can open it, watch it open, and open it from the start.
    // ColorInput kept its open state entirely internal until this was asserted.
    propTriads: ['open'],
    // Where the four dismiss routes are declared — each explicitly true or
    // false, so a popup that does not close on scroll has said so rather than
    // simply never been asked.
    behaviorBlocks: ['popup'],
    behaviorFlags: [
      'closeOnEscape',
      'closeOnOutsideClick',
      'closeOnScroll',
      'closeOnResize',
    ],
    subComponents: ['Trigger', 'Content'],
    why:
      'A panel that hangs off the control you pressed. Escape closes it, clicking away closes ' +
      'it, and focus goes back where it came from — the same, every time.',
  },

  'popup-list': {
    includes: 'anchored-popup',
    capabilities: ['scrolls-content'],
    choreography: ['popupMenu'],
    ariaPattern: ['combobox', 'listbox', 'menu'],
    why:
      'A popup you choose from. The panel arrives and the options follow it in, so the eye ' +
      'lands on the list rather than on a box appearing.',
  },

  'popup-content': {
    includes: 'anchored-popup',
    // popupSurface for the panel; layoutReveal is permitted on top for a panel
    // built of sections rather than options — DatePicker staggers its header,
    // grid and footer, which is that pattern exactly and not an item stagger.
    choreography: ['popupSurface', 'layoutReveal'],
    ariaPattern: ['dialog', 'tooltip'],
    why:
      'A popup holding whatever you put in it. It scales and fades as one thing, because its ' +
      'contents are not a list to walk down.',
  },

  'media-player': {
    // The transport, in the order it appears. Both players are built from the
    // same controls, and a control that exists on one and not the other is a
    // person relearning the same widget.
    slots: [
      'playButton',
      'progress',
      'time',
      'volumeButton',
      'volumeSlider',
      'settingsButton',
      'subtitleButton',
      'subtitleOverlay',
    ],
    // Both players open menus from the transport bar. VideoPlayer builds its
    // settings menu from the shared component and its subtitle menu from a raw
    // Popover.Root a few lines below — two menus, two constructions, one
    // component. The shared one is the family's answer.
    composes: ['PlayerSettingsMenu'],
    why:
      'Audio and video are the same instrument with a picture: play, scrub, time, volume, ' +
      'settings, captions. Someone who has used one has used the other.',
  },
} as const satisfies Record<string, FamilyContract>;

export type FamilyName = keyof typeof FAMILIES;
