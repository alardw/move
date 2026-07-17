import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Badge, Code, Table } from 'move';
import { Section, TocRail, type TocItem } from '../../components';
import { CHECKS, type CheckDoc } from '../ai/checks';
import { CONFORMANCE } from '../ai/conformance-spec';
import { GROUPS } from '../accessibility/criteria';

// This page is the hub. A WCAG criterion and a coverage rule are different vocabularies
// over the same checks — a criterion doesn't have a rule, they each have checks — and
// the mapping between them is many-to-many (a11y-sweep alone backs 14 criteria). Linking
// /accessibility to /ai/coverage directly would mean hand-maintaining that mapping with
// no ground truth under it, which is exactly how the app-wcag-audit skill drifted. So
// both pages link HERE, and both sides are derived from their own source of truth.

/** Rule ids that name this check in the coverage spec. */
const rulesForCheck = (name: string) =>
  CONFORMANCE.rules
    .filter((r) => Object.values(r.enforcement).some((e) => e?.check === name))
    .map((r) => r.id);

/** WCAG criteria citing this check as their evidence. */
const ALL_CRITERIA = GROUPS.flatMap((g) => g.rows);
const criteriaForCheck = (name: string) =>
  ALL_CRITERIA.filter((c) => c.evidence.includes(name)).map((c) => c.sc);

// Not every gate is a check:* script, and the biggest one isn't. The docs a11y sweep
// runs every component sample through axe; axe rules carry WCAG tags, so it covers more
// criteria than any bespoke check. It can't join CHECKS — conformance-docs demands a
// matching check:* script for every entry — but criteria cite it, so it needs an anchor
// here or those links point at nothing. Mirrors EXTRA_GATES in check:wcag-evidence.
const NON_CHECK_GATES = [
  {
    name: 'a11y-sweep',
    script: 'test:a11y',
    enforces:
      'Renders every component sample through axe-core and holds a baseline — so a new roles/names/ARIA violation fails, in the docs package.',
  },
];

const TOC: TocItem[] = [
  { href: '#validation', label: 'Overview' },
  { href: '#composing', label: 'Composing Move' },
  { href: '#authoring', label: 'Authoring with the pipeline' },
  { href: '#other-gates', label: "Gates that aren't checks" },
];

const TARGET_LABEL: Record<CheckDoc['appliesTo'], string> = {
  component: 'Component',
  composition: 'Composite',
  'design-pattern': 'Design Pattern',
  docs: 'Docs',
};

const TARGET_ORDER: CheckDoc['appliesTo'][] = [
  'component',
  'composition',
  'design-pattern',
  'docs',
];
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
        {rows.map((c) => {
          const rules = rulesForCheck(c.name);
          const criteria = criteriaForCheck(c.name);
          return (
            // The anchor both other pages link to: /conformance/validation#check-<name>.
            <Table.Row key={c.name} id={`check-${c.name}`}>
              <Table.Cell>
                <Code>{c.title ?? c.name}</Code>
              </Table.Cell>
              {showTarget && (
                <Table.Cell>
                  <Badge variant="soft">{TARGET_LABEL[c.appliesTo]}</Badge>
                </Table.Cell>
              )}
              <Table.Cell>
                <Stack gap="xs">
                  <Text size="sm">{c.enforces}</Text>
                  {(rules.length > 0 || criteria.length > 0) && (
                    <Stack direction="row" gap="xs" wrap align="center">
                      {rules.map((id) => (
                        <Badge key={id} variant="soft" color="violet">
                          {id}
                        </Badge>
                      ))}
                      {criteria.map((sc) => (
                        <Badge key={sc} variant="soft" color="green">
                          WCAG {sc}
                        </Badge>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Table.Cell>
            </Table.Row>
          );
        })}
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
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/contracts">Conformance</RouterLink>
            </Breadcrumb.Link>
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
            No spec needed, so they ship to you via <Code>move check</Code>; Move runs the same
            gates on its own composites and samples.
          </Text>
          <ChecksTable rows={CHECKS.filter((c) => c.shipped)} />
        </Section>

        <Section
          id="authoring"
          title="Authoring with the pipeline"
          lede="Contract gates for components, composites, and design patterns built the Move way — the analyze → spec → generate → validate loop."
        >
          <Text size="sm" color="muted">
            Move runs these on itself; adopt the pipeline (<Code>npx move skills</Code>) and they
            apply to what you author too. The Applies-to column says whether each governs a
            component, a composite, a design pattern, or the docs.
          </Text>
          <ChecksTable rows={CHECKS.filter((c) => !c.shipped).sort(byTarget)} showTarget />
          <Text size="sm" color="muted">
            The AI skills <Code>component-validate</Code> and <Code>design-pattern-validate</Code>{' '}
            cover the judgment-based checks (behaviour coverage, label parity) during generation;
            these deterministic gates are the layer for CI.
          </Text>
        </Section>

        <Section
          id="other-gates"
          title="Gates that aren’t checks"
          lede="Real gates that run as tests rather than check:* scripts — listed here so a criterion citing one has somewhere to point."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Gate</Table.Head>
                <Table.Head>Runs as</Table.Head>
                <Table.Head>Enforces</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {NON_CHECK_GATES.map((g) => {
                const criteria = criteriaForCheck(g.name);
                return (
                  <Table.Row key={g.name} id={`check-${g.name}`}>
                    <Table.Cell>
                      <Code>{g.name}</Code>
                    </Table.Cell>
                    <Table.Cell>
                      <Code>{g.script}</Code>
                    </Table.Cell>
                    <Table.Cell>
                      <Stack gap="xs">
                        <Text size="sm">{g.enforces}</Text>
                        {criteria.length > 0 && (
                          <Stack direction="row" gap="xs" wrap align="center">
                            {criteria.map((sc) => (
                              <Badge key={sc} variant="soft" color="green">
                                WCAG {sc}
                              </Badge>
                            ))}
                          </Stack>
                        )}
                      </Stack>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
