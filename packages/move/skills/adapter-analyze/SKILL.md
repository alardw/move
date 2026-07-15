---
name: adapter-analyze
description: "Bridge a pattern to a data source: read the pattern's itemShape roles (fixed internal side) + an ApiSpec endpoint's native fields (variable external side), propose the field→role mapping, and emit a typed AdapterSpec. The thin normalizer between an api and a pattern."
user-invocable: true
argument-hint: "[adapter-name] [pattern-slug] [api-name] [endpoint]"
---

# Adapter — Analyze

Author the **bridge**. An adapter has two faces — a **fixed internal** side (the pattern's roles,
exposed as `items(query): AsyncResource<Item[]>`) and a **variable external** side (an `ApiSpec`
endpoint's native fields). This skill reads both and proposes the mapping between them, emitting an
`AdapterSpec`. It writes **no fetch/auth code** (that's the api) and does **no normalization logic**
here (that's `adapter-create`) — it just decides *which source field fills which role*.

**"Different shapes per adapter" is entirely captured by the two references + the mapping** — the
structure is identical for every adapter; only `(pattern × api+endpoint)` and the per-role mapping differ.

---

## How to Run

**Input:** an adapter name + a `pattern` slug + an `api` name + the `endpoint` to use.

**Output:** `{adaptersRoot}/{name}.adapter.ts` — `export const spec = { … } satisfies AdapterSpec`
(`adaptersRoot` = `check.adapters`, default `src/adapters`; read the config, never hardcode).

**REFUSES** if the pattern, api, or endpoint doesn't resolve, or if a required role has no plausible
source field to map (surface it — the adapter can't fill the port).

---

## Process

### Step 1 — Load both sides
- **Internal (fixed):** the pattern's **itemShape** — the `in` roles across the pattern + its children
  (`media`, `title`, `meta`, `sortKey`, …). These are the roles the adapter MUST fill.
- **External (variable):** the source api's `endpoint` and its native `fields`. The api is either a
  **move** ApiSpec (by name, from `src/apis`) **or an existing module** you point to explicitly
  (`api: { kind: 'module', import: '../services/nasa', export: 'nasa' }`) — the "skip `api-create`,
  map the real api" case. For a module, read its exported types for the endpoint's native shape.

### Step 2 — Propose the mapping (role ← field)
For each role, pick the source field(s) by name + type, and note any transform:
- direct: `title ← title`
- pick / fallback: `media ← hdurl ?? url`
- combine: `meta ← [date, explanation]`
- format/derive: `sortKey ← date` (a sortable key)
Present the proposal; the consumer confirms/adjusts (analyze is human-in-loop).

### Step 3 — Coverage
**Every** itemShape role must have a mapping entry. A role with no source field is a finding — either
the endpoint is wrong, or the source genuinely lacks it (a real gap). `adapter-validate` enforces this.

### Step 4 — Write the AdapterSpec
```ts
export const spec = {
  name: 'apod-gallery',
  pattern: 'item-gallery',
  api: { kind: 'move', name: 'nasa-apod' }, // or { kind: 'module', import: '../services/nasa', export: 'nasa' }
  endpoint: 'apod',
  mapping: [
    { role: 'media',   from: 'hdurl ?? url', transform: 'prefer hi-res, else standard' },
    { role: 'title',   from: 'title' },
    { role: 'meta',    from: '[date, explanation]', transform: 'date + caption' },
    { role: 'sortKey', from: 'date' },
  ],
} as const satisfies AdapterSpec; // from 'move'
```

---

## Rules
1. **Roles come from the pattern, fields from the api** — read both; invent neither.
2. **Cover every role** — a missing mapping is a finding, not a silent omission.
3. **Mapping only — no code** — no fetch, no auth, no `AsyncResource` here; that's the api (below) and
   `adapter-create` (the mapper). Keeps the adapter thin and the shape-difference declarative.
4. **Location from config** — `check.adapters` (default `src/adapters`); never hardcode; every config path resolves relative to the `move.config.json` that declares it.
5. **Must `satisfies AdapterSpec`** — import the type from `move`.
6. **Deterministic proposal** — same pattern + api endpoint → same proposed mapping.
