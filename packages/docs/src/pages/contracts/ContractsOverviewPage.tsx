import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge } from 'move';
import { HighlightList, type HighlightItem, Section, TocRail, type TocItem } from '../../components';

const BADGES = [
  { icon: 'scroll-text', label: 'One typed spec' },
  { icon: 'git-compare', label: 'Drift-checked' },
  { icon: 'bot', label: 'AI-readable' },
];

const CONTRACTS: HighlightItem[] = [
  {
    icon: 'box',
    text: (
      <>
        <RouterLink to="/contracts/component">Component</RouterLink> — what a single component is:
        its props, slots, tokens, states, and behaviors. Every component in Move satisfies the same
        shape, so tooling can read any of them the same way.
      </>
    ),
  },
  {
    icon: 'layout-template',
    text: (
      <>
        <RouterLink to="/contracts/composite">Composite</RouterLink> — a screen or feature built by
        resolving a design pattern for your data. You pick the pattern, point it at an adapter, and
        make the decisions; Move derives the rest.
      </>
    ),
  },
  {
    icon: 'shapes',
    text: (
      <>
        <RouterLink to="/contracts/design-pattern">Design Pattern</RouterLink> — a parameterized
        pattern (a gallery, a form, a detail view) that composites are built from: its axes, and the
        laws that keep every resolution coherent.
      </>
    ),
  },
  {
    icon: 'shield-check',
    text: (
      <>
        <RouterLink to="/contracts/conformance">Conformance</RouterLink> — how the contracts are kept
        honest. The checks that fail the build the moment a spec and the code it describes drift apart.
      </>
    ),
  },
];

const TOC: TocItem[] = [
  { href: '#contracts', label: 'Overview' },
  { href: '#the-contracts', label: 'The contracts' },
];

export function ContractsOverviewPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="contracts">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Contracts</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Contracts</Heading>
          <Text color="muted" size="lg">
            Everything in Move is described by a typed spec. A component, a composite, a design
            pattern — each has a contract that says what it is. And the same file feeds the
            generators, the validators, the docs you’re reading, and the AI skills: one source of
            truth, checked for drift so it can’t quietly go stale.
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
          id="the-contracts"
          title="The contracts"
          lede="Four shapes, one idea — write the spec, and the rest follows."
        >
          <HighlightList items={CONTRACTS} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
