import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Stack, Heading, Text, Breadcrumb, Icon, Badge, Code,
  Button, Collapsible, Tooltip, Select, Drawer,
  InputRange, ToggleGroup, Alert, Popover, Checkbox, poppy,
} from 'move';
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
  'How an animation is built: the property format, the self-explaining motions, and the triggers and sequences that wire them to a moment.';

const BADGES = [
  { icon: 'package', label: '8 motions' },
  { icon: 'zap', label: 'Triggers' },
  { icon: 'list-ordered', label: 'Sequences' },
];

const TOC: TocItem[] = [
  { href: '#motions-and-sequences', label: 'Overview' },
  { href: '#anatomy', label: 'Anatomy' },
  { href: '#property-format', label: 'The property format' },
  { href: '#motions', label: 'Motions' },
  { href: '#triggers', label: 'Triggers — when' },
  { href: '#sequences', label: 'Sequences — what' },
  { href: '#parallel-and-serial', label: 'Parallel and serial' },
  { href: '#stagger', label: 'Stagger' },
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

// =============================================================================
// Motions — each illustrated by the real Move component that makes it, paired
// with the FULL config (trigger → sequence → target → motion) that drives it.
// =============================================================================

function CollapsibleDemo() {
  return (
    <Collapsible.Root>
      <Stack gap="sm">
        <Collapsible.Trigger>
          <Stack direction="row" gap="sm" align="center">
            <Text weight="medium">Toggle me</Text>
            <Collapsible.Icon />
          </Stack>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <Text size="sm" color="muted">The caret rotates as this panel expands.</Text>
        </Collapsible.Content>
      </Stack>
    </Collapsible.Root>
  );
}

function SelectDemo() {
  const [value, setValue] = useState('Apple');
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Content>
        <Select.Viewport>
          {['Apple', 'Banana', 'Cherry', 'Date'].map((f) => (
            <Select.Item key={f} value={f}>{f}</Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  );
}

function DrawerDemo() {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="primary">Open drawer</Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header><Drawer.Title>Filters</Drawer.Title></Drawer.Header>
          <Drawer.Body>
            <Drawer.Description>The panel slides in from the edge; the overlay fades.</Drawer.Description>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

const DEMOS: { motions: string; code: string; caption: string; render: () => ReactNode }[] = [
  {
    motions: 'scaleUp · scaleDown',
    code: `[
  { trigger: 'Root.hover', sequence: [{ animation: scaleUp() }] },   // scale → 1.04
  { trigger: 'Root.press', sequence: [{ animation: scaleDown() }] }, // scale → 0.96
]`,
    caption: 'Hover and press — the button grows, then dips.',
    render: () => <Button variant="primary">Hover &amp; press me</Button>,
  },
  {
    motions: 'rotate · expand · collapse',
    code: `[
  { trigger: 'open', sequence: [
    { target: 'Content', animation: expand() },
    { target: 'Icon',    animation: rotate(0, 180) },
  ]},
  { trigger: 'closed', sequence: [
    { target: 'Content', animation: collapse() },
    { target: 'Icon',    animation: rotate(180, 0) },
  ]},
]`,
    caption: 'Toggle — the caret rotates as the panel expands.',
    render: () => <CollapsibleDemo />,
  },
  {
    motions: 'scaleIn · slideUp · fadeIn',
    code: `[
  {
    trigger: 'Content.enter',
    sequence: [
      { target: 'Content', animation: { ...scaleIn(0.88), ...slideUp(6), ...fadeIn() } },
    ],
  },
]`,
    caption: 'Hover — the tooltip pops in.',
    render: () => <Tooltip label="Pops in with scale + slide + fade"><Button variant="primary">Hover for a tooltip</Button></Tooltip>,
  },
  {
    motions: 'scaleIn · fadeIn (stagger)',
    code: `[
  {
    trigger: 'open',
    sequence: [
      { target: 'List', children: '[role="option"]',
        animation: { ...scaleIn(0.8), ...fadeIn() }, stagger: { delay: 30 } },
    ],
  },
]`,
    caption: 'Open — the options pop in.',
    render: () => <SelectDemo />,
  },
  {
    motions: 'slideLeft · fadeIn',
    code: `[
  {
    trigger: 'Content.enter',
    sequence: [
      { target: 'Content', animation: slideLeft() },
      { target: 'Overlay', animation: fadeIn() },
    ],
  },
]`,
    caption: 'Open — the drawer slides in, the overlay fades.',
    render: () => <DrawerDemo />,
  },
];

function MotionGallery() {
  return (
    <Stack gap="xl">
      {DEMOS.map((d) => (
        <Stack key={d.motions} gap="sm">
          <Stack direction="row" gap="sm" align="center" wrap>
            <Code>{d.motions}</Code>
            <Text size="sm" color="muted">{d.caption}</Text>
          </Stack>
          <CodeBlock language="ts" code={d.code} />
          <div
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--move-rounded-lg)',
              border: '1px solid var(--move-border-base)',
              background: 'var(--move-bg-subtle)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {d.render()}
          </div>
        </Stack>
      ))}
    </Stack>
  );
}

// =============================================================================
// Triggers & sequences — live concept demos.
// =============================================================================

// Real components firing two of the trigger kinds — hover/press a Button (event)
// and toggle a Checkbox (state) to feel "a trigger names a moment".
function TriggerDemo() {
  return (
    <Stack direction="row" gap="xl" wrap align="start">
      <Stack gap="xs" align="start">
        <Badge variant="soft"><Icon name="mouse-pointer-click" />Event</Badge>
        <Button variant="primary">Hover &amp; press me</Button>
        <Text size="sm" color="muted">Fires on interaction.</Text>
      </Stack>
      <Stack gap="xs" align="start">
        <Badge variant="soft"><Icon name="toggle-left" />State</Badge>
        <Checkbox defaultChecked>Toggle me</Checkbox>
        <Text size="sm" color="muted">Fires when the value changes.</Text>
      </Stack>
    </Stack>
  );
}

// The sequence above, on a real component: open the Popover and its Content slot
// plays its enter sequence (scale + fade).
function SequenceDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="primary">Show details</Button>
      </Popover.Trigger>
      <Popover.Content sideOffset={8}>
        <Stack gap="sm">
          <Text weight="medium">A small overlay</Text>
          <Text size="sm" color="muted">It scales and fades in — the sequence above, on a real component.</Text>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  );
}

// A real Alert — two steps in one Root.enter sequence: the alert scales in, and
// its icon does a bouncy pulse to draw the eye. Together = the pulse rides along
// with the entrance; In order = the alert lands first, THEN the icon highlights.
function ParallelSerialDemo() {
  const [mode, setMode] = useState('parallel');
  const [play, setPlay] = useState(0);

  const animations = useMemo<AnimationTrigger[]>(() => {
    // Uniform fixed duration so the step's promise resolves only when the
    // entrance is visually DONE — otherwise (a spring scale + a 200ms opacity)
    // the step "completes" early and the serial pulse overlaps the still-running
    // entrance, making "in order" look identical to "together".
    const enter = { target: 'Root', animation: { opacity: { from: 0, to: 1, duration: 380 }, scale: { from: 0.88, to: 1, ease: 'outBack', duration: 380 } } };
    const iconPulse = { target: 'Icon', animation: { scale: { from: 1, to: 1.5, ease: poppy, duration: 260 }, loop: 1, alternate: true } };
    return [{ trigger: 'Root.enter', sequence: mode === 'parallel' ? [[enter, iconPulse]] : [enter, iconPulse] }];
  }, [mode]);

  return (
    <Stack gap="lg">
      <Stack direction="row" gap="md" align="center" wrap>
        <ToggleGroup.Root value={mode} onValueChange={(v: string) => { if (v) { setMode(v); setPlay((p) => p + 1); } }} variant="secondary" size="sm">
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

export function MotionsAndSequencesPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="motions-and-sequences">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild><RouterLink to="/">Docs</RouterLink></Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild><RouterLink to="/animation">Animation</RouterLink></Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Motions &amp; sequences</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Motions &amp; sequences</Heading>
          <Text color="muted" size="lg">{TAGLINE}</Text>
          <Stack direction="row" gap="xs" wrap>
            {BADGES.map((b) => (
              <Badge key={b.label} variant="soft"><Icon name={b.icon} />{b.label}</Badge>
            ))}
          </Stack>
        </Stack>

        <Section
          id="anatomy"
          title="Anatomy of an animation"
          lede="One config, four questions — when, where, what, and how it feels — nested from the trigger down to the ease."
        >
          <CodeBlock
            language="ts"
            code={`{ trigger: 'Content.enter',          // WHEN  — the event that fires it
  sequence: [                          //   sequence: orders the steps
    { target: 'Content',              // WHERE — which slot responds
      animation: {                     //   animation: the object (bundles dimensions)
        scale: { from: 0.9, to: 1,     // WHAT  — a dimension + from → to
                 ease: poppy } } } ] }  // FEEL  — a spring or easing on it`}
          />
          <Text>
            Read top to bottom, it answers four questions: when it fires (the
            trigger), where it lands (the target), what moves (the dimension and
            its from → to), and how it feels (a spring or easing). Between them sit
            two containers — the <Code>sequence</Code> that orders steps and the{' '}
            <Code>animation</Code> object that bundles dimensions.
          </Text>
          <Text color="muted">
            A <Code>motion</Code> is the builder for the what + feel —{' '}
            <Code>scaleIn()</Code> returns that <Code>scale</Code> object; spread a
            few into one animation. The feel vocabulary lives on{' '}
            <RouterLink to="/animation/springs">Springs &amp; easings</RouterLink>.
          </Text>
        </Section>

        <Section
          id="property-format"
          title="The property format"
          lede="Every animated property carries its own from, to, ease, and duration."
        >
          <Text>
            An animation is a plain object: each key is a property, each value
            says where it starts, where it lands, and how it gets there. Leave{' '}
            <Code>from</Code> off and it animates from the element's current
            value; leave <Code>ease</Code> off and it uses the runtime default.
            A spring carries its own duration, so you drop <Code>duration</Code>{' '}
            when you pass one.
          </Text>
          <CodeBlock
            language="ts"
            code={`{
  opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 },
  scale:   { from: 0.9, to: 1, ease: poppy },   // spring — no duration
}`}
          />
          <Text color="muted">
            That object is what a step's <Code>animation</Code> holds — built from
            the motions below, wired to a moment by a trigger and sequence.
          </Text>
        </Section>

        <Section
          id="motions"
          title="Motions"
          lede="Self-explaining builders for the moves you reach for. The name says what animates and which way; the parameter says how much."
        >
          <Text>
            A motion is a function that returns an animation object. Call it in a
            step's <Code>animation</Code>, and combine motions by spreading them
            into one object — they touch different properties, so they run
            together. Each one is the move a real component already makes —
            interact to see it in context:
          </Text>
          <Text color="muted">
            Every motion carries its own default <Code>ease</Code>, so the calls
            omit it: the fades, slides and <Code>rotate</Code> use{' '}
            <Code>outQuart</Code> (<Code>rotate</Code> over 300ms); the scale-pops
            (<Code>scaleIn</Code>/<Code>scaleOut</Code>) use <Code>poppy</Code>;
            the <Code>scaleUp</Code>/<Code>scaleDown</Code> micro-interactions use{' '}
            <Code>snappy</Code>. Pass a property object instead of the builder to
            override one.
          </Text>
          <MotionGallery />
        </Section>

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
          <TriggerDemo />
        </Section>

        <Section
          id="sequences"
          title="Sequences — what"
          lede="A sequence is a list of steps. Each step animates a slot with a motion."
        >
          <Text>
            A step says which slot to animate and how it moves — either a literal
            property object, or a motion builder (and a spread combination of
            them). A sequence is plain data, so a component declares its motion as
            a value rather than imperative code.
          </Text>
          <CodeBlock
            language="ts"
            code={`// a popover's entrance — the panel scales and fades in
{
  trigger: 'Content.enter',
  sequence: [
    { target: 'Content', animation: { ...scaleIn(0.88), ...fadeIn() } },
  ],
}`}
          />
          <SequenceDemo />
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
    { target: 'Root', animation: scaleIn(0.92) },
    { target: 'Icon', animation: { scale: { to: 1.4, ease: poppy }, loop: 1, alternate: true } },
  ],
]

// In order — top-level steps; the icon pulses only after the alert lands
sequence: [
  { target: 'Root', animation: scaleIn(0.92) },
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
{ target: 'List', children: '[role="option"]', animation: { ...scaleIn(0.8), ...fadeIn() }, stagger: { delay: 30 } }`}
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
