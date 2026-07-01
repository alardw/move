import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge } from 'move';
import {
  CodeBlock,
  HighlightList,
  type HighlightItem,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

/**
 * Installation walkthrough — modeled on ComponentDocPage so the
 * visual language matches the rest of the docs (breadcrumb → header
 * → highlights → stacked code sections → TOC rail on the right).
 */

const TAGLINE =
  'Four small steps, about two minutes. You’ll be rendering a real Move component by the end of it.';

const BADGES = [
  { icon: 'rocket', label: 'Getting started' },
  { icon: 'package', label: 'npm / pnpm / yarn' },
  { icon: 'timer', label: '~2 minutes' },
];

const HIGHLIGHTS: HighlightItem[] = [
  {
    icon: 'package',
    text: 'One dependency. No peer-dep Tetris, no companion CSS framework — Move ships its own tokens and animations.',
  },
  {
    icon: 'rabbit',
    text: 'MoveRoot sets up the theme, icon resolver, and animation engine in a single wrapper. Drop it once at the top of the tree and forget about it.',
  },
  {
    icon: 'type',
    text: 'Lucide is the recommended icon pack, but the resolver takes any function — bring your own SVGs, emoji, or a trained homing pigeon that returns JSX.',
  },
];

const TOC: TocItem[] = [
  { href: '#installation', label: 'Installation' },
  { href: '#highlights', label: 'Highlights' },
  { href: '#install-the-package', label: '1. Install the package' },
  { href: '#add-the-styles', label: '2. Add the styles' },
  { href: '#wrap-your-app', label: '3. Wrap your app' },
  { href: '#render-a-component', label: '4. Render a component' },
  { href: '#next-steps', label: 'Next steps' },
];

export function InstallationPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="installation">
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
            <Breadcrumb.Page>Installation</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Installation</Heading>
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

        <Section id="highlights" title="Highlights">
          <HighlightList items={HIGHLIGHTS} />
        </Section>

        <Section
          id="install-the-package"
          title="1. Install the package"
          lede="Pick the package manager you already opened without thinking."
        >
          <CodeBlock language="bash" code={`npm install move
# or
pnpm add move
# or
yarn add move`} />
        </Section>

        <Section
          id="add-the-styles"
          title="2. Add the styles"
          lede="Once, at the top of your app entry. After this import you never have to think about Move CSS again."
        >
          <CodeBlock language="ts" code={`// main.tsx (Vite) or layout.tsx (Next.js app router)
import 'move/styles.css';`} />
        </Section>

        <Section
          id="wrap-your-app"
          title="3. Wrap your app with MoveRoot"
          lede="MoveRoot sets up the theme, icon resolver, and animation engine. Do it once at the top of your tree — anything inside it can freely reach for any Move component."
        >
          <CodeBlock
            language="tsx"
            code={`import { MoveRoot, lightTheme } from 'move';
import * as LucideIcons from 'lucide-react';

const iconResolver = (name: string) => {
  const pascal = name.split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
  return (LucideIcons as Record<string, unknown>)[pascal] ?? null;
};

export function App() {
  return (
    <MoveRoot theme={lightTheme} iconResolver={iconResolver}>
      {/* the rest of your app */}
    </MoveRoot>
  );
}`}
          />
          <Text color="muted" size="sm">
            The icon resolver takes a kebab-case name and returns a React
            component — that’s the whole contract. Swap Lucide for any pack
            you like (Tabler, Phosphor, your own SVG map) without touching
            a single component call site.
          </Text>
        </Section>

        <Section
          id="render-a-component"
          title="4. Render a component"
          lede="Proof of life. If this renders, you’re done."
        >
          <CodeBlock
            language="tsx"
            code={`import { Button, Icon } from 'move';

export function Hello() {
  return (
    <Button onClick={() => console.log('ship it')}>
      <Icon name="rocket" />
      Ship it
    </Button>
  );
}`}
          />
        </Section>

        <Section
          id="next-steps"
          title="Next steps"
          lede="You have the machine running. Pick a direction."
        >
          <HighlightList
            items={[
              {
                icon: 'blocks',
                text: (
                  <>
                    Browse the <RouterLink to="/components">Components</RouterLink>{' '}
                    section — every component ships with live samples and a copyable code snippet.
                  </>
                ),
              },
              {
                icon: 'palette',
                text: (
                  <>
                    Set up a custom theme — see <RouterLink to="/customize">Make it your own</RouterLink>{' '}
                    to override colors, spacing, and typography at the root.
                  </>
                ),
              },
              {
                icon: 'sparkles',
                text: (
                  <>
                    Peek at the <RouterLink to="/animation">Animation system</RouterLink> — all
                    Move components animate through it, and you can drive your own
                    with the same primitives.
                  </>
                ),
              },
              {
                icon: 'shield-check',
                text: (
                  <>
                    Build your screens as compositions with{' '}
                    <RouterLink to="/ai/skills">/app-compose</RouterLink>, and keep them true to the
                    system with the <RouterLink to="/core-concepts/conformance-model">conformance
                    model</RouterLink> — one command plus a ratchet that only tightens.
                  </>
                ),
              },
            ]}
          />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
