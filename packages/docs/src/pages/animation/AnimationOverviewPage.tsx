import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Button, Code, Link } from 'move';
import {
  HighlightList,
  type HighlightItem,
  Preview,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

const TAGLINE =
  'Every Move component animates through one system — the same triggers, sequences, and springs everywhere.';

const BADGES = [
  { icon: 'sparkles', label: 'Built in' },
  { icon: 'wind', label: 'Spring-first' },
  { icon: 'accessibility', label: 'Reduced-motion aware' },
];

const DOORS: HighlightItem[] = [
  {
    icon: 'activity',
    text: (
      <>
        <RouterLink to="/animation/lifecycle">Lifecycle</RouterLink> — the
        three moments a component animates: when it enters, when its state
        changes, and when it leaves.
      </>
    ),
  },
  {
    icon: 'zap',
    text: (
      <>
        <RouterLink to="/animation/motions-and-sequences">
          Motions &amp; sequences
        </RouterLink>{' '}
        — the two ideas the whole system rests on: when an animation fires,
        and what plays when it does.
      </>
    ),
  },
  {
    icon: 'wind',
    text: (
      <>
        <RouterLink to="/animation/springs">Springs &amp; easings</RouterLink>{' '}
        — the named springs that give Move its feel, and when to reach for a
        plain easing instead.
      </>
    ),
  },
  {
    icon: 'puzzle',
    text: (
      <>
        <RouterLink to="/animation/patterns">See it in action</RouterLink> —
        the ready-made patterns the components are built from, live.
      </>
    ),
  },
  {
    icon: 'code',
    text: (
      <>
        <RouterLink to="/animation/reference">Reference</RouterLink> — the
        hook, the runtime functions, and the utilities, for when you drive
        animation yourself.
      </>
    ),
  },
];

const TOC: TocItem[] = [
  { href: '#animation', label: 'Overview' },
  { href: '#built-in', label: 'Built in, not bolted on' },
  { href: '#one-system', label: 'One system' },
  { href: '#anime-js', label: 'Running on anime.js' },
  { href: '#reduced-motion', label: 'Reduced motion' },
  { href: '#going-deeper', label: 'Going deeper' },
];

export function AnimationOverviewPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="animation">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Animation</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Animation</Heading>
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
          id="built-in"
          title="Built in, not bolted on"
          lede="The motion ships with the component. You don't wire it up."
        >
          <Text>
            A button presses in under the cursor. A dialog springs onto the
            screen and traps focus. A toast slides up, counts down, and clears
            itself out. None of that is something you add — it's how the
            components behave the moment you render them.
          </Text>
          <Preview
            code={`import { Button } from 'move';

<Button>Press me</Button>`}
          >
            <Button>Press me</Button>
          </Preview>
          <Text color="muted" size="sm">
            Hover and press the button — the scale response is the animation
            system at work, with nothing wired up on this page.
          </Text>
        </Section>

        <Section
          id="one-system"
          title="One system"
          lede="Three pieces, the same everywhere Move animates."
        >
          <Text>
            Every animation in Move is described the same way, so motion reads
            as one product instead of a per-component grab bag.
          </Text>
          <HighlightList
            items={[
              {
                icon: 'zap',
                text: 'Triggers say when. A mount, an unmount, a state change, a hover — the system watches for the moment.',
              },
              {
                icon: 'list-ordered',
                text: 'Sequences say what. The steps that play, in parallel within a frame or in order across frames.',
              },
              {
                icon: 'wind',
                text: 'Springs say how. A named feel like snappy or poppy, so you choose a personality, not a curve.',
              },
            ]}
          />
        </Section>

        <Section
          id="anime-js"
          title="Running on anime.js"
          lede="A small engine with real spring physics, wrapped so you never touch it."
        >
          <Text>
            Move's motion runs on{' '}
            <Link href="https://animejs.com" external>anime.js</Link>. It brings
            spring physics — what makes motion feel like it has weight rather
            than following a fixed curve — along with a full set of easing
            curves for the cases where you want a fixed timing instead. Move
            wraps it end to end: you pick a named spring, the components feed it
            the right values, and anime.js draws the frames. You never import it
            yourself, and components never reach for it directly.
          </Text>
        </Section>

        <Section
          id="reduced-motion"
          title="Reduced motion"
          lede="Honored automatically, library-wide."
        >
          <Text>
            When a visitor has <Code>prefers-reduced-motion</Code> set, Move
            settles elements to their end state instead of animating to it.
            There's no per-component opt-in and no half-played frames — the
            whole library respects the setting at once.
          </Text>
        </Section>

        <Section
          id="going-deeper"
          title="Going deeper"
          lede="The rest of the section, from how a component behaves to the API underneath."
        >
          <HighlightList items={DOORS} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
