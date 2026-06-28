---
name: component-generate-docs
description: "Generate a docs page (content folder + samples) for a Move component in packages/docs. Requires spec + source."
user-invocable: true
argument-hint: "[ComponentName]"
---

# Generate Docs — Component Documentation Page Generator

Generate a documentation page for a Move component in the docs app
(`packages/docs`). **REFUSES without an existing spec and built component.**

The docs app is **content-driven**: every component shares ONE page template
(`src/pages/components/ComponentDocPage.tsx`) that renders from a content folder.
The API/props table and design-tokens table are derived automatically from the
component's `.spec.ts` — you never hand-write them. You only author the prose
(`meta.ts`) and the live examples (`samples/*.tsx`), then register the slug.

---

## How to Run

**Input:** A component name (e.g. "Badge", "AnimatedText").

**Output:** written under `packages/docs/src/content/components/{slug}/`:
- `meta.ts` — `ComponentMeta` (tagline, highlights, related, badges, importCode, a11y lede)
- `samples/*.tsx` — one default-export React component per example
- `index.ts` — imports the spec + meta + samples (component and `?raw` source), exports `content`
- one import line + one map entry added to `packages/docs/src/content/components/index.ts`

`{slug}` = kebab-case of the component name (e.g. `AnimatedText` → `animated-text`).

**REFUSES if:** `src/components/{category}/{Name}/{Name}.spec.ts` does not exist, or
the component is not exported from `move` (`packages/move/src/index.ts`). Run
`/component-generate-source {Name}` (or `/component-generate-all {Name}`) first.

---

## Process

### Step 1 — Read inputs

1. `packages/move/src/components/{category}/{Name}/{Name}.spec.ts` — drives slug,
   category, props, tokens, variants, a11y contracts, and which axes to demo.
2. `{Name}.meta.ts` and `{Name}.analysis.md` (if present) — source for tagline,
   highlights, and related components.
3. `packages/docs/src/content/components/types.ts` — the `ComponentMeta` /
   `ComponentContent` / `ComponentSample` contract.
4. An existing exemplar in the **same category** (e.g. `text/`, `badge/`) — match
   its meta shape, sample style, and `index.ts` wiring exactly.

### Step 2 — Verify placement facts

- `spec.category` = the folder in the `@move-specs/{category}/{Name}/{Name}.spec`
  import path (alias → `packages/move/src/components`).
- Confirm `{Name}` is exported from `move`; samples import it from `'move'`.
- `categories: [spec.category]` in meta (`categories[0]` is the canonical home;
  must be a valid id in `content/components/taxonomies.ts`).

### Step 3 — Write `meta.ts`

`ComponentMeta` fields (see `types.ts`):
- `slug`, `name`, `tagline` (one line, what it is — no design rationale).
- `categories: [spec.category]`.
- `badges` — trait chips only (NOT the category, which is derived). Use the
  established vocabulary, e.g. `{ icon: 'rabbit', label: 'Animated' }` for any
  component with motion, `{ icon: 'boxes', label: 'Compound' }` for compound APIs.
- `highlights[]` — 2–3 `{ icon, text }` bullets of what's notable. Reuse icon
  names already used in sibling `meta.ts` files (e.g. `type`, `eye`, `shapes`,
  `rabbit`, `sparkles`) — an unknown icon renders blank.
- `related[]` — `{ to, name, reason }` cross-links to siblings (and relevant
  `/animation/*` pages for animated components).
- `importCode: \`import { {Name} } from 'move';\``.
- `keyboard[]` — rows for the a11y section; `[{ key: '—', action: '{Name} is presentational.' }]` when there's no keyboard interaction.
- `accessibilityLede` — prose derived from the spec's a11y `renderContracts`
  (label mechanism, reduced-motion, focus). Describe behavior, not rationale.

### Step 4 — Write `samples/*.tsx`

- One **default-export** React component per file, built only from `move`
  components (plus light inline `style` for illustration). No custom CSS modules.
- Pick samples from the spec's **demo axes**: one per primary variant/behavior
  prop (e.g. an effects sample, a granularity sample, a sizes sample). 2–4 total.
- Keep each self-contained and copy-pasteable — the `?raw` source is shown
  verbatim in the Code tab, so it must read as a clean usage example.
- For animated components, prefer a `trigger`/hover affordance so the motion is
  replayable in the static preview, and add a one-line `<Text size="sm" color="muted">`
  hint. Respect the component's real prop names and string-children constraints.

### Step 5 — Write `index.ts`

```ts
import { spec } from '@move-specs/{category}/{Name}/{Name}.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Effects from './samples/effects';
import effectsCode from './samples/effects?raw';
// …one (component, ?raw) pair per sample

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'effects', title: 'Effects', render: Effects, code: effectsCode },
    // …
  ],
};
```

### Step 6 — Register the slug

Edit `packages/docs/src/content/components/index.ts`:
1. Add `import { content as {camelName} } from './{slug}';` in alphabetical order.
2. Add `'{slug}': {camelName},` (or bare `{slug},` when slug === identifier) to
   the `COMPONENT_CONTENT` map, alphabetically.

No `App.tsx`, `nav.ts`, routing, PropsTable, or TokensTable edits — the
`/components/{slug}` route, overview-grid card, API table, and tokens table all
come for free from the spec + registry.

### Step 7 — Verify

- `cd packages/docs && npx tsc --noEmit -p tsconfig.json` → 0 errors (catches a
  bad spec import path, wrong sample prop types, or a broken `move` export).
- Confirm every `highlights[].icon` / `badges[].icon` name appears in a sibling
  `meta.ts` (else it renders blank).

---

## Rules

1. **REFUSE without a spec and a `move` export** — docs derive the API table from
   the spec and render live samples from the real export; both must exist first.
2. **Never hand-write the props/tokens tables** — they come from `spec.props` /
   `spec.tokens` via the shared template. Authoring them by hand is a defect.
3. **Samples are `move`-only** — no custom CSS modules, no raw layout HTML; use
   Move components (light inline `style` for illustration is acceptable).
4. **Slug = kebab-case of the name**; spec-import category = `spec.category`.
5. **Reuse existing icon names** for highlights/badges — unknown icons render blank.
6. **Prose describes what it is, never the design rationale** (house docs rule).
7. **Register exactly once** — one import + one map entry, both alphabetical.
8. **Typecheck the docs package** before declaring done.
9. **Animation note** — bespoke `/animation/*` concept pages (added to `App.tsx`
   + `nav.ts`) are out of scope; this skill generates the standard per-component
   page only.
