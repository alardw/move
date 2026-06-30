/**
 * Recipe Spec Type Definitions
 *
 * Recipes are AI-consumed scaffolds: ready-made patterns composed ENTIRELY
 * from Move components (no custom CSS, no raw layout HTML). The typed
 * `.spec.ts` is the source of truth — the same spec-driven model components
 * use, but lighter: recipes own no design tokens, no animation bindings, and
 * no public component API beyond an i18n `labels` object.
 *
 * Every recipe spec must end with `satisfies RecipeSpec`; `tsc` then enforces
 * spec ↔ schema conformance. If a recipe legitimately needs a field the schema
 * lacks, update THIS file, not just the spec.
 */

/** Width key for a recipe's overview-card preview. The docs viewer maps these
 *  to pixel widths; `'fit'` means fit-content. Kept local so recipes don't
 *  depend on the docs app. */
export type PreviewWidth = 'fit' | 'xs' | 'sm' | 'md' | 'lg' | 'full';

// =============================================================================
// Schema version — increment on breaking spec changes
// =============================================================================
// v1: Initial recipe spec schema.
export const RECIPE_SCHEMA_VERSION = 1 as const;

/** A single i18n string the recipe exposes through its `labels` prop. */
export interface RecipeLabel {
  /** Key in the recipe's `labels` object, e.g. 'submit'. */
  key: string;
  /** Default copy. For formatter labels (see `params`), a representative
   * template string with `{param}` placeholders, e.g. 'Step {n} of {total}'. */
  default: string;
  /** What the string is for — guides translation and generation. */
  description: string;
  /** When present, the label is a formatter FUNCTION taking these params
   * (e.g. `['n', 'total']` → `(n, total) => string`), not a plain string. */
  params?: string[];
}

/**
 * A field on a record supplied to a `kind: 'data'` integration point. The
 * recipe's columns, search predicate, sort keys, and filter facets are all
 * DERIVED from these fields — so replacing the data means re-deriving them.
 * Declaring the shape makes that coupling explicit instead of something the
 * consumer has to reverse-engineer from the JSX.
 */
export interface RecipeDataField {
  /** Field name on each record, e.g. 'amount'. */
  name: string;
  /** Value type: 'string' | 'number' | 'date' | 'enum' | 'boolean'. */
  type: 'string' | 'number' | 'date' | 'enum' | 'boolean';
  /** How it's used in the UI, e.g. 'Name column (with avatar)', 'status badge'. */
  note?: string;
  /** The live search predicate matches this field. */
  searchable?: boolean;
  /** A column sorts by this field. */
  sortable?: boolean;
  /** This field is exposed as a filter facet. */
  filterable?: boolean;
  /** How the field renders in a table cell: 'text' (default) or 'badge'. */
  render?: 'text' | 'badge';
}

/** A place a consumer must wire real data or behavior into the recipe. */
export interface RecipeIntegrationPoint {
  /** Short identifier, e.g. 'onSubmit', 'navItems'. */
  id: string;
  /** What the consumer must supply, e.g. 'POST credentials to the auth API'. */
  description: string;
  /**
   * What kind of fill-in this is — drives how it's marked in source and badged
   * in the docs:
   * - `data`       — placeholder sample data to REPLACE (the `SAMPLE_*` consts).
   * - `handler`    — a callback to wire (onSubmit, onDelete).
   * - `navigation` — a route/target to point at (a link or redirect).
   * - `asset`      — a static asset to swap (image, file).
   */
  kind: 'data' | 'handler' | 'navigation' | 'asset';
  /**
   * For `kind: 'data'` points: the shape of each record the consumer supplies.
   * The recipe's columns / search / sort / filters derive from this.
   */
  shape?: RecipeDataField[];
}

/**
 * How the recipe renders in the overview's preview card — the same model
 * components use. `'fit'` hugs content; named sizes are fixed widths from
 * `PREVIEW_WIDTHS`. `bare` drops the white panel when the recipe is its own
 * surface (a Card). `image` replaces the live render with a screenshot.
 */
export interface RecipePreview {
  width?: PreviewWidth;
  bare?: boolean;
  image?: string;
}

export interface RecipeSpec {
  schemaVersion: typeof RECIPE_SCHEMA_VERSION;
  /** PascalCase component/file name, e.g. 'SignIn'. */
  name: string;
  /** URL slug within its group, e.g. 'sign-in'. */
  slug: string;
  /** Display name of the group/category, e.g. 'Authentication'. */
  group: string;
  /** URL slug of the group, e.g. 'authentication'. */
  groupSlug: string;
  title: string;
  description: string;
  /** Search aliases — parity with the component spec's `synonyms`. */
  synonyms: string[];
  /** Move components the recipe is built from — also the validate allow-list. */
  composition: string[];
  /**
   * Acceptance criteria the source must implement — validation, loading,
   * empty, error, responsive, a11y. Drives the generated tests.
   */
  behaviors: string[];
  /** Every place a consumer plugs in real data or handlers. */
  integrationPoints: RecipeIntegrationPoint[];
  /** The i18n contract: keys + default copy the recipe exposes via `labels`. */
  labels: RecipeLabel[];
  /** How the recipe renders in the overview card. */
  preview: RecipePreview;
}
