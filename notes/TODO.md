## Open

- Fix the keyboard highlights in sidebar
- Calendar.Root: implement `animations` prop (specced as forwarding to Grid for month-transition stagger; not yet wired)
- Convert TableOfContents → PageRail (rename across spec, source, docs, nav)
- Build /components overview page (search + group + filter, only Move components)
- Image overlay: click-to-open + click-outside-close (currently CSS hover); use `useAnimations`
- Audit tool: takes spec-diff JSON + consumer source tree, reports per-file findings (consumer-side migration helper)
- Add specs for all docs-internal components (`packages/docs/src/components/*`: Section, HighlightList, KeyboardTable, PropsTable, TokensTable, TocRail, CodeBlock, InlineCode, Preview, HeroDemo, ColorSwatch, MoveBadge, AdvancedBadge, AnimatedSubnav, RelatedComponents, LogoMark) — same Spec contract once it lands; lets the same generators/checks/spec-diff tooling cover docs primitives, not just published Move components
- Tighten Move prop types: every component's `Props` extends `Record<string, unknown>`, which means `tsc` accepts invalid literal values (e.g. `gap="3xl"` on Stack passes type-check even though `StackGap` excludes `3xl`). The type-safety hole is widespread — Stack/Grid/Heading/Text all affected. Either drop the `Record<string, unknown>` extension or split prop types so the public API stays strict while the internal wiring keeps the loose record
- Make `asChild` universal on every trigger-like part so polymorphism is uniform across the library (Radix-style pattern shadcn ships everywhere). Today it's present in some places, missing in others — audit + add. Consider for consistency story alongside `sp` slot-prop coverage and token-naming regularity.
- Docs-app versions of the demo/recipe generation skills. Removed `generate-demo` and `generate-recipe` because they targeted the old `demo/` app (gone, replaced by `packages/docs`). Need replacements that generate against the docs structure (`packages/docs/src/content/components/*/meta.ts`, `packages/docs/src/pages/recipes/…`). Also update `generate-all` (still orchestrates the removed demo/recipe steps) and `validate` (D1 still checks for `demo/src/demos/generated/…`).
- `check:skill-drift` — a drift check for the skills themselves (sibling of `check:spec-drift`). Scan every `SKILL.md` for references to paths, skill/slash-command names, and files that no longer exist, and flag them. Would have caught the `generate-demo`/`generate-recipe` rot (pointed at the deleted `demo/` app) and the renamed `component-*` cross-references automatically. Maintainer tooling, not a shipped skill. (Preferred over a generic "write/amend a skill" skill — skill authoring is generic agent-ops, not Move's domain.)
- `defineTheme()` — minimize the theming surface. A helper that takes a small seed (neutral palette, accent, status colors, font) and expands it to the full token set, so consumers configure a handful of values instead of the whole token surface. Referenced as "coming soon" on the Theming Overview page (the "theming roadmap" pointer there is currently dangling — wire it to this once built).
- Tooltip compound `Content` tests time out in jsdom (migrated from the removed `generation-issues.md`, status UNRESOLVED). `<Tooltip.Root open>` + compound API: the content element never appears in jsdom, yet the Simple API (`<Tooltip label … open>`) works with the same Provider and the "rendered in a portal" compound test passes. Needs investigation.
- ~~Unify the i18n label API~~ DONE 2026-06-26. All components now expose user-facing strings through one `labels?: Partial<{Name}Labels>` object with English defaults (flat `*Label` props and hardcoded `aria-label` literals removed). Specs' `labels` fields filled, validate E1 tightened to enforce it, Internationalization docs table covers every component. typecheck clean, 1758 tests pass.
- ~~Recipes: wire the remaining composite groups into the docs registry~~ DONE 2026-06-29 — all 14 recipes (auth/data/navigation/page) registered via a spec-driven `registry.ts` (`toMeta(spec, Component, source)`); each recipe has a co-located `{Name}.spec.ts`. Follow-ups in "Recipe pipeline backlog" below.
- Recipes are docs-owned COPIES under `packages/docs/src/content/recipes/` of `packages/move/skills/references/recipes/composite/*` — single-source or generate them later to avoid drift.
- Automate preview thumbnails: both `RecipeCard` and `ComponentCard` already take a pluggable `image?` slot (image wins over the live render). Add a screenshot step that fills these so the grids can stop rendering live components.

## Recipe pipeline backlog (from dogfooding, 2026-06-29)

State: recipes are now spec-driven (each has `{Name}.spec.ts`; registry derives from specs). Recipes **ship as hand-authored source** — the working model is "hand versions are canonical, `recipe-generate-source` is a generate-and-compare *check*, not an in-place replace." The full pipeline (create-spec → generate-source → generate-docs → generate-test → validate) was exercised end-to-end on `FilterableDataTable`. Docs-package test infra was added (`vitest.setup.ts` observer/pointer mocks + `src/testing.d.ts` jest-dom matcher types). Generated comparison copies live in scratchpad only (not committed).

### Library gaps (`packages/move`) the generation surfaced — highest value
- **`Splitter.Root` needs a `fill`/height prop.** Full-height layouts (master-detail / inbox / app shell) can't bound height with pure Move components today — `ListSplitPane` requires a `composite-purity-ignore` raw `<div>`. Add `fill` to `Splitter.Root` (and probably a bounded-height `ScrollArea`/surface). Affects every real app layout.
- **`animateKey` is inconsistent.** 18 components stagger on entrance; only `List` exposes `animateKey`. Of the *dynamic-collection* staggers (List / Timeline / Table) only List has it (the rest are popup-open staggers where it doesn't apply). Either **(A)** add `animateKey` to `Timeline` + `Table` and rewrite golden rule #12 to "collection components only, discrete changes (filter/sort/page), NOT live search," or **(B)** drop `animateKey` from `List` and delete rule #12. Low priority — a nicety, not correctness; re-staggering on every keystroke is bad UX.

### Spec-hardening (do when actually (re)generating a recipe — makes generation deterministic)
- Add `shape` to every `kind:'data'` integration point (only `FilterableDataTable` has it; without it the generator invents the record fields/columns).
- Resolve header-labels vs the "all copy via labels" behavior: data-table column headers / dashboard card titles (Overview/Detail) aren't in `labels` → add header label keys, or relax that behavior.
- Clarify data/copy ownership where `entity`/`account` integration points overlap label keys (name/role/status are both).
- Add a render/badge-colour hint to data fields (status→badge colour is invented in every recipe).
- `RecipeSpec` has no `specHash` (component specs carry provenance/drift hashes) — add if recipe drift-checking is wanted.

### Done this session (2026-06-29)
- Fixed a real shipped bug: `SearchFilter` + `FilterableDataTable` filtered OR-across-groups; now **AND across groups, OR within a group**.
- `FilterableDataTable`: native `Table.Head` `sortable`/`sorted`/`onSort`/`align` headers (was a padded `<Button>` that misaligned), type-aware sort (numeric/date), loads-unsorted.
- A5 rule carve-out: a standalone toolbar/search input may omit `FormField` if it carries `aria-label` (golden rules + `recipe-validate` + `recipe-generate-source` updated).
- KPI stats moved out of `labels` into `SAMPLE_STATS` data (Overview recipes).
- Placeholder data uniformly `SAMPLE_`-prefixed + `// Integration point:` marked; `integrationPoint.kind` (`data`/`handler`/`navigation`/`asset`) + `shape` added to the spec type; detail page renders spec-derived sections (Built with / Included / Integration points / Labels).

## Ship validation as `move check` — remaining (2026-06-29)

Shipped so far: the type-safety migration (strict props, 65 components), `check:strict-props` + `check:recipe-spec-drift` guards, a broadened pre-commit, and a **config-driven, consumer-facing `move check`** (CLI in `bin/cli.mjs`; checks in the published `checks/` dir; roots from `move.config.json`). Currently `move check` ships `strict-props` + `recipe-purity`. Docs at `/ai/validation`.

Remaining:
- **Port the rest of the consumer-facing checks** to config-driven `checks/` + add to the `move check` registry: `spec-drift`, `recipe-spec-drift`, `component-conformance`, `css-tokens` (against the consumer's theme). Keep Move-internal checks (`family-*`, `cross-component-drift`, `spec-tokens`) in `scripts/checks/` only. Nuance: `recipe-spec-drift` for consumers should check only spec-backed recipes (don't require every `.tsx` to have a `.spec.ts`, so hand-written recipes/templates don't false-positive).
- **Scaffolding:** ~~drop a `move.config.json`, a `check` npm script, and a CI workflow template so every new Move app gets the gates for free~~ — DONE via `create-move` + `scaffold/creation-spec.mjs` (writes `move.config.json`, the `check`/`test:a11y` scripts, the a11y ratchet harness, and an optional GitHub CI workflow; validated by `move check creation`). Still missing: a **pre-commit hook** template running `move check`.
- **Idea (someday): an `app-icon-adapter` skill** — generate the `iconResolver` that wires an existing app's icon library (Heroicons, Tabler, Phosphor, custom SVGs) into MoveRoot, the way `/app-compose` generates composites. Icons are already a bring-your-own resolver seam; a skill would automate the *mapped* resolver. Docs cover the hand-written resolvers at `/customize/icons`; `packages/nasa-explorer/src/icons.ts` is a worked Heroicons example. **Context:** `create-move --icons heroicons` was **removed** (2026-07-01) because the naive `PascalCase + "Icon"` resolver leaves Move's Lucide-flavored names (`menu`, `panel-left`) blank — Heroicons needs the alias map. Scaffold options are now just `lucide` (works out of the box) + `none`; a non-Lucide library is a hand-written (or, someday, skill-generated) resolver. Not today.

## Default-enforcement (close the AI-picks-small drift)

AI generators (Claude included) lean toward the small/quiet end of every variant axis when not anchored. The spec's documented defaults are the counter-weight; today they aren't enforced.

- **Validator (in `spec-schema.mjs`)**: for every `PropOptionalLiteral` whose name matches a `style.variants` key, the default must be in the allowed values. Same for `size` ↔ `style.sizes`.
- **Validator**: every `role: 'data'` prop should have a `default` (a data prop without a default is a smell — data props affect rendering and the runtime needs a fallback).
- **Drift checker extension**: read source's `defaults: { ... }` block from `withMoveComponent` and verify it matches `spec.composition.props[].default` for every prop. Catches silent runtime/spec divergence.
- **Skill prompts (`/generate-source`, `/generate-all`, `/app-page`, etc.)**: explicit instruction — "use `spec.composition.props[].default` verbatim; do NOT pick a smaller/quieter/safer variant unless the user explicitly asks." Counteracts the LLM bias.

## Spec contract follow-ups (during pass 2)

- Decide whether `renderContracts` is required (currently 63/67); 4 specs without (Spinner, Skeleton, Loader, ProgressBar — verify and either backfill or make optional)
- Investigate `propRoles` (8 specs): purpose unclear — formalize as part of contract or remove
- Decide if `dismissBehavior` + `surface` should fold under `behavior.popup` (10 specs each, popup-family extras)
- Add `synonyms` reading to `scripts/spec-diff/normalise.mjs` so synonym changes appear in version-log
- Promote `defaultReview.decisionSource` to a fixed union (`'rule-based' | 'user-confirmed' | 'accept-all'`)

## Spec gaps (revisit when they bite)

Things components do today that the spec doesn't capture or only loosely captures. Each gap is "real but not blocking" — drift checker + source grounds them, but adding them to the contract would make the system more self-describing.

### Genuinely missing fields

- **Hook signatures.** `tooling.hasHook: true` says a hook exists. Its name, parameters, and return type aren't in the spec — source-only. Most painful gap. Proposed shape:
  ```ts
  hook?: { name: string; options?: PropDef[]; returns?: PropDef[] }
  ```
- **Imperative ref APIs.** Methods exposed via `useImperativeHandle` (e.g. Carousel's `scrollTo(index)`) aren't props and aren't in the spec. Proposed: `imperativeApi?: PropDef[]`.
- **Children-type restriction for compound components.** "Tabs.Root accepts only Tabs.List + Tabs.Content as children" isn't enforced — source filters at runtime if it cares. Proposed: `subComponents[].acceptsChildren?: { allowed: string[] }`.
- **Internal context shape.** Compound components communicate via React Context; the context value isn't in the spec.
- **Conditional prop typing.** Calendar.Root's `value` is `Date` in single mode, `[Date, Date]` in range mode. Spec's string `type` can hint but discriminated runtime types aren't structural.
- **SSR / hydration concerns.** Components that need `ClientOnly` wrapping or `useSyncExternalStore` aren't flagged.
- **Internal infrastructure used but not exported.** Calendar uses `_shared/DayCell`, `_shared/MonthGrid`. Structural but invisible to the spec.

### Loose where stronger types would help

- **`type` / `typeRef` are strings**, not TS types. Drift checker grounds them against source, but the spec field itself isn't TS-checked.
- **`AnimationStep = Record<string, unknown>`** — animation sequence shape is loose; anime.js properties aren't typed.
- **`renderContracts[].description`** is free-form prose. Two specs could write contradictory contracts and nothing flags it.
- **`tests.behaviors`** is free-form prose; listed cases aren't matched against actual test names in `.test.tsx`.
- **`engineImports` / `componentDeps`** are just name lists; no type-level link to the imported names.

## Done

- Migrate synonyms into per-component specs (67 specs updated)
- Pass 1: cleanup all 67 specs to canonical v7 shape
- Calendar / CalendarView / ToggleGroup migrated from drifted shape to v7
- Tooltip outlier `controlled` normalized
- TableOfContents `behaviors` → `renderContracts` typo fixed; missing v7 fields backfilled
- Stragglers removed: `companions`, `notes`, `demo`, `responsive` from 5 specs
- Bug fix: `CalendarRoot` accepts `yearRange` + `fixedWeeks` (was unreachable)
- Bug fix: `Image.tsx` use-before-declare on `setLoaded`
- Inventory of components Move lacks → `missing-components.md`

## CSS transition debt (rule `styles-12`, `check:css-transitions`)

Four components still animate motion in CSS. Each carries a `transition-exempt:
KNOWN DRIFT` comment naming the reason, so the check surfaces them; this is the
work each one needs. Table's chevron was migrated as the reference case — it now
rotates on a **deps trigger** in `useAnimations` (Table.tsx `chevronAnimations`),
which is simpler than Autocomplete's state trigger because a group owns `open` in
React rather than reading it off the DOM.

- **ProgressBar** — the indicator transitions `transform` to a new value. That is
  real motion: a deps trigger on `value` would make it sequenceable, sprung, and
  switchable off with `animations={false}`. Highest value of the four, and the
  most care needed — it is widely used and smoothness is the point.
- **AudioPlayer** — controls fade on pointer presence. A state change, so it wants
  a `data-*` attribute the component sets plus a state trigger.
- **VideoPlayer** — same fade, plus a control bar sliding clear of the captions
  track on `bottom`. Both driven by playback state.
- **Carousel** — controls fading on pointer presence, as above.

Not debt, and correctly exempt: Button, ToggleGroup and EventSlot transition
`opacity` alongside a colour change for hover/disabled — state feedback, not
motion. Image fades a decoded image in off the browser's load event, where there
is no React state for `useAnimations` to hang a trigger on.
