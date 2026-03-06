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

export const SPEC_SCHEMA_VERSION = 7 as const;

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
  | 'display';

// =============================================================================
// Behavioral patterns
// =============================================================================

/** Controlled/uncontrolled state pattern */
export type ControlledPattern =
  | 'open'      // open / defaultOpen / onOpenChange
  | 'value'     // value / defaultValue / onValueChange
  | 'checked'   // checked / defaultChecked / onCheckedChange
  | null;

/** Keyboard interaction pattern */
export type KeyboardPattern =
  | 'toggle'    // Space/Enter toggles
  | 'linear'    // Arrow up/down navigates list
  | 'roving'    // Arrow keys rove focus among items
  | 'typeahead' // Typing filters/searches
  | 'grid'      // Arrow keys in 2D grid
  | null;

/** Focus management pattern */
export type FocusPattern =
  | 'self'       // Component itself is focusable
  | 'trap'       // Focus trapped within (overlays)
  | 'roving'     // Focus roves among children
  | 'delegated'  // Focus delegated to child input
  | null;

/** Form integration type */
export type FormType =
  | 'native-name'   // Standard <input name="...">
  | 'hidden-input'  // Hidden input for form submission
  | null;

/** Dismiss/close semantics for components that can be closed (e.g. Alert, Toast) */
export type DismissBehavior =
  | 'none'
  | 'hide'
  | 'unmountAfterExit';

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
  type: string;
  /** Default value (if any) */
  default?: string;
  /** Whether this is a Move-specific prop (goes in moveProps/defaults) */
  moveSpecific: boolean;
  /** Brief description */
  description: string;
}

/** A CSS custom property declaration */
export interface TokenDeclaration {
  /** Full token name (e.g. '--move-button-primary-bg') */
  name: string;
  /** Value — MUST reference var(--move-*) semantic tokens */
  value: string;
  /** What this token controls */
  description: string;
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
  /** Inline animation config */
  animation?: string;
  /** Named preset from PRESET_REGISTRY */
  preset?: string;
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
}

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
export type DemoPropRole = 'displayText' | 'composition' | 'data' | 'behavior';

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

/** Audit trail for required interactive default review */
export interface DefaultReview {
  /** Must be approved before spec write */
  status: 'approved';
  /** How approval happened */
  decisionSource: 'user-confirmed' | 'accept-all' | 'rule-based';
  /** Explicit per-prop overrides accepted by user */
  overrides?: Record<string, string>;
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
}

// =============================================================================
// The spec itself
// =============================================================================

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

  /** Controlled state pattern */
  controlled: ControlledPattern;

  /** Explicit controlled/uncontrolled prop mapping (if controlled != null) */
  controlledProps?: ControlledProps;

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

  /** Render/composition behavior that must survive generation */
  renderContracts?: RenderContract[];

  /** Optional prop role hints for demo generation */
  propRoles?: Record<string, DemoPropRole>;

  /** Children semantics hint: text content vs structural composition */
  childrenKind?: 'text' | 'composition';

  /** Required audit record that defaults were interactively reviewed */
  defaultReview: DefaultReview;

  /** Optional explicit demo contract (controls + samples + bindings) */
  demo?: DemoSpec;

  // --- Surface ---

  /** Surface this component creates (sets background + shadow context for children) */
  surface?: {
    /** Which slot sets the background */
    slot: string;
    /** Surface level (matches bg token suffix) */
    level: 'base' | 'subtle' | 'muted' | 'emphasis' | 'inverse';
  };

  // --- Styling ---

  /** Component CSS tokens — all values MUST reference var(--move-*) */
  tokens: TokenDeclaration[];

  /** Variant prop values */
  variants: Record<string, string[]>;

  /** Size prop values */
  sizes: string[];

  // --- Internationalization ---

  /** Translatable labels exposed via `labels` prop (empty array = no labels) */
  labels: LabelDef[];

  // --- Dependencies ---

  /** Radix primitive used (if any) */
  radixPrimitive?: string;

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
