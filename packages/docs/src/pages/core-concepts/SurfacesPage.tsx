import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Badge, Icon, Table, Card } from 'move';
import { Section, TocRail, type TocItem } from '../../components';

/**
 * Surfaces. The two-level surface elevation system,
 * the alternating-tint rule, the CSS tokens, and which components
 * declare which level.
 */

const TOC: TocItem[] = [
  { href: '#overview', label: 'Overview' },
  { href: '#levels', label: 'Levels' },
  { href: '#alternating', label: 'Alternating tints' },
  { href: '#components', label: 'Per-component surface' },
];

interface Level {
  kind: 'base' | 'subtle';
  bgToken: string;
  description: string;
}

const LEVELS: Level[] = [
  { kind: 'base', bgToken: '--move-bg-base', description: 'The page/app ground. Established implicitly by MoveRoot (:root) — no component declares it.' },
  { kind: 'subtle', bgToken: '--move-bg-subtle', description: 'Slightly raised tint over base — used for cards, popovers, dialogs, and other contained panels.' },
];

const COMPONENT_BY_LEVEL: Record<Level['kind'], string[]> = {
  // base is the implicit page ground (MoveRoot / :root) — no component declares it.
  'base': [],
  'subtle': ['Alert', 'Card', 'Dialog', 'Drawer', 'Dropdown', 'Popover', 'Toast', 'ColorInput', 'Select'],
};

export function SurfacesPage() {
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
              <RouterLink to="/core-concepts">Core Concepts</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Surfaces</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Surfaces</Heading>
          <Text color="muted" size="lg">
            Two-level elevation system. Components that render a tinted or elevated panel pick a surface level; nested surfaces alternate so each panel reads as visually distinct from its parent.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft"><Icon name="layers" />{LEVELS.length} levels</Badge>
            <Badge variant="soft"><Icon name="square-stack" />Alternating hierarchy</Badge>
          </Stack>
        </Stack>

        <Section
          id="levels"
          title="Levels"
          lede="Each level maps to a single CSS token. Components reference the token, never a raw color."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Level</Table.Head>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>CSS token</Table.Head>
                <Table.Head>Use</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {LEVELS.map((l) => (
                <Table.Row key={l.kind}>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><Code>{l.kind}</Code></Table.Cell>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><Code>{l.bgToken}</Code></Table.Cell>
                  <Table.Cell><Text size="sm">{l.description}</Text></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>

        <Section
          id="alternating"
          title="Alternating tints"
          lede="A surface always reads as elevated against its parent. Nest two of the same level and the boundary disappears."
        >
          <Stack gap="md">
            <Text>
              The page itself sits at <Code>base</Code>. A Card on the page picks <Code>subtle</Code>, and the tint difference makes it read as elevated. A child Card inside that Card flips back to <Code>base</Code> so the nested boundary stays visible. Same rule for popovers nested inside a subtle dialog body.
            </Text>
            <Card.Root>
              <Card.Body>
                <Stack gap="md">
                  <Text size="sm" color="muted"><Code>base</Code> page</Text>
                  <Card.Root>
                    <Card.Body>
                      <Stack gap="md">
                        <Text size="sm" color="muted"><Code>subtle</Code> card on the page</Text>
                        <Card.Root>
                          <Card.Body>
                            <Text size="sm" color="muted"><Code>base</Code>-tinted child reads as recessed inside the subtle parent.</Text>
                          </Card.Body>
                        </Card.Root>
                      </Stack>
                    </Card.Body>
                  </Card.Root>
                </Stack>
              </Card.Body>
            </Card.Root>
            <Text size="sm" color="muted">
              The validator flags any component that renders a <Code>subtle</Code> surface inside another <Code>subtle</Code> ancestor (or <Code>base</Code> inside <Code>base</Code>). Compositions that need a third tint signal a missing level — fix the taxonomy, don't bend the rule.
            </Text>
          </Stack>
        </Section>

        <Section
          id="components"
          title="Per-component surface"
          lede="Which Move components currently declare which level."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Level</Table.Head>
                <Table.Head>Components</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {LEVELS.map((l) => (
                <Table.Row key={l.kind}>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><Code>{l.kind}</Code></Table.Cell>
                  <Table.Cell>
                    <Text size="sm" color={COMPONENT_BY_LEVEL[l.kind].length ? undefined : 'muted'}>
                      {COMPONENT_BY_LEVEL[l.kind].length
                        ? COMPONENT_BY_LEVEL[l.kind].join(', ')
                        : 'Implicit page ground — declared by no component.'}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
