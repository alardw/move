import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code, Table } from 'move';
import {
  CodeBlock,
  HighlightList,
  type HighlightItem,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

const BADGES = [
  { icon: 'shapes', label: 'Bring your own icons' },
  { icon: 'plug', label: 'One resolver' },
];

const PRINCIPLE: HighlightItem[] = [
  {
    icon: 'tag',
    text: (
      <>
        <Code>{'<Icon name="chevron-down" />'}</Code> imports nothing itself. It
        asks the resolver you gave <Code>MoveRoot</Code> for whatever a name
        should render.
      </>
    ),
  },
  {
    icon: 'function-square',
    text: (
      <>
        A resolver is a plain function: <Code>{'(name) => Component | ReactNode | null'}</Code>.
        Return a component, return raw SVG, or return <Code>null</Code> to fall through.
      </>
    ),
  },
  {
    icon: 'shield-check',
    text: 'Move tries your resolver first, then a small set of built-in essential icons — so a missing name degrades gracefully instead of rendering an empty box.',
  },
  {
    icon: 'replace',
    text: 'Switch icon libraries by switching the resolver. Not a single <Icon> in your app changes.',
  },
];

const WIRING = `import { MoveRoot } from 'move';
import { iconResolver } from './icons';

export function App() {
  return (
    <MoveRoot iconResolver={iconResolver}>
      {/* every <Icon name="…" /> below now resolves through iconResolver */}
    </MoveRoot>
  );
}`;

const LUCIDE = `import * as Lucide from 'lucide-react';
import type { ComponentType } from 'react';

// kebab name → PascalCase export: "chevron-down" → Lucide.ChevronDown
const toPascal = (s: string) =>
  s.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());

export const iconResolver = (name: string) =>
  ((Lucide as Record<string, unknown>)[toPascal(name)] as ComponentType) ?? null;`;

const MAP = `import { HomeIcon, Cog6ToothIcon, BellIcon } from '@heroicons/react/24/outline';
import type { ComponentType } from 'react';

// Import only the icons you use, then map your names to them.
const icons: Record<string, ComponentType> = {
  home: HomeIcon,
  settings: Cog6ToothIcon,
  bell: BellIcon,
};

export const iconResolver = (name: string) => icons[name] ?? null;`;

const CUSTOM = `// Your own SVGs as components (SVGR, or Vite's ?react suffix)
import Logo from './icons/logo.svg?react';
import type { ComponentType } from 'react';

const icons: Record<string, ComponentType> = { logo: Logo };

// A resolver can also return raw JSX, not just a component:
export const iconResolver = (name: string) =>
  icons[name] ??
  (name === 'dot'
    ? <svg viewBox="0 0 8 8" width="1em" height="1em"><circle cx="4" cy="4" r="4" fill="currentColor" /></svg>
    : null);`;

const LAZY = `import { lazy } from 'react';

// Code-split: only the icons actually rendered get fetched. Returning a lazy
// component is fine — render Move's tree inside a <Suspense> boundary.
export const iconResolver = (name: string) =>
  lazy(() => import(\`./icons/\${name}.tsx\`));`;

// Which built-in name each component renders by default. Derived from the
// component source; map any of these to re-skin those components.
const INTERNAL_ICON_USAGE: { name: string; usedBy: string }[] = [
  { name: 'calendar', usedBy: 'DatePicker' },
  { name: 'captions', usedBy: 'AudioPlayer, VideoPlayer' },
  { name: 'check', usedBy: 'Autocomplete, Checkbox, Dropdown, Stepper' },
  { name: 'chevron-down', usedBy: 'Accordion, Autocomplete, Carousel, Collapsible, NumberInput, Select' },
  { name: 'chevron-left', usedBy: 'CalendarView, Carousel, Pagination, media players' },
  { name: 'chevron-right', usedBy: 'Breadcrumb, CalendarView, Carousel, Pagination, media players' },
  { name: 'chevron-up', usedBy: 'Carousel, NumberInput' },
  { name: 'circle-check', usedBy: 'Alert, FileUpload, Toast' },
  { name: 'circle-x', usedBy: 'Alert, Toast' },
  { name: 'eye', usedBy: 'Password' },
  { name: 'eye-off', usedBy: 'Password' },
  { name: 'file', usedBy: 'FileUpload' },
  { name: 'image-off', usedBy: 'Image' },
  { name: 'info', usedBy: 'Alert, Badge, Toast' },
  { name: 'maximize', usedBy: 'VideoPlayer' },
  { name: 'minimize', usedBy: 'VideoPlayer' },
  { name: 'pause', usedBy: 'AudioPlayer, VideoPlayer' },
  { name: 'pipette', usedBy: 'ColorInput' },
  { name: 'play', usedBy: 'AudioPlayer, VideoPlayer' },
  { name: 'settings', usedBy: 'AudioPlayer, VideoPlayer' },
  { name: 'triangle-alert', usedBy: 'Alert, Toast' },
  { name: 'volume-x', usedBy: 'AudioPlayer, VideoPlayer' },
  { name: 'x', usedBy: 'Alert, Autocomplete, Dialog, Drawer, FileUpload, Popover, Sidebar, Toast' },
];

const OVERRIDE_ALL = `import * as Phosphor from '@phosphor-icons/react';
import type { ComponentType } from 'react';

const toPascal = (s: string) =>
  s.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());

// Map Move's internal vocabulary to your library once. Because the resolver
// runs before Move's built-ins, this re-skins every component at once.
const aliases: Record<string, ComponentType> = {
  'chevron-down': Phosphor.CaretDown,
  'chevron-up': Phosphor.CaretUp,
  'chevron-left': Phosphor.CaretLeft,
  'chevron-right': Phosphor.CaretRight,
  check: Phosphor.Check,
  'circle-check': Phosphor.CheckCircle,
  'circle-x': Phosphor.XCircle,
  'eye-off': Phosphor.EyeSlash,
  // …the rest of the vocabulary → your equivalents
};

export const iconResolver = (name: string) =>
  aliases[name] ??
  ((Phosphor as Record<string, unknown>)[toPascal(name)] as ComponentType) ??
  null;`;

const TOC: TocItem[] = [
  { href: '#icons', label: 'Overview' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#internal-icons', label: 'Internal icons' },
  { href: '#internal', label: 'Override all at once' },
  { href: '#lucide', label: 'Lucide' },
  { href: '#map', label: 'Heroicons / Phosphor' },
  { href: '#custom', label: 'Your own SVGs' },
  { href: '#lazy', label: 'Lazy-load' },
];

export function IconsPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="icons">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/theming">Theming</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Icons</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Icons</Heading>
          <Text color="muted" size="lg">
            Move’s <Code>Icon</Code> is library-agnostic. You give <Code>MoveRoot</Code> one
            resolver that turns a name into something to render, and every icon in your app
            draws from the set you chose — Lucide, Heroicons, Phosphor, your own SVGs, anything.
          </Text>
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
          id="how-it-works"
          title="How it works"
          lede="One function decides what every icon name renders to. Wire it once on MoveRoot."
        >
          <Stack gap="md">
            <HighlightList items={PRINCIPLE} />
            <CodeBlock language="tsx" code={WIRING} />
          </Stack>
        </Section>

        <Section
          id="internal-icons"
          title="Internal icons"
          lede="The built-in name each component renders by default — map any of these to re-skin specific components."
        >
          <Stack gap="sm">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Icon name</Table.Head>
                  <Table.Head>Used by</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {INTERNAL_ICON_USAGE.map((row) => (
                  <Table.Row key={row.name}>
                    <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                      <Stack direction="row" align="center" gap="xs">
                        <Icon name={row.name} />
                        <Code>{row.name}</Code>
                      </Stack>
                    </Table.Cell>
                    <Table.Cell>{row.usedBy}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Text color="muted">
              Every name above ships as a built-in fallback, so these render even before you
              wire a resolver. Components that render a default icon also accept an icon prop
              (e.g. Password’s <Code>showIcon</Code>/<Code>hideIcon</Code>) to override just that
              one instance.
            </Text>
          </Stack>
        </Section>

        <Section
          id="internal"
          title="Override every component’s icons at once"
          lede="Your resolver runs before Move’s built-ins, so mapping the names above to your library re-skins every component in one place — no per-component wiring."
        >
          <Stack gap="md">
            <Text color="muted">
              Resolution order is your resolver → Move’s built-in essentials → the optional fallback, so returning <Code>null</Code> for a name keeps the built-in. Using Lucide? These are Lucide’s own kebab names, so the resolver above already covers them — no alias map needed.
            </Text>
            <CodeBlock language="tsx" code={OVERRIDE_ALL} />
            <Text color="muted">
              For one-off swaps, components also take an <Code>icon</Code> prop (and friends like <Code>iconLeft</Code>, <Code>CloseIcon</Code>) that accepts a name or a node — reach for that instead of the resolver when you only need to change one spot.
            </Text>
          </Stack>
        </Section>

        <Section
          id="lucide"
          title="Lucide — transform a namespace"
          lede="When a library exports every icon by name, one resolver covers the whole pack: map the kebab name to its PascalCase export."
        >
          <CodeBlock language="tsx" code={LUCIDE} />
        </Section>

        <Section
          id="map"
          title="Heroicons, Phosphor, react-icons — map what you import"
          lede="Import only the icons you use and map your names to them. Tree-shaking-friendly, and the same shape works for any named-export library."
        >
          <CodeBlock language="tsx" code={MAP} />
        </Section>

        <Section
          id="custom"
          title="Your own SVGs — return a node"
          lede="Brand icons or a custom set: map names to imported SVG components, or return raw JSX straight from the resolver."
        >
          <CodeBlock language="tsx" code={CUSTOM} />
        </Section>

        <Section
          id="lazy"
          title="Lazy-load a large set"
          lede="For very large packs, return a lazily-imported component so only the icons you actually render get fetched."
        >
          <CodeBlock language="tsx" code={LAZY} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
