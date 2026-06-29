import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Stack, Heading, Text, Breadcrumb, Icon, Badge, Code,
  Button, Collapsible, Tooltip, Select, Drawer,
} from 'move';
import { CodeBlock, Section, TocRail, type TocItem } from '../../components';

const TAGLINE =
  'The building blocks under every sequence: how a single property animates, and the self-explaining motions whose name says what moves and which way.';

const BADGES = [
  { icon: 'code', label: 'Format' },
  { icon: 'package', label: '8 motions' },
];

const TOC: TocItem[] = [
  { href: '#format', label: 'Overview' },
  { href: '#layers', label: 'The three layers' },
  { href: '#property-format', label: 'The property format' },
  { href: '#motions', label: 'Motions' },
];

// Each motion is illustrated by the real Move component that makes it — interact
// with each one (hover, press, toggle, open) to see the motion in context.
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

// Each entry pairs the real component (the feel) with the exact code the motions
// it makes resolve to (the definition) — code and demo side by side, in context.
const DEMOS: { motions: string; code: string; caption: string; render: () => ReactNode }[] = [
  {
    motions: 'scaleUp · scaleDown',
    code: `scaleUp()   // { scale: { to: 1.04, ease: snappy } }
scaleDown() // { scale: { to: 0.96, ease: snappy } }`,
    caption: 'Hover and press — the button grows, then dips.',
    render: () => <Button variant="primary">Hover &amp; press me</Button>,
  },
  {
    motions: 'rotate · expand · collapse',
    code: `rotate(0, 180) // { rotate: { from: 0, to: 180, ease: 'outQuart', duration: 300 } }
expand()       // { height: { from: 0, to: 'auto' }, opacity: { from: 0, to: 1 } }
collapse()     // { height: { from: 'auto', to: 0 }, opacity: { from: 1, to: 0 } }`,
    caption: 'Toggle — the caret rotates as the panel expands.',
    render: () => <CollapsibleDemo />,
  },
  {
    motions: 'scaleIn · slideUp · fadeIn',
    code: `// spread into one object — they run together
{ ...scaleIn(0.88), ...slideUp(6), ...fadeIn() }
// scaleIn → { scale: { from: 0.88, to: 1, ease: poppy } }
// slideUp → { translateY: { from: 6, to: 0, ease: 'outQuart' } }
// fadeIn  → { opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 } }`,
    caption: 'Hover — the tooltip pops in.',
    render: () => <Tooltip label="Pops in with scale + slide + fade"><Button variant="primary">Hover for a tooltip</Button></Tooltip>,
  },
  {
    motions: 'scaleIn · fadeIn (stagger)',
    code: `// each option, with a stagger delay between them
{ ...scaleIn(0.8), ...fadeIn() }`,
    caption: 'Open — the options pop in.',
    render: () => <SelectDemo />,
  },
  {
    motions: 'slideLeft · fadeIn',
    code: `slideLeft() // { translateX: { from: 8, to: 0, ease: 'outQuart' } }
fadeIn()    // the overlay fades in`,
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

export function AnimationFormatPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="format">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild><RouterLink to="/">Docs</RouterLink></Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild><RouterLink to="/animation">Animation</RouterLink></Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Format &amp; motions</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Format &amp; motions</Heading>
          <Text color="muted" size="lg">{TAGLINE}</Text>
          <Stack direction="row" gap="xs" wrap>
            {BADGES.map((b) => (
              <Badge key={b.label} variant="soft"><Icon name={b.icon} />{b.label}</Badge>
            ))}
          </Stack>
        </Stack>

        <Section
          id="layers"
          title="The three layers"
          lede="Springs give the feel, motions say what moves, sequences wire it to a moment — each layer builds on the one before."
        >
          <CodeBlock
            language="ts"
            code={`// 1 · spring — the feel
poppy

// 2 · motion — what moves, in that feel (a builder)
scaleIn()   // { scale: { from: 0.9, to: 1, ease: poppy } }

// 3 · sequence — motions wired to a moment
{
  trigger: 'Content.enter',
  sequence: [
    { target: 'Content', animation: { ...scaleIn(), ...fadeIn() } },
  ],
}`}
          />
          <Text color="muted">
            <RouterLink to="/animation/springs">Springs</RouterLink> and{' '}
            <RouterLink to="/animation/triggers-and-sequences">sequences</RouterLink>{' '}
            each have their own page; motions live here.
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
            code={`animation: {
  opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 },
  scale:   { from: 0.9, to: 1, ease: poppy },   // spring — no duration
}`}
          />
          <Text color="muted">
            That object is what a step's <Code>animation</Code> holds. Wire it to
            a moment with a{' '}
            <RouterLink to="/animation/triggers-and-sequences">trigger and sequence</RouterLink>.
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
          <MotionGallery />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
