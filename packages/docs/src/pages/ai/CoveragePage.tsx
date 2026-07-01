import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Badge, Code, Icon, Table } from 'move';
import { Section, TocRail, type TocItem } from '../../components';
import {
  CONFORMANCE,
  groupsForEntity,
  tallyFor,
  entityByKey,
  statusFor,
  shipBacklog,
  type EntityDef,
  type Status,
} from './conformance-spec';

const TOC: TocItem[] = [
  { href: '#coverage', label: 'Overview' },
  { href: '#ambient', label: 'Ambient tooling' },
  { href: '#component', label: 'Component' },
  { href: '#composition-recipe', label: 'Composition / Recipe' },
];

const component = entityByKey('component');
const recipe = entityByKey('recipe');
const composition = entityByKey('composition');

const cTally = tallyFor(component);
const rTally = tallyFor(recipe);
const SHIP = shipBacklog();

// Composition gaps that duplicate a recipe gap are the same missing check — count
// the rule once (via recipe). The only composition-specific work is the ship
// backlog: a check proven on recipes that isn't in `move check` yet.
const TOTAL = {
  check: cTally.check + rTally.check,
  gap: cTally.gap + rTally.gap + SHIP,
};

function StatusCell({ status, check }: { status: Status; check?: string }) {
  if (status === 'check') {
    return (
      <Badge variant="soft" color="green">
        <Icon name="check" />
        {check}
      </Badge>
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

/** Composition and Recipe share the same pureComposition rules — one table, two
 *  status columns. Recipe is the superset (it adds registry + docs), so a
 *  recipe-only rule shows "—" for Composition. A green Composition cell means the
 *  check ships via `move check`; Recipe-green / Composition-gap means the check is
 *  Move-internal and just needs to ship. */
function CompositionRecipeTable() {
  const groups = groupsForEntity(recipe);
  return (
    <Section
      id="composition-recipe"
      title="Composition / Recipe"
      lede="A recipe is a composition Move ships. Same purity rules, two places they run: Recipe is Move's CI over the recipes it ships; Composition is move check over the compositions you build."
    >
      <Stack direction="row" gap="xs" wrap>
        <Badge variant="soft" color="green">
          {rTally.check} enforced on recipes
        </Badge>
        <Badge variant="soft" color="blue">
          {SHIP} checks to ship
        </Badge>
        <Badge variant="soft" color="orange">
          {rTally.gap} gaps
        </Badge>
      </Stack>
      <Text size="sm" color="muted">
        <strong>Recipe</strong> ✓ + <strong>Composition</strong> ✓ — the check ships and runs on your
        compositions too. <strong>Recipe</strong> ✓ + <strong>Composition</strong> gap — proven on
        recipes, not yet in <Code>move check</Code> (the ship backlog). <Code>—</Code> — a recipe-only
        rule that doesn&apos;t apply to a private composition.
      </Text>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Rule</Table.Head>
            <Table.Head>Recipe</Table.Head>
            <Table.Head>Composition</Table.Head>
          </Table.Row>
        </Table.Header>
        {groups.map(({ group, rules }) => (
          <Table.Group key={group.id} collapsible={false}>
            <Table.GroupHeader>{group.label}</Table.GroupHeader>
            {rules.map((r, i) => {
              const comp = statusFor(r.id, composition);
              return (
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
                  <Table.Cell>
                    {comp ? (
                      <StatusCell status={comp.status} check={comp.check} />
                    ) : (
                      <Text size="sm" color="muted">
                        —
                      </Text>
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })}
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
              <RouterLink to="/ai">AI</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Coverage</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Coverage</Heading>
          <Text color="muted" size="lg">
            Every rule the contract implies, mapped to the deterministic check that enforces it. Which
            rules apply to each entity is computed from the entity&apos;s traits, not assigned by hand.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft" color="green">
              {TOTAL.check} enforced
            </Badge>
            <Badge variant="soft" color="orange">
              {TOTAL.gap} gaps
            </Badge>
          </Stack>
          <Text size="sm" color="muted">
            <Code>check</Code> = a deterministic gate enforces it. <Code>gap</Code> = mechanizable, but
            no check exists yet — never a human call. Composition shares Recipe&apos;s rules, so they
            sit in one table; a shared gap is counted once, and the only composition-specific work is
            shipping a recipe-proven check via <Code>move check</Code>. Beneath all of it, the ambient
            tooling below runs over the whole source automatically.
          </Text>
        </Stack>

        <Section id="ambient" title="Ambient tooling">
          <Text color="muted">
            Always-on, whole-source tools that run beneath the rule-by-rule coverage. Every entry maps
            to a real package script, so this list can&apos;t drift from what the repo actually runs.
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

        <EntityTable entity={component} />
        <CompositionRecipeTable />
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
