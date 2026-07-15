---
name: design-pattern-generate-docs
description: "Register a design pattern in the pattern registry so the docs catalogue (overview + detail) renders it. The detail page derives axes / skeleton / bindings / heuristics from the spec automatically."
user-invocable: true
argument-hint: "[PatternName]"
---

# Design Pattern — Generate Docs

Publish a pattern into the docs catalogue. Unlike a component (which authors prose +
samples), a pattern's detail page is **fully derived from its `DesignPatternSpec`** — axes,
the nested skeleton with inline bindings, and heuristics all render from the spec. So this
step is just **registry wiring**: nothing bespoke to author.

---

## How to Run

**Input:** a pattern name whose spec exists at `packages/move/patterns/{slug}.ts`.
**Output:** an updated entry in `packages/move/patterns/registry.ts` — `status: 'available'`
with `spec: {camelName}` — so the overview lists it and the detail page (`/design-patterns/{slug}`)
renders it. No files in `packages/docs` are authored per pattern.

---

## Process

1. **Import the spec** into `registry.ts` (`import { {camelName} } from './{slug}';`).
2. **Set the registry entry** for the slug to `available` with `spec: {camelName}` — filling
   `group`, `title`, `description` (from `spec.intent`), `synonyms` (from `spec.synonyms`),
   and `scale`. If the slug was a `planned(...)` stub, replace it with the full entry.
3. **Verify** `npm run typecheck -w move` + `npm run typecheck -w docs` (the detail page reads
   the spec via `@move-patterns`), and `check:conformance -w docs`.

---

## Rules
1. **No per-pattern docs prose or samples** — the detail page derives everything from the spec.
2. **`available` requires a passing `design-pattern-validate`** — don't publish an incomplete spec.
3. **One registry entry per slug** — a duplicate slug collides the route + overview card.
4. **Sub-patterns are patterns too** — Filter, MediaTile get their own registry entry + detail page.
