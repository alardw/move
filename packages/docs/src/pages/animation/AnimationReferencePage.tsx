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
  'The pieces under the system, for when you drive animation yourself instead of relying on a component’s built-in motion.';

const BADGES = [
  { icon: 'code', label: 'API' },
  { icon: 'wrench', label: 'Utilities' },
];

const RUNTIME: HighlightItem[] = [
  {
    icon: 'play',
    text: 'moveAnimate — run one step. The default executor behind every sequence.',
  },
  {
    icon: 'unfold-vertical',
    text: 'animateDimension — reveal or collapse height or width, measuring the natural size.',
  },
  {
    icon: 'move-horizontal',
    text: 'animatePosition — slide an indicator to a measured slot, resolving expressions like $slot.x.',
  },
  {
    icon: 'layers',
    text: 'staggerAnimate — animate a set of children with a delay between each.',
  },
];

const UTILITIES: HighlightItem[] = [
  {
    icon: 'ruler',
    text: 'useMorphHeight — animate an element’s height between two natural sizes as its content swaps.',
  },
  {
    icon: 'target',
    text: 'usePositionTracker — track the active child’s position to drive a sliding indicator.',
  },
  {
    icon: 'accessibility',
    text: 'prefersReducedMotion — read the user’s motion setting when you need to branch on it yourself.',
  },
];

const TOC: TocItem[] = [
  { href: '#reference', label: 'Overview' },
  { href: '#use-animations', label: 'useAnimations' },
  { href: '#runtime', label: 'Runtime functions' },
  { href: '#presence', label: 'Presence' },
  { href: '#utilities', label: 'Utilities' },
];

export function AnimationReferencePage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="reference">
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
            <Breadcrumb.Page>Reference</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Reference</Heading>
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
          id="use-animations"
          title="useAnimations"
          lede="The hook that wires a config of triggers to a set of refs."
        >
          <Text>
            <Code>useAnimations</Code> takes the trigger config, a map of refs to
            the slots it names, and optional state declarations. It returns the
            event handlers to spread onto your slots, plus controls for the
            animations it owns.
          </Text>
          <CodeBlock
            language="ts"
            code={`const { handlers, runExit, pauseAll, resumeAll, getAnimation } =
  useAnimations(config, refs, states, { onEnterComplete });`}
          />
          <HighlightList
            items={[
              { icon: 'pointer', text: 'handlers — spread onto each slot to attach its hover, press, and key animations.' },
              { icon: 'log-out', text: 'runExit — play the exit sequence and resolve when it finishes, for unmount.' },
              { icon: 'pause', text: 'pauseAll / resumeAll — hold and resume every active animation, like a toast’s countdown on hover.' },
              { icon: 'search', text: 'getAnimation — reach a specific running animation by its trigger name.' },
            ]}
          />
        </Section>

        <Section
          id="runtime"
          title="Runtime functions"
          lede="The low-level executors a step can call."
        >
          <HighlightList items={RUNTIME} />
        </Section>

        <Section
          id="presence"
          title="Presence"
          lede="Keeps an element mounted until its exit animation finishes."
        >
          <Text>
            Wrap children that need an exit in <Code>Presence</Code>. It holds a
            removed child in the tree, plays its exit, and only then takes it
            down. <Code>usePresence</Code> and <Code>useIsPresent</Code> let a
            child read whether it's on the way out. This is what makes the{' '}
            <RouterLink to="/animation/lifecycle">exit phase</RouterLink>{' '}
            possible.
          </Text>
        </Section>

        <Section
          id="utilities"
          title="Utilities"
          lede="Smaller helpers for specific jobs."
        >
          <HighlightList items={UTILITIES} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
