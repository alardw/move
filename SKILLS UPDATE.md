# Move — Styling & Generation Contract

This document defines the architectural rules that all AI skills and app-level code must follow.

The goal is consistency, determinism, and structural clarity.

---

## Core Philosophy

Move is:

- **Spec-first**
- **Runtime-backed (React)**
- **Token-driven**
- **Component-scoped**
- **AI-aware**

We do not avoid CSS.

We avoid _uncontrolled CSS_.

---

# Layout, Behavior, Styling — Clear Separation

## 1. Layout → Primitives

All layout must use Move layout components:

- `Stack`
- `Grid`
- `Align`
- `Card` (when structural container)

Layout must **not** be implemented via:

- Raw `<div>` wrappers
- CSS flex/grid overrides
- Margin hacks
- Inline `style`

Spacing must use:

- `gap`
- `padding`
- `align`
- `justify`
- `collapseBelow`

Never inline layout styles.

---

## 2. Behavior → Components

Interactive and structural behavior must use Move components:

- `Button`, `Link`
- `FormField`
- `Select`, `Checkbox`, etc.
- `Dialog`, `Popover`, etc.

Never:

- Raw `<button>`
- Raw `<a>`
- Manual label/input pairing
- Reimplemented state patterns

Controlled patterns (`value`, `checked`, `open`) must follow Move conventions.

---

## 3. Styling → CSS Modules (Token-Driven)

CSS is allowed and expected.

However, it must follow strict rules.

### Allowed

- Component-scoped `.module.css`
- Styling internal structure of a component
- Usage of Move tokens (`--move-*`)
- Slot-based styling
- Theme-aware variables

### Not Allowed

- Inline `style={{ ... }}`
- Hardcoded colors (e.g., `#000`, `rgb(...)`)
- Hardcoded spacing (`16px`, `12px`) instead of tokens
- Layout via CSS instead of primitives
- Global CSS
- External utility frameworks (Tailwind, etc.)

---

# Pages vs Composites

## Pages

Pages compose.

They:

- Arrange layout
- Wire state
- Compose primitives and composites
- Do NOT introduce styling logic
- Should rarely need `.module.css`

Pages must not:

- Contain layout `<div>` wrappers
- Introduce inline styles
- Duplicate composite patterns

If a pattern repeats → extract a composite.

---

## Composites

Composites:

- Are reusable
- Encapsulate structure + styling
- May include `.module.css`
- Must remain token-driven
- Must not implement layout primitives via CSS

Root element must be a Move layout primitive.

---

# AI Skill Enforcement Rules

All generation skills must enforce:

- No inline styles
- No raw layout elements
- Layout only via Move primitives
- Styling only via `.module.css` using tokens
- No hardcoded design values
- Extract repeated patterns into composites
- Follow heading hierarchy rules
- Use proper controlled patterns

Validation must be **mechanical**, not descriptive.

Fail generation if rules are violated.

---

# Architectural Summary

Move is not:

- Utility-first
- Inline-style-driven
- Tailwind-based
- Ad-hoc CSS

Move is:

- Component-scoped
- Token-governed
- Layout-by-primitives
- Behavior-by-contract
- Spec-readable for AI

The system allows variation.

It does not allow drift.

---

# Short Principle

Layout → primitives  
Behavior → components  
Styling → tokens in CSS modules  
No inline styles  
No layout in CSS

Consistency is structural, not stylistic.
