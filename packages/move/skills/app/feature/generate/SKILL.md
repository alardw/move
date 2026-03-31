# Generate Feature — Cross-Page Functionality

Generate a complete feature that spans multiple pages, composites, and routing. Orchestrates the creation of all artifacts needed for a functional area of the app.

---

## How to Run

**Input:** A feature description (e.g. "user authentication with login, signup, and forgot password", "project management with list, detail, and create views").

**Output:**
- Page components for each route
- Composite components for shared UI patterns
- Routing configuration for the framework
- Shared hooks/context if needed

---

## Process

### Step 1 — Read references

Read `../../references/recipes/rules.md` for the golden rules (no custom CSS, i18n pattern, FormField usage, hierarchy, etc.).

Read `references/feature-patterns.md` for feature decomposition strategy, cross-page state patterns, and routing conventions.

Browse `../../references/recipes/composite/` for existing composite patterns to reuse across pages, and `../../references/recipes/component/` for correct component API usage.

### Step 2 — Decompose feature

Break the feature into:
1. **Pages** — individual routes/views
2. **Composites** — shared UI patterns across pages
3. **State** — shared state/context needed across pages
4. **Routes** — URL structure and navigation

### Step 3 — Generate artifacts

For each artifact, delegate to the appropriate skill:
- Pages → follow `page/generate` patterns
- Composites → follow `composite/generate` patterns
- All layout follows the no-custom-CSS rule

### Step 4 — Wire routing

Framework-specific route configuration:
- **Next.js App Router:** Create `app/{feature}/` directory with `layout.tsx` + `page.tsx` files
- **React Router:** Add route entries with nested layouts
- **TanStack Router:** Create route files with proper tree structure

### Step 5 — Validate

- [ ] All pages follow page patterns
- [ ] All composites follow composition rules
- [ ] Zero custom CSS across all generated files
- [ ] Routes are correctly wired
- [ ] Shared state is properly scoped
- [ ] Navigation between pages works (Links, Breadcrumbs)
