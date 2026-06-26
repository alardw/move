import { useMemo, useState, type ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, InputText, Button } from 'move';
import { ComponentCard, TocRail, type TocItem } from '../../components';
import { COMPONENT_CONTENT } from '../../content/components';
import type { ComponentContent } from '../../content/components/types';
import { TAXONOMY_BY_ID, CATEGORY_ORDER } from '../../content/components/taxonomies';

const catsOf = (c: ComponentContent): string[] => c.meta.categories ?? [];
const labelOf = (id: string): string => TAXONOMY_BY_ID[id]?.label ?? id;

const ALL = Object.values(COMPONENT_CONTENT).sort((a, b) =>
  a.meta.name.localeCompare(b.meta.name),
);

const BADGES = [
  { icon: 'blocks', label: `${ALL.length} components` },
  { icon: 'search', label: 'Search + filter' },
];

const TOC: TocItem[] = [{ href: '#components-overview', label: 'Overview' }];

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
      if (category !== 'All' && !catsOf(c).includes(category)) return false;
      if (!q) return true;
      const aliases = (c.spec.synonyms as string[] | undefined) ?? [];
      return (
        c.meta.name.toLowerCase().includes(q) ||
        c.meta.tagline.toLowerCase().includes(q) ||
        catsOf(c).some((cat) => labelOf(cat).toLowerCase().includes(q)) ||
        aliases.some((a) => a.includes(q))
      );
    });
  }, [query, category]);

  const grouped = category === 'All';
  const sections = (grouped ? CATEGORY_ORDER : [category]).filter((cat) =>
    filtered.some((c) => catsOf(c).includes(cat)),
  );

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
          <Text color="muted" size="lg">Every Move primitive, in one place.</Text>
          <Stack direction="row" gap="xs" wrap>
            {BADGES.map((b) => (
              <Badge key={b.label} variant="soft">
                <Icon name={b.icon} />
                {b.label}
              </Badge>
            ))}
          </Stack>
        </Stack>

        <Stack gap="lg" id="browse">
          <Stack direction="row" gap="sm" align="center" wrap>
            <InputText
              placeholder="Search — try “modal”, “spinner”, “otp”…"
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            />
            <Stack direction="row" gap="xs" wrap>
              {['All', ...CATEGORY_ORDER].map((c) => (
                <Button
                  key={c}
                  size="sm"
                  variant={category === c ? 'solid' : 'ghost'}
                  onClick={() => setCategory(c)}
                >
                  {c === 'All' ? 'All' : labelOf(c)}
                </Button>
              ))}
            </Stack>
          </Stack>

          {filtered.length === 0 ? (
            <Text color="muted">No components match “{query}”.</Text>
          ) : (
            sections.map((cat) => (
              <Stack key={cat} gap="sm">
                {grouped && (
                  <Heading level={2} size="lg" weight="normal">{labelOf(cat)}</Heading>
                )}
                <div style={GRID}>
                  {filtered
                    .filter((c) => catsOf(c).includes(cat))
                    .map((c) => (
                      <ComponentCard key={c.meta.slug} content={c} />
                    ))}
                </div>
              </Stack>
            ))
          )}
        </Stack>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
