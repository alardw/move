// taxonomies.ts — discriminated unions for every classification axis.
//
// A taxonomy is one axis on which components are classified. Every
// taxonomy is either:
//
//   • Contract-carrying: each value is a discriminated-union variant
//     that carries its own sub-contract data. The `kind` field is the
//     classification; the rest of the variant is the contract.
//
//   • Metadata-only: a closed string union with no associated data.
//     Used for grouping/filtering only (e.g. folder bucket).
//
// The Spec interface (in `./spec.ts`) composes these into a fully
// type-checked component description.

// ============================================================================
// Category — METADATA-ONLY
// ============================================================================

/**
 * Top-level grouping label. Pure metadata — drives docs navigation
 * and the "by category" filter on the components overview.
 */
export type Category =
  | 'core'
  | 'form'
  | 'overlay'
  | 'panel'
  | 'navigation'
  | 'data'
  | 'media'
  | 'loading'
  | 'calendar'
  | 'toolbar';

// `nav` and `navigation` were a split with only 2 components each —
// merged into `navigation`. Breadcrumb and TableOfContents move from
// `nav` → `navigation` during the migration.

// ============================================================================
// ComponentClass — CONTRACT-CARRYING (single value per component)
// ============================================================================

/**
 * Structural class. Each variant carries the slot/prop expectations
 * a generator needs to scaffold the component correctly. A spec's
 * `class.kind` is what generators dispatch on.
 */
export type ComponentClass =
  | { kind: 'presentational' }
  | { kind: 'layout';        axis: 'flex' | 'grid' | 'split'; }
  | { kind: 'display';       requiredSlots: ['root']; }
  | { kind: 'interactive';   requiredSlots: ['root']; requiresOnClick: true; }
  | { kind: 'navigation';    requiredSlots: ['root']; }
  | { kind: 'input';         requiredSlots: ['root', 'input']; requiresValue: true; }
  | { kind: 'overlay';       requiredSlots: ['root', 'trigger', 'content']; requiresPortal: true; }
  | { kind: 'disclosure';    requiredSlots: ['root', 'trigger', 'content']; };

// Notes on the consolidation:
//
//   • `input_plain` / `input_popup` / `input_toggle` collapsed to a
//     single `input`. The popup/toggle distinction lives in the
//     behavior taxonomy.
//
//   • `overlay_layer` / `overlay_popup` collapsed to a single
//     `overlay`. The modal-vs-popup distinction lives in the
//     behavior taxonomy.
//
//   • `layout` is a class with a real sub-contract (axis). Stack,
//     Grid, Splitter live here. Used to be a label in BehaviorEntry.
//
//   • Tabs is class=`disclosure` but really wants class=`navigation`
//     (a11y=tablist, behavior=navigation). Migrate to navigation.

// ============================================================================
// Behavior — CONTRACT-CARRYING (multi-valued)
// ============================================================================

/**
 * What the component DOES at the page level. A component can be in
 * multiple behavior families (e.g. Image is in `media` AND `data-row`).
 *
 * Every variant carries a sub-contract. Pure-label entries belong on
 * the class taxonomy, not here.
 */
export type Behavior =
  | {
      kind: 'popup-anchored';
      closeOnEscape: boolean;
      closeOnOutsideClick: boolean;
      closeOnScroll: boolean;
      closeOnResize: boolean;
    }
  | {
      kind: 'modal-overlay';
      closeOnEscape: boolean;
      closeOnOverlayClick: boolean;
      lockBodyScroll: boolean;
      trapFocus: boolean;
    }
  | {
      kind: 'disclosure';
      animatesOpen: boolean;
      animatesClose: boolean;
      keyboardToggle: boolean;
      multipleOpen: boolean;
    }
  | {
      kind: 'data-row';
      interactiveProp: boolean;
      keyboardActivate: boolean;
      hoverAffordance: boolean;
      rootHoverModifier: 'hoverable' | 'hover' | null;
    }
  | {
      kind: 'form-input';
      /** Submission name attribute, when applicable. */
      name?: string;
      /** Whether the input emits a hidden `<input>` carrying the value. */
      hiddenInput: boolean;
    }
  | {
      kind: 'notification-inline';
      /** Whether the user can dismiss the notification. */
      dismissable: boolean;
    }
  | {
      kind: 'notification-floating';
      /** Auto-dismiss timeout in milliseconds, or `null` for manual-only. */
      autoDismissMs: number | null;
      dismissable: boolean;
    }
  | {
      kind: 'navigation';
      /** Source of the routing target. */
      target: 'href' | 'onClick' | 'both';
    }
  | {
      kind: 'media';
      mediaType: 'image' | 'audio' | 'video' | 'mixed';
    }
  | {
      kind: 'loading';
      /** Whether the indicator declares progress (vs indeterminate). */
      determinate: boolean;
    };

// Dropped from this taxonomy (label-only entries that didn't carry a contract):
//   • `layout` — moved to ComponentClass with `axis` sub-contract.
//   • `typography` — folded into ComponentClass.kind: 'presentational'.
//   • `display` — folded into ComponentClass.kind: 'presentational'.

// ============================================================================
// State — CONTRACT-CARRYING (single value)
// ============================================================================

/**
 * The component's controlled-state shape. The discriminator says what
 * KIND of value flows through; the variant carries the prop names.
 *
 * Absent on the spec when the component is stateless.
 */
export type State =
  | {
      kind: 'controlled-value';
      valueProp: string;          // 'value', 'checked', etc.
      defaultValueProp: string;   // 'defaultValue', 'defaultChecked'
      onChangeProp: string;       // 'onValueChange', 'onCheckedChange'
    }
  | {
      kind: 'controlled-open';
      valueProp: 'open';
      defaultValueProp: 'defaultOpen';
      onChangeProp: 'onOpenChange';
    };

// `controlled-index` was 0/67. Dropped.
// `stateless` was a label-only variant. Dropped — `state` is now
// optional on Spec; absence means stateless.

// ============================================================================
// Animation — CONTRACT-CARRYING (single value)
// ============================================================================

/**
 * Dominant motion pattern. The variant carries the parameters that
 * vary per spec (direction, interval, duration, which triggers).
 *
 * Specs also carry a separate `animations: AnimationDef[]` with the
 * concrete trigger/sequence pairs. The `animation` taxonomy entry
 * names the pattern those triggers should fit; the validator
 * cross-checks against `ANIMATION_RULES` below.
 */
// Absent on the spec when the component has no animation pattern.
export type Animation =
  | {
      kind: 'fade';
      /** Which transition direction(s) this component animates. */
      direction: 'enter' | 'exit' | 'both';
    }
  | {
      kind: 'scale-fade';
      direction: 'enter' | 'exit' | 'both';
    }
  | {
      kind: 'slide';
      /** Edge the component slides from on enter and to on exit. */
      direction: 'left' | 'right' | 'top' | 'bottom';
    }
  | {
      kind: 'dimension-morph';
      /** What dimension is animated. */
      axis: 'height' | 'width';
    }
  | {
      kind: 'hover-press';
      /** Which pointer events trigger feedback. */
      triggers: ('hover' | 'press')[];
    }
  | {
      kind: 'stagger';
      /** Stagger interval in milliseconds. */
      intervalMs: number;
      /** What's staggered — usually `'children'`. */
      target: 'children' | 'self';
    }
  | {
      kind: 'loop';
      /** Loop period in milliseconds. */
      durationMs: number;
      /** Whether the loop reverses direction every cycle. */
      alternate: boolean;
    };

/**
 * Pattern rules per Animation kind — constants of the kind, not
 * declared on individual specs. The validation script checks each
 * spec's `animations[]` matches these rules:
 *
 *   • Every required trigger keyword must appear at least once in
 *     `animations[].trigger`.
 *   • Every required property must appear in at least one trigger's
 *     animation step.
 *   • If `fn` is set, at least one trigger must use that runtime
 *     function (animateDimension, animatePosition, staggerAnimate).
 */
export const ANIMATION_RULES = {
  'fade':             { triggers: ['enter', 'exit'],  properties: ['opacity'],                     fn: null },
  'scale-fade':       { triggers: ['enter', 'exit'],  properties: ['opacity', 'scale'],            fn: null },
  'slide':            { triggers: ['enter', 'exit'],  properties: ['translateX', 'translateY', 'opacity'], fn: null },
  'dimension-morph':  { triggers: ['enter', 'exit'],  properties: ['height', 'width', 'opacity'],  fn: 'animateDimension' as const },
  'hover-press':      { triggers: ['hover', 'press'], properties: ['scale'],                       fn: null },
  'stagger':          { triggers: ['enter'],          properties: ['opacity', 'translateY'],       fn: 'staggerAnimate' as const },
  'loop':             { triggers: [],                 properties: [],                              fn: null },
} as const;
export type AnimationRules = typeof ANIMATION_RULES;

// ============================================================================
// Surface — CONTRACT-CARRYING (single value)
// ============================================================================

/**
 * Surface elevation marker for components that render a tinted or
 * elevated panel (popups, cards, dialogs). The `kind` is the
 * elevation level.
 *
 * Levels are designed to alternate background tints so nested
 * surfaces stay visually distinct: a `subtle` panel inside a `base`
 * page reads as elevated; a `base`-tinted child inside a `subtle`
 * panel reads as recessed. The validator can enforce that nested
 * compositions don't repeat the same level.
 *
 * Absent on the spec when the component has no distinct surface.
 */
export type Surface =
  | { kind: 'base';   slot: string; }
  | { kind: 'subtle'; slot: string; };

// ============================================================================
// Z — CONTRACT-CARRYING (single value)
// ============================================================================

/**
 * Stacking layer the component participates in. The kind is the
 * named layer; the actual numeric z-index and CSS variable token
 * are constants of the kind (see `Z_LAYERS`).
 *
 * Absent on the spec when the component lives at the base layer.
 *
 * Layers are ordered low → high (sticky < overlay < popover < tooltip < toast).
 */
export type Z =
  | { kind: 'sticky' }
  | { kind: 'app-shell' }
  | { kind: 'overlay-backdrop' }
  | { kind: 'overlay' }
  | { kind: 'popover' }
  | { kind: 'tooltip' }
  | { kind: 'toast' };

/**
 * Numeric z-index and CSS token per layer. Components don't write
 * raw numbers in their CSS — they reference the token, so changes
 * are centralized here.
 */
export const Z_LAYERS = {
  'sticky':            { value: 1020, token: '--move-z-sticky' },
  'app-shell':         { value: 1030, token: '--move-z-app-shell' },
  'overlay-backdrop':  { value: 1040, token: '--move-z-overlay-backdrop' },
  'overlay':           { value: 1050, token: '--move-z-overlay' },
  'popover':           { value: 1060, token: '--move-z-popover' },
  'tooltip':           { value: 1070, token: '--move-z-tooltip' },
  'toast':             { value: 1080, token: '--move-z-toast' },
} as const;
export type ZLayers = typeof Z_LAYERS;

// ============================================================================
// A11y — CONTRACT-CARRYING (single value)
// ============================================================================

/**
 * WAI-ARIA pattern marker. The variant names the role and the
 * required attributes the component must put on its anatomy. The
 * validation script cross-checks `requiredAttrs` against
 * `anatomy.ariaAttributes`.
 *
 * Absent on the spec when the component implements no specific
 * WAI-ARIA pattern (presentational, layout, content components).
 */
export type A11y =
  | { kind: 'dialog';      role: 'dialog' | 'alertdialog'; requiredAttrs: ['aria-modal', 'aria-labelledby']; }
  | { kind: 'menu';        role: 'menu';                   requiredAttrs: ['role']; }
  | { kind: 'listbox';     role: 'listbox';                requiredAttrs: ['role']; }
  | { kind: 'combobox';    role: 'combobox';               requiredAttrs: ['role', 'aria-expanded']; }
  | { kind: 'tablist';     role: 'tablist';                requiredAttrs: ['role']; }
  | { kind: 'tooltip';     role: 'tooltip';                requiredAttrs: ['role']; }
  | { kind: 'disclosure';                                  requiredAttrs: ['aria-expanded']; }
  | { kind: 'progressbar'; role: 'progressbar';            requiredAttrs: ['role', 'aria-valuenow']; };

// ============================================================================
// Convenience — kind unions for table rendering, etc.
// ============================================================================

export type ComponentClassKind = ComponentClass['kind'];
export type BehaviorKind = Behavior['kind'];
export type StateKind = State['kind'];
export type AnimationKind = Animation['kind'];
export type SurfaceKind = Surface['kind'];
export type ZKind = Z['kind'];
export type A11yKind = A11y['kind'];
