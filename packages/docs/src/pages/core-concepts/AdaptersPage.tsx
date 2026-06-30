import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Badge, Table, Link } from 'move';
import { Section, TocRail, type TocItem, InlineCode, CodeBlock } from '../../components';

/**
 * Core-concepts page describing adapters — the typed seams where a component
 * lets you bring your own data, service, or library. The IntegrationPoint
 * interface in `packages/move/src/spec-type.ts` is the enforced view; this page
 * is the human-readable one, and every component's own "Integrations" panel is
 * derived from the same spec field.
 */

const TAGLINE =
  'Move components are agnostic: you bring your own data, service, or library. A component declares a typed seam — a port — and an adapter bridges that port to your integration. The port is a TypeScript type, so your adapter is checked at compile time.';

const TOC: TocItem[] = [
  { href: '#what', label: 'What an adapter is' },
  { href: '#shape', label: 'The integration point' },
  { href: '#kinds', label: 'Kinds' },
  { href: '#defaults', label: 'Defaults' },
  { href: '#fixtures', label: 'Fixtures' },
  { href: '#example', label: 'Worked example' },
  { href: '#where', label: 'Where each piece lives' },
];

interface Row {
  name: string;
  type: string;
  required: boolean;
  description: React.ReactNode;
}

const SHAPE_FIELDS: Row[] = [
  { name: 'id', type: 'string', required: true, description: 'The prop you wire it through — resource, adapter, estimate.' },
  { name: 'kind', type: "'data' | 'service' | 'library' | 'asset'", required: true, description: 'What you bring. Drives the default and fixture story.' },
  { name: 'contract', type: 'string', required: true, description: 'The typed port your value must satisfy — a TS type name, resolved from move/adapters or co-located with the component.' },
  { name: 'default', type: "'builtin' | 'noop' | 'required'", required: true, description: 'How the component behaves with nothing wired.' },
  { name: 'fixture', type: 'string', required: false, description: 'A docs/dev fake (by name) that drives the live sample. Never shipped in the bundle.' },
  { name: 'description', type: 'string', required: true, description: 'One line: what you bring.' },
];

const KINDS: { kind: string; detail: React.ReactNode }[] = [
  { kind: 'data', detail: <>Async data you load — a list, a record. The contract is an <Code>AsyncResource&lt;T&gt;</Code>; <Code>asyncResource.from()</Code> maps a React Query / SWR result onto it.</> },
  { kind: 'service', detail: <>An out-of-process call: upload to S3, query a search API. Async and abortable; usually also needs a client library.</> },
  { kind: 'library', detail: <>An in-process function: score a password, highlight code, parse markdown. You install the package and pass the function.</> },
  { kind: 'asset', detail: <>A URL or blob you supply — an image source, a video subtitle track.</> },
];

const DEFAULTS: { value: string; detail: React.ReactNode }[] = [
  { value: 'builtin', detail: <>The component ships a working default (a length heuristic, the built-in icon set). It works with zero wiring; your adapter replaces the default.</> },
  { value: 'noop', detail: <>With nothing wired the component renders an inert “not configured” state — it never looks functional until you supply an adapter.</> },
  { value: 'required', detail: <>You must wire it; omitting it is a compile error. For seams with no possible default — a real upload endpoint, a search backend.</> },
];

const EXAMPLE = `import { Autocomplete, asyncResource } from 'move';

function PeopleSearch() {
  // Your data layer — React Query, SWR, a plain fetch. \`asyncResource.from\`
  // bridges its { data, error, isLoading, refetch } onto the contract.
  const query = usePeople(input);

  return (
    <Autocomplete.Root resource={asyncResource.from(query)} onInputValueChange={setInput}>
      <Autocomplete.Trigger>
        <Autocomplete.Input placeholder="Search people…" />
        <Autocomplete.Icon />
      </Autocomplete.Trigger>
      <Autocomplete.Content>
        <Autocomplete.Loading>Searching…</Autocomplete.Loading>
        <Autocomplete.Error>
          Couldn’t reach the server.
          <Autocomplete.RetryTrigger>Try again</Autocomplete.RetryTrigger>
        </Autocomplete.Error>
        {query.data?.map((p) => (
          <Autocomplete.Item key={p.id} value={p.id}>{p.name}</Autocomplete.Item>
        ))}
        <Autocomplete.Empty>No one by that name.</Autocomplete.Empty>
      </Autocomplete.Content>
    </Autocomplete.Root>
  );
}`;

function ShapeTable({ fields }: { fields: Row[] }) {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Field</Table.Head>
          <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Type</Table.Head>
          <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>R/O</Table.Head>
          <Table.Head>Notes</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {fields.map((f) => (
          <Table.Row key={f.name}>
            <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><Code>{f.name}</Code></Table.Cell>
            <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><InlineCode code={f.type} tintByType /></Table.Cell>
            <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
              <Badge variant={f.required ? 'soft' : 'outline'}>{f.required ? 'required' : 'optional'}</Badge>
            </Table.Cell>
            <Table.Cell><Text size="sm">{f.description}</Text></Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export function AdaptersPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild><RouterLink to="/">Docs</RouterLink></Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild><RouterLink to="/core-concepts">Core Concepts</RouterLink></Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Adapters</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Adapters</Heading>
          <Text color="muted" size="lg">{TAGLINE}</Text>
        </Stack>

        <Section id="what" title="What an adapter is">
          <Text>
            A component declares a <strong>port</strong> — a typed seam where it expects something from
            you. Your <strong>integration</strong> — an API, an upload service, a parsing library — has
            its own shape. An <strong>adapter</strong> is the function that bridges the two: it satisfies
            the port and talks to your integration.
          </Text>
          <Text>
            The port is one stable TypeScript type, owned by Move. Many adapters can satisfy it — one per
            integration — and each is checked against the port at compile time. A component lists its ports
            in its spec, and its page shows them in an <strong>Integrations</strong> panel.
          </Text>
        </Section>

        <Section id="shape" title="The integration point" lede="Each port a component exposes is one entry in its spec — the same shape for every component.">
          <ShapeTable fields={SHAPE_FIELDS} />
          <Text size="sm" color="muted">
            <Code>contract</Code> is a type name, not the type itself — exactly like a prop’s <Code>type</Code>.
            The real type lives in <Code>move/adapters</Code> (shared) or beside the component, and that is
            what type-checks your adapter.
          </Text>
        </Section>

        <Section id="kinds" title="Kinds">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Kind</Table.Head>
                <Table.Head>What you bring</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {KINDS.map((k) => (
                <Table.Row key={k.kind}>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><Code>{k.kind}</Code></Table.Cell>
                  <Table.Cell><Text size="sm">{k.detail}</Text></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>

        <Section id="defaults" title="Defaults" lede="What a component does when you wire nothing.">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Default</Table.Head>
                <Table.Head>Behavior</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {DEFAULTS.map((d) => (
                <Table.Row key={d.value}>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><Code>{d.value}</Code></Table.Cell>
                  <Table.Cell><Text size="sm">{d.detail}</Text></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>

        <Section id="fixtures" title="Fixtures" lede="How the live samples run without a backend.">
          <Text>
            A <Code>fixture</Code> is a fake integration — a fake search service, a fake uploader — that
            stands in for the real thing so a sample runs with no infrastructure. It is shaped like a real
            service (async, abortable, able to fail), so a sample exercises the same loading, error, and
            retry paths your code will. Fixtures live with the docs and never ship in the Move bundle; in
            your app you replace the fixture with your real adapter.
          </Text>
        </Section>

        <Section id="example" title="Worked example" lede="Autocomplete's resource port — a data integration.">
          <Text>
            <Code>Autocomplete</Code> exposes a <Code>resource</Code> port of kind <Code>data</Code>. You
            pass an <Code>AsyncResource</Code>, and it drives the loading, error, and retry states. Build
            it from your data layer with <Code>asyncResource.from()</Code>:
          </Text>
          <CodeBlock code={EXAMPLE} />
          <Text size="sm" color="muted">
            See it running — loading → error → retry — in the{' '}
            <Link asChild><RouterLink to="/components/autocomplete">Autocomplete</RouterLink></Link> async sample.
          </Text>
        </Section>

        <Section id="where" title="Where each piece lives">
          <Stack gap="xs">
            <Text><strong>Contract</strong> — in Move. Import the type and any helper from <Code>move</Code> (e.g. <Code>asyncResource</Code>, <Code>AsyncResource</Code>).</Text>
            <Text><strong>Adapter</strong> — your code, or an optional adapter package. It bridges your integration to the contract.</Text>
            <Text><strong>Fixture</strong> — docs-only, for samples and dev. Not in the shipped bundle.</Text>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
