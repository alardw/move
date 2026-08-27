import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Badge, Icon, Table } from 'move';
import { Section, TocRail, type TocItem, CodeBlock } from '../../components';

/**
 * Props. What happens to the props you pass a Move component: which ones you
 * own, which the component owns, and which the two of you share.
 */

const BADGES = [
  { icon: 'check', label: 'Your name wins' },
  { icon: 'check', label: 'Your handler runs' },
];

const TOC: TocItem[] = [
  { href: '#props', label: 'Overview' },
  { href: '#naming', label: 'Names are yours' },
  { href: '#handlers', label: 'Handlers are shared' },
  { href: '#structural', label: "Structure is the component's" },
];

const ROWS = [
  {
    kind: 'Names',
    props: 'aria-label, aria-labelledby, aria-describedby, title, alt',
    who: 'Yours wins',
  },
  { kind: 'Handlers', props: 'onClick, onKeyDown, onFocus, …', who: 'Both run' },
  {
    kind: 'Structure',
    props: 'role, type, aria-expanded, aria-sort, data-*',
    who: "The component's",
  },
];

export function PropsPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="props">
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
            <Breadcrumb.Page>Props</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Props</Heading>
          <Text color="muted" size="lg">
            Anything you pass a Move component lands on the element it renders. Three kinds settle
            differently, and each one settles the way you would want it to.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            {BADGES.map((b) => (
              <Badge key={b.label} variant="soft">
                <Icon name={b.icon} />
                {b.label}
              </Badge>
            ))}
          </Stack>
        </Stack>

        <Section
          id="naming"
          title="Names are yours"
          lede="A component knows it renders a close button. You know whether it closes a dialog or a filter panel."
        >
          <Stack gap="md">
            <Text>
              Pass <Code>aria-label</Code> and yours is the name — same for{' '}
              <Code>aria-labelledby</Code>, <Code>aria-describedby</Code>, <Code>title</Code> and{' '}
              <Code>alt</Code>. What the component carries is a sensible default for when you say
              nothing.
            </Text>
            <CodeBlock
              language="tsx"
              code={`<Dialog.Close aria-label="Close the filter panel" />
// announced as "Close the filter panel"`}
            />
            <Text>
              For text a component shows on screen, reach for its{' '}
              <RouterLink to="/customize/internationalization">
                <Code>labels</Code> prop
              </RouterLink>{' '}
              instead — one object per component, translated once and used everywhere it appears.
            </Text>
          </Stack>
        </Section>

        <Section
          id="handlers"
          title="Handlers are shared"
          lede="Your handler and the component's both have work to do, so both run."
        >
          <Stack gap="md">
            <Text>
              Yours runs first. Track the click, then let the header sort — you get both, in that
              order, with nothing to wire up.
            </Text>
            <CodeBlock
              language="tsx"
              code={`<Table.Head sortable onSort={sort} onClick={track}>
  Name
</Table.Head>
// track() runs, then the column sorts`}
            />
            <Text>
              Call <Code>preventDefault()</Code> and the component stands down, which is how you
              take the click without the sort.
            </Text>
          </Stack>
        </Section>

        <Section
          id="structural"
          title="Structure is the component's"
          lede="The props that say what a thing IS stay with the thing."
        >
          <Stack gap="md">
            <Text>
              <Code>role</Code>, <Code>type</Code>, <Code>aria-expanded</Code>,{' '}
              <Code>aria-sort</Code>, <Code>aria-checked</Code> and the <Code>data-*</Code>{' '}
              attributes describe what the component is and what state it is in. A disclosure keeps
              announcing whether it is open; a sortable header keeps announcing its direction. Those
              hold however the component is used, which is what makes them worth relying on.
            </Text>
            <Text>Each component&apos;s page lists the ones it owns, under its anatomy.</Text>
          </Stack>
        </Section>

        <Section id="summary" title="In short">
          <Table variant="lines" size="sm">
            <Table.Header>
              <Table.Row>
                <Table.Head>Kind</Table.Head>
                <Table.Head>Props</Table.Head>
                <Table.Head>Who decides</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {ROWS.map((r) => (
                <Table.Row key={r.kind}>
                  <Table.Cell>
                    <Text weight="medium">{r.kind}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Code size="sm">{r.props}</Code>
                  </Table.Cell>
                  <Table.Cell>{r.who}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
