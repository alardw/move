import { useMemo, useState, type ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, InputText, Switch, ToggleGroup, LayoutGroup } from 'move';
import { ComponentCard } from '../../components';
import { COMPONENT_CONTENT } from '../../content/components';
import type { ComponentContent } from '../../content/components/types';
import { TAXONOMY_BY_ID, CATEGORY_ORDER } from '../../content/components/taxonomies';

const catsOf = (c: ComponentContent): string[] => c.meta.categories ?? [];
const labelOf = (id: string): string => TAXONOMY_BY_ID[id]?.label ?? id;

// Animated = has motion (spec.animations non-empty) — secondary filter toggle.
const isAnimated = (c: ComponentContent): boolean =>
  ((c.spec.animations as unknown[] | undefined)?.length ?? 0) > 0;

const ALL = Object.values(COMPONENT_CONTENT).sort((a, b) =>
  a.meta.name.localeCompare(b.meta.name),
);

const GRID: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '1rem',
};

export function ComponentsOverviewPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [animated, setAnimated] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL.filter((c) => {
      if (category !== 'All' && !catsOf(c).includes(category)) return false;
      if (animated && !isAnimated(c)) return false;
      if (!q) return true;
      const aliases = (c.spec.synonyms as string[] | undefined) ?? [];
      return (
        c.meta.name.toLowerCase().includes(q) ||
        c.meta.tagline.toLowerCase().includes(q) ||
        catsOf(c).some((cat) => labelOf(cat).toLowerCase().includes(q)) ||
        aliases.some((a) => a.includes(q))
      );
    });
  }, [query, category, animated]);

  return (
    <Stack gap="xl" id="components-overview">
      <Stack gap="xl">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Components</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Components</Heading>
          <Text color="muted" size="lg">Every Move primitive, in one place.</Text>
        </Stack>

        <Stack gap="lg" id="browse">
          <Stack gap="sm">
            <Stack direction="row" gap="md" align="center" wrap>
              <InputText
                width={320}
                placeholder="Search — try “modal”, “spinner”, “otp”…"
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              />
              <Switch.Root checked={animated} onCheckedChange={setAnimated} label="Animated">
                <Switch.Thumb />
              </Switch.Root>
            </Stack>
            <div style={{ overflowX: 'auto', maxWidth: '100%', paddingBottom: '2px' }}>
              <ToggleGroup.Root
                type="single"
                value={category}
                onValueChange={(v: string) => v && setCategory(v)}
                variant="ghost"
                size="sm"
              >
                <ToggleGroup.Item value="All">All</ToggleGroup.Item>
                {CATEGORY_ORDER.map((c) => (
                  <ToggleGroup.Item key={c} value={c}>
                    {labelOf(c)}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            </div>
          </Stack>

          {filtered.length === 0 ? (
            <Text color="muted">
              No components match {query ? `“${query}”` : 'these filters'}.
            </Text>
          ) : (
            // One flat grid, one LayoutGroup — cards FLIP cohesively across the
            // whole view as search/category/animated filters change.
            <LayoutGroup asChild initial stagger={25}>
              <div style={GRID}>
                {filtered.map((c) => (
                  <ComponentCard key={c.meta.slug} content={c} />
                ))}
              </div>
            </LayoutGroup>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
