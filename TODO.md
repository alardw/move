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
