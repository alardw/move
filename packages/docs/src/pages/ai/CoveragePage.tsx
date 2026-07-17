import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Badge, Code, Icon, Table } from 'move';
import { Section, TocRail, type TocItem } from '../../components';
import { CHECKS } from './checks';
import {
  CONFORMANCE,
  groupsForEntity,
  tallyFor,
  entityByKey,
  referencedChecks,
  type EntityDef,
  type Status,
} from './conformance-spec';

const TOC: TocItem[] = [
  { href: '#coverage', label: 'Overview' },
  { href: '#ambient', label: 'Ambient tooling' },
  { href: '#structural', label: 'Cross-cutting & structural' },
  { href: '#component', label: 'Component' },
  { href: '#composition', label: 'Composite' },
  { href: '#design-pattern', label: 'Design Pattern' },
];

const component = entityByKey('component');
const composition = entityByKey('composition');
const designPattern = entityByKey('design-pattern');

const cTally = tallyFor(component);
const compTally = tallyFor(composition);
const dpTally = tallyFor(designPattern);

// Every entity's rules, counted once each.
const TOTAL = {
  check: cTally.check + compTally.check + dpTally.check,
  gap: cTally.gap + compTally.gap + dpTally.gap,
};

// Enforced checks that no rule references — family/cross-cutting/meta contracts.
// Derived (not hand-listed) so it can't drift from the catalog or the gate.
const REFERENCED = referencedChecks();
const STRUCTURAL_CHECKS = CHECKS.filter((c) => !REFERENCED.has(c.name));

function StatusCell({ status, check }: { status: Status; check?: string }) {
  if (status === 'check') {
    // Links to the check hub, where the same gate also shows any WCAG criteria that
    // cite it — the two vocabularies meet at the check, never at each other.
    return (
      <RouterLink to={`/conformance/validation#check-${check}`}>
        <Badge variant="soft" color="green">
          <Icon name="check" />
          {check}
        </Badge>
      </RouterLink>
    );
  }
  return (
    <Badge variant="soft" color="orange">
      gap
    </Badge>
  );
}

/** Single-status table (Component). */
function EntityTable({ entity }: { entity: EntityDef }) {
  const groups = groupsForEntity(entity);
  const t = tallyFor(entity);
  return (
    <Section id={entity.key} title={entity.title} lede={entity.blurb}>
      <Stack direction="row" gap="xs" wrap>
        <Badge variant="soft" color="green">
          {t.check} enforced
        </Badge>
        <Badge variant="soft" color="orange">
          {t.gap} gaps
        </Badge>
      </Stack>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Rule</Table.Head>
            <Table.Head>Enforced by</Table.Head>
          </Table.Row>
        </Table.Header>
        {groups.map(({ group, rules }) => (
          <Table.Group key={group.id} collapsible={false}>
            <Table.GroupHeader>{group.label}</Table.GroupHeader>
            {rules.map((r, i) => (
              <Table.Row key={r.id}>
                <Table.Cell>
                  <Stack gap="xs">
                    <Text size="sm">
                      <Code>{i + 1}</Code> {r.rule}
                    </Text>
                    <Text size="xs" color="muted">
                      {r.why}
                    </Text>
                  </Stack>
                </Table.Cell>
                <Table.Cell>
                  <StatusCell status={r.status} check={r.check} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Group>
        ))}
      </Table>
    </Section>
  );
}

export function CoveragePage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="coverage">
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
            <Breadcrumb.Page>Coverage</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Coverage</Heading>
          <Text color="muted" size="lg">
            Every rule the contract implies, mapped to the deterministic check that enforces it.
            Which rules apply to each entity is computed from the entity&apos;s traits, not assigned
            by hand.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft" color="green">
              {TOTAL.check} enforced
            </Badge>
            <Badge variant="soft" color="orange">
              {TOTAL.gap} gaps
            </Badge>
            <Badge variant="soft" color="blue">
              {STRUCTURAL_CHECKS.length} structural
            </Badge>
          </Stack>
          <Text size="sm" color="muted">
            <Code>check</Code> = a deterministic gate enforces it. <Code>gap</Code> = mechanizable,
            but no check exists yet — never a human call. Component and composite render UI (purity,
            accessibility, spec parity); a design pattern is validated as a spec — its skeleton,
            axes, and per-value bindings must be well-formed and complete. Beneath all of it, the
            ambient tooling below runs over the whole source automatically.
          </Text>
        </Stack>

        <Section id="ambient" title="Ambient tooling">
          <Text color="muted">
            Always-on, whole-source tools that run beneath the rule-by-rule coverage. Every entry
            maps to a real package script, so this list can&apos;t drift from what the repo actually
            runs.
          </Text>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Tool</Table.Head>
                <Table.Head>Role</Table.Head>
                <Table.Head>What it enforces</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {CONFORMANCE.ambient.map((t) => (
                <Table.Row key={t.tool}>
                  <Table.Cell>
                    <Code>{t.tool}</Code>
                  </Table.Cell>
                  <Table.Cell>{t.role}</Table.Cell>
                  <Table.Cell>{t.detail}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>

        <Section id="structural" title="Cross-cutting & structural">
          <Text color="muted">
            Enforced checks that guard a family or cross-cutting contract, or the docs themselves —
            real gates, but not tied to one entity rule, so they don&apos;t appear in the tables
            below. Derived: every catalogued check that no rule references, so this list stays in
            step with the checks and the gate.
          </Text>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Contract</Table.Head>
                <Table.Head>Enforced by</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {STRUCTURAL_CHECKS.map((c, i) => (
                <Table.Row key={c.name}>
                  <Table.Cell>
                    <Stack gap="xs">
                      <Text size="sm">
                        <Code>{i + 1}</Code> {c.enforces}
                      </Text>
                      <Text size="xs" color="muted">
                        {c.appliesTo}
                      </Text>
                    </Stack>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusCell status="check" check={c.name} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>

        <EntityTable entity={component} />
        <EntityTable entity={composition} />
        <EntityTable entity={designPattern} />
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
