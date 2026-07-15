import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge } from 'move';
import { HighlightList, type HighlightItem, Section, TocRail, type TocItem } from '../../components';

const BADGES = [
  { icon: 'scroll-text', label: 'One typed spec' },
  { icon: 'git-compare', label: 'Kept honest' },
];

const READERS: HighlightItem[] = [
  { icon: 'wand-sparkles', text: 'The generators scaffold the source and the tests from it.' },
  { icon: 'shield-check', text: 'The validators check that the code still matches what the spec promised.' },
  { icon: 'book-open', text: 'The docs you’re reading render their prop and token tables straight from it.' },
  { icon: 'bot', text: 'The AI skills build with Move by reading the same description.' },
];

const TOC: TocItem[] = [
  { href: '#contracts', label: 'Overview' },
  { href: '#one-spec', label: 'One spec, many readers' },
  { href: '#conformance', label: 'Kept honest' },
  { href: '#the-contracts', label: 'The contracts' },
];

export function ContractsPage() {
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
            <Breadcrumb.Link asChild>
              <RouterLink to="/core-concepts">Core Concepts</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Contracts</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Contracts</Heading>
          <Text color="muted" size="lg">
            Everything in Move — a component, a composite, a design pattern — is described by a typed
            spec: a plain, complete account of what it is. That one file is the contract, and it’s the
            thing the whole system agrees on.
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
          id="one-spec"
          title="One spec, many readers"
          lede="Write it once; everything downstream reads the same file — so nothing can quietly disagree."
        >
          <HighlightList items={READERS} />
        </Section>

        <Section
          id="conformance"
          title="Kept honest"
          lede="A contract only helps if the code keeps its word."
        >
          <Text>
            Conformance is the enforcement half. A set of checks compares each spec against the source
            it describes — the props, the slots, the default values, the tokens — and fails the build
            the moment they drift apart. So the docs, the generators, and the assistant can trust the
            spec is still true without anyone re-verifying it by hand. It’s the difference between a
            contract and a comment.
          </Text>
        </Section>

        <Section
          id="the-contracts"
          title="The contracts"
          lede="Each kind of thing has its own shape — walked through field by field in their own section."
        >
          <Text>
            The <RouterLink to="/contracts">Contracts</RouterLink> section covers each one: the{' '}
            <RouterLink to="/contracts/component">Component</RouterLink> spec, the{' '}
            <RouterLink to="/contracts/composite">Composite</RouterLink> spec, the{' '}
            <RouterLink to="/contracts/design-pattern">Design Pattern</RouterLink> spec, and the{' '}
            <RouterLink to="/contracts/conformance">Conformance</RouterLink> model that enforces them.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
