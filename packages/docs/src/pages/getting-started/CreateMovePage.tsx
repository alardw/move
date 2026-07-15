import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Table, Code } from 'move';
import { Section, TocRail, type TocItem, CodeBlock } from '../../components';
import { FILES, OPTION_VALUES, DEFAULT_OPTIONS } from '@move-scaffold/creation-spec';

const BADGES = [
  { icon: 'rocket', label: 'One command' },
  { icon: 'bot', label: 'AI-ready out of the box' },
  { icon: 'shield-check', label: 'Conformance gated from day one' },
];

const INSTALL = `npm create move@latest my-app`;
const WITH_OPTIONS = `npm create move@latest my-app -- \\
  --shell sidebar --router react-router --icons lucide --theme light`;

// The flags surface + the file manifest are rendered straight from the creation
// spec, so this page never drifts from what the scaffolder actually writes.
const OPTION_ROWS = (Object.keys(OPTION_VALUES) as (keyof typeof OPTION_VALUES)[]).map((key) => ({
  flag: `--${key}`,
  values: OPTION_VALUES[key] as readonly string[],
  fallback: DEFAULT_OPTIONS[key] as string,
}));

const marker = (f: (typeof FILES)[number]): string =>
  f.dir ? 'directory' : typeof f.required === 'function' ? 'optional' : 'always';

const TOC: TocItem[] = [
  { href: '#create', label: 'Create' },
  { href: '#options', label: 'Options' },
  { href: '#contents', label: "What's in the box" },
  { href: '#ai', label: 'AI-ready' },
  { href: '#conformance', label: 'Conformance built in' },
];

export function CreateMovePage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="create-move">
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
            <Breadcrumb.Page>Create a Move App</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Create a Move App</Heading>
          <Text color="muted" size="lg">
            One command scaffolds a complete Move app — MoveRoot and a shell wired,
            a theme and icon set picked, the AI skills installed, and the
            conformance gates already running. Same inputs, identical output, every
            time.
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
          id="create"
          title="Create"
          lede="Start a project. Answer nothing — the defaults are sensible, and every choice is a flag."
        >
          <CodeBlock code={INSTALL} language="bash" />
          <Text>
            The scaffolder is deterministic: the same name and flags always write
            the same files, and it validates its own output against the creation
            spec before it finishes — so a fresh project is a conformant Move app by
            construction, not by hope.
          </Text>
          <CodeBlock code={WITH_OPTIONS} language="bash" />
        </Section>

        <Section
          id="options"
          title="Options"
          lede="Four choices, each a flag with a sensible default. Pass them or take the defaults."
        >
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Flag</Table.Head>
                <Table.Head>Values</Table.Head>
                <Table.Head>Default</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {OPTION_ROWS.map((o) => (
                <Table.Row key={o.flag}>
                  <Table.Cell>
                    <Code>{o.flag}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Stack direction="row" gap="xs" wrap>
                      {o.values.map((v) => (
                        <Code key={v}>{v}</Code>
                      ))}
                    </Stack>
                  </Table.Cell>
                  <Table.Cell>
                    <Code>{o.fallback}</Code>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Section>

        <Section
          id="contents"
          title="What's in the box"
          lede="Every file the scaffold writes, and why it's there. Read straight from the creation spec."
        >
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Path</Table.Head>
                <Table.Head>Role</Table.Head>
                <Table.Head>Kind</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {FILES.map((f) => (
                <Table.Row key={f.path}>
                  <Table.Cell>
                    <Code>{f.path}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="sm">{f.role}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="sm" color="muted">
                      {marker(f)}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Section>

        <Section
          id="ai"
          title="AI-ready"
          lede="The Move skills land in the project so coding agents discover them automatically."
        >
          <Text>
            Both <Code>.claude/skills</Code> (Claude Code) and <Code>.agents/skills</Code>{' '}
            (Codex) are populated — including <Code>/app-compose</Code>, which builds
            your pages and features into <Code>src/composites</Code>, and the{' '}
            <Code>/component-generate-*</Code> pipeline, which writes custom components
            into <Code>src/components</Code>. Refresh them any time with{' '}
            <Code>npx move skills</Code>.
          </Text>
        </Section>

        <Section
          id="conformance"
          title="Conformance built in"
          lede="The gates ship with the project, so neither you nor an agent drifts from the design system silently."
        >
          <Text>
            Two gates come wired as npm scripts: <Code>npm run check</Code> (static —
            your composites are built entirely from Move components) and{' '}
            <Code>npm run test:a11y</Code> (render-time — axe over every composite,
            held to a ratchet). Both run on any CI; the default GitHub Actions
            workflow just calls them, and <Code>--ci none</Code> leaves that binding
            to you. See{' '}
            <RouterLink to="/contracts/conformance">the conformance model</RouterLink>{' '}
            for how the gates fit together.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
