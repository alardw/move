import { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Stack, Heading, Text, Breadcrumb, Icon, Badge, Code, Button, Table,
  moveAnimate, fadeIn, fadeOut, slideUp, scaleIn, scaleOut, scaleUp, scaleDown, rotate,
} from 'move';
import type { Animation, JSAnimation } from 'move';
import { CodeBlock, Section, TocRail, type TocItem } from '../../components';

// Each motion is the move a real Move component already makes — illustrate by
// pointing at where it shows up, not an abstract box alone.
const MOTION_USAGE: { motion: string; where: string }[] = [
  { motion: 'fadeIn / fadeOut', where: 'Dialog & Drawer overlays, Alert' },
  { motion: 'slideUp / slideDown / slideLeft / slideRight', where: 'Drawer, Toast' },
  { motion: 'scaleIn / scaleOut', where: 'Select, Dropdown & menu items' },
  { motion: 'scaleUp / scaleDown', where: 'Button, ToggleButton (hover / press)' },
  { motion: 'rotate', where: 'Accordion & Collapsible caret' },
  { motion: 'expand / collapse', where: 'Accordion, Collapsible' },
];

const TAGLINE =
  'The building blocks under every sequence: how a single property animates, and the self-explaining motions whose name says what moves and which way.';

const BADGES = [
  { icon: 'code', label: 'Format' },
  { icon: 'package', label: '8 motions' },
];

const TOC: TocItem[] = [
  { href: '#format', label: 'Overview' },
  { href: '#property-format', label: 'The property format' },
  { href: '#motions', label: 'Motions' },
];

// Motions — self-explaining builders (name = what + direction). Combine by
// spreading into one animation object; e.g. a pop-in = { ...scaleIn(), ...fadeIn() }.
const PRESETS: { name: string; desc: string; anim: Animation }[] = [
  { name: 'fadeIn', desc: 'opacity 0 → 1', anim: fadeIn() },
  { name: 'fadeOut', desc: 'opacity 1 → 0', anim: fadeOut() },
  { name: 'slideUp', desc: 'translateY 8 → 0', anim: slideUp() },
  { name: 'scaleIn', desc: 'scale 0.9 → 1, bouncy', anim: scaleIn() },
  { name: 'scaleOut', desc: 'scale 1 → 0.9', anim: scaleOut() },
  { name: 'scaleUp', desc: 'scale 1 → 1.04 (hover)', anim: scaleUp() },
  { name: 'scaleDown', desc: 'scale 1 → 0.96 (press)', anim: scaleDown() },
  { name: 'rotate', desc: 'rotate 0 → 180°', anim: rotate(0, 180) },
];

function PresetPlayer() {
  const [active, setActive] = useState('scaleIn');
  const boxRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<JSAnimation | null>(null);

  const play = (name: string) => {
    const el = boxRef.current;
    if (!el) return;
    // Reset to a neutral baseline first so every preset plays cleanly, every time.
    el.style.opacity = '1';
    el.style.transform = 'none';
    const preset = PRESETS.find((p) => p.name === name);
    if (preset) moveAnimate(el, preset.anim, animRef);
  };

  return (
    <Stack gap="lg">
      <Stack direction="row" gap="xs" wrap>
        {PRESETS.map((p) => (
          <Button
            key={p.name}
            variant={active === p.name ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => { setActive(p.name); play(p.name); }}
          >
            {p.name}
          </Button>
        ))}
      </Stack>
      <div
        style={{
          position: 'relative',
          height: '9rem',
          borderRadius: 'var(--move-rounded-lg)',
          border: '1px solid var(--move-border-base)',
          background: 'var(--move-bg-subtle)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div
          ref={boxRef}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--move-rounded-md)',
            background: 'var(--move-bg-base)',
            boxShadow: 'var(--move-shadow-overlay)',
            fontFamily: 'var(--move-font-mono)',
            fontWeight: 600,
          }}
        >
          {active}
        </div>
      </div>
      <Stack direction="row" gap="md" align="center" wrap>
        <Button variant="secondary" size="sm" onClick={() => play(active)}>
          <Icon name="play" /> Replay
        </Button>
        <Text size="sm" color="muted">{PRESETS.find((p) => p.name === active)?.desc}</Text>
      </Stack>
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
            together. Pick one to feel its from → to:
          </Text>
          <PresetPlayer />
          <CodeBlock
            language="ts"
            code={`// a motion is a builder; combine by spreading
{ target: 'Item', animation: { ...scaleIn(), ...fadeIn() } }   // a pop-in
{ target: 'Caret', animation: rotate(0, 180) }                 // a flip`}
          />
          <Text>Each motion is the move a real component already makes:</Text>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Motion</Table.Head>
                <Table.Head>Shows up in</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {MOTION_USAGE.map((m) => (
                <Table.Row key={m.motion}>
                  <Table.Cell><Code>{m.motion}</Code></Table.Cell>
                  <Table.Cell><Text size="sm">{m.where}</Text></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
