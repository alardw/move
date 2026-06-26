import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge } from 'move';
import {
  HighlightList,
  type HighlightItem,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

const BADGES = [
  { icon: 'palette', label: 'Token-first' },
  { icon: 'moon', label: 'Light + dark out of the box' },
  { icon: 'swatch-book', label: 'Swap at runtime' },
];

const THE_MODEL: HighlightItem[] = [
  {
    icon: 'layers',
    text: 'Three layers stack: primitives (the raw palette), semantic tokens (bg-base, fg-base, border-base), component tokens (--move-button-bg). Override at any layer; the rest inherits.',
  },
  {
    icon: 'moon',
    text: 'Light and dark ship by default. Pass a Theme object to MoveRoot and the whole tree flips. No source-scattered dark: prefixes.',
  },
  {
    icon: 'swatch-book',
    text: 'A theme is one object, not a hundred class strings. Authoring a new one is editing semantic tokens, not chasing utilities.',
  },
  {
    icon: 'shield-check',
    text: 'CSS variables are the system. Change --move-primary and every component picks it up — there is no second source of truth.',
  },
];

const SUB_TOPICS: HighlightItem[] = [
  {
    icon: 'type',
    text: (
      <>
        <RouterLink to="/customize/typography">Typography</RouterLink> — set the font with one token, plus the size and weight scale.
      </>
    ),
  },
  {
    icon: 'square-stack',
    text: (
      <>
        <RouterLink to="/core-concepts/surfaces">Surfaces</RouterLink> — bg-base, bg-subtle, bg-muted, bg-emphasis, and when to reach for each.
      </>
    ),
  },
  {
    icon: 'arrow-up-down',
    text: (
      <>
        <RouterLink to="/core-concepts/stacking">Stacking</RouterLink> — the z-layer system for modals, popovers, and toasts.
      </>
    ),
  },
  {
    icon: 'shapes',
    text: (
      <>
        <RouterLink to="/customize/icons">Icons</RouterLink> — bring your own icon library through one resolver.
      </>
    ),
  },
  {
    icon: 'file-code',
    text: 'Tokens — the naming convention (--move-<scope>-<role>-<state>) and how layers stack.',
  },
  {
    icon: 'palette',
    text: 'Colors — the 13 Open Color palettes plus Move gray; per-palette text and soft-bg pairs.',
  },
  {
    icon: 'puzzle',
    text: 'Slot props — pass styles deep into a compound component without leaking class names.',
  },
];

const TOC: TocItem[] = [
  { href: '#theming-model', label: 'Overview' },
  { href: '#the-model', label: 'The model' },
  { href: '#sub-topics', label: 'Going deeper' },
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
            Tokens are the system. Every visible decision — color, spacing,
            radius, type — flows through one set of variables that you can
            override at any layer.
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
          title="The model"
          lede="One mental model, one set of levers, predictable behavior at every layer."
        >
          <HighlightList items={THE_MODEL} />
        </Section>

        <Section
          id="sub-topics"
          title="Going deeper"
          lede="These go deeper — Surfaces and Stacking here in Core Concepts, the configurable pieces under Make it your own."
        >
          <HighlightList items={SUB_TOPICS} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
