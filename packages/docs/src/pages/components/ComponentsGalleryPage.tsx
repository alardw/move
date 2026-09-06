import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Switch, Deferred, Divider } from 'move';
import { Section, TocRail, type TocItem } from '../../components';
import { COMPONENT_CONTENT } from '../../content/components';
import type { ComponentContent } from '../../content/components/types';
import { TAXONOMY, CATEGORY_ORDER } from '../../content/components/taxonomies';

/**
 * Every component on one page, live and at real size.
 *
 * The overview page answers "what is there" with cards and prose; this answers
 * "does it all still look like one library", which needs the components sitting
 * next to each other with nothing between them. It is the page to open after a
 * refactor that touched anything shared — type scale, surfaces, borders, focus
 * rings — because a drift that is invisible on one component's page is obvious
 * when forty of them are stacked.
 *
 * Built from the same registry the rest of the docs use, so a new component
 * appears here without anyone remembering to add it. Each entry renders its
 * FIRST sample: the one the component's own author chose as most typical.
 *
 * Deferred per entry — mounting seventy live samples at once starves the
 * animations that several of them run on mount, which is the opposite of what
 * you came here to look at.
 */

const TOC: TocItem[] = CATEGORY_ORDER.map((id) => ({
  href: `#${id}`,
  label: TAXONOMY.find((c) => c.id === id)?.label ?? id,
}));

const catsOf = (c: ComponentContent): string[] => c.meta.categories ?? [];

export function ComponentsGalleryPage() {
  const [dense, setDense] = useState(false);

  const byCategory = useMemo(() => {
    const all = Object.values(COMPONENT_CONTENT).sort((a, b) =>
      a.meta.name.localeCompare(b.meta.name),
    );
    return CATEGORY_ORDER.map((id) => ({
      id,
      label: TAXONOMY.find((c) => c.id === id)?.label ?? id,
      items: all.filter((c) => catsOf(c).includes(id)),
    })).filter((g) => g.items.length > 0);
  }, []);

  const total = byCategory.reduce((n, g) => n + g.items.length, 0);

  return (
    <Stack direction="row" gap="xl" align="stretch" id="components-gallery">
      <Stack gap="xl" flex={1}>
        <Stack gap="md">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild>
                <RouterLink to="/">Docs</RouterLink>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild>
                <RouterLink to="/components">Components</RouterLink>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Breadcrumb.Page>Gallery</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Heading level={1}>Gallery</Heading>
          <Text color="muted">
            All {total} components live on one page, at real size, with nothing between them —
            for checking that a change to anything shared still holds across the whole library.
          </Text>
          <Stack direction="row" gap="sm" align="center">
            <Switch.Root checked={dense} onCheckedChange={setDense}>
              <Switch.Thumb />
            </Switch.Root>
            <Text size="sm" color="muted">
              Dense — drop the labels and the rules, so only the components remain
            </Text>
          </Stack>
        </Stack>

        {byCategory.map((group) => (
          <Section key={group.id} id={group.id} title={group.label}>
            <Stack gap={dense ? 'md' : 'xl'}>
              {group.items.map((c) => {
                // The sample the component's own docs nominate as most
                // representative, falling back to the first. Table's basic
                // sample has no zebra, so the gallery would show none of the
                // row treatment the mark tokens are for.
                const preferred = c.meta.preview?.sample;
                const sample =
                  (preferred && c.samples?.find((s) => s.id === preferred)) ?? c.samples?.[0];
                if (!sample) return null;
                const Sample = sample.render;
                return (
                  <Stack key={c.meta.slug} gap="sm">
                    {!dense && (
                      <Stack direction="row" gap="sm" align="baseline">
                        <RouterLink to={`/components/${c.meta.slug}`}>
                          <Text weight="semibold">{c.meta.name}</Text>
                        </RouterLink>
                        <Text size="sm" color="muted">
                          {sample.title}
                        </Text>
                      </Stack>
                    )}
                    <Deferred
                      rootMargin="600px"
                      // Reserve roughly what an entry occupies, so the scrollbar
                      // tells the truth before everything has mounted. Without
                      // it an unmounted entry is 0px tall: you scroll to what
                      // looks like the end, the last entries mount, and the page
                      // grows underneath you — measured here as 9,062px on load
                      // against 11,049px once mounted.
                      placeholder={<div style={{ height: 160 }} />}
                    >
                      <Sample />
                    </Deferred>
                    {!dense && <Divider />}
                  </Stack>
                );
              })}
            </Stack>
          </Section>
        ))}
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
