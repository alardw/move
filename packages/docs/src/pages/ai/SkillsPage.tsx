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
  { icon: 'wand-sparkles', label: 'Slash-command discoverable' },
  { icon: 'bot', label: 'Spec-aware' },
];

const LIBRARY_SKILLS: HighlightItem[] = [
  {
    icon: 'search',
    text: '/analyze — research how other UI libraries implement a component and propose a Move-shaped approach.',
  },
  {
    icon: 'file-code',
    text: '/create-spec — author or extract a typed .spec.ts for a new component.',
  },
  {
    icon: 'edit',
    text: '/improve — amend an existing spec with a change request; surfaces what defaults flip.',
  },
  {
    icon: 'wrench',
    text: '/generate-source, /generate-meta, /generate-recipe, /generate-demo, /generate-test, /generate-all — produce each artifact from a spec.',
  },
  {
    icon: 'shield-check',
    text: '/validate — check component conformance, theme alignment, and spec drift. Optional fix mode.',
  },
];

const APP_SKILLS: HighlightItem[] = [
  {
    icon: 'rocket',
    text: '/app-setup — scaffold a complete Move app from scratch. Project files, MoveRoot, shell, routing, pages.',
  },
  {
    icon: 'layout-template',
    text: '/app-page — generate a page for a route, composed from Move components only. No custom CSS.',
  },
  {
    icon: 'blocks',
    text: '/app-composite — generate an app-specific component built entirely from Move primitives.',
  },
  {
    icon: 'package',
    text: '/app-feature — generate a feature spanning multiple pages, composites, and routes.',
  },
];

const TOC: TocItem[] = [
  { href: '#skills', label: 'Overview' },
  { href: '#library', label: 'Library skills' },
  { href: '#app', label: 'App skills' },
];

export function SkillsPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="skills">
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
            <Breadcrumb.Page>Skills</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Skills</Heading>
          <Text color="muted" size="lg">
            Every Move skill is a structured workflow your AI agent can invoke
            with a slash command. Two tracks: library (extend Move itself) and
            app (build with Move).
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
          id="library"
          title="Library skills"
          lede="For working on Move itself — analyzing, specifying, generating, validating."
        >
          <HighlightList items={LIBRARY_SKILLS} />
        </Section>

        <Section
          id="app"
          title="App skills"
          lede="For building products with Move — composing pages, composites, and features from primitives."
        >
          <HighlightList items={APP_SKILLS} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
