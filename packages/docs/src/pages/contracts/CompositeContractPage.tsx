import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code } from 'move';
import { HighlightList, type HighlightItem, Section, TocRail, type TocItem } from '../../components';

const HOLDS: HighlightItem[] = [
  { icon: 'shapes', text: <><Code>fromPattern</Code> — the design pattern this resolves, e.g. <Code>'item-gallery'</Code>.</> },
  { icon: 'plug', text: <><Code>adapter</Code> — where its data comes from. Only a root collection has one; a child tile receives its item as a prop.</> },
  { icon: 'sliders', text: <><Code>decisions</Code> — every axis of the pattern, resolved to a value. The whole set, explicit — no overrides, no deltas.</> },
  { icon: 'network', text: <><Code>children</Code> — each delegated slot mapped to the child composite that fills it, e.g. <Code>{`{ item: 'ApodCard' }`}</Code>.</> },
  { icon: 'languages', text: <><Code>labels</Code> — the user-facing strings this instance renders, for i18n.</> },
];

const TOC: TocItem[] = [
  { href: '#composite', label: 'Overview' },
  { href: '#shape', label: 'What it holds' },
];

export function CompositeContractPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="composite">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/contracts">Contracts</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Composite</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Composite Contract</Heading>
          <Text color="muted" size="lg">
            A composite is a resolved pattern instance — a whole screen or feature, described by a
            small spec. You pick a{' '}
            <RouterLink to="/contracts/design-pattern">design pattern</RouterLink>, point it at an
            adapter for your data, and make the decisions; Move derives the composition, the
            behaviors, the component, and the tests from there.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft" color="yellow"><Icon name="hard-hat" />Being finalized</Badge>
          </Stack>
        </Stack>

        <Section
          id="shape"
          title="What it holds"
          lede="Just the source — the pattern, the data, the decisions, the children, and the copy. Everything else is derived, not stored."
        >
          <Stack gap="md">
            <HighlightList items={HOLDS} />
            <Text color="muted" size="sm">
              This page is still being written. The <Code>CompositeSpec</Code> shape is settling as we
              build real composites — an earlier layout-tree idea that used to live here has been
              replaced by the pattern-plus-decisions model above. The current type is{' '}
              <Code>CompositeSpec</Code> (exported from <Code>move</Code>); you can see it resolved in
              the nasa-explorer example’s <Code>ApodGallery</Code> and <Code>ApodCard</Code> specs. A
              full walkthrough — every field, with a real spec shown inline — lands once the shape is
              locked.
            </Text>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
