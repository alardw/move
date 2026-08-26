import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Button, Code, Link } from 'move';
import {
  HighlightList,
  type HighlightItem,
  Preview,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

const TAGLINE =
  'Every Move component animates through one system — a trigger fires a sequence of motions, each with a spring or easing for its feel. The same everywhere.';

const BADGES = [
  { icon: 'sparkles', label: 'Built in' },
  { icon: 'wind', label: 'Spring-first' },
  { icon: 'accessibility', label: 'Reduced-motion aware' },
];

const DOORS: HighlightItem[] = [
  {
    icon: 'activity',
    text: (
      <>
        <RouterLink to="/animation/lifecycle">Lifecycle</RouterLink> — the
        three moments a component animates: when it enters, when its state
        changes, and when it leaves.
      </>
    ),
  },
  {
    icon: 'wind',
    text: (
      <>
        <RouterLink to="/animation/springs">Springs &amp; easings</RouterLink>{' '}
        — the named springs that give Move its feel, and when to reach for a
        plain easing instead.
      </>
    ),
  },
  {
    icon: 'zap',
    text: (
      <>
        <RouterLink to="/animation/motions-and-sequences">
          Motions &amp; sequences
        </RouterLink>{' '}
        — the motions you reach for, and the triggers and sequences that wire
        them to a moment.
      </>
    ),
  },
  {
    icon: 'puzzle',
    text: (
      <>
        <RouterLink to="/animation/choreography">Patterns</RouterLink> — the named
        motion patterns shared across components, live.
      </>
    ),
  },
  {
    icon: 'code',
    text: (
      <>
        <RouterLink to="/animation/reference">Reference</RouterLink> — the
        hook, the runtime functions, and the utilities, for when you drive
        animation yourself.
      </>
    ),
  },
];

const TOC: TocItem[] = [
  { href: '#animation', label: 'Overview' },
  { href: '#built-in', label: 'Built in, not bolted on' },
  { href: '#one-system', label: 'One system' },
  { href: '#anime-js', label: 'Running on anime.js' },
  { href: '#reduced-motion', label: 'Reduced motion' },
  { href: '#going-deeper', label: 'Going deeper' },
];

export function AnimationOverviewPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="animation">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Animation</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Animation</Heading>
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
          id="built-in"
          title="Built in, not bolted on"
          lede="The motion ships with the component. You don't wire it up."
        >
          <Text>
            A button presses in under the cursor. A dialog springs onto the
            screen and traps focus. A toast slides up, counts down, and clears
            itself out. None of that is something you add — it's how the
            components behave the moment you render them.
          </Text>
          <Preview
            code={`import { Button } from 'move';

<Button>Press me</Button>`}
          >
            <Button>Press me</Button>
          </Preview>
          <Text color="muted" size="sm">
            Hover and press the button — the scale response is the animation
            system at work, with nothing wired up on this page.
          </Text>
        </Section>

        <Section
          id="one-system"
          title="One system"
          lede="Four questions, the same everywhere Move animates."
        >
          <Text>
            Every animation in Move is described the same way, so motion reads
            as one product instead of a per-component grab bag. One config
            answers four questions:
          </Text>
          <HighlightList
            items={[
              {
                icon: 'zap',
                text: 'When — a trigger names the moment: a mount, an unmount, a state change, a hover.',
              },
              {
                icon: 'crosshair',
                text: 'Where — the target slot that responds.',
              },
              {
                icon: 'move',
                text: 'What — the motion: a fade, a slide, a pop, expressed as from → to.',
              },
              {
                icon: 'wind',
                text: 'How it feels — a spring like poppy, or a plain easing when timing matters more than feel.',
              },
            ]}
          />
        </Section>

        <Section
          id="ownership"
          title="State, animation, state"
          lede="An animation is a bridge between two resting states — never a state itself."
        >
          <Text>
            The shape of every animation in Move is the same:{' '}
            <strong>state 1 &rarr; animation &rarr; state 2</strong>. Both ends
            are rendered and correct with nothing running. The animation is the
            transient middle, and when it is done it should get out of the way so
            state 2 applies on its own.
          </Text>
          <Text>
            That matters because animations here run on anime.js, which writes
            INLINE STYLES. CSS and animation are not two systems — they are one
            language at two cascade levels, where a stylesheet rule is the floor
            and an inline style always wins. Three things follow:
          </Text>
          <HighlightList
            items={[
              {
                icon: 'lock',
                text: 'An animation is a permanent override, not a temporary one. anime does not clean up after itself, so the last value it wrote sits on the element indefinitely — which is how a cancelled animation strands an element half-way, with no state left to fall back to.',
              },
              {
                icon: 'eye-off',
                text: 'A CSS rule for a property an animation also writes works exactly once: before that animation first runs. It is a fuse, not a fallback.',
              },
              {
                icon: 'git-branch',
                text: 'So: one writer per property, per element. Not a convention we picked — the cascade decided it. All we choose is whether it is deliberate.',
              },
            ]}
          />
          <Text>
            <strong>States are rendered, never animated.</strong> Express one in
            CSS when it is declarable — a dimmed mark under an attribute — and in
            the RENDERER when it needs computing, like an exploded pie whose
            slices each push along their own angle. Both are correct at rest.
            Neither waits for anything to finish.
          </Text>
          <Text>
            <strong>Animations move between them.</strong> They may write a DOM
            property directly where they are its only writer. Where the state is
            computed geometry they animate the INPUT and let the renderer redraw
            — a pie sweeps by animating one number, so nothing but the renderer
            ever writes a path. That is the difference between an animation that
            composes and one that fights.
          </Text>
          <Text>
            <strong>The handoff is the one exception.</strong> CSS may set state
            1 under an attribute the component removes once the animation takes
            over, as Chart does with{' '}
            <code>[data-enter=&quot;pending&quot;]</code>. One direction only.
          </Text>
          <Text>
            <strong>Motion targets markers</strong> — <code>[data-bar]</code>,{' '}
            <code>[data-dot]</code> — never bare elements, so a stylesheet can
            see which properties are already spoken for.
          </Text>
        </Section>

        <Section
          id="css-transitions"
          title="Where CSS may animate"
          lede="Colour is state. Everything else is motion, and motion has one home."
        >
          <Text>
            A CSS transition is a second animation system, and the two cannot be
            combined. A transition is a fixed duration on a bezier; a spring has
            no duration at all. Run them together on one element and they read
            as two clocks — put them on the same property and they overwrite
            each other outright.
          </Text>
          <Text>
            Only transitions are in scope. Setting opacity or a transform flatly
            is a state, and states belong in CSS — a dimmed mark, a chevron
            resting at an angle. It is transitioning them that makes them
            motion. Chart's hover emphasis is a flat opacity rule for that
            reason: a resting state that depended on an animation finishing
            could be interrupted and left stranded, which is not a state at all.
          </Text>
          <Text>
            So the line is drawn by property, because that is what decides
            whether a collision is possible:
          </Text>
          <HighlightList
            items={[
              {
                icon: 'palette',
                text: 'Colour may transition — color, background-color, border-color, fill, stroke, box-shadow. A hover tint or a focus ring is state feedback, and nothing in useAnimations writes these, so there is nothing to collide with.',
              },
              {
                icon: 'move',
                text: 'Motion may not — transitioning transform, opacity or geometry belongs in useAnimations, where it can be sequenced, staggered, sprung, and switched off with animations={false}. A component that moves things in CSS is invisible to all of that.',
              },
              {
                icon: 'accessibility',
                text: 'Inside prefers-reduced-motion, a flat transition-free fallback is right: staggerAnimate declines to run there, and state emphasis should not disappear with the motion.',
              },
            ]}
          />
          <Text>
            `check:css-transitions` enforces this (rule styles-12). A genuine
            exception — media chrome fading with pointer presence, say, which
            composes with nothing — takes a `transition-exempt` comment giving
            the reason, so the exception stays visible rather than becoming the
            norm.
          </Text>
        </Section>

        <Section
          id="anime-js"
          title="Running on anime.js"
          lede="A small engine with real spring physics, wrapped so you never touch it."
        >
          <Text>
            Move's motion runs on{' '}
            <Link href="https://animejs.com" external>anime.js</Link>. It brings
            spring physics — what makes motion feel like it has weight rather
            than following a fixed curve — along with a full set of easing
            curves for the cases where you want a fixed timing instead. Move
            wraps it end to end: you pick a named spring, the components feed it
            the right values, and anime.js draws the frames. You never import it
            yourself, and components never reach for it directly.
          </Text>
        </Section>

        <Section
          id="reduced-motion"
          title="Reduced motion"
          lede="Honored automatically, library-wide."
        >
          <Text>
            When a visitor has <Code>prefers-reduced-motion</Code> set, Move
            settles elements to their end state instead of animating to it.
            There's no per-component opt-in and no half-played frames — the
            whole library respects the setting at once.
          </Text>
        </Section>

        <Section
          id="going-deeper"
          title="Going deeper"
          lede="The rest of the section, from how a component behaves to the API underneath."
        >
          <HighlightList items={DOORS} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
