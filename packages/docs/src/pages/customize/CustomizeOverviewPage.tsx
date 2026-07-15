import { Link as RouterLink } from "react-router-dom";
import { Stack, Heading, Text, Breadcrumb, Icon, Badge } from "move";
import {
  HighlightList,
  type HighlightItem,
  Section,
  TocRail,
  type TocItem,
} from "../../components";

const BADGES = [
  { icon: "wand-sparkles", label: "Two colors → full theme" },
  { icon: "shield-check", label: "Accessible by default" },
  { icon: "moon", label: "Light + dark" },
];

const PICK_A_THEME: HighlightItem[] = [
  {
    icon: "wand-sparkles",
    text: (
      <>
        Give the <RouterLink to="/customize/theme">theme builder</RouterLink> a
        neutral and an accent color and it builds the whole thing for you —
        every surface, text tier, border, and state, in light and dark.
      </>
    ),
  },
  {
    icon: "import",
    text: (
      <>
        Already have a design system — Tailwind, Figma, Material? Bring it in:
        its accent, gray, corner radius, and fonts go into the seed, and Move
        reproduces the rest. See the{" "}
        <RouterLink to="/customize/theme">theme builder</RouterLink>.
      </>
    ),
  },
  {
    icon: "shield-check",
    text: "Whatever colors you land on, the contrast is taken care of: text, links, buttons, and focus rings stay readable in both modes — WCAG 2.2 AA, guaranteed.",
  },
  {
    icon: "sliders",
    text: "Dial it in as far as you like — corner radius, separate heading and body fonts, how vivid the accent reads — then copy one call into your app.",
  },
  {
    icon: "swatch-book",
    text: "Light and dark come from the same seed, so flipping between them at runtime is just passing a different Theme to MoveRoot.",
  },
];

const SECTIONS: HighlightItem[] = [
  {
    icon: "type",
    text: (
      <>
        <RouterLink to="/customize/typography">Typography</RouterLink> — set
        your font with one token, plus the size and weight scale.
      </>
    ),
  },
  {
    icon: "shapes",
    text: (
      <>
        <RouterLink to="/customize/icons">Icons</RouterLink> — bring your own
        icon library through one resolver.
      </>
    ),
  },
  {
    icon: "languages",
    text: (
      <>
        <RouterLink to="/customize/internationalization">
          Internationalization
        </RouterLink>{" "}
        — override every built-in label for your locale.
      </>
    ),
  },
];

const TOC: TocItem[] = [
  { href: "#make-it-your-own", label: "Overview" },
  { href: "#pick-a-theme", label: "Picking a theme" },
  { href: "#sections", label: "In this section" },
];

export function CustomizeOverviewPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="make-it-your-own">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Make it your own</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Make it your own</Heading>
          <Text color="muted" size="lg">
            Move looks good out of the box — and it’s yours to shape. Pick your
            colors and let Move build the theme, choose your fonts, bring your
            own icons, and speak your users’ language. It’s all tokens and
            props, so your changes stay tidy instead of scattered across the
            codebase.
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

        <Section
          id="pick-a-theme"
          title="Picking a theme"
          lede="Two colors in, a whole accessible theme out."
        >
          <HighlightList items={PICK_A_THEME} />
        </Section>

        <Section
          id="sections"
          title="In this section"
          lede="The rest of the toolkit."
        >
          <Stack gap="md">
            <HighlightList items={SECTIONS} />
            <Text color="muted">
              How the visual system works underneath — the{" "}
              <RouterLink to="/core-concepts/theming-model">
                token model
              </RouterLink>{" "}
              in Core Concepts, plus{" "}
              <RouterLink to="/systems/surfaces">surfaces</RouterLink> and{" "}
              <RouterLink to="/systems/stacking">stacking</RouterLink> under
              Systems.
            </Text>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
