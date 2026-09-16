import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Badge, Icon, Table } from 'move';
import { Section, TocRail, Preview, type TocItem } from '../../components';

import SortableBasic from '../../content/components/sortable/samples/basic';
import sortableBasicCode from '../../content/components/sortable/samples/basic?raw';
import DragSlots from '../../content/components/drag/samples/slots';
import dragSlotsCode from '../../content/components/drag/samples/slots?raw';

/**
 * Dragging and dropping as a system: two hooks, two components, and the rule
 * for which one to reach for. The demos are the components' own samples rather
 * than copies — a second copy is a second thing to keep true.
 */

const TOC: TocItem[] = [
  { href: '#overview', label: 'Overview' },
  { href: '#layers', label: 'Four pieces' },
  { href: '#reorder', label: 'Rearranging a list' },
  { href: '#targets', label: 'Somewhere that is not a reorder' },
  { href: '#keyboard', label: 'The keyboard path' },
  { href: '#styling', label: 'Why the components exist' },
];

const LAYERS = [
  {
    name: 'useDraggable',
    kind: 'Hook',
    use: 'Make any element follow the pointer — including a component Move does not ship.',
  },
  {
    name: 'useDropTarget',
    kind: 'Hook',
    use: 'Make any element catch a drag.',
  },
  {
    name: 'Sortable',
    kind: 'Component',
    use: 'Rearrange a list. The common case, and the one that needs no wiring.',
  },
  {
    name: 'Drag',
    kind: 'Component',
    use: 'Shared context, and drop targets for everything that is not a reorder.',
  },
];

export function DragAndDropPage() {
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
            <Breadcrumb.Page>Drag &amp; drop</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="md">
          <Heading level={1}>Drag &amp; drop</Heading>
          <Text size="lg" color="muted">
            Two hooks that attach dragging to anything, and two components that draw what a person
            sees while it happens.
          </Text>
          <Stack direction="row" gap="sm" wrap>
            <Badge variant="soft">
              <Icon name="check" />
              Attaches to any component
            </Badge>
            <Badge variant="soft">
              <Icon name="check" />
              Keyboard as named moves
            </Badge>
            <Badge variant="soft">
              <Icon name="check" />
              Order stays your data
            </Badge>
          </Stack>
        </Stack>

        <Section
          id="layers"
          title="Four pieces"
          lede="Reach for the component first. The hooks are there for the case it does not cover."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Piece</Table.Head>
                <Table.Head>Kind</Table.Head>
                <Table.Head>When</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {LAYERS.map((l) => (
                <Table.Row key={l.name}>
                  <Table.Cell>
                    <Code>{l.name}</Code>
                  </Table.Cell>
                  <Table.Cell>{l.kind}</Table.Cell>
                  <Table.Cell>{l.use}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>

        <Section
          id="reorder"
          title="Rearranging a list"
          lede="Drag a row by its handle. A single list needs no wrapper — Sortable brings its own context."
        >
          <Preview code={sortableBasicCode}>
            <SortableBasic />
          </Preview>
          <Text size="sm" color="muted">
            <Code>onReorder</Code> is the only thing the call site has to handle. The order lives in
            your own state, so it stays with the rest of your data instead of being copied into the
            component. A drag abandoned with <Code>Esc</Code> arrives as{' '}
            <Code>destination: null</Code> — a move that did not happen, rather than a move to
            nowhere. Full API on the <RouterLink to="/components/sortable">Sortable</RouterLink>{' '}
            page.
          </Text>
        </Section>

        <Section
          id="targets"
          title="Somewhere that is not a reorder"
          lede="Drag a chip onto a position. The positions stay visible while empty, which is the thing a reorder cannot express."
        >
          <Preview code={dragSlotsCode}>
            <DragSlots />
          </Preview>
          <Text size="sm" color="muted">
            An empty slot holds no row to reorder, and a second list is somewhere a row leaves the
            first entirely. Both are <Code>Drag.Zone</Code>. Put two lists under one{' '}
            <Code>Drag.Root</Code> and they share a drag, so a row can move between them. See{' '}
            <RouterLink to="/components/drag">Drag</RouterLink>.
          </Text>
        </Section>

        <Section
          id="keyboard"
          title="The keyboard path"
          lede="A menu of named moves, not an arrow-key drag."
        >
          <Text>
            Focus a handle and press <Code>Enter</Code>: Move up, Move down, Move to top, Move to
            bottom, each already disabled at the end of the list where it would do nothing. One
            focus stop, no second mode to enter, and nothing to get stuck inside. The menu opens
            only from the keyboard — a pointer press starts a drag instead, so a menu never appears
            under a finger that is already carrying something.
          </Text>
          <Text size="sm" color="muted">
            This follows Atlassian’s current guidance, which advises against arrow-key dragging: the
            movement does not generalise across layouts, it costs too many keystrokes on a long
            list, and it competes with the screen reader for the same keys. Every move is announced
            by position — “Dropped at position 2 of 5” — from the single live region{' '}
            <Code>Drag.Root</Code> renders.
          </Text>
        </Section>

        <Section
          id="styling"
          title="Why the components exist"
          lede="The hooks could do all of this except be seen."
        >
          <Text>
            Everything a person notices during a drag is a rendered thing: the lift on the row under
            the pointer, the gap that opens where it lands, the highlight on a target that will take
            it. A hook cannot render any of them, and an app cannot supply them either — an inline{' '}
            <Code>style</Code> in composed code is refused, and so is custom CSS. So the affordances
            are not merely tedious to rebuild outside the library; they are unbuildable. That is
            what the components own.
          </Text>
          <Text size="sm" color="muted">
            The lift is a global rule on <Code>[data-dragging]</Code>, not a component class, so it
            reaches whatever the hooks are attached to — a Card, a List.Item, a plain element. Rows
            sliding to their new places is{' '}
            <RouterLink to="/components/layout-group">LayoutGroup</RouterLink>, which Sortable uses
            rather than reimplements.
          </Text>
        </Section>
      </Stack>

      <TocRail items={TOC} />
    </Stack>
  );
}
