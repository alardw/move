import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge } from 'move';
import {
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
  { href: '#enter', label: 'Enter' },
  { href: '#respond', label: 'Respond' },
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

        <Section id="enter" title="Enter">
          <Text>
            On mount, an element transitions in rather than appearing. A toast
            slides up, a dialog springs in, an avatar settles into place. The
            entrance is part of the component, so it plays the first time the
            element renders without anything to set up.
          </Text>
          <Text>
            Where an element changes size as it arrives — a panel opening, a
            menu unrolling — the entrance measures the natural height and grows
            into it, so the surrounding layout makes room smoothly instead of
            jumping.
          </Text>
        </Section>

        <Section id="respond" title="Respond">
          <Text>
            Between entering and leaving, a component responds to what the user
            does. A checkbox ticks, a switch slides its thumb, a tab indicator
            tracks the active tab as it moves. These reactions are driven by the
            component's own state, not by handlers you attach.
          </Text>
          <Text>
            Some reactions are about the moment of interaction itself — the
            scale a button takes under a press, the lift on hover. Others follow
            a value changing: an accordion expanding, a sidebar collapsing to
            icons. Both run through the same system, so a component reacts the
            same way wherever it appears.
          </Text>
        </Section>

        <Section id="exit" title="Exit">
          <Text>
            Before unmounting, an element animates out. A toast slides away, a
            dialog fades back, a removed list row collapses its own height so
            the layout closes instead of snapping shut and leaving a gap.
          </Text>
          <Text>
            The exit needs to finish before React removes the element, so Move
            holds the element in the tree until its exit animation completes,
            then takes it down. That hand-off is what{' '}
            <RouterLink to="/animation/reference">Presence</RouterLink> manages.
          </Text>
        </Section>

        <Section
          id="how-it-connects"
          title="How it connects"
          lede="Each phase maps to a kind of trigger."
        >
          <Text>
            Enter and exit are lifecycle triggers — they fire on mount and
            unmount. Responses are state and event triggers — they fire when a
            value changes or an interaction happens. The next page,{' '}
            <RouterLink to="/animation/triggers-and-sequences">
              Triggers &amp; sequences
            </RouterLink>
            , covers each kind and what plays when it fires.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
