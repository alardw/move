// adapter-spec.ts — the AdapterSpec type: the bridge layer of the pipeline.
//
// An adapter is two-faced:
//   • INTERNAL (consistent) — the port it fills: the PATTERN's roles, exposed as
//     `items(query): AsyncResource<Item[]>`. Identical shape for every adapter of a pattern.
//   • EXTERNAL (variable)   — an ENDPOINT of an ApiSpec, whose native fields differ per source.
// The adapter is the MAPPING between them. "Different shapes per adapter" is captured entirely
// by the (pattern × api+endpoint) references + the per-role mapping — the structure never changes.
//
// Produced by `adapter-analyze` (pattern roles + api fields → proposed mapping) and consumed by
// `adapter-create` to emit the thin mapper + fixtures + tests. Exported from `move` so a
// consumer's `{name}.adapter.ts` can `satisfies AdapterSpec`.

/** One role of the pattern's Item, filled from the source. `from` names the api field(s);
 *  `transform` notes any pick/combine/format (e.g. `hdurl ?? url`, `[date, explanation]`). */
export interface AdapterMapping {
  role: string; // an itemShape role of the pattern (media · title · meta · sortKey …)
  from: string; // source field(s) from the api endpoint's native shape
  transform?: string; // optional: how they combine into the role
  note?: string;
}

/** Where the source api comes from.
 *  · `move`   — a pipeline ApiSpec, by name (resolves to `{apisRoot}/{name}.api.ts`).
 *  · `module` — an EXISTING, non-move api referenced by import path (a project file or an npm
 *    package) + the export to call. This is the "skip api-create, map the existing api" case:
 *    a real SDK / generated client / established service the consumer already owns. Point to the file. */
export type ApiRef =
  | { kind: 'move'; name: string } // 'nasa-apod'
  | { kind: 'module'; import: string; export?: string }; // '../services/nasa' · '@octokit/rest'

export interface AdapterSpec {
  name: string; // 'apod-gallery' — what a composite references
  /** The pattern whose itemShape defines the INTERNAL roles this must fill (the fixed side). */
  pattern: string; // 'item-gallery'
  /** The source api (the EXTERNAL side) — a move ApiSpec by name, or an explicit module/file. */
  api: ApiRef;
  /** The operation to call on the api — `api.{endpoint}(query)`. For a `move` api it's an ApiSpec
   *  endpoint name; for a `module` it's the exported method (e.g. `getApodRange`). */
  endpoint: string;
  /** external field(s) → internal role. Must cover EVERY role of the pattern's itemShape. */
  mapping: readonly AdapterMapping[];
}
