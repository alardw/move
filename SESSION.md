# SESSION — Conformance & the two-contract model (docs)

Handoff for continuing in a fresh terminal. Branch: **dev**.

---

# ⭐ ACTIVE THREAD (read this first — supersedes older sections below)

We moved from docs into **redesigning `CompositionSpec`**, decided to **pressure-test it by building a real example app**, and in doing so **pivoted the scaffolding story**. Current state:

## A. CompositionSpec redesign — PAPER SKETCH (in the docs page, NOT in the real type)

The live `CompositionSpec` (`packages/move/recipes/spec-type.ts`) is unchanged (old loose `behaviors`-bag). The **proposed richer shape** is rendered on `/core-concepts/composition-contract` (`packages/docs/src/pages/core-concepts/CompositionContractPage.tsx`, **uncommitted**) with ForgotPassword as the worked example. It mirrors `ComponentSpec`'s factoring, one scale up:

- `composition` (allow-list) · `layout` · `props` (public API) · `state` · `interactions` · `integrationPoints` · `testing` (was flat `behaviors`) · `labels`
- **`layout`** = a *bounded* tree: `{ component, props (layout-only), bind:{label|state|prop|integration}, when, each, custom, children }`. `when` gates on state OR an async seam status; `each` repeats over a named list/derivation; `custom` = declared escape hatch (not checked). Bounded on purpose — full fidelity = re-encoding JSX, which we rejected.
- **`state`** gains `persist?: 'url' | 'local' | 'session'`. **`interactions`** = transitions + derivations (e.g. `paged`) that `layout.each` binds to.
- **`integrationPoints`** tightened to the adapter shape: `kind: handler|service|data|asset`, `contract`, `default: builtin|noop|none`, `required`, and **`statuses: {loading|error|empty: 'handle'|'ignore'}`** (unhappy flows live here, not a new field; `layout.when` branches on them).

**Key model decisions (the reasoning, so we don't relitigate):**
- **Class vs instance = the composition hierarchy.** A composite is a Class (its `props` = params); a page placing it is the instance. No new spec type — layout nodes may reference *other composites* and pass values into their `props`. Completeness rule: every required child prop is **populated / exposed / wired**, nothing dangling.
- **Routing IS composition.** A "page" = a composite a `Route` renders; `scope:'page'` is a hint, not a primitive. Route table lives at `feature`/app scope; route params flow in as props. The router itself = a bring-your-own **adapter**.
- **Non-Move = three labeled doors:** (1) app boundary (`main.tsx`, out of the purity scope), (2) **adapter/integration point** (values/services via typed contract — keeps ALL UI guarantees), (3) **foreign node** (structural non-Move, *declared + counted*). The one rule: **no silent non-Move**; the escape is measured (ratchet), so the ungoverned region is visible and shrinks over time (a foreign-node count naming the same lib = backlog signal to wrap it).

## B. Build-first, formalize-after (user's explicit call)

Don't finalize the spec on paper. **Build the example app, inventing spec shapes as needed, THEN redefine the real `CompositionSpec` from what it actually required.** The app is the real pressure-test.

## C. The example app — "NASA Explorer"

- **Separate in-repo package `packages/example-nasa`** (NOT built yet), isolation-ready (touch **only Move's public API** so it's extractable to its own repo later), own port, own CI job.
- **Public API:** api.nasa.gov (free key = 1000/hr; `DEMO_KEY` rate-limited — which doubles as a real live error-state demo). Live API for the running app; **mock via the adapter seam for CI** (that swap IS the adapter demo).
- **Views:** APOD feed (overview) → `/apod/:date` detail (routing + param); Mars Rover gallery; **Near-Earth Objects = the CHART view** (the natural foreign node). Videos (APOD `media_type: video`) = a media-type `when` branch + embed = a 2nd foreign node, added as a later slice.
- **Charting is a known gap.** The asteroids chart starts as a **declared foreign node** (recharts) → motivates building a Move **`Chart`** component/adapter (which we need anyway). The demo shows the foreign-node → adapter lifecycle live.
- Persistence: saved shots (localStorage) + filters/date (URL). Covers every surface with nothing forced.

## D. Scaffolding pivot — DROP `create-move-app`, build deterministic `create-move` + a creation spec

- **Insight:** scaffolding must be **deterministic** → a *tool*, not an AI skill. The AI (`/app-compose`) does the *generative* build AFTER the floor is laid. `/app-setup` is **untested + unspecced** — do NOT rely on it as the scaffolder.
- **Cold-start (empty machine):** `npm create move@latest my-app -- --shell sidebar --router react-router`. A dedicated lightweight scaffolder (like `npm create vite`) — NOT folded into `move init`, because `npx move init` would drag the whole component library just to write a skeleton.
- `create-move-app` (interactive, non-agent-drivable, skills-path bug at `src/index.mjs:684` copies from nonexistent `node_modules/move/skills/app`) → **DELETE**, replace with **`create-move`** (non-interactive, flags, deterministic).
- **Creation spec = the single contract — WRITTEN this session: `packages/move/scaffold/creation-spec.mjs`** (uncommitted). Options+defaults, package.json contract (deps + required scripts incl. `check`+`test:a11y`), `move.config` (composites), and a file manifest with invariants **including the conformance harness** (a11y sweep + baseline + CI = "gates for free", closes the deferred render-time-scaffolding loop). `create-move` GENERATES from it; a new `move check` **`creation`** gate VALIDATES against it. One source → deterministic generation + verification, no drift.

## E. NEXT STEPS (in order)

1. ✅ **DONE — Build `create-move`** (new package `packages/create-move`, uncommitted). Deterministic (`generateProject(name, options)` in `src/generate.mjs`), non-interactive (flags parsed in `src/index.mjs`), and **self-checks its output** via `validateProject` (new shared module `packages/move/scaffold/validate.mjs`). Imports the spec through `move/scaffold/*` (new export subpath + `scaffold` added to move's `files`). Proven across all 54 shell×router×icons×theme combos; the app it generates passes typecheck + `move check` + a11y ratchet + `vite build`. **Two template-drift bugs the dogfood caught & fixed:** `<Heading size=...>` (Heading has no `size` — derives from `level`) and tsconfig must **exclude test files** (so the shipped a11y test's `node:*` imports don't need `@types/node`, matching docs); also needed `globals: true` in the generated vitest config (jest-dom auto-extend).
2. ✅ **DONE — `check:creation`** (`packages/move/checks/creation.mjs` wraps `validateProject`; registered in `bin/cli.mjs`). **Opt-in** (`move check creation`) — NOT in the default run (`DEFAULT_CHECKS` = strict-props/purity/composition-spec-drift), because it asserts a whole-app shape. Verified: passes on `nasa-explorer`, fails with a clear file-by-file list on a non-app dir. validate.mjs infers router/icons from installed deps for this no-options path.

   **Also this thread — workspace install + version alignment (user: "make sure all are up to date and in line"):** ran root `npm install` (registers `create-move` + `nasa-explorer` as workspaces; `move` resolves via root hoisting, no nested symlink — normal). Found `vite ^6` / `@vitejs/plugin-react ^4` were **stale/`invalid`** in BOTH docs and the creation-spec (repo actually resolves vite 7). The **`move` package is the up-to-date toolchain source of truth** (vite `^7.2.7`, plugin-react `^5.1.2`, vitest `^4.0.18`, jsdom `^28.1.0`) — brought `creation-spec.mjs` BASE_DEV_DEPS and `packages/docs/package.json` in line with it. Now `vite@7.3.6` deduped everywhere, no `invalid`. Regenerated nasa-explorer; docs+move typecheck clean, docs conformance holds at 265/0-new.
3. ✅ **DONE — Deleted `packages/create-move-app`** + scrubbed every ref (only SESSION.md still names it, as this handoff). Reframed docs to the new cold-start:
   - **New docs page** `getting-started/CreateMovePage.tsx` at route **`/getting-started/create-move`** (replaces CreateMoveAppPage / `/create-move-app`; nav + App.tsx updated). It **renders the options + file-manifest tables straight from `creation-spec.mjs`** (new docs alias `@move-scaffold` → `../move/scaffold`; new `creation-spec.d.ts` gives the plain-ESM spec a TS type surface) — so the scaffold docs can't drift from what the scaffolder writes. Dogfood-pure (no inline styles → conformance holds at 265/0-new).
   - Scrubbed: `README.md`, `VitePage.tsx` (scaffold section + `npm create move`), `ConformanceModelPage.tsx`, `content/.../code/samples/inline.tsx`, `skills/app-setup/SKILL.md`, `notes/TODO.md` (marked the scaffolding item done), `notes/QUALITY.md`, `docs/PLAN.md`. Re-ran root `npm install` (drops the workspace).
   - **Installation page accuracy fix** (user-flagged): step 1 now installs the real peers `move animejs lucide-react` (was `move` alone — `animejs` is a required peer, `lucide-react` is used in step 3); reworded the false "one dependency" highlight; added a cross-link to Create a Move App.
4. ✅ **SEEDED — `packages/nasa-explorer`** scaffolded WITH `create-move --local` (dogfood, uncommitted). Default shell=sidebar/router=react-router/icons=lucide/theme=light. Resolves deps via workspace hoisting + the `move` symlink (no per-package install yet — a root `npm install` would register it as a proper workspace member + update the lockfile). Still just the scaffold floor — no NASA composites/pages yet.
5. ✅ **IN PROGRESS — building NASA composites + scaffold refinements.**
   - **Scaffold refinements (user-driven, all folded into `creation-spec.mjs` + `create-move`):** added a **`src/components`** home (move.config lists both `components`+`composites`); **`--ci github|none`** (the CI workflow is now an *optional* binding — the real "gates for free" is the `check`+`test:a11y` npm scripts; `.github` is required only under `--ci github`); moved the a11y harness to **`src/conformance/accessibility.test.tsx` + `.baseline.json`**; added `test.include: ['src/**/*.test.{ts,tsx}']` to the generated vitest config (else `.spec.ts` files get collected as empty suites); tests excluded from tsconfig so no `@types/node` needed.
   - **Icons / bring-your-own demo:** `nasa-explorer` runs on **Heroicons** via a **hand-mapped resolver** (`src/icons.ts`, the `OVERRIDE_ALL` docs pattern) — proving Move isn't Lucide-bound. Then **removed `heroicons` as a `create-move` option** (the naive `PascalCase+"Icon"` resolver leaves Move's Lucide-flavoured names `menu`/`panel-left` blank); scaffold options are now `lucide` + `none`.
   - **The `nasa` adapter seam** (`packages/nasa-explorer/src/adapters/`): `nasa.ts` = `NasaApi` contract + live `createLiveNasaApi` (`VITE_NASA_API_KEY`, falls back to rate-limited `DEMO_KEY`) + offline `mockNasaApi` (fixtures) + **`withCache` localStorage decorator** (caching is a *service* concern, not the composite's); `NasaProvider` + `useNasa()` (defaults to mock so bare renders never hit network).
   - **Composites, spec-driven + green** (`src/composites/apod/`): **`ApodCard`** (spec+source+test — media card: `Image` cover + a hover-revealed `Tooltip`-wrapped **save** overlay per the `Image` overlay *sample*, `secondary`/`primary` for contrast, video → badge; the "video isn't working" fix to `VideoPlayer`+poster is still pending) and **`ApodFeed`** (page: fetches the recent range via the seam, loading→skeleton / error→Alert+retry / empty→EmptyState / ready→`Grid` of `ApodCard`). Both pass `typecheck` + `move check` (purity + composition-spec-drift parity) + tests.
   - **App runs live on :6060** (`nasa-explorer/vite.config` port; docs is :6044). Route `/` → `ApodFeed` fetching real NASA data (cached). The static picsum preview is gone.

## G. ⭐ THE RECIPE / COMPOSITIONSPEC REDESIGN — the core research this session

The build surfaced (per §B) that a recipe must be a **matchable, *parameterized pattern*, not a fixed template.** It carries: **intent + synonyms** (matchable — fixes "names lie": `OverviewBasic` *sounds* right for an overview but is a KPI dashboard), typed **decision axes**, an overlay **slot system**, Move **bindings** (with gaps), **heuristics** (a `checkable` flag → oracle rule vs guidance), an **actions vocabulary**, and spanning **samples** to seed from.

**Two composition relationships the flat `CompositionSpec` can't express — both now evidenced concretely:**
1. **leaf ⊂ pattern** — a leaf composite = the pattern with a single fixed config (no axes).
2. **page → composite reference** — a page/gallery *composes* item composites (§A class/instance).

**Typed drafts on disk (typecheck, wired to nothing):**
- `packages/move/recipes/composition-spec.draft.ts` — the **feature-scope** `FeatureSpec` (composites inventory + routing + shared seams + foreign nodes), NASA worked example.
- `packages/move/recipes/media-gallery.pattern.draft.ts` — the **`MediaGallery` parameterized pattern**: **two levels** (`GalleryOrg ∘ MediaItem`), gallery + item axes, the `OverlaySlot` system, `ActionKind` + `ACTIONS`, `HEURISTICS`, `BINDINGS`, and **7 brand-free archetype `SAMPLES`**.

**How the pattern was built — design research of 10 public players** (item + full-page screenshots + code snippets, provided by the user): captured in **`notes/media-gallery-pattern.md`** (provenance; the *shipped* draft is brand-free, samples named by archetype). It **converged** (a 10th, new-domain player added no new axis) and surfaced the **gallery-organization layer** (arrangement · sectioning · filtering · sorting · chrome · featured · density · paging · interspersed) *above* the item.

**Skill/pipeline conclusions (for later):** `app-compose` should decompose into **`composite-*`** (create-spec / generate-source / generate-test / validate + orchestrator), named by *artifact* (composite) not context (app); a **recipe = composite + an optional publish stage**, so `recipe-*` folds into `composite-*` + `composite-generate-docs`; add a **`composite-analyze`** stage that emits the feature map; **`improve`** is the central iterate-the-spec loop (spec deltas, never hand-edit). `component-generate-meta` + 67 `.meta.ts` + `meta-schema.ts` are **orphaned → delete** (user-approved).

**The Meta finding (⭐⭐ in `notes/dogfood-findings.md`):** the AI coasts on generic-web priors on any decision lacking **both** a forcing-function (something making it consult Move) **and** an oracle (a check that fails a wrong answer). Fix: capture the decision in the spec + validate with the oracle; **force seed-from-samples** (types = vocabulary, samples = grammar). Evidenced live: `variant="subtle"` (typecheck caught), `iframe` foreign node when `VideoPlayer` exists (human caught), `ghost` over a photo (sample caught), reinvented overlay (sample caught).

**`notes/dogfood-findings.md` = the redesign's requirements doc.** Meta + F1 (flat `composition` can't hold prop-level decisions → the `layout` tree) · F2 (`CompositionSpec` not public) · F3 (no feature scope) · F4 (foreign nodes unvalidated) · C1 (`Text` multi-line clamp) · C2 (`Icon` blank+warns under bare `MoveRoot` — weakens the a11y sweep) · C3 (`Image` no video poster) · **C5 ⭐** (`Image` needs a 4-corner overlay slot system) · C6 (masonry/justified layout) · R1 (no media recipes) · R2 (no matchable intent) · P1–P6 (app-compose monolith · no composite-analyze · improve-not-core · meta orphaned · no capability index · vitest include). Plus the `media-gallery-pattern.md` G1–G13 gaps.

**Two docs pages for showing colleagues (localhost:6044):**
- **`/core-concepts/recipe-patterns`** ("Recipe Patterns (draft)", nav under Core Concepts) — `RecipePatternPage` renders the `MediaGallery` draft **live** (idea · gallery+item axes · item **actions** · archetype samples · heuristics), via the `@move-recipes` alias. **Our shared review surface** — re-renders as we edit the draft.
- **`/getting-started/what-ai-gets-wrong`** → "Caught in the act" section — the 4 real AI mistakes (generalized + example + oracle-with-rationale).

## F. Uncommitted / not-yet-done — **NOTHING committed all session**

- **New packages:** `packages/create-move/` · `packages/nasa-explorer/` (the running app, composites, adapter, Heroicons resolver).
- **New in `move`:** `scaffold/` (`creation-spec.mjs` + `.d.ts` + `validate.mjs`), `checks/creation.mjs`, `recipes/composition-spec.draft.ts` + `recipes/media-gallery.pattern.draft.ts`; `package.json` (exports `./scaffold/*`, `files += scaffold`, toolchain deps aligned); `bin/cli.mjs` (creation gate).
- **Deleted:** `packages/create-move-app/`.
- **Docs (`packages/docs`):** new `RecipePatternPage.tsx` + `CreateMovePage.tsx`; reframed `InstallationPage`/`VitePage` (existing-app + peer/icon fixes); `WhatAIGetsWrongPage` "Caught in the act"; `index.css` anchor-color fix (→ `--move-indigo-text`); `nav.ts`/`App.tsx` routes; `@move-scaffold` alias; vite/plugin-react bumped; the animation "recipes"→"patterns" copy fix; **modified `CompositionContractPage.tsx`** (richer-spec sketch, from before this session).
- **Notes:** `dogfood-findings.md`, `media-gallery-pattern.md` (new); `TODO.md`/`QUALITY.md`/`PLAN.md` scrubbed.
- **Also touched (user's parallel work):** many `packages/move/src/**` files for the `--move-indigo-text` token (Link/Text/Prose/themes/semantic.css) — **not mine, don't revert.**
- **Untouched:** the real `CompositionSpec` type + the 15 recipes (still the old flat shape) — the redesign hasn't landed.

## H. NEXT (in order)

1. **Review the drafts together** — the user wants to go through the axes / heuristics / samples / **actions** with me (use `/core-concepts/recipe-patterns` as the surface).
2. **Redefine the real `CompositionSpec`** from the two drafts (feature scope + pattern scope) — read the schema off them; add a drift check; plan migrating the 15 recipes.
3. **Act on findings** — highest-value: **C5** (`Image` 4-corner overlay slot system — unblocks every media card), then C6 (masonry), C1 (Text clamp), C2 (Icon default resolver), Rating.
4. **Finish the NASA slices** — the `VideoPlayer` poster fix on `ApodCard`; then `/apod/:date` detail, Mars gallery, the NEO chart (foreign node → motivates a Move `Chart`).
5. **Decompose `app-compose` → `composite-*`**; delete the orphaned `component-generate-meta` + `.meta.ts` + `meta-schema.ts`.
6. Small leftover in `notes/TODO.md`: a **pre-commit hook** template running `move check`.

---


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
- **Render-time** — the a11y sweep. Renders components + runs axe, so it must live in the repo as a test. Delivered by **scaffolding** — now the deterministic `create-move` + creation spec (see ACTIVE THREAD §D), not the old `create-move-app`.

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

1. **Build the render-time scaffolding** — SUPERSEDED by ACTIVE THREAD §D/§E: it's now emitted by the deterministic `create-move` per the creation spec (`packages/move/scaffold/creation-spec.mjs`), validated by `check:creation`. NOT built yet.
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
