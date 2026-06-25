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
  { icon: 'puzzle', label: 'Small surface' },
  { icon: 'react', label: 'React-native APIs' },
];

const HOOKS: HighlightItem[] = [
  {
    icon: 'sparkles',
    text: 'useAnimations — wires a trigger + sequence config to a ref map. The hook every animated Move component uses internally; reach for it when building your own.',
  },
  {
    icon: 'move-vertical',
    text: 'useMorphHeight — animate an element\'s height between two natural sizes when a key changes. The piece behind Preview\'s view toggle.',
  },
  {
    icon: 'panel-left',
    text: 'useSidebarContext — read or change the Sidebar\'s collapsed state from anywhere inside it (the toggle button, the active item, your own footer).',
  },
  {
    icon: 'toggle-left',
    text: 'useControlledState — the canonical controlled/uncontrolled state helper. Lets components accept value+onChange, defaultValue, or neither, with one implementation.',
  },
  {
    icon: 'git-merge',
    text: 'useMergedRef — combine a forwarded ref with an internal one so components can both expose a ref to consumers and use one themselves.',
  },
];

const TOC: TocItem[] = [
  { href: '#hooks', label: 'Overview' },
  { href: '#the-set', label: 'The set' },
];

export function HooksPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="hooks">
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
            <Breadcrumb.Page>Hooks</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Hooks</Heading>
          <Text color="muted" size="lg">
            A small set of React hooks Move ships for the cases that need to
            cross component lines. Same shape as React&apos;s built-ins, no extra
            ceremony.
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
          id="the-set"
          title="The set"
          lede="What ships today. Signatures, options, return shapes — each one gets a section below."
        >
          <HighlightList items={HOOKS} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
