import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Badge, Icon, Table } from 'move';
import { Section, TocRail, type TocItem, CodeBlock } from '../../components';

/**
 * Core-concepts deep dive on the conformance machinery — the mechanism twin of
 * the consumer-facing /ai/conformance page, the same way Component Contract is
 * the deep twin of the Spec pipeline page. Documents the two kinds of gate, the
 * ratchet/baseline model, the two axes, dogfooding, and how a consumer adopts it.
 */

const TAGLINE =
  'Conformance keeps a Move app true to the contract — composition, design tokens, and accessibility — verified automatically on every commit, so the app stays in the system as it grows.';

const TOC: TocItem[] = [
  { href: '#why', label: 'Why conformance' },
  { href: '#two-gates', label: 'Two kinds of gate' },
  { href: '#ratchet', label: 'The ratchet' },
  { href: '#axes', label: 'The two axes' },
  { href: '#adopt', label: 'In your project' },
  { href: '#enforcement', label: 'Enforcement' },
  { href: '#next-steps', label: 'Next steps' },
];

const BASELINE_SHAPE = `// a11y.baseline.json — the accepted debt, per entry, per rule
{
  "color-input/basic": { "label": 1 },
  "align/basic":       { "button-name": 1 }
}

// app-conformance.baseline.json — same shape, different axis
{
  "App.tsx":                              { "inline-style": 1 },
  "components/AdvancedBadge/…​.module.css": { "css-module": 1 },
  "components/AdvancedBadge/…​.tsx":        { "raw-html": 1 }
}`;

const CONFIG = `// move.config.json
{
  "check": {
    "composites": "src/composites"
  }
}`;

interface GateRow {
  gate: React.ReactNode;
  what: React.ReactNode;
  delivery: React.ReactNode;
}

const GATES: GateRow[] = [
  {
    gate: <Badge variant="soft"><Icon name="scan-text" />Static</Badge>,
    what: <>Reads your source as text and AST — purity (no hand-rolling) and composition drift over your composites.</>,
    delivery: <><Code>npx move check</Code> — lives in the CLI, so nothing lands in your repo.</>,
  },
  {
    gate: <Badge variant="soft"><Icon name="scan-eye" />Render-time</Badge>,
    what: <>Renders your composites and inspects the live DOM — axe over roles, names, and ARIA.</>,
    delivery: <>A test + baseline scaffolded into your repo, because it needs your test runner and your real UI.</>,
  },
];

interface AxisRow {
  axis: React.ReactNode;
  measures: string;
  gate: string;
  baseline: string;
}

const AXES: AxisRow[] = [
  {
    axis: <Code>app-conformance</Code>,
    measures: 'Hand-rolling — raw HTML elements, inline styles, CSS modules.',
    gate: 'Static (AST)',
    baseline: '265',
  },
  {
    axis: <Code>a11y</Code>,
    measures: 'Accessibility — roles, accessible names, ARIA (axe mechanical rules).',
    gate: 'Render-time (axe)',
    baseline: '40',
  },
];

export function ConformanceModelPage() {
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
              <RouterLink to="/contracts">Contracts</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Conformance Model</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Conformance Model</Heading>
          <Text color="muted" size="lg">{TAGLINE}</Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft"><Icon name="shield-check" />move check</Badge>
            <Badge variant="soft"><Icon name="git-branch" />Ratchet baseline</Badge>
            <Badge variant="soft"><Icon name="layers" />Two axes</Badge>
          </Stack>
        </Stack>

        <Section
          id="why"
          title="Why conformance"
          lede="Move gives you the components. Conformance keeps the app you build from them inside the system as it grows."
        >
          <Stack gap="sm">
            <Text>
              The promise of Move is that a screen is <Text as="em">composed</Text> from Move components and design
              tokens. Conformance is what makes that promise hold as the app grows: every commit is
              verified to stay composed, tokenized, and accessible — automatically, so staying inside
              the system is the path of least resistance rather than a thing to remember.
            </Text>
            <Text>
              It is the same idea as the <RouterLink to="/contracts/component">Component
              Contract</RouterLink>, one layer up: the contract keeps a single component true to its
              spec; conformance keeps a whole <Text as="em">app</Text> true to the Move way of building.
            </Text>
          </Stack>
        </Section>

        <Section
          id="two-gates"
          title="Two kinds of gate"
          lede="Conformance runs as two kinds of check, and the difference between them decides how each reaches you."
        >
          <Stack gap="md">
            <Text>
              A static gate reads your source as text; a command can do that anywhere, so it ships as
              the CLI and installs nothing. A render-time gate has to render your components and read
              the live DOM, so it runs in your test runner and lives in your repo as a test. Same goal,
              two delivery shapes — that split is the whole model.
            </Text>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Gate</Table.Head>
                  <Table.Head>What it checks</Table.Head>
                  <Table.Head>How it reaches you</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {GATES.map((g, i) => (
                  <Table.Row key={i}>
                    <Table.Cell>{g.gate}</Table.Cell>
                    <Table.Cell><Text size="sm">{g.what}</Text></Table.Cell>
                    <Table.Cell><Text size="sm">{g.delivery}</Text></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Stack>
        </Section>

        <Section
          id="ratchet"
          title="The ratchet"
          lede="A baseline of accepted debt that only ever shrinks. New violations fail; the numbers you inherited are tolerated until you fix them."
        >
          <Stack gap="md">
            <Text>
              A conformance check recomputes its findings live from source every run. What it persists
              is not a report — reports go stale the moment they're written — but a small{' '}
              <Text as="em">baseline</Text>: a count of the currently-accepted violations, per file (or per rendered
              entry) and per rule. Each run compares live counts against the baseline:
            </Text>
            <Stack gap="xs">
              <Text size="sm">• A count <Text as="strong">above</Text> the baseline is a new violation — the check fails.</Text>
              <Text size="sm">• A count <Text as="strong">at or below</Text> the baseline is inherited debt — tolerated.</Text>
              <Text size="sm">• Fix something and the live count drops below the baseline — re-snapshot, and the baseline shrinks. It never grows on its own.</Text>
            </Stack>
            <Text>
              Because the baseline stores <Text as="em">counts</Text>, not line numbers, it is robust to edits that
              shift code around — only the number of violations in a file matters. Re-snapshot with an
              update flag (<Code>--update</Code> for the static audit, <Code>A11Y_UPDATE=1</Code> for
              the render-time sweep). Both axes share one baseline shape:
            </Text>
            <CodeBlock code={BASELINE_SHAPE} language="json" />
          </Stack>
        </Section>

        <Section
          id="axes"
          title="The two axes"
          lede="One mechanism, two things it measures. Conformance is not only accessibility — the larger axis is hand-rolling."
        >
          <Stack gap="md">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Axis</Table.Head>
                  <Table.Head>Measures</Table.Head>
                  <Table.Head>Gate</Table.Head>
                  <Table.Head>Baseline</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {AXES.map((a, i) => (
                  <Table.Row key={i}>
                    <Table.Cell>{a.axis}</Table.Cell>
                    <Table.Cell><Text size="sm">{a.measures}</Text></Table.Cell>
                    <Table.Cell><Text size="sm">{a.gate}</Text></Table.Cell>
                    <Table.Cell><Badge variant="outline">{a.baseline}</Badge></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Text size="sm" color="muted">
              Same ratchet, same baseline shape — they differ only in what a violation <Text as="em">is</Text> and
              whether it's read from source or from a rendered DOM. Add a third axis and it plugs into
              the same machinery.
            </Text>
          </Stack>
        </Section>

        <Section
          id="adopt"
          title="In your project"
          lede="Point the static gate at the code you compose; let setup scaffold the render-time one."
        >
          <Stack gap="lg">
            <Stack gap="sm">
              <Heading level={3}>Static gate — a command</Heading>
              <Text>
                <Code>npx move check</Code> runs the static gates over your project. It reads your
                composites — the pages, features, and composites <RouterLink to="/ai/skills">/app-compose</RouterLink>{' '}
                produces — and needs no files of its own. Point it with a{' '}
                <Code>move.config.json</Code>; with none, it looks in <Code>src/composites</Code>.
              </Text>
              <CodeBlock code={CONFIG} language="json" />
            </Stack>
            <Stack gap="sm">
              <Heading level={3}>Render-time gate — scaffolded</Heading>
              <Text>
                The accessibility ratchet can't be a command — it renders your components. So it's part
                of project setup: <Code>npm create move</Code> drops the sweep test, its baseline,
                and the CI step into your repo, alongside the <Code>MoveRoot</Code> and shell it
                already scaffolds. From
                then on it runs with your own tests, and the baseline is yours to ratchet down.
              </Text>
            </Stack>
            <Text size="sm" color="muted">
              For the full list of gates <Code>move check</Code> runs, see the{' '}
              <RouterLink to="/ai/conformance">Conformance</RouterLink> reference.
            </Text>
          </Stack>
        </Section>

        <Section
          id="enforcement"
          title="Enforcement"
          lede="Both gates are meant to run unattended — a pre-commit hook and CI — so conformance holds without anyone remembering to check."
        >
          <Stack gap="sm">
            <Text>
              Wire <Code>move check</Code> and the render-time sweep into your commit hook and CI, and
              every commit and every pull request stays true to the contract automatically. In a
              monorepo, each package owns its own job and its own baseline — Move's library checks and
              the docs app's two ratchets run as separate CI jobs over the same checkout.
            </Text>
            <Text size="sm" color="muted">
              A ratchet turns conformance into a one-way street: the accepted debt is visible in the
              baseline, new debt is blocked at the gate, and every fix is permanent.
            </Text>
          </Stack>
        </Section>

        <Section id="next-steps" title="Next steps">
          <Stack gap="sm">
            <Text>Adjacent reading:</Text>
            <Stack gap="xs">
              <Text size="sm">• <RouterLink to="/ai/conformance">Conformance</RouterLink> — every gate <Code>move check</Code> runs, for reference.</Text>
              <Text size="sm">• <RouterLink to="/contracts/component">Component Contract</RouterLink> — the same idea one layer down, for a single component.</Text>
              <Text size="sm">• <RouterLink to="/ai/skills">Skills</RouterLink> — <Code>/app-compose</Code> produces the composites the static gate checks; <Code>/app-setup</Code> scaffolds the render-time one.</Text>
            </Stack>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
