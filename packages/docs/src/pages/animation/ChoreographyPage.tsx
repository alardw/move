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
  Drawer,
  Loader,
  List,
  Accordion,
  Tabs,
} from 'move';
import {
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
  'Named patterns — a trigger and sequence paired for a recurring job — that Move components share. The top of the ladder: spring → motion → pattern.';

const BADGES = [
  { icon: 'puzzle', label: 'Shared patterns' },
  { icon: 'blocks', label: 'Across components' },
];

const TOC: TocItem[] = [
  { href: '#patterns', label: 'Overview' },
  { href: '#patterns-list', label: 'Shared patterns' },
  { href: '#motions', label: 'Built from motions' },
];

export function ChoreographyPage() {
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
            <Breadcrumb.Page>Patterns</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Patterns</Heading>
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
          title="Shared patterns"
          lede="The patterns most components reach for."
        >
          <Text>
            A pattern is a trigger and sequence paired for a recurring job, named
            once and reused. Because the same pattern drives many components, a
            press feels like a press and a reveal feels like a reveal across the
            whole library. Each one below is live — interact with it to feel the
            motion.
          </Text>
          <Stack gap="xl">
            <InlineDemo
              label={<Code>press</Code>}
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
              label={<Code>popupMenu</Code>}
              blurb="Reveal a panel by height and stagger its items in. Open the select."
            >
              <SelectDemo />
            </InlineDemo>

            <InlineDemo
              label={<Code>popupSurface</Code>}
              blurb="Fade and slide in on show, back out on hide. Hover the button."
            >
              <Tooltip label="Saves without publishing">
                <Button variant="secondary">Save draft</Button>
              </Tooltip>
            </InlineDemo>

            <InlineDemo
              label={<Code>sidePanel</Code>}
              blurb="Slide a panel in from the edge while the backdrop fades. Open the drawer."
            >
              <Drawer.Root>
                <Drawer.Trigger asChild>
                  <Button>Open drawer</Button>
                </Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Overlay />
                  <Drawer.Content>
                    <Drawer.Header>
                      <Drawer.Title>Filters</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                      <Drawer.Description>
                        Tweak the filter criteria here. Changes apply immediately.
                      </Drawer.Description>
                    </Drawer.Body>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.Root>
            </InlineDemo>

            <InlineDemo
              block
              label={<Code>disclosure</Code>}
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
              label={<Code>slidingIndicator</Code>}
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

            <InlineDemo
              block
              replay
              label={<Code>listReveal</Code>}
              blurb="Rows stagger in on mount."
            >
              <List>
                <List.Item>Inbox</List.Item>
                <List.Item>Drafts</List.Item>
                <List.Item>Sent</List.Item>
                <List.Item>Archive</List.Item>
              </List>
            </InlineDemo>

            <InlineDemo
              block
              replay
              label={<Code>layoutReveal</Code>}
              blurb="A layout container staggers its children in."
            >
              <Stack direction="row" gap="sm" wrap stagger>
                <Badge variant="soft">One</Badge>
                <Badge variant="soft">Two</Badge>
                <Badge variant="soft">Three</Badge>
                <Badge variant="soft">Four</Badge>
              </Stack>
            </InlineDemo>

            <InlineDemo
              label={<Code>loader</Code>}
              blurb="A continuous loop while work is pending."
            >
              <Loader variant="dots" />
            </InlineDemo>
          </Stack>
        </Section>

        <Section
          id="motions"
          title="Built from motions"
          lede="Patterns are built from smaller, self-explaining motions."
        >
          <Text>
            Below the patterns sit the motion builders — <Code>fadeIn</Code>,{' '}
            <Code>scaleIn</Code>, <Code>slideUp</Code>, <Code>rotate</Code> and a
            few more. A step's animation is a motion (or a spread combination of
            them), which is how a sequence stays short. The{' '}
            <RouterLink to="/animation/motions-and-sequences">Motions &amp; sequences</RouterLink>{' '}
            page lists the full set.
          </Text>
          <Text color="muted">
            Motion specific to a single component — a sidebar's width collapse, a
            toast's countdown — lives on that component's own page, not here. A
            pattern earns its place by being shared.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
