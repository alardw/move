# Dogfood findings — deficiencies surfaced by building real apps

Living log of Move deficiencies discovered by **building** (not surveying), driven
by `packages/nasa-explorer`. Distinct from `missing-components.md` (a survey of
whole components Move lacks): most of these are *missing props* on existing
components, *missing recipes*, *spec-model* gaps, or *pipeline* gaps.

Append as building surfaces more. Each finding: what · where it surfaced (concrete)
· current workaround · proposed fix · status.

---

## Meta — the root-cause pattern behind most findings ⭐⭐

The AI (me) **defaults to generic web/React priors on any decision that has neither
(a) a forcing-function that makes it consult Move, nor (b) an oracle that rejects a
wrong answer.** Where both exist, it's reliable; where neither does, it coasts on
training priors — confidently, and wrongly.

- **Composing *with* a component** has both: the `import` forces the lookup, and
  `typecheck` rejects bad props. → reliable.
- **Picking a prop *value*** (F1): no capture, no check. → coasted (`variant="subtle"`,
  which doesn't exist).
- **Declaring a *foreign node*** (F4): the decision points *away* from Move, so nothing
  makes me check whether Move already covers it, and no check validates the claim. →
  coasted (`iframe`/`VideoEmbed` when `VideoPlayer` exists).

**The rule for the system:** every decision that admits a "Move way vs. generic-web
way" answer must be *forced* (I must consult Move to proceed) or *checked* (the oracle
fails the wrong answer). **Force-by-oracle beats force-by-instruction** — a procedure I'm
told to follow is a coast-risk under load; a check that fails the build is not. Both F1
and F4 reduce to the same fix said twice: **capture the decision in the spec, and
validate it against Move-reality with the oracle.**

**Deeper cut — types tell me what's *possible*, samples tell me what's *intended*.**
Even when I *do* consult Move, checking that a prop *exists* (its type) isn't enough. I
used `Image`'s `action` prop off the signature and reinvented a weaker overlay — I
missed the `image/samples/overlay.tsx` sample, which encodes the *idiom* the type can't:
`action` is a translucent overlay that fades in on hover/focus, and the intended content
is a `Stack` of **`Tooltip`-wrapped** buttons. Prop signatures are the vocabulary;
**samples are the grammar.** So the inventory the analyze step consults (P5) must index
*samples*, not just names + synonyms — and "seed from the sample" is the strongest
version of my example-driven reliability.

---

## Composition spec / model

### F1 — `composition` is a flat list; the spec can't capture prop-level design decisions ⭐
The current `CompositionSpec.composition` is `string[]` — *which* Move components,
not *how they're configured*. So generation invents every prop-level decision
(variant, size, aspect ratio, radius, gap, colour) and bakes it into the `.tsx`,
**un-recorded in the spec.**
- **Surfaced:** `ApodCard` — the spec says "the save button reflects `saved`", but
  not that it's `variant="primary"` when saved / `ghost` otherwise. Same for
  `Image` `fit="cover"` / `aspectRatio="3 / 2"` / `radius="md"`, several `size`/`gap`
  values. All decided at generation time, none in the spec.
- **Why it matters:** breaks "spec is the source of truth" — those decisions live
  only in the source. Regeneration re-guesses them (non-deterministic); and the
  iterate-the-spec loop **can't refine a decision the spec doesn't hold** ("make the
  save button quieter" → I'd guess again, not amend a captured value).
- **Workaround:** none — the decisions leak into the `.tsx`.
- **Fix:** the §A `layout` tree — nodes with `props` + `bind`/`when`/`each` — replacing
  the flat `composition`. `{ component:'Button', props:{ variant: bind('saved',{true:'primary',false:'ghost'}) } }`
  lives *in the spec*: captured, reviewable, deterministically regenerated, refined
  by editing the spec.
- **Status:** direction decided (§A sketch + `composition-spec.draft.ts`); NOT in the
  live type. This finding is the concrete evidence for it.

### F2 — `CompositionSpec` type isn't in the public API
Lives in `recipes/spec-type.ts`, not exported from `move`, so a consumer composite
spec can't `satisfies CompositionSpec`.
- **Surfaced:** `ApodCard.spec.ts` — written as a plain object (the drift check reads
  it as text, so it still validates, but the spec is untyped).
- **Fix:** export it (e.g. `move/spec` subpath, or from the barrel) + rebuild dist.
- **Status:** open.

### F4 — foreign-node declarations aren't validated against the inventory ⭐
A `foreignNode` is asserted for free — nothing checks whether Move already covers the
capability. So a strong training prior ("external video = iframe") gets recorded as a
declared foreign node, un-checked.
- **Surfaced:** the NASA map declared `apod-video` as an `iframe` foreign node
  (`wrapTarget: 'VideoEmbed'`) — but Move ships **`VideoPlayer`**, with a `provider`
  seam (`setup(video, src)`) for external embeds. The foreign node was pure assumption;
  `VideoPlayer` covers it.
- **Why it matters:** violates "no silent non-Move" from the *wrong direction* — it
  smuggles non-Move in by *wrongly claiming* Move lacks something. Foreign-node
  declarations are the highest-risk coast (see Meta): the decision points away from Move.
- **Workaround:** manual catch (the user asked "is there a Move video component?").
- **Fix:** a foreign node must carry **`ruledOut: string[]`** (the Move components
  checked), and a check must **fail when the `wrapTarget` — or a synonym — matches an
  existing component.** `wrapTarget:'VideoPlayer'` + `VideoPlayer` exists → instant reject.
- **Status:** open. Immediate consequence: drop `apod-video` from the map; video uses
  `VideoPlayer`.

### F3 — `CompositionSpec` can't express feature scope
No routing, page inventory, composite-to-composite references, or shared-seam
declarations — the whole app-map altitude.
- **Surfaced:** the app-map discussion; the `FeatureSpec` fields drafted in
  `packages/move/recipes/composition-spec.draft.ts`.
- **Fix:** fold the drafted `scope:'feature'` fields into `CompositionSpec` (one type,
  three scales).
- **Status:** drafted, not adopted.

---

## Components (existing — missing props/capabilities)

### C1 — `Text` has no multi-line clamp
Only single-line `truncate`. Card blurbs need an N-line clamp.
- **Surfaced:** `ApodCard` `compact` mode.
- **Workaround:** slice the explanation string in the composite (pure, no CSS).
- **Fix:** add `clamp?: number` (line-clamp) to `Text`.

### C2 — `Icon` renders blank + warns under a bare `MoveRoot`
`<MoveRoot>` with no `iconResolver` logs *"Icon: No IconProvider found"* and renders
nothing. This hits **every composite test and the a11y sweep**, which render bare —
so icons are never actually exercised by the a11y ratchet.
- **Surfaced:** `ApodCard.test.tsx` (warnings) + the scaffold a11y sweep.
- **Fix:** `MoveRoot` ships a built-in-essentials resolver by default, OR the scaffold
  test/a11y harness wires a resolver. Leaning toward the former (a component that
  degrades to blank-with-a-warning by default is a poor default).

### C3 — `Image` has no poster/placeholder for the no-`src` case
A media card for a `video` entry has no image; `Image` with `src=undefined` renders
empty.
- **Surfaced:** `ApodCard` video branch.
- **Workaround:** show only a "Video" badge (poster deferred).
- **Fix:** an `Image` `placeholder`/`poster` slot, or a Move media pattern for
  video/poster.

### C5 — `Image` needs a 4-*corner slot* system (indicators + actions), not one `action` ⭐
`Image` today has a single **hover-revealed** `action` overlay (top). Real galleries need
**four corner slots**, each holding *either* a **persistent indicator** (duration, "Top 10",
item count, "4K"/"Live", price — always on) *or* a **hover-revealed action** (save, share,
board-select). One primitive covers all three anchors analysed:
- **Surfaced:** media-gallery analysis (`media-gallery-pattern.md` G9). **YouTube** = duration
  indicator bottom-right; **Netflix** = Top-10 corner badge + prominent status pill; **Pinterest**
  = *three* corner *actions* (board-select TL, Save TR, share BR). My `ApodCard` had to dump the
  "Video" badge in the body for lack of any on-image slot.
- **Fix:** corner slots `top-start`…`bottom-end`, each `indicator` (persistent) or `action`
  (hover). Defaults from the heuristics: off-center, **solid background for contrast** (no
  ghost over photos), indicators and hover-actions in **different corners**, two indicator
  weights (subtle badge vs prominent pill).
- **Status:** open — the single highest-value `Image` change for media UIs.

### C6 — no masonry / native-aspect layout
`Grid` does uniform rows (`minChildWidth`); it can't do **masonry** — variable-height packing
where each item keeps its **own aspect ratio**. Core to image/inspiration galleries.
- **Surfaced:** Pinterest (`media-gallery-pattern.md` G8) — pins are `aspect-ratio: var(...)`,
  packed in columns. Cropping to a uniform ratio would *lose the information* for visual content.
- **Fix:** a masonry layout mode (a `Masonry` component or a `Grid` `masonry` variant).
- **Status:** open.

### C4 — Button variant vocabulary (minor)
`primary | secondary | ghost | danger` — no obvious "toggle/selected" affordance for
a save button; and not discoverable at generation time (guessed `subtle`/`solid`
first; the oracle caught it).
- **Surfaced:** `ApodCard` save button.
- **Fix:** consider a `toggle`/`selected` affordance; low priority.

---

## Recipes (the seed corpus)

Per the Meta note, recipes are the substrate that makes AI generation reliable — the
idiom corpus I extend from. For that to work, a recipe must serve **two distinct jobs**,
and its content has to be decided against both:

| Part | Job: **MATCH** (is this the right seed for the intent?) / **EXTEND** (how do I build it right?) | Where it lives today |
|---|---|---|
| **intent / when-to-use** | MATCH — phrased as *intent*, not implementation. The thing I match the user's ask against. Names lie (`OverviewBasic` = dashboard), so this can't be the name. | **missing** (only implicit in behaviors) |
| **synonyms** | MATCH — phrasing variants so the match survives however intent is worded | in publishing metadata (`RecipeDocument`), *not* the substance |
| **behaviors** | MATCH-verify + tests — matching is *verification*: diff my intended behaviors against the recipe's to confirm fit | spec ✓ |
| **data shape + open seams** | fit-check + wire — check my data fits the pattern; know what to wire | spec ✓ (`RecipeDataField`, `integrationPoints`) |
| **realistic sample `.tsx`** | EXTEND — carries the *idiom* (grammar) the types can't; must be realistic, since I copy it faithfully — a toy sample teaches a toy idiom | recipe source ✓ (quality varies) |

Two decisions this forces:
- **Intent must be a first-class, matchable field, and the matcher must see one aggregated
  record** (intent + synonyms + behaviors + sample-pointer). Today the matchable signal is
  split between substance and publishing metadata and lacks an explicit intent. → see **R2**.
- **Abstraction level.** The recipe is the *pattern* (generalized, open seams); the sample is
  an *instance* (placeholder data). Too specific ("NASA APOD feed") → matches nothing else;
  too generic ("a list") → matches everything, helps nothing. Choosing the reusable altitude
  is a judgment made at *promotion* time (`ApodFeed` → `MediaGallery`: what's essential to the
  pattern vs. incidental to NASA).

### R1 — No media-forward recipes
`MediaCard` / `MediaGallery` / `MediaDetail` don't exist. The `page/*` recipes are
dashboard/table/text-forward (`OverviewBasic` = KPI dashboard, `ListBasic` =
table/list) — none seed image-forward content, so `ApodCard`/`ApodFeed` were built
analyze-from-scratch.
- **Surfaced:** seed-diffing for `ApodFeed` (no recipe's behaviors matched intention).
- **Fix:** once `ApodCard`/`ApodFeed` stabilise, promote them to `MediaCard`/
  `MediaGallery` recipes — which also makes `MarsGallery` cheap.

### R2 — recipes have no first-class, matchable intent ⭐
The step where I fail is intent → recipe: I can't tell from a name whether a recipe fits
(`OverviewBasic` sounds right for an "overview," is a KPI dashboard). The substance spec has
`behaviors` but no explicit **intent/when-to-use**, and the `synonyms`/`description` that
would drive matching live in the *publishing* metadata (`RecipeDocument`), not the substance —
so there is no single record the analyze step can match an intent against.
- **Surfaced:** seed-diffing for `ApodFeed` — I had to reason about recipe fit by reading
  behaviors one by one, with names actively misleading.
- **Fix:** a first-class `intent`/`whenToUse` on the composition substance (or aggregated with
  `synonyms` + `behaviors` + a sample-pointer into the P5 index), so intent-matching is a
  lookup, and behaviors verify the match. See the content-contract table above.
- **Status:** open — the central recipe-corpus gap.

---

## Pipeline / tooling

### P1 — `app-compose` is a monolith
It bundles analyze + spec + generate + validate, unlike the decomposed `recipe-*` /
`component-*` pipelines. Named by context ("app"), not artifact ("composite").
- **Fix:** decompose into `composite-create-spec` / `composite-generate-source` /
  `composite-generate-test` / `composite-validate` + a `composite-*` orchestrator; a
  recipe is a composite + an optional publish (`composite-generate-docs`) stage.
- **Status:** design agreed; not done.

### P2 — No `composite-analyze` stage
Nowhere produces the feature map (inventory + routing + shared seams + foreign
nodes). The composite pipeline jumps straight to a leaf spec.
- **Fix:** add `composite-analyze` as the top of the pipeline; its output is the
  `FeatureSpec` (F3).

### P3 — Iteration (`improve`) is a side-skill, not the core loop
The "generate → react → spec delta → regenerate" loop is how quality is actually
made, but `improve` is treated as an optional amendment skill, and it can't refine
prop-level decisions until F1 (layout) lands.
- **Fix:** elevate `improve` to the central loop once the spec captures decisions;
  make regenerate cheap + delta-capture lossless.

### P5 — no queryable "what Move has" capability index
`missing-components.md` lists what Move *lacks* — the inverse of what's needed at
generation time. There's no single index of what Move *has* (name + synonyms + one-line
capability) that the analyze stage (or a check) can grep to answer "does Move cover
video / embed / player?". The data exists (component specs carry `synonyms`); it's just
not collected into a lookup.
- **Surfaced:** F4 — I had no cheap way to check "is there a Move video component" and
  neither would a foreign-node check.
- **Fix:** derive a capability index from spec `name` + `synonyms` + summary **+ a
  pointer to each component's samples** (the usage idiom — see the Meta "deeper cut"); the
  analyze step searches it (inventory-first) and *seeds from the sample*, and F4's check
  validates `wrapTarget`/synonyms against it.
- **Status:** open.

### P6 — scaffold vitest config collects `.spec.ts` as tests
The generated `vite.config.ts` sets no `test.include`, so vitest's default
(`**/*.{test,spec}.*`) treats composition `.spec.ts` files as test suites — they fail
with "No test suite found." A Move app *has* `.spec.ts` files everywhere (they're the
source of truth), so this collides by construction.
- **Surfaced:** running `nasa-explorer` tests — `ApodCard.spec.ts` / `ApodFeed.spec.ts`
  failed as empty suites while the real `.test.tsx` files passed.
- **Fix:** `test.include: ['src/**/*.test.{ts,tsx}']` in the scaffold's vite config
  (done in `create-move`'s generator + patched into `nasa-explorer`).
- **Status:** fixed.

### P4 — `component-generate-meta` + 67 `.meta.ts` + `meta-schema.ts` are orphaned
Docs derive from `.spec.ts` (`@move-specs`); nothing consumes the canonical
`ComponentMeta` (not public, not imported, no check reads it).
- **Fix:** delete the skill + the 67 files + `meta-schema.ts` + the generate-all
  step. (Distinct from the *live* docs prose `content/components/{slug}/meta.ts`.)
- **Status:** fixed (2026-07-02). Deleted all 72 `*.meta.ts` (components + infrastructure),
  `src/meta-schema.ts`, the `component-generate-meta` skill, and dropped the meta step from
  `component-generate-all` (now source → test → docs → validate). move typecheck clean.
