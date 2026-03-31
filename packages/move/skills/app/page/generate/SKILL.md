# Generate Page — Route Component

Generate a page component for a specific route, composed from Move components and app composites. No custom CSS allowed.

---

## How to Run

**Input:** A description of the page (e.g. "dashboard with stats and activity feed", "settings page with profile form").

**Output:** A React page component that lives in the app's routes/pages directory.

---

## Process

### Step 1 — Read references

Read `../../references/recipes/rules.md` for the golden rules (no custom CSS, i18n pattern, FormField usage, hierarchy, etc.).

Read `references/page-patterns.md` for page structure conventions.

Browse `../../references/recipes/composite/` for existing composite patterns to compose into pages, and `../../references/recipes/component/` for correct component API usage.

### Step 2 — Identify structure

Break the page into:
- **Page header** — Breadcrumb, Heading, action buttons (via Align)
- **Content sections** — Cards, Grids, Stacks, Tabs
- **Data** — Tables, lists, forms
- **Composites** — reference existing app composites or suggest new ones

### Step 3 — Generate

Create a page component that:
1. Composes Move components for layout — no custom CSS
2. Uses composites for repeated patterns
3. Uses `collapseBelow` for responsive behavior
4. Includes page-level state (filters, selections, etc.)
5. Uses proper heading hierarchy (h1 for page title, h2 for sections)

### Step 4 — Validate

- [ ] Zero custom CSS
- [ ] Zero raw HTML layout elements
- [ ] Proper heading hierarchy
- [ ] Responsive via `collapseBelow`, not media queries
- [ ] Composites extracted for reusable patterns
