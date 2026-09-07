import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Stack,
  Heading,
  Text,
  Breadcrumb,
  Code,
  Badge,
  Icon,
  Table,
  Card,
  Accordion,
  Alert,
  AudioPlayer,
  Button,
  Calendar,
  Carousel,
  FileUpload,
  Checkbox,
  EmptyState,
  InputText,
  List,
  Prose,
  ProgressBar,
  Quote,
  RichTextEditor,
  ScrollArea,
  Select,
  Sidebar,
  Skeleton,
  Stepper,
  Tabs,
  Textarea,
  Timeline,
  ToggleGroup,
  VideoPlayer,
  useSurface,
  useSurfaceFlip,
  SurfaceProvider,
} from 'move';
import { COMPONENT_CONTENT } from '../../content/components';
import ZebraTable from '../../content/components/table/samples/zebra-only';
import GroupedTable from '../../content/components/table/samples/grouped';
import { Section, TocRail, type TocItem } from '../../components';

/**
 * Surfaces. The two-level surface elevation system,
 * the alternating-tint rule, the CSS tokens, and which components
 * declare which level.
 */

const TOC: TocItem[] = [
  { href: '#overview', label: 'Overview' },
  { href: '#tokens', label: 'The tokens' },
  { href: '#alternating', label: 'Alternating' },
  { href: '#components', label: 'Which components own a ground' },
  { href: '#audit', label: 'On both grounds' },
];

interface SurfaceToken {
  token: string;
  use: string;
}

/**
 * What a component actually reads. Every one of these resolves differently
 * depending on the ground it is read on, which is the whole mechanism: a
 * component asks what it is standing on, never which ground it is.
 */
const SURFACE_TOKENS: SurfaceToken[] = [
  { token: '--move-surface-bg', use: 'The ground this component is standing on.' },
  {
    token: '--move-surface-alt',
    use: 'What a container nested here should paint, so it separates from this ground.',
  },
  { token: '--move-surface-hover', use: 'Hover fill on this ground.' },
  { token: '--move-surface-alt-hover', use: 'Hover fill on the alternate.' },
  { token: '--move-surface-inset', use: 'Recessed regions — a field, a code block.' },
  {
    token: '--move-surface-border',
    use: 'A container edge. Drawn on the page ground; once nested the tint difference carries it.',
  },
];

/** Reads the ground from context — the same call any component makes. */
function ToneReadout({ label }: { label: string }) {
  const tone = useSurface();
  return (
    <Stack direction="row" gap="sm" align="center" wrap>
      <Text size="sm" weight="medium">
        {label}
      </Text>
      <Badge variant="soft">
        <Code>useSurface() → {tone}</Code>
      </Badge>
    </Stack>
  );
}

/**
 * A surface-owning container with its lid off: take the alternate of the ground
 * you are on, paint it, and tell React as well as CSS. This is what Card, Dialog
 * and Sidebar each do — written out here so the mechanism is visible, and so a
 * consumer building their own container can copy it.
 */
function Rung({ label, children }: { label: string; children?: ReactNode }) {
  const next = useSurfaceFlip();
  return (
    <SurfaceProvider value={next}>
      {/* The point of this block is the raw mechanism a Card performs
          internally, so it is spelled out rather than composed. */}
      {/* dogfood-ignore */}
      <div
        // dogfood-ignore
        data-surface={next}
        // dogfood-ignore
        style={{
          background: 'var(--move-surface-bg)',
          border: '1px solid var(--move-surface-border)',
          borderRadius: 'var(--move-rounded-md)',
          padding: 'var(--move-spacing-md)',
        }}
      >
        <Stack gap="sm">
          <ToneReadout label={label} />
          {children}
        </Stack>
      </div>
    </SurfaceProvider>
  );
}

/** A swatch of whatever the token resolves to where it is rendered. */
function TokenSwatch({ token }: { token: string }) {
  return (
    // dogfood-ignore: a colour chip is a raw box by nature
    <span
      // dogfood-ignore
      style={{
        display: 'inline-block',
        width: '1.25rem',
        height: '1.25rem',
        borderRadius: 'var(--move-rounded-sm)',
        border: '1px solid var(--move-border-base)',
        background: `var(${token})`,
        verticalAlign: 'middle',
      }}
    />
  );
}

/**
 * Read from the specs, not restated here.
 *
 * This list was hand-written and had drifted both ways: it named Alert,
 * Dropdown, Toast and ColorInput, none of which declare the capability, and
 * omitted Accordion and Sidebar, which do. A list of who paints a ground is
 * exactly the thing `owns-surface` already records, and check:capabilities
 * verifies in both directions — so deriving it means the strip cannot go stale
 * again, and a component that gains or loses the capability appears or leaves
 * on its own.
 */
function ownsSurface(): string[] {
  // Called at render, not at module scope: the content registry is populated
  // through a chain of imports, and reading it while this module is still
  // evaluating returned an empty object — the strip rendered its heading and
  // nothing else.
  return Object.values(COMPONENT_CONTENT)
    .filter((c) => ((c.spec.capabilities as string[] | undefined) ?? []).includes('owns-surface'))
    .map((c) => c.meta.name)
    .sort();
}

/**
 * Which stylesheets paint from a relative token and therefore follow the ground
 * they land on. Counted from the source rather than claimed, because the
 * difference between owning a ground and following one is exactly what a reader
 * needs and cannot see from the outside.
 */
const FOLLOWS_THE_GROUND = ['Accordion', 'Tabs', 'ToggleGroup'];

/**
 * Every component that paints a ground of its own, shown on both grounds.
 *
 * The question it answers is a real one for anyone building with the library:
 * put this component on that ground and what happens. Membership is read from
 * the specs, so it is the same list the conformance check uses.
 *
 * NOT here: Dialog, Drawer, Popover, Dropdown, Tooltip and Toast. They portal to
 * document.body, so they would render outside these panels and inherit the page
 * rather than the forced ground, so the strip would show something misleading.
 *
 * The media players are here as deliberate non-participants: their chrome is
 * white scrims over dark video, which is right as it stands and should not
 * follow the ground.
 *
 * What to look for: a component whose fill matches the panel it is standing on
 * has collided — it either holds a fixed background, or it flipped onto the
 * ground its parent already occupies. The panels force an explicit
 * `data-surface`, so nothing here depends on where the page nests them.
 */
function SurfaceAudit({ tone }: { tone: 'base' | 'subtle' }) {
  return (
    // The attribute alone is not a ground. It moves the CSS but leaves React
    // context reporting whatever is outside this panel, so anything that asks
    // what it landed on gets the page's answer and steps to the wrong shade —
    // in the right-hand column the Sidebar took the same shade as the panel it
    // was sitting on and disappeared into it. Both halves, or neither: that is
    // the whole content of the owns-surface capability, and a panel that forces
    // a ground has to keep it too.
    <SurfaceProvider value={tone}>
      {/* dogfood-ignore */}
      <div
        // dogfood-ignore
        data-surface={tone}
        // dogfood-ignore
        style={{
          background: 'var(--move-surface-bg)',
          padding: 'var(--move-spacing-lg)',
          borderRadius: 'var(--move-rounded-lg)',
          flex: 1,
          minWidth: 0,
        }}
      >
        <Stack gap="md">
          <Text weight="semibold">
            <Code>{tone}</Code> ground
          </Text>

          <Card.Root>
            <Card.Body>
              <Text>Card</Text>
              <Card.Root>
                <Card.Body>
                  <Text>Card in a Card — the nesting case</Text>
                </Card.Body>
              </Card.Root>
            </Card.Body>
          </Card.Root>

          <Accordion defaultValue="a">
            <Accordion.Item value="a">
              <Accordion.Header>
                <Accordion.Trigger>Accordion</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>
                <Text>Trigger and panel, against each other and the ground.</Text>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>

          <List>
            <List.Item>List</List.Item>
            <List.Item>Second row</List.Item>
          </List>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Table</Table.Head>
                <Table.Head>Header + zebra</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>One</Table.Cell>
                <Table.Cell>Two</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Three</Table.Cell>
                <Table.Cell>Four</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          {/* The shipped samples, not an approximation of them — a strip that
            redraws each component by hand stops being evidence about the
            component. */}
          <ZebraTable />
          <GroupedTable />

          <Calendar.Root>
            <Calendar.Nav />
            <Calendar.Grid />
          </Calendar.Root>

          {/* dogfood-ignore */}
          <ScrollArea.Root style={{ height: 120 }}>
            <ScrollArea.Content padded>
              <Text>
                ScrollArea. Scroll me: this text is long enough to overflow the box it is in, which
                is the point.
              </Text>
              <Text>More content so the scrollport actually scrolls.</Text>
              <Text>And a little more again.</Text>
            </ScrollArea.Content>
          </ScrollArea.Root>

          <RichTextEditor.Root>
            <RichTextEditor.Toolbar>
              <RichTextEditor.ControlGroup>
                <RichTextEditor.Control>B</RichTextEditor.Control>
                <RichTextEditor.Control>I</RichTextEditor.Control>
              </RichTextEditor.ControlGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content>RichTextEditor</RichTextEditor.Content>
          </RichTextEditor.Root>

          <Quote attribution="Move">Quote</Quote>

          <Code>Code</Code>

          <Prose>
            {/* dogfood-ignore: Prose renders raw HTML by design — that is what it is for. */}
            <p>Prose.</p>
          </Prose>

          <FileUpload.Root maxFiles={2}>
            <FileUpload.Dropzone>
              <EmptyState
                size="sm"
                icon="upload-cloud"
                title="Drop files here"
                description="PNG, JPG, PDF up to 10 MB"
                action={
                  <FileUpload.Trigger>
                    <Button variant="secondary" size="sm">
                      Choose files
                    </Button>
                  </FileUpload.Trigger>
                }
              />
            </FileUpload.Dropzone>
            <FileUpload.ItemGroup />
          </FileUpload.Root>

          <Skeleton.Root>
            <Skeleton.Text lines={2} />
          </Skeleton.Root>

          <Stepper>
            <Stepper.Step status="complete">
              <Stepper.Indicator>1</Stepper.Indicator>
              <Stepper.Title>Stepper</Stepper.Title>
            </Stepper.Step>
            <Stepper.Step status="active">
              <Stepper.Indicator>2</Stepper.Indicator>
              <Stepper.Title>Second</Stepper.Title>
            </Stepper.Step>
          </Stepper>

          <Timeline>
            <Timeline.Item title="Timeline">
              <Text>Marker and rail on this ground.</Text>
            </Timeline.Item>
          </Timeline>

          <ProgressBar value={60} />

          <AudioPlayer src="/sample.mp3" radius="md" />
          <VideoPlayer src="/sample.mp4" radius="md" />

          <Tabs.Root defaultValue="one">
            <Tabs.List>
              <Tabs.Trigger value="one">Tabs</Tabs.Trigger>
              <Tabs.Trigger value="two">Second</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="one">
              <Text>Tab panel on this ground.</Text>
            </Tabs.Content>
          </Tabs.Root>

          <ToggleGroup.Root defaultValue="a">
            <ToggleGroup.Item value="a">ToggleGroup</ToggleGroup.Item>
            <ToggleGroup.Item value="b">Second</ToggleGroup.Item>
          </ToggleGroup.Root>

          <Carousel.Root showIndicators>
            <Carousel.Viewport>
              <Carousel.Slide>
                <Text>Carousel</Text>
              </Carousel.Slide>
              <Carousel.Slide>
                <Text>Second slide</Text>
              </Carousel.Slide>
            </Carousel.Viewport>
          </Carousel.Root>

          <Sidebar.Provider>
            {/* dogfood-ignore */}
            <div
              /* dogfood-ignore */
              style={{
                display: 'flex',
                height: 160,
                overflow: 'hidden',
                borderRadius: 'var(--move-rounded-md)',
              }}
            >
              <Sidebar.Root>
                <Sidebar.Content>
                  <Sidebar.Group>
                    <Sidebar.GroupLabel>Sidebar</Sidebar.GroupLabel>
                    <Sidebar.Nav>
                      <Sidebar.NavItem href="#" active onClick={(e) => e.preventDefault()}>
                        Rail on this ground
                      </Sidebar.NavItem>
                      <Sidebar.NavItem href="#" onClick={(e) => e.preventDefault()}>
                        Second row
                      </Sidebar.NavItem>
                    </Sidebar.Nav>
                  </Sidebar.Group>
                </Sidebar.Content>
              </Sidebar.Root>
            </div>
          </Sidebar.Provider>

          <Alert>Alert</Alert>

          <Select.Root defaultValue="one">
            <Select.Trigger>
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
            <Select.Content>
              <Select.Viewport>
                <Select.Item value="one">Select</Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Root>

          <InputText placeholder="InputText — bordered leaf" />
          <Textarea placeholder="Textarea" rows={2} />

          <Stack direction="row" gap="sm" align="center">
            <Button variant="secondary">Button</Button>
            <Checkbox defaultChecked>Checkbox</Checkbox>
          </Stack>
        </Stack>
      </div>
    </SurfaceProvider>
  );
}

export function SurfacesPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="overview">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/systems">Systems</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Surfaces</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Surfaces</Heading>
          <Text color="muted" size="lg">
            A panel shades itself against whatever it sits on, so nested panels stay visible against
            each other. Nothing to set, at any depth.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft">
              <Icon name="layers" />
              {SURFACE_TOKENS.length} relative tokens
            </Badge>
            <Badge variant="soft">
              <Icon name="square-stack" />
              Alternates with depth
            </Badge>
          </Stack>
        </Stack>

        <Section
          id="tokens"
          title="The tokens"
          lede="These are what a component reads. Each one resolves against the ground it is read on — the swatches below show what they come out as right here, on this page."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Here</Table.Head>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Token</Table.Head>
                <Table.Head>What it is for</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {SURFACE_TOKENS.map((t) => (
                <Table.Row key={t.token}>
                  <Table.Cell style={{ width: 1 }}>
                    <TokenSwatch token={t.token} />
                  </Table.Cell>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                    <Code>{t.token}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="sm">{t.use}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>

        <Section
          id="alternating"
          title="Alternating"
          lede="Each panel takes the opposite shade to the one it landed on, so there is always a step between them. The labels below are read from the live state, not written in."
        >
          <Stack gap="md">
            <Text>
              Card, Dialog and Sidebar all do this. Here it is four deep, with nothing setting a
              colour anywhere in the tree.
            </Text>

            <Stack gap="sm">
              <ToneReadout label="The page" />
              <Rung label="A container on the page">
                <Rung label="One inside that">
                  <Rung label="And one more" />
                </Rung>
              </Rung>
            </Stack>

            <Text size="sm" color="muted">
              Each level asks what it landed on and takes the other shade. The level below asks the
              same question and gets the opposite answer.
            </Text>
          </Stack>
        </Section>

        <Section
          id="components"
          title="Which components own a ground"
          lede="Read from the specs — the same list the conformance check verifies, so it cannot drift from the components themselves."
        >
          <Stack gap="md">
            <Text>
              These declare the <Code>owns-surface</Code> capability: they take the alternate of
              wherever they land and provide it to their children, so anything inside them computes
              from the new ground rather than the page.
            </Text>
            <Text>{ownsSurface().join(', ')}</Text>
            <Text>
              Painting from a relative token is a separate thing, and fewer do it:{' '}
              {FOLLOWS_THE_GROUND.join(', ')} fill themselves from <Code>--move-surface-bg</Code>{' '}
              and so follow whatever they are placed on. The rest reach for a fixed background,
              which holds its colour wherever it lands — the strip below is where you can see which
              is which.
            </Text>
          </Stack>
        </Section>

        <Section
          id="audit"
          title="On both grounds"
          lede="The same components on each ground in turn. A fill that matches the panel behind it is one that holds a fixed colour instead of following what it landed on."
        >
          <Stack direction="row" gap="lg" align="stretch" wrap>
            <SurfaceAudit tone="base" />
            <SurfaceAudit tone="subtle" />
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
