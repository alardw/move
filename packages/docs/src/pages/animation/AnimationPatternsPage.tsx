import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Stack,
  Heading,
  Text,
  Breadcrumb,
  Icon,
  Badge,
  Code,
  Button,
  Switch,
  Select,
  Tooltip,
  Dialog,
  Accordion,
  Tabs,
} from 'move';
import {
  HighlightList,
  type HighlightItem,
  InlineDemo,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

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
          {FRUITS.map((f) => (
            <Select.Item key={f} value={f}>{f}</Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  );
}

const TAGLINE =
  'The motion in Move components is assembled from a handful of named patterns. These are them.';

const BADGES = [
  { icon: 'puzzle', label: 'Ready-made' },
  { icon: 'blocks', label: 'Shared across components' },
];

const SPECIALIZED: HighlightItem[] = [
  {
    icon: 'panel-left',
    text: 'widthCollapse — animate width to a CSS variable as a rail collapses. Sidebar.',
  },
  {
    icon: 'timer',
    text: 'countdown — run a progress bar that pauses on hover and resumes on leave. Toast.',
  },
  {
    icon: 'check-check',
    text: 'exitOnStatus — animate an item out when its status changes, then remove it. File upload.',
  },
  {
    icon: 'arrow-right',
    text: 'pageSlide — slide newly appearing items in as a page changes. Pagination.',
  },
  {
    icon: 'activity',
    text: 'loopPulse — a looping, alternating pulse. Skeleton.',
  },
];

const TOC: TocItem[] = [
  { href: '#patterns', label: 'Overview' },
  { href: '#patterns-list', label: 'Patterns' },
  { href: '#specialized', label: 'Specialized patterns' },
  { href: '#motions', label: 'Motions underneath' },
];

export function AnimationPatternsPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="patterns">
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
            <Breadcrumb.Page>See it in action</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>See it in action</Heading>
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
          id="patterns-list"
          title="Patterns"
          lede="The recipes most components reach for."
        >
          <Text>
            A pattern is a trigger and sequence paired for a recurring job.
            Because the same pattern drives many components, a press feels like a
            press and a reveal feels like a reveal across the whole library. Each
            one below is live — interact with it to feel the motion.
          </Text>
          <Stack gap="xl">
            <InlineDemo
              label={<Code>interactive</Code>}
              blurb="Scale up on hover, down on press. Hover and press the button."
            >
              <Button>Press me</Button>
            </InlineDemo>

            <InlineDemo
              label={<Code>toggle</Code>}
              blurb="Animate a thumb as a value flips. Click the switch."
            >
              <Switch.Root defaultChecked label="Notifications">
                <Switch.Thumb />
              </Switch.Root>
            </InlineDemo>

            <InlineDemo
              label={<Code>popup</Code>}
              blurb="Reveal a panel by height and stagger its items in. Open the select."
            >
              <SelectDemo />
            </InlineDemo>

            <InlineDemo
              label={<Code>enterExit</Code>}
              blurb="Fade and slide in on show, back out on hide. Hover the button."
            >
              <Tooltip label="Saves without publishing">
                <Button variant="secondary">Save draft</Button>
              </Tooltip>
            </InlineDemo>

            <InlineDemo
              label={<Code>overlay</Code>}
              blurb="Fade a backdrop while the panel springs in. Open the dialog."
            >
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <Button>Open dialog</Button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay />
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Publish changes</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <Dialog.Description>
                        Push the last hour of edits live?
                      </Dialog.Description>
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Dialog.FooterEnd>
                        <Dialog.Close asChild>
                          <Button variant="ghost">Not yet</Button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                          <Button>Publish</Button>
                        </Dialog.Close>
                      </Dialog.FooterEnd>
                    </Dialog.Footer>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </InlineDemo>

            <InlineDemo
              block
              label={<Code>expand</Code>}
              blurb="Grow height and opacity together as a region opens. Toggle a row."
            >
              <Accordion.Root type="single" collapsible defaultValue="shipping">
                <Accordion.Item value="shipping">
                  <Accordion.Header>
                    <Accordion.Trigger>How long does shipping take?</Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content>
                    Most orders ship within one business day. Standard delivery
                    then takes three to five business days, express options arrive
                    the next morning, and overnight gets it to you by 10 AM.
                    Anything placed before 2 PM on a weekday goes out the same
                    afternoon; orders after the cutoff, or on weekends and public
                    holidays, ship the next business day instead. International
                    shipping reaches most countries within seven to fourteen days,
                    and any customs duties are calculated at checkout so there is
                    nothing extra to pay when the parcel arrives at your door.
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="tracking">
                  <Accordion.Header>
                    <Accordion.Trigger>Can I track my order?</Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content>
                    Yes — we email a tracking link the moment your order leaves
                    the warehouse, and a second note when it is out for delivery.
                    You can also see live status, the carrier, and the estimated
                    delivery date under Orders in your account at any time, on web
                    or in the app. If anything looks stuck for more than a couple
                    of days, just reply to that email and our support team will
                    chase the carrier for you and, if it has gone missing, send a
                    replacement right away at no extra cost.
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </InlineDemo>

            <InlineDemo
              block
              label={<Code>position</Code>}
              blurb="Slide an indicator to track the active item. Switch tabs."
            >
              <Tabs.Root defaultValue="overview">
                <Tabs.List>
                  <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                  <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
                  <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="overview">
                  <Stack padding="md">
                    <Text size="sm" color="muted">High-level summary.</Text>
                  </Stack>
                </Tabs.Content>
                <Tabs.Content value="activity">
                  <Stack padding="md">
                    <Text size="sm" color="muted">Pushes, comments, merges.</Text>
                  </Stack>
                </Tabs.Content>
                <Tabs.Content value="settings">
                  <Stack padding="md">
                    <Text size="sm" color="muted">Permissions and webhooks.</Text>
                  </Stack>
                </Tabs.Content>
              </Tabs.Root>
            </InlineDemo>
          </Stack>
        </Section>

        <Section
          id="specialized"
          title="Specialized patterns"
          lede="A few components need motion that's specific to them."
        >
          <HighlightList items={SPECIALIZED} />
        </Section>

        <Section
          id="motions"
          title="Motions underneath"
          lede="Patterns are built from smaller, self-explaining motions."
        >
          <Text>
            Below the patterns sit the motion builders — <Code>fadeIn</Code>,{' '}
            <Code>scaleIn</Code>, <Code>slideUp</Code>, <Code>rotate</Code> and a
            few more. A step's animation is a motion (or a spread combination of
            them), which is how a sequence stays short. The{' '}
            <RouterLink to="/animation/format">Format &amp; motions</RouterLink>{' '}
            page lists the full set.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
