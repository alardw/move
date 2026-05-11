// spec.ts — the canonical contract for `*.spec.ts` files.
//
// Every component's spec is the load-bearing source of truth. This
// module pins the shape so `tsc --noEmit` is the first line of defense
// against drift.
//
// Cross-references that types can't reach are enforced by
// `scripts/checks/spec-schema.mjs` — anatomy slots refer to declared
// slot names, render-contract IDs are unique, A11y `requiredAttrs`
// appear in `anatomy.ariaAttributes`, etc.

import type {
  Category,
  ComponentClass,
  Behavior,
  State,
  Animation,
  Surface,
  A11y,
} from './taxonomies';

export type {
  Category,
  ComponentClass,
  Behavior,
  State,
  Animation,
  Surface,
  A11y,
};

// ============================================================================
// Schema version
// ============================================================================

export const SCHEMA_VERSION = 1 as const;
export type SchemaVersion = typeof SCHEMA_VERSION;

// ============================================================================
// Element types
// ============================================================================

export interface SlotDef {
  name: string;
  element: string;
  description: string;
}

/**
 * A single prop on a component or sub-component. Discriminated by
 * `required` plus `role`:
 *
 *   • `PropRequired`        — user must supply. No fallback.
 *   • `PropOptionalLiteral` — non-user-facing prop with a literal
 *                             default (size, variant, boolean flag).
 *   • `PropOptionalLabeled` — user-facing localizable string. The
 *                             default lives in `labels[]`; the prop
 *                             references it by `labelKey`.
 *
 * `tsc --noEmit` rejects a spec that picks a discriminator without
 * the matching shape. There is no escape hatch where a string-typed
 * prop has a literal default without going through the labels table.
 */
export type PropDef = PropRequired | PropOptionalLiteral | PropOptionalLabeled;

interface PropBase {
  name: string;
  type?: string;
  typeRef?: string;
  description: string;
  /** Move-specific = exists because Move adds it (variant, size, ...).
   *  Standard React props (children, className, style) are `false`. */
  moveSpecific: boolean;
}

export interface PropRequired extends PropBase {
  required: true;
  /** What kind of prop this is. */
  role: PropRole;
}

export interface PropOptionalLiteral extends PropBase {
  required: false;
  /** Non-user-facing prop role. */
  role: 'data' | 'behavior' | 'composition';
  /** TS-literal string form of the fallback when the prop is omitted.
   *  For props whose default is genuinely `undefined` (e.g. `children`,
   *  `onClick`), use the literal string `'undefined'`. */
  default: string;
}

export interface PropOptionalLabeled extends PropBase {
  required: false;
  /** User-facing localizable string. */
  role: 'i18n';
  /** Key into `labels[]` providing the default text. The validator
   *  enforces that this key exists in the spec's `labels[]`. */
  labelKey: string;
}

export type PropRole = 'data' | 'behavior' | 'composition' | 'i18n';

export interface SubComponentDef {
  name: string;
  description?: string;
  slots?: SlotDef[];
  props: PropDef[];
  usesFactory?: boolean;
  radixPrimitive?: string | null;
}

export interface TokenDef {
  name: string;
  value: string;
  description: string;
  slot?: string;
}

export type AnimationStep = Record<string, unknown>;

export interface AnimationDef {
  trigger: string;
  sequence: AnimationStep[];
  note?: string;
}

export interface RenderContractDef {
  id: string;
  description: string;
}

/**
 * Recursive anatomy tree. Children's `slot` strings must reference
 * slot names declared in `slots[]`. Enforced by the validation script.
 */
export interface AnatomyDef {
  slot: string;
  dataAttributes?: string[];
  ariaAttributes?: string[];
  children?: AnatomyDef[];
}

export interface LabelDef {
  key: string;
  default: string;
  description: string;
}

export interface DefaultReview {
  status: 'approved' | 'pending';
  decisionSource: 'rule-based' | 'user-confirmed' | 'accept-all';
  overrides: Record<string, unknown>;
}

export interface DeprecatedDef {
  since: string;
  removeIn: string;
  replacement?: string;
  reason: string;
}

export interface AnimationStateDef {
  name: string;
  slot: string;
  source: string;
  value: string;
}

export type ChildrenKind = 'composition' | 'text';

/** Keyboard navigation pattern marker. */
export type KeyboardPattern = 'roving' | 'linear' | 'toggle' | 'grid' | 'none';

/** Focus management pattern marker. */
export type FocusPattern = 'self' | 'roving' | 'delegated' | 'trap' | 'child' | 'none';

export type FormType = 'hidden-input' | 'native-name' | null;

export interface ControlledProps {
  valueProp: string;
  defaultValueProp: string;
  onChangeProp: string;
}

export interface TestingDef {
  behaviors: string[];
  aria?: string[];
  keyboard?: string[];
  animation?: string[];
  form?: string[];
  [key: string]: string[] | undefined;
}

// ============================================================================
// The contract
// ============================================================================

export interface Identity {
  name: string;
  description: string;
  synonyms: string[];
}

export interface Taxonomies {
  /** Folder bucket — metadata only. */
  category: Category;
  /** Structural class with required-slots contract. */
  class: ComponentClass;
  /** Behaviour family memberships (multi-valued) with per-family contracts. Absent when none apply. */
  behaviors?: Behavior[];
  /** Controlled-state shape with controlled-prop wiring. Absent when stateless. */
  state?: State;
  /** Animation pattern with parameters. Absent when no pattern applies. */
  animation?: Animation;
  /** Surface elevation marker. Absent when the component has no distinct surface. */
  surface?: Surface;
  /** WAI-ARIA pattern with required-attribute contract. Absent when no specific pattern applies. */
  a11y?: A11y;
}

export interface Composition {
  compound: boolean;
  rootElement: string;
  /**
   * Whether the component supports Radix UI's `asChild` pattern: pass
   * `asChild` and a single child element, and the component merges
   * its props/ref onto that child instead of rendering its own
   * default element. Useful for wrapping anchors, buttons, or custom
   * roots without changing semantics. Borrowed from Radix —
   * non-Radix runtimes that adopt this contract would implement an
   * equivalent slot-replace pattern.
   */
  asChild: boolean;
  childrenKind?: ChildrenKind;
  slots: SlotDef[];
  /** Top-level props. `[]` for compound (props live in subComponents). */
  props: PropDef[];
  subComponents?: SubComponentDef[];
  anatomy: AnatomyDef;
  radixPrimitive?: string | null;
}

export interface Interaction {
  keyboard: KeyboardPattern;
  focus: FocusPattern;
  formType: FormType;
  /** Animation state observers — DOM attributes that drive triggers. */
  states?: AnimationStateDef[];
}

export interface Style {
  variants: Record<string, string[]>;
  sizes: string[];
  labels: LabelDef[];
}

export interface AnimationBlock {
  /** Concrete trigger/sequence pairs realising the pattern named in `taxonomies.animation`. */
  triggers: AnimationDef[];
  tokens: TokenDef[];
  renderContracts: RenderContractDef[];
}

export interface Lifecycle {
  /** Package version when this component was first introduced (e.g. `'0.1.48'`). */
  since: string;
  /** Human approval state of the proposed defaults. AI generators refuse to run when status is `'pending'`. */
  defaultReview: DefaultReview;
  /** Set on a component scheduled for removal. */
  deprecated?: DeprecatedDef;
}

export interface Tooling {
  hasHook: boolean;
  engineImports: string[];
  componentDeps: string[];
}

export interface Spec {
  schemaVersion: SchemaVersion;
  identity: Identity;
  taxonomies: Taxonomies;
  composition: Composition;
  interaction: Interaction;
  style: Style;
  animation: AnimationBlock;
  tests: TestingDef;
  lifecycle: Lifecycle;
  tooling: Tooling;
}
