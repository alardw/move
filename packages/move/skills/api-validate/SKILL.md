---
name: api-validate
description: "Validate an ApiSpec — well-formed (transport · endpoints · fields) AND every auth secret it references (secretFrom) is present in .env.local/.env. FAILS when a required key is absent, so nothing downstream builds against an unreachable source."
user-invocable: true
argument-hint: "[api-name]"
---

# API — Validate

The gate for the api layer, symmetric with `component-validate` / `composite-validate`. It checks an
`ApiSpec` is well-formed AND that its source is actually reachable — specifically that every secret it
references exists. Meant to run in `move check`, so an api with a missing key can't silently pass.

---

## How to Run

**Input:** an api name (`{apiRoot}/{name}.api.ts`, `apiRoot` = `check.apis`, default `src/apis`).

**Output:** findings on stdout. BLOCKER findings fail the api.

---

## Checks

### 1 — Well-formed
`transport` present; ≥1 `endpoint` (each with `method` · `path` · `returns`); ≥1 `field`; every
endpoint's `returns` names a shape; params are typed. A malformed spec is a BLOCKER.

### 2 — No secret literals
The spec contains only `secretFrom` env-var **names**, never a key value. A string that looks like a
real key (long token, `AIza…`, a UUID in an auth field) is a **BLOCKER** — secrets never get committed.

### 3 — Secret present  ← the gate you asked for
For **every** `auth.secretFrom`, the env var must be **defined and non-empty** in the env file(s)
declared by `move.config.json` `env` (a path or list; default `[".env.local", ".env"]`), else the
process env (`process.env` / `import.meta.env`). **Absent → BLOCKER.** A `secretFrom` pointing at an
undefined var means the api can't run, so no adapter or composite may generate against it. Check
*presence only* — never read, log, or echo the value.

### 4 — Auth scheme complete
`apiKey` has `in` + `name` + `secretFrom`; `bearer`/`oauth2` has `secretFrom`; `none` has no secret.

### 5 — Reachability (advisory)
If a `transport.kind: 'openapi'` `spec` URL/path is given, warn (not block) if it can't be resolved.

---

## Rules
1. **An absent secret is a BLOCKER, not a warning** — this is the whole point: `move check` fails when
   `VITE_NASA_API_KEY` (or whatever `secretFrom` names) isn't in `.env.local`/`.env`/env.
2. **Never read or print the secret value** — presence check only (`in env && non-empty`).
3. **Env location from config** — read `move.config.json` `env` (path or list; default
   `[".env.local", ".env"]`) in order, then `process.env` / `import.meta.env`. Never assume a fixed file.
4. **No key literals in the spec** — catch a committed secret and block it.
5. **Deterministic** — same spec + same env → same findings.

> Ships in `move check` so CI fails when a data source's key is missing — the api-layer half of the
> "generation refuses unless every data source is in place" gate.
