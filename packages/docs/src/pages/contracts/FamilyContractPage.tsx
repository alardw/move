import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Table, Link } from 'move';
import { Section, TocRail, type TocItem } from '../../components';

/**
 * The family contract — what joining a family commits a component to, and the
 * two tests a family has to pass to exist.
 */

const TOC: TocItem[] = [
  { href: '#family', label: 'Overview' },
  { href: '#fields', label: 'Fields' },
  { href: '#composition', label: 'Composition' },
  { href: '#test', label: 'When one earns its place' },
];

type Row = { name: string; type: string; what: React.ReactNode };

const FIELDS: Row[] = [
  {
    name: 'includes',
    type: 'string',
    what: (
      <>
        A family whose contract this one also keeps, walked before anything is asserted. The shared
        half is written once.
      </>
    ),
  },
  {
    name: 'capabilities',
    type: 'string[]',
    what: <>Capabilities every member declares.</>,
  },
  {
    name: 'choreography',
    type: 'string[]',
    what: (
      <>
        The permitted choreographies. A member declaring one outside the set fails — this is what
        makes &ldquo;do similar components animate the same&rdquo; something other than a question
        anyone has to ask.
      </>
    ),
  },
  { name: 'ariaPattern', type: 'string[]', what: <>The permitted ARIA patterns.</> },
  {
    name: 'slots',
    type: 'string[]',
    what: <>Slots every member owns, by name — the shared anatomy.</>,
  },
  {
    name: 'fields',
    type: 'Record<string, string>',
    what: (
      <>
        Scalar spec fields every member declares with this exact value, e.g.{' '}
        <Code>{`{ focus: 'trap' }`}</Code>.
      </>
    ),
  },
  { name: 'triggers', type: 'string[]', what: <>Animation triggers every member declares.</> },
  {
    name: 'composes',
    type: 'string[]',
    what: (
      <>
        Internal components every member builds from. Motion can be composed rather than declared —
        a player&rsquo;s settings menu animates because Popover does — so requiring the shared
        component is stronger than requiring a choreography name.
      </>
    ),
  },
  {
    name: 'propTriads',
    type: 'string[]',
    what: <>Controlled prop triads every member exposes, by base name.</>,
  },
  {
    name: 'behaviorBlocks',
    type: 'string[]',
    what: (
      <>
        <Code>behavior.&lt;name&gt;</Code> blocks every member declares.
      </>
    ),
  },
  {
    name: 'behaviorFlags',
    type: 'string[]',
    what: (
      <>
        Booleans every member states{' '}
        <Text as="em" size="sm">
          explicitly
        </Text>
        . Optional in the type, so nothing else forces them — and a flag nobody considered reads
        identically to one deliberately off.
      </>
    ),
  },
  { name: 'subComponents', type: 'string[]', what: <>Sub-components every member exports.</> },
  { name: 'why', type: 'string', what: <>Shown when a member breaks it.</> },
];

export function FamilyContractPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="family">
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
              <Breadcrumb.Page>Family contract</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Heading level={1}>Family contract</Heading>
          <Text color="muted">
            A named bundle of promises, joined by components that are the same kind of thing.
            Defined as data in <Code>src/families.ts</Code> and read by <Code>check:families</Code>.
          </Text>
        </Stack>

        <Section id="fields" title="Fields">
          <Stack gap="md">
            <Text>
              Every field is a promise the members keep. A component joins a family by naming it in{' '}
              <Code>families</Code>; everything below then applies to it.
            </Text>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Field</Table.Head>
                  <Table.Head>Type</Table.Head>
                  <Table.Head>What it requires</Table.Head>
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
                    <Table.Cell>{f.what}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Stack>
        </Section>

        <Section id="composition" title="Composition">
          <Stack gap="md">
            <Text>
              A list you choose from and a panel holding arbitrary content are different things —
              one navigates options, the other does not — but both hang off a trigger, dismiss the
              same four ways, and return focus where it came from. That shared half lives in{' '}
              <Code>anchored-popup</Code>, which <Code>popup-list</Code> and{' '}
              <Code>popup-content</Code> each include.
            </Text>
            <Text>
              Written into both instead, it would drift. The <Code>state</Code> axis that{' '}
              <Code>families</Code> used to carry restated a field that already existed, seventy-one
              times, and eleven copies had come to disagree with it.
            </Text>
            <Text>
              Membership counts through composition, so an abstract family with no direct members is
              not empty — its members arrive through the families that include it.
            </Text>
          </Stack>
        </Section>

        <Section id="test" title="When one earns its place">
          <Stack gap="md">
            <Text>
              A family bundles something, and has more than one member. One that guarantees nothing
              is a category — useful for grouping things in a menu, and not a contract. One with a
              single member is a component.
            </Text>
            <Text>
              It is not shared anatomy. An alert, a toast and an empty state all render an icon, a
              heading and some text, and they are not a family: a toast dismisses on a timer, an
              alert sits inline, an empty state is static. Looking alike is not being alike.
            </Text>
            <Text>
              And it is not one shared promise. A capability is a promise held by components that
              are otherwise unrelated — several things rove focus with arrow keys, and they are a
              disclosure, a date grid, a segmented control and a tab list. A family is the other
              shape: many promises at once, because the members are the same thing. See{' '}
              <Link asChild>
                <RouterLink to="/contracts/capability">the capability contract</RouterLink>
              </Link>{' '}
              for the other half.
            </Text>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
