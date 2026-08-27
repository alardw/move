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
} from "move";
import { Preview, Section, TocRail, type TocItem } from "../../components";
import ScrollChain from "../../content/systems/layout/samples/scroll-chain";
import scrollChainCode from "../../content/systems/layout/samples/scroll-chain?raw";
import FluidGrid from "../../content/systems/layout/samples/fluid-grid";
import fluidGridCode from "../../content/systems/layout/samples/fluid-grid?raw";

/**
 * Layout. Where a box's size comes from: how width is decided by the space a
 * container offers, how height is passed down from the app shell to a scroll
 * region, and which prop plays which role along the way.
 */

const TOC: TocItem[] = [
  { href: "#overview", label: "Overview" },
  { href: "#width", label: "Width" },
  { href: "#roles", label: "Height, in three roles" },
  { href: "#choosing", label: "Choosing a fill value" },
  { href: "#shell", label: "A full-height shell" },
  { href: "#pitfalls", label: "Pitfalls" },
];

const WIDTH_KINDS = [
  {
    says: "How it takes part",
    props: "Stack flex, Grid.Cell span / offset / order",
    resolved: "The container, from its own tracks and the other children.",
  },
  {
    says: "How far it stretches",
    props: "Text readableWidth, Splitter.Panel minSize",
    resolved: "A cap. It holds the box back, and never grows it.",
  },
  {
    says: "What it would like",
    props: "Grid minChildWidth, Splitter.Panel defaultSize",
    resolved:
      "The container, which fits as many as it can and shares out the rest.",
  },
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
            Sizing in Move works from the outside in. Each container decides how
            much room its children get, and each child fits the space it is
            handed. That is what lets a panel fill the screen and scroll on its
            own when its content runs long.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft">
              <Icon name="layers" />
              Two axes
            </Badge>
            <Badge variant="soft">
              <Icon name="git-branch" />
              One viewport height, at the app boundary
            </Badge>
          </Stack>
        </Stack>

        <Section
          id="width"
          title="Width"
          lede="A container decides how much room its children get. What a child says is how it takes part, and how far it stretches."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>What a child says</Table.Head>
                <Table.Head>Props</Table.Head>
                <Table.Head>Who resolves it</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {WIDTH_KINDS.map((k) => (
                <Table.Row key={k.says}>
                  <Table.Cell>
                    <Text weight="medium">{k.says}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Code>{k.props}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="sm">{k.resolved}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <Text size="sm" color="muted">
            All three keep the last word with the container, which is what lets
            one tree serve a phone and a wide monitor. A preference travels as a
            floor the container may raise — <Code>minChildWidth</Code> caps
            itself at the room available, so a child that asks for more than it
            can have wraps onto its own row.
          </Text>

          <Preview title="A grid that reflows" code={fluidGridCode}>
            <FluidGrid />
          </Preview>

          <Stack gap="sm">
            <Text weight="medium">When a length is the right answer</Text>
            <Text size="sm" color="muted">
              Some sizes are measurements rather than choices, and those props take a{" "}
              <Code>Dimension</Code> — a number in pixels, or a CSS length. A{" "}
              <RouterLink to="/components/splitter">Splitter</RouterLink> panel starts
              at a size the reader then drags wherever they like. An{" "}
              <RouterLink to="/components/image">Image</RouterLink> or{" "}
              <RouterLink to="/components/video-player">VideoPlayer</RouterLink> carries
              the dimensions of the media itself. A{" "}
              <RouterLink to="/components/skeleton">Skeleton</RouterLink> takes the
              shape of the content it stands in for. In each of those the number is the
              point. Everywhere else a size comes from a scale, and{" "}
              <RouterLink to="/systems/forms">form controls</RouterLink> have one of
              their own.
            </Text>
          </Stack>
        </Section>

        <Section
          id="roles"
          title="Height, in three roles"
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
          id="shell"
          title="A full-height shell"
          lede="Five levels, two panes that scroll on their own, and a header and footer that stay put."
        >
          <Preview title="Two panes, one chain" code={scrollChainCode}>
            <ScrollChain />
          </Preview>
          <Text size="sm" color="muted">
            Drag the divider. Each pane scrolls on its own, the frame keeps its
            size, and the page behind it stays where it is. The value switches
            from <Code>remaining</Code> to <Code>parent</Code> exactly where the
            parent stops being a flex container — inside{" "}
            <Code>Splitter.Panel</Code>.
          </Text>
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
