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
  { icon: 'book-open', label: 'Real app patterns' },
  { icon: 'blocks', label: 'Composed from primitives' },
];

const RECIPES: HighlightItem[] = [
  {
    icon: 'layout-template',
    text: 'App shells — sidebar + content + header, or split-pane editor, or multi-panel canvas. The skeleton most apps start with.',
  },
  {
    icon: 'form-input',
    text: 'Forms — single column, two column, wizards, autosave, validation surfacing. The patterns that span most products.',
  },
  {
    icon: 'table',
    text: 'Data patterns — filterable tables, paginated lists, infinite scrolls, empty states, loading states. The "actual product" layer.',
  },
  {
    icon: 'gauge',
    text: 'Dashboards — KPI tiles, card grids, chart placeholders, mixed-density layouts. The "show me what\'s happening" layer.',
  },
];

const HOW_TO_READ: HighlightItem[] = [
  {
    icon: 'eye',
    text: 'Every recipe shows the final screen as a live preview at the top — start there, see what you\'re building toward.',
  },
  {
    icon: 'file-code',
    text: 'Below the preview is the full JSX. Copy it, paste it, adjust the props.',
  },
  {
    icon: 'link',
    text: 'Components used are listed with links, so you can dig into individual primitives without leaving the recipe context.',
  },
];

const TOC: TocItem[] = [
  { href: '#recipes', label: 'Overview' },
  { href: '#what-we-cover', label: 'What we cover' },
  { href: '#how-to-read', label: 'How to read a recipe' },
];

export function RecipesOverviewPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="recipes">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Recipes</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Recipes</Heading>
          <Text color="muted" size="lg">
            Real product patterns, composed entirely from Move primitives. The
            proof that you don&apos;t need a custom CSS file to ship the screen
            you have in mind.
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
          id="what-we-cover"
          title="What we cover"
          lede="The four patterns most apps spend their lives on."
        >
          <HighlightList items={RECIPES} />
        </Section>

        <Section
          id="how-to-read"
          title="How to read a recipe"
          lede="Each one follows the same shape so you can skim it fast."
        >
          <HighlightList items={HOW_TO_READ} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
