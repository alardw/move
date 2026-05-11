#!/usr/bin/env node

import { mkdirSync, writeFileSync, cpSync, existsSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import prompts from 'prompts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatesDir = join(__dirname, '..', 'templates');

// ---------------------------------------------------------------------------
// Icon resolver templates
// ---------------------------------------------------------------------------

const ICON_CONFIGS = {
  lucide: {
    pkg: 'lucide-react',
    version: '^0.560.0',
    imports: `import * as LucideIcons from 'lucide-react';`,
    resolver: `function toPascalCase(str: string) {
  return str.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

const iconResolver = (name: string) => {
  const icons = LucideIcons as Record<string, unknown>;
  return (icons[toPascalCase(name)] || icons[name] || null) as React.ComponentType | null;
};`,
  },
  heroicons: {
    pkg: '@heroicons/react',
    version: '^2.2.0',
    imports: `import * as HeroIcons from '@heroicons/react/24/outline';`,
    resolver: `function toPascalCase(str: string) {
  return str.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

const iconResolver = (name: string) => {
  const icons = HeroIcons as Record<string, unknown>;
  return (icons[toPascalCase(name) + 'Icon'] || icons[toPascalCase(name)] || null) as React.ComponentType | null;
};`,
  },
  none: {
    pkg: null,
    version: null,
    imports: '',
    resolver: '',
  },
};

// ---------------------------------------------------------------------------
// Router configs
// ---------------------------------------------------------------------------

const ROUTER_CONFIGS = {
  'react-router': {
    pkg: 'react-router-dom',
    version: '^7.0.0',
  },
  tanstack: {
    pkg: '@tanstack/react-router',
    version: '^1.0.0',
    devPkg: '@tanstack/router-devtools',
    devVersion: '^1.0.0',
  },
  none: { pkg: null, version: null },
};

// ---------------------------------------------------------------------------
// App.tsx generators per shell
// ---------------------------------------------------------------------------

function generateSidebarApp({ themeImport, iconImports, iconResolverBlock, iconResolverProp, router }) {
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
        <Heading level={2} size="lg">My App</Heading>
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

  // No router — inline sidebar with static pages
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

function generateTopNavApp({ themeImport, iconImports, iconResolverBlock, iconResolverProp, router }) {
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

  // No router
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
          <Heading level={2} size="md">My App</Heading>
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

function generateMinimalApp({ themeImport, iconImports, iconResolverBlock, iconResolverProp, router }) {
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

  // No router
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

const SHELL_GENERATORS = {
  sidebar: generateSidebarApp,
  'top-nav': generateTopNavApp,
  minimal: generateMinimalApp,
};

// ---------------------------------------------------------------------------
// Interactive setup
// ---------------------------------------------------------------------------

async function main() {
  console.log('\n  create-move-app\n');

  const onCancel = () => {
    console.log('\n  Cancelled.');
    process.exit(0);
  };

  // Flags
  const args = process.argv.slice(2);
  const localFlag = args.includes('--local');
  const argName = args.find((a) => !a.startsWith('--'));
  let projectName = argName;

  if (!projectName) {
    const { name } = await prompts({ type: 'text', name: 'name', message: 'Project name' }, { onCancel });
    projectName = name?.trim();
  }

  if (!projectName) {
    console.error('  Project name is required.');
    process.exit(1);
  }

  const { shell, theme, icons, router } = await prompts([
    {
      type: 'select',
      name: 'shell',
      message: 'Shell type',
      choices: [
        { title: 'Sidebar — dashboard, admin, SaaS', value: 'sidebar' },
        { title: 'Top nav — marketing, docs, blog', value: 'top-nav' },
        { title: 'Minimal — landing page, focused tool', value: 'minimal' },
      ],
      initial: 0,
    },
    {
      type: 'select',
      name: 'theme',
      message: 'Theme',
      choices: [
        { title: 'Light', value: 'light' },
        { title: 'Dark', value: 'dark' },
      ],
      initial: 0,
    },
    {
      type: 'select',
      name: 'icons',
      message: 'Icon library',
      choices: [
        { title: 'Lucide — popular, 1500+ icons', value: 'lucide' },
        { title: 'Heroicons — by Tailwind team', value: 'heroicons' },
        { title: 'None — add later', value: 'none' },
      ],
      initial: 0,
    },
    {
      type: 'select',
      name: 'router',
      message: 'Router',
      choices: [
        { title: 'React Router — most popular', value: 'react-router' },
        { title: 'TanStack Router — type-safe, modern', value: 'tanstack' },
        { title: 'None — add later', value: 'none' },
      ],
      initial: 2,
    },
  ], { onCancel });

  // -------------------------------------------------------------------------
  // Resolve project directory
  // -------------------------------------------------------------------------

  let projectDir = resolve(process.cwd(), projectName);

  while (existsSync(projectDir)) {
    const { action } = await prompts({
      type: 'select',
      name: 'action',
      message: `Directory "${projectName}" already exists`,
      choices: [
        { title: 'Overwrite', value: 'overwrite' },
        { title: 'Choose a different name', value: 'rename' },
        { title: 'Cancel', value: 'cancel' },
      ],
      initial: 1,
    }, { onCancel });

    if (action === 'cancel') process.exit(0);

    if (action === 'overwrite') {
      rmSync(projectDir, { recursive: true, force: true });
      break;
    }

    const { newName } = await prompts({
      type: 'text',
      name: 'newName',
      message: 'New project name',
    }, { onCancel });

    if (!newName?.trim()) {
      console.error('  Project name is required.');
      process.exit(1);
    }

    projectName = newName.trim();
    projectDir = resolve(process.cwd(), projectName);
  }

  console.log(`\n  Creating Move app in ${projectDir}...\n`);
  mkdirSync(projectDir, { recursive: true });

  // -------------------------------------------------------------------------
  // Package.json
  // -------------------------------------------------------------------------

  const movePackageDir = localFlag ? resolve(__dirname, '..', '..', 'move') : null;
  const moveDep = movePackageDir ? `file:${movePackageDir}` : '^0.1.0';

  if (localFlag) {
    console.log(`  Using local move package: ${movePackageDir}\n`);
  }

  const deps = {
    react: '^19.0.0',
    'react-dom': '^19.0.0',
    move: moveDep,
    animejs: '^4.0.0',
  };

  const devDeps = {
    '@types/react': '^19.0.0',
    '@types/react-dom': '^19.0.0',
    '@vitejs/plugin-react': '^4.0.0',
    typescript: '^5.6.0',
    vite: '^6.0.0',
  };

  const iconConfig = ICON_CONFIGS[icons];
  if (iconConfig.pkg) {
    deps[iconConfig.pkg] = iconConfig.version;
  }

  const routerConfig = ROUTER_CONFIGS[router];
  if (routerConfig.pkg) {
    deps[routerConfig.pkg] = routerConfig.version;
  }
  if (routerConfig.devPkg) {
    devDeps[routerConfig.devPkg] = routerConfig.devVersion;
  }

  const pkg = {
    name: projectName,
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc -b && vite build',
      preview: 'vite preview',
    },
    dependencies: deps,
    devDependencies: devDeps,
  };

  writeFileSync(join(projectDir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

  // -------------------------------------------------------------------------
  // Copy base template (index.html, tsconfig, vite.config, pages/, etc.)
  // -------------------------------------------------------------------------

  cpSync(join(templatesDir, 'base'), projectDir, { recursive: true });

  // -------------------------------------------------------------------------
  // Copy shell-specific files (e.g. components/AppSidebar.tsx)
  // -------------------------------------------------------------------------

  const shellDir = join(templatesDir, 'shells', shell);
  if (existsSync(shellDir)) {
    cpSync(shellDir, join(projectDir, 'src'), { recursive: true });
  }

  // Create empty components dir if shell didn't provide one
  const componentsDir = join(projectDir, 'src', 'components');
  if (!existsSync(componentsDir)) {
    mkdirSync(componentsDir, { recursive: true });
  }

  // -------------------------------------------------------------------------
  // Generate App.tsx
  // -------------------------------------------------------------------------

  const themeImport = theme === 'light' ? 'lightTheme' : 'darkTheme';
  const iconImports = iconConfig.imports ? `\n${iconConfig.imports}` : '';
  const iconResolverBlock = iconConfig.resolver ? `\n${iconConfig.resolver}\n` : '';
  const iconResolverProp = iconConfig.resolver ? ' iconResolver={iconResolver}' : '';

  const generate = SHELL_GENERATORS[shell];
  const appTsx = generate({ themeImport, iconImports, iconResolverBlock, iconResolverProp, router });
  writeFileSync(join(projectDir, 'src', 'App.tsx'), appTsx);

  // -------------------------------------------------------------------------
  // Install
  // -------------------------------------------------------------------------

  console.log('  Installing dependencies...\n');

  try {
    execSync('npm install', { cwd: projectDir, stdio: 'inherit' });
  } catch {
    console.log('\n  Failed to install dependencies. Run "npm install" manually.');
  }

  // -------------------------------------------------------------------------
  // Copy skills from installed move package
  // -------------------------------------------------------------------------

  const moveSkillsDir = join(projectDir, 'node_modules', 'move', 'skills', 'app');
  if (existsSync(moveSkillsDir)) {
    const agentsDir = join(projectDir, '.agents', 'skills');
    mkdirSync(agentsDir, { recursive: true });
    cpSync(moveSkillsDir, agentsDir, { recursive: true });

    const claudeDir = join(projectDir, '.claude', 'skills');
    mkdirSync(claudeDir, { recursive: true });
    cpSync(moveSkillsDir, claudeDir, { recursive: true });

    console.log('\n  Copied Move skills for AI assistance.');
  }

  // -------------------------------------------------------------------------
  // Done
  // -------------------------------------------------------------------------

  console.log(`
  Done! To get started:

    cd ${projectName}
    npm run dev
  `);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
