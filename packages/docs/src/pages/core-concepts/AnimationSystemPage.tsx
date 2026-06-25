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
  { icon: 'sparkles', label: 'One system' },
  { icon: 'gauge', label: 'Spring-first' },
  { icon: 'accessibility', label: 'Reduced-motion aware' },
];

const THE_MODEL: HighlightItem[] = [
  {
    icon: 'zap',
    text: 'Triggers say when. Lifecycle, state change, deps change, even ancestor data-state — pick the moment, the system listens.',
  },
  {
    icon: 'list-ordered',
    text: 'Sequences say what. Parallel steps in one frame, serial steps across frames, all expressed as plain data.',
  },
  {
    icon: 'wind',
    text: 'Springs say how. A small named set (snappy, quick, poppy, gentle, slow, jelly…) so you pick a feel, not numbers.',
  },
  {
    icon: 'accessibility',
    text: 'prefers-reduced-motion is respected automatically. No per-component opt-in, no skipped frames.',
  },
];

const SUB_TOPICS: HighlightItem[] = [
  {
    icon: 'zap',
    text: 'Triggers — the full vocabulary (mount, unmount, state, deps, delegate, closest-ancestor) and when each one fits.',
  },
  {
    icon: 'list-ordered',
    text: 'Sequences — parallel vs serial steps, the `[[…]]` syntax, onComplete callbacks, conditional skips.',
  },
  {
    icon: 'wind',
    text: 'Springs & easings — the named springs Move ships and why you should reach for them before tuning numbers.',
  },
  {
    icon: 'layers',
    text: 'Stagger — animating children with a delay between them. The pattern behind list reveals, dropdown items, accordion content.',
  },
  {
    icon: 'puzzle',
    text: 'useAnimations — the consumer-facing hook that ties it all together.',
  },
];

const TOC: TocItem[] = [
  { href: '#animation-system', label: 'Overview' },
  { href: '#the-model', label: 'The model' },
  { href: '#sub-topics', label: 'Going deeper' },
];

export function AnimationSystemPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="animation-system">
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
            <Breadcrumb.Page>Animation System</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Animation System</Heading>
          <Text color="muted" size="lg">
            One animation engine for the whole library. Every component speaks
            triggers, sequences, and springs — same vocabulary everywhere, so
            motion never feels bolted on.
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
          id="the-model"
          title="The model"
          lede="Three pieces, plain data. Anything Move animates goes through them."
        >
          <HighlightList items={THE_MODEL} />
        </Section>

        <Section
          id="sub-topics"
          title="Going deeper"
          lede="Each sub-topic gets its own section below once it earns the depth."
        >
          <HighlightList items={SUB_TOPICS} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
