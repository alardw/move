# SESSION — Conformance & the two-contract model (docs)

Handoff for continuing in a fresh terminal. Branch: **dev**.

## The spine (mental model)

Everything in Move is a **component** or a **composite** — that's the whole system.

- A **component** is **standard** (Move ships it) or **custom** (you generate it via the pipeline). Same contract either way.
- A **composite** is your composition of components — a screen, a feature, a shared piece. A **recipe is a pattern that acts as inspiration for consumer composites** — a Move-built composition you read and adapt into your own. Recipe and composite are both compositions, so both share the one `CompositionSpec` contract.
  - **What's documented:** Move's **components AND recipes** both get doc pages generated from their specs (`ComponentDocPage` at `/components/:slug`; `RecipeDetailPage` at `/recipes/:group/:slug` — preview, built-with, behaviors, integration points). A **consumer's own composites are NOT documented today** — but because a composite is spec-driven (same `CompositionSpec`), the same machinery could document a team's codebase "for free" in future. (Nice forward-looking selling point; keep it OUT of live docs until it's real.)
  - **Why the Composition Contract page has no "Publishing" section:** that page documents a composite's *substance* (`CompositionSpec`) — what any composite, private or shipped, has. The doc-listing metadata (`DocumentSpec`/`RecipeDocument`: slug/group/preview) is how Move *publishes its recipes into the `/recipes` gallery + detail pages*; a private composite has substance without it. Keep that split — don't put `DocumentSpec` on the contract page. (Do NOT repeat the earlier wrong claim that "recipes aren't documented" — they are.)
- Each is governed by **one typed spec/contract** that does four jobs: builds the code, generates the tests, guides the AI, and checks your work.
  - Component → `ComponentSpec` (`packages/move/src/spec-type.ts`) → **Component Contract** page
  - Composite → `CompositionSpec` (`packages/move/recipes/spec-type.ts`) → **Composition Contract** page (new this thread)

**Conformance** = keeping a whole app true to those contracts. Two kinds of gate:

- **Static** — `npx move check` (purity + composition-spec-drift + strict-props). Reads source as text/AST, ships in the CLI, installs nothing. For a consumer it scans **`src/composites`** (the `/app-compose` output) — *not* Move's internal `components/recipes/samples`.
- **Render-time** — the a11y sweep. Renders components + runs axe, so it must live in the repo as a test. Delivered by **scaffolding** (`/app-setup` + `create-move-app`), not a bare command.

**Ratchet** = betterer-style baseline. Persists per-file/per-entry, per-rule violation **counts** (robust to line shifts). New count > baseline fails; ≤ baseline tolerated; re-snapshot to shrink; only ever shrinks. Two axes, two baselines:
- `app-conformance` (hand-rolling: raw HTML / inline styles / CSS modules) — baseline **265**
- `a11y` (axe: roles/names/ARIA) — baseline **40** (21 entries)

## Done & committed (branch dev)

- `c393f43` — a11y sweep converted to a ratchet, gated in docs CI (`test:a11y`), baseline 40.
- `8cf7c0c` — Conformance Model page + composites framing (`/ai/conformance` config → `src/composites`; getting-started reflects the model; dropped an `alert()`).
- **(final commit this thread)** — Composition Contract page, HowMoveWorks copy rework, Dogfooding section removed.

Pages/routes (all under Core Concepts in `nav.ts`):
- `/core-concepts/component-contract` — ComponentContractPage (pre-existing, the template)
- `/core-concepts/composition-contract` — **CompositionContractPage** (new)
- `/core-concepts/conformance-model` — **ConformanceModelPage** (new)
- `/ai/conformance` — consumer pitch + gate reference (config now `composites`)

## Verified green

`npm run typecheck --workspace docs` clean · app-conformance `265 · 0 new` · a11y `40 · 0 new`. Both new pages are **dogfood-pure** (`<Text as="em">` not `<em>`, no inline styles) so they hold at baseline.

## Open / next steps

1. **Build the render-time scaffolding** (decided: **app-setup skill + create-move-app** emit `move.config.json` + the a11y ratchet test + baseline + CI step). NOT built yet — the docs currently describe it as the intended model.
2. **Burn down the baselines** page-by-page. The 265 surfaces the missing-Move-component backlog (Quote/Blockquote, table primitives). The 40 surfaces mechanical a11y gaps.
3. **Terminology consistency** — `OverviewPage.tsx` + `CoreConceptsOverviewPage.tsx` still say "building blocks"; this thread only shifted HowMoveWorks + the contract pages to "components." Align if wanted.
4. Optional: extend Prettier to docs; a getting-started conformance page.

## Copy / style rules the user enforced this thread (apply going forward)

- **Positive framing** — say what a thing DOES; never lead with the failure mode it prevents (no "an app can drift"). Applies to taglines/positioning, not just feature copy.
- **No meta in reader-facing docs** — the reader doesn't care that Move dogfoods (Dogfooding section was cut). The one Claude quote on HowMoveWorks "Why it matters" is wanted — keep it.
- **"component", never "building block" / "block"** — the sole exception is the section title "The building blocks" on HowMoveWorks.
- **"composites", not "screens"** — the consumer's unit is composites.
- **No "the tenth thing stays as coherent as the first"** — user dislikes that cliché.
- **A consumer has no "library" or "docs"** — don't frame their components/composites that way.
- **"builds the code", not "builds the block".** No `alert()` in samples.

## Key files

- Specs: `packages/move/src/spec-type.ts` (ComponentSpec), `packages/move/recipes/spec-type.ts` (CompositionSpec)
- Shipped consumer checks: `packages/move/checks/{purity,composition-spec-drift,strict-props,_config}.mjs`; registry in `packages/move/bin/cli.mjs` (`move check`). Config resolver defaults include `composites: src/composites`.
- Dogfood ratchets: `packages/move/scripts/checks/app-conformance.mjs` + `packages/docs/app-conformance.baseline.json`; `packages/docs/src/a11y-sweep.test.tsx` + `packages/docs/src/a11y.baseline.json`
- CI: `.github/workflows/checks.yml` — docs job runs typecheck + check:conformance + test:a11y

## Verify / re-snapshot commands

```
cd packages/docs && npm run typecheck
npm run check:conformance --workspace docs           # static ratchet (265)
npm run test:a11y --workspace docs                   # a11y ratchet (~70s)
A11Y_UPDATE=1 npx vitest run src/a11y-sweep.test.tsx # re-snapshot a11y baseline
node packages/move/scripts/checks/app-conformance.mjs --update  # re-snapshot conformance baseline
```
