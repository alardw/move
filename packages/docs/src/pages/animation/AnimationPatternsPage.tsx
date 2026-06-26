import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code } from 'move';
import {
  HighlightList,
  type HighlightItem,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

const TAGLINE =
  'The motion in Move components is assembled from a handful of named patterns. These are them.';

const BADGES = [
  { icon: 'puzzle', label: 'Ready-made' },
  { icon: 'blocks', label: 'Shared across components' },
];

const COMMON: HighlightItem[] = [
  {
    icon: 'mouse-pointer-click',
    text: 'interactive — scale up on hover, down on press. Buttons, toggles, pagination, day cells.',
  },
  {
    icon: 'toggle-left',
    text: 'toggle — animate a thumb or mark as a value flips. Checkbox, radio, switch.',
  },
  {
    icon: 'chevron-down',
    text: 'popup — reveal a panel by height and stagger its items in. Select, dropdown, autocomplete, date picker.',
  },
  {
    icon: 'log-in',
    text: 'enterExit — fade and slide on mount and unmount. Alert, avatar, chat bubble, popover, toast.',
  },
  {
    icon: 'layers',
    text: 'overlay — fade a backdrop while its panel springs in. Dialog, drawer.',
  },
  {
    icon: 'unfold-vertical',
    text: 'expand — grow height and opacity together as a region opens. Accordion, collapsible.',
  },
  {
    icon: 'move-horizontal',
    text: 'position — slide an indicator to track the active item. Tabs, pagination, toggle group.',
  },
];

const SPECIALIZED: HighlightItem[] = [
  {
    icon: 'panel-left',
    text: 'widthCollapse — animate width to a CSS variable as a rail collapses. Sidebar.',
  },
  {
    icon: 'timer',
    text: 'countdown — run a progress bar that pauses on hover and resumes on leave. Toast.',
  },
  {
    icon: 'check-check',
    text: 'exitOnStatus — animate an item out when its status changes, then remove it. File upload.',
  },
  {
    icon: 'arrow-right',
    text: 'pageSlide — slide newly appearing items in as a page changes. Pagination.',
  },
  {
    icon: 'activity',
    text: 'loopPulse — a looping, alternating pulse. Skeleton.',
  },
];

const TOC: TocItem[] = [
  { href: '#patterns', label: 'Overview' },
  { href: '#common', label: 'Common patterns' },
  { href: '#specialized', label: 'Specialized patterns' },
  { href: '#presets', label: 'Presets underneath' },
];

export function AnimationPatternsPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="patterns">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/animation">Animation</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Patterns</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Patterns</Heading>
          <Text color="muted" size="lg">{TAGLINE}</Text>
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
          id="common"
          title="Common patterns"
          lede="The recipes most components reach for."
        >
          <Text>
            A pattern is a trigger and sequence paired for a recurring job.
            Because the same pattern drives many components, a press feels like a
            press and a reveal feels like a reveal across the whole library.
          </Text>
          <HighlightList items={COMMON} />
        </Section>

        <Section
          id="specialized"
          title="Specialized patterns"
          lede="A few components need motion that's specific to them."
        >
          <HighlightList items={SPECIALIZED} />
        </Section>

        <Section
          id="presets"
          title="Presets underneath"
          lede="Patterns are built from smaller animation atoms."
        >
          <Text>
            Below the patterns sit a set of named atoms — <Code>fadeIn</Code>,{' '}
            <Code>popIn</Code>, <Code>scaleUp</Code> and a few others — and
            bundles that combine them. A step can name a preset instead of
            spelling out properties, which is how a sequence stays short. The{' '}
            <RouterLink to="/animation/reference">Reference</RouterLink> lists
            the full set.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
