import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Stack,
  Heading,
  Text,
  Breadcrumb,
  Code,
  Badge,
  Icon,
  Link,
} from "move";
import { Section, TocRail, Preview, type TocItem } from "../../components";

/**
 * Truncation. A cross-cutting concern, not a component: one `truncate` prop
 * across the text primitives, a global `[data-truncate]` utility, the
 * `useTruncate` hook, and an opt-in tooltip. This page is the connective tissue.
 */

const PATH = "/Users/alard/projects/move/packages/move/src/index.ts";
const BLURB =
  "One seed derives every surface and keeps text legible in both modes, so the mood carries through without any manual tuning of individual tokens.";

const TOC: TocItem[] = [
  { href: "#overview", label: "Overview" },
  { href: "#strategies", label: "Four ways to trim" },
  { href: "#tooltip", label: "The full text on hover" },
  { href: "#room", label: "Give it room to shrink" },
  { href: "#where", label: "Where it lives" },
];

// A fixed, smallish frame so the demos genuinely run out of room. `resizable`
// adds a drag handle so you can watch the text re-trim — and the tooltip come
// and go — as the width changes.
function Frame({
  children,
  width = 300,
  resizable = false,
}: {
  children: ReactNode;
  width?: number;
  resizable?: boolean;
}) {
  return (
    <div
      style={{
        width,
        maxWidth: "100%",
        minWidth: resizable ? 140 : undefined,
        padding: "10px 14px",
        border: "1px solid var(--move-border-base)",
        borderRadius: 10,
        background: "var(--move-bg-subtle)",
        resize: resizable ? "horizontal" : undefined,
        overflow: resizable ? "hidden" : undefined,
      }}
    >
      {children}
    </div>
  );
}

const STRATEGIES: {
  mode: "end" | "start" | "middle" | "clamp";
  title: string;
  blurb: string;
}[] = [
  {
    mode: "end",
    title: "End",
    blurb:
      "The default — trims the tail and adds an ellipsis. Right for most labels and values.",
  },
  {
    mode: "start",
    title: "Start",
    blurb:
      "Keeps the end in view. Handy when the part that matters is at the end.",
  },
  {
    mode: "middle",
    title: "Middle",
    blurb:
      "Keeps both ends and hides the middle. Made for file paths, IDs, and hashes.",
  },
  {
    mode: "clamp",
    title: "Clamp",
    blurb:
      "Wraps to a set number of lines, then ellipsizes. For blurbs and descriptions.",
  },
];

export function TruncationPage() {
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
            <Breadcrumb.Page>Truncation</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Truncation</Heading>
          <Text color="muted" size="lg">
            Text doesn't always fit — a long filename in a narrow row, a title
            in a small card. Move gives every piece of text one{" "}
            <Code>truncate</Code> prop that trims it gracefully, adapts as the
            space around it changes, and can pop the full text back on hover.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft">
              <Icon name="minimize" />
              Four strategies
            </Badge>
            <Badge variant="soft">
              <Icon name="eye" />
              Tooltip when it's cut off
            </Badge>
          </Stack>
        </Stack>

        <Section
          id="strategies"
          title="Four ways to trim"
          lede="Same prop, four shapes. Pick the one that keeps the part that matters — set it once and it recomputes as the container resizes."
        >
          <Preview
            code={`<Text truncate>{path}</Text>            {/* end — the default */}
<Text truncate="start">{path}</Text>
<Text truncate="middle">{path}</Text>
<Text truncate="clamp" lines={2}>{blurb}</Text>`}
          >
            <Stack gap="lg">
              {STRATEGIES.map((s) => (
                <Stack key={s.mode} gap="sm">
                  <Stack direction="row" gap="sm" align="baseline" wrap>
                    <Text weight="medium">{s.title}</Text>
                    <Code>
                      truncate=&quot;{s.mode}&quot;
                      {s.mode === "clamp" ? " lines={2}" : ""}
                    </Code>
                  </Stack>
                  <Text size="sm" color="muted">
                    {s.blurb}
                  </Text>
                  <Frame>
                    {s.mode === "clamp" ? (
                      <Text truncate="clamp" lines={2}>
                        {BLURB}
                      </Text>
                    ) : (
                      <Text truncate={s.mode}>{PATH}</Text>
                    )}
                  </Frame>
                </Stack>
              ))}
            </Stack>
          </Preview>
          <Text size="sm" color="muted">
            <em>Middle</em> pins the last path segment (everything after the
            final <Code>/</Code>) — or the last few characters when there's no
            separator — and trims the head, so the ellipsis lands wherever the
            head runs out of room. The full string always stays in the page for
            screen readers; trimming is only visual.
          </Text>
        </Section>

        <Section
          id="tooltip"
          title="The full text on hover"
          lede="Add tooltip and the whole string comes back on hover — but only when it's actually cut off, so text that fits stays quiet. It's a real Move tooltip, not the browser's."
        >
          <Stack gap="sm">
            <Preview code={`<Text truncate tooltip>{path}</Text>`}>
              <Frame resizable>
                <Text truncate tooltip>
                  {PATH}
                </Text>
              </Frame>
            </Preview>
            <Text size="sm" color="muted">
              Drag the box's right edge to give the line more or less room. It
              measures itself as the width changes, so the tooltip only appears
              while the path is actually cut off — widen it enough and the
              tooltip bows out.
            </Text>
          </Stack>
        </Section>

        <Section
          id="room"
          title="Give it room to shrink"
          lede="Trimming is CSS, so it's free and responsive — with one catch worth knowing."
        >
          <Stack gap="md">
            <Text>
              Truncation can only happen when the text has a{" "}
              <em>bounded, shrinkable</em> width. On its own that's automatic —
              a truncated element already tells its own box it may shrink, so a{" "}
              <Code>&lt;Text truncate&gt;</Code> dropped straight into a row
              clips happily while its neighbours keep their size.
            </Text>
            <Text>
              The one place it needs a nudge is a <em>wrapper</em> in a flex
              row. Flex children refuse to shrink below their content by
              default, so if you tuck the text inside a column, give that column{" "}
              <Code>flex={"{1}"}</Code> (which lets it shrink) and the text
              inside trims as expected:
            </Text>
            <Preview
              code={`<Stack direction="row" gap="sm" align="center">
  <Stack flex={1}>
    <Text truncate>{longTitle}</Text>
  </Stack>
  <Badge variant="soft">Draft</Badge>
</Stack>`}
            >
              <div style={{ maxWidth: 360, width: "100%" }}>
                <Stack direction="row" gap="sm" align="center">
                  <Stack flex={1}>
                    <Text truncate>
                      feature/a-really-long-branch-name-that-overflows-the-row
                    </Text>
                  </Stack>
                  <Badge variant="soft">Draft</Badge>
                </Stack>
              </div>
            </Preview>
            <Text size="sm" color="muted">
              That's the whole contract: the text (or a{" "}
              <Code>flex={"{1}"}</Code> ancestor) has to be allowed to shrink.
              Everything else is handled for you.
            </Text>
          </Stack>
        </Section>

        <Section
          id="where"
          title="Where it lives"
          lede="One system, a few surfaces."
        >
          <Stack gap="md">
            <Text>
              The <Code>truncate</Code> prop is on every text primitive —{" "}
              <Code>Text</Code>, <Code>Heading</Code>, <Code>Code</Code>,{" "}
              <Code>Link</Code>, and <Code>Label</Code> — and on the text slots
              of composites like <Code>List.Title</Code> and{" "}
              <Code>Card.Title</Code>. Under the hood it's a single global
              utility keyed on a <Code>data-truncate</Code> attribute, so any
              element can opt in the same way.
            </Text>
            <Text>
              For the rare case that needs to <em>react</em> to whether text is
              clipped — a custom badge, a conditional action — the{" "}
              <Link asChild>
                <RouterLink to="/systems/hooks">useTruncate</RouterLink>
              </Link>{" "}
              hook hands you an <Code>isTruncated</Code> flag, re-measured as
              the layout changes. The tooltip above is built on it.
            </Text>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
