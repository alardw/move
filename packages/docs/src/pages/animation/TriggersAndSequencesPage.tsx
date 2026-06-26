import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code } from 'move';
import {
  CodeBlock,
  HighlightList,
  type HighlightItem,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

const TAGLINE =
  'A trigger picks the moment. A sequence is what plays. Together they describe every animation in Move.';

const BADGES = [
  { icon: 'zap', label: 'Triggers' },
  { icon: 'list-ordered', label: 'Sequences' },
];

const TRIGGER_TYPES: HighlightItem[] = [
  {
    icon: 'log-in',
    text: 'Lifecycle — fires on mount (enter) and unmount (exit). The entrances and exits from the lifecycle page.',
  },
  {
    icon: 'toggle-left',
    text: 'State — fires when a value changes, watched through the DOM. A checkbox going checked, a panel going open.',
  },
  {
    icon: 'refresh-cw',
    text: 'Deps — fires when a piece of data changes, the way a React effect re-runs. For motion that follows a prop.',
  },
  {
    icon: 'mouse-pointer-click',
    text: 'Event — fires on interaction: hover, press, key. The immediate feedback on a control.',
  },
  {
    icon: 'git-branch',
    text: 'Delegate & closest — watch a child via one handler, or react to an ancestor’s state. For compound parts that move together.',
  },
];

const TOC: TocItem[] = [
  { href: '#triggers-and-sequences', label: 'Overview' },
  { href: '#triggers', label: 'Triggers — when' },
  { href: '#sequences', label: 'Sequences — what' },
  { href: '#parallel-and-serial', label: 'Parallel and serial' },
  { href: '#stagger', label: 'Stagger' },
];

export function TriggersAndSequencesPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="triggers-and-sequences">
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
            <Breadcrumb.Page>Triggers &amp; sequences</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Triggers &amp; sequences</Heading>
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
          id="triggers"
          title="Triggers — when"
          lede="A trigger names a moment and points at the slots that should respond."
        >
          <Text>
            Each trigger watches for one kind of moment. When that moment
            arrives, the sequence attached to it plays. There are a handful of
            kinds, and most components only use two or three.
          </Text>
          <HighlightList items={TRIGGER_TYPES} />
        </Section>

        <Section
          id="sequences"
          title="Sequences — what"
          lede="A sequence is a list of steps. Each step animates a slot with a feel."
        >
          <Text>
            A step says which slot to animate, which properties to move, and the
            spring or easing to move them with. A sequence is plain data, so a
            component declares its motion as a value rather than imperative
            code.
          </Text>
          <CodeBlock
            language="ts"
            code={`{
  trigger: 'Content.enter',
  sequence: [
    { target: 'Content', animation: { opacity: { to: 1 }, y: { from: 8, to: 0 } } },
  ],
}`}
          />
        </Section>

        <Section
          id="parallel-and-serial"
          title="Parallel and serial"
          lede="Steps at the top level run in order. Nest them to run together."
        >
          <Text>
            Top-level steps play one after another, each starting when the last
            finishes. Group steps in a nested array and they play together in
            the same frame — the way an overlay fades while its panel springs
            in. A step can carry an <Code>onComplete</Code> callback for when it
            finishes.
          </Text>
          <CodeBlock
            language="ts"
            code={`sequence: [
  // these two play together
  [
    { target: 'Overlay', animation: { opacity: { to: 1 } } },
    { target: 'Content', preset: 'popIn' },
  ],
  // then this one
  { target: 'Content', animation: { y: { to: 0 } } },
]`}
          />
        </Section>

        <Section
          id="stagger"
          title="Stagger"
          lede="One step, many children, a delay between each."
        >
          <Text>
            A step that targets children animates each of them with a growing
            delay, so a list reveals top to bottom and dropdown items cascade
            in. On the way out the order reverses. It's the same step shape with
            a <Code>stagger</Code> on it.
          </Text>
          <CodeBlock
            language="ts"
            code={`{ target: 'List', children: '[role="option"]', preset: 'popIn', stagger: { delay: 30 } }`}
          />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
