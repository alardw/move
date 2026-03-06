# Generate App — Bootstrap & Shell

Generate the bootstrapping code and app shell for a new Move application. Combines provider setup (`MoveRoot`) with the structural frame (sidebar, top-nav, or minimal).

---

## How to Run

**Input:** Framework context (e.g. "Vite + React", "Next.js") and optional preferences (theme, icon library, shell type).

**Output:**
- App entry point with `<MoveRoot>` wrapper
- App shell component (sidebar layout, top-nav layout, or minimal)
- Icon resolver setup (if icon library specified)

---

## Process

### Step 1 — Read reference

Read these files from `references/`:

| File | Purpose |
|------|---------|
| `references/bootstrap.md` | MoveRoot API, provider setup, icon resolver patterns |
| `references/layout-composition.md` | Layout components, composition rules, shell patterns |

### Step 2 — Determine setup

Ask or infer:
1. **Framework** — Vite, Next.js, Remix, etc.
2. **Icon library** — Lucide, Heroicons, custom, or none
3. **Theme** — `darkTheme` (default) or `lightTheme`
4. **Shell type**:
   - `sidebar` — Sidebar + content area (default for dashboards/apps)
   - `top-nav` — Align header + content area (marketing, docs)
   - `minimal` — Just MoveRoot, no shell (landing pages, focused tools)

### Step 3 — Generate bootstrap

Generate the entry point using `<MoveRoot>`. Key rules:
- Always use `MoveRoot` — never manually nest `ThemeProvider`, `IconProvider`, `MoveProvider`
- Icon resolver is a plain function — Move is icon-library agnostic
- For Next.js App Router, `MoveRoot` must be in a Client Component
- Define resolver outside the component for stable reference

### Step 4 — Generate shell

Based on shell type, generate the app frame using **only Move components**:

**Sidebar shell:**
```tsx
<MoveRoot theme={darkTheme} iconResolver={resolver}>
  <Sidebar.Provider>
    <Stack direction="row" gap="none" align="stretch">
      <Sidebar.Root>
        <Sidebar.Header>...</Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
            <Sidebar.Item icon={...} tooltip="...">...</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>...</Sidebar.Footer>
        <Sidebar.Rail />
      </Sidebar.Root>
      {/* router outlet */}
    </Stack>
    <Sidebar.Overlay />
  </Sidebar.Provider>
</MoveRoot>
```

**Top-nav shell:**
```tsx
<MoveRoot theme={darkTheme} iconResolver={resolver}>
  <Stack gap="none">
    <Align>
      <Align.Start>{/* logo */}</Align.Start>
      <Align.Center>{/* nav links */}</Align.Center>
      <Align.End>{/* user menu */}</Align.End>
    </Align>
    <Divider />
    {/* router outlet */}
  </Stack>
</MoveRoot>
```

**Minimal shell:**
```tsx
<MoveRoot theme={darkTheme} iconResolver={resolver}>
  {/* router outlet */}
</MoveRoot>
```

### Step 5 — Framework-specific routing

Wire the content slot based on framework:
- **Next.js App Router:** `{children}` in layout.tsx
- **React Router:** `<Outlet />`
- **TanStack Router:** `<Outlet />`
- **Generic:** `{children}` prop

### Step 6 — Validate

- [ ] `MoveRoot` wraps the entire app tree
- [ ] Zero custom CSS — only Move component props for layout
- [ ] Icon resolver defined outside component (stable reference)
- [ ] Shell uses only Move layout components (Stack, Align, Sidebar, Divider)
- [ ] Router outlet placed correctly for the framework
