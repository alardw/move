import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code } from 'move';
import {
  HighlightList,
  type HighlightItem,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

/**
 * Getting started → Overview. The front door of the docs. Leads with
 * the architecture that makes Move predictable for both people and AI.
 */

const TAGLINE =
  'A structured, typed UI system designed for AI-assisted product development.';

const BADGES = [
  { icon: 'blocks', label: 'Architecture-first' },
  { icon: 'sparkles', label: 'Animation as system' },
  { icon: 'bot', label: 'AI as structure' },
];

const PRINCIPLES: HighlightItem[] = [
  {
    icon: 'file-code',
    text: 'Move starts with a structured component contract. Slots, variants, controlled patterns, animation wiring, and token resolution are part of the architecture, not implied by convention.',
  },
  {
    icon: 'sparkles',
    text: 'Animation is a unified subsystem, not a surface enhancement. Motion behavior is defined as part of the system instead of being bolted onto isolated components.',
  },
  {
    icon: 'palette',
    text: 'Theming is token-first. Color, spacing, radius, typography, and slot props resolve through shared tokens so customization stays structural instead of brittle.',
  },
  {
    icon: 'bot',
    text: 'AI works because it can read the same contract. Specs give coding agents enough structure to generate, validate, and extend UI without drifting away from the system.',
  },
];

const HOW_IT_WORKS: HighlightItem[] = [
  {
    icon: 'layout-template',
    text: 'Components expose named slots and supported composition patterns so structure is explicit.',
  },
  {
    icon: 'toggle-left',
    text: 'State behavior is typed. Controlled and uncontrolled paths are documented instead of inferred from implementation details.',
  },
  {
    icon: 'sparkles',
    text: 'Motion hooks into those same components through shared trigger types and animation wiring.',
  },
  {
    icon: 'file-json',
    text: 'Specs describe all of the above in a machine-readable form that generation and validation tools can use.',
  },
];

const WHY_AI_WORKS: HighlightItem[] = [
  {
    icon: 'bot',
    text: 'The assistant is not guessing from screenshots or naming vibes. It is reading typed specs and component metadata.',
  },
  {
    icon: 'shield-check',
    text: 'That shared contract makes generated output more deterministic: the same slots, the same variants, the same composition patterns.',
  },
  {
    icon: 'refresh-cw',
    text: 'Docs, source, demos, and AI workflows can stay aligned because they are derived from or checked against the same structural definition.',
  },
];

const USE_MOVE_IF: HighlightItem[] = [
  {
    icon: 'check',
    text: 'You want a UI layer that is predictable enough for both engineers and coding agents to work inside the same system.',
  },
  {
    icon: 'check',
    text: 'You care about interaction quality and want motion to be a built-in part of the component model rather than a separate pass.',
  },
  {
    icon: 'check',
    text: 'You want theming and extension points to stay typed and systematic instead of dissolving into one-off overrides.',
  },
];

const NOT_FOR_YOU_IF: HighlightItem[] = [
  {
    icon: 'x',
    text: 'You want shadcn’s CLI workflow as your default — every component pulled into your repo as editable source with tooling to keep them in sync. Move is an installed package first; forking a component into your codebase is supported but not the headline path.',
  },
  {
    icon: 'x',
    text: 'You do not care about AI-assisted development. The library still works, but a large part of the leverage comes from the spec-aware workflow.',
  },
  {
    icon: 'x',
    text: 'You need the maturity and extension ecosystem of a much older library. Move is still defining its shape.',
  },
];

const TOC: TocItem[] = [
  { href: '#overview', label: 'Overview' },
  { href: '#principles', label: 'What Move is' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#ai-works', label: 'Why AI works' },
  { href: '#for-you-if', label: 'Use Move if…' },
  { href: '#not-for-you-if', label: '…or skip it if' },
  { href: '#next-steps', label: 'Next steps' },
];

export function OverviewPage() {
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
            <Breadcrumb.Page>Getting started</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Move UI</Heading>
          <Text color="muted" size="lg">{TAGLINE}</Text>
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
          id="principles"
          title="What Move is"
          lede="If you have built frontend with AI, you know the pattern: one screen looks right, the next comes back as raw HTML and custom CSS, and by the third prompt the product already feels inconsistent. Move gives the assistant a real system to build inside, so every screen behaves and feels like one product."
        >
          <Text color="muted">
            See <RouterLink to="/getting-started/what-ai-gets-wrong">What AI gets wrong</RouterLink> for the failure modes in detail and how Move closes each one.
          </Text>
          <HighlightList items={PRINCIPLES} />
        </Section>

        <Section
          id="how-it-works"
          title="How it works"
          lede="Architecture comes first. AI follows because the system is already explicit."
        >
          <HighlightList items={HOW_IT_WORKS} />
        </Section>

        <Section
          id="ai-works"
          title="Why AI works in Move"
          lede="You do not prompt into chaos. You prompt into a system."
        >
          <Stack gap="sm">
            <HighlightList items={WHY_AI_WORKS} />
            <Text>
              In practice, prompts like <Code>build a settings page with profile, notifications, and security sections</Code> can land in the system&apos;s existing patterns because the architecture is already defined.
            </Text>
          </Stack>
        </Section>

        <Section
          id="for-you-if"
          title="Use Move if…"
        >
          <HighlightList items={USE_MOVE_IF} />
        </Section>

        <Section
          id="not-for-you-if"
          title="…or skip it if"
          lede="Move has a specific shape. These are the edges."
        >
          <HighlightList items={NOT_FOR_YOU_IF} />
        </Section>

        <Section
          id="next-steps"
          title="Next steps"
        >
          <HighlightList
            items={[
              {
                icon: 'brain',
                text: (
                  <>
                    Start with <RouterLink to="/core-concepts/how-move-works">How Move Works</RouterLink> to get the mental model before you browse APIs.
                  </>
                ),
              },
              {
                icon: 'download',
                text: (
                  <>
                    Then go to <RouterLink to="/getting-started/installation">Installation</RouterLink> to get a project rendering.
                  </>
                ),
              },
              {
                icon: 'bot',
                text: (
                  <>
                    Continue to <RouterLink to="/ai">AI Overview</RouterLink> if you want the spec-aware workflow and skills layer.
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
