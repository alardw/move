import { useMemo, useState, type ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, InputText, ToggleGroup } from 'move';
import { RecipeCard } from '../../components';
import { RECIPES, RECIPE_GROUPS } from '../../content/recipes/registry';

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

  const grouped = group === 'All';
  const sections = (grouped ? RECIPE_GROUPS : [group]).filter((g) =>
    filtered.some((r) => r.group === g),
  );

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
            sections.map((g) => (
              <Stack key={g} gap="sm">
                {grouped && <Heading level={3}>{g}</Heading>}
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
      </Stack>
    </Stack>
  );
}
