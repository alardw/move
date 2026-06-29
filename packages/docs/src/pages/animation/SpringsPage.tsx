import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code, Link } from 'move';
import {
  AnimationPlayground,
  CodeBlock,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

const TAGLINE =
  'Two named vocabularies for the feel of motion: springs that settle with physics, and easings that run a fixed curve for a fixed time. You pick one by name instead of tuning numbers.';

const BADGES = [
  { icon: 'wind', label: '5 springs' },
  { icon: 'spline', label: 'Standard easings' },
];

const TOC: TocItem[] = [
  { href: '#springs', label: 'Overview' },
  { href: '#the-springs', label: 'Springs' },
  { href: '#the-easings', label: 'Easings' },
  { href: '#try-it', label: 'Try it' },
  { href: '#choosing', label: 'Choosing between them' },
  { href: '#using-one', label: 'Using one' },
];

export function SpringsPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="springs">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/animation">Animation</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Springs &amp; easings</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Springs &amp; easings</Heading>
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
          id="the-springs"
          title="Springs"
          lede="A vocabulary of feels. Each name is a tuned spring you reach for by personality."
        >
          <Text>
            A spring describes motion with physics — tension and weight — so an
            element overshoots a little and settles, the way a real object does.
            It decides its own duration; you don't set one. Move tunes a set once
            and names them, so a component asks for <Code>snappy</Code> or{' '}
            <Code>poppy</Code> and gets a consistent feel without anyone picking
            numbers.
          </Text>
          <Text>
            The five cover the range you reach for — <Code>snappy</Code> and{' '}
            <Code>quick</Code> for responsive UI, <Code>poppy</Code> for a bounce,{' '}
            <Code>brisk</Code> for a light spring on slide-ins, and{' '}
            <Code>smooth</Code> for gliding large surfaces. Each is named for its
            feel, never for where it's used.
          </Text>
        </Section>

        <Section
          id="the-easings"
          title="Easings"
          lede="Fixed curves for fixed time — when a duration matters more than physics."
        >
          <Text>
            An easing runs a set curve over a <Code>duration</Code> you give it —
            no overshoot, no settle. Move exposes the standard set: <Code>linear</Code>{' '}
            for steady progress; the <Code>out…</Code> curves (<Code>outQuart</Code>,{' '}
            <Code>outCubic</Code>) for things that arrive and decelerate, like a
            fade or a reveal; <Code>inOut…</Code> for symmetric moves; and{' '}
            <Code>outBack</Code> or <Code>outElastic</Code> for a touch of
            overshoot without reaching for a spring.
          </Text>
          <Text color="muted">
            Each comes in <Code>in</Code>, <Code>out</Code>, and <Code>inOut</Code>{' '}
            across the Quad / Cubic / Quart / Expo / Circ / Back / Elastic /
            Bounce families — the full anime.js set, by name.
          </Text>
        </Section>

        <Section
          id="try-it"
          title="Try it"
          lede="Pick a spring or an easing — or dial in your own physics — and watch it move."
        >
          <AnimationPlayground />
        </Section>

        <Section
          id="choosing"
          title="Choosing between them"
          lede="Springs settle; easings run a fixed curve for a fixed time."
        >
          <Text>
            Reach for a <Text as="span" weight="medium">spring</Text> when the
            motion should feel physical — a pop, a slide, a press — and you want
            it to decide its own timing. Reach for an{' '}
            <Text as="span" weight="medium">easing</Text> when the motion must take
            an exact amount of time — a progress fill, a steady reveal — and pair
            it with a <Code>duration</Code>. Springs are the default across Move;
            easings cover the cases where time matters more than feel. Both come
            from <Link href="https://animejs.com" external>anime.js</Link> — Move
            just names the ones worth reaching for.
          </Text>
        </Section>

        <Section
          id="using-one"
          title="Using one"
          lede="Either one is the step's ease."
        >
          <Text>
            Inside a sequence, a step names its spring or easing through{' '}
            <Code>ease</Code>. A spring carries its own duration; an easing takes
            the <Code>duration</Code> you give it. Leave <Code>ease</Code> off and
            the step takes a sensible default for what it's doing.
          </Text>
          <CodeBlock
            language="ts"
            code={`{ target: 'Thumb', animation: { x: { to: 16, ease: 'poppy' } } }                       // a spring
{ target: 'Panel', animation: { opacity: { to: 1, ease: 'outQuart', duration: 200 } } } // an easing`}
          />
          <Text color="muted" size="sm">
            To swap the spring or easing a component already uses, override its
            animation from the outside — see{' '}
            <RouterLink to="/customize">Make it your own</RouterLink>.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
