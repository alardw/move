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
  { icon: 'file-code', label: 'Typed contract' },
  { icon: 'shield-check', label: 'Generates and validates' },
];

const WHATS_IN_A_SPEC: HighlightItem[] = [
  {
    icon: 'puzzle',
    text: 'Slots and sub-components — the compound shape of the component (Root, Trigger, Content, Item…).',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Props per sub-component, with types, defaults, and whether they\'re Move-specific or HTML passthrough.',
  },
  {
    icon: 'palette',
    text: 'Variants, sizes, colors — the canonical axes the component supports.',
  },
  {
    icon: 'sparkles',
    text: 'Animation config — triggers and sequences the component runs by default.',
  },
  {
    icon: 'palette',
    text: 'Design tokens — the CSS variables the component exposes for overrides.',
  },
  {
    icon: 'check-square',
    text: 'Accessibility contract — roles, ARIA wiring, keyboard model. Validated, not assumed.',
  },
];

const WHY_IT_WORKS: HighlightItem[] = [
  {
    icon: 'wand-sparkles',
    text: 'AI reads the spec, not source. The contract is machine-readable, the implementation is an output.',
  },
  {
    icon: 'shield-check',
    text: 'Validators compare source against spec. Drift is detected automatically — the AI can\'t silently break the contract.',
  },
  {
    icon: 'refresh-cw',
    text: 'Docs, tests, demos, and recipes all derive from the same spec. Nothing falls out of sync.',
  },
];

const TOC: TocItem[] = [
  { href: '#specs', label: 'Overview' },
  { href: '#whats-inside', label: 'What\'s in a spec' },
  { href: '#why-it-works', label: 'Why it works' },
];

export function SpecsPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="specs">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/ai">AI</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Specs</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Specs</Heading>
          <Text color="muted" size="lg">
            Every Move component starts as a spec — a typed contract that
            describes its shape, behaviour, tokens, and accessibility. Source
            is generated from the spec, then validated against it.
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
          id="whats-inside"
          title="What's in a spec"
          lede="Six load-bearing fields. Read one real spec and the rest will pattern-match."
        >
          <HighlightList items={WHATS_IN_A_SPEC} />
        </Section>

        <Section
          id="why-it-works"
          title="Why it works"
          lede="The spec is what makes Move predictable for both people and AI."
        >
          <HighlightList items={WHY_IT_WORKS} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
