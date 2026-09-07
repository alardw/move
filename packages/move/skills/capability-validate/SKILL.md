---
name: capability-validate
description: "Validate a capability — the contract holds in both directions, it has members, and it can actually fail."
user-invocable: true
argument-hint: "[capability-name]"
---

# Capability — Validate

The gate for a contract, symmetric with `component-validate` / `family-validate`.
It checks that a capability in `src/capabilities.ts` is a real guarantee rather
than a definition: that its members keep it, that source exhibiting it declares
it, that it has members at all, and that breaking it is actually reported.

---

## How to Run

**Input:** a capability name, or none to check all of them.

**Output:** findings on stdout. BLOCKER findings mean the capability does not
guarantee what it claims.

Runs `npm run check:capabilities`, then the falsifiability check below, which
the automated gate cannot do on its own.

---

## Checks

### 1 — Both directions (BLOCKER)

`check:capabilities` verifies each way independently:

- **declared → source.** A component claiming the capability keeps it.
- **source → declared.** A component behaving like it says so.

The second is the one that earns the check. Sixteen scroll containers had no
focus indicator and two components set `data-surface` with no provider — a
declaration-only gate would have said nothing about any of them, because nothing
was declared.

### 2 — It has members (BLOCKER)

A capability with no declaring component enforces nothing. `stripes-rows` was
written for Table, Table is the only component that stripes, and it sat at zero
declarations for its whole life. `check:capabilities` refuses this now; if it
fires, either declare it where it holds or remove it.

### 3 — Targets are real kinds (BLOCKER)

Every entry in `targets` is a `SlotKind` from `src/spec-type.ts`. A typo does
not error — it silently applies to nothing, which looks identical to passing.

### 4 — It can fail (BLOCKER, and manual)

**A contract that has never failed has not been shown to work.** Take a
declaring component, break the thing the capability requires, confirm the check
reports it, restore.

Do this for every assertion the contract makes — `cssDeclaration`,
`cssAlternative`, `attribute`, `sourceCalls` — not just one.

`takes-disabled` shipped with `cssAlternative: '[data-disabled]'` compiled
straight into a `RegExp`, where square brackets are a character class: it
matched any file containing a `d`, an `a` or a `t`. Every run was green, the
contract asserted nothing, and only a deliberate break found it.

### 5 — Escapes are deliberate (WARN)

Three routes satisfy a contract without the rule appearing in the component's
own stylesheet, and all three are legitimate:

- a slot whose `element` is capitalised composes a Move component and inherits it
- a rule using `composes:` inherits through CSS Modules
- whatever `cssAlternative` names

If a component passes, confirm it passes for one of these reasons and not
because the matcher is too loose. A contract satisfied by `:not(:disabled)` —
the negation of itself — asserts nothing; guards are stripped before matching
for exactly that reason.

### 6 — It is not duplicated (WARN)

Search `scripts/checks/` for an existing check covering the same ground.
`takes-size` was dropped because `check:control-size` already pushes controls
onto the height tokens, and a second gate on the same rule is a place for the
two to disagree.
