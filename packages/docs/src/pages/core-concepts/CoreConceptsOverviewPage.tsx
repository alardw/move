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
  { icon: 'brain', label: 'System-first' },
  { icon: 'bot', label: 'AI-readable' },
  { icon: 'sparkles', label: 'Animation-aware' },
];

const PILLARS: HighlightItem[] = [
  {
    icon: 'blocks',
    text: 'Component contracts define slots, variants, state patterns, and token hooks explicitly.',
  },
  {
    icon: 'sparkles',
    text: 'Animation is wired as part of the system, not patched in as per-component decoration.',
  },
  {
    icon: 'palette',
    text: 'Themes resolve through shared tokens so overrides stay structural instead of ad hoc.',
  },
  {
    icon: 'bot',
    text: 'AI skills work because they can read the same contract the components and docs use.',
  },
];

const TOC: TocItem[] = [
  { href: '#core-concepts', label: 'Overview' },
  { href: '#pillars', label: 'Pillars' },
  { href: '#next-steps', label: 'Next steps' },
];

export function CoreConceptsOverviewPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="core-concepts">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Core Concepts</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Core Concepts</Heading>
          <Text color="muted" size="lg">
            Move is easier to use once you read it as a system: contract, animation, theming, then AI.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            {BADGES.map((badge) => (
              <Badge key={badge.label} variant="soft">
                <Icon name={badge.icon} />
                {badge.label}
              </Badge>
            ))}
          </Stack>
        </Stack>

        <Section
          id="pillars"
          title="What this section covers"
          lede="These pages explain the architecture that makes Move consistent for both humans and coding agents."
        >
          <HighlightList items={PILLARS} />
        </Section>

        <Section
          id="next-steps"
          title="Next steps"
          lede="Start with the mental model page, then dive deeper into the subsystem you need."
        >
          <HighlightList
            items={[
              {
                icon: 'brain',
                text: (
                  <>
                    Read <RouterLink to="/core-concepts/how-move-works">How Move Works</RouterLink> for the full mental model.
                  </>
                ),
              },
              {
                icon: 'bot',
                text: (
                  <>
                    Continue to <RouterLink to="/ai">AI Overview</RouterLink> to see how skills use the contract.
                  </>
                ),
              },
            ]}
          />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
