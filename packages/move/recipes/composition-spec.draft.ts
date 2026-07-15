/**
 * DRAFT / PROPOSAL (Step 5) — the feature-scope composition shape.
 *
 * This is what `composite-analyze` would emit: the *map*. It's the altitude the
 * current `CompositionSpec` (spec-type.ts) can't reach — it has `composition` /
 * `behaviors` / `integrationPoints` / `labels` (fine for a leaf), but no way to
 * say "these composites exist, this one owns this route, that seam is shared, the
 * chart is a foreign node." Those missing fields are exactly the redesign.
 *
 * Not wired anywhere. A sketch to react to, made concrete against NASA Explorer.
 * Once the shape settles, it folds INTO `CompositionSpec` as the `scope:'feature'`
 * variant (per SESSION §A: one type, three scales — composite / page / feature).
 */

// ── Shared vocabulary (same at every scope) ─────────────────────────────────

/** Where non-Move values/services enter — declared once at the altitude that
 *  owns it; leaf composites reference it by `id`. Tightened to the adapter shape
 *  from §A: kind + contract + default + required + unhappy-flow handling. */
export interface IntegrationPoint {
  id: string;
  kind: 'handler' | 'service' | 'data' | 'asset';
  description: string;
  /** The typed contract a real implementation must satisfy, e.g. `'NasaApi'`. */
  contract: string;
  /** What ships if the app wires nothing: a builtin impl, a no-op, or nothing. */
  default: 'builtin' | 'noop' | 'none';
  required: boolean;
  /** Unhappy flows live here (not a separate field); `layout.when` branches on them. */
  statuses?: { loading?: 'handle' | 'ignore'; error?: 'handle' | 'ignore'; empty?: 'handle' | 'ignore' };
}

/** A declared non-Move structural node — the *measured* escape hatch (ratchet).
 *  No silent non-Move: it's named, counted, and points at the Move component it
 *  should eventually become (a backlog signal). */
export interface ForeignNode {
  id: string;
  library: string;
  reason: string;
  /** The Move component that should absorb it later; a same-name cluster = backlog. */
  wrapTarget?: string;
}

/** Feature-level state that persists across navigation. */
export interface PersistedState {
  id: string;
  description: string;
  persist: 'url' | 'local' | 'session';
}

// ── The feature-scope spec (the map) ────────────────────────────────────────

/** One entry in the composite inventory. A `page` is just a composite that owns
 *  a route — `scope:'page'` is a hint, not a separate primitive (SESSION §A). */
export interface CompositeRef {
  /** The composite's own (leaf) spec name — the class this entry refers to. */
  name: string;
  scope: 'composite' | 'page';
  /** Pages own a route; params are declared in the path. */
  route?: string;
  /** Route params that flow in as props (class → instance wiring). */
  params?: string[];
  /** Which composites place this one — the reuse map that *justifies the boundary*. */
  reusedBy?: string[];
  /** IntegrationPoint ids this composite consumes (traceability seam → consumer). */
  uses?: string[];
}

/** `scope:'feature'` composition: several composites + routing + shared seams.
 *  The structural layer the leaf `CompositionSpec` sits under. */
export interface FeatureSpec {
  schemaVersion: number;
  name: string;
  scope: 'feature';
  /** The inventory: every composite/page in the feature and how it's classified. */
  composites: CompositeRef[];
  /** The shell the routed pages render inside — itself a composite, wrapping the
   *  router outlet. Coarse on purpose; the shell's internals are its own spec. */
  shell: { composite: string; outlet: 'routed' };
  /** Shared seams declared once; `composites[].uses` points back at these ids. */
  integrationPoints: IntegrationPoint[];
  /** Declared, counted non-Move nodes (the ratchet's raw material). */
  foreignNodes: ForeignNode[];
  /** Persisted feature state (URL for filters, local for saved items, …). */
  state: PersistedState[];
}

// ── Worked example: NASA Explorer ───────────────────────────────────────────

export const nasaExplorer: FeatureSpec = {
  schemaVersion: 1,
  name: 'NasaExplorer',
  scope: 'feature',

  composites: [
    { name: 'AppShell', scope: 'composite' }, // sidebar + routed outlet
    { name: 'ApodFeed', scope: 'page', route: '/', uses: ['nasa', 'savedShots', 'dateFilter'] },
    { name: 'ApodDetail', scope: 'page', route: '/apod/:date', params: ['date'], uses: ['nasa', 'savedShots'] },
    // The one genuinely reused leaf — its boundary is justified by `reusedBy`.
    { name: 'ApodCard', scope: 'composite', reusedBy: ['ApodFeed', 'ApodDetail'], uses: ['savedShots'] },
    { name: 'MarsGallery', scope: 'page', route: '/mars', uses: ['nasa'] },
    { name: 'NeoChart', scope: 'page', route: '/neo', uses: ['nasa'] },
  ],

  shell: { composite: 'AppShell', outlet: 'routed' },

  integrationPoints: [
    {
      id: 'nasa',
      kind: 'service',
      description: 'NASA Open APIs — APOD, Mars Rover Photos, Near-Earth Objects.',
      contract: 'NasaApi',
      // builtin = the live api.nasa.gov client (DEMO_KEY); swapping in the mock
      // for CI IS the adapter demo (SESSION §C).
      default: 'builtin',
      required: true,
      statuses: { loading: 'handle', error: 'handle', empty: 'handle' },
    },
    { id: 'router', kind: 'service', description: 'The app router (bring-your-own adapter).', contract: 'Router', default: 'builtin', required: true },
    { id: 'savedShots', kind: 'data', description: 'Saved APOD entries.', contract: 'SavedShotsStore', default: 'builtin', required: false },
    { id: 'dateFilter', kind: 'data', description: 'Active date / range filter.', contract: 'DateFilter', default: 'builtin', required: false },
  ],

  foreignNodes: [
    { id: 'neo-chart', library: 'recharts', reason: 'No Move Chart component yet — the natural chart view.', wrapTarget: 'Chart' },
    { id: 'apod-video', library: 'iframe embed', reason: 'APOD media_type:"video" — no Move embed for external providers.', wrapTarget: 'VideoEmbed' },
  ],

  state: [
    { id: 'dateFilter', description: 'Selected APOD date / range — shareable, so it lives in the URL.', persist: 'url' },
    { id: 'savedShots', description: 'Saved APOD entries — private to the device.', persist: 'local' },
  ],
};
