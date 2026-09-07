---
name: family-validate
description: "Validate a family — every member keeps the whole contract, composition resolves, and it has more than one member."
user-invocable: true
argument-hint: "[family-name]"
---

# Family — Validate

The gate for a bundle, symmetric with `capability-validate` /
`component-validate`. It checks that a family in `src/families.ts` guarantees
what it claims: that every member keeps the whole contract including anything
inherited, that it has enough members to be a family, and that breaking it is
reported.

---

## How to Run

**Input:** a family name, or none to check all of them.

**Output:** findings on stdout. BLOCKER findings mean a member is not keeping
the contract, or the family is not one.

Runs `npm run check:families`, then the falsifiability check below.

---

## Checks

### 1 — Members keep the whole contract (BLOCKER)

`check:families` walks every field: capabilities, slots, ARIA patterns,
choreographies, animation triggers, scalar fields, prop triads, behaviour blocks
and flags, sub-components, and composed components.

A member failing one field is a real answer, not a nuisance: it is telling you
either that the field does not belong in the family, or that the component does
not belong in it. `Sidebar` left `disclosure` this way — it collapses in place
on desktop and becomes a modal sheet on mobile, which is two kinds of thing.

### 2 — Composition resolves (BLOCKER)

`includes` is walked before anything is asserted, so a member of `popup-list` is
held to `anchored-popup` as well. Confirm by mutating a field declared on the
INCLUDED family, not the joined one — if that does not fail, inheritance is not
actually being checked.

### 3 — It has more than one member (BLOCKER)

Counted through composition, so an abstract family with no direct members is not
empty; its members arrive through the families that include it. A family with
one real member is a component.

### 4 — It bundles something (BLOCKER)

A family with no fields beyond `why` guarantees nothing. `navigation` and
`layout` were removed for this — their members were null on every behavioural
axis. Grouping components in a menu is documentation; a family is a contract.

### 5 — It can fail (BLOCKER, and manual)

Break each field on a member, confirm the check reports it, restore. Do this per
field, not once: a single mutation proves one assertion, and the others may be
matching nothing.

### 6 — Exemptions are recorded (WARN)

Two structural exemptions already exist, both in `notes/TODO.md`: a
`pointer-panel` mirrors a field that is already keyboard-operable, so nothing
triggers it and it has no open state to expose; and a component that is not
compound exports no sub-components to require.

If a member is skipping part of the contract, confirm it is one of these. An
exemption nobody wrote down ages into a loophole — record what it is and what
would make it stop applying.

### 7 — The members are the same kind of thing (WARN)

Read `keyboard`, `focus`, `controlled`, `formType`, `choreographies` and
`ariaPattern` across the members. Agreement on one axis is a capability wearing
a family's name. `form-input` looked like one family and was two: seventeen
members disagreeing on four axes, with three of them cutting in the same place.
