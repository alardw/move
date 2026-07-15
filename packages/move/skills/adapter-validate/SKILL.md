---
name: adapter-validate
description: "Validate an AdapterSpec — the coverage gate: every one of the pattern's itemShape roles is mapped, every `from` names a real field of the referenced api endpoint, and the pattern / api / endpoint all resolve. FAILS when a role is unmapped or a source field is dangling."
user-invocable: true
argument-hint: "[adapter-name]"
---

# Adapter — Validate

The gate for the bridge, symmetric with `api-validate` / `composite-validate`. It checks an
`AdapterSpec` actually fills the pattern's port from the api — that nothing on either side dangles.
Meant to run in `move check`, so a composite can't generate against a half-wired adapter.

---

## How to Run

**Input:** an adapter name (`{adaptersRoot}/{name}.adapter.ts`, `adaptersRoot` = `check.adapters`,
default `src/adapters` — resolved relative to `move.config.json`).

**Output:** findings on stdout. BLOCKER findings fail the adapter.

---

## Checks

### 1 — References resolve
`pattern` resolves to a registered DesignPatternSpec; `api` resolves (a `move` api in `src/apis`, or
a `module` import that exists); `endpoint` is an operation of that api. Any dangling reference is a BLOCKER.

### 2 — Coverage (the gate)
The `mapping` covers **every** role in the pattern's **itemShape** (the `in` roles across the pattern
+ its children). A role with no mapping entry is a **BLOCKER** — the adapter can't fill the port, so
the composite can't be built. Report the missing roles by name.

### 3 — Source fields are real
Every `from` names field(s) that the api endpoint actually returns (for a `move` api, from its
`ApiSpec.fields`; for a `module`, from its exported types). A `from` referencing a non-existent field
is a **BLOCKER** (the mapper would read `undefined`). Transforms (`hdurl ?? url`, `[date, explanation]`)
resolve to their constituent fields.

### 4 — No spare mappings
A `mapping` entry whose `role` isn't in the pattern's itemShape is a WARNING (dead mapping — the
pattern doesn't consume it).

### 5 — Internal contract is fixed
The adapter targets `items(query): AsyncResource<Item[]>` — it does not redefine the query or Item
shape (those come from the pattern). A spec that tries to is a BLOCKER.

---

## Rules
1. **Cover every role or fail** — an unmapped itemShape role is a BLOCKER, never a silent gap.
2. **Every `from` must be a real source field** — dangling references block.
3. **Resolve all three references** — pattern · api · endpoint.
4. **Fixed internal contract** — roles + query come from the pattern; the adapter only maps.
5. **Config-relative** — resolve `check.adapters` against the `move.config.json` that declares it.
6. **Deterministic** — same adapter + pattern + api → same findings.
