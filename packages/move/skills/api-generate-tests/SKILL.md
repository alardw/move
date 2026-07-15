---
name: api-generate-tests
description: "Generate tests for an api from its ApiSpec — a THIN mocked smoke (fixtures parse · happy + error path) plus a GATED live contract test that hits each real endpoint and asserts the response matches the spec's fields. The live test carries the weight; the mock is largely circular for generated code."
user-invocable: true
argument-hint: "[api-name]"
---

# API — Generate Tests

Emit the tests for a generated api, separate from its source (symmetric with
`component-generate-test`). Be honest about what each kind buys, because for **generated** api code a
mocked test is close to circular — the code and the mock both come from the same `ApiSpec`, so it
can't catch a wrong spec or upstream drift. The **live contract test** is the one that earns its keep.

---

## How to Run

**Input:** an api name (`{apisRoot}/{name}.api.ts` + its `{name}.fixtures.ts`).

**Output** under `check.apis` (relative to `move.config.json`):
- `{name}.test.ts` — the thin mocked smoke (runs in CI);
- `{name}.live.test.ts` — the live contract test (gated; skipped in CI by default).

---

## Process

### The mocked smoke (`{name}.test.ts`) — keep it thin
Mock `fetch`. Its job is NOT to re-prove code↔spec (generation guarantees that); it's to cover the
narrow residue:
- **fixtures parse** — each `{name}.fixtures.ts` record parses into its native type (adapter +
  composite tests depend on this);
- **one happy path** — a mocked 200 → the native shape;
- **one error path** — a mocked non-2xx → a thrown/typed error (so the adapter's `AsyncResource`
  can resolve to `error`);
- **any hand-written logic** the spec didn't fully determine (a custom transform, pagination cursor).
Don't generate an exhaustive per-endpoint mock — that just restates the generator.

### The live contract test (`{name}.live.test.ts`) — the real value
**Gated**: skips unless `RUN_LIVE_API_TESTS` is set AND the auth `secretFrom` env var is present.
For **every** `ApiSpec.endpoints` entry:
- call the **real** base URL with the env secret + representative params;
- assert the response **matches `ApiSpec.fields`** — each declared field is present with its declared
  type; optional fields (`?`) may be absent; an `array: true` endpoint returns an array.
This is the claim-vs-reality check: your `ApiSpec` asserts the API's shape, and this proves it against
the live API — catching the wrong-spec and upstream-drift cases the mock can't.

---

## Rules
1. **The live test is primary** — it's the only one that catches a wrong spec or upstream drift; the
   mock is a thin smoke, not a per-endpoint suite (that would be circular for generated code).
2. **Gate the live test** — off unless `RUN_LIVE_API_TESTS` + the secret are present; never fail CI on
   network/rate-limit/missing-key.
3. **Secrets from env** — the live test reads `secretFrom`; never inline a key; never log the value.
4. **Assert against `ApiSpec.fields`** — the live test's assertions come from the spec, so the spec
   stays the single source of truth.
5. **Fixtures are validated** — the mock proves the fixtures parse, since downstream layers rely on them.
6. **Config-relative, deterministic** — write under `check.apis` (relative to `move.config.json`); the
   mocked test is deterministic (the live one is not, hence gated).
