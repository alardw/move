import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Badge, Icon, Table, Tooltip, Card } from 'move';
import { Section, TocRail, type TocItem, InlineCode, CodeBlock } from '../../components';

/**
 * Docs page describing the composition spec — the contract every recipe and
 * app composition (`*.spec.ts` ending in `satisfies CompositionSpec`) obeys.
 * The symmetric peer of the Component Contract page: same spec-driven model,
 * deliberately lighter (no tokens, no animation, no public API beyond labels).
 * The enforced view is `CompositionSpec` in `packages/move/recipes/spec-type.ts`.
 */

const TAGLINE =
  'A page, a feature, and a reusable composite are the same thing at different scales — a composition of Move components, described by one typed spec.';

const TOC: TocItem[] = [
  { href: '#why-a-contract', label: 'Why a contract' },
  { href: '#lighter', label: 'Lighter than a component' },
  { href: '#example', label: 'A complete spec' },
  { href: '#identity', label: 'Identity & scale' },
  { href: '#composition', label: 'Composition' },
  { href: '#behaviors', label: 'Behaviors' },
  { href: '#integration', label: 'Integration points' },
  { href: '#i18n', label: 'Internationalization' },
  { href: '#publishing', label: 'Publishing' },
  { href: '#enforcement', label: 'Enforcement' },
  { href: '#next-steps', label: 'Next steps' },
];

interface FieldRow {
  name: string;
  type: string;
  required: boolean;
  description: React.ReactNode;
}

/** The real ForgotPassword recipe spec, trimmed, as a worked example so readers
 *  see a whole composition spec before the field tables. */
const EXAMPLE_SPEC = `import type { CompositionSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: 'ForgotPassword',
  scope: 'page',

  composition: ['Card', 'Stack', 'Heading', 'Text', 'FormField', 'InputText', 'Button', 'Link'],

  behaviors: [
    'Renders inside a single Card surface (max-width 400).',
    'Email is a controlled text input wrapped in FormField.',
    'Submit is disabled until an email is entered.',
    'On submit, shows a confirmation view that echoes the entered email.',
    'All user-facing copy is supplied through the labels prop (i18n).',
  ],

  integrationPoints: [
    { id: 'onSubmit',     kind: 'handler',    description: 'Request a password-reset link for the entered email.' },
    { id: 'backToSignIn', kind: 'navigation', description: 'Navigate back to the sign-in screen.' },
  ],

  labels: [
    { key: 'title',  default: 'Forgot password?', description: 'Card heading.' },
    { key: 'submit', default: 'Send reset link',   description: 'Submit button text.' },
    // …one entry per user-facing string
  ],
} satisfies CompositionSpec;
`;

const GLOSSARY: Record<string, string> = {
  // scope
  composite: 'A reusable piece of UI shared across screens (a UserCard, a MetricsPanel). Lands in src/composites.',
  page: 'A composition that owns a route — a whole screen behind one URL.',
  feature: 'A multi-page slice (auth: sign-in + sign-up + reset) grouped as one unit.',
  // integration-point kind
  data: 'Placeholder sample data to replace — the SAMPLE_* consts. Carries a shape[] describing each record.',
  handler: 'A callback to wire — onSubmit, onDelete.',
  navigation: 'A route or target to point at — a link or redirect.',
  asset: 'A static asset to swap — an image or file.',
};

/** Code chip with an info icon when the literal is in the glossary; hover reveals it. */
function Term({ children }: { children: string }) {
  const meaning = GLOSSARY[children];
  if (!meaning) return <Code>{children}</Code>;
  return (
    <Tooltip label={meaning}>
      <Code>{children} <Icon name="info" size={12} /></Code>
    </Tooltip>
  );
}

function FieldTable({ fields }: { fields: FieldRow[] }) {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Field</Table.Head>
          <Table.Head>Type</Table.Head>
          <Table.Head>R/O</Table.Head>
          <Table.Head>Notes</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {fields.map((f) => (
          <Table.Row key={f.name}>
            <Table.Cell><Code>{f.name}</Code></Table.Cell>
            <Table.Cell><InlineCode code={f.type} tintByType /></Table.Cell>
            <Table.Cell>
              <Badge variant={f.required ? 'soft' : 'outline'}>
                {f.required ? 'required' : 'optional'}
              </Badge>
            </Table.Cell>
            <Table.Cell><Text size="sm">{f.description}</Text></Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

/** Compact card wrapper for a nested-type field table. */
function NestedType({ name, lede, fields }: { name: string; lede: React.ReactNode; fields: FieldRow[] }) {
  return (
    <Card.Root>
      <Card.Body>
        <Stack gap="md">
          <Stack gap="xs">
            <Heading level={4}><Code>{name}</Code></Heading>
            <Text color="muted" size="sm">{lede}</Text>
          </Stack>
          <FieldTable fields={fields} />
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}

// ============================================================================
// CompositionSpec fields, grouped by section
// ============================================================================

const IDENTITY: FieldRow[] = [
  { name: 'schemaVersion', type: '1', required: true, description: <>Schema version — the pinned literal <Code>RECIPE_SCHEMA_VERSION</Code> (<Code>1</Code>). Bumped only on breaking schema changes, which ship with a migration over all specs.</> },
  { name: 'name', type: 'string', required: true, description: 'PascalCase name — matches the file basename and the exported component (e.g. ForgotPassword → ForgotPassword.spec.ts).' },
  { name: 'scope', type: "'composite' | 'page' | 'feature'", required: false, description: <>The composition&apos;s scale: <Term>composite</Term>, <Term>page</Term>, or <Term>feature</Term>. All three are one composition of Move components at different sizes; this drives what <Code>/app-compose</Code> emits. Omit for a plain composite.</> },
];

const COMPOSITION: FieldRow[] = [
  { name: 'composition', type: 'string[]', required: true, description: <>The Move components this is built from — Card, Stack, FormField, Button, and so on. This doubles as the validate <Text as="em">allow-list</Text>: the purity gate holds the source to exactly these, so anything hand-rolled is a violation.</> },
];

const BEHAVIORS: FieldRow[] = [
  { name: 'behaviors', type: 'string[]', required: true, description: <>Acceptance criteria the source must implement — validation, loading, empty, error, responsive, a11y. Each is a plain sentence; together they drive the generated tests, the way a component spec&apos;s <Code>testing.behaviors</Code> does.</> },
];

const INTEGRATION: FieldRow[] = [
  { name: 'integrationPoints', type: 'RecipeIntegrationPoint[]', required: true, description: <>Every place a consumer plugs in real data or behavior — the seams between the ready-made composition and your app. Each is marked in source and badged in the docs so the wiring is explicit, never something to reverse-engineer from the JSX.</> },
];

const INTEGRATION_POINT: FieldRow[] = [
  { name: 'id', type: 'string', required: true, description: <>Short identifier, e.g. <Code>onSubmit</Code>, <Code>navItems</Code>.</> },
  { name: 'description', type: 'string', required: true, description: 'What the consumer must supply, e.g. "POST credentials to the auth API".' },
  { name: 'kind', type: "'data' | 'handler' | 'navigation' | 'asset'", required: true, description: <>What kind of fill-in this is — drives how it&apos;s marked in source and badged in docs: <Term>data</Term>, <Term>handler</Term>, <Term>navigation</Term>, <Term>asset</Term>.</> },
  { name: 'shape', type: 'RecipeDataField[]', required: false, description: <>For <Code>kind: &apos;data&apos;</Code> points, the shape of each record the consumer supplies. The composition&apos;s columns, search, sort, and filters all derive from this.</> },
];

const DATA_FIELD: FieldRow[] = [
  { name: 'name', type: 'string', required: true, description: <>Field name on each record, e.g. <Code>amount</Code>.</> },
  { name: 'type', type: "'string' | 'number' | 'date' | 'enum' | 'boolean'", required: true, description: 'Value type.' },
  { name: 'note', type: 'string', required: false, description: 'How it\'s used in the UI, e.g. "Name column (with avatar)".' },
  { name: 'searchable', type: 'boolean', required: false, description: 'The live search predicate matches this field.' },
  { name: 'sortable', type: 'boolean', required: false, description: 'A column sorts by this field.' },
  { name: 'filterable', type: 'boolean', required: false, description: 'This field is exposed as a filter facet.' },
  { name: 'render', type: "'text' | 'badge'", required: false, description: 'How the field renders in a table cell (default text).' },
];

const LABELS: FieldRow[] = [
  { name: 'labels', type: 'RecipeLabel[]', required: true, description: <>The i18n contract: every user-facing string the composition exposes through its single <Code>labels</Code> prop. An empty array means no copy. Consumers feed this from their own i18n library — the same model Move components use.</> },
];

const LABEL_DEF: FieldRow[] = [
  { name: 'key', type: 'string', required: true, description: <>Key in the <Code>labels</Code> object, e.g. <Code>submit</Code>.</> },
  { name: 'default', type: 'string', required: true, description: <>Default copy. For a formatter label (see <Code>params</Code>), a representative template with <Code>{'{param}'}</Code> placeholders, e.g. <Code>Step {'{n}'} of {'{total}'}</Code>.</> },
  { name: 'description', type: 'string', required: true, description: 'What the string is for — guides translation and generation.' },
  { name: 'params', type: 'string[]', required: false, description: <>When present, the label is a formatter <Text as="em">function</Text> taking these params (e.g. <Code>[&apos;n&apos;, &apos;total&apos;]</Code> → <Code>(n, total) =&gt; string</Code>) instead of a plain string.</> },
];

const DOCUMENT_SPEC: FieldRow[] = [
  { name: 'slug', type: 'string', required: true, description: <>URL slug within its group, e.g. <Code>sign-in</Code>.</> },
  { name: 'group', type: 'string', required: true, description: <>Display name of the group, e.g. <Code>Authentication</Code>.</> },
  { name: 'groupSlug', type: 'string', required: true, description: <>URL slug of the group, e.g. <Code>authentication</Code>.</> },
  { name: 'title', type: 'string', required: true, description: 'Display title.' },
  { name: 'description', type: 'string', required: true, description: 'One-line summary.' },
  { name: 'synonyms', type: 'string[]', required: true, description: <>Search aliases — parity with the component spec&apos;s <Code>synonyms</Code>.</> },
];

const CHECK_SCRIPTS: { name: string; what: React.ReactNode }[] = [
  { name: 'satisfies CompositionSpec', what: <>Compile-time. The spec object keeps its narrow literal types while <Code>tsc</Code> rejects any field that doesn&apos;t match the interface — a renamed field, a wrong type, a missing required one.</> },
  { name: 'move check › purity', what: <>The source is composed <Text as="em">only</Text> from Move components — no raw HTML for layout, no inline styles, no custom CSS. The <Code>composition</Code> list is the allow-list.</> },
  { name: 'move check › composition-spec-drift', what: <>Source matches spec: the components used line up with <Code>composition</Code>, the <Code>labels</Code> are all wired (no hardcoded strings), and a test file exists.</> },
];

export function CompositionContractPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="overview">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/core-concepts">Core Concepts</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Composition Contract</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Composition Contract</Heading>
          <Text color="muted" size="lg">{TAGLINE}</Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft"><Icon name="file-code" />schemaVersion: 1</Badge>
            <Badge variant="soft"><Icon name="shield-check" />satisfies CompositionSpec</Badge>
            <Badge variant="soft"><Icon name="git-branch" />move check</Badge>
          </Stack>
        </Stack>

        <Section
          id="why-a-contract"
          title="Why a contract"
          lede="A composition is spec-driven for the same reason a component is: the typed spec is the decision record, and everything downstream is generated or validated from it."
        >
          <Stack gap="sm">
            <Text>
              A composite is a composition of Move components — a screen, a feature, a shared piece.
              Move&apos;s recipes are ready-made composites you start from: inspiration to copy and
              adapt into your own. Both are the same substance, so both are described the same way —
              a <Code>{`{Name}.spec.ts`}</Code> ending in <Code>satisfies CompositionSpec</Code>.{' '}
              <RouterLink to="/ai/skills">/app-compose</RouterLink> generates the source from that spec,
              and <Code>move check</Code> verifies the source stays true to it.
            </Text>
            <Text>
              It is the <RouterLink to="/core-concepts/component-contract">Component Contract</RouterLink>{' '}
              one scale up. A component spec is the contract for one component; a composition spec
              is the contract for an arrangement of them.
            </Text>
          </Stack>
        </Section>

        <Section
          id="lighter"
          title="Lighter than a component"
          lede="A composition spec carries only what an arrangement needs — no tokens, no animation, no public prop API."
        >
          <Text>
            A component owns design tokens, animation bindings, variants, sizes, and a public prop
            surface. A composition owns none of that: it inherits look and motion from the components
            it&apos;s built from. So its spec keeps just four substance fields — what it&apos;s{' '}
            <Code>composition</Code> is, how it <Code>behaviors</Code>, where you wire it up
            (<Code>integrationPoints</Code>), and the copy it exposes (<Code>labels</Code>) — plus a
            name and optional <Code>scope</Code>.
          </Text>
        </Section>

        <Section
          id="example"
          title="A complete spec"
          lede="The real ForgotPassword recipe spec, trimmed. Every section below maps to one part of it."
        >
          <CodeBlock code={EXAMPLE_SPEC} language="tsx" />
        </Section>

        <Section id="identity" title="Identity & scale" lede="What the composition is called, and at what scale it lives.">
          <FieldTable fields={IDENTITY} />
        </Section>

        <Section id="composition" title="Composition" lede="The Move components it's made from — and the allow-list the purity gate enforces.">
          <FieldTable fields={COMPOSITION} />
        </Section>

        <Section id="behaviors" title="Behaviors" lede="The acceptance criteria the source must meet, which become its tests.">
          <FieldTable fields={BEHAVIORS} />
        </Section>

        <Section
          id="integration"
          title="Integration points"
          lede="The seams where a consumer supplies real data, handlers, routes, or assets."
        >
          <FieldTable fields={INTEGRATION} />
          <Stack gap="md">
            <NestedType name="RecipeIntegrationPoint" lede="One place a consumer wires real data or behavior in." fields={INTEGRATION_POINT} />
            <NestedType name="RecipeDataField" lede="A field on a record supplied to a data integration point. Columns, search, sort, and filters derive from these." fields={DATA_FIELD} />
          </Stack>
        </Section>

        <Section
          id="i18n"
          title="Internationalization"
          lede="Every user-facing string the composition ships goes through a single labels object."
        >
          <FieldTable fields={LABELS} />
          <NestedType name="RecipeLabel" lede="One translatable string — a plain default, or a formatter function when params is set." fields={LABEL_DEF} />
        </Section>

        <Section
          id="publishing"
          title="Publishing"
          lede="Substance is what a composition is; a document is how it's published. A private composite is pure substance; a Move recipe adds a document."
        >
          <Stack gap="sm">
            <Text>
              The fields above are the composition&apos;s <Text as="em">substance</Text> — true whether it&apos;s a
              private screen in your app or a shipped Move recipe. Publishing it as a recipe adds a
              separate <Code>DocumentSpec</Code>: the discovery metadata (slug, group, title, search
              synonyms) that lives on the registry entry, never in the substance spec. A private
              composition simply has no document.
            </Text>
            <NestedType name="DocumentSpec" lede="Discovery metadata for a published composition — where it lives, how it reads, how it's found." fields={DOCUMENT_SPEC} />
            <Text size="sm" color="muted">
              <Code>RecipeDocument</Code> extends <Code>DocumentSpec</Code> with a <Code>preview</Code>{' '}
              (<Code>RecipePreview</Code>) describing how the recipe renders in the overview card — the
              same preview model components use.
            </Text>
          </Stack>
        </Section>

        <Section
          id="enforcement"
          title="Enforcement"
          lede="The same two layers as a component: the TypeScript type, and the checks wired into move check, a pre-commit hook, and CI."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Layer</Table.Head>
                <Table.Head>What it verifies</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {CHECK_SCRIPTS.map((c) => (
                <Table.Row key={c.name}>
                  <Table.Cell><Code>{c.name}</Code></Table.Cell>
                  <Table.Cell><Text size="sm">{c.what}</Text></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Text size="sm" color="muted">
            Move runs these on its own recipes; adopt the pipeline and they run on your composites too.
            See the <RouterLink to="/core-concepts/conformance-model">Conformance Model</RouterLink> for
            how the checks hold the line over a whole app.
          </Text>
        </Section>

        <Section id="next-steps" title="Next steps">
          <Stack gap="sm">
            <Text>Adjacent reading:</Text>
            <Stack gap="xs">
              <Text size="sm">• <RouterLink to="/core-concepts/component-contract">Component Contract</RouterLink> — the same idea one scale down, for a single component.</Text>
              <Text size="sm">• <RouterLink to="/ai/skills">Skills</RouterLink> — <Code>/app-compose</Code> generates a composition from this spec.</Text>
              <Text size="sm">• <RouterLink to="/core-concepts/conformance-model">Conformance Model</RouterLink> — how <Code>move check</Code> keeps your compositions true.</Text>
              <Text size="sm">• <RouterLink to="/recipes">Recipes</RouterLink> — published compositions you can read end-to-end.</Text>
            </Stack>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
