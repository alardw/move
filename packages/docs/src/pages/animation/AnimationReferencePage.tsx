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
    text: 'animatePosition — low-level: animate an element toward a measured slot, resolving expressions like $slot.x. For a sliding indicator, reach for the usePositionTracker hook below instead.',
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
  { href: '#portaled-overlays', label: 'Portaled overlays' },
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
          <Text>
            Rarely needed — <Code>useAnimations</Code> calls these for you. Import
            one directly only behind a declared Tier-2 capability (e.g. Carousel's
            scroll API, ChatBubble's measure-then-animate).
          </Text>
          <CodeBlock
            language="ts"
            code={`moveAnimate(el, animation, cancelRef?)
animateDimension(el, prop, direction, cancelRef, config?)   // prop: 'height'|'width', direction: 'enter'|'exit'
animatePosition(indicator, animation, cancelRef, options?)  // resolves $slot.x / $slot.width
staggerAnimate(container, selector, animation, stagger, cancelRef, direction?)`}
          />
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
          <CodeBlock
            language="ts"
            code={`usePositionTracker({ containerRef, activeSelector?, track?, disabled? })  // → { indicatorRef }
useMorphHeight({ key, containerRef, innerRef, duration?, ease?, fadeDuration?, fadeDelay? })
prefersReducedMotion()  // → boolean`}
          />
          <HighlightList items={UTILITIES} />
        </Section>

        <Section
          id="portaled-overlays"
          title="Portaled overlays"
          lede="Two rules for animating a Radix-positioned popup yourself — tooltip, popover, menu, date picker."
        >
          <Text>
            A Radix popper positions the floating element with{' '}
            <Code>transform: translate(x, y)</Code> and re-applies it on every
            scroll. Two things follow whenever you animate one by hand. (Move’s
            built-in overlays already do this — you only need it for a custom one.)
          </Text>
          <HighlightList
            items={[
              { icon: 'layers', text: 'Two layers. Animating scale or translate on the positioned Content clobbers Radix’s positioning transform — the scale dies and the popup can’t follow the trigger on scroll. Wrap the body in an inner surface that owns the scale/slide; the shell keeps Radix’s transform and only fades.' },
              { icon: 'log-in', text: 'useAnimations below the Portal. The lifecycle enter fires once per mount, so in the always-mounted parent it fires once at page load with a null ref — never on open. Put it in a small component rendered as a child of the Portal: that remounts per open (Presence gates it), so the enter plays every time.' },
              { icon: 'list', text: 'Parallel steps. Separate top-level sequence steps run one after another — wrap them in a nested array to play the shell fade and the inner scale together.' },
            ]}
          />
          <CodeBlock
            language="tsx"
            code={`// Inner lives BELOW the Portal → mounts per open → the enter fires each time.
function ContentInner({ isClosing, onCloseComplete, children }) {
  const innerRef = useRef(null);
  const { runExit } = useAnimations(config, { ContentInner: innerRef });
  useEffect(() => {
    if (isClosing) runExit().then(onCloseComplete);
  }, [isClosing]);
  return <div ref={innerRef} className={cx('contentInner')}>{children}</div>;
}

<Radix.Portal>
  <Radix.Content className={cx('content')}>  {/* shell — Radix owns transform */}
    <ContentInner ... />                      {/* inner — owns scale/slide   */}
  </Radix.Content>
</Radix.Portal>`}
          />
          <Text color="muted">
            Enter and exit both run through <Code>useAnimations</Code> — CSS{' '}
            <Code>@keyframes</Code> are reserved for continuous loops (a spinner,
            an indeterminate bar), never for open/close.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
