# Steve — consumer findings register

Two independent applications built on Move by an external consumer, each keeping
its own register. This file is the **interpreted, deduplicated, prioritised**
merge of both, with every claim checked against this repo rather than taken on
trust — so it can be worked through and ticked off.

| Source | App | Register | Move version |
|---|---|---|---|
| `J*` | Jybbo Desktop (clinical, NL/EN) | `jybbo_desktop/jybbo-move/` | vendored 0.1.50 |
| `A*` | Nebulaa front end | `beats-showcase/nebulaa-move/` | vendored 0.1.50 |

Both vendor a packed tarball and never edit this repo. This repo is at **0.1.51**,
so some findings are already stale — marked below.

**Verified:** 2026-08-24 against `packages/move/src`.

Status: `[ ]` open · `[x]` done · `[~]` fixed but unverified in a browser ·
`[–]` won't fix / by design (record the reason).

> Convention note: repo docs normally live in `notes/`. This sits at the root
> because it is a live cross-project tracker rather than a design note.

---

## 0. Already resolved — verify before spending time

- [x] **A8 · dev-JSX in the published package** — *their highest-severity item.*
      `jsxDEV` crashes every consumer production build; both projects shipped a
      local shim. **Current `dist/components` has zero occurrences.** It was a
      dev-mode build getting packed, not a code defect — which is exactly why
      they saw it return with each tarball.
      → **Residual work: a publish guard.** See T4-1. Until that exists this
      recurs silently and they carry a patch forever.
- [x] **J12b · NumberInput label wiring** — now routes through `useFieldControl`.
- [~] **A9 · ToggleGroup outline/pills `!important` fight** — the competing
      `!important` on both sides is gone as of this session's cascade-layer
      migration; `ToggleGroup.module.css` has none left. The reported hover
      border flicker should be gone. **Needs a browser check to close.**
- [x] **A9 follow-on · stale comments** — two comments still explained why
      `!important` was "needed". Corrected.

### Filed twice / numbering collisions

- **J4 ≡ J18** (Password toggle) — one finding.
- **J12 is used twice** — FormField wiring *and* the audio waveform primitive.
  Referred to here as **J12** and **J12-b**.
- **A2 ≡ J9** — spec types not exported. One fix serves both.
- **A1** — React resolution in a11y tests; hit identically by both projects.

### Partly stale

- **J18** claims the Password toggle string is "baked in and English-only". It
  is not: `PasswordLabels.showPassword` exists and is overridable. The *name
  collision* half is real — but see Tier 1: checking it surfaced two defects
  underneath that neither register caught, so the finding moved **up**, not out.

---

## Tier 1 — silent accessibility failures that pass every gate

The sharpest class in the report: the markup *looks* wired, every check is
green, and a screen-reader user gets an unnamed control. A consumer cannot see
these, which is what makes them ours.

- [x] **J13 · FileUpload's hidden input has no accessible name.**
      `FileUpload.tsx:409` renders `<input type="file">` with no `aria-label`
      and no route to one — `labels` exists on Root but does not cover it, and
      props on `Trigger` reach the visible button. WCAG 4.1.2, **no consumer
      workaround at all**. They caught it only because one demo renders
      standalone; they assume every other call site carries it unseen.
      **Fixed** — `FileUploadLabels.fileInput` (default `Choose files`) added
      and applied as the input's `aria-label`, so it is named by default and
      translatable. Spec `labels` entry and the i18n docs table carry the key;
      two tests assert the name **resolves** (not that the attribute is
      present) — the shape the Tier-1 oracle should generalise.
- [ ] **J16 · Dialog/Drawer auto-close button is unlabelled.**
      `closable` defaults true; `DrawerClose` renders only `useIcon('close')`.
      The one button a consumer never writes and therefore never labels.
      Second-order damage is worse: because it is easy to miss, they added
      their own labelled Close and shipped **19 of 20 drawers and 12 dialogs
      with a visible duplicate**.
      → Default accessible name + `labels`; consider suppressing the auto-close
      when the header already contains a `Close` child.
- [ ] **J12 · Autocomplete.Input is not routed through `useFieldControl`.**
      Nine form components are; this one is not, so it renders with no `id`, a
      `FormField.Label`'s `for` dangles, and the combobox is unnamed. Note
      `useFieldControl`'s own docstring says every forms control should route
      through it. axe does not flag a `for` pointing at nothing.
- [x] **J4/J18 · Password's visibility toggle is pointer-only** — *reclassified
      from their Tier-3 naming report; verifying it surfaced this underneath.*
      `Password.tsx:192` sets `tabIndex={-1}` and no keydown path exists, so
      revealing your own password is unreachable by keyboard: **WCAG 2.1.1,
      Level A**. Screen-reader users can still activate it via the virtual
      cursor; sighted keyboard-only users cannot.
      **Fixed** — plus the follow-on it exposed: `.toggle` starts with
      `all: unset` (which clears the UA outline) and the stylesheet had NO
      `:focus-visible` rule, because a control outside the tab order never
      needed one. Making it tabbable without that left focus landing invisibly,
      which reads as "tab does nothing" — WCAG 2.4.7. Ring added, inset so it
      sits inside the field border.
      It is declared as intentional — `Password.spec.ts:201` ("to keep it out of
      tab order (input is the focus target)") with a test at
      `Password.test.tsx:65` pinning it. Spec, test and component agree with
      each other and all three are wrong, so no gate will ever question it.
      → Done: in the tab order, with a focus ring.
- [x] **J4/J18 (b) · The toggle's accessible name swaps with its state**
      (`aria-label={shown ? hidePassword : showPassword}`) rather than a stable
      name plus `aria-pressed`. The control's identity changes under the user;
      APG's toggle-button pattern is a fixed name with `aria-pressed` carrying
      the state. This is also *why* the name reads as ambiguous beside the field.
      → Stable name + `aria-pressed`; keep `labels` for translation.
- [–] **J4/J18 (c) · The reported collision is not a Move defect.** An
      accessible name is a user-facing *description*, not an identifier —
      uniqueness is not a property it has or needs, and two "Delete" buttons in
      a table are correct. `getByLabelText(/password/i)` is a document-wide
      search with a loose regex and no role, so it matches the field and the
      toggle; `getByRole('textbox', { name: 'Password' })` resolves because the
      ROLE disambiguates, and repeated names are scoped with `within(...)`.
      That is the more precise query, not a workaround.
      Residual and minor: two controls in one field group whose names differ by
      a leading verb are mildly ambiguous for voice control and sit as
      near-identical neighbours in a screen-reader element list. Not worth
      contorting a label over.
      → A doc line on querying password fields. Nothing to change in the
      component. Their "English-only" claim is also wrong —
      `PasswordLabels.showPassword` is overridable.
- [ ] **Gate for the class.** All three pass every existing check. Add an
      oracle that asserts each rendered form control **resolves** an accessible
      name, rather than that the wiring is present. Without it the fourth
      instance arrives the same way.

---

## Tier 2 — architectural gaps that force every consumer to reinvent

The single most damning line in either register, from J21:

> *"Frame — the sizing/spacing escape hatch. Load-bearing: purity forbids inline
> styles, so with no Frame there is NO legal way to set a width."*

A rule with no sanctioned escape. Their own summary is the right diagnosis: it
is not exotic widgets, it is **sizing, surfaces and a sortable table** — and
those three would remove roughly half of a 23-component extension library.

- [ ] **No sanctioned way to set a dimension.** Purity forbids inline styles and
      there is no `Frame`/`Box` primitive. Every consumer invents one, and the
      invention then fails purity/token review — the cost is paid twice.
- [ ] **No overlay/absolute-positioning primitive.** Raised independently by
      both projects. A `⋮` card menu or an on-artwork badge has to sit in an
      adjacent row instead of overlaying.
      → Nebulaa found the shape of the answer: positions travel as **custom
      properties into a sibling `.module.css`**, never as inline styles. That
      pattern is worth adopting as the sanctioned mechanism.
- [ ] **No surface/elevation concept.** Drove five separate extension
      components (`CardSurface`, `PanelSurface`, `PageSurface`, `DrawerSurface`,
      `ListItemCard`).
- [ ] **J6 · Button has no `loading` and no icon-only shape.** 25 call sites in
      one app; every mutation button hand-rolls `disabled` + a swapped child.
      The a11y contract for icon-only (required name, hit-target size) is
      precisely what a kit should own rather than leave to 20 consumers.
- [ ] **J20 + A(DataGrid) · Table cannot sort.** Both projects built one.
      Move's Table being presentational is defensible — but then ship a
      headless sort helper (state + `aria-sort` + header affordance) beside it.
      Everyone needs it; so far everyone has shipped without it.
- [ ] **J11 + A(CostTrend) · no charting position.** Purity accepts any
      capitalised import, so `<AreaChart>` passes untouched **inside a
      composite** — the one place it should never be.
      → Cheapest close: a documented, checkable rule that a rendering library
      may only be imported by a `withMoveComponent` component, never a
      composite. Better: a thin token-aware chart shell.
- [ ] **A6 · ToggleGroup is single-select only** (`type="single"` hardcoded).
      Multi-select chip/tag pickers degrade silently.

---

## Tier 3 — defaults that are wrong for the common case

Each is small; each cost a consumer an afternoon and an undocumented escape
hatch found by reading `dist`.

- [ ] **J15 · Sidebar.Item dismisses the mobile drawer on every click**,
      including when it is a disclosure trigger (`Sidebar.tsx:858-863`). Nested
      navigation is unreachable below 768px — the composition Move's own split
      *forces* on you. The only escape is the undocumented `e.defaultPrevented`
      sentinel.
      → `dismissOnSelect?: boolean` (default true), or auto-suppress when the
      item is a `Collapsible.Trigger` child (detectable via the `data-state`
      Collapsible already injects). Documenting the sentinel is the minimum.
- [ ] **J19 · Dropdown.Item + overlay needs `preventDefault`.** Radix restores
      focus after `onSelect`; the overlay reads it as focus escaping and
      dismisses itself. Symptom: the action appears to do nothing. Hit **ten
      surfaces at once** through one shared wrapper. jsdom cannot model the
      focus race, so no component test catches it — an argument for handling it
      in the library rather than rediscovering it per consumer.
- [ ] **J17 · The factory strips `undefined` props** (`factory.tsx:59`), which
      is exactly the value Radix reserves for opting out
      (`aria-describedby={undefined}`). ~44 overlays affected.
      → Use `Object.hasOwn` to distinguish "not passed" from "passed as
      undefined". Also refresh the vendored Radix — the warning comes from
      Move's bundled copy, so consumers cannot fix it by upgrading their own.
- [ ] **J14 · Tabs.List can neither wrap nor scroll.** `white-space: nowrap`,
      no `wrap`/`scroll` prop. Past ~6 tabs it forces document-level horizontal
      overflow that clips page content far from the cause. **The consumer
      cannot fix it themselves** — the sliding indicator is absolutely
      positioned, so a consumer-side `flex-wrap` mispositions it on every row
      after the first.
- [ ] **Alert has no overflow containment** (only `.content` carries
      `min-width: 0`) — cannot contain a long unbroken error string.
- [ ] **A7 · `Text color="primary"` ignores the theme accent** — hard-wired to
      `var(--move-indigo-text)`. An amber-themed app renders blue eyebrows.
- [ ] **A11 · No large accent-coloured inline text.** Text colours cap at `xl`;
      Heading offers only base/muted/subtle. An accent word in a hero headline
      can be big or coloured, not both.
- [ ] **A10 · `List.Item[active]` has no emphasis hook** beyond
      `--move-list-active-bg`. → add `--move-list-active-ring`, default none.
- [ ] **A3 · ToggleButton has no `fullWidth`** though docs say it composes
      Button's base styles. Forward the layout props or document the exclusion.
- [ ] **A5 · Type-only imports trip composite-spec-drift** — importing a Move
      type into a composite makes it read as an undeclared component.
      → Ignore `import type { … }`.
- [ ] **A4 · llms.txt documents flat props for compound components**
      (Switch, Select, Card, Avatar, FormField, ToggleGroup, FileUpload) while
      the `.d.ts` is object-only. Flat JSX does not typecheck.

---

## Tier 4 — cheap, high-leverage, mostly process

- [ ] **T4-1 · Publish guard for A8.** Assert `dist` contains no `jsxDEV`
      before pack. ~10 lines, and it is the difference between "fixed" and
      "fixed until the next publish".
- [ ] **A2 + J9 · Export `ComponentSpec` and `CompositionSpec`.** The exports
      map is `.`, `./styles.css`, `./system.css`, `./styles/*`, `./scaffold/*` —
      no spec types. Consumers cannot write `satisfies ComponentSpec`, so their
      specs are `as const` and TypeScript checks nothing. They **shipped two
      malformed specs (12 required fields missing each) with every gate green**,
      and two more declaring tokens the stylesheet never defaulted. One export
      line closes it.
- [ ] **A1 · React resolution from the built lib.** Both projects independently
      landed on `resolve.dedupe` + `server.deps.inline: ['move']`. Root cause is
      Move bundling its own `dist/node_modules/react` — same origin as A8. Every
      consumer rediscovers this. Fix the packaging or document the workaround.
- [ ] **J2 · `recipes/registry.ts` does not exist.** `app-compose` rule 2 says
      to prefer a recipe seed, so the rule is unfollowable and every
      composition falls back to analyse-from-scratch. Notably there is **no
      sign-in recipe**. Ship the registry or amend the skill to match reality.
- [ ] **J5 · No migration map from the mainstream kits.** Porting a Mantine app
      they nearly rebuilt four things that already exist: `SegmentedControl`
      (= ToggleGroup), `MultiSelect` (= Autocomplete multiple), an icon adapter
      (= Icon + IconResolver), a tinted-icon chip (= EmptyState `icon`). They
      found these by reading `dist/**/*.d.ts`.
      → A "Coming from Mantine / MUI / Chakra" table. Cheap, high leverage —
      **for an agent especially, the model writes what it cannot find.**
- [ ] **J3 · No i18n story.** `labels` defaults are English; a hardcoded
      `aria-label` is rejected, but a plain `<Text>Save</Text>` passes clean.
      They wrote `check-i18n.mjs` (TS AST, same technique as our checks) and
      **offered it upstream**. Caveat they flag: it must not touch
      server-served content.
- [ ] **J7 · No story for an app that already has a design system.** `MoveRoot`
      takes one theme; theirs carries 6 named themes, 3 runtime A/B token
      overrides and 3 surface variants — 885 lines predating Move. The
      realistic adoption path is "Move **plus** our design layer", and it is
      undocumented. They invented a pattern (resolve to literals, re-emit as
      `--move-jybbo-*`) rather than finding one.
- [ ] **J8 · Imperative API only exists for Toast.** `toast.success()` made a
      43-call-site port a thin shim — praise. But Dialog/Drawer/Popover are
      component-only, so `await confirm({...})`, the commonest admin pattern,
      is rebuilt per consumer. Toast proves the pattern fits.
- [ ] **Doc line · `FileUpload.Trigger` Slot semantics are a hard constraint**
      documented as a suggestion. Two children or a bare string throws
      `React.Children.only` and takes the page down — it cost them two crashes.
- [ ] **Doc line · `useSidebar` breakpoint is 768 with `max-width: 767px`**, so
      iPad portrait is desktop mode. "iPad = mobile" is the common assumption.
- [ ] **Doc line · no `<form>` is possible under purity**, so Enter-to-submit
      must be wired per-field via `onKeyDown`. Affects every auth/settings
      screen.
- [ ] **Doc line · `create-move` off-spec usage works well** (`--move <spec>`
      `--force` + absolute target scaffolds into a consumer repo against a
      vendored tarball). That is what every external consumer actually needs.

---

## The finding worth reading twice

**J10 — conformance is not parity.**

> Six screens passed every gate while missing MFA setup, ten patient tabs and
> every CRUD drawer. Four primitives passed while having lost their max-width,
> margins and icon chips.

Every oracle here validates a file **against itself**: purity against its own
imports, spec-drift against its own spec, the token ratchet against its own CSS.
Nothing compares a component to the thing it replaced. Their conclusion is
precise and worth quoting rather than paraphrasing: *"That is not a failure of
the oracles — they check what they claim to. But it does mean Move's checks read
as more assurance than they are, especially to an agent."*

Their fix is cheap and mechanical and we should consider adopting it wholesale:
a `RAISED:` marker in source requires a sibling `<Name>.parity.md` naming the
original and recording the deviation.

The uncomfortable corollary for this repo: **each new check raises apparent
assurance faster than actual assurance.** Worth weighing whenever we add one.

Related, from the same register: *"Gates are proven by deliberate violation, not
just green runs."* They verify each gate by committing a violation and watching
it fail. That is the standard this repo should hold its own checks to.

---

## What they say works

Worth keeping in view — it says where the design is right.

- **Toast's imperative store API** is exactly what consumers arriving from
  Mantine/sonner/react-hot-toast expect; made a 43-call-site port a thin shim.
- **FileUpload's adapter + native progress** — *"the one thing that came out
  cleaner in Move than in the hand-built original — no custom XHR-progress UI
  at all."*
- **`create-move` off-spec** scaffolding into a consumer repo.
- **The spec/check/skill shape itself** is reusable enough that both projects
  built their own gates in the same style (`check:ext`, `check:i18n`,
  `check:parity`, `check:ux`) — and offered several back.

## Offered upstream by them

Ask before reimplementing: `check-i18n.mjs` (J3), the spec-shape rule from
`check-move-ext.mjs` (J9), `check:parity` (J10), and `AreaTrend` — Recharts
confined to one component with grid/axis/tick/tooltip colours re-pointed at Move
tokens through the library's own class names (J11).
