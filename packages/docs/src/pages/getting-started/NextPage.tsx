import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code, List, Alert } from 'move';
import { CodeBlock, Section, TocRail, type TocItem } from '../../components';

/**
 * Getting started → Next.js. How to set up Move in a Next.js app —
 * App Router and Pages Router both covered. Audience is "I'm using
 * Next, how do I bring Move in correctly without flashing?".
 */

const TAGLINE =
  "Next-specific integration only — App Router structure, FOUC mitigation, client boundaries, cookie-driven theme. For MoveRoot's API itself, see the MoveRoot page.";

const BADGES = [
  { icon: 'rocket', label: 'Setup' },
  { icon: 'server', label: 'App Router + Pages Router' },
  { icon: 'sparkles', label: 'No FOUC' },
];

const TOC: TocItem[] = [
  { href: '#overview', label: 'Overview' },
  { href: '#app-router', label: 'App Router (13+)' },
  { href: '#pages-router', label: 'Pages Router' },
  { href: '#fouc', label: 'Avoiding theme FOUC' },
  { href: '#client-boundaries', label: 'Client boundaries' },
  { href: '#cookies', label: 'Theme persistence' },
  { href: '#next-steps', label: 'Next steps' },
];

const APP_LAYOUT = `// app/layout.tsx — Server Component
import 'move/styles.css';
import { MoveProviders } from './move-providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MoveProviders>{children}</MoveProviders>
      </body>
    </html>
  );
}
`;

const APP_PROVIDERS = `// app/move-providers.tsx — Client Component
'use client';

import { MoveRoot, lightTheme } from 'move';
import { iconResolver } from './icon-resolver';   // see MoveRoot → Wiring icons

export function MoveProviders({ children }: { children: React.ReactNode }) {
  return (
    <MoveRoot theme={lightTheme} iconResolver={iconResolver}>
      {children}
    </MoveRoot>
  );
}
`;

const PAGES_APP = `// pages/_app.tsx
import 'move/styles.css';
import type { AppProps } from 'next/app';
import { MoveRoot, lightTheme } from 'move';
import { iconResolver } from '../icon-resolver';   // see MoveRoot → Wiring icons

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MoveRoot theme={lightTheme} iconResolver={iconResolver}>
      <Component {...pageProps} />
    </MoveRoot>
  );
}
`;

const FOUC_GLOBAL_CSS = `/* app/globals.css — imported once in app/layout.tsx */
html {
  background: var(--move-bg-base);
  color: var(--move-fg-base);
  font-family: var(--move-font-body);
}
`;

const COOKIE_LAYOUT = `// app/layout.tsx — Server Component
import 'move/styles.css';
import { cookies } from 'next/headers';
import { MoveProviders } from './move-providers';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const mode = (cookieStore.get('theme')?.value ?? 'light') as 'light' | 'dark';

  return (
    <html
      lang="en"
      data-theme={mode}
      style={{
        background: mode === 'dark' ? '#0b0b0d' : '#ffffff',
        colorScheme: mode,
      }}
    >
      <body>
        <MoveProviders mode={mode}>{children}</MoveProviders>
      </body>
    </html>
  );
}
`;

const COOKIE_PROVIDERS = `// app/move-providers.tsx — Client Component
'use client';

import { MoveRoot, lightTheme, darkTheme } from 'move';
import { iconResolver } from './icon-resolver';

export function MoveProviders({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: 'light' | 'dark';
}) {
  return (
    <MoveRoot theme={mode === 'dark' ? darkTheme : lightTheme} iconResolver={iconResolver}>
      {children}
    </MoveRoot>
  );
}
`;

export function NextPage() {
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
            <Breadcrumb.Page>Next.js</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Next.js</Heading>
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
          lede="MoveRoot is a client component (it ships with 'use client'), so it runs only after hydration. Two things to handle: where to render MoveRoot, and how to avoid the theme flash on first paint."
        >
          <List.Root>
            <List.Item>
              <List.Leading><Icon name="layout-template" /></List.Leading>
              <List.Content>
                <List.Title>App Router</List.Title>
                <List.Description>Move's recommended setup. Render a client wrapper from <Code>app/layout.tsx</Code>.</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Leading><Icon name="file-code" /></List.Leading>
              <List.Content>
                <List.Title>Pages Router</List.Title>
                <List.Description>Older but still supported. <Code>pages/_app.tsx</Code> takes the wrapper.</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Leading><Icon name="zap" /></List.Leading>
              <List.Content>
                <List.Title>Theme FOUC</List.Title>
                <List.Description>MoveRoot applies html/body styles after mount. Set the same tokens via global CSS, or read a theme cookie server-side, to keep the first paint clean.</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Leading><Icon name="git-branch" /></List.Leading>
              <List.Content>
                <List.Title>Client boundaries</List.Title>
                <List.Description>Most interactive Move components need <Code>'use client'</Code> on their parent. Plain content components (Text, Heading, Card) work in Server Components.</List.Description>
              </List.Content>
            </List.Item>
          </List.Root>
          <Text>
            For everything about MoveRoot itself — props, icon resolver, theme switching, global slot props — see <RouterLink to="/getting-started/move-root">MoveRoot</RouterLink>. This page only covers what's Next-specific.
          </Text>
        </Section>

        <Section
          id="app-router"
          title="App Router (Next 13+)"
          lede="Two files: a Server Component layout and a small Client Component that hosts MoveRoot."
        >
          <Stack gap="sm">
            <Text>
              <strong>1. Root layout (Server Component).</strong> Imports the CSS and renders the client wrapper.
            </Text>
            <CodeBlock code={APP_LAYOUT} language="tsx" />
            <Text>
              <strong>2. Move providers (Client Component).</strong> Anything passing through MoveRoot lives here.
            </Text>
            <CodeBlock code={APP_PROVIDERS} language="tsx" />
            <Text>
              The <Code>'use client'</Code> directive on the providers file is what lets MoveRoot mount on the client. The layout itself stays a Server Component, so the rest of the layout (metadata, fonts, ...) keeps the SSR benefits.
            </Text>
          </Stack>
        </Section>

        <Section
          id="pages-router"
          title="Pages Router"
          lede="One file: pages/_app.tsx. No client/server split to worry about — the whole app renders as one bundle."
        >
          <CodeBlock code={PAGES_APP} language="tsx" />
          <Text>
            Same MoveRoot, same icon resolver. No <Code>'use client'</Code> needed because Pages Router doesn't have Server Components.
          </Text>
        </Section>

        <Section
          id="fouc"
          title="Avoiding theme FOUC"
          lede="MoveRoot sets html/body tokens via useLayoutEffect, which only runs on the client. Without help, the first paint shows the browser default colour, then snaps to the theme on hydration."
        >
          <Stack gap="sm">
            <Text>
              <strong>Option A — global CSS (simplest).</strong> Mirror the token values on <Code>{`<html>`}</Code> from a regular CSS file imported in your layout. Works for single-theme apps.
            </Text>
            <CodeBlock code={FOUC_GLOBAL_CSS} language="css" />
            <Text>
              The CSS variables are defined in <Code>'move/styles.css'</Code>, so referencing them on <Code>{`<html>`}</Code> works as soon as that import lands. MoveRoot's effect on mount becomes a no-op visually.
            </Text>
            <Text>
              <strong>Option B — cookie-driven theme</strong> (covered in <RouterLink to="#cookies">Theme persistence</RouterLink>). Necessary if your app supports light/dark switching and you don't want a flash on every navigation.
            </Text>
          </Stack>
        </Section>

        <Section
          id="client-boundaries"
          title="Client boundaries"
          lede="Move components fall into two camps: interactive (need 'use client') and presentational (work in Server Components)."
        >
          <Stack gap="sm">
            <Alert variant="info" title="'use client' doesn't disable SSR">
              Marked components still render on the server and ship as HTML in the initial response. The directive only signals that the component needs JS at hydration time — common for anything with state, effects, or interactivity. Server Components (which ship zero JS) are a separate, Next-specific category; most interactive Move components can't be Server Components, but they SSR fine.
            </Alert>
            <Text>
              Interactive — animations, focus management, controlled state, popups. Anything in those families needs the parent to be a Client Component:
            </Text>
            <Stack gap="xs">
              <Text size="sm">• Dialog, Drawer, Popover, Dropdown, Tooltip, Toast</Text>
              <Text size="sm">• InputText, Select, Checkbox, Switch, Calendar, …</Text>
              <Text size="sm">• Button, ToggleGroup, Tabs, Accordion, Collapsible</Text>
              <Text size="sm">• Carousel, ImageGroup, AudioPlayer, VideoPlayer</Text>
            </Stack>
            <Text>
              Presentational — these work in Server Components without a directive:
            </Text>
            <Stack gap="xs">
              <Text size="sm">• Text, Heading, Prose, Code, Label</Text>
              <Text size="sm">• Stack, Grid, Card, Divider</Text>
              <Text size="sm">• Avatar, Badge, Skeleton, Image (when not interactive)</Text>
            </Stack>
            <Text>
              When in doubt, mark the page-level component <Code>'use client'</Code>; the SSR loss is small for most app pages.
            </Text>
          </Stack>
        </Section>

        <Section
          id="cookies"
          title="Theme persistence (advanced)"
          lede="Store the user's theme choice in a cookie. The Server Component reads it, sets the right background on <html> during SSR, and passes the mode to the client wrapper. No flash on any page."
        >
          <Stack gap="sm">
            <Text>
              <strong>1. Server Component layout.</strong> Read the cookie, set the correct background colour on <Code>{`<html>`}</Code> inline so the first byte already paints the right theme.
            </Text>
            <CodeBlock code={COOKIE_LAYOUT} language="tsx" />
            <Text>
              <strong>2. Client wrapper.</strong> Receives the mode, passes the matching theme to MoveRoot.
            </Text>
            <CodeBlock code={COOKIE_PROVIDERS} language="tsx" />
            <Text>
              When the user toggles theme, write the cookie (<Code>document.cookie = 'theme=dark; path=/'</Code>) and trigger a client-side state update for the live theme switch. Subsequent SSR responses honour the cookie.
            </Text>
          </Stack>
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
