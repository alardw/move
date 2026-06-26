import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code, Link } from 'move';
import {
  CodeBlock,
  HighlightList,
  type HighlightItem,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

const TAGLINE =
  'Move ships a small set of named springs. You pick a feel by name instead of tuning numbers.';

const BADGES = [
  { icon: 'wind', label: '11 springs' },
  { icon: 'spline', label: 'Easings when you need them' },
];

const FEEL_SPRINGS: HighlightItem[] = [
  { icon: 'zap', text: 'snappy — quick and responsive. Buttons and small controls.' },
  { icon: 'zap', text: 'quick — a touch looser than snappy.' },
  { icon: 'sparkles', text: 'poppy — bouncy and playful. Scale pops and lively entrances.' },
  { icon: 'wind', text: 'gentle — slow and soft.' },
  { icon: 'feather', text: 'slow — elegant. Large elements and page transitions.' },
  { icon: 'feather', text: 'lazy — slower still, for unhurried motion.' },
  { icon: 'candy', text: 'jelly — wobbly and fun. Notifications and playful touches.' },
  { icon: 'minus', text: 'stiff — minimal overshoot. Controlled, precise motion.' },
];

const TUNED_SPRINGS: HighlightItem[] = [
  { icon: 'message-square', text: 'tooltip — feather-light, for tooltips and small popovers.' },
  { icon: 'panel-left', text: 'sidebar — smooth and steady, for the sidebar and overlays.' },
  { icon: 'arrow-right', text: 'pagination — moderate overshoot, for sliding indicators.' },
];

const TOC: TocItem[] = [
  { href: '#springs', label: 'Overview' },
  { href: '#the-springs', label: 'The springs' },
  { href: '#springs-vs-easings', label: 'Springs vs easings' },
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
          <Heading level={1} weight="normal">Springs &amp; easings</Heading>
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
          title="The springs"
          lede="A vocabulary of feels. Each name is a tuned spring you reach for by personality."
        >
          <Text>
            A spring describes motion with physics — tension and weight — so an
            element overshoots a little and settles, the way a real object does.
            Move tunes a set of them once and names them, so a component asks for{' '}
            <Code>snappy</Code> or <Code>poppy</Code> and gets a consistent feel
            without anyone picking numbers.
          </Text>
          <HighlightList items={FEEL_SPRINGS} />
          <Text>
            Three more are tuned for a specific component and named after where
            they're used — <Code>tooltip</Code>, <Code>sidebar</Code>, and{' '}
            <Code>pagination</Code>. They're springs like the rest; they exist so
            those components stay consistent, and you can reach for them anywhere
            the feel fits.
          </Text>
          <HighlightList items={TUNED_SPRINGS} />
        </Section>

        <Section
          id="springs-vs-easings"
          title="Springs vs easings"
          lede="Springs settle. Easings run a fixed curve for a fixed time."
        >
          <Text>
            A spring decides its own duration from its physics. When you instead
            need motion to take an exact amount of time — a progress fill, a
            steady reveal — reach for a named easing like <Code>outQuart</Code>{' '}
            with a duration. Springs are the default across Move; easings cover
            the cases where time matters more than feel. Both come from{' '}
            <Link href="https://animejs.com" external>anime.js</Link> — Move just
            names the ones worth reaching for.
          </Text>
        </Section>

        <Section
          id="using-one"
          title="Using one"
          lede="A spring is the ease on a step."
        >
          <Text>
            Inside a sequence, a step names its spring through <Code>ease</Code>.
            Leave it off and the step takes a sensible default for what it's
            doing.
          </Text>
          <CodeBlock
            language="ts"
            code={`{ target: 'Thumb', animation: { x: { to: 16, ease: 'poppy' } } }`}
          />
          <Text color="muted" size="sm">
            To swap the spring a component already uses, override its animation
            from the outside — see{' '}
            <RouterLink to="/customize">Make it your own</RouterLink>.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
