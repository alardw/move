import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge } from 'move';
import { HighlightList, type HighlightItem, Section, TocRail, type TocItem } from '../../components';

const BADGES = [
  { icon: 'layers', label: 'Cross-cutting' },
  { icon: 'boxes', label: 'Defined once' },
];

const SYSTEMS: HighlightItem[] = [
  {
    icon: 'link',
    text: (
      <>
        <RouterLink to="/systems/forms">Forms</RouterLink> — how a control gets its label and how an
        error reaches a screen reader, wired once so every field is accessible.
      </>
    ),
  },
  {
    icon: 'anchor',
    text: (
      <>
        <RouterLink to="/systems/hooks">Hooks</RouterLink> — the reusable pieces of behaviour Move’s
        components run on, ready to drop into your own.
      </>
    ),
  },
  {
    icon: 'ellipsis',
    text: (
      <>
        <RouterLink to="/systems/truncation">Truncation</RouterLink> — cutting off text that’s too
        long to fit, with the full text a hover away.
      </>
    ),
  },
  {
    icon: 'arrow-up-down',
    text: (
      <>
        <RouterLink to="/systems/stacking">Stacking</RouterLink> — what covers what when things
        overlap, so a dropdown, a dialog, and a toast never fight over the top.
      </>
    ),
  },
  {
    icon: 'square-stack',
    text: (
      <>
        <RouterLink to="/systems/surfaces">Surfaces</RouterLink> — how raised a surface looks: the
        background shades that set a card apart from the page behind it.
      </>
    ),
  },
];

const RELATED: HighlightItem[] = [
  {
    icon: 'sparkles',
    text: (
      <>
        <RouterLink to="/animation">Animation</RouterLink> — the motion system: triggers, springs, and
        sequences, wired into components rather than bolted on. Big enough for its own section.
      </>
    ),
  },
  {
    icon: 'palette',
    text: (
      <>
        <RouterLink to="/customize">Make it your own</RouterLink> — theming is a system too: one set of
        tokens drives every surface, so a brand change stays in one place.
      </>
    ),
  },
];

const TOC: TocItem[] = [
  { href: '#systems', label: 'Overview' },
  { href: '#the-systems', label: 'The systems' },
  { href: '#related', label: 'Related systems' },
];

export function SystemsOverviewPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="systems">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Systems</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Systems</Heading>
          <Text color="muted" size="lg">
            Some things aren’t owned by any one component but shared by many — and if each component
            answered them on its own, they’d disagree. A system is where one of those answers is
            decided, once, so everything stays consistent.
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
          id="the-systems"
          title="The systems"
          lede="The rules and tokens that keep many components coherent — reach for them directly when you compose your own screens."
        >
          <HighlightList items={SYSTEMS} />
        </Section>

        <Section
          id="related"
          title="Related systems"
          lede="Two more systems, each large enough to have earned its own section."
        >
          <HighlightList items={RELATED} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
