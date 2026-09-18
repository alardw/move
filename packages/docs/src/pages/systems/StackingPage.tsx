import { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Badge, Icon, Table, Z_LAYERS } from 'move';
import type { ZKind } from 'move';
import { Section, TocRail, type TocItem } from '../../components';

/**
 * Stacking. The z-layer hierarchy: how Move components order themselves on the
 * z-axis, the CSS tokens that materialize each layer, and how a component picks
 * the layer for its role.
 */

const TOC: TocItem[] = [
  { href: '#overview', label: 'Overview' },
  { href: '#layers', label: 'Layers' },
  { href: '#choosing', label: 'Choosing a layer' },
  { href: '#components', label: 'Per-component layer' },
  { href: '#local', label: 'The local layer' },
  { href: '#pitfalls', label: 'Stacking pitfalls' },
];

const LAYER_ORDER: ZKind[] = [
  'base',
  'sticky',
  'overlay',
  'modal',
  'popover',
  'drag',
  'toast',
  'tooltip',
];

const LAYER_USED_FOR: Record<ZKind, string> = {
  base: 'The page itself. Anything that has not asked to be lifted.',
  sticky: 'Sticky elements within scrollable content — a pinned table header.',
  overlay:
    'The dimmed backdrop behind a modal surface, which covers the page but sits under the panel it belongs to.',
  modal:
    'The panel itself — Dialog, Drawer, and the mobile Sidebar, which is a drawer by another name.',
  popover: 'Anchored popups — Popover, Dropdown content, Select, Autocomplete, DatePicker.',
  drag: 'Whatever is currently in someone’s hand. Above overlay and modal because the point of it is to escape them: a row dragged out of a Drawer has to clear the Drawer, and no z-index inside that Drawer can.',
  toast: 'Notifications that arrive on their own.',
  tooltip: 'Tooltips — the topmost layer, because they explain whatever is under them.',
};

/**
 * Which components claim a layer. `base` is deliberately absent: it is where
 * everything that never asks to be lifted already lives, so a row for it would
 * read "none yet" when the true answer is "all of them".
 */
const LAYERS_WITH_COMPONENTS: ZKind[] = [
  'sticky',
  'overlay',
  'modal',
  'popover',
  'drag',
  'toast',
  'tooltip',
];

const COMPONENT_BY_LAYER: Record<ZKind, string[]> = {
  base: [],
  sticky: ['Table', 'CalendarView'],
  overlay: ['Dialog backdrop', 'Drawer backdrop'],
  modal: ['Dialog', 'Drawer', 'Sidebar'],
  popover: ['Popover', 'Dropdown', 'Select', 'Autocomplete', 'DatePicker', 'ColorInput'],
  drag: ['Drag', 'Sortable'],
  toast: ['Toast'],
  tooltip: ['Tooltip'],
};

const LAYER_GUIDANCE = [
  {
    role: <>Everything else</>,
    layer: 'base',
    why: 'No z-index needed — lives in normal document flow.',
  },
  {
    role: <>A component ordering its own parts</>,
    layer: 'local',
    why: 'The active segment over its neighbours, a marker over its line. Ten steps, --move-z-local-0…9, kept below every other layer so it can never outrank one.',
  },
  {
    role: <>Sticky in-flow elements</>,
    layer: 'sticky',
    why: 'Pinned within a scroll region — a sticky table header.',
  },
  {
    role: <>Modal backdrops</>,
    layer: 'overlay',
    why: 'Covers the page, sits under the panel it belongs to.',
  },
  {
    role: <>Modal panels (Dialog, Drawer, mobile Sidebar)</>,
    layer: 'modal',
    why: 'The surface itself, above its own backdrop.',
  },
  {
    role: <>Anchored popups (Popover, Dropdown, Select, …)</>,
    layer: 'popover',
    why: 'Float above page content and above the panel they were opened from.',
  },
  {
    role: <>Whatever is in someone’s hand</>,
    layer: 'drag',
    why: 'Above overlay and modal, because the point of it is to escape them — a row dragged out of a Drawer has to clear the Drawer.',
  },
  {
    role: <>Floating notifications</>,
    layer: 'toast',
    why: 'Arrive on their own, so they clear everything a person deliberately opened.',
  },
  {
    role: <>Tooltips</>,
    layer: 'tooltip',
    why: 'Topmost, because a tooltip explains whatever is under it — including a toast.',
  },
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
              <RouterLink to="/systems">Systems</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Stacking</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Stacking</Heading>
          <Text color="muted" size="lg">
            Z-layer hierarchy. Components don't pick raw z-index numbers — they reference named
            layers, each backed by a CSS variable token, ordered low → high.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft">
              <Icon name="layers" />
              {LAYER_ORDER.length} layers
            </Badge>
            <Badge variant="soft">
              <Icon name="git-branch" />
              One CSS token per layer
            </Badge>
          </Stack>
        </Stack>

        <Section
          id="layers"
          title="Layers"
          lede={`${LAYER_ORDER.length} named layers. The value is shown so the order is legible, but nothing references the number — components and consumers write the token.`}
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
                <Fragment key={kind}>
                  <Table.Row>
                    <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                      <Code>{kind}</Code>
                    </Table.Cell>
                    <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                      {Z_LAYERS[kind].value}
                    </Table.Cell>
                    <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                      <Code>{`--move-layer-${kind}`}</Code>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="sm">{LAYER_USED_FOR[kind]}</Text>
                    </Table.Cell>
                  </Table.Row>
                  {/* The 100s belong to the local space. Shown here so the scale has
                      no unexplained gap between 0 and 200. */}
                  {kind === 'base' && (
                    <Table.Row>
                      <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                        <Code>local</Code>
                      </Table.Cell>
                      <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>100–109</Table.Cell>
                      <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                        <Code>--move-z-local-0…9</Code>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="sm">
                          A component ordering its own parts inside its own box. The lowest layer,
                          and the only one with steps inside it, because it is the only one used
                          within a single component.
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Fragment>
              ))}
            </Table.Body>
          </Table>
        </Section>

        <Section
          id="choosing"
          title="Choosing a layer"
          lede="A component references the CSS token for its role, so the whole library shares one consistent ordering."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Role</Table.Head>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Layer</Table.Head>
                <Table.Head>Why</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {LAYER_GUIDANCE.map((r) => (
                <Table.Row key={r.layer}>
                  <Table.Cell>
                    <Text size="sm">{r.role}</Text>
                  </Table.Cell>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                    <Code>{r.layer}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="sm">{r.why}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Text>
            If a new component doesn't fit any layer cleanly, prefer extending the scale here (a new
            named token) over hard-coding a one-off z-index, so the ordering stays centralized.
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
              {LAYERS_WITH_COMPONENTS.map((kind) => (
                <Table.Row key={kind}>
                  <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                    <Code>{kind}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    {COMPONENT_BY_LAYER[kind].length === 0 ? (
                      <Text size="sm" color="muted">
                        — none yet
                      </Text>
                    ) : (
                      <Text size="sm">{COMPONENT_BY_LAYER[kind].join(', ')}</Text>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>

        <Section
          id="local"
          title="The local layer"
          lede="The lowest layer, and the only one with steps inside it — because it is the only one ordering parts within a single component."
        >
          <Text>
            The 100s are this layer and the others start at 200, so a stray <Code>z-index: 1</Code>{' '}
            from elsewhere in the page cannot land in the middle of a component’s own ordering, and
            a component’s own ordering can never outrank another component’s layer.{' '}
            <Code>check:z-layers</Code> enforces that separation.
          </Text>
          <Text size="sm" color="muted">
            Ten steps, because the band is free and renumbering later is not. Nothing in the library
            has needed more than four — twenty uses, four distinct values, deepest is three — so
            reaching past that is worth a second look rather than forbidden. What is NOT local is
            anything that leaves the box: a popup, an overlay, a <Code>position: sticky</Code>{' '}
            header. Those can end up over another component however small the number looks, so they
            take one of the layers above.
          </Text>
        </Section>

        <Section
          id="pitfalls"
          title="Stacking pitfalls"
          lede="A higher z-index doesn't always win — common gotchas when layered components don't appear where expected."
        >
          <Stack gap="md">
            <Stack gap="sm">
              <Heading level={3}>New stacking contexts</Heading>
              <Text>
                Any element with <Code>position: relative/absolute/fixed</Code> +{' '}
                <Code>z-index</Code>, or <Code>transform</Code>, <Code>filter</Code>,{' '}
                <Code>opacity {'<'} 1</Code>, or <Code>will-change</Code>, creates a new stacking
                context. Children are clipped to that context's z-range — they can't escape to a
                higher layer even if they declare a larger z-index.
              </Text>
              <Text>
                If a Tooltip rendered inside a transformed Card disappears behind a sibling, that's
                the cause. Move overlays (Dialog, Drawer, Popover, Dropdown, Tooltip, Toast) all
                portal to <Code>document.body</Code> to escape stacking contexts. Only
                inline-rendered overlays hit this problem.
              </Text>
              <Text>
                <strong>A dragged element is the one that still does.</strong> It moves in place
                rather than portalling, so it cannot leave the stacking context it was rendered in:
                drag a row inside a <RouterLink to="/components/drawer">Drawer</RouterLink> and it
                stays behind the Drawer no matter what layer it claims, and is clipped the moment it
                passes the Drawer's edge, because that panel also sets <Code>overflow: hidden</Code>
                . The <Code>drag</Code> layer above is what it will occupy once it portals; today it
                is the ceiling it cannot reach. Until then, a sortable list inside a clipping
                container is a known limitation rather than a mystery.
              </Text>
            </Stack>
            <Stack gap="sm">
              <Heading level={3}>Two spaces, and every z-index is a token</Heading>
              <Text>
                Stacking is two different jobs wearing one property, so there are two sets of tokens
                and the name tells you which you are in.
              </Text>
              <Text>
                <strong>Layered</strong> — <Code>var(--move-layer-*)</Code> — is for sitting above
                other components: a dialog over the page, a tooltip over the dialog, a dragged row
                over the drawer it came from. Things that do not know about each other can only be
                ordered by a scale they both read from, which is the table above.
              </Text>
              <Text>
                <strong>Local</strong> — <Code>var(--move-z-local-0…9)</Code> — is a component
                ordering its own parts inside its own box: the active segment over its neighbours’
                borders, a marker over the line it sits on, a settings menu over the control bar it
                opens from. These mean something only against each other. Giving them a layer token
                would set them all to the same number and destroy the ordering they exist for.
              </Text>
              <Text size="sm" color="muted">
                A <Code>position: sticky</Code> or <Code>fixed</Code> element is never local,
                whatever the number looks like: it leaves its parent’s flow to sit over whatever
                scrolls past, which is other components. <Code>check:z-layers</Code> enforces both
                halves, and there is no exemption comment — the local layer exists precisely so that
                none is needed.
              </Text>
            </Stack>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
