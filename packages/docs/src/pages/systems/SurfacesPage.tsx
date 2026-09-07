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
} from 'move';
import { COMPONENT_CONTENT } from '../../content/components';
import { Section, TocRail, type TocItem } from '../../components';

/**
 * Surfaces. The two-level surface elevation system,
 * the alternating-tint rule, the CSS tokens, and which components
 * declare which level.
 */

const TOC: TocItem[] = [
  { href: '#overview', label: 'Overview' },
  { href: '#levels', label: 'Levels' },
  { href: '#alternating', label: 'Alternating tints' },
  { href: '#components', label: 'Per-component surface' },
  { href: '#audit', label: 'On both grounds' },
];

interface Level {
  kind: 'base' | 'subtle';
  bgToken: string;
  description: string;
}

const LEVELS: Level[] = [
  {
    kind: 'base',
    bgToken: '--move-bg-base',
    description:
      'The page/app ground. Established implicitly by MoveRoot (:root) — no component declares it.',
  },
  {
    kind: 'subtle',
    bgToken: '--move-bg-subtle',
    description:
      'Slightly raised tint over base — used for cards, popovers, dialogs, and other contained panels.',
  },
];

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

function componentsByLevel(): Record<Level['kind'], string[]> {
  // base is the implicit page ground (MoveRoot / :root) — no component declares it.
  return { base: [], subtle: ownsSurface() };
}

/**
 * Every component that paints a ground of its own, shown on both grounds.
 *
 * It began as a temporary audit — a way to see collisions rather than infer
 * them — and the investigation it was built for is finished: `owns-surface` is
 * a declared capability now, checked in both directions, so a component that
 * paints a ground without saying so is reported rather than eyeballed.
 *
 * It stays because the question it answers is a real one for anyone building
 * with the library: put this component on that ground and what happens. The
 * membership is read from the specs, so it is the same list the check uses.
 *
 * NOT here: Dialog, Drawer, Popover, Dropdown, Tooltip and Toast. They portal to
 * document.body, so they would render outside these panels and inherit the page
 * rather than the forced ground — the strip would show something misleading
 * The media players are here as a deliberate NON-participant: their chrome is
 * white scrims over dark video, which is correct as it stands and should not
 * follow the ground. They are in the strip so that stays visible — the ~25 raw
 * white values in AudioPlayer, VideoPlayer and PlayerSettingsMenu are a decision,
 * not debt to be cleaned up later. What to look for: a
 * component whose fill matches the panel it is standing on has collided — it
 * either declared an absolute tone, or it flipped onto a rung its parent
 * already occupies. The panels force an explicit `data-surface`, so nothing
 * here depends on where the page happens to nest them.
 */
function SurfaceAudit({ tone }: { tone: 'base' | 'subtle' }) {
  return (
    // The audit forces a ground and paints it directly; bypassing what a
    // component would decide is the entire point.  dogfood-ignore
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
          <List.Item>List — paints a ground, declares none</List.Item>
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

        <Calendar.Root>
          <Calendar.Nav />
          <Calendar.Grid />
        </Calendar.Root>

        {/* dogfood-ignore */}
        <ScrollArea.Root style={{ height: 120 }}>
          <ScrollArea.Content padded>
            <Text>
              ScrollArea — paints a ground, declares none. Scroll me: this text is long enough to
              overflow the box it is in, which is the point.
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

        <Quote attribution="the audit">Quote — paints a ground</Quote>

        <Code>Code — inline ground</Code>

        <Prose>
          {/* dogfood-ignore: Prose renders raw HTML by design — that is what it is for. */}
          <p>Prose — paints four grounds of its own.</p>
        </Prose>

        <FileUpload.Root maxFiles={2}>
          <FileUpload.Dropzone>
            <Text>FileUpload — the dropzone is a large filled region</Text>
          </FileUpload.Dropzone>
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

        <Text weight="semibold">Already surface-aware — the working case</Text>

        <Tabs.Root defaultValue="one">
          <Tabs.List>
            <Tabs.Trigger value="one">Tabs</Tabs.Trigger>
            <Tabs.Trigger value="two">Second</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="one">
            <Text>Reads --move-surface-* already.</Text>
          </Tabs.Content>
        </Tabs.Root>

        <ToggleGroup.Root defaultValue="a">
          <ToggleGroup.Item value="a">ToggleGroup</ToggleGroup.Item>
          <ToggleGroup.Item value="b">Second</ToggleGroup.Item>
        </ToggleGroup.Root>

        <Carousel.Root showIndicators>
          <Carousel.Viewport>
            <Carousel.Slide>
              <Text>Carousel — also surface-aware</Text>
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

        <Alert>Alert — hardcodes data-surface=&quot;subtle&quot;</Alert>

        <Select.Root defaultValue="one">
          <Select.Trigger>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content>
            <Select.Viewport>
              <Select.Item value="one">Select — also hardcodes subtle</Select.Item>
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
            Two-level elevation system. Components that render a tinted or elevated panel pick a
            surface level; nested surfaces alternate so each panel reads as visually distinct from
            its parent.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft">
              <Icon name="layers" />
              {LEVELS.length} levels
            </Badge>
            <Badge variant="soft">
              <Icon name="square-stack" />
              Alternating hierarchy
            </Badge>
          </Stack>
        </Stack>

        <Section
          id="levels"
          title="Levels"
          lede="Each level maps to a single CSS token. Components reference the token, never a raw color."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Level</Table.Head>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>CSS token</Table.Head>
                <Table.Head>Use</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {LEVELS.map((l) => (
                <Table.Row key={l.kind}>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                    <Code>{l.kind}</Code>
                  </Table.Cell>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                    <Code>{l.bgToken}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="sm">{l.description}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>

        <Section
          id="alternating"
          title="Alternating tints"
          lede="A surface always reads as elevated against its parent. Nest two of the same level and the boundary disappears."
        >
          <Stack gap="md">
            <Text>
              The page itself sits at <Code>base</Code>. A Card on the page picks{' '}
              <Code>subtle</Code>, and the tint difference makes it read as elevated. A child Card
              inside that Card flips back to <Code>base</Code> so the nested boundary stays visible.
              Same rule for popovers nested inside a subtle dialog body.
            </Text>
            <Card.Root>
              <Card.Body>
                <Stack gap="md">
                  <Text size="sm" color="muted">
                    <Code>base</Code> page
                  </Text>
                  <Card.Root>
                    <Card.Body>
                      <Stack gap="md">
                        <Text size="sm" color="muted">
                          <Code>subtle</Code> card on the page
                        </Text>
                        <Card.Root>
                          <Card.Body>
                            <Text size="sm" color="muted">
                              <Code>base</Code>-tinted child reads as recessed inside the subtle
                              parent.
                            </Text>
                          </Card.Body>
                        </Card.Root>
                      </Stack>
                    </Card.Body>
                  </Card.Root>
                </Stack>
              </Card.Body>
            </Card.Root>
            <Text size="sm" color="muted">
              The validator flags any component that renders a <Code>subtle</Code> surface inside
              another <Code>subtle</Code> ancestor (or <Code>base</Code> inside <Code>base</Code>).
              Compositions that need a third tint signal a missing level — fix the taxonomy, don't
              bend the rule.
            </Text>
          </Stack>
        </Section>

        <Section
          id="components"
          title="Per-component surface"
          lede="Which Move components currently declare which level."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Level</Table.Head>
                <Table.Head>Components</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {LEVELS.map((l) => (
                <Table.Row key={l.kind}>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                    <Code>{l.kind}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Text
                      size="sm"
                      color={componentsByLevel()[l.kind].length ? undefined : 'muted'}
                    >
                      {componentsByLevel()[l.kind].length
                        ? componentsByLevel()[l.kind].join(', ')
                        : 'Implicit page ground — declared by no component.'}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>

        <Section
          id="audit"
          title="On both grounds"
          lede="Every component that paints a ground of its own, forced onto each ground in turn — so what happens is visible rather than inferred. Read from the components themselves."
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
