/**
 * Deterministic project generator — the GENERATE half of the creation contract.
 *
 * `generateProject(name, options)` returns the full set of text files a Move app
 * is made of, keyed by relative path. Same name + options in → identical bytes
 * out (no timestamps, no randomness). The dependency set, scripts, and
 * move.config all come straight from `creation-spec.mjs`, so the files this emits
 * satisfy `validateProject` by construction.
 *
 * The two directory-shaped deliverables — the copied skills folders and the empty
 * composites root — are handled by the CLI (index.mjs); this module owns text.
 */
import {
  MOVE_CONFIG,
  REQUIRED_SCRIPTS,
  resolveDeps,
} from 'move/scaffold/creation-spec.mjs';

// ---------------------------------------------------------------------------
// Icon resolvers
// ---------------------------------------------------------------------------

const ICON_CONFIGS = {
  lucide: {
    imports: `\nimport * as LucideIcons from 'lucide-react';`,
    resolver: `\nfunction toPascalCase(str: string) {
  return str.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

const iconResolver = (name: string) => {
  const icons = LucideIcons as Record<string, unknown>;
  return (icons[toPascalCase(name)] || icons[name] || null) as React.ComponentType | null;
};\n`,
  },
  none: { imports: '', resolver: '' },
};

// ---------------------------------------------------------------------------
// App.tsx per shell × router
// ---------------------------------------------------------------------------

function sidebarApp({ themeImport, iconImports, iconResolverBlock, iconResolverProp, router }) {
  if (router === 'react-router') {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoveRoot, ${themeImport}, Sidebar, Stack, Heading, Text, ScrollArea } from 'move';
import 'move/styles.css';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';${iconImports}
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
${iconResolverBlock}
function AppSidebar() {
  return (
    <Sidebar.Root>
      <Sidebar.Header collapsedChildren={<Text weight="bold" size="lg">M</Text>}>
        <Heading level={2}>My App</Heading>
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MoveRoot theme={${themeImport}}${iconResolverProp}>
        <App />
      </MoveRoot>
    </BrowserRouter>
  </React.StrictMode>,
);
`;
  }
  if (router === 'tanstack') {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoveRoot, ${themeImport}, Sidebar, Stack, Heading, Text, ScrollArea } from 'move';
import 'move/styles.css';
import { RouterProvider, createRouter, createRoute, createRootRoute, Link, useMatch, Outlet } from '@tanstack/react-router';${iconImports}
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
${iconResolverBlock}
const rootRoute = createRootRoute({ component: RootLayout });
const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: AboutPage });
const router = createRouter({ routeTree: rootRoute.addChildren([homeRoute, aboutRoute]) });

function NavItem({ to, icon, children }: { to: string; icon: string; children: React.ReactNode }) {
  const isActive = !!useMatch({ from: to, shouldThrow: false });
  return (
    <Link to={to}>
      <Sidebar.Item icon={icon} active={isActive} tooltip={children}>{children}</Sidebar.Item>
    </Link>
  );
}

function AppSidebar() {
  return (
    <Sidebar.Root>
      <Sidebar.Header collapsedChildren={<Text weight="bold" size="lg">M</Text>}>
        <Heading level={2}>My App</Heading>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group>
          <NavItem to="/" icon="home">Home</NavItem>
          <NavItem to="/about" icon="info">About</NavItem>
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Trigger icon="panel-left" tooltip="Toggle sidebar" visibility="desktop">Collapse</Sidebar.Trigger>
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}

function RootLayout() {
  return (
    <Sidebar.Provider>
      <Stack direction="row" gap="none" align="stretch" fill>
        <AppSidebar />
        <ScrollArea.Root>
          <ScrollArea.Content padded>
            <Sidebar.Trigger icon="menu" visibility="mobile" />
            <Outlet />
          </ScrollArea.Content>
        </ScrollArea.Root>
      </Stack>
    </Sidebar.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MoveRoot theme={${themeImport}}${iconResolverProp}>
      <RouterProvider router={router} />
    </MoveRoot>
  </React.StrictMode>,
);
`;
  }
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoveRoot, ${themeImport}, Sidebar, Stack, ScrollArea } from 'move';
import 'move/styles.css';${iconImports}
import { AppSidebar } from './components/AppSidebar';
import { HomePage } from './pages/HomePage';
${iconResolverBlock}
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MoveRoot theme={${themeImport}}${iconResolverProp}>
      <App />
    </MoveRoot>
  </React.StrictMode>,
);
`;
}

function topNavApp({ themeImport, iconImports, iconResolverBlock, iconResolverProp, router }) {
  if (router === 'react-router') {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoveRoot, ${themeImport}, Stack, Align, Divider, Heading, Link as MoveLink, ScrollArea } from 'move';
import 'move/styles.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';${iconImports}
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
${iconResolverBlock}
function App() {
  return (
    <Stack gap="none" fill>
      <Align padding="md">
        <Align.Start>
          <Heading level={2}>My App</Heading>
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MoveRoot theme={${themeImport}}${iconResolverProp}>
        <App />
      </MoveRoot>
    </BrowserRouter>
  </React.StrictMode>,
);
`;
  }
  if (router === 'tanstack') {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoveRoot, ${themeImport}, Stack, Align, Divider, Heading, Link as MoveLink, ScrollArea } from 'move';
import 'move/styles.css';
import { RouterProvider, createRouter, createRoute, createRootRoute, Link, Outlet } from '@tanstack/react-router';${iconImports}
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
${iconResolverBlock}
const rootRoute = createRootRoute({ component: RootLayout });
const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: AboutPage });
const router = createRouter({ routeTree: rootRoute.addChildren([homeRoute, aboutRoute]) });

function RootLayout() {
  return (
    <Stack gap="none" fill>
      <Align padding="md">
        <Align.Start>
          <Heading level={2}>My App</Heading>
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
          <Outlet />
        </ScrollArea.Content>
      </ScrollArea.Root>
    </Stack>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MoveRoot theme={${themeImport}}${iconResolverProp}>
      <RouterProvider router={router} />
    </MoveRoot>
  </React.StrictMode>,
);
`;
  }
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoveRoot, ${themeImport}, Stack, Align, Divider, Heading, ScrollArea } from 'move';
import 'move/styles.css';${iconImports}
import { HomePage } from './pages/HomePage';
${iconResolverBlock}
function App() {
  return (
    <Stack gap="none" fill>
      <Align padding="md">
        <Align.Start>
          <Heading level={2}>My App</Heading>
        </Align.Start>
      </Align>
      <Divider />
      <ScrollArea.Root>
        <ScrollArea.Content padded>
          <HomePage />
        </ScrollArea.Content>
      </ScrollArea.Root>
    </Stack>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MoveRoot theme={${themeImport}}${iconResolverProp}>
      <App />
    </MoveRoot>
  </React.StrictMode>,
);
`;
}

function minimalApp({ themeImport, iconImports, iconResolverBlock, iconResolverProp, router }) {
  if (router === 'react-router') {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoveRoot, ${themeImport}, Stack } from 'move';
import 'move/styles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';${iconImports}
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
${iconResolverBlock}
function App() {
  return (
    <Stack align="center" justify="center" fill>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Stack>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MoveRoot theme={${themeImport}}${iconResolverProp}>
        <App />
      </MoveRoot>
    </BrowserRouter>
  </React.StrictMode>,
);
`;
  }
  if (router === 'tanstack') {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoveRoot, ${themeImport}, Stack } from 'move';
import 'move/styles.css';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';${iconImports}
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
${iconResolverBlock}
const rootRoute = createRootRoute({
  component: () => (
    <Stack align="center" justify="center" fill>
      <Outlet />
    </Stack>
  ),
});
const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: AboutPage });
const router = createRouter({ routeTree: rootRoute.addChildren([homeRoute, aboutRoute]) });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MoveRoot theme={${themeImport}}${iconResolverProp}>
      <RouterProvider router={router} />
    </MoveRoot>
  </React.StrictMode>,
);
`;
  }
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoveRoot, ${themeImport}, Stack } from 'move';
import 'move/styles.css';${iconImports}
import { HomePage } from './pages/HomePage';
${iconResolverBlock}
function App() {
  return (
    <Stack align="center" justify="center" fill>
      <HomePage />
    </Stack>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MoveRoot theme={${themeImport}}${iconResolverProp}>
      <App />
    </MoveRoot>
  </React.StrictMode>,
);
`;
}

const SHELLS = { sidebar: sidebarApp, 'top-nav': topNavApp, minimal: minimalApp };

// ---------------------------------------------------------------------------
// Static file bodies
// ---------------------------------------------------------------------------

const INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Move App</title>
    <style>html, body, #root { height: 100%; margin: 0; }</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/App.tsx"></script>
  </body>
</html>
`;

const TSCONFIG = `{
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
  "include": ["src"],
  "exclude": ["src/**/*.test.ts", "src/**/*.test.tsx"]
}
`;

const VITE_CONFIG = `/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Only .test files are tests — composition \`.spec.ts\` files are specs, not
    // suites (vitest's default include would collect them and fail on "no tests").
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
`;

const VITEST_SETUP = `import '@testing-library/jest-dom';

// jsdom lacks several browser APIs Move components (and Radix under them) touch at
// mount: ResizeObserver, IntersectionObserver, pointer-capture, scrollIntoView,
// and matchMedia (the animation engine reads prefers-reduced-motion through it).
// Without these, components throw on render.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
if (!('ResizeObserver' in globalThis)) {
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopObserver;
}
if (!('IntersectionObserver' in globalThis)) {
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = NoopObserver;
}
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = Element.prototype.scrollIntoView ?? (() => {});
  Element.prototype.hasPointerCapture = Element.prototype.hasPointerCapture ?? (() => false);
  Element.prototype.setPointerCapture = Element.prototype.setPointerCapture ?? (() => {});
  Element.prototype.releasePointerCapture = Element.prototype.releasePointerCapture ?? (() => {});
}
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}
`;

const A11Y_SWEEP = `import { describe, it, expect } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import axe from 'axe-core';
import { MoveRoot } from 'move';

// Render-time a11y ratchet. Renders every composite in src/composites and runs
// axe-core over the DOM (mechanical rules only — jsdom has no layout or colour).
// The baseline (accessibility.baseline.json) holds the accepted per-entry/per-rule
// counts: a NEW violation above it fails; fixing one lets you shrink the baseline.
// Re-snapshot: A11Y_UPDATE=1 vitest run src/conformance/accessibility.test.tsx
const AXE_OPTS: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
    region: { enabled: false },
    'landmark-one-main': { enabled: false },
    'page-has-heading-one': { enabled: false },
    'html-has-lang': { enabled: false },
    'document-title': { enabled: false },
    bypass: { enabled: false },
    'landmark-unique': { enabled: false },
  },
};

const BASELINE = path.join(process.cwd(), 'src', 'conformance', 'accessibility.baseline.json');

type Counts = Record<string, Record<string, number>>;
const sortCounts = (c: Counts): Counts => {
  const out: Counts = {};
  for (const label of Object.keys(c).sort()) {
    out[label] = {};
    for (const rule of Object.keys(c[label]).sort()) out[label][rule] = c[label][rule];
  }
  return out;
};

// Every default/named component export under src/composites becomes a sweep entry.
// A composite that needs props will throw on bare render — that's recorded as a
// render error (logged, non-fatal), not counted as an a11y violation.
const modules = import.meta.glob('../composites/**/*.tsx', { eager: true });
type Entry = { label: string; Comp: React.ComponentType };
const entries: Entry[] = [];
for (const [file, mod] of Object.entries(modules)) {
  if (file.endsWith('.test.tsx')) continue;
  const base = file.replace('../composites/', '').replace(/\\.tsx$/, '');
  for (const [name, val] of Object.entries(mod as Record<string, unknown>)) {
    if (typeof val === 'function' && /^[A-Z]/.test(name)) {
      entries.push({ label: \`\${base}/\${name}\`, Comp: val as React.ComponentType });
    }
  }
}

describe('a11y sweep (axe — roles, names, ARIA)', () => {
  it(
    'introduces no mechanical a11y violations above the baseline',
    async () => {
      const counts: Counts = {};
      const errors: { label: string; msg: string }[] = [];

      for (const e of entries) {
        try {
          const { container } = render(
            <MoveRoot>
              <e.Comp />
            </MoveRoot>,
          );
          const res = await axe.run(container, AXE_OPTS);
          for (const v of res.violations) {
            (counts[e.label] ??= {})[v.id] = (counts[e.label]?.[v.id] ?? 0) + v.nodes.length;
          }
        } catch (err) {
          errors.push({ label: e.label, msg: String((err as Error)?.message ?? err).slice(0, 140) });
        } finally {
          cleanup();
        }
      }

      const live = Object.values(counts).reduce((a, r) => a + Object.values(r).reduce((x, y) => x + y, 0), 0);

      if (process.env.A11Y_UPDATE) {
        fs.writeFileSync(BASELINE, JSON.stringify(sortCounts(counts), null, 2) + '\\n');
        console.log(\`a11y baseline written — \${live} finding(s) across \${Object.keys(counts).length} entries\`);
        return;
      }

      const baseline: Counts = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : {};
      let baseTotal = 0;
      for (const r of Object.values(baseline)) for (const n of Object.values(r)) baseTotal += n;

      const regressions: string[] = [];
      for (const [label, rules] of Object.entries(counts))
        for (const [rule, n] of Object.entries(rules)) {
          const allowed = baseline[label]?.[rule] ?? 0;
          if (n > allowed) regressions.push(\`+\${n - allowed}  \${label}  [\${rule}]\`);
        }

      console.log(\`a11y ratchet: \${live} live · \${baseTotal} baseline · \${regressions.length} new\`);
      for (const e of errors) console.log(\`  ⚠ render error \${e.label}: \${e.msg}\`);
      if (regressions.length) {
        console.log('\\n✗ new a11y violations (above the baseline):');
        for (const r of regressions) console.log(\`  \${r}\`);
      }

      expect(regressions, regressions.join('\\n')).toEqual([]);
    },
    120_000,
  );
});
`;

const CHECKS_YML = `name: Checks

on:
  push:
    branches: [main]
  pull_request:

jobs:
  conformance:
    name: Typecheck + conformance gates
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - name: Typecheck
        run: npm run typecheck
      # Static conformance — composites are built entirely from Move components.
      - name: Conformance (move check)
        run: npm run check
      # Render-time a11y ratchet — axe over every composite; no new violations.
      - name: Accessibility ratchet
        run: npm run test:a11y
`;

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
      <stop stop-color="#a78bfa"/>
      <stop offset="1" stop-color="#6d28d9"/>
    </linearGradient>
  </defs>
  <path d="M4 8l12 18L28 8" stroke="url(#g)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="16" cy="8" r="3" fill="url(#g)"/>
</svg>
`;

const HOME_PAGE = `import { useState } from 'react';
import { Stack, Heading, Text, Button, Code } from 'move';

export function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <Stack gap="lg" align="center">
      <Heading level={1}>Welcome to Move</Heading>
      <Text color="muted" size="lg">
        Edit <Code>src/pages/HomePage.tsx</Code>, or ask your AI assistant to build a
        composite in <Code>src/composites</Code>.
      </Text>
      <Button onClick={() => setCount((c) => c + 1)}>Count: {count}</Button>
    </Stack>
  );
}
`;

const ABOUT_PAGE = `import { Stack, Heading, Text, Code } from 'move';

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
`;

const APP_SIDEBAR = `import { Sidebar, Heading, Text } from 'move';

export function AppSidebar() {
  return (
    <Sidebar.Root>
      <Sidebar.Header collapsedChildren={<Text weight="bold" size="lg">M</Text>}>
        <Heading level={2}>My App</Heading>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.Item icon="home" active tooltip="Home">Home</Sidebar.Item>
          <Sidebar.Item icon="info" tooltip="About">About</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Trigger icon="panel-left" tooltip="Toggle sidebar" visibility="desktop">Collapse</Sidebar.Trigger>
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}
`;

const GITIGNORE = `node_modules
dist
dist-ssr
*.local
.DS_Store
`;

const readme = (name) => `# ${name}

A Move app. Built from Move components; conformance and accessibility are gated
from the first commit.

## Develop

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build your screens

Ask your AI assistant (Claude Code / Codex — skills are installed under
\`.claude/skills\` and \`.agents/skills\`) to run \`/app-compose\`. It writes
composites into \`src/composites\`, built entirely from Move components.

## Conformance

\`\`\`bash
npm run check       # static: composites are 100% Move components
npm run test:a11y   # render-time: axe over every composite (ratchet)
npm run typecheck
\`\`\`

Both gates also run in CI (\`.github/workflows/checks.yml\`).
`;

/**
 * Build every text file for a project. Returns a path→content map (relative to
 * the project root). Directory-shaped outputs (skills, the composites root) are
 * created by the CLI.
 *
 * @param {string} name Project name (used in package.json + README).
 * @param {import('move/scaffold/creation-spec.mjs').CreationOptions} options
 * @returns {Record<string, string>}
 */
export function generateProject(name, options) {
  const { shell, router, icons, theme } = options;
  const { deps, devDeps } = resolveDeps(options);

  const pkg = {
    name,
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: { ...REQUIRED_SCRIPTS },
    dependencies: deps,
    devDependencies: devDeps,
  };

  const iconConfig = ICON_CONFIGS[icons];
  const appTsx = SHELLS[shell]({
    themeImport: theme === 'dark' ? 'darkTheme' : 'lightTheme',
    iconImports: iconConfig.imports,
    iconResolverBlock: iconConfig.resolver,
    iconResolverProp: iconConfig.resolver ? ' iconResolver={iconResolver}' : '',
    router,
  });

  /** @type {Record<string, string>} */
  const files = {
    'package.json': JSON.stringify(pkg, null, 2) + '\n',
    'move.config.json': JSON.stringify(MOVE_CONFIG, null, 2) + '\n',
    'index.html': INDEX_HTML,
    'tsconfig.json': TSCONFIG,
    'vite.config.ts': VITE_CONFIG,
    'vitest.setup.ts': VITEST_SETUP,
    '.gitignore': GITIGNORE,
    'README.md': readme(name),
    'public/favicon.svg': FAVICON,
    'src/vite-env.d.ts': '/// <reference types="vite/client" />\n',
    'src/App.tsx': appTsx,
    'src/pages/HomePage.tsx': HOME_PAGE,
    'src/components/.gitkeep': '',
    'src/composites/.gitkeep': '',
    'src/conformance/accessibility.test.tsx': A11Y_SWEEP,
    'src/conformance/accessibility.baseline.json': '{}\n',
  };

  // The gates are portable npm scripts (check + test:a11y); the GitHub Actions
  // workflow is one optional binding that runs them. `--ci none` skips it for
  // consumers on another pipeline.
  if (options.ci === 'github') files['.github/workflows/checks.yml'] = CHECKS_YML;

  // Pages/components referenced only by certain shell × router combinations.
  if (router !== 'none') files['src/pages/AboutPage.tsx'] = ABOUT_PAGE;
  if (shell === 'sidebar' && router === 'none') files['src/components/AppSidebar.tsx'] = APP_SIDEBAR;

  return files;
}
