import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Table, Link } from 'move';
import { Section, TocRail, type TocItem } from '../../components';

/**
 * The capability contract — the fields a capability declares, and the test it
 * has to pass to exist at all.
 */

const TOC: TocItem[] = [
  { href: '#capability', label: 'Overview' },
  { href: '#fields', label: 'Fields' },
  { href: '#escapes', label: 'Legitimate escapes' },
  { href: '#test', label: 'When one earns its place' },
];

type Row = { name: string; type: string; required: boolean; what: React.ReactNode };

const FIELDS: Row[] = [
  {
    name: 'targets',
    type: 'string[]',
    required: true,
    what: (
      <>
        The slot <Code>kind</Code>s this constrains. Kinds rather than slot names, so one contract
        covers every component whatever each calls its parts — the interactive element is{' '}
        <Code>root</Code> in Checkbox, <Code>input</Code> in InputText, <Code>trigger</Code> in
        Select.
      </>
    ),
  },
  {
    name: 'impliedByKind',
    type: 'boolean',
    required: true,
    what: (
      <>
        Whether having a targeted slot{' '}
        <Text as="em" size="sm">
          implies
        </Text>{' '}
        the capability. True where the kind and the capability are the same fact — a{' '}
        <Code>surface</Code> slot paints a ground, so it owns one. Then a component with the slot
        and no declaration fails, which is what catches the promises nobody wrote down.
      </>
    ),
  },
  {
    name: 'sourceCalls',
    type: 'string[]',
    required: false,
    what: (
      <>
        Identifiers the component&rsquo;s source must reference, e.g. <Code>useSurfaceFlip</Code>.
      </>
    ),
  },
  {
    name: 'attribute',
    type: 'string',
    required: false,
    what: (
      <>
        A <Code>data-*</Code> attribute the source must set.
      </>
    ),
  },
  {
    name: 'cssDeclaration',
    type: 'string',
    required: false,
    what: (
      <>
        A declaration the targeted slots&rsquo; rules must contain, e.g. <Code>:focus-visible</Code>
        .
      </>
    ),
  },
  {
    name: 'cssAlternative',
    type: 'string',
    required: false,
    what: (
      <>
        An equally valid answer elsewhere in the stylesheet — a field styling{' '}
        <Code>:focus-within</Code> on its wrapper needs no ring on the input itself.
      </>
    ),
  },
  {
    name: 'composedInherits',
    type: 'boolean',
    required: false,
    what: (
      <>
        Whether a slot that{' '}
        <Text as="em" size="sm">
          composes
        </Text>{' '}
        a Move component satisfies this by inheritance. A player&rsquo;s play button renders{' '}
        <Code>Button</Code>, so its ring and its disabled treatment are checked on Button.
      </>
    ),
  },
  {
    name: 'why',
    type: 'string',
    required: true,
    what: <>Shown when a component fails it. What went wrong before the contract existed.</>,
  },
];

export function CapabilityContractPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="capability">
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
                <RouterLink to="/contracts">Contracts</RouterLink>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Breadcrumb.Page>Capability contract</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Heading level={1}>Capability contract</Heading>
          <Text color="muted">
            One promise, written once, kept by every component it applies to. Defined as data in{' '}
            <Code>src/capabilities.ts</Code> and read by <Code>check:capabilities</Code>.
          </Text>
        </Stack>

        <Section id="fields" title="Fields">
          <Stack gap="md">
            <Text>
              A capability is checked both ways. A component claiming one has to keep it, and a
              component behaving like one has to say so — the second direction is the one that earns
              the check, because a promise nobody declared is invisible to a declaration-only gate.
            </Text>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Field</Table.Head>
                  <Table.Head>Type</Table.Head>
                  <Table.Head>Required</Table.Head>
                  <Table.Head>What it says</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {FIELDS.map((f) => (
                  <Table.Row key={f.name}>
                    <Table.Cell>
                      <Code>{f.name}</Code>
                    </Table.Cell>
                    <Table.Cell>
                      <Code>{f.type}</Code>
                    </Table.Cell>
                    <Table.Cell>{f.required ? 'yes' : '—'}</Table.Cell>
                    <Table.Cell>{f.what}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Stack>
        </Section>

        <Section id="escapes" title="Legitimate escapes">
          <Stack gap="md">
            <Text>
              Three ways a component satisfies a contract without the rule appearing in its own
              stylesheet. Each was found by a component that behaves correctly and was reported
              anyway.
            </Text>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Route</Table.Head>
                  <Table.Head>How it reads</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Composed component</Table.Cell>
                  <Table.Cell>
                    A capitalised <Code>element</Code> on the slot means it renders a Move
                    component, which carries the contract itself.
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>CSS Modules</Table.Cell>
                  <Table.Cell>
                    A rule using <Code>composes:</Code> inherits the composed class — ToggleButton
                    carries Button&rsquo;s focus ring this way.
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>The stated alternative</Table.Cell>
                  <Table.Cell>
                    Whatever <Code>cssAlternative</Code> names, e.g. a wrapper lighting up on{' '}
                    <Code>:focus-within</Code>.
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Text>
              Guards are stripped before matching. <Code>.root:hover:not(:disabled)</Code> contains
              the string <Code>:disabled</Code> while styling the <Text as="em">enabled</Text>{' '}
              state, and a contract satisfied by a negation of itself asserts nothing.
            </Text>
          </Stack>
        </Section>

        <Section id="test" title="When one earns its place">
          <Stack gap="md">
            <Text>
              A capability has to create enforcement where there was none. The question is not
              whether a component fails it today — a promise fifty-nine components keep by
              convention is exactly the kind that drifts, because nothing is holding it.
            </Text>
            <Text>
              It also needs more than one member. A contract written for a single component is that
              component&rsquo;s own concern: row striping was defined as a capability, Table was the
              only component that stripes, and it sat with zero declarations until it was removed.
            </Text>
            <Text>
              And it needs a spec to be declared in. Ten shared internals have none, so a capability
              cannot reach them — a CSS-level check can, which is why <Code>check:option-rows</Code>{' '}
              is one. See the{' '}
              <Link asChild>
                <RouterLink to="/systems/capabilities">capabilities and families</RouterLink>
              </Link>{' '}
              system page for how the pieces fit.
            </Text>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
