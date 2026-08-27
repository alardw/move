import { useMemo, useState, type ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, InputText, ToggleGroup, Grid } from 'move';
import { DesignPatternCard } from '../../components';
import { PATTERNS, PATTERN_GROUPS } from '@move-patterns/registry';

// Available patterns first, then alphabetical — the openable ones lead.
const ALL = [...PATTERNS].sort((a, b) => {
  const av = a.status === 'available';
  const bv = b.status === 'available';
  if (av !== bv) return av ? -1 : 1;
  return a.title.localeCompare(b.title);
});

export function DesignPatternsOverviewPage() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL.filter((p) => {
      if (group !== 'All' && p.group !== group) return false;
      if (!q) return true;
      // Discovery across all four dimensions: phrase (title/description/synonyms +
      // appliesWhen), capability (axis options), and data (appliesWhen).
      const features = p.spec ? p.spec.axes.flatMap((a) => a.options ?? []) : [];
      const applies = p.spec?.appliesWhen ?? [];
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.synonyms.some((s) => s.includes(q)) ||
        features.some((f) => f.toLowerCase().includes(q)) ||
        applies.some((a) => a.toLowerCase().includes(q))
      );
    });
  }, [query, group]);

  return (
    <Stack gap="xl" id="design-patterns">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Breadcrumb.Link asChild>
            <RouterLink to="/">Docs</RouterLink>
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Page>Design Patterns</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Stack gap="sm">
        <Heading level={1}>Design Patterns</Heading>
        <Text color="muted" size="lg">
          Parameterized UI patterns — one decision-space each — that you instantiate into
          composites. The available ones are ready to use; the rest are on the roadmap.
        </Text>
      </Stack>

      <Stack gap="lg">
        <Stack direction="row" gap="md" align="center" wrap>
          <InputText
            width="lg"
            placeholder="Search patterns…"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          />
        </Stack>
        <ToggleGroup.Root
          value={group}
          onValueChange={(v: string) => v && setGroup(v)}
          variant="underline"
          size="sm"
        >
          <ToggleGroup.Item value="All">All</ToggleGroup.Item>
          {PATTERN_GROUPS.map((g) => (
            <ToggleGroup.Item key={g} value={g}>
              {g}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>

        {filtered.length === 0 ? (
          <Text color="muted">No patterns match {query ? `“${query}”` : 'these filters'}.</Text>
        ) : (
          <Grid minChildWidth="320px" gap="md">
            {filtered.map((p) => (
              <DesignPatternCard key={`${p.groupSlug}/${p.slug}`} pattern={p} />
            ))}
          </Grid>
        )}
      </Stack>
    </Stack>
  );
}
