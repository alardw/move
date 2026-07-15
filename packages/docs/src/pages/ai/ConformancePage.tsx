import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Badge, Code, Table } from 'move';
import { CodeBlock, Section, TocRail, type TocItem } from '../../components';
import { CHECKS, type CheckDoc } from './checks';

const TOC: TocItem[] = [
  { href: '#conformance', label: 'Overview' },
  { href: '#running', label: 'One command' },
  { href: '#config', label: 'Configuration' },
  { href: '#reference', label: 'Every gate' },
];

const CONFIG = `// move.config.json
{
  "check": {
    "composites": "src/composites"
  }
}`;

const TARGET_LABEL: Record<CheckDoc['appliesTo'], string> = {
  component: 'Component',
  composition: 'Composite',
  'design-pattern': 'Design Pattern',
  docs: 'Docs',
};

// Group the pipeline table by what each gate governs.
const TARGET_ORDER: CheckDoc['appliesTo'][] = ['component', 'composition', 'design-pattern', 'docs'];
const byTarget = (a: CheckDoc, b: CheckDoc) =>
  TARGET_ORDER.indexOf(a.appliesTo) - TARGET_ORDER.indexOf(b.appliesTo);

function ChecksTable({ rows, showTarget }: { rows: CheckDoc[]; showTarget?: boolean }) {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Check</Table.Head>
          {showTarget && <Table.Head>Applies to</Table.Head>}
          <Table.Head>Enforces</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((c) => (
          <Table.Row key={c.name}>
            <Table.Cell><Code>{c.title ?? c.name}</Code></Table.Cell>
            {showTarget && (
              <Table.Cell><Badge variant="soft">{TARGET_LABEL[c.appliesTo]}</Badge></Table.Cell>
            )}
            <Table.Cell><Text size="sm">{c.enforces}</Text></Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export function ConformancePage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="validation">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild><RouterLink to="/">Docs</RouterLink></Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild><RouterLink to="/ai">AI</RouterLink></Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Conformance</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Conformance</Heading>
          <Text color="muted" size="lg">
            Conformance is the guarantee that your app stays true to the Move contract — composition,
            design tokens, accessibility, and structure — automatically checked on every commit. Move
            enforces it on itself and ships the same gates to you.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft"><Code>move check</Code></Badge>
            <Badge variant="soft">CI + pre-commit</Badge>
          </Stack>
        </Stack>

        <Section id="running" title="One command" lede="One command checks your whole app.">
          <Text>
            <Code>move check</Code> runs every gate over your project and reports the result. Wire it
            into your commit hook and CI, and conformance holds automatically — every commit and every
            pull request stays true to the contract. The reference below lists every gate it runs.
          </Text>
          <CodeBlock code={`npx move check`} />
        </Section>

        <Section id="config" title="Configuration" lede="Point the checks at the code you compose. Roots may be a string or a list; a path that isn't there is skipped.">
          <CodeBlock code={CONFIG} />
          <Text size="sm" color="muted">
            With no <Code>move.config.json</Code>, Move looks in <Code>src/composites</Code> — where{' '}
            <Code>/app-compose</Code> puts your pages, features, and composites. Author your own Move
            components too? Add a <Code>components</Code> root and the pipeline gates cover those as well.
          </Text>
        </Section>

        <Section id="reference" title="Every gate" lede="The complete set move check runs — here for reference. What applies scales with how you use Move: compose its components, or author your own with the pipeline.">
          <Stack gap="lg">
            <Stack gap="sm">
              <Heading level={3}>Composing Move</Heading>
              <Text size="sm" color="muted">
                Purity gates for any composition of Move components — the pages and sections you
                build. No spec needed, so they ship to you via <Code>move check</Code>; Move runs the
                same gates on its own composites and samples.
              </Text>
              <ChecksTable rows={CHECKS.filter((c) => c.shipped)} />
            </Stack>
            <Stack gap="sm">
              <Heading level={3}>Authoring with the pipeline</Heading>
              <Text size="sm" color="muted">
                Contract gates for components, composites, and design patterns built the Move way — the
                analyze → spec → generate → validate loop. Move runs these on itself; adopt the pipeline
                (<Code>npx move skills</Code>) and they apply to what you author too. The Applies-to
                column says whether each governs a component, a composite, a design pattern, or the docs.
              </Text>
              <ChecksTable rows={CHECKS.filter((c) => !c.shipped).sort(byTarget)} showTarget />
            </Stack>
          </Stack>
          <Text size="sm" color="muted">
            The AI skills <Code>component-validate</Code> and <Code>design-pattern-validate</Code> cover
            the judgment-based checks (behaviour coverage, label parity) during generation; these
            deterministic gates are the layer for CI.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
