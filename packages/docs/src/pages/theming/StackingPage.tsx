import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Badge, Icon, Table, Z_LAYERS } from 'move';
import type { ZKind } from 'move';
import { Section, TocRail, type TocItem } from '../../components';

/**
 * Theming → Stacking. The z-layer hierarchy: how Move components
 * order themselves on the z-axis, the CSS tokens that materialize
 * each layer, and the derivation rules that pick a layer from a
 * spec's behaviors + a11y.
 */

const TOC: TocItem[] = [
  { href: '#overview', label: 'Overview' },
  { href: '#layers', label: 'Layers' },
  { href: '#derivation', label: 'Derivation rules' },
  { href: '#components', label: 'Per-component layer' },
  { href: '#pitfalls', label: 'Stacking pitfalls' },
];

const LAYER_ORDER: ZKind[] = [
  'sticky',
  'app-shell',
  'overlay-backdrop',
  'overlay',
  'popover',
  'tooltip',
  'toast',
];

const LAYER_USED_FOR: Record<ZKind, string> = {
  'sticky': 'Sticky elements within scrollable content (sticky table headers, etc.)',
  'app-shell': 'Top-level chrome — sidebars, fixed top bars.',
  'overlay-backdrop': 'Backdrop behind modals.',
  'overlay': 'Modal content layer (Dialog, Drawer).',
  'popover': 'Anchored popups (Popover, Dropdown, Select dropdown, Autocomplete).',
  'tooltip': 'Tooltips — sit above other popovers.',
  'toast': 'Toast notifications — highest layer.',
};

const COMPONENT_BY_LAYER: Record<ZKind, string[]> = {
  'sticky': [],
  'app-shell': ['Sidebar'],
  'overlay-backdrop': ['Dialog backdrop', 'Drawer backdrop'],
  'overlay': ['Dialog', 'Drawer'],
  'popover': ['Popover', 'Dropdown', 'Select', 'Autocomplete', 'DatePicker', 'ColorInput'],
  'tooltip': ['Tooltip'],
  'toast': ['Toast'],
};

const DERIVATION_RULES = [
  { precedence: 1, rule: <><Code>a11y.kind === 'tooltip'</Code></>, layer: 'tooltip', why: 'Tooltips need to sit above other popovers.' },
  { precedence: 2, rule: <>any <Code>behaviors[].kind === 'notification-floating'</Code></>, layer: 'toast', why: 'Floating notifications stack highest of all.' },
  { precedence: 3, rule: <>any <Code>behaviors[].kind === 'modal-overlay'</Code></>, layer: 'overlay', why: 'Modal content layer (the backdrop is rendered separately at overlay-backdrop).' },
  { precedence: 4, rule: <>any <Code>behaviors[].kind === 'popup-anchored'</Code></>, layer: 'popover', why: 'Anchored popups not otherwise classified.' },
  { precedence: 5, rule: <>otherwise</>, layer: 'base', why: 'No z-index needed — component lives at document flow.' },
];

export function StackingPage() {
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
              <RouterLink to="/theming">Theming</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Stacking</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Stacking</Heading>
          <Text color="muted" size="lg">
            Z-layer hierarchy. Components don't pick raw z-index numbers — they reference named layers, each backed by a CSS variable token, ordered low → high.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft"><Icon name="layers" />{LAYER_ORDER.length} layers</Badge>
            <Badge variant="soft"><Icon name="git-branch" />Derived from spec, not declared</Badge>
          </Stack>
        </Stack>

        <Section
          id="layers"
          title="Layers"
          lede="Seven named layers. The numeric value is documented but consumers reference the CSS token, never the number."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Layer</Table.Head>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>z-index</Table.Head>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>CSS token</Table.Head>
                <Table.Head>Used for</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {LAYER_ORDER.map((kind) => (
                <Table.Row key={kind}>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><Code>{kind}</Code></Table.Cell>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>{Z_LAYERS[kind].value}</Table.Cell>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><Code>{Z_LAYERS[kind].token}</Code></Table.Cell>
                  <Table.Cell><Text size="sm">{LAYER_USED_FOR[kind]}</Text></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>

        <Section
          id="derivation"
          title="Derivation rules"
          lede="Z-layer is computed from a spec's behaviors and a11y, not declared. The deriveZ function applies these rules in order."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>#</Table.Head>
                <Table.Head>Match</Table.Head>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Layer</Table.Head>
                <Table.Head>Why</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {DERIVATION_RULES.map((r) => (
                <Table.Row key={r.precedence}>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>{r.precedence}</Table.Cell>
                  <Table.Cell><Text size="sm">{r.rule}</Text></Table.Cell>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><Code>{r.layer}</Code></Table.Cell>
                  <Table.Cell><Text size="sm">{r.why}</Text></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Text>
            The rules are exhaustive — if derivation can't pick a layer cleanly for a new component, the answer is to refine an underlying taxonomy (e.g. split a coarse behaviour kind), not to add an override field to the spec.
          </Text>
        </Section>

        <Section
          id="components"
          title="Per-component layer"
          lede="Which Move components currently land at which layer."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Layer</Table.Head>
                <Table.Head>Components</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {LAYER_ORDER.map((kind) => (
                <Table.Row key={kind}>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><Code>{kind}</Code></Table.Cell>
                  <Table.Cell>
                    {COMPONENT_BY_LAYER[kind].length === 0
                      ? <Text size="sm" color="muted">— none yet</Text>
                      : <Text size="sm">{COMPONENT_BY_LAYER[kind].join(', ')}</Text>}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>

        <Section
          id="pitfalls"
          title="Stacking pitfalls"
          lede="A higher z-index doesn't always win — common gotchas when layered components don't appear where expected."
        >
          <Stack gap="md">
            <Stack gap="sm">
              <Heading level={3} size="lg" weight="normal">New stacking contexts</Heading>
              <Text>
                Any element with <Code>position: relative/absolute/fixed</Code> + <Code>z-index</Code>, or <Code>transform</Code>, <Code>filter</Code>, <Code>opacity {'<'} 1</Code>, or <Code>will-change</Code>, creates a new stacking context. Children are clipped to that context's z-range — they can't escape to a higher layer even if they declare a larger z-index.
              </Text>
              <Text>
                If a Tooltip rendered inside a transformed Card disappears behind a sibling, that's the cause. Move overlays (Dialog, Drawer, Popover, Dropdown, Tooltip, Toast) all portal to <Code>document.body</Code> to escape stacking contexts. Only inline-rendered overlays hit this problem.
              </Text>
            </Stack>
            <Stack gap="sm">
              <Heading level={3} size="lg" weight="normal">Don't write raw z-index in component CSS</Heading>
              <Text>
                Always reference the token: <Code>z-index: var(--move-z-popover);</Code>. The numeric values are tuned and may shift on schema bumps; a hard-coded number stops tracking the layer system.
              </Text>
            </Stack>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
