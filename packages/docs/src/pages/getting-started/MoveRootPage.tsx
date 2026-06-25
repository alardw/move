import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code, Table } from 'move';
import { CodeBlock, Section, TocRail, type TocItem } from '../../components';

/**
 * Getting started → MoveRoot. Practical setup page: how to wrap a
 * Move app, what props MoveRoot takes, common gotchas (icons,
 * theme switching, slot props). Audience is "I just installed Move,
 * what now?" — code-heavy, prose-light.
 */

const TAGLINE =
  'The single wrapper that bootstraps a Move application. Wires theme tokens, the tooltip context, your icon library, and global slot props in one place.';

const BADGES = [
  { icon: 'rocket', label: 'Setup' },
  { icon: 'box', label: 'One wrapper' },
  { icon: 'palette', label: 'Themes + icons + slot props' },
];

const TOC: TocItem[] = [
  { href: '#overview', label: 'Overview' },
  { href: '#minimal-example', label: 'Minimal example' },
  { href: '#what-it-composes', label: 'What it composes' },
  { href: '#props', label: 'Props' },
  { href: '#wiring-icons', label: 'Wiring icons' },
  { href: '#global-slot-props', label: 'Global slot props' },
  { href: '#theme-switching', label: 'Theme switching' },
  { href: '#ssr', label: 'SSR / hydration' },
  { href: '#standalone', label: 'Components without MoveRoot' },
  { href: '#next-steps', label: 'Next steps' },
];

const MINIMAL = `import { MoveRoot, lightTheme } from 'move';
import 'move/styles.css';

export function App() {
  return (
    <MoveRoot theme={lightTheme}>
      <YourApp />
    </MoveRoot>
  );
}
`;

const ICONS_LUCIDE = `import * as LucideIcons from 'lucide-react';
import { MoveRoot, lightTheme } from 'move';

function toPascalCase(s: string) {
  return s.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
}

const iconResolver = (name: string) => {
  const icons = LucideIcons as Record<string, unknown>;
  return (icons[toPascalCase(name)] ?? null) as React.ComponentType | null;
};

<MoveRoot theme={lightTheme} iconResolver={iconResolver}>
  <App />
</MoveRoot>
`;

const SLOT_PROPS_EXAMPLE = `<MoveRoot
  theme={lightTheme}
  slotProps={{
    Card: {
      root: { className: 'app-card' },
    },
    Button: {
      root: { 'data-analytics': 'btn' },
    },
  }}
>
  <App />
</MoveRoot>
`;

const THEME_SWITCH = `import * as React from 'react';
import { MoveRoot, lightTheme, darkTheme } from 'move';

export function App() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  return (
    <MoveRoot theme={mode === 'light' ? lightTheme : darkTheme}>
      <button onClick={() => setMode((m) => m === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      <YourApp />
    </MoveRoot>
  );
}
`;

interface PropRow {
  name: string;
  type: string;
  required: boolean;
  description: React.ReactNode;
}

const PROPS: PropRow[] = [
  { name: 'children', type: 'React.ReactNode', required: true, description: 'Your application tree.' },
  { name: 'theme', type: 'Theme', required: false, description: <>Theme tokens. Pass <Code>lightTheme</Code> or <Code>darkTheme</Code> from <Code>'move'</Code>, or build a custom theme. Defaults to <Code>darkTheme</Code>.</> },
  { name: 'iconResolver', type: '(name: string) => React.ComponentType | null', required: false, description: <>Resolves <Code>{`<Icon name="…" />`}</Code> against your icon library. Without it, Move's <Code>Icon</Code> component renders nothing.</> },
  { name: 'slotProps', type: 'GlobalSlotProps', required: false, description: <>Per-slot prop overrides applied to every Move component, keyed by component name. Per-instance <Code>sp</Code> props override these.</> },
];

export function MoveRootPage() {
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
            <Breadcrumb.Page>MoveRoot</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">MoveRoot</Heading>
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
          title="What MoveRoot is"
          lede="One wrapper at the top of your tree. With it, every Move component below gets access to theme tokens, the tooltip context, and your icon library."
        >
          <Stack gap="sm">
            <Text>
              MoveRoot composes the providers Move needs into a single component, applies the theme's background and font tokens to <Code>{`<html>`}</Code> and <Code>{`<body>`}</Code> so the page itself participates in theming, and exposes three optional levers: <Code>theme</Code>, <Code>iconResolver</Code>, and <Code>slotProps</Code>.
            </Text>
            <Text>
              You wrap your app once. You don't render multiple MoveRoots, and you don't typically need to think about it again.
            </Text>
          </Stack>
        </Section>

        <Section
          id="minimal-example"
          title="Minimal example"
          lede="The smallest amount of code that gets a Move app rendering correctly."
        >
          <CodeBlock code={MINIMAL} language="tsx" />
          <Text>
            <Code>'move/styles.css'</Code> brings in the design tokens and component CSS. Without it, components render unstyled.
          </Text>
        </Section>

        <Section
          id="what-it-composes"
          title="What it composes"
          lede="MoveRoot is just a small composition of providers. Knowing what's inside helps when you debug or want to use only some pieces."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Provider</Table.Head>
                <Table.Head>What it does</Table.Head>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Always on?</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell><Code>ThemeProvider</Code></Table.Cell>
                <Table.Cell><Text size="sm">Applies the theme's CSS custom properties to <Code>:root</Code> so all components resolve token values.</Text></Table.Cell>
                <Table.Cell><Badge variant="soft">always</Badge></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><Code>TooltipProvider</Code></Table.Cell>
                <Table.Cell><Text size="sm">Single Radix tooltip context shared across the app. Without it, every Tooltip would create its own.</Text></Table.Cell>
                <Table.Cell><Badge variant="soft">always</Badge></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><Code>IconProvider</Code></Table.Cell>
                <Table.Cell><Text size="sm">Wires Move's <Code>Icon</Code> component to your icon resolver.</Text></Table.Cell>
                <Table.Cell><Badge variant="outline">if iconResolver passed</Badge></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><Code>MoveProvider</Code></Table.Cell>
                <Table.Cell><Text size="sm">Carries global slot-prop overrides applied across every Move component.</Text></Table.Cell>
                <Table.Cell><Badge variant="outline">if slotProps passed</Badge></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Section>

        <Section id="props" title="Props">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Prop</Table.Head>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Type</Table.Head>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Required</Table.Head>
                <Table.Head>Description</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {PROPS.map((p) => (
                <Table.Row key={p.name}>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><Code>{p.name}</Code></Table.Cell>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><Code>{p.type}</Code></Table.Cell>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                    <Badge variant={p.required ? 'soft' : 'outline'}>{p.required ? 'required' : 'optional'}</Badge>
                  </Table.Cell>
                  <Table.Cell><Text size="sm">{p.description}</Text></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>

        <Section
          id="wiring-icons"
          title="Wiring icons"
          lede="Without iconResolver, Move's <Icon /> renders nothing. The most common setup is Lucide."
        >
          <CodeBlock code={ICONS_LUCIDE} language="tsx" />
          <Text>
            The resolver takes a string name and returns a React component or <Code>null</Code>. Move uses kebab-case names (<Code>'chevron-right'</Code>, <Code>'sparkles'</Code>); the helper above converts them to the PascalCase Lucide expects. Any icon library works the same way — supply your own mapper.
          </Text>
        </Section>

        <Section
          id="global-slot-props"
          title="Global slot props"
          lede="Override props on a specific slot of every instance of a component. Useful for app-wide tweaks without per-call repetition."
        >
          <CodeBlock code={SLOT_PROPS_EXAMPLE} language="tsx" />
          <Stack gap="xs">
            <Text size="sm">• Keyed by component name (<Code>Card</Code>, <Code>Button</Code>, …) and then by slot name (<Code>root</Code>, <Code>header</Code>, …).</Text>
            <Text size="sm">• Per-instance <Code>sp</Code> props on individual components override the global ones.</Text>
            <Text size="sm">• See <RouterLink to="/customize">Make it your own</RouterLink> for the full slot-props mental model.</Text>
          </Stack>
        </Section>

        <Section
          id="theme-switching"
          title="Theme switching"
          lede="Swap the theme prop. Tokens update, html/body styles update, every component re-resolves."
        >
          <CodeBlock code={THEME_SWITCH} language="tsx" />
          <Text>
            Pair this with <Code>prefers-color-scheme</Code> media-query state for an automatic light/dark response, or persist the user's choice in <Code>localStorage</Code>.
          </Text>
        </Section>

        <Section
          id="ssr"
          title="SSR / hydration"
          lede="MoveRoot is a client component. App-router frameworks need a 'use client' boundary."
        >
          <Text>
            MoveRoot ships with <Code>'use client'</Code> already declared. In Next.js app router or similar SSR setups, place MoveRoot in a client component (most apps do this in the root layout). The theme tokens applied to <Code>{`<html>`}</Code> happen via <Code>useLayoutEffect</Code> on mount, so during SSR the page may flash the browser default until hydration. To avoid the flash, set background/foreground colours on <Code>{`<html>`}</Code> in a global CSS file using the same token values, then MoveRoot's effect is a no-op visually.
          </Text>
        </Section>

        <Section
          id="standalone"
          title="Components without MoveRoot"
          lede="Some components technically work outside MoveRoot, but the experience is degraded."
        >
          <Stack gap="xs">
            <Text size="sm">• <Code>Tooltip</Code>'s simple form (<Code>{`<Tooltip label="..." />`}</Code>) ships its own Tooltip.Provider as a fallback so it works standalone.</Text>
            <Text size="sm">• Components that use <Code>Icon</Code> render nothing for icons without an iconResolver.</Text>
            <Text size="sm">• Components that use design tokens fall back to the CSS variable defaults declared in <Code>'move/styles.css'</Code> — they render but don't respond to theme switches.</Text>
          </Stack>
          <Text>
            Recommendation: always wrap. The cost is one component at the root; the benefit is consistent theming, icons, and slot props across the entire tree.
          </Text>
        </Section>

        <Section id="next-steps" title="Next steps">
          <Stack gap="xs">
            <Text size="sm">• <RouterLink to="/customize">Make it your own</RouterLink> — what's actually in a theme.</Text>
            <Text size="sm">• <RouterLink to="/customize">Make it your own</RouterLink> — palette + per-component color tokens.</Text>
            <Text size="sm">• <RouterLink to="/customize">Make it your own</RouterLink> — global vs per-instance, the full mental model.</Text>
            <Text size="sm">• <RouterLink to="/components">Components</RouterLink> — the catalog, now that you're set up.</Text>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
