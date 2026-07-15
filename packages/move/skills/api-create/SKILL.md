---
name: api-create
description: "Generate the source-access code from an ApiSpec — typed native shapes + endpoint methods (fetch · auth-from-env · params · error handling) + fixtures. Pattern-agnostic; the adapter maps it to roles later. Delegates to OpenAPI codegen when a spec exists, else emits a thin fetch wrapper. Tests are api-generate-tests."
user-invocable: true
argument-hint: "[api-name]"
---

# API — Create

Generate the **source-access code** from an `ApiSpec`: the typed native response types and the
endpoint methods that fetch, authenticate (from env), pass params, and normalize errors — plus
fixtures. This layer is **pattern-agnostic**: it returns the source's *native* shapes
(`Apod`, not `{ media, title }`). The **adapter** maps those to a pattern's roles afterward.
Tests are a separate step — `api-generate-tests` (a thin mock + the gated live contract test).

The api is a first-class generated artifact — the thing a hand-written `nasa.ts` *should* have been.

---

## How to Run

**Input:** an `ApiSpec` (`{apiRoot}/{name}.api.ts`), produced by `api-analyze`.

**Output**, written under `check.apis` from `move.config.json` (default `src/apis`):
- `{name}.ts` — the native types + the api object (endpoint methods) + a `Provider`/factory;
- `{name}.fixtures.ts` — sample records so dev + tests never hit the live API.

Tests are `api-generate-tests` (mocked smoke + gated live contract), not this skill.

**REFUSES** if the `ApiSpec` is incomplete — no endpoints, or an auth scheme with no `secretFrom`.

---

## Process

### Step 1 — Load the ApiSpec
Read `{name}.api.ts`. It fixes the transport, auth, endpoints, and native fields.

### Step 2 — Emit the native types
One interface per response shape, from `fields` (optional fields → `?`). No pattern roles here.

### Step 3 — Emit the access code, by transport
- **`openapi`** → **delegate** to an OpenAPI generator (`openapi-typescript` / `orval`) for the typed
  client, then wrap each used operation with auth-from-env. Don't re-implement HTTP.
- **`rest`** → a thin fetch wrapper: `baseUrl` + one method per endpoint (`method` + `path` +
  serialize `params`) + auth applied per `auth` (`apiKey` in `query`/`header`, `bearer`, …) reading
  the secret from `secretFrom`. An `array: true` endpoint returns `T[]`.
- **`graphql`** → a typed operation per endpoint against the schema.
Each method **throws on non-2xx** (or returns a typed error) so the adapter can wrap it in
`AsyncResource`. The api itself does NOT depend on Move.

### Step 4 — Fixtures
Emit representative sample records typed as the native shapes — enough for the adapter's fixtures
and the composite's tests to run offline.

### Step 5 — Secrets from env
The key is read from `secretFrom` at runtime (e.g. `import.meta.env.VITE_NASA_API_KEY`), with a
documented dev fallback where the API allows one (NASA's `DEMO_KEY`). **Never inline a key.**

---

## Rules
1. **Deterministic** — the same `ApiSpec` produces the same code.
2. **Secrets from env only** — read `secretFrom`; never inline a key or commit one.
3. **Native shapes, pattern-agnostic** — no roles, no `AsyncResource`, no Move imports here; that's
   the adapter's layer. This keeps the api reusable across many adapters.
4. **Fixtures always** — dev + tests run without the live API.
5. **Delegate, don't reinvent HTTP** — OpenAPI codegen when a spec exists; a thin fetch wrapper only
   for ad-hoc REST.
6. **Location from config** — `check.apis` (default `src/apis`); never assume the path; every config path resolves relative to the `move.config.json` that declares it.
7. **Errors surface** — non-2xx becomes a thrown/typed error so the adapter's `AsyncResource` can
   resolve to the composite's Feedback `error` state.
