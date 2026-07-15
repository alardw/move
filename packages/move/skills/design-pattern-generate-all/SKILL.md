---
name: design-pattern-generate-all
description: "Run the full design-pattern pipeline: create-spec → validate → generate-docs. (Optionally seed from design-pattern-analyze.) The pattern spec is the artifact — no source/test generation."
user-invocable: true
argument-hint: "[PatternName]"
---

# Design Pattern — Generate All

Orchestrate the design-pattern pipeline in order. Each step reads the output of the last.
Lighter than the component pipeline: a pattern has **no `.tsx`/test to generate** — the
`DesignPatternSpec` IS the artifact, and concrete code is produced later by `composite-create`.

---

## Process

### Step 1 — `/design-pattern-create-spec {Name}`
Authors `packages/move/patterns/{slug}.ts` (`satisfies DesignPatternSpec`). Seed from a
`design-pattern-analyze` report if one exists.

### Step 2 — `/design-pattern-validate {Name}`
Runs the integrity + coverage oracle. **Hard gate** — a BLOCKER (a MISSING binding, a broken
skeleton, a dangling ref) stops the pipeline. Fix the spec and re-run.

### Step 3 — `/design-pattern-generate-docs {Name}`
Registers the pattern in the registry so the catalogue renders it.

---

## Rules
1. **Run in order; stop on failure.** Validate is a hard gate.
2. **Spec is the only artifact** — no source/test. Instantiation is `composite-create`, a separate family.
3. **Each sub-skill's SKILL.md governs its output** — this only orchestrates.
4. **REFUSES** if no decisions/analysis exist for the pattern — `create-spec` needs substance.
