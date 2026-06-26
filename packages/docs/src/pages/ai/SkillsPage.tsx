import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge } from 'move';
import {
  CodeBlock,
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

const INSTALL_NOTES: HighlightItem[] = [
  {
    icon: 'copy',
    text: 'Copies real files into both .claude/skills/ (Claude Code) and .agents/skills/ (Codex). Neither tool reads the other’s folder, so you get both — no choice to make.',
  },
  {
    icon: 'folder',
    text: 'Each skill lands as a flat folder with a SKILL.md, so your agent discovers it as a /slash-command straight away.',
  },
  {
    icon: 'git-commit-horizontal',
    text: 'The skills are yours once copied — commit them, tweak a prompt, or drop the ones you don’t use. Re-run the command to pull updates.',
  },
  {
    icon: 'rotate-cw',
    text: 'Restart your AI assistant after installing (or re-running) so it picks up the new skills — agents discover skills at startup, not mid-session.',
  },
];

const COMPONENT_SKILLS: HighlightItem[] = [
  {
    icon: 'search',
    text: '/component-analyze — research how other UI libraries implement a component and propose a Move-shaped approach.',
  },
  {
    icon: 'file-code',
    text: '/component-create-spec — author or extract a typed .spec.ts for a new component.',
  },
  {
    icon: 'edit',
    text: '/component-improve — amend an existing spec with a change request; surfaces what defaults flip.',
  },
  {
    icon: 'wrench',
    text: '/component-generate-source, /component-generate-meta, /component-generate-test, /component-generate-all — produce each artifact from a spec.',
  },
  {
    icon: 'shield-check',
    text: '/component-validate — check component conformance, theme alignment, and spec drift. Optional fix mode.',
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
  { href: '#install', label: 'Install' },
  { href: '#component', label: 'Component skills' },
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
          <Heading level={1}>Skills</Heading>
          <Text color="muted" size="lg">
            Every Move skill is a structured workflow your AI agent can invoke
            with a slash command. Two tracks: component skills (author a Move
            component from a typed spec) and app skills (compose pages,
            composites, and features).
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
          id="install"
          title="Installing the skills"
          lede="One command copies the whole set into your project, so your AI agent can run Move’s spec-driven workflow right where your code lives."
        >
          <Stack gap="md">
            <CodeBlock language="bash" code="npx move skills" />
            <HighlightList items={INSTALL_NOTES} />
          </Stack>
        </Section>

        <Section
          id="component"
          title="Component skills"
          lede="Author a component from a typed spec — analyze, specify, generate, validate. Use them to extend Move itself, or to build your own spec-driven components in your app."
        >
          <HighlightList items={COMPONENT_SKILLS} />
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
