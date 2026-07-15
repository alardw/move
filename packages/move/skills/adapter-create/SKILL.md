---
name: adapter-create
description: "Generate the thin adapter from an AdapterSpec — a mapper that calls one api endpoint, applies the field→role mapping, and exposes items(query): AsyncResource<Item[]> (the pattern's fixed internal port). Plus fixtures + tests. All HTTP/auth lives in the api below it."
user-invocable: true
argument-hint: "[adapter-name]"
---

# Adapter — Create

Generate the **bridge code** from an `AdapterSpec`. The result is deliberately tiny: it calls **one
api endpoint**, applies the **field→role mapping**, and wraps the result in Move's **`AsyncResource`**
to expose the pattern's fixed internal port — `items(query): AsyncResource<Item[]>`. All transport,
auth, and retries live in the api below it; all design lives in the pattern above it. The adapter is
just the normalizer, so swapping sources (or endpoints) is a small, isolated change.

---

## How to Run

**Input:** an `AdapterSpec` (`{adaptersRoot}/{name}.adapter.ts`), from `adapter-analyze`.

**Output**, under `check.adapters` (default `src/adapters`):
- `{name}.ts` — the mapper: `(api) => Source<Item>` with `items(query)`;
- `{name}.fixtures.ts` — sample `Item[]` (derived from the api's native fixtures via the mapping);
- `{name}.test.ts` — the mapping + the four `AsyncResource` states.

**REFUSES** if the `AdapterSpec` doesn't cover every role of the pattern's itemShape, or a `from`
names a field the api endpoint doesn't return (run `adapter-validate` first).

---

## Process

### Step 1 — Load the three inputs
The `AdapterSpec` (the mapping), the referenced `api` (the endpoint method + native types), and the
`pattern` (the `Item` role type it must produce).

### Step 2 — Emit the mapper
For the chosen `endpoint`, generate one `items(query)` that:
1. calls `api.{endpoint}(query)` (native rows in);
2. maps each row → `Item` by the `mapping` (`role ← from`, applying each `transform`);
3. wraps the whole call in `AsyncResource` so a rejected fetch becomes the resource's `error`, an
   empty result its `empty`, data its `ready` — feeding the composite's Feedback lane directly.
```ts
export const apodGalleryAdapter = (api: NasaApi): Source<Item> => ({
  items: (q) => asyncResource(() =>
    api.apod(q).then(rows => rows.map(r => ({
      media:   r.hdurl ?? r.url,
      title:   r.title,
      meta:    [r.date, r.explanation],
      sortKey: r.date,
    })))),
});
```

### Step 3 — Fixtures
Map the api's native fixtures through the same mapping → `Item[]` fixtures, so composites/tests run
offline with no live api.

### Step 4 — Tests
- the mapping: a native fixture row → the expected `Item` (each role, each transform);
- the states: rejected api call → `error`; `[]` → `empty`; rows → `ready`.
Mock the api; never hit the network.

---

## Rules
1. **Thin** — no fetch, no auth, no URL building; call the api and map. All HTTP is the api's job.
2. **Fill every role** — the emitted `Item` has exactly the pattern's itemShape roles; a gap is a
   refusal, not an `undefined`.
3. **`AsyncResource` always** — the internal port is `items(query): AsyncResource<Item[]>`; this is
   what gives the composite its `pending/error/empty/ready` Feedback for free, consistently.
4. **Fixtures always** — offline dev + tests.
5. **Deterministic** — same `AdapterSpec` (+ api + pattern) → same mapper.
6. **Location from config** — `check.adapters`; never hardcode; every config path resolves relative to the `move.config.json` that declares it.
