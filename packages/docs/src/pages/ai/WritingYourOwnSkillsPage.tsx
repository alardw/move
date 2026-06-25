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
  { icon: 'wrench', label: 'Extend the toolchain' },
  { icon: 'file-code', label: 'Markdown + frontmatter' },
];

const HOW_IT_WORKS: HighlightItem[] = [
  {
    icon: 'file-code',
    text: 'Each skill is a folder with one SKILL.md — frontmatter (name, description) on top, the agent prompt below. The folder name becomes the slash command.',
  },
  {
    icon: 'layers',
    text: 'Claude Code reads skills from .claude/skills/, Codex from .agents/skills/ — neither reads the other, so a skill lives in both. Keep them flat: a folder directly under skills/, not nested in categories, or they won’t be discovered.',
  },
  {
    icon: 'library',
    text: 'Skills can pull in shared references — tokens, conventions, contracts — so the prompt stays tight instead of repeating itself.',
  },
  {
    icon: 'rocket',
    text: 'Restart your agent after adding one and it shows up as a slash command — no registration step, no plugin manifest.',
  },
];

const WHEN_TO_WRITE_ONE: HighlightItem[] = [
  {
    icon: 'repeat',
    text: 'You find yourself prompting the AI through the same multi-step recipe twice — promote it.',
  },
  {
    icon: 'shield-check',
    text: 'You want the AI to honor a constraint your team agreed on (naming, layout, validation steps). Bake it into the skill.',
  },
  {
    icon: 'package',
    text: 'You\'re building app-level patterns Move doesn\'t ship — a particular form structure, dashboard layout, or wizard.',
  },
];

const TOC: TocItem[] = [
  { href: '#writing-your-own-skills', label: 'Overview' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#when', label: 'When to write one' },
];

export function WritingYourOwnSkillsPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="writing-your-own-skills">
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
            <Breadcrumb.Page>Writing Your Own Skills</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Writing Your Own Skills</Heading>
          <Text color="muted" size="lg">
            Skills are short, structured agent prompts you can add to any
            project. Encode your conventions once, invoke them by slash
            command forever.
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
          id="how-it-works"
          title="How it works"
          lede="The mechanics, in four lines."
        >
          <HighlightList items={HOW_IT_WORKS} />
        </Section>

        <Section
          id="when"
          title="When to write one"
          lede="If the answer is yes to any of these, promote the prompt to a skill."
        >
          <HighlightList items={WHEN_TO_WRITE_ONE} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
