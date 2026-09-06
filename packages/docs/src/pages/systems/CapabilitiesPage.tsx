import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Table, Link } from 'move';
import { Section, TocRail, type TocItem } from '../../components';

/**
 * Capabilities and families — how the library stays consistent with itself.
 */

const TOC: TocItem[] = [
  { href: '#promises', label: 'What is consistent' },
  { href: '#parts', label: 'How it is targeted' },
  { href: '#families', label: 'Families' },
];

const CAPABILITIES: { name: string; gives: string }[] = [
  {
    name: 'owns-surface',
    gives:
      'Anything nested inside picks the right colours for the ground it sits on, however deep it goes.',
  },
  {
    name: 'scrolls-content',
    gives:
      'Arrow keys reach whatever is out of sight, and the focus ring is the one from your theme.',
  },
  {
    name: 'stripes-rows',
    gives: 'Row stripes, hover and dividers read at the same strength on any background.',
  },
];

export function CapabilitiesPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch">
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
                <RouterLink to="/systems">Systems</RouterLink>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Breadcrumb.Page>Capabilities and families</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Heading level={1}>Capabilities and families</Heading>
          <Text color="muted">
            A scroll area scrolls the same in a dialog, a menu and a sidebar. Capabilities are how
            that stays true.
          </Text>
        </Stack>

        <Section id="promises" title="What is consistent">
          <Stack gap="md">
            <Text>
              A capability is one promise, kept by every component it applies to. Each is checked
              both ways: a component claiming one has to keep it, and a component behaving like one
              has to say so.
            </Text>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Capability</Table.Head>
                  <Table.Head>What you get</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {CAPABILITIES.map((c) => (
                  <Table.Row key={c.name}>
                    <Table.Cell>
                      <Code>{c.name}</Code>
                    </Table.Cell>
                    <Table.Cell>{c.gives}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Text>
              A capability has to be something a component could get wrong. If everything keeps it
              without trying, it is a description, and descriptions are left out.
            </Text>
          </Stack>
        </Section>

        <Section id="parts" title="How it is targeted">
          <Stack gap="md">
            <Text>
              Components name their parts differently — the interactive element is <Code>root</Code>{' '}
              in Checkbox, <Code>input</Code> in InputText, <Code>trigger</Code> in Select. So every
              part also declares what it <em>is</em>: a <Code>control</Code>, a <Code>surface</Code>,
              a <Code>scrollport</Code>, an <Code>item</Code>.
            </Text>
            <Text>
              Promises are written against that rather than against names, so one promise covers the
              library and a new component is covered the day it declares its parts. The full list is
              in the{' '}
              <Link asChild>
                <RouterLink to="/contracts/component">component contract</RouterLink>
              </Link>
              .
            </Text>
          </Stack>
        </Section>

        <Section id="families" title="Families">
          <Stack gap="md">
            <Text>
              Promises cluster. Anything you would call a form control is focusable, disableable,
              sized on the same scale and named by a label — four promises that arrive together. A
              family names such a cluster, so a component joins <Code>form-input</Code> instead of
              listing them one by one.
            </Text>
            <Text>
              The families are <Code>form-input</Code>, <Code>popup-anchored</Code>,{' '}
              <Code>modal-overlay</Code>, <Code>disclosure</Code>, <Code>navigation</Code> and{' '}
              <Code>layout</Code>. A family holds promises; one that holds none is not a family.
            </Text>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
