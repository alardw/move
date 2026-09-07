---
name: capability-create-spec
description: Define a new capability in src/capabilities.ts. Walks the tests one has to pass, writes the contract, declares its members, and mutation-tests it.
---

# Capability — add one to the registry

A capability is a library-wide contract. They are not written per component and
not written often: two were added in the week this skill was made, and one of
those was removed again. Treat defining one as a decision, not a task.

For a bundle of promises kept by components that are the same kind of thing, see
`/family-create-spec` instead.

**Declaring an existing capability on a component is NOT this skill.**
That is `/component-create-spec`, and it is routine.

---


## Step 1 — does it earn its place

Answer all of these before writing anything. A "no" ends it.

**Does it create enforcement where there is none?** This is the test, not
"does a component fail it today". Fifty-nine control slots drew a focus ring
before `takes-focus` existed and none of them was required to — a promise kept
by convention with nothing holding it is exactly the kind that drifts. Search
`scripts/checks/` first: `takes-size` was dropped because `check:control-size`
already pushes controls onto the height tokens.

**Does it have more than one member?** Count them. `stripes-rows` was written
for Table, Table is the only component that stripes, and it enforced nothing
for as long as it existed. A family of one is a component; a capability of one
is that component's own concern.

**Is it shared anatomy rather than a shared contract?** Alert, Toast and
EmptyState all render an icon, a heading and some text. A toast dismisses on a
timer, an alert sits inline, an empty state is static. Looking alike is not
being alike.

**Can it be declared where it needs to apply?** Capabilities and families are
declared in a spec. Ten shared internals under `_shared/` have none, so neither
reaches them — and that is where several real defects lived. If the thing you
want to guarantee lives there, write a CSS-level check instead; see
`scripts/checks/option-rows.mjs`.

---

## Step 2 — write the entry

Capabilities live in `src/capabilities.ts`. The fields are documented at
`/contracts/capability`.

For a capability, `targets` names slot KINDS, never slot names — the
interactive element is `root` in Checkbox, `input` in InputText and `trigger`
in Select, and one contract has to cover all three.

Set `impliedByKind: true` only where the kind and the capability are the same
fact — a `surface` slot paints a ground, so it owns one. Then a component with
the slot and no declaration fails, which is the direction that catches promises
nobody wrote down. Set it false where the kind does not settle the question.

Write `why` as what went wrong without it. It is shown when a component fails,
and a reader deciding whether to keep the contract needs the evidence.


---

## Step 3 — declare the members

Add it to every component that keeps it. `check:capabilities` will refuse a
capability with no declaring component, so this is not optional.

Then run `npm run check:capabilities` and read what fails.
Expect false positives on the first run and treat each as a question about the
contract rather than about the component — three legitimate escapes were found
exactly this way, each from a component behaving correctly and being reported
anyway:

- a slot whose `element` is capitalised composes a Move component and inherits
- a rule using `composes:` inherits through CSS Modules
- guards are stripped before matching, since `:not(:disabled)` satisfying a
  disabled contract asserts nothing

---

## Step 4 — mutation-test it, before trusting it

**A contract that has never failed has not been shown to work.** Break each
assertion deliberately and confirm the check reports it, then restore.

This is not ceremony. `takes-disabled` shipped with
`cssAlternative: '[data-disabled]'` compiled straight into a `RegExp`, where
square brackets are a character class — it matched any file containing a `d`,
an `a` or a `t`, and asserted nothing at all. Every run was green. Only a
deliberate break found it.

Test both directions for a capability: remove the declaration (the source
should be reported as undeclared) and remove the CSS (the declaration should be
reported as unmet).

---

## Step 5 — write it down

- Register the rule in `packages/docs/src/pages/ai/conformance-spec.ts` and the
  check in `checks.ts`; `check:rule-coverage` enforces the bijection.
- Add it to the capabilities table on `/systems/capabilities`.
- If the contract has an escape hatch, document it on the contract page. An
  exemption nobody recorded ages into a loophole.
