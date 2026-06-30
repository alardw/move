---
name: recipe-generate-all
description: "Run the full recipe pipeline: source, docs, test, validate. Requires a spec."
user-invocable: true
argument-hint: "[RecipeName]"
---

# Recipe Generate All — Full Recipe Generation Pipeline

Run all recipe generation skills in sequence. Requires an existing spec. This
skill only orchestrates — each sub-skill's SKILL.md governs its output.

---

## How to Run

**Input:** A recipe name (e.g. "SignIn").

**Output:** all recipe artifacts written/updated:
- `{Name}.tsx` — the recipe (only Move components)
- `registry.ts` — registered (overview card + detail route)
- `{Name}.test.tsx` — tests from spec behaviors

**REFUSES if:** `{Name}.spec.ts` does not exist. Run
`/recipe-create-spec {Name}` first.

---

## Process

Run in order — each step reads files produced by earlier ones.

**Pre-check:** Read `{Name}.spec.ts`. If missing, stop and refuse with
instructions to run `/recipe-create-spec {Name}` first.

### Step 1 — `/recipe-generate-source {Name}`
Emits `{Name}.tsx` from the spec (only Move components, all labels + behaviors +
integration-point stubs).

### Step 2 — `/recipe-generate-docs {Name}`
Registers the recipe in `registry.ts`, deriving metadata (incl. `synonyms`) from
the spec.

### Step 3 — `/recipe-generate-test {Name}`
Generates `{Name}.test.tsx` from the spec's behaviors and integration points.

### Step 4 — `/recipe-validate {Name}`
Validates purity + spec parity + registry + tests (findings print to stdout; no file).

If `/recipe-validate` returns any BLOCKER, stop the pipeline immediately and
report it as a generation failure.

> `/recipe-analyze` is intentionally NOT part of this pipeline — it's optional
> up-front research that feeds `/recipe-create-spec`, run before the spec exists.

---

## Rules

1. **Run in order** — each step depends on the previous step's output.
2. **Spec must already exist** — this skill never creates or
   edits the spec.
3. **Stop on failure** — any step failure (especially a validate BLOCKER) halts
   the pipeline.
4. **Validate is a hard gate** — BLOCKER findings are a pipeline failure.
5. **Follow each sub-skill's rules** — this skill only orchestrates.
6. **No hand-edited generated artifacts** — source/test/registry output comes
   from the skills, not manual patching.
