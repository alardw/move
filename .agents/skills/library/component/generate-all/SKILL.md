# Generate All — Full Component Generation Pipeline

Run all generation skills for a component in sequence. Requires an existing spec file.

---

## How to Run

**Input:** A component name (e.g. "Badge", "Checkbox").

**Output:** All generated files written/updated:
- `{Name}.tsx` — component implementation
- `{Name}.module.css` — CSS module styles
- `index.ts` — barrel exports
- `use{Name}.ts` — headless hook (if spec declares `hasHook: true`)
- `{Name}.meta.ts` — component metadata
- `demo/src/recipes/component/{Name}Recipes.tsx` — recipe file
- `demo/src/demos/generated/{Name}Demo.tsx` — demo file (playground)
- `{Name}.test.tsx` — test file
- `{Name}.report.md` — validation report
- `src/index.ts` — updated with component exports

**REFUSES if:** `{Name}.spec.ts` does not exist. Run `/spec {Name}` first.

---

## Process

Run these skills in order. Each step must complete before the next begins, because later steps read files produced by earlier ones.

### Step 1 — `/generate-source {Name}`
Generates `.tsx`, `.module.css`, `index.ts`, `use{Name}.ts` (if applicable), updates `src/index.ts`.

Pre-check before Step 1:
- Read `{Name}.spec.ts` and verify `defaultReview.status === 'approved'`.
- If missing, stop immediately and refuse generation with instruction to re-run `/spec {Name}` and complete default review.

### Step 2 — `/generate-meta {Name}`
Generates `.meta.ts` from the component source.

### Step 3 — `/generate-recipe {Name}`
Generates `demo/src/recipes/component/{Name}Recipes.tsx` — curated usage examples (recipes).

### Step 4 — `/generate-demo {Name}`
Generates `demo/src/demos/generated/{Name}Demo.tsx` — interactive playground (simplified, no sections).

### Step 5 — `/generate-test {Name}`
Generates `.test.tsx` from the spec and component source.

### Step 6 — `/validate {Name}`
Validates all generated files and writes `.report.md`.

If `/validate` returns any BLOCKER failures, stop pipeline immediately and report them as generation failures (do not continue to acceptance).

### Step 7 — Delta report (if original exists)

Search for `original-components/**/{Name}/{Name}.tsx`. If found, compare the generated output against the original and report meaningful deltas:

- **Token values** that changed (e.g. hardcoded → token, or different token)
- **CSS properties** added, removed, or changed
- **Props** added or removed
- **Structural changes** (different element, slots, compound pattern)

Output the delta summary to stdout after the validation report. Focus on **what changed and why** (contract conformance), not line-by-line diffs.

Skip this step if no original exists.

---

## Rules

1. **Run in order** — each step depends on output from previous steps
2. **Stop on failure** — if any step fails, report the failure and stop
2a. **Validate is a hard gate** — BLOCKER findings from `/validate` are treated as step failure
3. **Follow each skill's own rules** — this skill only orchestrates; each sub-skill's SKILL.md governs its output
4. **Spec must already exist** — this skill does not generate or modify specs
5. **Default review must be approved** — refuse pipeline when spec lacks approved `defaultReview`
6. **No hand-edited generated artifacts** — component/demo/test/meta output files must be produced by generation skills, not manual patching
