import * as React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Badge, Code, Table } from 'move';
import type { BadgeProps } from 'move';
import {
  Preview,
  Section,
  HighlightList,
  TocRail,
  type TocItem,
} from '../../components';
import { getRecipe } from '../../content/recipes/registry';
import { COMPONENT_CONTENT } from '../../content/components';

/** PascalCase Move name → component-docs slug (e.g. 'InputText' → 'input-text'). */
const toSlug = (name: string): string =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const NARROW: React.CSSProperties = { width: 1, whiteSpace: 'nowrap' };

/** Integration-point kind → human label + badge colour. `data` is flagged
 * most prominently — it's the sample data a consumer must replace. */
const KIND_META: Record<string, { label: string; color: NonNullable<BadgeProps['color']> }> = {
  data: { label: 'Sample data', color: 'orange' },
  handler: { label: 'Handler', color: 'blue' },
  navigation: { label: 'Navigation', color: 'teal' },
  asset: { label: 'Asset', color: 'gray' },
};

export function RecipeDetailPage() {
  const { group = '', slug = '' } = useParams();
  const recipe = getRecipe(group, slug);

  if (!recipe) {
    return (
      <Stack gap="md" id="recipe">
        <Heading level={1}>Recipe not found</Heading>
        <Text color="muted">There’s no recipe at /recipes/{group}/{slug}.</Text>
        <RouterLink to="/recipes">← Back to recipes</RouterLink>
      </Stack>
    );
  }

  const { Component, spec } = recipe;

  const toc: TocItem[] = [
    { href: `#${recipe.slug}`, label: recipe.title },
    { href: '#preview', label: 'Preview' },
    { href: '#built-with', label: 'Built with' },
    { href: '#included', label: 'What’s included' },
    ...(spec.integrationPoints.length > 0
      ? [{ href: '#integration', label: 'Integration points' }]
      : []),
    { href: '#labels', label: 'Labels' },
  ];

  return (
    <Stack direction="row" gap="xl" align="stretch" id={recipe.slug}>
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/recipes">Recipes</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>{recipe.title}</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>{recipe.title}</Heading>
          <Text color="muted" size="lg">{recipe.description}</Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="solid">{recipe.group}</Badge>
          </Stack>
        </Stack>

        <Section id="preview" title="Preview">
          <Preview code={recipe.source}>
            <Component />
          </Preview>
        </Section>

        <Section
          id="built-with"
          title="Built with"
          lede="The Move components this recipe composes."
        >
          <Stack direction="row" gap="xs" wrap>
            {spec.composition.map((name) => {
              const linkSlug = toSlug(name);
              return linkSlug in COMPONENT_CONTENT ? (
                <RouterLink key={name} to={`/components/${linkSlug}`}>
                  <Badge variant="soft">{name}</Badge>
                </RouterLink>
              ) : (
                <Badge key={name} variant="soft" color="gray">{name}</Badge>
              );
            })}
          </Stack>
        </Section>

        <Section id="included" title="What’s included">
          <HighlightList
            items={spec.behaviors.map((b) => ({ icon: 'check', text: b }))}
          />
        </Section>

        {spec.integrationPoints.length > 0 && (
          <Section
            id="integration"
            title="Integration points"
            lede="Replace these stubs with your real data and handlers."
          >
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head style={NARROW}>Name</Table.Head>
                  <Table.Head style={NARROW}>Type</Table.Head>
                  <Table.Head>What to wire</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {spec.integrationPoints.map((ip) => {
                  const k = KIND_META[ip.kind];
                  return (
                    <Table.Row key={ip.id}>
                      <Table.Cell style={NARROW}><Code>{ip.id}</Code></Table.Cell>
                      <Table.Cell style={NARROW}>
                        <Badge size="sm" variant="soft" color={k.color}>{k.label}</Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Stack gap="xs">
                          <Text size="sm">{ip.description}</Text>
                          {ip.shape && (
                            <Stack gap="none">
                              {ip.shape.map((f) => (
                                <Text key={f.name} size="xs" color="muted">
                                  <Code>{f.name}</Code>: {f.type}
                                  {f.note ? ` — ${f.note}` : ''}
                                  {[
                                    f.searchable ? 'searchable' : null,
                                    f.sortable ? 'sortable' : null,
                                    f.filterable ? 'filterable' : null,
                                  ].filter(Boolean).length > 0
                                    ? ` (${[
                                        f.searchable ? 'searchable' : null,
                                        f.sortable ? 'sortable' : null,
                                        f.filterable ? 'filterable' : null,
                                      ].filter(Boolean).join(', ')})`
                                    : ''}
                                </Text>
                              ))}
                            </Stack>
                          )}
                        </Stack>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Section>
        )}

        <Section
          id="labels"
          title="Labels"
          lede="Every string is overridable through the labels prop."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={NARROW}>Key</Table.Head>
                <Table.Head>Default</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {spec.labels.map((l) => (
                <Table.Row key={l.key}>
                  <Table.Cell style={NARROW}>
                    <Code>{l.key}{l.params ? `(${l.params.join(', ')})` : ''}</Code>
                  </Table.Cell>
                  <Table.Cell><Text size="sm">{l.default}</Text></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>
      </Stack>
      <TocRail items={toc} />
    </Stack>
  );
}
