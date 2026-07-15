---
name: composite-update-spec
description: "Change an existing composite's decisions, data, or state and re-resolve it consistently against its design pattern — re-deriving bindings, Item shape, and children, keeping the tree coherent."
user-invocable: true
argument-hint: "[composite-name]"
---

# Composite — Update Spec

Edit a resolved composite without hand-patching. A composite is a resolved point in its
pattern's config space; changing a decision must **re-resolve everything that depends on it** —
its bindings, its Item shape, its controlled props, and its children — so the tree stays a legal
resolution. This is the composite counterpart of `component-improve`.

---

## How to Run

**Input:** a composite name + the change: a new axis decision, a data mapping change, or a
state control change (local ↔ controllable). May cascade into children.

**Output:** the updated `{Name}.spec.ts` (and any child specs the change touches), re-validated.

**REFUSES** if the change names an axis/role that isn't in `fromPattern`, or a value with no binding.

---

## Process

### Step 1 — Locate the change
Load the (slim) composite + its `fromPattern`. Classify the change:
- **decision** — a new value for an axis in `decisions`.
- **adapter** — a different `adapter` reference (a new source, or the same api mapped differently).
  The field→role mapping is NOT in the composite — it's the adapter's; change it there.

### Step 2 — Re-resolve the ripple (don't just overwrite)
The slim spec only stores decisions, so most of the "ripple" is re-*derived* by `generate()`, not
hand-edited — but a change can still invalidate things:
- **Coherence** — the new combination must still pass the pattern's `checkable` heuristics (a masonry
  flip may now violate H28 given the current `label`). Reconcile before writing.
- **Gap** — if the new value hits a `repr: null` binding, STOP and report (as in create).
- **Propagation** — if the changed axis is one the host pins on a child (`preset.<slot>`), the child
  composite's `decisions` change too → re-resolve that child.
- **Adapter change** — the new adapter must still cover every itemShape role (`composite-validate` /
  `adapter-validate`). Composition + code re-derive automatically; nothing in the spec to hand-update.

### Step 3 — Rewrite + re-validate + regenerate
Write the updated decision(s)/reference, run `composite-validate` over the node **and its children**
(the ripple may have invalidated a child), then `generate()` re-derives the code (which
`check:composite-spec-drift` then checks). You never hand-edit composition or `.tsx`.

---

## Rules
1. **Re-resolve, never hand-patch** — a changed decision must pass coherence and (if it's pinned on a
   child) re-resolve that child's decisions; then `generate()` re-derives bindings, Item shape,
   props, and code. You edit the decision; you never hand-edit the derived output.
2. **Coherence is preserved** — an edit that breaks a `checkable` heuristic is rejected or reconciled.
3. **Propagation flows** — changing a pinned axis re-resolves the affected child composite.
4. **Gaps still block** — a new value with no binding is a finding, not a silent substitution.
5. **Re-validate the subtree** — the node and every child it touched, before done.
6. **Deterministic** — same starting spec + same change → same result.
