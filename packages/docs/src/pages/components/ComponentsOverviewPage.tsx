import { useMemo, useState, type ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, InputText, Button } from 'move';
import { ComponentCard, Section, TocRail, type TocItem } from '../../components';
import { COMPONENT_CONTENT } from '../../content/components';

const ALL = Object.values(COMPONENT_CONTENT).sort((a, b) =>
  a.meta.name.localeCompare(b.meta.name),
);
const CATEGORIES = [...new Set(ALL.map((c) => c.meta.badges[0]?.label ?? 'Component'))].sort();

const BADGES = [
  { icon: 'blocks', label: `${ALL.length} components` },
  { icon: 'search', label: 'Search + filter' },
];

const TOC: TocItem[] = [
  { href: '#components-overview', label: 'Overview' },
  { href: '#browse', label: 'Browse' },
];

const GRID: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: '1rem',
};

export function ComponentsOverviewPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL.filter((c) => {
      const cat = c.meta.badges[0]?.label ?? 'Component';
      if (category !== 'All' && cat !== category) return false;
      if (!q) return true;
      return (
        c.meta.name.toLowerCase().includes(q) ||
        c.meta.tagline.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return (
    <Stack direction="row" gap="xl" align="stretch" id="components-overview">
      <Stack gap="xl" flex={1}>
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
          <Heading level={1} weight="normal">Components</Heading>
          <Text color="muted" size="lg">
            Every Move primitive, in one place. Search by name or by what it
            does, or filter by category.
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
          id="browse"
          title="Browse"
          lede="Every shipped component. Click through for examples, props, and tokens."
        >
          <Stack gap="lg">
            <Stack direction="row" gap="sm" align="center" wrap>
              <InputText
                placeholder="Search components…"
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              />
              <Stack direction="row" gap="xs" wrap>
                {['All', ...CATEGORIES].map((c) => (
                  <Button
                    key={c}
                    size="sm"
                    variant={category === c ? 'solid' : 'ghost'}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </Button>
                ))}
              </Stack>
            </Stack>

            {filtered.length === 0 ? (
              <Text color="muted">No components match “{query}”.</Text>
            ) : (
              <div style={GRID}>
                {filtered.map((c) => (
                  <ComponentCard key={c.meta.slug} content={c} />
                ))}
              </div>
            )}
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
