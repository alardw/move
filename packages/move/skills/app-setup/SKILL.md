---
name: app-setup
description: "Scaffold a complete Move app — project files, MoveRoot, shell, routing, pages. Handles standalone and workspace packages."
user-invocable: true
argument-hint: "[app-name]"
---

# App Setup — Full Project Scaffold

Scaffold a complete Move application from scratch. Generates all project files, the app shell, routing, and starter pages. This is the single entry point for creating any Move app — standalone or workspace package.

---

## How to Run

**Input:** An app name and optional preferences. Examples:
- `/app-setup my-app`
- `/app-setup benchmark — sidebar, dark theme, react router, lucide`
- `/app-setup packages/admin — workspace package, top-nav shell`

**Output:** A complete, runnable Vite + React project:
- `package.json` with correct dependencies
- `index.html`, `tsconfig.json`, `vite.config.ts`
- `src/App.tsx` — MoveRoot + shell + routing
- `src/pages/HomePage.tsx`, `src/pages/AboutPage.tsx` — starter pages
- `src/vite-env.d.ts`

---

## Process

### Step 1 — Read references

Read these files before generating anything:

| File | Purpose |
|------|---------|
| `references/app/bootstrap.md` | MoveRoot API, provider setup, icon resolver patterns |
| `references/app/layout-composition.md` | Layout components, composition rules, shell patterns |

### Step 2 — Determine configuration

Infer from the user's prompt, or ask if ambiguous:

| Setting | Options | Default |
|---------|---------|---------|
| **Shell** | `sidebar`, `top-nav`, `minimal` | `sidebar` |
| **Theme** | `darkTheme`, `lightTheme` | `darkTheme` |
| **Icons** | `lucide`, `heroicons`, `none` | `lucide` |
| **Router** | `react-router`, `tanstack`, `none` | `none` |
| **Context** | standalone project, workspace package | standalone |

**Workspace detection:** If the path starts with `packages/` or the user says "workspace package", use workspace mode:
- `move` dependency: `"file:../move"` instead of `"^0.1.0"`
- `vite.config.ts`: add aliases to resolve local Move source
- No `npm install` — user runs it from monorepo root

### Step 3 — Generate project files

#### 3a. `package.json`

```json
{
  "name": "{app-name}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "move": "^0.1.0",
    "animejs": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0"
  }
}
```

Add conditional dependencies:
- **Lucide:** `"lucide-react": "^0.560.0"`
- **Heroicons:** `"@heroicons/react": "^2.2.0"`
- **React Router:** `"react-router-dom": "^7.0.0"`
- **TanStack Router:** `"@tanstack/react-router": "^1.0.0"` + dev `"@tanstack/router-devtools": "^1.0.0"`
- **Workspace mode:** change `"move": "file:../move"`

#### 3b. `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{App Name}</title>
    <style>html, body, #root { height: 100%; margin: 0; }</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/App.tsx"></script>
  </body>
</html>
```

#### 3c. `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

#### 3d. `vite.config.ts`

**Standalone:**
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

**Workspace package:**
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: {unique-port},
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: 'move/styles.css', replacement: path.resolve('../move/src/styles/system.css') },
      { find: 'move', replacement: path.resolve('../move/src/index.ts') },
    ],
  },
});
```

#### 3e. `src/vite-env.d.ts`

```ts
/// <reference types="vite/client" />
```

### Step 4 — Generate starter pages

#### `src/pages/HomePage.tsx`

```tsx
import { useState } from 'react';
import { Stack, Heading, Text, Button, Code } from 'move';

export function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <Stack gap="lg" align="center">
      <Heading level={1}>Welcome to Move</Heading>
      <Text color="muted" size="lg">
        Edit <Code>src/pages/HomePage.tsx</Code> to get started.
      </Text>
      <Button onClick={() => setCount((c) => c + 1)}>
        Count: {count}
      </Button>
    </Stack>
  );
}
```

#### `src/pages/AboutPage.tsx` (only when router is enabled)

```tsx
import { Stack, Heading, Text, Code } from 'move';

export function AboutPage() {
  return (
    <Stack gap="lg" align="center">
      <Heading level={1}>About</Heading>
      <Text color="muted" size="lg">
        Built with <Code>move</Code> — a composable React component library.
      </Text>
    </Stack>
  );
}
```

### Step 5 — Generate `src/App.tsx`

This is the core file. It combines MoveRoot, icon resolver, shell, and routing into a single entry point that mounts the React app.

**Structure:**
1. React + ReactDOM imports
2. Move imports (MoveRoot, theme, shell components)
3. `'move/styles.css'` import
4. Icon library import + resolver function (outside component)
5. Router imports (if applicable)
6. Page imports
7. Shell component (AppSidebar / header / none)
8. App component with shell + routing
9. `ReactDOM.createRoot` render call

**Icon resolver patterns:**

Lucide:
```tsx
import * as LucideIcons from 'lucide-react';

function toPascalCase(str: string) {
  return str.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

const iconResolver = (name: string) => {
  const icons = LucideIcons as Record<string, unknown>;
  return (icons[toPascalCase(name)] || icons[name] || null) as React.ComponentType | null;
};
```

Heroicons:
```tsx
import * as HeroIcons from '@heroicons/react/24/outline';

const iconResolver = (name: string) => {
  const icons = HeroIcons as Record<string, unknown>;
  return (icons[toPascalCase(name) + 'Icon'] || icons[toPascalCase(name)] || null) as React.ComponentType | null;
};
```

**Shell patterns:**

Sidebar + React Router:
```tsx
function AppSidebar() {
  return (
    <Sidebar.Root>
      <Sidebar.Header collapsedChildren={<Text weight="bold" size="lg">M</Text>}>
        <Heading level={2} size="lg">My App</Heading>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group>
          <NavLink to="/">{({ isActive }) => <Sidebar.Item icon="home" active={isActive} tooltip="Home">Home</Sidebar.Item>}</NavLink>
          <NavLink to="/about">{({ isActive }) => <Sidebar.Item icon="info" active={isActive} tooltip="About">About</Sidebar.Item>}</NavLink>
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Trigger icon="panel-left" tooltip="Toggle sidebar" visibility="desktop">Collapse</Sidebar.Trigger>
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}

function App() {
  return (
    <Sidebar.Provider>
      <Stack direction="row" gap="none" align="stretch" fill>
        <AppSidebar />
        <ScrollArea.Root>
          <ScrollArea.Content padded>
            <Sidebar.Trigger icon="menu" visibility="mobile" />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </ScrollArea.Content>
        </ScrollArea.Root>
      </Stack>
    </Sidebar.Provider>
  );
}
```

> **Scrollable page content** — wrap the page area in `ScrollArea.Root` +
> `ScrollArea.Content`. Without this, tall content pushes the body scrollbar
> and the sidebar scrolls out of view. `ScrollArea.Content` already applies
> `flex: 1; overflow-y: auto; min-height: 0`, and `padded` gives it the
> standard page padding — replaces the old `<Stack flex={1} padding="lg">`.

> `Sidebar.Root` portals its own mobile overlay + backdrop internally when
> `isMobile && mobileOpen`. Do **not** place `<Sidebar.Overlay />` in the app
> shell — it would render as a permanent full-viewport backdrop on desktop.

Sidebar without router:
```tsx
function App() {
  return (
    <Sidebar.Provider>
      <Stack direction="row" gap="none" align="stretch" fill>
        <AppSidebar />
        <ScrollArea.Root>
          <ScrollArea.Content padded>
            <Sidebar.Trigger icon="menu" visibility="mobile" />
            <HomePage />
          </ScrollArea.Content>
        </ScrollArea.Root>
      </Stack>
    </Sidebar.Provider>
  );
}
```

Top-nav + React Router:
```tsx
function App() {
  return (
    <Stack gap="none" fill>
      <Align padding="md">
        <Align.Start>
          <Heading level={2} size="lg">My App</Heading>
        </Align.Start>
        <Align.Center>
          <Stack direction="row" gap="md">
            <Link to="/"><MoveLink>Home</MoveLink></Link>
            <Link to="/about"><MoveLink>About</MoveLink></Link>
          </Stack>
        </Align.Center>
      </Align>
      <Divider />
      <ScrollArea.Root>
        <ScrollArea.Content padded>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </ScrollArea.Content>
      </ScrollArea.Root>
    </Stack>
  );
}
```

Minimal:
```tsx
function App() {
  return (
    <Stack align="center" justify="center" fill>
      <HomePage />
    </Stack>
  );
}
```

**Mount pattern (always at the bottom of App.tsx):**
```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* BrowserRouter wraps here if react-router */}
    <MoveRoot theme={darkTheme} iconResolver={iconResolver}>
      <App />
    </MoveRoot>
  </React.StrictMode>,
);
```

### Step 6 — Install dependencies

- **Standalone:** Run `npm install`
- **Workspace:** Tell the user to run `npm install` from the monorepo root

### Step 7 — Validate

- [ ] `MoveRoot` wraps the entire app tree
- [ ] Zero custom CSS — only Move component props for layout
- [ ] Icon resolver defined outside component (stable reference)
- [ ] Shell uses only Move layout components (Stack, Align, Sidebar, Divider)
- [ ] Router outlet placed correctly
- [ ] Page content wrapped in `<ScrollArea.Root><ScrollArea.Content padded>` — sidebar must stay fixed while page scrolls
- [ ] **No** `<Sidebar.Overlay />` in the shell — Root portals its own mobile overlay internally
- [ ] **No** `<Sidebar.Rail />` in the shell — collapse is handled by the Footer Trigger; the rail's thin-bar affordance conflicts with `Splitter`'s drag-to-resize gutter
- [ ] `fill` prop on outer Stack (sidebar and top-nav shells)
- [ ] `index.html` has `height: 100%` on html/body/#root
- [ ] Entry point is `/src/App.tsx` (Vite direct)
- [ ] Workspace: vite aliases resolve local Move source

---

## Rules

1. **Always read references first** — never generate from memory
2. **Zero custom CSS** — no `style={{}}` for layout, no className with custom styles. Only exception: bounded preview containers (`style={{ height: N }}`)
3. **No raw HTML layout** — no `<div>`, `<main>`, `<section>` for layout. Use Stack, Grid, Align
4. **Icon resolver outside component** — stable reference, no re-renders
5. **Single App.tsx entry** — everything in one file (MoveRoot, shell, routing, mount). No separate main.tsx
6. **Workspace detection** — if path starts with `packages/` or user says "workspace", use workspace mode
7. **Match create-move-app output** — the generated code must be identical to what `npx create-move-app` would produce for the same options
