import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Badge, Code, Table } from 'move';
import { CodeBlock, Section, TocRail, type TocItem } from '../../components';
import { CHECKS, type CheckDoc } from './checks';

const TOC: TocItem[] = [
  { href: '#validation', label: 'Overview' },
  { href: '#checks', label: 'The checks' },
  { href: '#config', label: 'Configuration' },
  { href: '#running', label: 'Running it' },
  { href: '#ci', label: 'CI & pre-commit' },
];

const CONFIG = `// move.config.json
{
  "check": {
    "components": "src/components",
    "recipes": "src/recipes",
    "samples": "src/samples"
  }
}`;

const CI = `# .github/workflows/move-check.yml
- run: npx move check`;

const HOOK = `# .githooks/pre-commit
npx move check || exit 1`;

const TARGET_LABEL: Record<CheckDoc['appliesTo'], string> = {
  component: 'Component',
  recipe: 'Recipe',
  composition: 'Composition',
  docs: 'Docs',
};

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
            The same quality gates Move uses on itself, runnable on your project with{' '}
            <Code>move check</Code>.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft"><Code>move check</Code></Badge>
            <Badge variant="soft">CI + pre-commit</Badge>
          </Stack>
        </Stack>

        <Section id="checks" title="The checks" lede="Deterministic gates the TypeScript compiler can't catch on its own. What's relevant scales with how you use Move — compose its components, or author your own with the pipeline.">
          <Stack gap="lg">
            <Stack gap="sm">
              <Heading level={3}>Composing Move</Heading>
              <Text size="sm" color="muted">
                Purity gates for any composition of Move components — the pages and sections you
                build. No spec needed, so they ship to you via <Code>move check</Code>; Move runs the
                same gates on its own recipes and samples.
              </Text>
              <ChecksTable rows={CHECKS.filter((c) => c.shipped)} />
            </Stack>
            <Stack gap="sm">
              <Heading level={3}>Authoring with the pipeline</Heading>
              <Text size="sm" color="muted">
                Contract gates for components and recipes built the Move way — the analyze → spec →
                generate → validate loop. Move runs these on itself; adopt the pipeline
                (<Code>npx move skills</Code>) and they apply to the components and recipes you author
                too. The Applies-to column says whether each governs a component, a recipe, or the docs.
              </Text>
              <ChecksTable rows={CHECKS.filter((c) => !c.shipped)} showTarget />
            </Stack>
          </Stack>
          <Text size="sm" color="muted">
            The AI skills <Code>component-validate</Code> and <Code>recipe-validate</Code> cover the
            judgment-based checks (behaviour coverage, label parity) during generation; these
            deterministic gates are the layer for CI.
          </Text>
        </Section>

        <Section id="config" title="Configuration" lede="Point the checks at your source. All roots are optional and may be a string or a list; missing paths are skipped.">
          <CodeBlock code={CONFIG} />
          <Text size="sm" color="muted">
            With no <Code>move.config.json</Code>, the defaults are <Code>src/components</Code> and{' '}
            <Code>src/recipes</Code>.
          </Text>
        </Section>

        <Section id="running" title="Running it">
          <CodeBlock code={`npx move check            # all checks\nnpx move check strict-props   # one check`} />
        </Section>

        <Section id="ci" title="CI & pre-commit" lede="Run it where regressions get caught early.">
          <Stack gap="md">
            <CodeBlock code={CI} />
            <CodeBlock code={HOOK} />
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
