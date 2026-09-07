import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Table, Link } from 'move';
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

type Cap = { name: string; parts: string; gives: string; checks: string };

const CAPABILITIES: Cap[] = [
  {
    name: 'owns-surface',
    checks: 'capabilities',
    parts: 'surface',
    gives: 'Anything nested inside picks the right colours for the ground it sits on.',
  },
  {
    name: 'scrolls-content',
    checks: 'capabilities, focus-ring-room',
    parts: 'scrollport',
    gives: 'Arrow keys reach what is out of sight, and the focus ring is the one from your theme.',
  },
  {
    name: 'takes-disabled',
    checks: 'capabilities',
    parts: 'control, label',
    gives: 'A disabled control looks disabled and stops responding, the same way everywhere.',
  },
  {
    name: 'has-label',
    checks: 'capabilities, type-scale, rendered-label, aria-label-name',
    parts: 'label',
    gives: 'Every control is named the same way, and its label sits on the same step of the type scale.',
  },
  {
    name: 'takes-focus',
    checks: 'capabilities, focus-ring-room',
    parts: 'control, scrollport',
    gives: 'One focus ring, from your theme, on everything a keyboard can reach.',
  },
];

const FAMILIES: { name: string; bundles: string; members: string }[] = [
  {
    name: 'overlay-panel',
    bundles: 'owns-surface, scrolls-content',
    members: 'Dialog, Drawer',
  },
  {
    name: 'anchored-popup',
    bundles: 'the shared core the two below include',
    members: '— (joined through popup-list or popup-content)',
  },
  {
    name: 'popup-list',
    bundles: 'anchored-popup + scrolls-content',
    members: 'Select, Autocomplete, Dropdown, TimeField',
  },
  {
    name: 'popup-content',
    bundles: 'anchored-popup',
    members: 'Popover, Tooltip, ColorInput, DatePicker',
  },
  {
    name: 'text-entry',
    bundles: 'delegated focus, a form value, one size/variant/width vocabulary',
    members: 'InputText, Textarea, Password, NumberInput, PinInput',
  },
  {
    name: 'binary-control',
    bundles: 'toggle keyboard, focus on the control itself, a checked state',
    members: 'Checkbox, Switch, ToggleButton',
  },
  {
    name: 'disclosure',
    bundles: 'the disclosure choreography and ARIA pattern',
    members: 'Accordion, Collapsible',
  },
  {
    name: 'media-player',
    bundles: 'the same transport, built from the same controls',
    members: 'AudioPlayer, VideoPlayer',
  },
];

const SAMPLE = `// Dialog.spec.ts
families: ['overlay-panel'],
ariaPattern: ['dialog'],
capabilities: ['owns-surface', 'scrolls-content'],
controlled: 'open',`;

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
              has to say so — the second is what catches the promise nobody wrote down. All five are enforced in both directions. A contract is rarely held by one gate, so each names every check that holds part of it — and the registry validates that those checks exist.
            </Text>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Capability</Table.Head>
                  <Table.Head>Applies to</Table.Head>
                  <Table.Head>What you get</Table.Head>
                  <Table.Head>Held by</Table.Head>
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
                      <Code>{c.checks}</Code>
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
              part also declares what it <Text as="em">is</Text>: <Code>control</Code>, <Code>label</Code>,{' '}
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
              A capability is one promise shared by components that are otherwise unrelated — Code,
              Textarea, ScrollArea and Dialog all scroll, and nobody would call them a family. A
              family is the other shape: components that ARE the same kind of thing, and so agree on
              many things at once. Dialog and Drawer match on keyboard, focus, controlled state,
              dismissal, ARIA and capabilities.
            </Text>
            <Text>
              Families compose. A list you choose from and a panel holding arbitrary content are
              different — one navigates options, the other does not — but both hang off a trigger and
              both dismiss the same way. That shared half is written once, in the family they both
              include.
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
              A family holds promises, and has more than one member; one that holds none is a
              category, and one with a single member is a component. Grouping the layout primitives
              or the navigation components reads well in a menu and guarantees nothing, so neither
              is a family here.
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
