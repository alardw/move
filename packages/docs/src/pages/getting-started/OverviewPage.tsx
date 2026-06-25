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
  'Finished, accessible, animated React components — so you and the AI building with you can ship real products, not just demos.';

const BADGES = [
  { icon: 'blocks', label: 'Finished components' },
  { icon: 'sparkles', label: 'Motion built in' },
  { icon: 'bot', label: 'Built for AI' },
];

const PRINCIPLES: HighlightItem[] = [
  {
    icon: 'package-check',
    text: 'Every component arrives finished. Keyboard support, focus handling, the loading and error states, the motion — it is all already inside, so you put screens together instead of wiring that behavior up from scratch.',
  },
  {
    icon: 'sparkles',
    text: 'Motion is built in, not bolted on. Components animate the same way out of the box, so the whole app feels alive and of a piece without you hand-tuning a single transition.',
  },
  {
    icon: 'palette',
    text: 'Restyle everything from one place. Color, spacing, and type come from one shared set of values, so changing the look of the whole app does not mean editing every screen.',
  },
  {
    icon: 'bot',
    text: 'AI can actually build inside it. Each component is described in a way an assistant can read, so it produces real UI that stays on-system instead of drifting from screen to screen.',
  },
];

const HOW_IT_WORKS: HighlightItem[] = [
  {
    icon: 'layout-template',
    text: 'Components are made of clearly named parts, so it is obvious how to put them together.',
  },
  {
    icon: 'toggle-left',
    text: 'Whether a component manages its own state or hands control to you is spelled out — not something you discover by trial and error.',
  },
  {
    icon: 'sparkles',
    text: 'Animation plugs into those same components, so motion stays consistent everywhere.',
  },
  {
    icon: 'file-json',
    text: 'All of it is written down in a format that tools — and AI — can read, generate, and check.',
  },
];

const WHY_AI_WORKS: HighlightItem[] = [
  {
    icon: 'bot',
    text: 'The assistant is not guessing from a screenshot. It is reading an exact description of each component.',
  },
  {
    icon: 'shield-check',
    text: 'So what it builds is predictable: the same components, used the same way, every time.',
  },
  {
    icon: 'refresh-cw',
    text: 'And the docs, the code, the demos, and the AI all stay in sync, because they come from that one description.',
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
        >
          <Text color="muted">
            If you have built frontend with AI, you know the pattern: it demos beautifully, then falls apart in real use — inconsistent across screens, inaccessible, broken at the edges (see <RouterLink to="/getting-started/what-ai-gets-wrong">what AI gets wrong</RouterLink>). Move gives the assistant a real system to build inside, so every screen behaves and feels like one product.
          </Text>
          <HighlightList items={PRINCIPLES} />
        </Section>

        <Section
          id="how-it-works"
          title="How it works"
          lede="A quick look under the hood — though none of this is something you have to think about to use Move."
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
