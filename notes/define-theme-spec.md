# defineTheme — Spec

## ⏸ Session handoff (2026-07-14) — read this first

**Built, tested, green (barrel-exported):**
- `color-engine.ts` — OKLCH↔sRGB, WCAG 2.2 contrast (8-bit path), **gamut-mapping by chroma
  reduction** (preserves hue — fixed a ~9.5° light/dark hue split), `clampToContrast`.
- `defineTheme` / **`defineThemes`** (one seed → `{light,dark}`) / `describeThemes` (+notices).
- `auditTheme` + `parsePrimitives`/`themeColorOf`. Ran on shipped themes → **found 6 real WCAG
  failures** in the hand-authored `light.ts`/`dark.ts`.
- **Theme Builder** docs page `/customize/theme` — thin controls (accent hue, background tint
  hue+strength, presets), **holistic light+dark preview that IS the WCAG proof**, one verdict
  ("Meets WCAG 2.2 AA — N colors auto-adjusted") below it, per-pair numbers behind a disclosure.

**Fixes this session:** gamut hue-shift; subtle text → AA (dropped the large-text loophole);
OKLCH slider gradients (was HSL → purple mismatch); soft-Badge hairline border (1.4.11 on tinted
surfaces); OKLCH-consistent swatches.

**Design decisions LOCKED:**
- **Thin seed = irreducible free variables + laws; everything derivable is generated, not a knob.**
- **Text tint is DERIVED**, not tunable — fades toward body (`fg-base` 12% / `muted` 28% /
  `subtle` 50% of neutral chroma). Body stays near-neutral for legibility.
- Contrast is clamped, never chosen (surfaced as a notification).
- Semantics: meaning anchored (green/red/…); may harmonize subtly (neutral tint + accent chroma),
  never reassign hue.
- Categorical color = `keyof MoveColors` (augmentable, theme-owned, no intents) — see [[color-model]].

**THIN SEED — final shape (only 2 real additions left to build):**
```ts
defineThemes({
  neutral: { hue, chroma },
  accent:  { hue },
  radius:  'md',        // ← ADD: one value, scales --move-rounded-*
  secondary?: { hue },  // ← ADD: optional 2nd brand hue, generated like accent
  status?: { … },       // optional, defaulted
})
```
Gap analysis vs M3/Radix/Tailwind/Carbon/DTCG: **ahead** on WCAG-guaranteed + OKLCH+gamut +
one-seed→both. **Missing (seed):** secondary hue, radius → adding. **Missing (derive, no seed
cost):** `on-*-subtle` pairs, semantic harmony → generate. **Missing (format):** DTCG → roadmap.

**NEXT — in order:**
1. Build **radius** (seed → `--move-rounded-*` scale) + **optional secondary** (full fill/text/
   focus/soft, contrast-guaranteed). Nudge muted/subtle tint curve while there.
2. Generate **`on-soft` pairs** (`on-primary-subtle`, etc.) — closes 1.4.11 / container-completeness,
   zero seed cost.
3. **Dogfood** `light.ts`/`dark.ts` through `defineThemes` (fixes the 6 real WCAG bugs) — review in
   the Builder before swapping.
4. **Gate** `auditTheme` as `check:theme-contrast` (library + consumer `move check`).

**DEFERRED (roadmap, not the thin seed):** semantic-color harmonization (OKLCH status ramps: anchor
hue + neutral tint + accent chroma) · DTCG export for `move.theme.json` · `move.theme.json` AI schema
(extend generate-api) · docs "Make it your own" pages (Overview/Tokens/Colors + Builder embedded) ·
`app-theme-import` / `app-theme-compose` skills · Tabs[pills]⇄ToggleGroup segment-parity (queued).
**Skip (YAGNI):** tertiary color, density modes, font-in-seed (keep `--move-font` a plain override).

---

# defineTheme — Spec (original)

Status: building (2026-07-14). Validated interactively via the OKLCH tuner spike.
Target standard: **WCAG 2.2 AA** (stated explicitly everywhere — builder UI, docs, the
`check:theme-contrast` output, and `defineTheme`'s JSDoc).

## Two surfaces, one engine

`defineTheme(seed)` is a **pure, framework-agnostic engine** that expands a small seed into
the full `ThemeTokens` set with WCAG 2.2 guaranteed. Two surfaces sit on it:

- **Human** → the **Theme Builder** (a Move-components app/docs page): live preview, color
  picker (hue is part of Move's `ColorInput`, not a standalone slider), radius + type
  controls, the WCAG matrix. Emits a `defineTheme({...})` config + token CSS.
- **AI** → the `defineTheme` type + a machine-readable **`move.theme.json`** schema (same
  role as `move.api.json` for components). The AI writes `defineTheme({...})` in code and
  **never reasons about contrast** — the engine guarantees it and reports any nudge.

Mirror of the component story: docs site = human, `move.api.json` = AI, one source.

## Seed shape

```ts
defineTheme({
  name: 'brand',
  appearance: 'light' | 'dark',            // generate one; call twice for both
  neutral: { hue: 250, chroma: 0.008 },    // EXPLICIT (no 'auto'); off-white/off-black,
                                           //   never pure #fff/#000, so warm/cool is real
  accent:  { hue: 262 },                   // brand → fill + text + focus roles
  status:  { success:'green', warning:'yellow', danger:'red', info:'blue' },
  radius:  'md',                           // rounding base
  font:    { body: 'inter', mono: 'jetbrains-mono' },
  fontSource: 'fontsource' | 'google' | 'system' | 'self',  // default: fontsource (GDPR-safe)
  colors?: ['plum','ocean'],               // extra MoveColors accents (augmentable palette)
  tokens?: { '--move-primary': '…' },      // escape hatch: override any expanded token
})
```
Icons are NOT in the seed — they're an `iconResolver` (asset) concern, kept in
`/customize/icons`. Fonts ARE tokens: the seed sets the family + scale; **delivery** is a
convention (`fontSource: 'fontsource'` → `@fontsource/*` self-hosted, no external request /
no GDPR issue; `google` = CDN opt-in; `self`/`system` = BYO). The `app-*` skills wire the
import from `fontSource` so the AI gets one-line ergonomics.

## Neutral surface derivation (OKLCH)

Fixed hue+chroma, lightness swept per token, per appearance. Chroma is strongest on the
large backgrounds and fades toward text (so body copy never looks tinted). `cm` = chroma
multiplier. Dark mode multiplies chroma by the **dark tint saturation** constant (≈**1.5**;
tint reads weaker on dark grounds — this is saturation, not darkness).

| token | L light | L dark | cm |
|---|---|---|---|
| bg-base | 0.994 | 0.170 | 1.00 |
| bg-subtle | 0.978 | 0.205 | 1.15 |
| bg-muted | 0.958 | 0.248 | 1.25 |
| bg-emphasis | 0.930 | 0.295 | 1.30 |
| border-base | 0.905 | 0.325 | 1.10 |
| border-muted | 0.875 | 0.380 | 1.00 |
| border-emphasis | 0.800 | 0.455 | 0.85 |
| fg-subtle | 0.600 | 0.560 | 0.50 |
| fg-muted | 0.450 | 0.720 | 0.28 |
| fg-base | 0.220 | 0.955 | 0.12 |

## The contrast contract (grounded in real component usage)

Text tiers (3) × surfaces (4), plus the accent/status text roles and non-text items.
Each guaranteed only on the surfaces it realistically lands on:

- **fg-base** (42 uses) — all 4 surfaces — aim AAA 7, floor AA 4.5.
- **fg-muted** (53 uses, incl. **placeholders**) — base/subtle/muted — **target ≈5.5** for
  reading comfort (above the bare AA 4.5 floor; user feedback: bare AA felt light).
- **fg-subtle** (3 uses, decorative) — base/subtle only — 3:1 large; never real body text.
- **accent-fill** (`primary`, buttons) — its **label** (`primary-fg`) clamped to AA 4.5.
- **accent-text** (`link`, 25 `primary`-as-text uses are the risky pattern) — clamped to AA
  4.5 on all 4 surfaces. Components must use this for text, not the fill.
- **status-text** (`error` 22×, success/warning/info) — readable variants clamped to AA on
  surfaces (separate palettes; same guarantee).
- **focus-ring** — **3:1** on every surface (WCAG 1.4.11; 2.2 §2.4.13 adds ≥2px area).
  Current default `--move-focus-ring-color: indigo-400` computes ≈**2.98:1** on white → a
  real bug the clamp fixes.
- **icons** — inherit their text token, so covered by the above (status icons = status
  color = must be 3:1 as graphics, 1.4.11).

**Contrast is an enforced invariant, not a setting.** The engine clamps lightness toward the
extreme until the target is met (chroma bends, L wins); WCAG luminance is computed via the
exact 8-bit sRGB path (matches WebAIM/axe). When a seed needed a nudge, `defineTheme`
returns a **notification** (which tokens, which mode) — a warning, never a block.

## Non-color 2.2 SCs — component/app scope, NOT the theme engine
`2.5.8 Target Size` (≥24px), `2.4.11 Focus Not Obscured`, `2.5.7 Dragging`,
`3.3.7/3.3.8` — honored by components/app skills, out of `defineTheme`.

## Build order
1. **`color-engine.ts`** — pure OKLCH↔sRGB, WCAG-2.2 contrast, per-tier lightness clamp. (this increment)
2. **`defineTheme.ts`** — seed → full `ThemeTokens`: generated surfaces + accent/link/focus
   + status-text + per-palette blocks + shadows(seed). Dogfood: rebuild `light.ts`/`dark.ts`.
3. **`check:theme-contrast`** — CI guard over the whole contract, labeled WCAG 2.2 AA.
4. **`move.theme.json`** — AI schema of the seed + guaranteed roles (extend generate-api).
5. **Theme Builder** — Move-components app: ColorInput/InputRange/Tabs/Table live preview.
6. **Docs** — Make it your own: Overview → Theme → Colors → Tokens (builder embedded).
7. **Skills** — `app-theme-import` (external tokens → seed), `app-theme-compose` (brief → seed).
