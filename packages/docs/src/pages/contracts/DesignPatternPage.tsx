import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Table, Code, Badge, Alert, Card } from 'move';
import { Section, TocRail, CodeBlock, type TocItem } from '../../components';
import { itemGallery } from '@move-patterns/item-gallery';

// Exploratory page — rendered LIVE from the pattern draft
// (packages/move/patterns/item-gallery.ts). Derived below the intro,
// so it stays in sync as the draft changes. Shapes will still move.

const TOC: TocItem[] = [
  { href: '#idea', label: 'The idea' },
  { href: '#axes', label: 'Axes & decisions' },
  { href: '#presets', label: 'Use-case presets' },
  { href: '#actions', label: 'Item actions' },
  { href: '#structure', label: 'Skeleton & bindings' },
  { href: '#heuristics', label: 'Heuristics' },
  { href: '#ownership', label: 'Who supplies what' },
  { href: '#instance', label: 'A worked instance' },
];

// The model applied end to end: every axis resolved for one concrete gallery — a daily
// photo feed (discover primary + a consume blend) — with who decided each value and why.
// Brand-free on purpose; this is the pattern instantiated, not a real product's config.
const INSTANCE: { axis: string; value: string; by: keyof typeof DECIDED_COLOR; why: string }[] = [
  { axis: 'useCase', value: 'discover + consume blend', by: 'consumer', why: 'a visual browse whose items carry real editorial text — the blend is what pulls label and surface off pure discover' },
  { axis: 'lead', value: 'image (video branch)', by: 'data-rule', why: 'the feed’s media type, from the data' },
  { axis: 'fit', value: 'cover', by: 'data-rule', why: 'full-bleed scenes, not objects on a neutral field' },
  { axis: 'surface', value: 'card', by: 'use-case-preset', why: 'overrides discover’s borderless — a frame for the caption (the consume blend showing)' },
  { axis: 'label', value: 'title (rich on detail)', by: 'use-case-preset', why: 'title + date keep the feed scannable; the full explanation is one tap away' },
  { axis: 'stats', value: 'none', by: 'data-rule', why: 'no engagement data exists' },
  { axis: 'primaryAction', value: 'open', by: 'use-case-preset', why: 'the whole tile opens the detail page' },
  { axis: 'hoverMedia', value: 'none', by: 'use-case-preset', why: 'a static poster; video preview deferred' },
  { axis: 'hoverActions', value: 'save · share', by: 'use-case-preset', why: 'the discover collect/react set; save = add-to-collection' },
  { axis: 'arrangement', value: 'uniform-grid', by: 'use-case-preset', why: 'H28 — metadata is present, so not masonry despite varied aspects' },
  { axis: 'section', value: 'flat', by: 'use-case-preset', why: 'a single-month feed; flips to grouped-by-month when the range spans' },
  { axis: 'order', value: 'time (newest first)', by: 'data-rule', why: 'dated daily — recency is the natural order' },
  { axis: 'sort', value: 'none', by: 'use-case-preset', why: 'a chronological feed doesn’t re-sort' },
  { axis: 'filter', value: 'inline-chips · date-range facet', by: 'use-case-preset', why: 'the date field is filterable → a date-range facet, few enough to sit inline' },
  { axis: 'density', value: 'moderate', by: 'use-case-preset', why: 'cards with captions need room (overrides discover’s tight)' },
  { axis: 'pagination', value: 'infinite', by: 'use-case-preset', why: 'scroll back through earlier dates' },
  { axis: 'feature', value: 'none', by: 'use-case-preset', why: 'a flat dated feed, no editorial lead' },
  { axis: 'selection', value: 'none', by: 'data-rule', why: 'single-item save, no bulk operations' },
];

// The whole plot: every axis bucketed by who decides it. `consumer` also carries the
// underivable inputs that aren't axes (the data, domain actions, brand). Order runs
// from "you must supply" → "system decides", so the required-input core reads first.
const OWNERSHIP = [
  {
    key: 'consumer',
    title: 'You supply — the whole of the required input',
    blurb: 'Genuinely underivable: nothing else can provide these. This short list is all a consumer must actually decide.',
    extra: [
      'the data shape — what your API returns (fields, media type, dates)',
      'domain actions — that “save” means add-to-collection, plus its wiring',
      'brand & identity — the product this gallery belongs to',
    ],
  },
  {
    key: 'data-rule',
    title: 'Derived from your data',
    blurb: 'Computed from the content; a wrong read is checkable, not a judgement call.',
    extra: [],
  },
  {
    key: 'use-case-preset',
    title: 'Proposed from the use case — overridable',
    blurb: 'A sensible default from the primary use case (+ blend), each with a rationale. The system never blocks on these; you override only the ones you disagree with.',
    extra: [],
  },
  {
    key: 'ai-heuristic',
    title: 'Decided by the AI under rails',
    blurb: 'No axis — the AI’s on-media placement, contrast, and weight are settled by the checkable heuristics (H13/H14/H19) + oracle and the ACTIONS conventions, not an axis choice. The drift zone; hard rails.',
    extra: [],
  },
] as const;

// The preset-able axes shown in the useCase → defaults matrix. Gallery axes sit at the top
// level; the tile axes are the config the gallery PINS on its MediaTile child (propagated
// top-down per useCase), shown prefixed `item.`.
const GALLERY_PRESET_FIELDS = [
  'arrangement', 'section', 'sort', 'filter', 'density', 'pagination', 'feature', 'order',
] as const;
const TILE_PRESET_FIELDS = [
  'surface', 'orientation', 'label', 'primaryAction', 'hoverMedia', 'hoverActions',
] as const;

// data-rule = from the data · use-case-preset = default from purpose · consumer =
// explicit override · ai-heuristic = AI decides under heuristics + oracle.
const DECIDED_COLOR = {
  'data-rule': 'blue',
  'use-case-preset': 'indigo',
  consumer: 'green',
  'ai-heuristic': 'orange',
} as const;

// How an axis value shows up in its slot.
const AS_COLOR = {
  node: 'blue',
  prop: 'teal',
  behavior: 'grape',
  pattern: 'orange',
} as const;

// Rough tree of the skeleton (hand-drawn for now — will derive from the data later).
const SKELETON_TREE = `gallery — root container  (useCase)
├─ controls — filter & sort chrome  (filter, sort)   → candidate Filter sub-pattern
└─ section — grouping wrapper  (section, feature)
   └─ arrangement — item container  (arrangement, density, pagination, order)
      └─ item — per-item wrapper  (surface)   ·  item & below = the Item sub-pattern
         ├─ media — the lead visual  (lead, fit, hoverMedia)
         │  └─ overlay — on-media actions & indicators  (primaryAction, hoverActions)
         └─ label — metadata block  (label, stats)`;

export function DesignPatternPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="design-pattern">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/contracts">Contracts</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Design patterns</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Design patterns</Heading>
          <Text color="muted" size="lg">
            {itemGallery.intent}
          </Text>
        </Stack>

        <Alert variant="info" title="Work in progress">
          An exploratory snapshot, rendered live from the pattern draft. The shape, names, and axes
          will still change — this is here to look at and react to, not a finished contract.
        </Alert>

        <Section
          id="idea"
          title="A design pattern isn’t a template — it’s a parameterized pattern"
          lede="One pattern, many concrete forms. It carries the decisions, not one baked answer."
        >
          <Text>
            <Code>{itemGallery.name}</Code> is <Text as="strong">a gallery of items, each with a visual
            lead + metadata + actions</Text>. A media gallery, a product gallery, a people directory, a
            file browser are all the <Text as="em">same</Text> pattern — instances differentiated by
            axis values (<Code>useCase</Code> × <Code>lead</Code> × <Code>label</Code>), not separate
            design patterns. That’s the point of a parameterized pattern.
          </Text>
          <Text>
            It has <Text as="strong">two levels</Text> — the gallery (page organization) composes the
            item — and every axis is tagged by <Text as="strong">how it’s decided</Text>, so an AI can
            drive it with the consumer barely touching it.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            {itemGallery.synonyms.map((s) => (
              <Badge key={s} variant="soft">
                {s}
              </Badge>
            ))}
          </Stack>
        </Section>

        <Section
          id="axes"
          title="Axes & decision sources"
          lede="Each axis is tagged by HOW it’s decided: a rule from the data, a preset from the use case, an explicit consumer choice, or the AI under heuristics + oracle."
        >
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Axis</Table.Head>
                <Table.Head>Level</Table.Head>
                <Table.Head>Decided by</Table.Head>
                <Table.Head>Options</Table.Head>
                <Table.Head>Meaning</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {itemGallery.axes.map((a) => (
                <Table.Row key={a.axis}>
                  <Table.Cell>
                    <Code>{a.axis}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="sm" color="muted">
                      {a.level}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="soft" color={DECIDED_COLOR[a.decidedBy]}>
                      {a.decidedBy}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {a.options ? (
                      <Stack direction="row" gap="xs" wrap>
                        {a.options.map((o) => (
                          <Code key={o}>{o}</Code>
                        ))}
                      </Stack>
                    ) : (
                      <Text size="sm" color="muted">
                        —
                      </Text>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="sm">{a.gloss}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Section>

        <Section
          id="presets"
          title="Use-case presets"
          lede="What each use case sets every preset-able axis to — the concrete useCase → defaults mapping behind the indigo rows above. Gallery axes sit at the top; the item.* rows are the tile config the gallery PINS on its MediaTile child and propagates down top-down per use case (MediaTile defines those axes; the gallery controls them). The consumer overrides individual values; data-rules still override where the data demands."
        >
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Axis</Table.Head>
                {itemGallery.useCases.map((uc) => (
                  <Table.Head key={uc}>{uc}</Table.Head>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {GALLERY_PRESET_FIELDS.map((field) => (
                <Table.Row key={field}>
                  <Table.Cell>
                    <Code>{field}</Code>
                  </Table.Cell>
                  {itemGallery.useCases.map((uc) => {
                    const v = itemGallery.presets[uc][field];
                    const text = Array.isArray(v) ? (v.length ? v.join(' · ') : '—') : v;
                    return (
                      <Table.Cell key={uc}>
                        <Text size="sm" color="muted">
                          {text}
                        </Text>
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              ))}
              {TILE_PRESET_FIELDS.map((field) => (
                <Table.Row key={field}>
                  <Table.Cell>
                    <Code>item.{field}</Code>
                  </Table.Cell>
                  {itemGallery.useCases.map((uc) => {
                    const v = itemGallery.presets[uc].item[field];
                    const text = Array.isArray(v) ? (v.length ? v.join(' · ') : '—') : v;
                    return (
                      <Table.Cell key={uc}>
                        <Text size="sm" color="muted">
                          {text}
                        </Text>
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Section>

        <Section
          id="actions"
          title="Item actions"
          lede="The set is derived from useCase × media; each kind has a category, a conventional icon, a default placement, and a weight."
        >
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Action</Table.Head>
                <Table.Head>Category</Table.Head>
                <Table.Head>Icon</Table.Head>
                <Table.Head>Placement</Table.Head>
                <Table.Head>Weight</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {Object.entries(itemGallery.actions).map(([kind, c]) => (
                <Table.Row key={kind}>
                  <Table.Cell>
                    <Code>{kind}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="soft">{c.category}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Code>{c.icon}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Code>{c.defaultRegion}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="soft" color={c.weight === 'primary' ? 'indigo' : 'gray'}>
                      {c.weight}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Section>

        <Section
          id="structure"
          title="Skeleton & bindings — where coverage lives"
          lede="One stable skeleton of nested slots; every axis binds to a slot, and each axis VALUE has a concrete representation there — a Move composite (node), a prop, a behavior, or a nested pattern. Coverage is this SLOT × axis-value matrix, finite and checkable. The root gallery slot is the container; item is itself a sub-pattern (Gallery ∘ Item)."
        >
          <Stack gap="lg">
            <CodeBlock code={SKELETON_TREE} language="text" />
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Slot</Table.Head>
                  <Table.Head>Parent</Table.Head>
                  <Table.Head>Driven by</Table.Head>
                  <Table.Head>Role</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {itemGallery.skeleton.map((s) => (
                  <Table.Row key={s.slot}>
                    <Table.Cell>
                      <Code>{s.slot}</Code>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="sm" color="muted">{s.parent ?? '— (root)'}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Stack direction="row" gap="xs" wrap>
                        {s.drivenBy.map((a) => (
                          <Code key={a}>{a}</Code>
                        ))}
                      </Stack>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="sm">{s.role}</Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>

            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Slot</Table.Head>
                  <Table.Head>Axis</Table.Head>
                  <Table.Head>Value</Table.Head>
                  <Table.Head>As</Table.Head>
                  <Table.Head>Representation (Move)</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {itemGallery.bindings.map((b, i) => (
                  <Table.Row key={`${b.axis}-${b.value}-${i}`}>
                    <Table.Cell>
                      <Code>{b.slot}</Code>
                    </Table.Cell>
                    <Table.Cell>
                      <Code>{b.axis}</Code>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="sm">{b.value}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant="soft" color={AS_COLOR[b.as]}>{b.as}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Stack gap="xs">
                        {b.repr ? (
                          <Code>{b.repr}</Code>
                        ) : (
                          <Badge variant="soft" color="red">gap</Badge>
                        )}
                        {b.note && (
                          <Text size="sm" color="muted">{b.note}</Text>
                        )}
                      </Stack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Stack>
        </Section>

        <Section
          id="heuristics"
          title="Heuristics — the axis-level laws"
          lede="Design laws that govern AXIS choices and their interactions — the one level nothing else checks. (Component a11y/tokens/ARIA are guaranteed by Move components; composite purity/spec-drift by move check. These don’t restate those.) Each is scoped to the axes it constrains; a checkable one becomes an oracle over the resolved config, failing an incoherent combination."
        >
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Law</Table.Head>
                <Table.Head>Kind</Table.Head>
                <Table.Head>Axes</Table.Head>
                <Table.Head>Check</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {itemGallery.heuristics.map((h) => (
                <Table.Row key={h.id}>
                  <Table.Cell>
                    <Text size="sm">{h.law}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="soft">{h.kind}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Stack direction="row" gap="xs" wrap>
                      {h.axes.map((a) => (
                        <Code key={a}>{a}</Code>
                      ))}
                    </Stack>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="soft" color={h.checkable ? 'green' : 'gray'}>
                      {h.checkable ? 'oracle' : 'guidance'}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Section>

        <Section
          id="ownership"
          title="Who supplies what — the whole plot"
          lede="Every axis, bucketed by who decides it. The model in one view: you supply a tiny, underivable core; the system derives, proposes (with a rationale), or decides-under-rails the rest — and every proposed value stays overridable."
        >
          <Stack gap="lg">
            {OWNERSHIP.map((b) => {
              const axes = itemGallery.axes.filter((a) => a.decidedBy === b.key);
              const count = axes.length + b.extra.length;
              return (
                <Card.Root key={b.key} variant="default">
                  <Card.Body>
                    <Stack gap="sm">
                      <Stack direction="row" gap="sm" align="center" wrap>
                        <Badge variant="soft" color={DECIDED_COLOR[b.key]}>
                          {b.key}
                        </Badge>
                        <Text weight="semibold">{b.title}</Text>
                        <Text size="sm" color="muted">
                          {count} {count === 1 ? 'choice' : 'choices'}
                        </Text>
                      </Stack>
                      <Text size="sm" color="muted">
                        {b.blurb}
                      </Text>
                      {axes.length > 0 && (
                        <Stack direction="row" gap="xs" wrap>
                          {axes.map((a) => (
                            <Code key={a.axis}>{a.axis}</Code>
                          ))}
                        </Stack>
                      )}
                      {b.extra.length > 0 && (
                        <Stack gap="xs">
                          {b.extra.map((e) => (
                            <Text key={e} size="sm">
                              • {e}
                            </Text>
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  </Card.Body>
                </Card.Root>
              );
            })}
          </Stack>
        </Section>

        <Section
          id="instance"
          title="A worked instance — every axis, resolved"
          lede="The pattern applied end to end to one concrete gallery (a daily photo feed: discover primary + a consume blend). A value for every axis, with who decided it and why — the four green rows are the only genuine input; the rest the system derived, proposed, or decided under rails."
        >
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Axis</Table.Head>
                <Table.Head>Value</Table.Head>
                <Table.Head>Decided by</Table.Head>
                <Table.Head>Why</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {INSTANCE.map((r) => (
                <Table.Row key={r.axis}>
                  <Table.Cell>
                    <Code>{r.axis}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="sm" weight="medium">{r.value}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="soft" color={DECIDED_COLOR[r.by]}>
                      {r.by}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="sm" color="muted">{r.why}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
