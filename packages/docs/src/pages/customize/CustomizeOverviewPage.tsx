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
  { icon: 'wand-sparkles', label: 'Brand + locale' },
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
    text: 'A defineTheme() helper that expands a small seed (neutral palette, accent, status colors, font) into the full token set is planned — so you configure a handful of values instead of the whole surface.',
  },
];

const SECTIONS: HighlightItem[] = [
  {
    icon: 'type',
    text: (
      <>
        <RouterLink to="/customize/typography">Typography</RouterLink> — set your font with one token, plus the size and weight scale.
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
    icon: 'languages',
    text: (
      <>
        <RouterLink to="/customize/internationalization">Internationalization</RouterLink> — override every built-in label for your locale.
      </>
    ),
  },
];

const TOC: TocItem[] = [
  { href: '#make-it-your-own', label: 'Overview' },
  { href: '#pick-a-theme', label: 'Picking a theme' },
  { href: '#sections', label: 'In this section' },
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
          <Heading level={1} weight="normal">Make it your own</Heading>
          <Text color="muted" size="lg">
            Move ships with sensible defaults; this is where you make it yours —
            pick a theme and colors, set your font, swap in your icon library,
            and localize the built-in labels. It’s all tokens and props, so
            customization stays structural instead of scattered overrides.
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
          lede="Each lever to make Move yours."
        >
          <Stack gap="md">
            <HighlightList items={SECTIONS} />
            <Text color="muted">
              How the visual system works underneath — the token model,{' '}
              <RouterLink to="/core-concepts/surfaces">surfaces</RouterLink>, and{' '}
              <RouterLink to="/core-concepts/stacking">stacking</RouterLink> — lives in{' '}
              <RouterLink to="/core-concepts/theming-model">Core Concepts</RouterLink>.
            </Text>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
