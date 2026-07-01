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
  { icon: 'brain', label: 'Mental model' },
  { icon: 'blocks', label: 'Typed contract' },
  { icon: 'bot', label: 'AI-readable' },
];

const CONTRACT_POINTS: HighlightItem[] = [
  {
    icon: 'layout-template',
    text: 'Each component declares its structure up front: slots, variants, defaults, and supported composition patterns.',
  },
  {
    icon: 'toggle-left',
    text: 'Controlled and uncontrolled behaviors are explicit, so state wiring is predictable instead of inferred.',
  },
  {
    icon: 'sparkles',
    text: 'Animation types are part of the component model, which keeps motion consistent across primitives and composites.',
  },
  {
    icon: 'palette',
    text: 'Visual changes resolve through tokens, which keeps theming attached to the same contract rather than hard-coded styles.',
  },
];

const AI_POINTS: HighlightItem[] = [
  {
    icon: 'file-code',
    text: 'Specs describe the component in a form that docs, generation, validation, and AI tooling can all read.',
  },
  {
    icon: 'shield-check',
    text: 'That shared source of truth narrows ambiguity: the assistant is generating into a system, not improvising from screenshots.',
  },
  {
    icon: 'refresh-cw',
    text: 'When the contract changes, the rest of the pipeline can be regenerated or checked against it to keep drift visible.',
  },
];

const TOC: TocItem[] = [
  { href: '#how-move-works', label: 'Overview' },
  { href: '#component-contract', label: 'Component contract' },
  { href: '#ai-reads-specs', label: 'How AI reads specs' },
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
            Move works because the architecture is explicit. Components, motion, tokens, and AI all point at the same contract.
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
          id="component-contract"
          title="The component contract"
          lede="Move components are not just rendered output. They are typed structures with named surfaces that tooling can reason about."
        >
          <HighlightList items={CONTRACT_POINTS} />
          <Text>
            See the full <RouterLink to="/core-concepts/component-contract">Component Contract</RouterLink> for every field every spec carries — taxonomies, composition, lifecycle, tests, tooling, and how each is enforced.
          </Text>
        </Section>

        <Section
          id="ai-reads-specs"
          title="How AI reads specs"
          lede="Move's AI layer is useful because it is grounded in the same source material used to generate and validate the library."
        >
          <HighlightList items={AI_POINTS} />
        </Section>

        <Section
          id="why-it-matters"
          title="Why it matters"
          lede="This is the core promise of the system."
        >
          <Text>
            You do not prompt into chaos. You prompt into a typed UI system where composition rules, motion behavior, and token boundaries are already defined.
          </Text>
          <Text>
            From here: read the <RouterLink to="/core-concepts/component-contract">Component Contract</RouterLink> for the full shape every spec satisfies, or browse <RouterLink to="/components">Components</RouterLink> to see the contract applied across the library.
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
