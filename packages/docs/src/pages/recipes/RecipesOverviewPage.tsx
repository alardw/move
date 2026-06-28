import { useMemo, useState, type ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, InputText, ToggleGroup, LayoutGroup } from 'move';
import { RecipeCard } from '../../components';
import { RECIPES, RECIPE_GROUPS } from '../../content/recipes/registry';

// Recipes are whole flows/layouts, not single primitives — give each card more
// room than the components grid's 260px so the live preview isn't cramped.
const GRID: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
  gap: '1rem',
};

// Flat grid → sort by title, the same model components use (meta.name).
const ALL = [...RECIPES].sort((a, b) => a.title.localeCompare(b.title));

export function RecipesOverviewPage() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<string>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL.filter((r) => {
      if (group !== 'All' && r.group !== group) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.group.toLowerCase().includes(q) ||
        r.synonyms.some((s) => s.includes(q))
      );
    });
  }, [query, group]);

  return (
    <Stack gap="xl" id="recipes">
      <Stack gap="xl">
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
          <Heading level={1}>Recipes</Heading>
          <Text color="muted" size="lg">
            Ready-made patterns built entirely from Move components — whole flows
            you can drop in and adapt.
          </Text>
        </Stack>

        <Stack gap="lg" id="browse">
          <Stack gap="sm">
            <Stack direction="row" gap="md" align="center" wrap>
              <InputText
                width={320}
                placeholder="Search recipes…"
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              />
            </Stack>
            <div style={{ overflowX: 'auto', maxWidth: '100%', paddingBottom: '2px' }}>
              <ToggleGroup.Root
                type="single"
                value={group}
                onValueChange={(v: string) => v && setGroup(v)}
                variant="ghost"
                size="sm"
              >
                <ToggleGroup.Item value="All">All</ToggleGroup.Item>
                {RECIPE_GROUPS.map((g) => (
                  <ToggleGroup.Item key={g} value={g}>
                    {g}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            </div>
          </Stack>

          {filtered.length === 0 ? (
            <Text color="muted">
              No recipes match {query ? `“${query}”` : 'these filters'}.
            </Text>
          ) : (
            // One flat grid, one LayoutGroup — cards FLIP cohesively across the
            // whole view as search/group filters change (mirrors components).
            <LayoutGroup asChild initial stagger={25}>
              <div style={GRID}>
                {filtered.map((r) => (
                  <RecipeCard key={`${r.groupSlug}/${r.slug}`} recipe={r} />
                ))}
              </div>
            </LayoutGroup>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
