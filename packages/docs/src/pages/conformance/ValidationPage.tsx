import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Badge, Code, Table } from 'move';
import { Section, TocRail, type TocItem } from '../../components';
import { CHECKS, type CheckDoc } from '../ai/checks';

const TOC: TocItem[] = [
  { href: '#validation', label: 'Overview' },
  { href: '#composing', label: 'Composing Move' },
  { href: '#authoring', label: 'Authoring with the pipeline' },
];

const TARGET_LABEL: Record<CheckDoc['appliesTo'], string> = {
  component: 'Component',
  composition: 'Composite',
  'design-pattern': 'Design Pattern',
  docs: 'Docs',
};

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

export function ValidationPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="validation">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild><RouterLink to="/">Docs</RouterLink></Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild><RouterLink to="/contracts">Conformance</RouterLink></Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Validation</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Validation</Heading>
          <Text color="muted" size="lg">
            The gates that hold conformance — every one, and what it enforces. What applies scales
            with how you use Move: compose its components, or author your own with the pipeline. To
            run them, see <RouterLink to="/conformance/tooling">Tooling</RouterLink>.
          </Text>
        </Stack>

        <Section
          id="composing"
          title="Composing Move"
          lede="Purity gates for any composition of Move components — the pages and sections you build."
        >
          <Text size="sm" color="muted">
            No spec needed, so they ship to you via <Code>move check</Code>; Move runs the same gates
            on its own composites and samples.
          </Text>
          <ChecksTable rows={CHECKS.filter((c) => c.shipped)} />
        </Section>

        <Section
          id="authoring"
          title="Authoring with the pipeline"
          lede="Contract gates for components, composites, and design patterns built the Move way — the analyze → spec → generate → validate loop."
        >
          <Text size="sm" color="muted">
            Move runs these on itself; adopt the pipeline (<Code>npx move skills</Code>) and they apply
            to what you author too. The Applies-to column says whether each governs a component, a
            composite, a design pattern, or the docs.
          </Text>
          <ChecksTable rows={CHECKS.filter((c) => !c.shipped).sort(byTarget)} showTarget />
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
