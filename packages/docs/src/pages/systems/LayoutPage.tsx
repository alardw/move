import { Link as RouterLink } from "react-router-dom";
import {
  Stack,
  Align,
  Heading,
  Text,
  Breadcrumb,
  Code,
  Badge,
  Icon,
  Table,
  Alert,
  Splitter,
  ScrollArea,
  List,
} from "move";
import { CodeBlock, Section, TocRail, type TocItem } from "../../components";

/**
 * Layout. The constraint chain: how a definite height travels from the app
 * boundary down to a scroll region, which prop plays which role, and why a
 * missing link fails silently.
 */

const TOC: TocItem[] = [
  { href: "#overview", label: "Overview" },
  { href: "#roles", label: "The three roles" },
  { href: "#choosing", label: "Choosing a fill value" },
  { href: "#nested", label: "Deeply nested example" },
  { href: "#pitfalls", label: "Pitfalls" },
];

const ROLES = [
  {
    role: "Ceiling",
    who: "<MoveRoot fullHeight>",
    does: "Turns the window height into a definite height, once, at the app boundary — and clips, so a region that overflows can't escape unseen.",
  },
  {
    role: "Conduit",
    who: 'fill="remaining"',
    does: "Takes the space left after siblings, and waives the right to be as tall as its content — which is what passes a usable height downward instead of a content-shaped one.",
  },
  {
    role: "Consumer",
    who: "ScrollArea.Content, Splitter.Panel",
    does: "Reads the height it was handed and turns it into a scrollport.",
  },
];

const NESTED_SOURCE = `<MoveRoot fullHeight>
  <Stack fill="remaining" gap="none">          {/* conduit */}
    <Splitter.Root fill="remaining">          {/* conduit */}
      <Splitter.Panel defaultSize="35%">
        <Stack fill="parent" gap="none">       {/* Panel is a block → "parent" */}
          <ScrollArea.Root fill="parent">
            <ScrollArea.Header>Files</ScrollArea.Header>
            <ScrollArea.Content>{/* long list */}</ScrollArea.Content>
          </ScrollArea.Root>
        </Stack>
      </Splitter.Panel>
      <Splitter.Panel>
        <Stack fill="parent" gap="none">
          <ScrollArea.Root fill="parent">
            <ScrollArea.Header>Detail</ScrollArea.Header>
            <ScrollArea.Content>{/* long body */}</ScrollArea.Content>
            <ScrollArea.Footer>42 items</ScrollArea.Footer>
          </ScrollArea.Root>
        </Stack>
      </Splitter.Panel>
    </Splitter.Root>
  </Stack>
</MoveRoot>`;

const rows = (n: number, label: string) =>
  Array.from({ length: n }, (_, i) => (
    <List.Item key={i}>
      <List.Content>
        <List.Title>{`${label} ${i + 1}`}</List.Title>
        <List.Description>Scrolls inside its own region</List.Description>
      </List.Content>
    </List.Item>
  ));

/** The live demo: five levels deep, two independent scroll regions, no escape hatches. */
function NestedDemo() {
  return (
    <Stack
      clip
      gap="none"
      style={{ height: 360, border: "1px solid var(--move-border-base)", borderRadius: "var(--move-rounded-lg)" }}
    >
      <Stack fill="remaining" gap="none">
        <Splitter.Root fill="remaining">
          <Splitter.Panel defaultSize="38%">
            <Stack fill="parent" gap="none">
              <ScrollArea.Root fill="parent">
                <ScrollArea.Header padded>
                  <Text weight="medium" size="sm">
                    Files
                  </Text>
                </ScrollArea.Header>
                <ScrollArea.Content padded>
                  <List>{rows(24, "File")}</List>
                </ScrollArea.Content>
              </ScrollArea.Root>
            </Stack>
          </Splitter.Panel>
          <Splitter.Panel>
            <Stack fill="parent" gap="none">
              <ScrollArea.Root fill="parent">
                <ScrollArea.Header padded>
                  <Text weight="medium" size="sm">
                    Detail
                  </Text>
                </ScrollArea.Header>
                <ScrollArea.Content padded>
                  <List>{rows(30, "Row")}</List>
                </ScrollArea.Content>
                <ScrollArea.Footer padded>
                  <Text size="xs" color="muted">
                    30 items — this footer never scrolls away
                  </Text>
                </ScrollArea.Footer>
              </ScrollArea.Root>
            </Stack>
          </Splitter.Panel>
        </Splitter.Root>
      </Stack>
    </Stack>
  );
}

export function LayoutPage() {
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
            <Breadcrumb.Page>Layout</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Layout</Heading>
          <Text color="muted" size="lg">
            A scroll region needs a definite height, and height travels in one
            direction: down. Each level converts “my container has a definite
            height” into “so do I” — and one missing link leaves everything below
            it sized to its content instead.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft">
              <Icon name="layers" />
              Three roles
            </Badge>
            <Badge variant="soft">
              <Icon name="git-branch" />
              One viewport height, at the app boundary
            </Badge>
          </Stack>
        </Stack>

        <Section
          id="roles"
          title="The three roles"
          lede="Every full-height layout is these three, in order. Naming them is most of the work — the CSS is four declarations."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Role</Table.Head>
                <Table.Head>Who plays it</Table.Head>
                <Table.Head>What it contributes</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {ROLES.map((r) => (
                <Table.Row key={r.role}>
                  <Table.Cell>
                    <Text weight="medium">{r.role}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Code>{r.who}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="sm">{r.does}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <Text size="sm" color="muted">
            No layout component knows what a viewport is. That absolute enters
            once, via <Code>{"<MoveRoot fullHeight>"}</Code>, and everything below
            is relative to it — so the same tree works inside a 360px card as it
            does filling a window.
          </Text>
        </Section>

        <Section
          id="choosing"
          title="Choosing a fill value"
          lede="Two values, and the choice is made by the parent, not by you."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Value</Table.Head>
                <Table.Head>Applies</Table.Head>
                <Table.Head>Use when</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Code>fill="remaining"</Code>
                </Table.Cell>
                <Table.Cell>
                  <Code>flex: 1; min-width: 0; min-height: 0</Code>
                </Table.Cell>
                <Table.Cell>
                  <Text size="sm">
                    The parent is a flex container — a Stack, Align, or
                    Splitter.Root. Correct whether or not you have siblings, so
                    prefer it.
                  </Text>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Code>fill="parent"</Code>
                </Table.Cell>
                <Table.Cell>
                  <Code>height: 100%</Code>
                </Table.Cell>
                <Table.Cell>
                  <Text size="sm">
                    The parent is a block with a definite height — most often{" "}
                    <Code>Splitter.Panel</Code> or a Card body. Only correct as
                    the only child: with siblings it claims the full height and
                    overflows.
                  </Text>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <Alert variant="info" title="Why both minimums, for one axis?">
            A flex item's main axis belongs to its parent, and a child can't read
            its parent's direction in CSS. So <Code>remaining</Code> sets{" "}
            <Code>min-width: 0</Code> and <Code>min-height: 0</Code> together;
            each is a no-op on the axis that isn't the main one. That also means
            you never pass an orientation — <Code>remaining</Code> is correct in a
            row and a column alike.
          </Alert>
        </Section>

        <Section
          id="nested"
          title="Deeply nested example"
          lede="Five levels, two independent scroll regions, a header and a footer that stay put — and no inline styles or escape hatches in the tree."
        >
          <NestedDemo />
          <Text size="sm" color="muted">
            Drag the divider. Each pane scrolls on its own, the frame never
            grows, and the page behind it never scrolls. Note the value switches
            from <Code>remaining</Code> to <Code>parent</Code> exactly where the
            parent stops being a flex container — inside{" "}
            <Code>Splitter.Panel</Code>.
          </Text>
          <CodeBlock code={NESTED_SOURCE} language="tsx" />
        </Section>

        <Section
          id="pitfalls"
          title="Pitfalls"
          lede="Each of these fails silently — no error, no scrollbar, just content that isn't reachable."
        >
          <Stack gap="md">
            <Stack gap="xs">
              <Text weight="medium">
                <Code>flex={"{1}"}</Code> is not a conduit
              </Text>
              <Text size="sm" color="muted">
                It grows, but it stays floored at its content height, so it hands
                a content-shaped height to everything below and the scroll region
                never becomes a scrollport. Use <Code>fill="remaining"</Code>.
              </Text>
            </Stack>
            <Stack gap="xs">
              <Text weight="medium">
                <Code>fill="parent"</Code> with siblings
              </Text>
              <Text size="sm" color="muted">
                <Code>height: 100%</Code> ignores the siblings above it, so the
                box is as tall as the whole parent and overflows by however much
                they took.
              </Text>
            </Stack>
            <Stack gap="xs">
              <Text weight="medium">
                <Code>overflow: hidden</Code> as a boundary
              </Text>
              <Text size="sm" color="muted">
                Hidden stays a scroll container: focus a field below the fold and
                the browser scrolls the box, with no scrollbar to get back.{" "}
                <Code>clip</Code> can't — which is why Stack's prop is{" "}
                <Code>clip</Code> and there is no <Code>hidden</Code>.
              </Text>
            </Stack>
            <Stack gap="xs">
              <Text weight="medium">An unsized mount node</Text>
              <Text size="sm" color="muted">
                <Code>fullHeight</Code> sizes <Code>html</Code> and{" "}
                <Code>body</Code>, but your mount node — usually{" "}
                <Code>#root</Code> — sits between them and the tree. If it isn't{" "}
                <Code>height: 100%</Code>, the chain breaks at the first link. A
                dev-only warning fires when it does.
              </Text>
            </Stack>
          </Stack>

          <Align>
            <Text size="sm" color="muted">
              Props live on{" "}
              <RouterLink to="/components/stack">Stack</RouterLink>,{" "}
              <RouterLink to="/components/align">Align</RouterLink>,{" "}
              <RouterLink to="/components/scroll-area">ScrollArea</RouterLink>{" "}
              and <RouterLink to="/components/splitter">Splitter</RouterLink>.
            </Text>
          </Align>
        </Section>
      </Stack>

      <TocRail items={TOC} />
    </Stack>
  );
}
