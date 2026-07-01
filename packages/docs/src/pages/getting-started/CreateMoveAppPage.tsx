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
  { icon: 'rocket', label: 'One command' },
  { icon: 'wand-sparkles', label: 'AI-ready out of the box' },
];

const WHAT_YOU_GET: HighlightItem[] = [
  {
    icon: 'folder',
    text: 'A Vite or Next.js project with MoveRoot already wired, a theme picked, and the icon resolver hooked up.',
  },
  {
    icon: 'layout-template',
    text: 'An app shell to start from — sidebar layout, blank canvas, or anything we add later. Pick at scaffold time.',
  },
  {
    icon: 'bot',
    text: 'The Move skill set installed under .claude/skills so coding agents discover them automatically — including /app-compose, which builds your pages and features into src/composites.',
  },
  {
    icon: 'shield-check',
    text: 'Conformance wired in: move check in your scripts and CI for the static gates, plus the accessibility ratchet test and its baseline — so neither you nor an agent can silently drift from the design system.',
  },
];

const TOC: TocItem[] = [
  { href: '#create-move-app', label: 'Overview' },
  { href: '#whats-inside', label: 'What you get' },
];

export function CreateMoveAppPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="create-move-app">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/getting-started">Getting started</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Create Move App</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Create Move App</Heading>
          <Text color="muted" size="lg">
            The fastest way to start a Move project. One command and you&apos;re
            rendering, theming, and ready for AI to help.
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
          title="What you get"
          lede="A fresh project with the wiring already done — so you can spend the first hour building, not configuring."
        >
          <HighlightList items={WHAT_YOU_GET} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
