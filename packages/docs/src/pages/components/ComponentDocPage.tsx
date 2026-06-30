import { useParams, Link as RouterLink } from 'react-router-dom';
import { Stack, Grid, Heading, Text, Breadcrumb, Icon, Badge, Table, Code } from 'move';

import { COMPONENT_CONTENT } from '../../content/components';
import { TAXONOMY_BY_ID } from '../../content/components/taxonomies';
import {
  CodeBlock,
  HighlightList,
  KeyboardTable,
  Preview,
  PropsTable,
  RelatedComponents,
  Section,
  TocRail,
  type TocItem,
  TokensTable,
} from '../../components';
import { Placeholder } from '../Placeholder';

/**
 * Single template for every component page. The route provides a slug,
 * we load the matching entry from the content registry, and render the
 * standard layout. All per-component copy lives in
 * `content/components/<slug>/`, not here.
 */
export function ComponentDocPage() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Placeholder />;

  const content = COMPONENT_CONTENT[slug];
  if (!content) return <Placeholder />;

  const { meta, samples, spec } = content;

  // Build the API table input. For flat components (Alert, Badge, AudioPlayer)
  // there are no `subComponents` — synthesise a single entry from the spec's
  // top-level `props` so the API section still renders. For compound specs
  // whose root props live at top-level (e.g. Button) and whose subComponents
  // list only secondary parts, prepend the root entry so root props aren't
  // lost. When subComponents already includes a Root entry (Accordion,
  // Avatar, Autocomplete) we leave it alone.
  const subs = (spec.subComponents as Array<{ name: string; props?: unknown[] }> | undefined) ?? [];
  const rootProps = (spec.props as unknown[] | undefined);
  const rootPropsArray = Array.isArray(rootProps) ? rootProps : [];
  const hasRootEntry = subs.some((s) => s.name === 'Root' || s.name === spec.name);
  const apiSubComponents: typeof subs = rootPropsArray.length > 0 && !hasRootEntry
    ? [{ name: spec.name as string, props: rootPropsArray }, ...subs]
    : subs;
  const showApi = apiSubComponents.some((s) => Array.isArray(s.props) && s.props.length > 0);

  // Integration points (adapters) — typed seams the consumer wires. Derived from
  // the spec, same as the API table; see the Adapters concept page.
  type IP = { id: string; kind: string; contract: string; default: string; description: string };
  const integrationPoints = (spec.integrationPoints as IP[] | undefined) ?? [];

  // TOC is derived from what we're actually about to render — a section
  // that's skipped (empty highlights, no spec.tokens, etc.) doesn't
  // leave a dangling anchor in the rail.
  const toc: TocItem[] = [
    { href: `#${meta.slug}`, label: meta.name },
    ...(meta.highlights.length > 0 ? [{ href: '#highlights', label: 'Highlights' }] : []),
    ...(meta.related.length > 0 ? [{ href: '#related', label: 'Related' }] : []),
    ...(meta.importCode ? [{ href: '#installation', label: 'Installation' }] : []),
    ...(samples.length > 0 ? [{ href: '#samples', label: meta.samplesTitle ?? 'Samples' }] : []),
    ...(meta.keyboard.length > 0 ? [{ href: '#accessibility', label: 'Accessibility' }] : []),
    ...(integrationPoints.length > 0 ? [{ href: '#integrations', label: 'Integrations' }] : []),
    ...(showApi ? [{ href: '#api', label: 'API' }] : []),
    ...(spec.tokens ? [{ href: '#design-tokens', label: 'Design tokens' }] : []),
  ];

  return (
    <Stack direction="row" gap="xl" align="stretch" id={meta.slug}>
      <Stack gap="xl" flex={1}>
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
            <Breadcrumb.Page>{meta.name}</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>{meta.name}</Heading>
          <Text color="muted" size="lg">{meta.tagline}</Text>
          <Stack direction="row" gap="xs" wrap>
            {meta.categories
              .map((id) => TAXONOMY_BY_ID[id])
              .filter(Boolean)
              .map((c) => (
                <Badge key={c.id} variant="solid">
                  <Icon name={c.icon} />
                  {c.label}
                </Badge>
              ))}
            {meta.badges.map((b) => (
              <Badge key={b.label} variant="soft">
                <Icon name={b.icon} />
                {b.label}
              </Badge>
            ))}
          </Stack>
        </Stack>

        {meta.highlights.length > 0 && (
          <Section id="highlights" title="Highlights">
            <HighlightList items={meta.highlights} />
          </Section>
        )}

        {meta.related.length > 0 && (
          <Section id="related" title="Related components">
            <RelatedComponents items={meta.related} />
          </Section>
        )}

        {meta.importCode && (
          <Section id="installation" title="Installation">
            <CodeBlock code={meta.importCode} />
          </Section>
        )}

        {samples.length > 0 && (
          <Section id="samples" title={meta.samplesTitle ?? 'Samples'}>
            <Grid cols={2} gap="lg" collapseBelow="900px">
              {samples.map((sample) => {
                const SampleRender = sample.render;
                return (
                  <Preview key={sample.id} title={sample.title} code={sample.code}>
                    <SampleRender />
                  </Preview>
                );
              })}
            </Grid>
          </Section>
        )}

        {meta.keyboard.length > 0 && (
          <Section
            id="accessibility"
            title="Accessibility"
            lede={meta.accessibilityLede}
          >
            <KeyboardTable rows={meta.keyboard} />
          </Section>
        )}

        {integrationPoints.length > 0 ? (
          <Section
            id="integrations"
            title="Integrations"
            lede="Typed seams where you bring your own data, service, or library — an adapter bridges your integration to the prop below."
          >
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Prop</Table.Head>
                  <Table.Head>Kind</Table.Head>
                  <Table.Head>Contract</Table.Head>
                  <Table.Head>Default</Table.Head>
                  <Table.Head>What you bring</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {integrationPoints.map((p) => (
                  <Table.Row key={p.id}>
                    <Table.Cell><Code>{p.id}</Code></Table.Cell>
                    <Table.Cell>{p.kind}</Table.Cell>
                    <Table.Cell><Code>{p.contract}</Code></Table.Cell>
                    <Table.Cell>{p.default}</Table.Cell>
                    <Table.Cell>{p.description}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Section>
        ) : null}

        {showApi ? (
          <Section id="api" title="API" lede="Every prop for every sub-component.">
            <PropsTable subComponents={apiSubComponents as never} />
          </Section>
        ) : null}

        {spec.tokens ? (
          <Section
            id="design-tokens"
            title="Design tokens"
            lede="The CSS variables behind every visible detail. Override on :root for a global tweak, or on a single trigger for a one-off."
          >
            <TokensTable tokens={spec.tokens as never} />
          </Section>
        ) : null}
      </Stack>
      <TocRail items={toc} />
    </Stack>
  );
}
