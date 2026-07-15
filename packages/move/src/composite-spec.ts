// composite-spec.ts — the CompositeSpec type: a resolved pattern instance.
//
// The ONLY consumer-authored composite artifact. It holds just the SOURCE: which pattern, which
// adapter feeds it, ALL decisions (every axis, explicit — no overrides, no deltas), the child
// composites it delegates to, and the domain labels. Everything else — composition, behaviors,
// the `.tsx`, the tests — is DERIVED by `resolve()`/`generate()` from this spec + the pattern +
// the adapter. Exported from `move` so a consumer's `{Name}.spec.ts` can `satisfies CompositeSpec`
// (the exact "type isn't in the public API" gap the first hand-built composite hit).

export type CompositeScope = 'composite' | 'page' | 'feature';

/** A user-facing string this instance renders (i18n). */
export interface CompositeLabel {
  key: string;
  default: string;
  description?: string;
}

export interface CompositeSpec {
  name: string; // 'ApodFeed'
  scope?: CompositeScope; // default 'composite'
  /** The DesignPatternSpec this resolves ('item-gallery'). */
  fromPattern: string;
  /** The AdapterSpec feeding this composite's data (root/collection composites). A CHILD composite
   *  that receives its item as a prop from its host has none. */
  adapter?: string; // 'apod-gallery'
  /** EVERY axis of the pattern, resolved to a value — the complete, explicit decision set (no
   *  overrides). Its shape is validated against the pattern by `composite-validate`. */
  decisions: Record<string, string | readonly string[]>;
  /** Each delegated slot → the child composite that fills it, e.g. `{ item: 'ApodCard' }`. Present
   *  only when the pattern delegates (recursive resolution emits one CompositeSpec per node). */
  children?: Record<string, string>;
  labels: readonly CompositeLabel[];
}
