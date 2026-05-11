---
name: app-composite
description: "Generate an app-specific component composed entirely from Move core components. No custom CSS allowed."
user-invocable: true
---

# Generate Composite — App-Specific Component

Generate an app-specific component composed entirely from Move core components. No custom CSS allowed.

---

## How to Run

**Input:** A description of the composite (e.g. "UserCard with avatar, name, and role", "MetricsPanel with stat cards").

**Output:** A React component file that composes Move components.

---

## Process

### Step 1 — Read references

Read `references/recipes/rules.md` for the golden rules (no custom CSS, i18n pattern, FormField usage, etc.).

Read `references/app/composition-rules.md` for available layout components and their props.

Browse `references/recipes/component/` for correct component API usage and `references/recipes/composite/` for existing composite patterns to reuse or extend.

### Step 2 — Identify components needed

Map the composite's requirements to Move core components:
- Layout → Stack, Grid, Align
- Container → Card
- Typography → Heading, Text
- Media → Avatar, Image
- Data → Badge, Table
- Actions → Button, Link
- Feedback → Alert, Toast

### Step 3 — Generate

Create a React component that:
1. Accepts typed props for dynamic content
2. Composes Move components — no custom CSS, no raw HTML layout divs
3. Uses component `gap`, `align`, `justify` props for spacing — never inline styles
4. Exports cleanly for use across pages

### Step 4 — Validate

- [ ] Zero custom CSS (no className with custom styles, no inline layout styles)
- [ ] Zero raw HTML layout elements
- [ ] All imports from `'move'`
- [ ] Props are typed
- [ ] Component is reusable across pages
