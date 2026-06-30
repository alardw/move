---
name: component-generate-all
description: "Run full generation pipeline for a Move component: source, meta, test, validate. Requires spec."
user-invocable: true
argument-hint: "[ComponentName]"
---

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
- `{Name}.test.tsx` — test file
- `src/index.ts` — updated with component exports

**REFUSES if:** `{Name}.spec.ts` does not exist. Run `/component-create-spec {Name}` first.

---

## Process

Run these skills in order. Each step must complete before the next begins, because later steps read files produced by earlier ones.

### Step 1 — `/component-generate-source {Name}`
Generates `.tsx`, `.module.css`, `index.ts`, `use{Name}.ts` (if applicable), updates `src/index.ts`.

Pre-check before Step 1:
- Read `{Name}.spec.ts` and verify `defaultReview.status === 'approved'`.
- If missing, stop immediately and refuse generation with instruction to re-run `/component-create-spec {Name}` and complete default review.

### Step 2 — `/component-generate-meta {Name}`
Generates `.meta.ts` from the component source.

### Step 3 — `/component-generate-test {Name}`
Generates `.test.tsx` from the spec and component source.

### Step 4 — `/component-generate-docs {Name}`
Generates the `packages/docs` content folder (`meta.ts`, `samples/*.tsx`,
`index.ts`) and registers the slug. Derives the API/tokens tables from the spec
automatically. Skip only if the docs app is absent.

> Replaces the removed `generate-recipe`/`generate-demo` skills, which targeted
> the old `demo/` app. Bespoke `/animation/*` concept pages are still authored by
> hand (see repo `notes/TODO.md`).

### Step 5 — `/component-validate {Name}`
Validates all generated files (findings print to stdout; no `.report.md` is written).

If `/component-validate` returns any BLOCKER failures, stop pipeline immediately and report them as generation failures (do not continue to acceptance).

### Step 6 — Delta report (if original exists)

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
2a. **Validate is a hard gate** — BLOCKER findings from `/component-validate` are treated as step failure
3. **Follow each skill's own rules** — this skill only orchestrates; each sub-skill's SKILL.md governs its output
4. **Spec must already exist** — this skill does not generate or modify specs
5. **Default review must be approved** — refuse pipeline when spec lacks approved `defaultReview`
6. **No hand-edited generated artifacts** — component/test/meta output files must be produced by generation skills, not manual patching
