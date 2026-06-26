import { useMemo, useState, type ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, InputText, Button } from 'move';
import { RecipeCard, Section, TocRail, type TocItem } from '../../components';
import { RECIPES, RECIPE_GROUPS } from '../../content/recipes/registry';

const TOC: TocItem[] = [
  { href: '#recipes', label: 'Overview' },
  { href: '#browse', label: 'Browse' },
];

const GRID: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: '1rem',
};

export function RecipesOverviewPage() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<string>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RECIPES.filter((r) => {
      if (group !== 'All' && r.group !== group) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.group.toLowerCase().includes(q)
      );
    });
  }, [query, group]);

  const groupsToShow = (group === 'All' ? RECIPE_GROUPS : [group]).filter((g) =>
    filtered.some((r) => r.group === g),
  );

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
            Ready-made patterns built entirely from Move components — whole flows
            and layouts you can drop in and adapt. Search, or filter by area.
          </Text>
        </Stack>

        <Section
          id="browse"
          title="Browse"
          lede="Each card previews the live recipe; click through for the full version and its source."
        >
          <Stack gap="lg">
            <Stack direction="row" gap="sm" align="center" wrap>
              <InputText
                placeholder="Search recipes…"
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              />
              <Stack direction="row" gap="xs" wrap>
                {['All', ...RECIPE_GROUPS].map((g) => (
                  <Button
                    key={g}
                    size="sm"
                    variant={group === g ? 'solid' : 'ghost'}
                    onClick={() => setGroup(g)}
                  >
                    {g}
                  </Button>
                ))}
              </Stack>
            </Stack>

            {groupsToShow.length === 0 ? (
              <Text color="muted">No recipes match “{query}”.</Text>
            ) : (
              groupsToShow.map((g) => (
                <Stack key={g} gap="sm">
                  {group === 'All' && (
                    <Heading level={2} size="lg" weight="normal">{g}</Heading>
                  )}
                  <div style={GRID}>
                    {filtered
                      .filter((r) => r.group === g)
                      .map((r) => (
                        <RecipeCard key={`${r.groupSlug}/${r.slug}`} recipe={r} />
                      ))}
                  </div>
                </Stack>
              ))
            )}
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
