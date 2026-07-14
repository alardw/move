# Color System & API Discoverability — Plan

Status: in progress (2026-07-14). Scope: complete component set.

## Progress log
- **2026-07-14 — non-breaking foundation landed (Track A, part 1):**
  - Phase 2 (barrel): added the 7 missing type exports to `src/index.ts` so they're
    importable from `'move'` — Badge `BadgeColor`, Avatar `AvatarColor`, ChatBubble
    `ChatBubbleColor`, Stepper `StepperColor`, Toast `ToastLabels`, VideoPlayer
    (`VideoPlayerProvider/Radius`, `SubtitleTrack`, `VTTCue`, `UseVideoPlayer*`),
    Carousel (`UseCarouselAnimate*/Animation*`). Also surfaced public hooks
    `useCarouselAnimation`/`useCarouselAnimate`, `useVideoPlayer`, `parseVTT`.
  - Phase 3 (partial): back-filled `Divider.gap` and `Grid.padding` into their specs
    (`typeRef: 'Gap'`). **Badge.color deferred** to the color-model phase.
  - Phase 4 (partial): new `scripts/checks/barrel-completeness.mjs` + `check:barrel-completeness`
    script, wired into `check:all`. Enforces every component type export reaches the barrel.
  - Verified: `tsc --noEmit` clean except a **pre-existing** `Accordion.tsx:281`
    (`ITEM_SCALE_INSET_PX`) error unrelated to this work; `check:spec-drift` 69/69;
    `check:barrel-completeness` 69/69.
- **2026-07-14 — color model landed (revised, simpler than planned):**
  - **Decision:** categorical components take the **palette only — no semantic intents**
    (per user). `Color = keyof MoveColors`; the `Intent | Accent` split was dropped.
  - `src/shared/types.ts`: `MoveColors` augmentable interface (13 built-in palettes) +
    `Color = keyof MoveColors`. Theme-defined colors via `declare module 'move'`
    augmentation — verified type-level (built-ins + augmented names accepted, unknowns
    rejected).
  - `src/shared/color.ts`: `MOVE_COLORS` runtime list (single source; `CANONICAL_TYPES.Color`
    now derives from it). `resolveColor`/intents removed.
  - Badge: dropped inline 19-value union + `COLOR_MAP`; now `BadgeColor = Color`,
    default `'gray'`, palette-only. Spec back-filled (`typeRef: 'Color'`), tests updated.
  - Categorical set confirmed: **Badge, Avatar, ChatBubble, Stepper, Timeline** (all use
    shared `Color`). Loader/Heading/Text keep their own semantic color types (untouched).
  - `MoveColors` + `MOVE_COLORS` barrel-exported (augmentation + discoverability).
  - Verified: `tsc` clean, `spec-drift` 69/69, `barrel-completeness` 69/69, 139 tests pass.
- **2026-07-14 — render layer for theme colors landed:**
  - `src/styles/tokens/accents.css` (imported by `tokens/index.css`): maps each palette
    `[data-color]` to generic role tokens `--move-accent-{solid,solid-fg,soft,soft-fg,border}`.
    Doubles as the contract + the template a consumer copies for a custom color.
  - Each categorical component got a base rule mapping its color-vars to those generics
    (Avatar/Stepper/Timeline/Badge as a `.slot { … }` base; ChatBubble via consumption
    fallback because it toggles data-variant/data-color). Built-in `[data-color]` rules
    still win by specificity → **zero appearance change** for the 13 built-ins.
  - A consumer theme now renders a new color across all 5 components with ONE rule
    (`[data-color='sage'] { --move-accent-solid: …; … }`) after augmenting `MoveColors`.
  - Verified: `npm run build` OK; bundle contains accents.css + the base rules; 139
    component tests pass; `check:css-tokens`/`spec-drift`/`barrel-completeness`/
    `component-conformance`/`purity` all clean.
  - Pre-existing failures in the tree (NOT from this work): `Accordion.tsx:281`
    (`ITEM_SCALE_INSET_PX`) typecheck; `check:spec-tokens` ToggleGroup drift
    (segmented-control refactor).

This plan fixes two things at once, because they share a root cause:

1. **API discoverability** — a consumer (human or AI) could not find `Badge`'s
   `color` enum. Traced to three independent breaks on three read-surfaces.
2. **Color model** — replace raw-primitive color props with a semantic-first,
   theme-owned model so callers pick *meaning* or *named role*, never a hex.

---

- **2026-07-14 — Phases 4+5 done + pre-existing fixes:**
  - **Phase 4 (spec-drift source→spec, #2):** `spec-drift.mjs` gained a top-level
    prop-name parity check (section 2c) — flags a source prop absent from the spec's
    `props` as an ERROR. Scoped to SIMPLE components (`<Name>Props`, no Root subComponent);
    compound roots stay section 2's job. Excludes structural props, `animations`, and
    `controlledProps`-modeled props (value/defaultValue/open/defaultOpen). Proven: injecting
    `Badge.wobble` flags it; removing returns to 69/69 clean. The earlier "20 drift" hits
    were false positives (props modeled under `subComponents[Root]`); Badge/Divider/Grid
    were the only true simple-component drift, already fixed.
  - **Phase 5 (aggregate API surface, #1):** `scripts/generate-api.mjs` (`gen:api`, run in
    `build`) reads every `*.spec.ts` → `move.api.json` (structured) + `llms.txt` (prose) at
    the package root, shipped via `files`. `typeRef` resolves to literal values from the
    canonical registry (single-sourced), so **Badge `color` is now fully enumerated** (all
    13 values) in one file — the consumer's original blocker, closed.
  - **Pre-existing fixes (#3):** Accordion `ITEM_SCALE_INSET_PX` typecheck was already
    resolved in the tree (no action). ToggleGroup `spec-tokens` drift fixed (spec token
    values updated to the `--move-segment-*` refactor). NOTE: a THIRD pre-existing failure
    surfaced once spec-tokens passed — `check:animation-choreography` (animation-map ↔ spec
    drift for press/toggle/popupMenu/popupSurface). Unrelated to this work (animation-vocab
    refactor); left for that effort.

## Part A — The three discoverability breaks (measured)

A consumer walks one of three surfaces to learn a component's API. Two of the
three are broken today; only the least-discoverable one (deep-dist grep) works.

| # | Break | Surface it breaks | Extent (audited) |
|---|-------|-------------------|------------------|
| 1 | **Spec ↔ source drift** — a prop exists in source but not in `*.spec.ts`. Docs + any generated API file derive from specs, so they silently omit it. | docs site, generated API file | **3**: `Badge.color`, `Divider.gap`, `Grid.padding` |
| 2 | **Barrel drops the type** — `src/index.ts` re-export is a hand-authored allow-list; a type in a component's own `index.ts` that the barrel omits is *not* importable from `'move'` and never autocompletes. | `import { type X } from 'move'` (the default move) | **7**: Badge(`BadgeColor`), Avatar(`AvatarColor`), ChatBubble(`ChatBubbleColor`), Stepper(`StepperColor`), Toast(`ToastLabels`), VideoPlayer(6 types), Carousel(4 hook types) |
| 3 | **No aggregate surface** — no single machine-readable file; consumer must spelunk `dist/**/*.d.ts`. | "one lookup instead of dist spelunking" | global |

Why re-exports lose the reference: `package.json` exposes only `"." → dist/index.d.ts`
and does **not** map `./components/*`. So the only importable names are the ones the
barrel explicitly forwards; re-export is not transitive. A name the barrel omits has
no public specifier even though it physically exists in `dist`.

The `*Color` cluster in Break 2 (Badge/Avatar/ChatBubble/Stepper) is the same
recurring palette type — the strongest signal to unify color into a shared model.

---

## Part B — Color model (decisions locked)

### Principle
Primitives are **never** a component API. Raw palettes (`--move-green-600`, and the
13 palette names) are an implementation layer. Above that sit exactly two
component-facing vocabularies:

```
primitives (13 raw palettes × ~11 shades)   ← token layer only, NEVER a prop value
  ↑ built into
semantic intents        theme-owned accent palette
  ↑ consumed by
components (color prop)
```

### Two vocabularies

**Intents — the default, on every color-bearing component.** Meaning-based,
theme-stable, map to semantic tokens.
```ts
type Intent = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
```

**Accents — theme-owned, categorical components only.** For distinction without
meaning (color-coded badges, avatars, timelines). The accent palette is a
**first-class theme construct**, not a fixed library list:

- Move ships a **default** accent palette (a distinct rainbow) — just the out-of-box theme.
- A theme **redefines the set entirely** — count, names, hues. A monochrome-green
  brand can declare `sage`, `forest`, `mint` and *that* is the accent vocabulary.
- Names are hue-roles / theme-chosen; the **theme decides the character**
  (moss vs vibrant vs soft green). `accent="green"` = "the green role", resolved
  through `--move-accent-green-*`, never straight to a primitive.

### Discoverability of a theme-defined set — module augmentation
A theme-relative vocabulary can't be a fixed literal union, so use the
theme-typing pattern (à la Mantine / styled-components):

```ts
// library default
interface MoveAccents { gray: true; red: true; /* …default rainbow… */ }
type Accent = keyof MoveAccents;
color?: Intent | Accent;

// a brand theme augments — these then autocomplete & type-check
declare module 'move' {
  interface MoveAccents { sage: true; forest: true; mint: true }
}
```
Theme-defined **and** discoverable. No `(string & {})` escape hatch — extensibility
lives in the theme registering names, not callers passing arbitrary strings.

### Where curation lives
Preventing arbitrary picks moves to the **theme-authoring boundary**: the theme
author deliberately designs the set; the app dev / AI picks from named roles that
are meaningful within that theme. Move never guesses a magic number.

### Categorical components (verify list before migrating)
Candidates: **Badge, Avatar, ChatBubble, Stepper, Timeline**. All others: `Intent` only.

### Breaking change
`color="violet"` (raw primitive name) is removed as a public value. Handle via
deprecation notes + migration table (Part D).

---

## Part C — Phased plan (complete set)

Dependency order matters: **Phase 2 is independent and highest-leverage** (repairs the
surface consumers actually import from). **Phase 1 → 5** (specs/tokens must be complete
before a generated file is trustworthy). **Phase 6 makes the fixes permanent.**

### Phase 0 — Lock decisions
- Confirm the **default accent hue list** (proposed distinct set: `gray, red, orange,
  yellow, green, teal, blue, purple, pink` — adjust freely; it's overridable).
- Confirm categorical component list (Badge, Avatar, ChatBubble, Stepper, Timeline).
- Confirm accents fold into the single `color` prop (`Intent | Accent`), not a
  separate `accent` prop.
- Triage Break-2 types that are genuinely public (all `*Color`, `ToastLabels`,
  `SubtitleTrack`/`VTTCue` = yes; `UseCarousel*` / `UseVideoPlayer*` only if the hook
  is public API).

### Phase 1 — Color model foundation
- `src/shared/types.ts`: `Intent` const+type; `MoveAccents` augmentable interface;
  `Accent = keyof MoveAccents`; default accent const.
- Theme layer (`src/styles/themes/`): default **accent role tokens**
  `--move-accent-{name}-{solid|soft|fg…}`, defaulting to Open Color primitives but
  overridable per theme. Ensure semantic **intent** role tokens exist for all six intents.
- Barrel: export `Intent`, `Accent`, `MoveAccents` from `src/index.ts`.

### Phase 2 — Fix Break 2 (barrel) + migrate categorical components
- Add every missing public type to its `src/index.ts` re-export line (7 components).
  *(Additive, non-breaking — do this first, independently; it's the biggest immediate win.)*
- Migrate categorical components to `color?: Intent | Accent`; drop raw primitive
  names from their unions; keep per-component alias types (`type BadgeColor = Intent | Accent`)
  pointing at the shared types so nothing else breaks.
- Update each categorical component's CSS to key on the accent role tokens.

### Phase 3 — Fix Break 1 (spec drift)
- Back-fill specs so props match source, using `typeRef` (no inline value duplication):
  - `Badge.spec.ts`: add `color` (`typeRef: 'Color'`/`Accent` model).
  - `Divider.spec.ts`: add `gap`.
  - `Grid.spec.ts`: add `padding`.
- Docs + generated surface now see every enum.

### Phase 4 — Lock it with validators (so the complete set stays fixed)
- Extend `spec-drift.mjs`: also flag **source-only props** (generalizes the Break-1 fix).
- New `barrel-completeness` check: every type a component's `index.ts` exports must
  appear in `src/index.ts` (generalizes the Break-2 fix).
- New `color-vocabulary` check:
  1. **No-primitives rule** — no component prop union may contain a raw primitive
     palette name. *This is the enforced "AI can't cherry-pick primitives".*
  2. **Accent ↔ theme parity** — every registered accent name resolves to
     `--move-accent-{name}-*` tokens, and vice-versa (follows the accent set into
     consumer themes via a shippable `move check` rule).
  3. **Intent ↔ token parity** — every intent resolves to its semantic token.
- Wire all into `check:all` + pre-commit + CI.

### Phase 5 — Ship the aggregate surface (Break 3)
- Generator over all `*.spec.ts` → **`move.api.json`** (structured) + **`llms.txt`**
  (prose, one example per prop), emitted at package root.
- `typeRef` resolution: `Size → shared`, `Accent →` default accent set + a note that
  themes redefine it; enumerate the *default* vocabulary honestly.
- Add both files to `package.json` `files`. Correct fleet-wide because Phases 1–4
  made specs complete and enforced.

### Phase 6 — JSDoc + naming consistency
- Make "every prop gets a JSDoc intent line" a `component-generate-source` rule + lint.
- Naming convention: `variant` = visual style, `color` = intent/accent. Only breaking
  case is Alert's `variant`-as-color → deprecation alias, or defer. Flag-only unless approved.

---

## Part D — Breaking-change & migration handling
- `color="violet"` → nearest intent (`primary/success/…`) or a named accent role.
  Ship a migration table + codemod note in docs.
- Per-component alias types retained (`BadgeColor` etc.) so type imports keep resolving.
- Alert `variant` rename gated behind explicit approval; alias kept for one minor.

---

## Appendix — audit reference
- Palettes today: **13** (gray, red, pink, grape, violet, indigo, blue, cyan, teal,
  green, lime, yellow, orange), each ~11 shades + paired foregrounds.
- Break-1 drift: `Badge.color`, `Divider.gap`, `Grid.padding` (3).
- Break-2 barrel gaps: Badge, Avatar, ChatBubble, Stepper, Toast, VideoPlayer, Carousel (7).
- Theme layer exists: `src/styles/themes/{light,dark,types}.ts` — home for accent tokens.
