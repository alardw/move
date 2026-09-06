import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Table, Badge, Link } from 'move';
import { Section, TocRail, type TocItem } from '../../components';

/**
 * Capabilities and families — how the library stays consistent with itself.
 */

const TOC: TocItem[] = [
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#parts', label: 'How they are targeted' },
  { href: '#families', label: 'Families' },
  { href: '#declaring', label: 'Declaring them' },
];

type Cap = { name: string; parts: string; gives: string; live: boolean };

const CAPABILITIES: Cap[] = [
  {
    name: 'takes-size',
    parts: 'control',
    gives: 'sm is the same height on a button, a select and a text field, so a form row lines up.',
    live: false,
  },
  {
    name: 'takes-focus',
    parts: 'control, item, scrollport',
    gives: 'One focus ring, from your theme, on everything a keyboard can reach.',
    live: false,
  },
  {
    name: 'takes-disabled',
    parts: 'control, label',
    gives: 'A disabled control looks disabled and stops responding, the same way everywhere.',
    live: false,
  },
  {
    name: 'has-label',
    parts: 'label',
    gives: 'Every control is named the same way, so screen readers announce them consistently.',
    live: false,
  },
  {
    name: 'has-popup',
    parts: 'surface, trigger',
    gives: 'Popups open, position, close on Escape and hand focus back to the trigger alike.',
    live: false,
  },
  {
    name: 'groups-items',
    parts: 'group',
    gives: 'A set announces itself as a set, with a name and a count.',
    live: false,
  },
  {
    name: 'owns-surface',
    parts: 'surface',
    gives: 'Anything nested inside picks the right colours for the ground it sits on.',
    live: true,
  },
  {
    name: 'scrolls-content',
    parts: 'scrollport',
    gives: 'Arrow keys reach what is out of sight, and the focus ring is yours.',
    live: true,
  },
  {
    name: 'stripes-rows',
    parts: 'item, separator',
    gives: 'Stripes, hover and dividers read at the same strength on any background.',
    live: true,
  },
];

const FAMILIES: { name: string; bundles: string; members: string }[] = [
  {
    name: 'form-input',
    bundles: 'takes-size, takes-focus, takes-disabled, has-label',
    members: 'InputText, Select, Checkbox, Switch, RadioGroup, and 12 more',
  },
  {
    name: 'popup-anchored',
    bundles: 'has-popup, owns-surface, scrolls-content, takes-focus',
    members: 'Select, Dropdown, Popover, Tooltip, Autocomplete, DatePicker',
  },
  {
    name: 'modal-overlay',
    bundles: 'has-popup, owns-surface, takes-focus',
    members: 'Dialog, Drawer',
  },
  {
    name: 'disclosure',
    bundles: 'owns-surface',
    members: 'Accordion, Collapsible',
  },
  {
    name: 'navigation',
    bundles: 'takes-focus, groups-items',
    members: 'Tabs, Sidebar, Breadcrumb, Pagination, TableOfContents',
  },
  {
    name: 'layout',
    bundles: '—',
    members: 'Stack, Grid, Card, Splitter, ScrollArea',
  },
];

const SAMPLE = `// Dialog.spec.ts
families: {
  behavior: ['modal-overlay'],
  state: ['controlled-open'],
  a11y: ['dialog'],
},
capabilities: ['owns-surface', 'scrolls-content'],`;

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

        <Section id="capabilities" title="Capabilities">
          <Stack gap="md">
            <Text>
              A capability is one promise, kept by every component it applies to. Each is checked
              both ways: a component claiming one has to keep it, and a component behaving like one
              has to say so. Three are enforced today; the rest are agreed and not yet wired.
            </Text>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Capability</Table.Head>
                  <Table.Head>Applies to</Table.Head>
                  <Table.Head>What you get</Table.Head>
                  <Table.Head>Checked</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {CAPABILITIES.map((c) => (
                  <Table.Row key={c.name}>
                    <Table.Cell>
                      <Code>{c.name}</Code>
                    </Table.Cell>
                    <Table.Cell>
                      <Code>{c.parts}</Code>
                    </Table.Cell>
                    <Table.Cell>{c.gives}</Table.Cell>
                    <Table.Cell>
                      <Badge color={c.live ? 'green' : 'gray'}>{c.live ? 'yes' : 'planned'}</Badge>
                    </Table.Cell>
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

        <Section id="parts" title="How they are targeted">
          <Stack gap="md">
            <Text>
              Components name their parts differently — the interactive element is <Code>root</Code>{' '}
              in Checkbox, <Code>input</Code> in InputText, <Code>trigger</Code> in Select. So every
              part also declares what it <em>is</em>: <Code>control</Code>, <Code>label</Code>,{' '}
              <Code>item</Code>, <Code>group</Code>, <Code>trigger</Code>, <Code>surface</Code>,{' '}
              <Code>scrollport</Code>, <Code>overlay</Code>, <Code>separator</Code>,{' '}
              <Code>indicator</Code>, <Code>icon</Code>, or <Code>none</Code>.
            </Text>
            <Text>
              Promises are written against that rather than against names, so one promise covers the
              library and a new component is covered the day it declares its parts.
            </Text>
          </Stack>
        </Section>

        <Section id="families" title="Families">
          <Stack gap="md">
            <Text>
              Promises cluster. Anything you would call a form control is sized on the same scale,
              focusable, disableable and named by a label — four that arrive together. A family
              names the cluster, so a component joins it instead of listing them.
            </Text>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Family</Table.Head>
                  <Table.Head>Bundles</Table.Head>
                  <Table.Head>Members</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {FAMILIES.map((f) => (
                  <Table.Row key={f.name}>
                    <Table.Cell>
                      <Code>{f.name}</Code>
                    </Table.Cell>
                    <Table.Cell>
                      <Code>{f.bundles}</Code>
                    </Table.Cell>
                    <Table.Cell>{f.members}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Text>
              A family holds promises; one that holds none is not a family. <Code>layout</Code> is
              the open case — its members share a real idea (they express constraints, never a size
              of their own) that has not been written as a capability yet.
            </Text>
          </Stack>
        </Section>

        <Section id="declaring" title="Declaring them">
          <Stack gap="md">
            <Text>
              A component states its family memberships and any capability it has beyond them. Two
              more axes sit alongside: <Code>state</Code> says how it is controlled, and{' '}
              <Code>a11y</Code> names the ARIA pattern it follows.
            </Text>
            <Code block language="ts">
              {SAMPLE}
            </Code>
            <Text>
              Field by field, this is in the{' '}
              <Link asChild>
                <RouterLink to="/contracts/component">component contract</RouterLink>
              </Link>
              .
            </Text>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
