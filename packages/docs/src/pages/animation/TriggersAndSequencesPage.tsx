import { useState, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code, Button, Select, InputRange, ToggleGroup, Alert, poppy } from 'move';
import type { AnimationTrigger } from 'move';
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

const STAGGER_FRUITS = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig'];

// Live, real-component stagger: a Select whose option cascade you can tune.
function SelectStaggerDemo() {
  const [value, setValue] = useState('Apple');
  const [delay, setDelay] = useState(30);

  // Select's ACTUAL entrance — each row scales up (from the trigger width, poppy
  // spring) and fades. Only the stagger delay is wired to the slider; everything
  // else mirrors the component's real config.
  const animations = useMemo<AnimationTrigger[]>(() => {
    const ITEMS = '[role="menuitem"], [class*="label"], [class*="separator"]';
    return [
      { trigger: 'open', sequence: [[
        { target: 'Content', animation: { opacity: { from: 0, to: 1, duration: 150 } } },
        { target: 'ContentInner', children: ITEMS, stagger: { delay }, animation: { scale: { from: '$scaleFrom', to: 1, ease: poppy }, opacity: { from: 0, to: 1 } } },
        { target: 'Icon', animation: { rotate: { to: 180, ease: 'outQuart', duration: 300 } } },
      ]] },
      { trigger: 'closed', sequence: [[
        { target: 'Content', animation: { opacity: { to: 0, duration: 150 } } },
        { target: 'ContentInner', children: ITEMS, stagger: { delay }, animation: { scale: { to: '$scaleFrom', ease: 'outQuart', duration: 150 }, opacity: { to: 0, duration: 150 } } },
        { target: 'Icon', animation: { rotate: { to: 0, ease: 'outQuart', duration: 300 } } },
      ]] },
    ];
  }, [delay]);

  return (
    <Stack gap="lg">
      <Text size="sm" color="muted">
        Stagger delay: <Code>{delay}ms</Code> — open the select, drag, open again.
      </Text>
      <InputRange
        min={0}
        max={100}
        step={5}
        value={delay}
        onValueChange={(v: number[]) => setDelay(v[0])}
      />
      <Select.Root value={value} onValueChange={setValue} animations={animations}>
        <Select.Trigger>
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content>
          <Select.Viewport>
            {STAGGER_FRUITS.map((f) => (
              <Select.Item key={f} value={f}>{f}</Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
    </Stack>
  );
}

// A real Alert — two steps in one Root.enter sequence: the alert scales in, and
// its icon does a bouncy pulse to draw the eye. Together = the pulse rides along
// with the entrance; In order = the alert lands first, THEN the icon highlights.
function ParallelSerialDemo() {
  const [mode, setMode] = useState('parallel');
  const [play, setPlay] = useState(0);

  const animations = useMemo<AnimationTrigger[]>(() => {
    const enter = { target: 'Root', animation: { opacity: { from: 0, to: 1, duration: 200 }, scale: { from: 0.92, to: 1, ease: poppy } } };
    const iconPulse = { target: 'Icon', animation: { scale: { from: 1, to: 1.4, ease: poppy }, loop: 1, alternate: true } };
    return [{ trigger: 'Root.enter', sequence: mode === 'parallel' ? [[enter, iconPulse]] : [enter, iconPulse] }];
  }, [mode]);

  return (
    <Stack gap="lg">
      <Stack direction="row" gap="md" align="center" wrap>
        <ToggleGroup.Root type="single" value={mode} onValueChange={(v: string) => { if (v) { setMode(v); setPlay((p) => p + 1); } }} variant="outlined" size="sm">
          <ToggleGroup.Item value="parallel">Together</ToggleGroup.Item>
          <ToggleGroup.Item value="serial">In order</ToggleGroup.Item>
        </ToggleGroup.Root>
        <Button variant="secondary" size="sm" onClick={() => setPlay((p) => p + 1)}>
          <Icon name="play" /> Replay
        </Button>
      </Stack>
      {/* key remounts the Alert, so its Root.enter sequence fires fresh each replay */}
      <Alert key={play} variant="success" icon="check" title="Changes published" animations={animations}>
        Your edits are now live.
      </Alert>
    </Stack>
  );
}

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
            code={`// a popover's entrance — the panel fades and springs up
{
  trigger: 'Content.enter',
  sequence: [
    { target: 'Content', animation: { opacity: { from: 0, to: 1 }, scale: { from: 0.88, to: 1, ease: 'quick' } } },
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
            the same frame — the way an alert scales in while its icon pulses to
            catch the eye. A step can carry an <Code>onComplete</Code> callback
            for when it finishes.
          </Text>
          <CodeBlock
            language="ts"
            code={`// Together — one nested array, both in the same frame
sequence: [
  [
    { target: 'Root', animation: { scale: { from: 0.92, to: 1, ease: poppy } } },
    { target: 'Icon', animation: { scale: { to: 1.4, ease: poppy }, loop: 1, alternate: true } },
  ],
]

// In order — top-level steps; the icon pulses only after the alert lands
sequence: [
  { target: 'Root', animation: { scale: { from: 0.92, to: 1, ease: poppy } } },
  { target: 'Icon', animation: { scale: { to: 1.4, ease: poppy }, loop: 1, alternate: true } },
]`}
          />
          <ParallelSerialDemo />
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
            code={`// Select and Autocomplete cascade their options with exactly this step
{ target: 'List', children: '[role="option"]', preset: 'popIn', stagger: { delay: 30 } }`}
          />
          <SelectStaggerDemo />
          <Text color="muted">
            More of these running in real components on{' '}
            <RouterLink to="/animation/patterns">See it in action</RouterLink>.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
