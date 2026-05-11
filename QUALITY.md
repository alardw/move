# Quality Framework

How we measure whether Move is any good. Use this as the rubric when
planning work, auditing the library, or arguing about priorities.

The dimensions are grouped by what's automatable today, what needs a
person to look at, and what's specific to Move's positioning. Each
section names the metric and how to measure it. The bottom of the doc
ranks what to build first if you only have time for three things.

---

## 1. Hard metrics (automatable)

| Dimension | Why it matters | What to measure |
|---|---|---|
| **Test count + coverage** | Catches regressions, gates merges. | Lines / branches / functions %, count of behavior tests vs implementation tests, count of a11y assertions. |
| **Bundle size per component** | Consumers pay per import. | Gzipped size of each component built in isolation, with a budget per category (`Button < 3 KB`, `Table < 10 KB`). CI fails on regression. |
| **Tree-shake fidelity** | Confirms `sideEffects: ["*.css"]` actually works. | Smoke fixture that imports one component; assert the bundle does not contain symbols from any of the others. |
| **TypeScript surface** | IntelliSense + type safety. | Count of `any` / `unknown` in public API, count of `// @ts-expect-error`, every public component exports its `Props` type. |
| **Spec ↔ source ↔ docs drift** | Move's AI story rests on the spec being truth. | Linter that asserts: every component has a `spec.ts`; every prop in source is in the spec; every prop in the spec is documented in `PropsTable`; spec hashes match source. |
| **Accessibility** | Non-negotiable for a UI library. | Run `@axe-core/react` on every sample in the docs. Zero criticals, zero serious. |
| **Visual regression** | Catches "looks broken" bugs that unit tests miss. | Playwright + per-sample screenshots. PRs flag pixel diffs above threshold. |
| **Animation smoke** | Confirms no jank or runtime errors. | Headless browser opens each animated component, asserts no console errors, asserts `prefers-reduced-motion` is honored. |

---

## 2. Consistency checks (automatable, Move-specific)

These are scripts to run in CI. They make the library predictable
enough for both engineers and AI to write against without checking
each component's idiosyncrasies.

| Check | What it asserts |
|---|---|
| **Variant union symmetry** | Every `*.Trigger` accepts the same `variant` set. Every component with `size` accepts the same `'sm' \| 'md' \| 'lg'`. Catches drift like "Select uses `outlined / filled` but Autocomplete uses `primary / secondary`." |
| **Controlled-state pattern** | Every controlled component uses `value` / `defaultValue` / `onValueChange` — not `selected` / `onChange` / `activeKey`. |
| **Slot naming** | Every compound has `Root`. Open/close primitives use `Trigger` + `Content`. Lists use `Item`. No mix of `Option` vs `Item`. |
| **Token usage** | No raw color hex in any `.module.css` outside of token definition files. No magic numbers like `1.234rem` — everything resolves through a token. |
| **Animation contract** | Every animated component honors the `animations` prop (`true` / `false` / `AnimationTrigger[]`) and respects `prefers-reduced-motion`. |
| **Compound completeness** | Spec lists every sub-component; runtime exports match; a docs sample exists per sub-component. |

---

## 3. Documentation health

| Dimension | Metric |
|---|---|
| **Coverage** | % of components with a real docs page (today: 4 of 67 ≈ 6%). |
| **Sample density** | Average samples per documented component. Target: ≥ 4. |
| **Sample diversity** | Each documented component should show: basic, variants, sizes, an interactive state, an a11y / keyboard concern. |
| **Live code parity** | Sample code shown matches what's rendered. Already enforced via `?raw` imports. |

---

## 4. Move-specific: the AI angle

Move's pitch is being predictable enough for AI to write against.
None of these have great tooling yet — they need to be built. This is
where the most novel quality work lives.

| Signal | How to measure |
|---|---|
| **Skill output consistency** | Run the same prompt 5 times against the `app-page` skill. Diff the structural shape of the output. If it varies wildly, the spec isn't constraining enough. |
| **Skill correctness** | Generated code passes type-check, lint, and a11y on first run, with no manual fix-up. |
| **Spec roundtrip** | Take a generated component → re-extract its spec → assert the extracted spec matches the original it was generated from. |
| **Drift after a long prompt session** | After 10 sequential prompts ("now add a sidebar", "now make it dark mode", "now add a settings page"), does the result still look like Move, or has it degraded into hand-rolled HTML? |
| **AI legibility of source** | Pick 5 random components. Ask Claude to summarize each in one paragraph. Compare to the spec description. The closer the summary matches the spec, the more readable the source is to an LLM. |

---

## 5. Real-world signals

Hardest to fake, slowest to gather, most honest.

- **Time-to-first-render** for a fresh `npx create-move-app` — clock it.
- **Issue triage time** — median PR time to merge, median issue time to first response.
- **Docs site as dogfood** — the docs use Move; if the docs look polished, that is evidence.
- **External app count** — apps actually shipping with Move.
- **GitHub stars / npm downloads / Discord activity** — vanity metrics but they trend.

---

## 6. Subjective / craft (no metric, but you can audit)

- **Visual coherence** — do all 67 components look like one family? Take 9 random screenshots, lay them out 3 × 3. Does it pass?
- **Motion coherence** — same exercise for animations. Do dropdown / popover / dialog share a similar enter/exit feel?
- **Voice consistency in docs** — take 5 random doc pages. Same tone, same level of wit?
- **Density coherence** — does `size="md"` feel the same in Button as in Select as in Table?

---

## What to build first

If you only ship three of these, ship these three. They unlock the
biggest leverage for the smallest investment.

1. **Spec ↔ source ↔ docs sync linter.** Move's AI thesis lives or dies on
   this. Even a basic version — every spec has matching source, every
   prop documented, every spec field populated — buys huge
   predictability and catches drift before it lands.

2. **Visual regression on every sample.** A few hundred MB of CI
   artifacts; catches the class of bugs that lints and unit tests
   genuinely miss.

3. **Per-component bundle budget with a CI gate.** Once you set the
   budget, bundle regressions stop being silent.

Everything else is incremental and can be added category-by-category.
