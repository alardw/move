/**
 * DesignPatternSpec — the canonical shape of a Move design pattern.
 *
 * A design pattern is a PARAMETERIZED family of compositions (ItemGallery, Filter,
 * MediaTile…), not a baked template. It carries typed decision AXES, a SKELETON of
 * slots (where coverage lives), per-value BINDINGS to concrete Move nodes, and
 * axis-level HEURISTICS. A concrete composite is one resolved config of a pattern.
 *
 * Every pattern is authored as an object that `satisfies DesignPatternSpec` — keeping
 * its own rich literal types (its Arrangement/Lead/etc. unions) while conforming to
 * this generic shape, so `check:design-pattern-conformance` can validate any pattern uniformly.
 *
 * Validated by `patterns/design-patterns.validate.test.ts`:
 *  · integrity — skeleton is a single-rooted tree; every axis owned by one slot; every
 *    binding/heuristic/designPattern/preset reference resolves.
 *  · coverage  — every enumerable axis value has ≥1 binding (bound / declared-gap / MISSING).
 * This is the PATTERN-SPEC level of validation — distinct from component-validate
 * (components), `move check` (composites), and the heuristic-oracles (resolved configs).
 */

/** HOW an axis is decided — the authoring contract. */
export type DecidedBy = 'data-rule' | 'use-case-preset' | 'consumer' | 'ai-heuristic';

/**
 * A decision dimension. `options` enumerates the values coverage is checked against.
 *
 * VALUE-NAMING CONVENTION (holds across every axis):
 *  · `none` is the ONE reserved value — it means the axis is absent / not applicable
 *    (no label, no filter, no activation). Use `none` for that "off" state, always.
 *  · Every other value is named DESCRIPTIVELY, for what it IS (grid, masonry, card,
 *    generous, moderate) — never for being "the default" (no `default` / `standard` /
 *    `normal` marker values; those read as "the normal one" and lie to the use cases
 *    that pick differently).
 *  · "The default" is NOT a value — it's the preset's output, and it varies by use case.
 */
export interface AxisSpec {
  axis: string;
  /** Where the axis sits — pattern-defined (e.g. 'gallery' | 'item' | 'cross-cutting'). */
  level: string;
  decidedBy: DecidedBy;
  options?: readonly string[];
  gloss: string;
}

/** A node in the skeleton tree. The root has `parent: null` and IS the container. */
export interface SlotSpec {
  slot: string;
  parent: string | null;
  /** The axes that vary this slot (each axis must be owned by exactly one slot). */
  drivenBy: string[];
  role: string;
  /** The slot can be omitted entirely (e.g. no filter, no label) — not every gallery has it. */
  optional?: boolean;
  /** If set, the slot delegates to another design pattern, named by its registry slug
   *  (e.g. 'media-tile', 'filter'). The child owns that subtree's axes/bindings/heuristics;
   *  the host pins a subset of the child's axes as config. Validated to resolve. */
  designPattern?: string;
}

/** One axis VALUE → its concrete representation in a slot. Coverage = every value has one. */
export interface Binding {
  slot: string;
  axis: string;
  /** An axis value, or '*' meaning "all values of the axis". */
  value: string;
  /** node = a Move component subtree · prop = a prop on the slot's node · behavior =
   *  data/interaction with no distinct DOM · pattern = delegates to a nested pattern. */
  as: 'node' | 'prop' | 'behavior' | 'pattern';
  /** The concrete Move composite / prop / behavior / nested pattern name. null = declared gap. */
  repr: string | null;
  note?: string;
}

/** An axis-level design law. `checkable` → an oracle over a resolved config. */
export interface Heuristic {
  id: string;
  law: string;
  /** The design concern — pattern-defined (e.g. 'coupling' | 'placement' | 'contrast'). */
  kind: string;
  /** The axes this law constrains (why it lives at the axis level). */
  axes: string[];
  checkable: boolean;
}

/** A field a slot reads (in) or produces (out) — the data SHAPE, distinct from an axis (a
 *  design CHOICE): this is CONTENT that flows through. The consumer maps their data to these
 *  fields; a field's type resolves the `data-rule` axes it `drives`. `direction`: in = the
 *  consumer/parent supplies it · out = the slot produces it (e.g. Filter emits a query). */
export interface DataField {
  slot: string;
  field: string;
  type: string;
  direction: 'in' | 'out';
  cardinality: 'one' | 'optional' | 'many';
  drives?: readonly string[]; // the data-rule axes this field resolves
  note?: string;
}

/** Mutable runtime STATE a slot owns — the third leg (axis = choice · data = content · state
 *  = what changes at runtime: a selection set, a page cursor, a filter draft, expansions).
 *  `control`: local = the composite manages it internally · controllable = it can be lifted to
 *  a prop (value + onChange) so the consumer's app owns it (selection synced to a store,
 *  filters to the URL). A controllable entry IS a port — the pattern-scope equivalent of a
 *  component's controlled prop triad (value / defaultValue / onChange). */
export interface StateEntry {
  slot: string;
  name: string;
  of: string; // the state's shape/type
  control: 'local' | 'controllable';
  note?: string;
}

/** Async FEEDBACK — how a slot that hosts adapter-fed data renders by the resource's STATUS.
 *  Neither an axis (you don't choose the status) nor a per-value binding (keyed by the runtime
 *  resource state, not an axis value): a state→node rendering, occupying the same region as the
 *  content. The status is the adapter's AsyncResource state; `ready` IS the content subtree, the
 *  other three are feedback UI. `repr: null` = a declared gap. */
export interface Feedback {
  slot: string;
  status: 'pending' | 'error' | 'empty' | 'ready';
  repr: string | null;
  note?: string;
}

/** The canonical pattern shape. Optional fields are pattern-defined extensions. */
export interface DesignPatternSpec {
  name: string;
  intent: string;
  /** Match aliases so the pattern is found however intent is worded. (Discovery 1 of 4:
   *  by phrase.) The other three dimensions: axis `options` (by capability — derived),
   *  `appliesWhen` (by data — below), and `designPattern` refs (by composition — derived). */
  synonyms: readonly string[];
  /** Data-shape / situation phrases the pattern fits — the strongest signal for an AI that
   *  already has the app's data (e.g. "a collection of items", "each item has a lead image").
   *  Discovery 2 of 4: by data. */
  appliesWhen?: readonly string[];
  axes: readonly AxisSpec[];
  skeleton: readonly SlotSpec[];
  bindings: readonly Binding[];
  heuristics: readonly Heuristic[];
  /** Content the pattern reads / produces, per slot — the data shape (in / out). */
  data?: readonly DataField[];
  /** Mutable runtime state the pattern owns, per slot — local or controllable (a prop). */
  state?: readonly StateEntry[];
  /** Async feedback — status→node rendering for a slot fed by an adapter's AsyncResource. */
  feedback?: readonly Feedback[];
  /** The values of the driver axis, if the pattern has one (e.g. a gallery's useCases). */
  useCases?: readonly string[];
  /** useCase → default axis values. Shape is pattern-defined; validated by the check,
   *  not the type system (each pattern keeps its own rich literal type via `satisfies`). */
  presets?: unknown;
  /** Pattern-specific vocabulary (e.g. a gallery's action conventions). Pattern-defined. */
  actions?: unknown;
}
