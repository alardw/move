import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code, List } from 'move';
import { CodeBlock, Section, TocRail, type TocItem } from '../../components';

/**
 * Getting started → Vite. Vite-specific integration only — the
 * MoveRoot API, icon resolver, theme switching, and slot props all
 * live on the MoveRoot page. This page covers what's unique to Vite:
 * scaffold, file structure, vite.config, and routing.
 */

const TAGLINE =
  "Vite-specific setup. For MoveRoot's API, icon resolver, themes, and slot props, see the MoveRoot page; this page covers only what's different in a Vite app.";

const BADGES = [
  { icon: 'rocket', label: 'Setup' },
  { icon: 'zap', label: 'Vite-first' },
  { icon: 'box', label: 'SPA' },
];

const TOC: TocItem[] = [
  { href: '#overview', label: 'Overview' },
  { href: '#scaffold', label: 'Scaffold with create-move' },
  { href: '#manual', label: 'Manual setup' },
  { href: '#config', label: 'Vite config' },
  { href: '#routing', label: 'Routing' },
  { href: '#next-steps', label: 'Next steps' },
];

const SCAFFOLD = `npm create move@latest my-app
cd my-app
npm run dev
`;

const MANUAL_INSTALL = `npm install move animejs
`;

const MAIN_TSX = `// src/main.tsx
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { MoveRoot, lightTheme } from 'move';
import { App } from './App';
import { iconResolver } from './icon-resolver';   // see MoveRoot → Wiring icons
import 'move/styles.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MoveRoot theme={lightTheme} iconResolver={iconResolver}>
      <App />
    </MoveRoot>
  </React.StrictMode>,
);
`;

const VITE_CONFIG = `// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;

const ROUTING_EXAMPLE = `// src/main.tsx
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MoveRoot theme={lightTheme} iconResolver={iconResolver}>
        <App />
      </MoveRoot>
    </BrowserRouter>
  </React.StrictMode>,
);
`;

export function VitePage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="overview">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/getting-started">Getting started</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Vite</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Vite</Heading>
          <Text color="muted" size="lg">{TAGLINE}</Text>
          <Stack direction="row" gap="xs" wrap>
            {BADGES.map((b) => (
              <Badge key={b.label} variant="soft">
                <Icon name={b.icon} />
                {b.label}
              </Badge>
            ))}
          </Stack>
        </Stack>

        <Section
          id="overview"
          title="Overview"
          lede="Two paths: scaffold a new app with create-move, or add Move to an existing Vite project."
        >
          <List.Root>
            <List.Item>
              <List.Leading><Icon name="rocket" /></List.Leading>
              <List.Content>
                <List.Title>Scaffold</List.Title>
                <List.Description><Code>npm create move@latest</Code> bootstraps a Vite + React + Move app with sensible defaults.</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Leading><Icon name="settings" /></List.Leading>
              <List.Content>
                <List.Title>Manual setup</List.Title>
                <List.Description>Add Move to an existing Vite app with one install and MoveRoot in <Code>main.tsx</Code>.</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Leading><Icon name="map" /></List.Leading>
              <List.Content>
                <List.Title>Routing</List.Title>
                <List.Description>Move pairs cleanly with react-router. Mount the router outside or inside MoveRoot.</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Leading><Icon name="zap" /></List.Leading>
              <List.Content>
                <List.Title>No SSR concerns</List.Title>
                <List.Description>Vite SPAs mount React before first paint, so theme tokens land before anything renders. None of the FOUC mitigations the Next page covers apply here.</List.Description>
              </List.Content>
            </List.Item>
          </List.Root>
          <Text>
            For everything about MoveRoot itself — props, icon resolver, theme switching, global slot props — see <RouterLink to="/getting-started/move-root">MoveRoot</RouterLink>. This page only covers what's Vite-specific.
          </Text>
        </Section>

        <Section
          id="scaffold"
          title="Scaffold with create-move"
          lede="The fastest way to start. One command, zero choices."
        >
          <CodeBlock code={SCAFFOLD} language="bash" />
          <Text>
            Ships with: MoveRoot wired in <Code>src/main.tsx</Code>, theme + icon resolver pre-configured, a sidebar shell, react-router set up with placeholder routes, and the <Code>.agents/skills</Code> folder so AI tools can generate components into the project.
          </Text>
        </Section>

        <Section
          id="manual"
          title="Manual setup"
          lede="Three steps for an existing Vite app: install, wire, render."
        >
          <Stack gap="sm">
            <Text><strong>1. Install dependencies.</strong></Text>
            <CodeBlock code={MANUAL_INSTALL} language="bash" />
            <Text>
              <Code>animejs</Code> is a required peer for Move's animation engine. Icons are bring-your-own — point the resolver at whatever your app already uses (see <RouterLink to="/getting-started/move-root#wiring-icons">MoveRoot → Wiring icons</RouterLink>); if you don't have an icon set yet, <Code>npm install lucide-react</Code>.
            </Text>
            <Text><strong>2. Wire MoveRoot in <Code>src/main.tsx</Code>.</strong></Text>
            <CodeBlock code={MAIN_TSX} language="tsx" />
            <Text>
              The <Code>'move/styles.css'</Code> import is required — without it, components render unstyled. Extract the icon resolver to its own file (e.g. <Code>src/icon-resolver.ts</Code>) so it stays reusable.
            </Text>
            <Text><strong>3. Render Move components in <Code>App.tsx</Code>.</strong> Anything from the <RouterLink to="/components">component catalog</RouterLink> works.</Text>
          </Stack>
        </Section>

        <Section
          id="config"
          title="Vite config"
          lede="Nothing Move-specific. The standard React plugin is all you need."
        >
          <CodeBlock code={VITE_CONFIG} language="ts" />
          <Text>
            Move ships pre-built with no Vite-side compilation needed. CSS imports work via Vite's built-in handling. No PostCSS, Tailwind, or extra plugin required.
          </Text>
        </Section>

        <Section
          id="routing"
          title="Routing"
          lede="react-router is the standard pairing. BrowserRouter can sit outside or inside MoveRoot — either order works."
        >
          <CodeBlock code={ROUTING_EXAMPLE} language="tsx" />
          <Text>
            Move components like <Code>Sidebar.NavItem</Code>, <Code>Breadcrumb.Link</Code>, and <Code>List.Item</Code> support <Code>asChild</Code> so you can wrap a <Code>NavLink</Code> from react-router and keep Move's styling + behaviour while delegating routing.
          </Text>
        </Section>

        <Section id="next-steps" title="Next steps">
          <Stack gap="xs">
            <Text size="sm">• <RouterLink to="/getting-started/move-root">MoveRoot</RouterLink> — the wrapper's full API.</Text>
            <Text size="sm">• <RouterLink to="/components">Components</RouterLink> — the catalog.</Text>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
