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
  { icon: 'bot', label: 'Architecture-aware' },
  { icon: 'file-code', label: 'Spec-driven' },
  { icon: 'wand-sparkles', label: 'Generation + validation' },
];

const CAPABILITIES: HighlightItem[] = [
  {
    icon: 'blocks',
    text: 'Skills can generate components, pages, and features using the same structural primitives the library already exposes.',
  },
  {
    icon: 'file-code',
    text: 'Specs give the assistant enough context to choose slots, variants, and defaults without inventing its own design language.',
  },
  {
    icon: 'scan-search',
    text: 'Validation and metadata generation keep the system inspectable instead of relying on invisible prompt conventions.',
  },
];

const TOC: TocItem[] = [
  { href: '#ai-overview', label: 'Overview' },
  { href: '#what-ai-gets', label: 'What AI gets' },
  { href: '#where-to-go-next', label: 'Next steps' },
];

export function AIOverviewPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="ai-overview">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>AI</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>AI Overview</Heading>
          <Text color="muted" size="lg">
            Move does not treat AI as an add-on. The assistant works because the UI system is already explicit enough to read.
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
          id="what-ai-gets"
          title="What the assistant actually gets"
          lede="The useful part is not the prompt alone. It is the system behind the prompt."
        >
          <HighlightList items={CAPABILITIES} />
        </Section>

        <Section
          id="where-to-go-next"
          title="Next steps"
          lede="These pages go deeper into the authoring workflow."
        >
          <HighlightList
            items={[
              {
                icon: 'brain',
                text: (
                  <>
                    Read <RouterLink to="/core-concepts/how-move-works">How Move Works</RouterLink> first if you want the architecture behind the AI story.
                  </>
                ),
              },
              {
                icon: 'wrench',
                text: (
                  <>
                    Continue to <RouterLink to="/ai/skills">Skills</RouterLink> for the concrete toolchain.
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
