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
  { icon: 'layers', label: 'Layered overrides' },
];

const PICK_A_THEME: HighlightItem[] = [
  {
    icon: 'moon',
    text: 'Two themes ship by default: light and dark. Switch by passing a Theme to <MoveRoot theme={…}>.',
  },
  {
    icon: 'swatch-book',
    text: 'Authoring a new theme is editing one object: semantic tokens (bg, fg, border, primary, status colors) plus a shadow config. No source-scattered overrides.',
  },
  {
    icon: 'shield-check',
    text: 'A defineTheme() helper takes a small seed (neutral palette, accent, status colors) and expands it to the full token surface. Coming soon — see the theming roadmap.',
  },
];

const SECTIONS: HighlightItem[] = [
  {
    icon: 'square-stack',
    text: 'Surfaces — bg-base, bg-subtle, bg-muted, bg-emphasis. The hierarchy and when to use each.',
  },
  {
    icon: 'arrow-up-down',
    text: 'Stacking — the z-layer system. Modals, popovers, toasts, tooltips, each on their own layer.',
  },
  {
    icon: 'file-code',
    text: 'Tokens — the naming convention and the three layers (primitive → semantic → component).',
  },
  {
    icon: 'palette',
    text: 'Colors — the 13 Open Color palettes plus Move gray, and how they map onto status colors.',
  },
  {
    icon: 'type',
    text: 'Typography — font families, the size scale, weights, heading scale.',
  },
  {
    icon: 'puzzle',
    text: 'Slot props — pass styles deep into compound components without leaking class names.',
  },
];

const TOC: TocItem[] = [
  { href: '#theming', label: 'Overview' },
  { href: '#pick-a-theme', label: 'Picking a theme' },
  { href: '#sections', label: 'In this section' },
];

export function ThemingOverviewPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="theming">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Theming</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Theming</Heading>
          <Text color="muted" size="lg">
            Move is token-first. Pick a theme, tweak a few variables, or
            author your own — the system flips the whole tree without you
            chasing utility classes through every file.
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
          lede="The shortest path to a styled app."
        >
          <HighlightList items={PICK_A_THEME} />
        </Section>

        <Section
          id="sections"
          title="In this section"
          lede="Two dedicated pages today; the rest land here as anchored sections until they earn their own."
        >
          <HighlightList items={SECTIONS} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
