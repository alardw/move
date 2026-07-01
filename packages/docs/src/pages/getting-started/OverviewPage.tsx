import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge } from 'move';
import {
  HighlightList,
  type HighlightItem,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

/**
 * Getting started → Overview. The front door. States what Move is — a
 * framework with three parts — names them once, and sends the reader to
 * How Move Works for the depth. It does not re-explain the parts here.
 */

const TAGLINE =
  'A framework for building React products with AI — so an assistant builds a real product that holds together as it grows.';

const BADGES = [
  { icon: 'blocks', label: 'Building blocks' },
  { icon: 'bot', label: 'AI skills' },
  { icon: 'shield-check', label: 'Conformance checks' },
];

const TRIAD: HighlightItem[] = [
  {
    icon: 'blocks',
    text: 'Building blocks — components that arrive finished and accessible: keyboard, focus, the edge cases, and motion already inside.',
  },
  {
    icon: 'bot',
    text: 'AI skills — the playbooks an assistant composes those blocks with, as a guided pipeline rather than one loose prompt.',
  },
  {
    icon: 'shield-check',
    text: 'Conformance checks — they keep the framework from drifting, and the same checks run on your own project as it grows.',
  },
];

const MAKE_YOUR_OWN: HighlightItem[] = [
  {
    icon: 'palette',
    text: 'Theme it to your brand — color, type, spacing, and radius, in light and dark, all come from one set of tokens, so restyling the whole product is a change in one place.',
  },
  {
    icon: 'package-plus',
    text: 'Add a component when Move doesn’t ship a block you need — generate a new one from a spec, and it arrives with the same tokens, motion, and accessibility as the rest of the library.',
  },
  {
    icon: 'layout-template',
    text: 'Every page and feature you build is a composition — a first-class part of the same system, spec-driven and held to the same checks as the blocks it’s made of.',
  },
];

const USE_MOVE_IF: HighlightItem[] = [
  {
    icon: 'check',
    text: 'You want the AI’s output to be real, maintainable code on a framework you control.',
  },
  {
    icon: 'check',
    text: 'You want it to hold together as it grows — spacing, color, and interaction patterns staying consistent across every feature you and the AI add, checked automatically.',
  },
  {
    icon: 'check',
    text: 'You care how it feels — motion and interaction quality that come with the components.',
  },
];

const TOC: TocItem[] = [
  { href: '#overview', label: 'Overview' },
  { href: '#what-move-is', label: 'What Move is' },
  { href: '#make-it-your-own', label: 'Make it your own' },
  { href: '#for-you-if', label: 'Use Move if…' },
  { href: '#next-steps', label: 'Next steps' },
];

export function OverviewPage() {
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
            <Breadcrumb.Page>Getting started</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Move UI</Heading>
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
          id="what-move-is"
          title="What Move is"
          lede="A framework for building React products with AI — three parts, working as one."
        >
          <HighlightList items={TRIAD} />
          <Text>
            <RouterLink to="/core-concepts/how-move-works">How Move Works</RouterLink> walks through each part, and the contract that ties them together. For the problem it solves, see <RouterLink to="/getting-started/what-ai-gets-wrong">what AI gets wrong</RouterLink> on its own.
          </Text>
        </Section>

        <Section
          id="make-it-your-own"
          title="Make it your own"
          lede="The framework is yours to brand and extend — and everything you add stays part of the same system."
        >
          <HighlightList items={MAKE_YOUR_OWN} />
          <Text>
            See <RouterLink to="/customize">Customize</RouterLink> for theming, typography, icons, and language.
          </Text>
        </Section>

        <Section id="for-you-if" title="Use Move if…">
          <HighlightList items={USE_MOVE_IF} />
        </Section>

        <Section id="next-steps" title="Next steps">
          <HighlightList
            items={[
              {
                icon: 'brain',
                text: (
                  <>
                    Start with <RouterLink to="/core-concepts/how-move-works">How Move Works</RouterLink> to get the mental model before you browse APIs.
                  </>
                ),
              },
              {
                icon: 'download',
                text: (
                  <>
                    Then go to <RouterLink to="/getting-started/installation">Installation</RouterLink> to get a project rendering.
                  </>
                ),
              },
              {
                icon: 'bot',
                text: (
                  <>
                    Continue to <RouterLink to="/ai">AI Overview</RouterLink> for the skills and the conformance workflow in full.
                  </>
                ),
              },
            ]}
          />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
