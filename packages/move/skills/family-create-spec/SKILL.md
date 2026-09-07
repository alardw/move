---
name: family-create-spec
description: Define a new family in src/families.ts. Walks the tests one has to pass, writes the contract, declares its members, and mutation-tests it.
---

# Family — add one to the registry

A family is a named bundle of promises, joined by components that are the same
kind of thing. It is a library-wide contract, written rarely and deliberately.

For a single promise shared by components that are otherwise unrelated, see
`/capability-create-spec` instead.

**Declaring an existing family on a component is NOT this skill.** That is
`/component-create-spec`, and it is routine.

---

## Step 1 — is it a family at all

A family fails on any one of these.

**It bundles something.** A family that guarantees nothing is a category —
useful for grouping things in a menu, not a contract. `navigation` and `layout`
were exactly this: their members were null on every behavioural axis. Grouping
the layout primitives reads well and promises nothing.

**It has more than one member.** One member is a component. `notification` held
Toast alone.

**Its members are the same kind of thing, not merely similar-looking.** Alert,
Toast and EmptyState all render an icon, a heading and some text — a toast
dismisses on a timer, an alert sits inline, an empty state is static. Looking
alike is not being alike.

**They agree on many axes, not one.** One shared trait is the shape of a
capability. Accordion, Calendar, RadioGroup, Tabs and ToggleGroup all rove focus
and are a disclosure, a date grid, a radio group, a tab list and a segmented
control. Dialog and Drawer agree on keyboard, focus, controlled state,
dismissal, ARIA and capabilities — that is a family.

**Check the axes before trusting the name.** `form-input` looked like one family
and was two: its seventeen members disagreed on keyboard (5 values), focus (4),
formType (4) and controlled (4), and three independent axes cut in the same two
places. Read `keyboard`, `focus`, `controlled`, `formType`, `choreographies` and
`ariaPattern` across the candidates and see where they actually agree.

---

## Step 2 — write the entry

Families live in `src/families.ts`. The fields are documented at
`/contracts/family`.

Only write what every member keeps. A field one member cannot honour is either
the wrong field or the wrong member.

Use `includes` when two families share a core. A list you choose from and a
panel holding arbitrary content are different — one navigates options, the other
does not — but both hang off a trigger and dismiss identically, so that half
lives in `anchored-popup` and both include it. Written into both instead, it
drifts: the `state` axis `families` used to carry restated an existing field in
71 specs, and 11 copies had come to disagree with it.

Prefer `composes` over describing what a member should look like. Motion can be
composed rather than declared — a player's settings menu animates because
Popover does — so requiring the shared component is a stronger guarantee than
requiring a choreography name, and it cannot drift.

Write `why` as what goes wrong without the family. It is shown when a member
breaks the contract.

---

## Step 3 — declare the members

Add the family name to each member's `families` array, then run
`npm run check:families`.

Membership counts through composition, so an abstract family with no direct
members is not empty — its members arrive through the families that include it.

Expect the first run to fail on things that are correct. Two structural
exemptions already exist and are recorded in `notes/TODO.md`: a `pointer-panel`
mirrors a field that is already keyboard-operable, so nothing triggers it and it
has no open state to expose; and a component that is not compound exports no
sub-components to require. If you add a third, write down what would make it
stop applying.

---

## Step 4 — mutation-test it, before trusting it

**A contract that has never failed has not been shown to work.** Break each
assertion deliberately, confirm the check reports it, restore.

Test through the composition chain too: mutating a field declared on the family
a member `includes` — not on the family it joins — is what proves inheritance
is actually checked.

---

## Step 5 — write it down

- Register the rule in `packages/docs/src/pages/ai/conformance-spec.ts` and the
  check in `checks.ts`; `check:rule-coverage` enforces the bijection.
- Add it to the families table on `/systems/capabilities`.
- If it needs an exemption, record it and what would end it.
