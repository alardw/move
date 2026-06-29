import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Badge, Code, Table } from 'move';
import { CodeBlock, Section, TocRail, type TocItem } from '../../components';

const TOC: TocItem[] = [
  { href: '#validation', label: 'Overview' },
  { href: '#checks', label: 'The checks' },
  { href: '#config', label: 'Configuration' },
  { href: '#running', label: 'Running it' },
  { href: '#ci', label: 'CI & pre-commit' },
];

const CHECKS: { name: string; enforces: string }[] = [
  { name: 'strict-props', enforces: 'Component Props interfaces are strictly typed — no `extends Record<string, unknown>`, so invalid prop values and unknown props are rejected by the compiler.' },
  { name: 'recipe-purity', enforces: 'Recipes and samples are built only from Move components — no raw HTML elements and no inline `style=` props.' },
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

export function ValidationPage() {
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
            <Breadcrumb.Page>Validation</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Validation</Heading>
          <Text color="muted" size="lg">
            The same quality gates Move uses on itself, runnable on your project with{' '}
            <Code>move check</Code>.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft"><Code>move check</Code></Badge>
            <Badge variant="soft">CI + pre-commit</Badge>
          </Stack>
        </Stack>

        <Section id="checks" title="The checks" lede="Deterministic gates that the TypeScript compiler can't catch on its own.">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Check</Table.Head>
                <Table.Head>Enforces</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {CHECKS.map((c) => (
                <Table.Row key={c.name}>
                  <Table.Cell><Code>{c.name}</Code></Table.Cell>
                  <Table.Cell><Text size="sm">{c.enforces}</Text></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Text size="sm" color="muted">
            The AI skills <Code>component-validate</Code> and <Code>recipe-validate</Code> cover the
            judgment-based checks (behaviour coverage, label parity) during generation; <Code>move check</Code>{' '}
            is the deterministic layer for CI.
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
