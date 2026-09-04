import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Stack, Heading, Text, Breadcrumb, Icon, Badge, Code,
  Button, Collapsible, Tooltip, Select, Drawer, Dropdown,
  InputRange, Popover, poppy,
} from 'move';
import type { AnimationTrigger } from 'move';
import {
  AnimationAnatomy,
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

// The sequence above, on a real component: open the Popover and its Content slot
// plays its enter sequence (scale + fade).
function SequenceDemo() {
  return (
    <Stack align="start" style={{ maxWidth: '22rem' }}>
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
    // The component's own selector, now that there is one a consumer can write.
    const ITEMS = '[data-move-stagger]';
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
    <Stack gap="lg" style={{ maxWidth: '22rem' }}>
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

const SHORT_MENU = ['Edit', 'Duplicate', 'Delete'];
const LONG_MENU = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

/**
 * The same component and the same asked-for delay, at both ends of the range.
 * Open them one after the other: the short one arrives as a single object, the
 * long one cascades — and finishes in about the same time.
 *
 * Both count their group label, which moves with the rows rather than sitting
 * still while they cascade around it.
 */
function StaggerRangeDemo() {
  return (
    <Stack direction="row" gap="lg" wrap>
      <Stack gap="sm">
        <Text size="sm" weight="medium">Three items</Text>
        <Text size="sm" color="muted">Under the threshold — they arrive together.</Text>
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button variant="secondary">Short menu</Button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Label>Actions</Dropdown.Label>
            {SHORT_MENU.map((item) => (
              <Dropdown.Item key={item}>{item}</Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown.Root>
      </Stack>
      <Stack gap="sm">
        <Text size="sm" weight="medium">Twenty items</Text>
        <Text size="sm" color="muted">Cascades, inside the same 240ms.</Text>
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button variant="secondary">Long menu</Button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Label>Actions</Dropdown.Label>
            {LONG_MENU.map((item) => (
              <Dropdown.Item key={item}>{item}</Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown.Root>
      </Stack>
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
          lede="One config, four questions — when, where, what, and how it feels — held in two containers: a sequence that orders the steps, and an animation that bundles them."
        >
          <AnimationAnatomy />
          <CodeBlock
            language="ts"
            code={`{ trigger: 'Content.enter',
  sequence: [
    { target: 'Content',
      animation: {
        scale: { from: 0.9, to: 1, ease: poppy } } } ] }`}
          />
          <Text color="muted">
            That innermost box — the what and feel — is the part you rarely hand-write: a{' '}
            <Code>motion</Code> builds it. <Code>scaleIn()</Code> returns the same{' '}
            <Code>scale</Code> + <Code>ease</Code> object shown above; spread a few into one
            animation. The feel vocabulary (<Code>poppy</Code> and friends) lives on{' '}
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
            together.
          </Text>
          <Text color="muted">
            Each motion bakes sensible defaults — its from → to, its ease, and a
            duration (springs carry their own). Here's exactly what each returns;
            pass a property object instead of the builder to override one:
          </Text>
          <CodeBlock
            language="ts"
            code={`fadeIn()             → { opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 } }
fadeOut()            → { opacity: { to: 0, ease: 'outQuart', duration: 150 } }
slideUp(distance=8)  → { translateY: { from: distance, to: 0, ease: 'outQuart', duration: 200 } }
// slideDown · slideLeft · slideRight — the same on the other axis / sign
scaleIn(from=0.9)    → { scale: { from, to: 1, ease: poppy } }      // spring — no duration
scaleOut(to=0.9)     → { scale: { from: 1, to, ease: 'outQuart', duration: 150 } }
scaleUp(to=1.04)     → { scale: { to, ease: snappy } }              // hover
scaleDown(to=0.96)   → { scale: { to, ease: snappy } }              // press
rotate(from, to)     → { rotate: { from, to, ease: 'outQuart', duration: 300 } }
expand()             → { height: 0 → 'auto', opacity: 0 → 1 }       // duration ∝ content
collapse()           → { height: 'auto' → 0, opacity: 1 → 0 }`}
          />
          <Text>
            Each one is the move a real component already makes — interact to see
            it in context:
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
            finishes; group steps in a nested array and they play together in the
            same frame. A drawer opens with its overlay and panel together; a
            toast leaves in order — it slides out, then its row collapses so the
            stack closes. A step can carry an <Code>onComplete</Code> callback for
            when it finishes.
          </Text>
          <CodeBlock
            language="ts"
            code={`// Together — a drawer's enter: overlay and panel in the same frame
sequence: [
  [
    { target: 'Overlay', animation: fadeIn() },
    { target: 'Content', animation: slideLeft() },
  ],
]

// In order — a toast's exit: it slides + fades out, THEN the row collapses
sequence: [
  { target: 'Item',    animation: { translateY: { to: 16 }, opacity: { to: 0 } } },
  { target: 'Wrapper', fn: 'animateDimension', animation: { height: { ease: 'inOutQuart', duration: 300 } } },
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
            code={`// Select and Autocomplete cascade their options with exactly this step
{ target: 'List', children: '[role="option"]', animation: { ...scaleIn(0.8), ...fadeIn() }, stagger: { delay: 30 } }`}
          />
          <SelectStaggerDemo />
          <Text>
            The delay you set applies in the middle of the range, and the runtime
            adjusts it at both ends. Under five children there is no order to
            read, so they arrive together — three items are taken in at a glance,
            and revealing them one after another reads as a lag rather than as
            motion. Past that the whole reveal is held to about a quarter of a
            second, so a menu of forty arrives in the same time as a menu of six
            instead of trailing half a second behind it. Set{' '}
            <Code>threshold</Code> or <Code>maxTotal</Code> on the{' '}
            <Code>stagger</Code> to move either boundary.
          </Text>
          <StaggerRangeDemo />
          <Text color="muted">
            More of these running in real components on{' '}
            <RouterLink to="/animation/choreography">See it in action</RouterLink>.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
