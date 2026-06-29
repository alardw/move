import React from 'react';
import { Stack, Heading, Text, Card, Badge, Breadcrumb, Button, List, Icon, Grid, Avatar, Accordion, Table } from 'move';
import type { Color } from 'move';

const defaultLabels = {
  home: 'Home',
  users: 'Users',
  name: 'Alice Johnson',
  role: 'Senior Engineer',
  edit: 'Edit',
  detailsTitle: 'Details',
  status: 'Status',
  statusValue: 'Active',
  notesTitle: 'Notes',
  notesContent: 'Leads the frontend platform team. Primary contact for design system adoption. Joined from Google where she led the Material Design web components team.',
  settingsTitle: 'Settings',
  teamTitle: 'Team Access',
  integrationsTitle: 'Integrations',
  activityTitle: 'Activity Log',
};

type Labels = typeof defaultLabels;

type DetailRow = { label: string; value: React.ReactNode };

type TeamMember = { name: string; initials: string; color: Color; role: string; access: string };

// Integration point: sample data — replace with the real values.
const SAMPLE_TEAM: TeamMember[] = [
  { name: 'Alice Johnson', initials: 'AJ', color: 'indigo', role: 'Lead Engineer', access: 'owner' },
  { name: 'Bob Smith', initials: 'BS', color: 'teal', role: 'Designer', access: 'admin' },
  { name: 'Carol White', initials: 'CW', color: 'orange', role: 'PM', access: 'admin' },
  { name: 'David Brown', initials: 'DB', color: 'violet', role: 'Backend Dev', access: 'member' },
];

const ACCESS_COLOR: Record<string, Color> = { owner: 'indigo', admin: 'blue', member: 'green', viewer: 'gray' };

// Integration point: sample data — replace with the real values.
const SAMPLE_INTEGRATIONS = [
  { name: 'GitHub', description: 'Repository and CI/CD', status: 'connected', icon: 'git-branch' },
  { name: 'Slack', description: 'Team notifications', status: 'connected', icon: 'message-circle' },
  { name: 'Figma', description: 'Design handoff', status: 'connected', icon: 'pen-tool' },
  { name: 'Linear', description: 'Issue tracking', status: 'disconnected', icon: 'list-checks' },
];

// Integration point: sample data — replace with the real values.
const SAMPLE_ACTIVITY = [
  { user: 'Alice', initials: 'AJ', color: 'indigo', action: 'Updated profile settings', date: 'Mar 10, 2026', type: 'settings' },
  { user: 'Bob', initials: 'BS', color: 'teal', action: 'Added to Design System project', date: 'Mar 8, 2026', type: 'project' },
  { user: 'Carol', initials: 'CW', color: 'orange', action: 'Changed role to Senior Engineer', date: 'Mar 5, 2026', type: 'role' },
] as const;

const TYPE_COLOR: Record<string, Color> = { settings: 'gray', project: 'indigo', role: 'violet' };

export default function DetailBasic({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };

  const details: DetailRow[] = [
    { label: 'Email', value: 'alice@example.com' },
    { label: 'Phone', value: '+1 (555) 123-4567' },
    { label: 'Department', value: 'Engineering' },
    { label: 'Location', value: 'San Francisco, CA' },
    { label: 'Start Date', value: 'Jan 15, 2023' },
    { label: 'Manager', value: 'Sarah Chen' },
    { label: 'Team', value: <Badge variant="soft" size="sm" color="indigo">Design System</Badge> },
    { label: 'Access Level', value: <Badge variant="soft" size="sm" color="blue">Admin</Badge> },
    { label: 'Last Active', value: 'Today at 2:34 PM' },
    { label: 'Timezone', value: 'PST (UTC-8)' },
  ];

  return (
    <Stack gap="lg" padding="lg">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">{t.home}</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">{t.users}</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Page>{t.name}</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Stack direction="row" align="center" justify="between" wrap gap="md">
        <Stack direction="row" align="center" gap="md">
          <Avatar.Root size="lg" color="indigo">
            <Avatar.Fallback>AJ</Avatar.Fallback>
          </Avatar.Root>
          <Stack gap="xs">
            <Stack direction="row" align="center" gap="sm" wrap>
              <Heading level={1}>{t.name}</Heading>
              <Badge variant="dot" color="green">{t.statusValue}</Badge>
            </Stack>
            <Text color="muted">{t.role}</Text>
          </Stack>
        </Stack>
        <Button>
          <Icon name="pencil" size="sm" />
          {t.edit}
        </Button>
      </Stack>

      <Grid columns={3} gap="md" collapseBelow="768">
        <Grid.Cell span={2}>
          <Card.Root>
            <Card.Header>
              <Card.Title>{t.detailsTitle}</Card.Title>
            </Card.Header>
            <Card.Body>
              <List dividers>
                {details.map((row) => (
                  <List.Item key={row.label}>
                    <List.Content>
                      <List.Title>{row.label}</List.Title>
                    </List.Content>
                    <List.Trailing>
                      {row.value}
                    </List.Trailing>
                  </List.Item>
                ))}
              </List>
            </Card.Body>
          </Card.Root>
        </Grid.Cell>

        <Grid.Cell>
          <Card.Root>
            <Card.Header>
              <Card.Title>{t.notesTitle}</Card.Title>
            </Card.Header>
            <Card.Body>
              <Text size="sm" color="muted">{t.notesContent}</Text>
            </Card.Body>
          </Card.Root>
        </Grid.Cell>
      </Grid>

      <Card.Root>
        <Card.Header>
          <Card.Title>{t.settingsTitle}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Accordion.Root type="multiple" defaultValue={['team', 'integrations', 'activity']}>
            <Accordion.Item value="team">
              <Accordion.Trigger>
                <Stack direction="row" align="center" gap="sm">
                  <Icon name="users" size="sm" />
                  {t.teamTitle}
                  <Badge variant="solid" size="sm" color="indigo">{SAMPLE_TEAM.length}</Badge>
                </Stack>
              </Accordion.Trigger>
              <Accordion.Content>
                <List dividers>
                  {SAMPLE_TEAM.map((m) => (
                    <List.Item key={m.name}>
                      <List.Leading>
                        <Avatar.Root size="sm" color={m.color}>
                          <Avatar.Fallback>{m.initials}</Avatar.Fallback>
                        </Avatar.Root>
                      </List.Leading>
                      <List.Content>
                        <List.Title>{m.name}</List.Title>
                        <List.Description>{m.role}</List.Description>
                      </List.Content>
                      <List.Trailing>
                        <Badge variant="soft" size="sm" color={ACCESS_COLOR[m.access]}>
                          {m.access}
                        </Badge>
                      </List.Trailing>
                    </List.Item>
                  ))}
                </List>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value="integrations">
              <Accordion.Trigger>
                <Stack direction="row" align="center" gap="sm">
                  <Icon name="plug" size="sm" />
                  {t.integrationsTitle}
                  <Badge variant="solid" size="sm" color="green">
                    {SAMPLE_INTEGRATIONS.filter((i) => i.status === 'connected').length} active
                  </Badge>
                </Stack>
              </Accordion.Trigger>
              <Accordion.Content>
                <List dividers>
                  {SAMPLE_INTEGRATIONS.map((integration) => (
                    <List.Item key={integration.name}>
                      <List.Leading>
                        <Icon name={integration.icon} size="sm" />
                      </List.Leading>
                      <List.Content>
                        <List.Title>{integration.name}</List.Title>
                        <List.Description>{integration.description}</List.Description>
                      </List.Content>
                      <List.Trailing>
                        <Badge
                          variant="dot"
                          size="sm"
                          color={integration.status === 'connected' ? 'green' : 'gray'}
                        >
                          {integration.status}
                        </Badge>
                      </List.Trailing>
                    </List.Item>
                  ))}
                </List>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value="activity">
              <Accordion.Trigger>
                <Stack direction="row" align="center" gap="sm">
                  <Icon name="clock" size="sm" />
                  {t.activityTitle}
                </Stack>
              </Accordion.Trigger>
              <Accordion.Content>
                <Table hoverable>
                  <Table.Header>
                    <Table.Row>
                      <Table.Head>User</Table.Head>
                      <Table.Head>Action</Table.Head>
                      <Table.Head>Type</Table.Head>
                      <Table.Head>Date</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {SAMPLE_ACTIVITY.map((entry) => (
                      <Table.Row key={entry.action}>
                        <Table.Cell>
                          <Stack direction="row" align="center" gap="sm">
                            <Avatar.Root size="xs" color={entry.color}>
                              <Avatar.Fallback>{entry.initials}</Avatar.Fallback>
                            </Avatar.Root>
                            <Text weight="medium">{entry.user}</Text>
                          </Stack>
                        </Table.Cell>
                        <Table.Cell>{entry.action}</Table.Cell>
                        <Table.Cell>
                          <Badge variant="soft" size="sm" color={TYPE_COLOR[entry.type]}>
                            {entry.type}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Text color="muted">{entry.date}</Text>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}
