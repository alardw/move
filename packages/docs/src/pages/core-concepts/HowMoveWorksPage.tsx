import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Card, Code } from 'move';
import {
  HighlightList,
  type HighlightItem,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

const BADGES = [
  { icon: 'blocks', label: 'Components' },
  { icon: 'bot', label: 'AI skills' },
  { icon: 'shield-check', label: 'Conformance checks' },
];

const COMPONENT_POINTS: HighlightItem[] = [
  {
    icon: 'shield-check',
    text: 'The hard parts are already inside — keyboard, focus handling, collision flipping, overflow. You place the component; the behavior comes with it.',
  },
  {
    icon: 'accessibility',
    text: 'Accessibility and motion come as standard — the right semantics and focus behavior, WCAG-legible color, and consistent animation, light mode and dark.',
  },
  {
    icon: 'life-buoy',
    text: 'The un-happy path has components of its own — EmptyState, Skeleton, Alert, inline field errors, Toast — so handling missing data, a wait, or a wrong input is composition, with the parts already there.',
  },
];

const SKILL_POINTS: HighlightItem[] = [
  {
    icon: 'git-branch',
    text: 'A skill walks it through the build — describe, assemble, check — the same pipeline Move runs on itself.',
  },
  {
    icon: 'shield-check',
    text: 'So what it produces is predictable: the same components, composed the same way, every time.',
  },
];

const CONFORMANCE_POINTS: HighlightItem[] = [
  {
    icon: 'boxes',
    text: 'Everything is a component or a composite — a component standard from Move or one you generate yourself, a composite your arrangement of them — and each is defined by one typed contract.',
  },
  {
    icon: 'refresh-cw',
    text: 'That one contract does four jobs: it builds the code, generates its tests, guides the AI that composes it, and checks the result.',
  },
  {
    icon: 'shield-check',
    text: 'The same two contracts run on your project. As you and the AI add components and composites, they’re held to them automatically.',
  },
];

const TOC: TocItem[] = [
  { href: '#how-move-works', label: 'Overview' },
  { href: '#building-blocks', label: 'Building blocks' },
  { href: '#ai-skills', label: 'AI skills' },
  { href: '#conformance', label: 'Conformance checks' },
  { href: '#why-it-matters', label: 'Why it matters' },
];

export function HowMoveWorksPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="how-move-works">
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
            <Breadcrumb.Page>How Move Works</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>How Move Works</Heading>
          <Text color="muted" size="lg">
            Move is a framework with three parts — components, AI skills that compose them, and conformance checks that keep them true — tied together by one idea: a contract behind every one.
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
          id="building-blocks"
          title="The building blocks"
          lede="A component is a finished piece of behavior you compose — the whole thing done, edges and all."
        >
          <HighlightList items={COMPONENT_POINTS} />
          <Text>
            Behind each component is one contract — a plain account of how it looks, behaves, and composes. The component itself, this page’s prop and token tables, the assistant, and the checks all work from that single description, so they can’t fall out of step. See the full <RouterLink to="/contracts/component">Component Contract</RouterLink> for what one carries.
          </Text>
        </Section>

        <Section
          id="ai-skills"
          title="AI skills compose them"
          lede="You don’t prompt into chaos. The assistant builds through skills."
        >
          <Text>
            Ask for a settings page and the assistant follows a skill — reading each component’s contract, the same agreement Move used to build and test that component. It works from the manual the framework was made from, not a picture of it.
          </Text>
          <HighlightList items={SKILL_POINTS} />
          <Text>
            See the <RouterLink to="/ai/skills">skills</RouterLink> and the workflow they drive.
          </Text>
        </Section>

        <Section
          id="conformance"
          title="Conformance keeps it honest"
          lede="None of it is propped up by hand."
        >
          <HighlightList items={CONFORMANCE_POINTS} />
          <Card.Root>
            <Card.Body>
              <Text size="lg">
                One contract each — it builds the code, tests it, guides the AI, and checks your
                work. Automatically, no handwork. And there are only two:{' '}
                <RouterLink to="/contracts/component">a component</RouterLink> or{' '}
                <RouterLink to="/contracts/composite">a composite</RouterLink>. That’s
                the whole system.
              </Text>
            </Card.Body>
          </Card.Root>
        </Section>

        <Section
          id="why-it-matters"
          title="Why it matters"
          lede="The core promise."
        >
          <Text>
            You’re pointing AI at a real framework with the hard parts already solved — composition, motion, theming, and accessibility, all defined before you start. What it builds is a product that holds together.
          </Text>
          <Text>
            From here: read the <RouterLink to="/contracts/component">Component Contract</RouterLink> for the full shape every component satisfies, or browse <RouterLink to="/components">Components</RouterLink> to see it applied across the library.
          </Text>

          <Card.Root>
            <Card.Body>
              <Stack gap="sm">
                <Text size="lg">
                  “Dogfooding caught me hand-rolling <Code>{'<strong>'}</Code> and styled tables in the
                  very page that preaches ‘bring your own X.’ That’s the whole point working.”
                </Text>
                <Text size="sm" color="muted">
                  — Claude Opus 4.8, the first time the audit ran against these docs
                </Text>
              </Stack>
            </Card.Body>
          </Card.Root>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
