---
name: api-analyze
description: "Inspect an external API's documentation (a docs page, an OpenAPI/Swagger spec, or a sample JSON response) and emit a typed ApiSpec — the source-access layer (transport · auth · endpoints · native shapes), pattern-agnostic. The first step of bringing a data source in."
user-invocable: true
argument-hint: "[api-name] [docs-url | openapi-url | sample.json]"
---

# API — Analyze

Turn an external API's *documentation* into a typed **`ApiSpec`** — the source-access layer that
every adapter sits on top of. It captures how to *reach* a source (transport, auth, endpoints) and
its *native* response shapes. It is **pattern-agnostic**: no roles, no normalization — that's the
adapter's job. This is the FIRST artifact when a data source comes in, and it is derived **only**
from the source's own docs/spec/sample — **never** from code already in the repo.

---

## How to Run

**Input:** an api name + a description of the API, in whichever form exists:
- a **docs page** (endpoint + a params table + a response-fields table — e.g. the NASA APOD README),
- an **OpenAPI / Swagger** spec (URL or file),
- or a **sample JSON response**.

**Output:** `{apiRoot}/{name}.api.ts` exporting `export const spec = { … } satisfies ApiSpec`,
where `apiRoot` is `check.apis` from the consumer's `move.config.json` (default `src/apis`). Never
hardcode the path.

**REFUSES** if no endpoint or no response shape can be determined from the input.

---

## Process

### Step 1 — Ingest the source description (NEVER the repo)
- **docs page** → parse the base URL, the endpoint(s), the params table, the auth note, and the
  response-fields table.
- **OpenAPI** → read `servers`, `paths` (operations + parameters), `components.securitySchemes`,
  and the response `component` schemas.
- **sample JSON** → infer field names + types from the payload; confirm required/optional with the user.

The point of this step is that the source shape is **discovered from the outside**, not copied from
an existing hand-written client.

### Step 2 — Extract the ApiSpec

| ApiSpec field | from |
|---|---|
| `name` | given (`nasa-apod`) |
| `source` | the API's name / base URL |
| `transport` | `rest` (baseUrl) · `openapi` (spec ref) · `graphql` (schema) |
| `auth` | the **scheme** (`apiKey` in `query`/`header`, `bearer`, `oauth2`) + `secretFrom` = the **env-var name** — never the key itself |
| `headers` | any static headers |
| `endpoints[]` | `name`, `method`, `path`, `params` (name · type · required · default) |
| `fields[]` | the **native** response shape — `name` · `type` · `note`; flag which endpoint returns an **array** (range/list) |

### Step 3 — Security & the secret gate
**Secrets never enter the spec.** Record the auth *scheme* and the env var it reads from
(`secretFrom`, e.g. `VITE_NASA_API_KEY`). The generated code (`api-create`) reads the secret from env.

Then **verify that env var is actually set** in the consumer's `.env.local` (or `.env`). If it's
absent, STOP and guide the consumer to add it — with the key from the API's signup (e.g.
`https://api.nasa.gov/#signUp`); note any DEMO fallback the API allows. A `secretFrom` pointing at a
missing var means the api can't run, so nothing downstream (adapter, composite) can build against it.
**Never write the key into `.env` yourself, and never into the spec** — the consumer adds it. The
hard failure on an absent secret is enforced by `api-validate` / `move check`.

### Step 4 — Write the ApiSpec
`export const spec = { … } as const satisfies ApiSpec` (type from `move`). Present it for confirmation.

---

## The ApiSpec shape

```ts
export interface ApiSpec {
  name: string;                    // 'nasa-apod'
  source: string;                  // 'NASA APOD API'
  transport:
    | { kind: 'rest';    baseUrl: string }
    | { kind: 'openapi'; spec: string }
    | { kind: 'graphql'; schema: string };
  auth?: { kind: 'apiKey'|'bearer'|'oauth2'|'none'; in?: 'query'|'header'; name?: string; secretFrom?: string };
  headers?: Record<string, string>;
  endpoints: { name: string; method: 'GET'|'POST'|'PUT'|'DELETE'; path: string;
               params: { name: string; type: string; required: boolean; default?: string }[];
               returns: string; array?: boolean }[];
  fields: { name: string; type: string; note?: string }[];
}
```

## Worked example — NASA APOD (from its docs, not the repo)

```ts
export const spec = {
  name: 'nasa-apod',
  source: 'NASA APOD API',
  transport: { kind: 'rest', baseUrl: 'https://api.nasa.gov/planetary' },
  auth: { kind: 'apiKey', in: 'query', name: 'api_key', secretFrom: 'VITE_NASA_API_KEY' },
  endpoints: [
    { name: 'apod', method: 'GET', path: '/apod', returns: 'Apod',
      params: [
        { name: 'date',       type: 'string (YYYY-MM-DD)', required: false },
        { name: 'start_date', type: 'string (YYYY-MM-DD)', required: false },
        { name: 'end_date',   type: 'string (YYYY-MM-DD)', required: false },
        { name: 'count',      type: 'integer 1-100',       required: false },
        { name: 'thumbs',     type: 'boolean',             required: false },
      ] },
  ],
  // a date range (start_date/end_date) returns an ARRAY of these:
  fields: [
    { name: 'date',          type: 'string' },
    { name: 'title',         type: 'string' },
    { name: 'explanation',   type: 'string' },
    { name: 'media_type',    type: "'image' | 'video'" },
    { name: 'url',           type: 'string' },
    { name: 'hdurl',         type: 'string?', note: 'omitted if unavailable' },
    { name: 'copyright',     type: 'string?', note: 'omitted for public-domain' },
    { name: 'thumbnail_url', type: 'string?', note: 'video thumbs, when thumbs=true' },
    { name: 'service_version', type: 'string' },
  ],
} as const satisfies ApiSpec;
```

---

## Rules
1. **Inspect the docs / OpenAPI / sample — NEVER the repo.** The source shape is *discovered*, not
   copied from existing hand-written code. (This is the exact cheat this pipeline exists to prevent.)
2. **No secrets in the spec** — the auth *scheme* + an env-var *reference* (`secretFrom`) only.
3. **Native shapes only** — pattern-agnostic; role mapping / normalization is the adapter's job, not this.
4. **Location from config** — write to `check.apis` (default `src/apis`); never assume the path; every config path resolves relative to the `move.config.json` that declares it.
5. **Must `satisfies ApiSpec`** — import the type from `move`.
6. **Deterministic** — the same docs produce the same ApiSpec.
7. **Secret must exist** — after recording `secretFrom`, confirm that env var is present and
   non-empty in `.env.local`/`.env`; flag its absence and guide the consumer to add it. Never write
   the key. `api-validate` turns an absent secret into a hard failure.
