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
**Re-verified:** 2026-08-26 — every open item re-checked against the repo
rather than carried forward. Six moved without anyone filing them: they were
fixed in the course of other work, which is exactly why a register needs
re-reading and not just appending.

That pass read `src` and not `packages/docs`, so it kept three items whose
answer was already published — the surface system, and half of the sizing item.
Re-checking a register against the source alone is not re-checking it.

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
- [x] **J16 · Dialog/Drawer auto-close button is unlabelled.**
      `closable` defaults true; `DrawerClose` renders only `useIcon('close')`.
      The one button a consumer never writes and therefore never labels.
      Second-order damage is worse: because it is easy to miss, they added
      their own labelled Close and shipped **19 of 20 drawers and 12 dialogs
      with a visible duplicate**.
      **Fixed, both halves.** `DialogLabels`/`DrawerLabels` with `close: 'Close'`
      flow from Root through context; Close applies it as `aria-label` only when
      it renders the bare glyph — children or `asChild` mean the consumer owns
      the content, and labelling over visible text would breach WCAG 2.5.3.
      A consumer-passed `aria-label` still wins — because the attribute precedes
      the props spread, which is what makes it hold. That is now a library-wide
      guarantee rather than a property of these two components: `prop-precedence`
      (2026-08-27) enforces it across all 71, after 18 sites elsewhere were found
      replacing a caller's name and one deleting it outright.
      The duplicate half is closed structurally: Header now suppresses its
      automatic Close when the children it was given already contain one
      (`containsElementOfType`, new in the engine barrel). Writing your own
      Close yields exactly one button, so the shape that produced 31 duplicated
      surfaces no longer can. Docs samples are unaffected — theirs sit in the
      Footer.
- [x] **J12 · Autocomplete.Input is not routed through `useFieldControl`.**
      Nine form components are; this one is not, so it renders with no `id`, a
      `FormField.Label`'s `for` dangles, and the combobox is unnamed. Note
      `useFieldControl`'s own docstring says every forms control should route
      through it. axe does not flag a `for` pointing at nothing.
      **Already fixed — the register is stale here.** `AutocompleteInput` routes
      through `useFieldControl` and spreads `controlProps` first onto the
      combobox (`Autocomplete.tsx:392,508`). It is pinned by `check:field-naming`,
      which lists this exact component among the failures it was built to catch.
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
- [x] **Gate for the class.** All three pass every existing check. Add an
      oracle that asserts each rendered form control **resolves** an accessible
      name, rather than that the wiring is present. Without it the fourth
      instance arrives the same way.
      **Done.** The oracle already existed — `check:field-naming` renders every
      form control in a `FormField`, derives its population from the specs
      (`families.behavior` `form-input`) so a new control with no fixture FAILS
      rather than being skipped, and declares exemptions instead of omitting
      them. What it asserted was the wiring: that the label's `for` reaches an
      element a `<label>` can legally name.
      It now also asserts the **resolved** name — that what a screen reader
      computes is what the page shows. The two come apart exactly as their
      report describes: PinInput's own `aria-label` outranked the Label while
      its `for` was perfectly wired, and a control carrying a fallback name can
      hide a dangling `for` completely. 34 → 50 tests, one per form control.
      Their framing was right and worth keeping: a gate that reads wiring is a
      gate that can be satisfied without the thing working.

---

## Tier 2 — architectural gaps that force every consumer to reinvent

The single most damning line in either register, from J21:

> *"Frame — the sizing/spacing escape hatch. Load-bearing: purity forbids inline
> styles, so with no Frame there is NO legal way to set a width."*

A rule with no sanctioned escape. Their own summary is the right diagnosis: it
is not exotic widgets, it is **sizing, surfaces and a sortable table** — and
those three would remove roughly half of a 23-component extension library.

- [–] **No sanctioned way to set a dimension.** Purity forbids inline styles and
      there is no `Frame`/`Box` primitive. Every consumer invents one, and the
      invention then fails purity/token review — the cost is paid twice.
      **No `Frame`/`Box` is coming, and the premise is wrong** (decided
      2026-08-26). A free-length prop at an arbitrary call site is the mechanism
      by which a kit stops being able to guarantee anything below the author's
      own viewport; it is also an axis with no clamp, which inverts the model the
      library is built on. Primer shipped `Box`+`sx` and is publicly unwinding
      it; Spectrum and Polaris, the two whose position most resembles ours,
      both landed on a clamped prop set instead. Chakra and MUI hand out an
      escape hatch because they never forbade CSS in the first place — for them
      it is a convenience, not a permission.
      The rule that replaces it: **a call site may express constraints and
      participation, not a size.** `maxWidth` / `flex` / `span` / `ratio` yes;
      `width: 340px` no. A preference is legal exactly when the container can
      overrule it — if nothing can, it is a size. The tell that a decision
      belongs to the container is that it needs a breakpoint to be right.
      **And "NO legal way to set a width" was not true.** `Stack.flex`,
      `Stack.fill`, `Grid.minChildWidth`, `Grid.Cell.span/offset`,
      `Splitter.Panel.defaultSize/minSize` and `Text.readableWidth` were all
      already doing this job. J21 is substantially a **discoverability** failure
      — which fits their own account of finding things by reading
      `dist/**/*.d.ts`. `/systems/layout` now runs a width axis alongside the
      height chain, with a reflowing sample.
      One real defect sat underneath it: `Grid.tsx:89` emitted a bare
      `minmax(${minChildWidth}, 1fr)`, and a `minmax()` floor cannot shrink, so
      any container narrower than that value overflowed horizontally instead of
      wrapping. Their fear about fixed sizing, already shipped. Now
      `minmax(min(…, 100%), 1fr)`, with a test.
      → **Residual, and the decision that would actually close J21:** a `Stack
      basis` prop (flexbox's own word for a preferred size) and its value space.
      `Dimension` is `number | string` today — fully unclamped. Height stays
      asymmetric: a preferred height clips, because text reflows taller as it
      narrows, so height remains constraint-only (`fill`, maxHeight +
      ScrollArea, aspect-ratio).
- [ ] **No overlay/absolute-positioning primitive.** Raised independently by
      both projects. A `⋮` card menu or an on-artwork badge has to sit in an
      adjacent row instead of overlaying.
      → Nebulaa found the shape of the answer: positions travel as **custom
      properties into a sibling `.module.css`**, never as inline styles. That
      pattern is worth adopting as the sanctioned mechanism.
      **Deliberately parked, not refused** (2026-08-26) — and it should not be
      filed with the sizing item, which is what nearly buried it. Overlaying is a
      stacking relationship, not a size, and it does not break responsively: a
      badge pinned at `inset-block-start: var(--move-space-2)` is fully fluid.
      Move itself relies on it constantly — the Tabs sliding indicator is
      absolutely positioned, and every Dropdown, Popover and Tooltip is Floating
      UI, which is absolute positioning with a solver. So a `⋮` on a card is the
      same shape as things the library already ships; what separates them is
      permission, not merit.
      → Preferred direction when it is picked up: make the existing layout
      components carry stacking (grid-area overlap on Card, a documented custom
      -property surface) rather than adding a positioning primitive.
- [ ] **No consumer handle for the surface system.** *(Filed as "no
      surface/elevation concept" — that half is stale.)* Drove five separate
      extension components (`CardSurface`, `PanelSurface`, `PageSurface`,
      `DrawerSurface`, `ListItemCard`).
      **The concept exists and is documented**: two levels
      (`--move-bg-base`, `--move-bg-subtle`), an alternating-tint rule so a
      nested panel stays visible against its parent, nine components mapped to
      `subtle`, all at `/systems/surfaces`.
      **What survives is sharper than what they filed: it is internal-only.**
      There is no `surface` prop on any component — checked across every spec and
      source, 2026-08-26. Components declare their own level; a consumer has no
      way to put their own panel on the system. That is why they built five
      wrappers: `CardSurface` and `ListItemCard` are Card with extra,
      `PageSurface` is the implicit base ground, and `PanelSurface`/
      `DrawerSurface` want a handle that does not exist.
      → Same gap as the sizing item, one layer up: the concept is there, the
      thing to attach it to is not. Whatever answers one should answer both.
- [ ] **J6 · Button has no `loading` and no icon-only shape.** 25 call sites in
      one app; every mutation button hand-rolls `disabled` + a swapped child.
      The a11y contract for icon-only (required name, hit-target size) is
      precisely what a kit should own rather than leave to 20 consumers.
      *Confirmed still open 2026-08-26 — no `loading` or icon-only shape anywhere in `Button.tsx` or its spec.*
      **Corroborated from an unexpected direction.** Tightening the docs a11y
      ratchet surfaced five accepted `button-name` violations, and every one was
      the same shape: `<Button><Icon name="…" /></Button>` with no name, in
      Move's own samples — including three under a Tooltip, where the tooltip
      supplies `aria-describedby` and names nothing. So the library's own docs
      were teaching the mistake five times over, to every agent that reads them.
      Samples fixed with explicit names; the durable fix is still this item — an
      icon-only shape that REQUIRES a name, rather than 20 consumers each
      remembering.
- [~] **J20 + A(DataGrid) · Table cannot sort.** Both projects built one.
      Move's Table being presentational is defensible — but then ship a
      headless sort helper (state + `aria-sort` + header affordance) beside it.
      Everyone needs it; so far everyone has shipped without it.
      **Half of the ask already shipped.** `Table.HeaderCell` carries
      `sortable`, `sorted`, `onSort`, `aria-sort`, `data-sortable`/`data-sorted`
      and Enter/Space handling (`Table.tsx:521-566`) — the affordance and the
      a11y wiring are there. What is missing is the STATE half: no `useSort` in
      `src/hooks/`, so every consumer still writes the comparator, the tri-state
      cycle and the column bookkeeping. Remaining work is one hook, not a
      component.
- [x] **J11 + A(CostTrend) · no charting position.** Purity accepts any
      capitalised import, so `<AreaChart>` passes untouched **inside a
      composite** — the one place it should never be.
      **Both halves shipped.** The chart shell exists
      (`data-display/Chart/` — spec, source, CSS, tests, swappable renderer
      adapters, pie/donut, numeric x scale), so the token-aware option is the
      default rather than the ambitious one. And the boundary is now a real gate:
      `purity-6` in `checks/purity.mjs` refuses a rendering-library import from
      anything that is not the component wrapping it (or a renderer adapter
      beside it), which is the hole this finding named.
- [ ] **A6 · ToggleGroup is single-select only** (`type="single"` hardcoded).
      Multi-select chip/tag pickers degrade silently.
      *Confirmed still open 2026-08-26 — `ToggleGroup.tsx:150` still passes a literal `type="single"`.*

---

## Tier 3 — defaults that are wrong for the common case

Each is small; each cost a consumer an afternoon and an undocumented escape
hatch found by reading `dist`.

- [ ] **J15 · Sidebar.Item dismisses the mobile drawer on every click**,
      including when it is a disclosure trigger (`Sidebar.tsx:858-863`). Nested
      navigation is unreachable below 768px — the composition Move's own split
      *forces* on you. The only escape is the undocumented `e.defaultPrevented`
      sentinel.
      *Confirmed still open 2026-08-26 — `Sidebar.tsx:861` still gates on `e.defaultPrevented`; no `dismissOnSelect` prop exists.*
      **Half of the ask closed sideways (2026-08-27):** the sentinel is no longer
      undocumented. `preventDefault()` meaning "the component stands down" is now
      the library's stated convention — `composeHandlers`, `/systems/props`, and
      the opening of `llms.txt`. Sidebar had hand-rolled that exact shape at
      `Sidebar.tsx:859-863` all along.
      **The rest should NOT be fixed as filed.** A `dismissOnSelect` prop, or
      sniffing `data-state` for a `Collapsible.Trigger`, both patch the symptom
      and leave the cause: `Sidebar.Item` renders a `<button>` (spec slot
      `item`) while carrying a destination's props (`active`, `badge`) and a
      destination's behaviour (dismiss the drawer). The rule cannot tell a
      submenu toggle from a route because the ELEMENT does not either — every
      item is a button that dismisses. `Sidebar.Item asChild` around a
      `Dropdown.Trigger` is a natural composition that silently breaks, and
      nothing in the API warns you off it.
      Both neighbouring defaults are known to be wrong, which is the evidence
      that a default is not the answer. shadcn's `SidebarMenuButton` — the same
      shape, button + asChild + tooltip-when-collapsed — never closes the mobile
      sheet, and carries open PRs asking it to (shadcn-ui/ui#8402, #5755,
      issue #5561). Move always closes, and this finding asks it to stop. It
      also has a discussion thread on `SidebarMenuButton` inside
      `DropdownMenuTrigger` (#6778): the account-menu case, hit often enough to
      become a thread. Neither library separates navigating from acting, so both
      get reports from the half they chose against.
      → **Containers plus one honest primitive.** `Header`, `Content`, `Footer`,
      `Group`, `GroupLabel` are boxes; `NavItem` is the only part with
      sidebar-specific semantics, because navigating is the only thing a sidebar
      does that a `div` cannot express. It renders an anchor, takes `active`, and
      dismisses the mobile drawer — correct by definition rather than by
      configuration. Everything else is a `Button`, a `Dropdown`, a
      `Collapsible`: components that already behave correctly and that nobody
      has to be warned about. J15 then has nothing to fix, because a `Button`
      does not dismiss a drawer. The precedent is `Table`, which ships `Root`,
      `Header`, `Body`, `Row`, `Cell` and no `Table.Action` — you put a `Button`
      in a `Cell`.
      → **Collapse is explicit for foreign content, implicit only for `NavItem`.**
      Optional `Sidebar.Collapsed` / `Sidebar.Expanded` render their children in
      one state and not the other, so a `Button`, an `Avatar` or a `Dropdown`
      becomes collapse-aware without knowing what a sidebar is; leave them out
      when there is nothing to collapse, which an icon-only control already is.
      `NavItem` is the single exception — it hides its label and shows its
      tooltip on its own, because twenty nav items answering the same question
      the same way is noise, and because the sidebar's own primitive may know
      about the sidebar. Anything foreign is told, never assumed. Note the other
      branch unmounts, so an open menu inside `Expanded` closes when the sidebar
      collapses; that is right, and belongs in the docs rather than in a
      surprise.
      → `Sidebar.Item` is deprecated rather than switched: it renders `Action`'s
      element with `NavItem`'s behaviour, so neither new name is a drop-in and
      changing it underneath a consumer would be worse than asking them to pick.
- [x] **J19 · Dropdown.Item + overlay needs `preventDefault`.** Radix restores
      focus after `onSelect`; the overlay reads it as focus escaping and
      dismisses itself. Symptom: the action appears to do nothing. Hit **ten
      surfaces at once** through one shared wrapper. jsdom cannot model the
      focus race, so no component test catches it — an argument for handling it
      in the library rather than rediscovering it per consumer.
      **Fixed, and in the library as they argued.** `Dropdown.Item`'s
      `handleSelect` calls `e.preventDefault()` before the consumer's `onSelect`
      and closes through the animated path (`Dropdown.tsx:421-425`), so no call
      site has to know about the focus race.
- [x] **J17 · The factory strips `undefined` props** (`factory.tsx:59`), which
      is exactly the value Radix reserves for opting out
      (`aria-describedby={undefined}`). ~44 overlays affected.
      → Use `Object.hasOwn` to distinguish "not passed" from "passed as
      undefined". Also refresh the vendored Radix — the warning comes from
      Move's bundled copy, so consumers cannot fix it by upgrading their own.
      **Fixed, with one refinement to their proposal.** A blanket `hasOwn` would
      have broken every default: `undefined` means two different things depending
      on whether the prop HAS one.
      With a default, `variant={undefined}` means "I'm not choosing" and the
      default must win — React's own convention, and every call site relies on
      it. Without a default, `aria-describedby={undefined}` is a VALUE and the
      only way to say "no description": Radix sets
      `aria-describedby={descriptionId}` and then spreads the consumer's props
      over it, so dropping the key means the override never lands and the
      generated id survives. So the factory now skips an explicit `undefined`
      ONLY where a default would replace it.
      `hasOwnProperty.call`, not `Object.hasOwn` — the latter is ES2022 and this
      package targets ES2020; raising the floor for every consumer over one call
      site is not a trade worth making.
      Verified against the symptom, not the code: a Dialog with no Description
      can now be silenced with `aria-describedby={undefined}`, and reinstating
      the old strip makes that test fail with Radix's warning verbatim. 2238
      tests pass across all 71 components, run three times.
      *Their second half — refreshing the vendored Radix — is untouched and
      still open.*
- [ ] **J14 · Tabs.List can neither wrap nor scroll.** `white-space: nowrap`,
      no `wrap`/`scroll` prop. Past ~6 tabs it forces document-level horizontal
      overflow that clips page content far from the cause. **The consumer
      cannot fix it themselves** — the sliding indicator is absolutely
      positioned, so a consumer-side `flex-wrap` mispositions it on every row
      after the first.
      *Confirmed still open 2026-08-26 — `Tabs.module.css:126` still `white-space: nowrap`, and no `wrap`/`scroll` prop exists.*
- [ ] **Alert has no overflow containment** (only `.content` carries
      `min-width: 0`) — cannot contain a long unbroken error string.
      *Confirmed still open 2026-08-26 — `Alert.module.css:83` is still the only `min-width: 0`; no `overflow-wrap`/`word-break` anywhere in the file.*
- [x] **A7 · `Text color="primary"` ignores the theme accent** — hard-wired to
      `var(--move-indigo-text)`. An amber-themed app renders blue eyebrows.
      **Fixed — and it was nine components, not one.** Text, Stepper,
      Pagination, Label's required asterisk and four calendar "today" markers had
      all pinned the same hue.
      The reason it had spread is that the role token did not exist. The theme
      engine already derives exactly this value — `deriveAccentText`, AA-clamped
      against every surface — but published it only as `--move-link`, which reads
      wrong at a "today" marker or an eyebrow, so each author reached past it to
      the palette. Named it for the role it plays: `--move-accent-text` /
      `--move-accent-text-hover`, with `--move-link` kept as the same value under
      its most common name. No new colour maths — the AA audit picked the role up
      on its own, 40 → 48 audited pairs.
      Also fixed the one non-accent instance the sweep found: Button's danger
      `:active` used `--move-red-700`, which is what `--move-error` already is.
- [ ] **A11 · No large accent-coloured inline text.** Text colours cap at `xl`;
      Heading offers only base/muted/subtle. An accent word in a hero headline
      can be big or coloured, not both.
- [x] **A10 · `List.Item[active]` has no emphasis hook** beyond
      `--move-list-active-bg`. → add `--move-list-active-ring`, default none.
      **Done as specified.** `--move-list-active-ring` defaults to `none`, so
      nothing changes unless a consumer sets it; it rides `box-shadow`, so any
      shadow value works — a leading rule, a ring, an inset border — and it is
      applied on the active-and-hovered rule too, which otherwise reset it.
- [x] **A3 · ToggleButton has no `fullWidth`** though docs say it composes
      Button's base styles. Forward the layout props or document the exclusion.
      **Forwarded, which was the right of the two options** — the docs were
      accurate and the component was not. ToggleButton already composed Button's
      root class, so `[data-full-width]` applied to it all along; only the prop
      was missing. Three tests, including one that it does not leak to the DOM.
- [x] **A5 · Type-only imports trip composite-spec-drift** — importing a Move
      type into a composite makes it read as an undeclared component.
      **Fixed.** `checks/composite-spec-drift.mjs:72-74` skips both a type-only
      import clause and per-specifier `type` markers.
- [x] **A4 · llms.txt documents flat props for compound components**
      (Switch, Select, Card, Avatar, FormField, ToggleGroup, FileUpload) while
      the `.d.ts` is object-only. Flat JSX does not typecheck.
      **Fixed — and it was 27 components, not 7.** The generator read the spec
      and never asked what the source exports, so it emitted a flat `Props:`
      block AND an `Example: <Switch …>` for every component whose export is a
      bare object.
      The discriminator it was missing is callability. Three shapes ship here:
      `withMoveComponent(...)` and `Object.assign(Root, {...})` are callable, so
      flat props are correct; `{ Root, Thumb }` is not, so they are a lie. The
      generator now reads the source, omits the flat block for the 27 that are
      objects (their props are the Root's and were duplicated under
      `Name.Root props:` anyway), and emits `<Switch.Root>` as the example.
      Gated by `check:api-compound-shape`, which asserts on the generated files
      so it catches a regressed generator and a hand-edit alike. Worth stating
      plainly: this artifact exists to be read by a model, and a model writes
      what it can find — so the one file built to make the API discoverable was
      teaching 27 components' worth of code that cannot build.

---

## Tier 4 — cheap, high-leverage, mostly process

- [x] **T4-1 · Publish guard for A8.** Assert `dist` contains no `jsxDEV`
      before pack. ~10 lines, and it is the difference between "fixed" and
      "fixed until the next publish".
      **Done, and widened to cover A1 as well** — the two findings share one
      origin (a build shipping what it should have externalised), so one guard
      on the artifact closes both. `scripts/checks/dist-packaging.mjs` asserts,
      against `dist` rather than `src`: no `jsxDEV` anywhere in the bundle; no
      `react`/`react-dom` copy inside the package; and React reached only by
      BARE specifier — the third catches a copy that moved rather than left.
      Wired into `pack` between `build` and `npm pack`, where dist is guaranteed
      fresh, and into `check:all`, where it SKIPS with a printed notice if no
      dist exists. The notice is the point: a green line that verified nothing
      is the false assurance J10 is about.
      Proven the way they ask for — each of the three assertions was made to
      fail on a deliberate violation and pass again on restore, rather than
      trusted because the run was green.
- [x] **A2 + J9 · Export `ComponentSpec` and `CompositionSpec`.** The exports
      map is `.`, `./styles.css`, `./system.css`, `./styles/*`, `./scaffold/*` —
      no spec types. Consumers cannot write `satisfies ComponentSpec`, so their
      specs are `as const` and TypeScript checks nothing. They **shipped two
      malformed specs (12 required fields missing each) with every gate green**,
      and two more declaring tokens the stylesheet never defaulted. One export
      line closes it.
      **Fixed.** New `src/spec.ts` barrel exports every spec contract —
      `ComponentSpec`, `CompositeSpec` (the current name for what they called
      `CompositionSpec`), `AdapterSpec`, `ApiSpec` and their supporting types.
      Reachable both from the main barrel and as `move/spec`, since a consumer
      will try `from 'move'` first. `spec` is its own build entry: the file is
      almost all types, so rollup dropped it when it was only a re-export.
      Verified the way the finding describes the harm rather than by inspection —
      a spec missing required fields now fails `satisfies ComponentSpec`.
- [x] **A1 · React resolution from the built lib.** Both projects independently
      landed on `resolve.dedupe` + `server.deps.inline: ['move']`. Root cause is
      Move bundling its own `dist/node_modules/react` — same origin as A8. Every
      consumer rediscovers this. Fix the packaging or document the workaround.
      **Fixed — the packaging option, which is the better of the two they
      offered.** `vite.config.ts:57` externalises `react`, `react-dom` and
      `react/jsx-runtime`; `dist` contains no React copy (only @floating-ui,
      @radix-ui and their sidecars); every emitted file reaches React by bare
      specifier (`Button.mjs` → `from "react"`), so it resolves to the
      consumer's copy; and `react`/`react-dom` are declared as peers.
      It also cannot silently regress: `check:dist-packaging` (T4-1) fails the
      pack if React is bundled again or reached by anything but a bare
      specifier — which is what makes this "fixed" rather than "one good build".
      The docs need nothing: the installation page already states the contract
      positively ("React and react-dom you already have").
      Their workaround is now inert rather than required. Whether they have
      deleted those two config lines is their housekeeping, not a Move defect,
      so it does not gate this item.
- [x] **J2 · `recipes/registry.ts` does not exist.** `app-compose` rule 2 says
      to prefer a recipe seed, so the rule is unfollowable and every
      composition falls back to analyse-from-scratch. Notably there is **no
      sign-in recipe**. Ship the registry or amend the skill to match reality.
      **Still open, and the answer is now settled: amend the skill.** Recipes
      were superseded by design-pattern + composite and the RecipeSpec pipeline
      was deleted — there is no `src/recipes/` and no registry is coming.
      `skills/app-compose/SKILL.md:42-48` still says "Seed from a Move recipe
      (preferred when one fits)" and points at `recipes/registry.ts`, so the
      skill sends every agent to a file that cannot exist. Their diagnosis was
      right; only the resolution changed.
      **Fixed, and it was not alone.** `app-compose` now seeds from a design
      pattern and points at `packages/move/patterns/registry.ts`, which exists.
      Writing the gate for this (`check:skill-refs`) turned up **three more
      dangling references nobody had filed**: `component-validate` told agents to
      read and update `src/components/specs.registry.ts` — a file removed with
      the `.report.md` artifacts, so both its Step 5 and its whole "registry"
      input mode were dead — plus two wrong relative paths between reference
      docs. All four fixed; the gate now holds 59 references across 39 docs.
- [ ] **J5 · No migration map from the mainstream kits.** Porting a Mantine app
      they nearly rebuilt four things that already exist: `SegmentedControl`
      (= ToggleGroup), `MultiSelect` (= Autocomplete multiple), an icon adapter
      (= Icon + IconResolver), a tinted-icon chip (= EmptyState `icon`). They
      found these by reading `dist/**/*.d.ts`.
      → A "Coming from Mantine / MUI / Chakra" table. Cheap, high leverage —
      **for an agent especially, the model writes what it cannot find.**
- [~] **J3 · No i18n story.** `labels` defaults are English; a hardcoded
      `aria-label` is rejected, but a plain `<Text>Save</Text>` passes clean.
      They wrote `check-i18n.mjs` (TS AST, same technique as our checks) and
      **offered it upstream**. Caveat they flag: it must not touch
      server-served content.
      **Half closed — the library half.** `check:i18n-literals` refuses a
      user-facing string baked into a component. Their diagnosis of the
      asymmetry was exactly right and worth restating: a hardcoded `aria-label`
      was already refused while `<span>Time</span>` passed clean, so the name a
      screen reader speaks was guarded and the word a sighted user reads was not
      — the same problem, and the visible half is the one that ships
      untranslatable to every locale. One violation existed (DatePicker's "Time"
      heading); it now routes through `DatePickerLabels.time`.
      **Still open: the consumer-app half**, which is what they actually built.
      Scanning an app's own compositions needs the config-driven model `purity`
      uses, plus their caveat about server-served content. Worth asking for
      theirs rather than rebuilding it.
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

**A worked example of their thesis, found 2026-08-26.** The docs a11y sweep is a
ratchet with a baseline. It computed how many baselined violations were FIXED,
printed the number — and never asserted on it. So a repaired violation left its
allowance behind permanently, and the same bug could slide back in silently.
Two of those allowances were FileUpload `label` findings: axe had caught J13 all
along, and the baseline absorbed it while the sweep ran green.
The ratchet now fails when it is slack, so it can only tighten. Re-snapping it
took the baseline from 10 findings across 6 entries to 3 across 1 — the rest
were real WCAG failures sitting accepted. Their line was exactly right: each new
check raises apparent assurance faster than actual assurance, and a gate with
slack in it reads as assurance while being its opposite.

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
