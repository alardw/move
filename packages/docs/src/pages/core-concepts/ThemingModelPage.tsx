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
  { icon: "wand-sparkles", label: "Seed to full theme" },
  { icon: "shield-check", label: "WCAG AA guaranteed" },
  { icon: "swatch-book", label: "Swap at runtime" },
];

const THE_MODEL: HighlightItem[] = [
  {
    icon: "wand-sparkles",
    text: (
      <>
        Start from a seed, not a spreadsheet. Hand{" "}
        <RouterLink to="/customize/theme">defineThemes</RouterLink> a neutral
        and an accent color and it writes every token for you — surfaces, text,
        borders, states — in light and dark at once.
      </>
    ),
  },
  {
    icon: "download",
    text: (
      <>
        Already have a design system?{" "}
        <RouterLink to="/customize/theme#import">Import it</RouterLink> —
        distill a Tailwind, Radix, Material, or Figma token set down to a seed
        and Move regenerates the matching light + dark theme, contrast still
        guaranteed. An AI assistant can do the distilling for you.
      </>
    ),
  },
  {
    icon: "shield-check",
    text: "Legibility comes built in. Generated colors are clamped to WCAG 2.2 AA contrast, so a theme reads clearly by construction — you don’t have to check it afterwards.",
  },
  {
    icon: "layers",
    text: "Underneath sit three layers: primitives (the raw palette), semantic tokens (bg-base, fg-base, primary), and component tokens (--move-button-bg). Reach in at whichever layer you need; everything below follows along.",
  },
  {
    icon: "swatch-book",
    text: "A theme is one object, and CSS variables are the only source of truth. Change --move-primary and every component picks it up — no dark: prefixes scattered through your markup, nothing to keep in sync.",
  },
];

const SUB_TOPICS: HighlightItem[] = [
  {
    icon: "type",
    text: (
      <>
        <RouterLink to="/customize/typography">Typography</RouterLink> — set the
        font with one token, plus the size and weight scale.
      </>
    ),
  },
  {
    icon: "square-stack",
    text: (
      <>
        <RouterLink to="/systems/surfaces">Surfaces</RouterLink> — bg-base,
        bg-subtle, bg-muted, bg-emphasis, and when to reach for each.
      </>
    ),
  },
  {
    icon: "arrow-up-down",
    text: (
      <>
        <RouterLink to="/systems/stacking">Stacking</RouterLink> — the z-layer
        system for modals, popovers, and toasts.
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
    icon: "moon-star",
    text: (
      <>
        <RouterLink to="/systems/hooks">useTheme</RouterLink> — read the active
        theme and swap it at runtime from anywhere in the app.
      </>
    ),
  },
  {
    icon: "bot",
    text: (
      <>
        <RouterLink to="/ai/skills">AI theming</RouterLink> — hand the whole job
        to an assistant: generate a brand theme, or import an existing one, with
        the app-theme skill.
      </>
    ),
  },
  {
    icon: "file-code",
    text: "Tokens — the naming convention (--move-<scope>-<role>-<state>) and how layers stack.",
  },
  {
    icon: "palette",
    text: "Colors — the 13 Open Color palettes plus Move gray; per-palette text and soft-bg pairs.",
  },
  {
    icon: "puzzle",
    text: "Slot props — pass styles deep into a compound component without leaking class names.",
  },
];

const TOC: TocItem[] = [
  { href: "#theming-model", label: "Overview" },
  { href: "#the-model", label: "The model" },
  { href: "#sub-topics", label: "Going deeper" },
];

export function ThemingModelPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="theming-model">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/core-concepts">Core Concepts</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Theming Model</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Theming Model</Heading>
          <Text color="muted" size="lg">
            Everything you can see — color, spacing, radius, type — comes from
            one set of tokens. Hand Move a couple of colors and it generates the
            whole theme; reach into any single token when you want to fine-tune.
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
          id="the-model"
          title="How it works"
          lede="How a Move theme comes together — and where you can reach in."
        >
          <HighlightList items={THE_MODEL} />
        </Section>

        <Section
          id="sub-topics"
          title="Going deeper"
          lede="These go deeper — Surfaces and Stacking live under Systems, the configurable pieces under Make it your own."
        >
          <HighlightList items={SUB_TOPICS} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
