# Adapters & Integration — handoff brief

Status as of 2026-06-30. This thread is **mostly design-stage**: the thesis is
settled and a few instances exist, but the general mechanism is not built. Read
this top-to-bottom and you have the full picture.

## The thesis

Move components are **agnostic**: bring your own data, icons, words, and
services. The consistency half is "everything obeys the same universal laws";
this is the openness half — "bring your own X."

An **adapter is just a function (or value) that satisfies a typed contract the
component declares.** There is **no adapter framework** — no providers to wrap,
no registry. The component exposes a typed prop (the contract); the consumer
passes a function. Where sensible, the component ships a **built-in default** so
it works with zero wiring.

Two homes:
- **Component-specific adapters** live *with the component* (a prop on it).
- **Cross-cutting adapters** (i18n, syntax-highlight, async data) should live in
  a shared **`move/adapters`** — **NOT YET CREATED**.

## What's BUILT (the pattern in practice)

- **Icons — the canonical example.** `iconResolver` on `MoveRoot` +
  `useIcon(role)` / `ICON_ROLES`. The consumer brings their icon set
  (lucide/heroicons/custom); `builtinIcons` is the default fallback. This is the
  template every other adapter should follow: a typed resolver + a default.
- **i18n.** Every component takes one `labels?: Partial<{Name}Labels>` merged
  with `DEFAULT_LABELS`. The consumer feeds it from their own i18n lib. No global
  provider.
- **PasswordStrength.** Scoring-agnostic by design — **never bundles zxcvbn**.
  Priority: controlled `score` → `estimate?: (value: string) => number` →
  built-in length/character-class heuristic. Exports `estimatePasswordStrength`.
  This is the cleanest "one prop = the contract, plus a built-in default" case.
- **FileUpload.** Has an upload-manager seam (`useUploadManager`, `types.ts`) —
  the consumer wires the real upload. (Closest existing thing to a non-trivial
  adapter; worth reading as a reference before designing the general mechanism.)

## RESOLVED design — component `integrationPoints` (2026-06-30)

The mechanism is now designed (not yet built). Key decisions:

**A contract is *code*, not spec data.** The exemplars are all function contracts
(`IconResolver`, `estimate: (v)=>number`, `FileUploadAdapter`). You cannot
generate a function type from a field-shape DSL (the recipe `shape:
RecipeDataField[]` style only works for data records). So the spec does NOT
generate the type — it **references** a hand-authored, exported TS contract by
name. This is the same move as `iconsUsed: string[]` (spec lists names; the
icons are code). It also means validation reuses the existing stack wholesale —
TS already type-checks the generated prop and the consumer's value against the
contract at compile time; a drift check (same family as the icon/i18n checks)
confirms the references line up. No new machinery.

**Proposed spec field** (to add to `ComponentSpec` in `src/spec-type.ts`):

```ts
interface ComponentIntegrationPoint {
  id: string;            // becomes the prop name: 'adapter', 'estimate', 'resolver'
  description: string;   // docs prose + what the consumer supplies
  kind: 'handler' | 'service' | 'data' | 'asset';
  contract: string;      // exported TS type name, e.g. 'FileUploadAdapter'
  from?: string;         // import source: './types' (default, co-located) | 'move/adapters'
  default:
    | { strategy: 'builtin'; export: string }  // estimatePasswordStrength, builtinIcons
    | { strategy: 'noop' }                      // inert/no-op (FileUpload null-manager)
    | { strategy: 'none' };                     // genuinely required — must pair with required:true
  required?: boolean;
}
```

**Default policy (the one genuine product call, now decided).** Every integration
point MUST declare one of `builtin | noop | none+required`. "No functional
default" is therefore a *loud, validated* choice, never a silent gap. The
reframed principle #2: not "every seam has a functional default" but **"every
seam has a *declared* default story, and the component never hard-crashes
unconfigured."** This is the only version true across all exemplars without
contorting any:
- icons → `builtin` (builtinIcons)
- PasswordStrength → `builtin` (estimatePasswordStrength)
- FileUpload → `none + required:true` — a file uploader is *inherently* external
  (no backend ⇒ nothing to upload to), so requiring the adapter is honest;
  a fake default endpoint would be worse. DRM/VideoPlayer will be the same.

**Validation rules** (new `integrationPoints` GroupDef + RuleDefs in
`validation-spec.ts`, sibling to `icons`/`i18n`, `requires: ['renders']`):
1. each `contract` is exported from `from`
2. the generated prop exists and is typed to `contract`
3. `default.strategy:'builtin'` ⇒ the named `export` exists
4. `default.strategy:'none'` ⇒ `required:true` is set (forbids silent omission)

All static / compile-time — no runtime adapter framework.

## What's DESIGNED but NOT built

- **Component-level `integrationPoints` in the spec.** Recipes already declare
  `integrationPoints`; **components do not** (no field in `src/spec-type.ts`).
  Design is RESOLVED (see section above) — what remains is implementation:
  add the field, teach the generator to emit the prop + default wiring, and add
  the validation group. (task #3.)
- ~~**`move/adapters/` directory**~~ — CREATED 2026-06-30 at `src/adapters/`
  (single file, `index.ts`, surfaced through the main barrel). It DEFINES the new
  cross-cutting contracts and RE-EXPORTS existing ones (`IconResolver`,
  `IconRoleOverrides`, `CodeHighlighterFn`, `HighlightResult`) as one catalogue —
  type-only re-exports, so each contract keeps its runtime home and nothing
  relocates. This is the path the generated `integrationPoints` `from: 'adapters'`
  resolves to.
- ~~**`AsyncResource<T>`**~~ — SHAPE DECIDED + scaffolded 2026-06-30 in
  `src/adapters/index.ts`. Discriminated union `loading | error | success` (NOT a
  flat record — a component can't render `data` mid-load). `error` carries
  optional `retry`; `success` carries optional `refreshing` for background
  refetch; `idle` is modeled by the prop being `undefined` (no variant). Ships
  with `asyncResource.{loading,success,error,from}` — `from()` maps the flat
  `{data,error,isLoading,isFetching,refetch}` shape of React Query / SWR onto the
  union in one line.
  - **First consumer (2026-06-30): Autocomplete.** A `resource?: AsyncResource<unknown>`
    root prop drives loading/error status (supersedes the `loading` boolean) and feeds
    two NEW compound slots `<Autocomplete.Error>` + `<Autocomplete.RetryTrigger>`
    (RetryTrigger reads `retry` from context, mirroring ClearTrigger — chosen over a
    render-prop because the library has zero render-props and a strong `*Trigger` idiom).
    Status-only: the `data` payload isn't consumed (options stay as Item children).
    Filled a real gap — Autocomplete had no error state before. Spec/tests(+6)/labels
    (`retry`)/CSS updated; all checks + 1814 tests green.
- **Highlight / shiki adapter** — PARTLY BUILT (the brief previously said "not
  built"). `Code` already ships `CodeHighlighterProvider` / `useCodeHighlighter`
  / `CodeHighlighterFn` / `HighlightResult` — the consumer brings the highlighter,
  Move never bundles shiki. The contract is now catalogued in `src/adapters`. Open:
  generalize it for the future `Markdown` and decide whether the provider moves to
  `adapters` or stays in `Code`.
- **Markdown component** (task #4) — for AI/chat (used inside `ChatBubble`). Built
  on a markdown adapter + the (existing) highlight adapter.
- **AiChat recipe** (task #9) — streaming + markdown.
- **VideoPlayer integrations** — subtitles, multiple formats, DRM (Widevine):
  the consumer brings the player/DRM; Move stays format-agnostic.

## Component classification (the sweep)

~69 components were classified. Integration surfaces concentrate in:
**RichTextEditor, FileUpload, PasswordStrength, VideoPlayer**, and the future
**Markdown** and **AiChat**. On top of that, two **universal** cross-cutting
adapters touch every rendered component: **icons** (`iconResolver`) and **i18n**
(`labels`). (The full per-component master inventory was produced in
conversation but never persisted — regenerate it if needed.)

## Design principles to preserve

1. An adapter is a plain function satisfying a typed contract — no framework.
2. Every seam has a **declared default story** (`builtin | noop | none+required`)
   and the component never hard-crashes unconfigured. A functional default is
   the goal (estimate→heuristic, icons→builtinIcons), but `none+required` is a
   legitimate, validated outcome for inherently-external seams (FileUpload, DRM).
   (Refined 2026-06-30 — was "always ship a built-in default; zero-config must
   work," which FileUpload's required adapter already contradicted.)
3. Component-specific adapters co-locate; cross-cutting ones go in `move/adapters`.
4. Never bundle a heavy dependency the consumer might swap (zxcvbn, shiki, a DRM
   lib) — make it an adapter.
5. The contract is typed; the consumer's adapter is type-checked against it.
6. **A `noop` seam must SURFACE that it needs wiring.** When an integration point
   has no functional default and isn't yet configured, the component renders a
   visible "not configured" affordance (disabled state + a hint), never a UI that
   looks functional. A no-op must read as "not wired yet," not as a bug. (Added
   2026-06-30.) This becomes a validation rule in the `integrationPoints` group.

## How this connects to the validation/coverage work (also in flight)

The validation system is now spec-driven (`packages/docs/src/pages/ai/validation-spec.ts`
is the source of truth; `check:validation-spec` guards it). When component
`integrationPoints` land, they likely become **a spec dimension + a coverage
group** ("declared integration points have a typed contract + a default"). Keep
the two threads aware of each other.

## Open decisions for the next session

- ~~Exact mechanism for component `integrationPoints`~~ — RESOLVED 2026-06-30
  (see "RESOLVED design" section). Remaining work is implementation, not design.
- ~~`AsyncResource<T>` shape~~ — DECIDED + scaffolded 2026-06-30 (`src/adapters`).
  Next: have a data component actually consume it.
- ~~Folder layout for `move/adapters`~~ — DECIDED: one file, catalogue pattern
  (`src/adapters/index.ts`). Still open: an i18n helper contract here, and
  whether the `CodeHighlighter` provider moves here or stays in `Code`.
- Whether adapters get their own validation/coverage group. (Likely yes — the
  `integrationPoints` group; principle #6's noop-affordance rule lands there too.)

## Related tasks

#3 design integrationPoints mechanism · #4 Markdown · #9 AiChat · #6 SSO/passwordless
SignIn (an adapter-shaped auth variant) · #2 integration inventory (done).
