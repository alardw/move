import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Icon, Badge, Button, Toast, toast } from 'move';
import {
  InlineDemo,
  LifecycleIllustration,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

const TAGLINE =
  'A Move component animates at three points: when it mounts, when its state changes, and when it unmounts.';

const BADGES = [
  { icon: 'log-in', label: 'Enter' },
  { icon: 'refresh-cw', label: 'Respond' },
  { icon: 'log-out', label: 'Exit' },
];

const TOC: TocItem[] = [
  { href: '#lifecycle', label: 'The lifecycle' },
  { href: '#one-component', label: 'See it in action' },
  { href: '#enter', label: 'Enter' },
  { href: '#respond', label: 'Respond' },
  { href: '#handing-back', label: 'Handing back' },
  { href: '#exit', label: 'Exit' },
  { href: '#how-it-connects', label: 'How it connects' },
];

export function AnimationLifecyclePage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="lifecycle">
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
            <Breadcrumb.Page>Lifecycle</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>The lifecycle</Heading>
          <Text color="muted" size="lg">
            {TAGLINE}
          </Text>
          <Stack direction="row" gap="xs" wrap>
            {BADGES.map((b) => (
              <Badge key={b.label} variant="soft">
                <Icon name={b.icon} />
                {b.label}
              </Badge>
            ))}
          </Stack>
        </Stack>

        <LifecycleIllustration />

        <Section
          id="one-component"
          title="See it in action"
          lede="A toast runs the whole lifecycle — send one and watch."
        >
          <Text>
            It slides up when it appears (enter), holds its countdown while you hover it (respond),
            and slides away when it dismisses (exit) — the same three phases every Move component
            moves through.
          </Text>
          <InlineDemo blurb="Send a toast, then hover it before it clears.">
            <Stack direction="row" gap="sm">
              <Button
                onClick={() => toast.info('Hover me to hold the countdown.', { duration: 6000 })}
              >
                Send a toast
              </Button>
            </Stack>
            <Toast.Viewport />
          </InlineDemo>
        </Section>

        <Section id="enter" title="Enter">
          <Text>
            On mount, an element transitions in rather than appearing. A toast slides up, a dialog
            springs in, an avatar settles into place. The entrance is part of the component, so it
            plays the first time the element renders without anything to set up.
          </Text>
          <Text>
            Where an element changes size as it arrives — a panel opening, a menu unrolling — the
            entrance measures the natural height and grows into it, so the surrounding layout makes
            room smoothly instead of jumping.
          </Text>
        </Section>

        <Section id="respond" title="Respond">
          <Text>
            Between entering and leaving, a component responds to what the user does. A checkbox
            ticks, a switch slides its thumb, a tab indicator tracks the active tab as it moves.
            These reactions are driven by the component's own state, not by handlers you attach.
          </Text>
          <Text>
            Some reactions are about the moment of interaction itself — the scale a button takes
            under a press, the lift on hover. Others follow a value changing: an accordion
            expanding, a sidebar collapsing to icons. Both run through the same system, so a
            component reacts the same way wherever it appears.
          </Text>
        </Section>

        <Section
          id="handing-back"
          title="Handing back"
          lede="A hover ends and a press lets go, so the state a component returns to has to outlive the animation that got there."
        >
          <Text>
            Rest, hover and pressed are held in CSS. Two of them are carried by <Code>:hover</Code>{' '}
            and <Code>:active</Code>, and the third by the absence of both. The animation only
            travels between them, and gives the properties back the moment it arrives.
          </Text>
          <Text>
            Giving them back is the part that matters. An animation writes inline styles, and those
            outrank any stylesheet rule — so one that keeps them is holding the state rather than
            arriving at it, and the rule it was meant to hand over to never gets another turn.
          </Text>
          <Text>
            Which is why the states survive without any motion at all. Switch animations off with{' '}
            <Code>animations={'{false}'}</Code>, or arrive with reduced motion set, and the control
            still lifts under the pointer and presses in under a click. It gets there at once
            instead of travelling.
          </Text>
          <Text>
            The opening frame is written immediately rather than on the next tick, so there is never
            a moment where the rule has let go and the animation has not yet taken hold. Two cases
            keep what they wrote, for the same reason in reverse: a loop has no arrival, and an
            element on its way out has nothing to return to.
          </Text>
          <Text color="muted" size="sm">
            If something snaps at the end of its animation, it was leaning on that animation to hold
            a state the CSS never declared.
          </Text>
        </Section>

        <Section id="exit" title="Exit">
          <Text>
            Before unmounting, an element animates out. A toast slides away, a dialog fades back, a
            removed list row collapses its own height so the layout closes instead of snapping shut
            and leaving a gap.
          </Text>
          <Text>
            The exit needs to finish before React removes the element, so Move holds the element in
            the tree until its exit animation completes, then takes it down. That hand-off is what{' '}
            <RouterLink to="/animation/reference">Presence</RouterLink> manages.
          </Text>
        </Section>

        <Section
          id="how-it-connects"
          title="How it connects"
          lede="Each phase maps to a kind of trigger."
        >
          <Text>
            Enter and exit are lifecycle triggers — they fire on mount and unmount. Responses are
            state and event triggers — they fire when a value changes or an interaction happens.{' '}
            <RouterLink to="/animation/motions-and-sequences">Motions &amp; sequences</RouterLink>{' '}
            covers each kind and what plays when it fires.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
