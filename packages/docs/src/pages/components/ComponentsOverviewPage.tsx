import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge } from 'move';
import {
  HighlightList,
  type HighlightItem,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

const BADGES = [
  { icon: 'blocks', label: '65+ components' },
  { icon: 'search', label: 'Search + filter' },
];

const WHATS_HERE: HighlightItem[] = [
  {
    icon: 'search',
    text: 'Search by name, by what it does, or by what it pairs with. The fastest way to find the right primitive.',
  },
  {
    icon: 'filter',
    text: 'Filter by category — layout, input, navigation, overlay, feedback, data, media. The sidebar groups by spec; here you can slice across.',
  },
  {
    icon: 'image',
    text: 'Preview thumbnails so you recognize what you\'re reaching for before clicking through.',
  },
  {
    icon: 'list-todo',
    text: 'A transparent "still to come" list at the bottom — components on the roadmap that aren\'t shipped yet.',
  },
];

const TOC: TocItem[] = [
  { href: '#components-overview', label: 'Overview' },
  { href: '#whats-here', label: 'What\'s here' },
];

export function ComponentsOverviewPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="components-overview">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Components</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Components</Heading>
          <Text color="muted" size="lg">
            Every Move primitive, in one place. Skim the previews, search by
            name, or filter by category to find the right building block.
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
          id="whats-here"
          title="What's here"
          lede="An index, not a tour. The sidebar still lists everything alphabetically — this page is for when you want to browse by purpose."
        >
          <HighlightList items={WHATS_HERE} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
