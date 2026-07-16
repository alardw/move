/**
 * Component Spec Type Definitions
 *
 * The typed contract between human decisions (spec) and mechanical generation.
 * All specs must satisfy `ComponentSpec`.
 */

// =============================================================================
// Schema version — increment on breaking spec changes
// =============================================================================
// v1: Initial spec schema
// v2: Animation hook contract updated — useLifecycleAnimate returns
//     { contentRef, overlayRef, innerRef }, useToggleAnimate returns
//     { rootRef, indicatorRef, animateChecked, animateUnchecked, pressHandlers },
//     useExpandAnimate returns { contentRef, innerRef }. Specs with animation
//     bindings must be regenerated.
// v3: Animation defaults are spec-first. Each animation binding may define:
//     - defaultProfile: named profile key from references/animation-map.ts
//     - defaultConfig: explicit config literal (string), which overrides profile
//     Generation must preserve explicit defaults from extracted source.
// v4: Behavioral contracts are explicit:
//     - controlledProps captures controlled/uncontrolled prop triads
//     - dismissBehavior captures close/dismiss semantics
//     - renderContracts captures required composition passthrough rules
// v5: Default review audit is mandatory:
//     - defaultReview captures explicit user confirmation of proposed defaults
//     - generation/validation must fail when review is missing
// v6: Token validation is mandatory:
//     - All var(--move-*) references must resolve against tokens-primitive.ts / tokens-semantic.ts
//     - Complete default coverage required — every defaultable prop must have explicit concrete value
//     - No undefined or omitted defaults allowed in review
// v7: Animation system refactored to trigger → sequence model:
//     - AnimationBinding replaced with AnimationTriggerBinding
//     - New `states` field for state-trigger declarations
//     - animationImports removed (useAnimations handles all wiring)
//     - User prop renamed from `animate` to `animations`

export const SPEC_SCHEMA_VERSION = 1 as const;

// =============================================================================
// Component classification
// =============================================================================

export type ComponentClass =
  | 'presentational'
  | 'interactive'
  | 'input_toggle'
  | 'input_popup'
  | 'input_plain'
  | 'disclosure'
  | 'overlay_layer'
  | 'overlay_popup'
  | 'display'
  | 'navigation';

// =============================================================================
// Behavioral patterns
// =============================================================================

/** Controlled/uncontrolled state pattern */
export type ControlledPattern =
  | 'open' // open / defaultOpen / onOpenChange
  | 'value' // value / defaultValue / onValueChange
  | 'checked' // checked / defaultChecked / onCheckedChange
  | null;

/** Keyboard interaction pattern */
export type KeyboardPattern =
  | 'toggle' // Space/Enter toggles
  | 'linear' // Arrow up/down navigates list
  | 'roving' // Arrow keys rove focus among items
  | 'typeahead' // Typing filters/searches
  | 'grid' // Arrow keys in 2D grid
  | 'none' // No keyboard interaction
  | null;

/** Focus management pattern */
export type FocusPattern =
  | 'self' // Component itself is focusable
  | 'trap' // Focus trapped within (overlays)
  | 'roving' // Focus roves among children
  | 'delegated' // Focus delegated to child input
  | 'child' // Focus a specific child element
  | 'none' // No focus management
  | null;

/** Form integration type */
export type FormType =
  | 'native-name' // Standard <input name="...">
  | 'hidden-input' // Hidden input for form submission
  | null;

/** Dismiss/close semantics for components that can be closed (e.g. Alert, Toast) */
export type DismissBehavior = 'none' | 'hide' | 'unmountAfterExit';

// =============================================================================
// Structural definitions
// =============================================================================

/** A named slot in the component anatomy */
export interface SlotDef {
  /** Slot name (e.g. 'root', 'indicator', 'content') */
  name: string;
  /** HTML element or Radix primitive this slot renders */
  element: string;
  /** Brief description of purpose */
  description: string;
}

/** A public prop definition */
export interface PropDef {
  /** Prop name */
  name: string;
  /** TypeScript type as string */
  type?: string;
  /** Canonical type reference (e.g. 'Size', 'Color') instead of an inline union */
  typeRef?: string;
  /** Default value (if any) */
  default?: string;
  /** Whether this is a Move-specific prop (goes in moveProps/defaults) */
  moveSpecific: boolean;
  /** Advanced / rarely-used prop — de-emphasised in docs */
  advanced?: boolean;
  /** Brief description */
  description: string;
}

/** A CSS custom property declaration */
export interface TokenDeclaration {
  /** Full token name (e.g. '--move-button-primary-bg') */
  name: string;
  /** Value — MUST reference var(--move-*) semantic tokens */
  value: string;
  /** Slot this token is scoped to (if any) */
  slot?: string;
  /** What this token controls */
  description?: string;
}

/** A node in the component's render tree anatomy */
export interface AnatomyNode {
  /** Slot name (must match a SlotDef) */
  slot: string;
  /** data-* attributes set on this element */
  dataAttributes?: string[];
  /** ARIA attributes set on this element */
  ariaAttributes?: string[];
  /** Child anatomy nodes */
  children?: AnatomyNode[];
}

/**
 * State declaration for state-triggered animations.
 * The runtime observes `source` on the `slot` element and fires
 * the matching trigger when `value` matches.
 */
export interface AnimationStateDef {
  /** Trigger name — matches AnimationTriggerBinding.trigger */
  name: string;
  /** Which slot element to observe */
  slot: string;
  /** DOM attribute to watch (e.g. 'data-state') */
  source: string;
  /** Attribute value that activates this state */
  value: string;
  /** CSS selector for ancestor observation (e.g. '[data-state]') — observes ancestor instead of slot ref */
  closest?: string;
  /** Skip initial fire on mount when false (default: true). Use for animations that should only run on subsequent state changes. */
  initial?: boolean;
}

/**
 * A single step in an animation sequence.
 */
export interface AnimationStepDef {
  /** Target slot to animate (defaults to trigger's slot if omitted) */
  target?: string;
  /** Inline animation config — an anime.js property object (motions inlined) */
  animation?: string | Record<string, unknown>;
  /** Runtime function override: 'animateDimension' | 'animatePosition' */
  fn?: 'animateDimension' | 'animatePosition';
  /** CSS selector for stagger children (implies staggerAnimate) */
  children?: string;
  /** Stagger timing config */
  stagger?: { delay?: number; from?: 'first' | 'last' | 'center' };
  /** Callback after this step's animation completes */
  onComplete?: string;
}

/**
 * Trigger → sequence binding in spec.
 * Replaces the old AnimationBinding interface.
 *
 * Trigger formats:
 *   'Slot.event' — event trigger (hover, press)
 *   'Slot.enter' / 'Slot.exit' — lifecycle trigger
 *   'stateName' — state trigger (must have matching entry in states[])
 */
export interface AnimationTriggerBinding {
  /** Trigger name */
  trigger: string;
  /** Steps to execute — array of steps or nested arrays for parallel execution */
  sequence: (AnimationStepDef | AnimationStepDef[])[];
  /** Variable definitions for expression resolution */
  vars?: Record<string, string>;
  /** Delegate CSS selector — attach event handlers to matching descendants instead of slot ref */
  delegate?: string;
  /** Callback after all steps in this trigger's sequence complete */
  onComplete?: string;
  /** Dependency array — re-execute sequence when deps change (skips first run). Used for value-reactive animations. */
  deps?: string[];
  /** Direction hint for animateDimension in deps triggers: 'enter' expands, 'exit' collapses */
  direction?: 'enter' | 'exit';
  /** Free-form note / rationale for this binding */
  note?: string;
}

/** Sanctioned Tier-2 animation capability (see ComponentSpec.animationCapabilities). */
export type AnimationCapability =
  | 'slidingIndicator'
  | 'valueLoop'
  | 'measureThenAnimate'
  | 'scrollApi'
  | 'cssAnimation'
  | 'textSplit'
  | 'layoutFlip';

/** Shared animation pattern a component composes (see ComponentSpec.animationPatterns).
 *  Source of truth for the animation-map catalog; kept in sync by check:animation-choreography. */
export const ANIMATION_PATTERNS = [
  'press',
  'toggle',
  'popupMenu',
  'popupSurface',
  'sidePanel',
  'disclosure',
  'listReveal',
  'layoutReveal',
  'slidingIndicator',
  'loader',
] as const;
export type AnimationPattern = (typeof ANIMATION_PATTERNS)[number];

/** Explicit controlled/uncontrolled prop triad mapping */
export interface ControlledProps {
  /** Controlled prop key (e.g. 'open', 'value', 'checked') */
  valueProp: string;
  /** Uncontrolled default key (e.g. 'defaultOpen', 'defaultValue', 'defaultChecked') */
  defaultValueProp?: string;
  /** Change handler key (e.g. 'onOpenChange', 'onValueChange', 'onCheckedChange') */
  onChangeProp?: string;
}

/** Required render/composition constraints that generation must preserve */
export interface RenderContract {
  /** Short stable identifier */
  id: string;
  /** Human-readable rule */
  description: string;
}

/** How a prop should be treated by demo generation */
export type DemoPropRole = 'displayText' | 'composition' | 'data' | 'behavior' | 'i18n';

/** Demo control declaration in spec */
export interface DemoControlDef {
  /** Stable control id */
  id: string;
  /** Control kind */
  kind: 'select' | 'boolean' | 'number' | 'text';
  /** Optional label override */
  label?: string;
  /** Optional option values for select */
  options?: string[];
  /** Default control value */
  defaultValue?: string | number | boolean | null;
  /** Optional nested sub-component path for compound controls (e.g. ['Root'], ['Item','Icon']) */
  path?: string[];
}

/** One named demo sample recipe */
export interface DemoSampleDef {
  /** Stable sample id */
  id: string;
  /** User-facing label */
  label: string;
  /** Sample-specific defaults overriding control defaults */
  defaults?: Record<string, string | number | boolean | null>;
  /** Brief sample intent */
  description?: string;
}

/** Mapping between control ids and render targets in sample templates */
export interface DemoBindingDef {
  /** Control id */
  control: string;
  /** Target expression/path in render template (documentation for generator) */
  target: string;
}

/** Optional visual reference used to align generated demos with intended output */
export interface DemoReferenceImage {
  /** Stable id */
  id: string;
  /** Local relative path or URL */
  src: string;
  /** What this image demonstrates */
  note?: string;
  /** Optional sample ids this reference applies to */
  samples?: string[];
}

/** Demo section in spec */
export interface DemoSpec {
  /** single = one recipe, samples = selectable recipes, grid = all recipes */
  renderMode: 'single' | 'samples' | 'grid';
  /** Declared controls */
  controls: DemoControlDef[];
  /** Named sample recipes */
  samples: DemoSampleDef[];
  /** Control bindings to render targets */
  bindings: DemoBindingDef[];
  /** Optional reference visuals for demo fidelity checks */
  referenceImages?: DemoReferenceImage[];
}

// =============================================================================
// Sub-component definition (for compound components)
// =============================================================================

export interface SubComponentDef {
  /** Sub-component display name (e.g. 'Trigger', 'Content') */
  name: string;
  /** Slots owned by this sub-component */
  slots: SlotDef[];
  /** Props for this sub-component */
  props: PropDef[];
  /** Whether this sub-component uses the factory (vs plain FC) */
  usesFactory: boolean;
  /** Radix primitive this wraps (if any) */
  radixPrimitive?: string;
  /** Brief description */
  description: string;
}

// =============================================================================
// Internationalization
// =============================================================================

/** A translatable label exposed via the component's `labels` prop */
export interface LabelDef {
  /** Label key used in the labels prop object (e.g. 'close', 'next', 'dropzone') */
  key: string;
  /** English default value */
  default: string;
  /** Where this label is used */
  description: string;
}

// =============================================================================
// Testing section
// =============================================================================

export interface TestingSpec {
  /** Key behaviors to test */
  behaviors: string[];
  /** Keyboard interactions to test */
  keyboard?: string[];
  /** ARIA expectations to verify */
  aria?: string[];
  /** Form integration tests */
  form?: string[];
  /** Animation tests */
  animation?: string[];
  /** Syntax-highlighting tests (Code/editor components) */
  highlighting?: string[];
  /** Cell-rendering tests (Table-like components) */
  cell?: string[];
  /** Responsive-collapse tests */
  collapse?: string[];
}

// =============================================================================
// Docs preview
// =============================================================================

/**
 * How a component renders in the docs overview preview card. Consumed by the
 * docs `ComponentCard`; preview-only, never affects the shipped component.
 */
export interface PreviewSpec {
  /**
   * Portalled overlay (Dialog, Popover, Drawer, Dropdown): render the OPEN
   * state inside a contained, inert stage instead of just the trigger. The
   * docs supply a card-only render that wraps the overlay in `StagedOverlay`.
   */
  staged?: boolean;
  /**
   * The card preview is a hand-built static replica (e.g. Toast, which can't be
   * staged — its store is a singleton and its viewport portals to document.body).
   * The replica reuses the real component's CSS, and a docs drift-test asserts it
   * stays structurally identical to a really-rendered instance.
   */
  mock?: boolean;
  /** Component is its own surface — drop the white preview panel (no card-in-a-card). */
  bare?: boolean;
  /** Preview-panel width. */
  width?: 'fit' | 'xs' | 'sm' | 'md' | 'lg' | 'full';
}

// =============================================================================
// The spec itself
// =============================================================================

/** Shared animation patterns — motion recipes reused across 2+ components. A
 *  component's `choreographies` lists which it composes (multi-valued).
 *  Single-component animations (Dialog modal, Toast notification, AnimatedText
 *  textReveal, …) are NOT patterns — they're component-specific. */
export const CHOREOGRAPHIES = [
  'press', // hover-grow / press-dip on a control
  'toggle', // indicator flip on state change
  'popupMenu', // anchored list: panel scale+fade, caret, item stagger
  'popupSurface', // anchored content: scale + fade
  'sidePanel', // panel from an edge — overlay or in-flow
  'disclosure', // in-flow region reveals by animating a dimension
  'listReveal', // data rows / items stagger in
  'layoutReveal', // a generic container staggers its children
  'slidingIndicator', // an indicator slides to track the active item
  'loader', // continuous loading motion
] as const;
export type Choreography = (typeof CHOREOGRAPHIES)[number];

/** A typed seam where the consumer brings their own data, service, or library —
 *  an adapter bridges this **port** to their integration. The `contract` names a
 *  real TS type (in `src/adapters` or co-located) the consumer's value is checked
 *  against — same as a prop's `type` string names a real type. See the Adapters
 *  concept page. */
export interface IntegrationPoint {
  /** The prop the consumer wires it through (e.g. 'resource', 'adapter', 'estimate'). */
  id: string;
  /** Drives the default + fixture story: brought-in data, an out-of-process
   *  service, an in-process library, or a static asset/URL. */
  kind: 'data' | 'service' | 'library' | 'asset';
  /** The typed PORT an adapter must satisfy — a TS type NAME, resolved from
   *  `src/adapters` (cross-cutting) or co-located (e.g. 'AsyncResource<unknown>'). */
  contract: string;
  /** Zero-config behavior when nothing is wired: a built-in default, an inert
   *  no-op (renders a "not configured" affordance), or genuinely required. */
  default: 'builtin' | 'noop' | 'required';
  /** Docs/dev fixture (by name) that drives the live sample — a fake provider,
   *  never shipped in the bundle. */
  fixture?: string;
  /** Docs sample id (from the component's content samples) that demonstrates this
   *  point live against the fixture. Rendered in the Integrations panel. */
  sample?: string;
  /** One line: what the consumer brings. */
  description: string;
}

export interface ComponentSpec {
  /** Schema version — always SPEC_SCHEMA_VERSION */
  schemaVersion: typeof SPEC_SCHEMA_VERSION;

  /** Component display name (PascalCase) */
  name: string;

  /** Component class — determines template and default behaviors */
  componentClass: ComponentClass;

  /** Source category folder (e.g. 'form', 'overlay', 'core') */
  category: string;

  /** Brief one-line description */
  description: string;

  /** Built-in icon names this component renders internally (via useResolvedIcon /
   *  <Icon name>). The docs icon-usage table derives from this; check:icon-usage
   *  keeps it in sync with the source. Omit when the component renders no icons. */
  iconsUsed?: string[];

  /** Typed seams where the consumer brings their own data/service/library via an
   *  adapter. Surfaced in the docs "Integrations" panel + overview cards. Omit
   *  when the component has none. */
  integrationPoints?: IntegrationPoint[];

  /** Component-family memberships (behavior/state/...) used by cross-component checks */
  families?: Record<string, string[]>;

  /** Shared animation patterns this component composes (see CHOREOGRAPHIES).
   *  Multi-valued; [] for components with no animation, or only a
   *  component-specific one (Dialog, Toast, Alert, AnimatedText, LayoutGroup). */
  choreographies?: Choreography[];

  // --- Structure ---

  /** Whether this is a compound component with sub-components */
  compound: boolean;

  /** Root element HTML tag or Radix primitive */
  rootElement: string;

  /** All slots (for simple components) */
  slots: SlotDef[];

  /** Sub-components (for compound components) */
  subComponents?: SubComponentDef[];

  /** Root-level props */
  props: PropDef[];

  /** Render tree anatomy */
  anatomy: AnatomyNode;

  // --- Behavior ---

  /** Component-specific behavior config (modal/dismiss/…); shape varies per component */
  behavior?: Record<string, unknown>;

  /** Controlled state pattern */
  controlled: ControlledPattern;

  /** Explicit controlled/uncontrolled prop mapping (if controlled != null). Either
   *  the flat single-prop form, or a keyed map for multi-controlled components. */
  controlledProps?:
    ControlledProps | Record<string, { prop: string; defaultProp?: string; handler?: string }>;

  /** Keyboard interaction pattern */
  keyboard: KeyboardPattern;

  /** Focus management pattern */
  focus: FocusPattern;

  /** Form integration type */
  formType: FormType;

  /** Whether component supports asChild (Slot) rendering */
  asChild: boolean;

  /** Close/dismiss semantics for dismissible components */
  dismissBehavior?: DismissBehavior;

  // --- Animation ---

  /** State declarations for state-triggered animations */
  states?: AnimationStateDef[];

  /** Animation trigger-sequence bindings (empty array = no animation) */
  animations: AnimationTriggerBinding[];

  /**
   * Tier-2 animation capabilities a component uses BEYOND the declarative
   * `animations` system. The declarative trigger/sequence vocabulary covers
   * ~90% of cases; these are the sanctioned escapes for what it genuinely can't
   * express, and MUST be declared here so imperative animation code is never
   * ad-hoc. The animation-capabilities check enforces source ↔ this field.
   *
   * - `slidingIndicator` — measure + track an active element, re-measuring on
   *   resize/fonts (the shared usePositionTracker hook). Tabs, TableOfContents…
   * - `valueLoop` — animate a JS value/proxy in a loop, applied via a render
   *   callback (raw anime.js). Loader, Skeleton.
   * - `measureThenAnimate` — an enter animation whose values depend on a layout
   *   measurement taken after render (imperative moveAnimate). ChatBubble.
   * - `scrollApi` — an imperative scroll/gesture API, not an anime.js animation.
   *   Carousel.
   * - `cssAnimation` — a continuous CSS `@keyframes` animation that isn't a
   *   discrete enter/exit (so it can't go through the trigger system): a spinner
   *   rotation, indeterminate progress, a blinking caret. Loader, ProgressBar,
   *   PinInput, Avatar. (A discrete open/close animation via CSS @keyframes is NOT
   *   this — that belongs in `animations`; the check flags undeclared keyframes.)
   * - `textSplit` — split a text node into a variable number of generated
   *   character/word/line elements at runtime (anime.js `splitText`) and stagger
   *   them via the `useSplitText` primitive. The declarative trigger system
   *   animates fixed named slots, so it can't express a runtime-generated,
   *   data-dependent node set. AnimatedText.
   * - `layoutFlip` — FLIP-animate a container's children when the set/order
   *   changes (filter/sort/reorder/add/remove) via the `useAutoLayout` primitive
   *   (MutationObserver + rect cache + anime.js). The node set and positions are
   *   data-driven and only known at runtime, outside the declarative model.
   *   LayoutGroup.
   */
  animationCapabilities?: AnimationCapability[];
  /** Shared animation patterns this component composes — source of truth for the
   *  animation-map catalog (kept in sync by check:animation-choreography). */
  animationPatterns?: AnimationPattern[];

  /** Render/composition behavior that must survive generation. A bare string is
   *  shorthand for a contract with that description. */
  renderContracts?: (RenderContract | string)[];

  /** Optional prop role hints for demo generation */
  propRoles?: Record<string, DemoPropRole>;

  /** Children semantics hint: text content vs structural composition */
  childrenKind?: 'text' | 'composition';

  /** Optional explicit demo contract (controls + samples + bindings) */
  demo?: DemoSpec;

  /** Optional docs preview-card behaviour (see PreviewSpec) */
  preview?: PreviewSpec;

  // --- Surface ---

  /** Surface this component creates (sets background + shadow context for children) */
  surface?: {
    /** Which slot sets the background */
    slot: string;
    /** Surface level (matches bg token suffix) */
    level: 'base' | 'subtle' | 'muted' | 'emphasis' | 'inverse';
  } | null;

  // --- Styling ---

  /** Component CSS tokens — all values MUST reference var(--move-*) */
  tokens: TokenDeclaration[];

  /** Variant prop values — a list of values, or a richer map of value → metadata */
  variants: Record<string, string[] | Record<string, { description?: string }>>;

  /** Size prop values */
  sizes: string[];

  // --- Internationalization ---

  /** Translatable labels exposed via `labels` prop (empty array = no labels) */
  labels: LabelDef[];

  // --- Dependencies ---

  /** Radix primitive used (if any; null = explicitly none) */
  radixPrimitive?: string | null;

  /** Whether component uses a headless hook (use{Name}.ts) */
  hasHook: boolean;

  /** Engine imports needed */
  engineImports: string[];

  /** @deprecated — removed in v7. useAnimations handles all animation wiring. */
  // animationImports removed — useAnimations + resolveAnimationsConfig handle all imports

  /** Move components this component depends on (used in source and demos) */
  componentDeps?: string[];

  // --- Testing ---

  /** Test expectations */
  testing: TestingSpec;
}
