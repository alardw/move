import React from 'react';
import { Stack, Heading, Text, Card, Badge, Breadcrumb, Button, Tabs, List, Timeline, Icon, Avatar, Table } from 'move';

const defaultLabels = {
  home: 'Home',
  projects: 'Projects',
  name: 'Website Redesign',
  status: 'In Progress',
  description: 'Complete redesign of the marketing website with new brand guidelines.',
  edit: 'Edit',
  details: 'Details',
  activity: 'Activity',
  related: 'Related',
};

type Labels = typeof defaultLabels;

type DetailRow = { label: string; value: React.ReactNode };

const ACTIVITY = [
  { user: 'Alice Johnson', initials: 'AJ', color: 'indigo', action: 'Design review completed', detail: 'Approved the final mockups', time: '2 hours ago', dotColor: 'blue' },
  { user: 'Bob Smith', initials: 'BS', color: 'teal', action: 'Development started', detail: 'Picked up the frontend task', time: '1 day ago', dotColor: 'green' },
  { user: 'Carol White', initials: 'CW', color: 'orange', action: 'Project created', detail: 'Created this project', time: '5 days ago', dotColor: 'gray' },
];

const RELATED = [
  { name: 'Brand Guidelines v2', type: 'Document', status: 'Final', color: 'indigo' },
  { name: 'Homepage Wireframes', type: 'Design', status: 'Approved', color: 'green' },
  { name: 'Content Migration', type: 'Task', status: 'In Progress', color: 'blue' },
];

export default function DetailWithTabs({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };

  const details: DetailRow[] = [
    { label: 'Owner', value: (
      <Stack direction="row" align="center" gap="sm">
        <Avatar.Root size="xs" color="indigo"><Avatar.Fallback>AJ</Avatar.Fallback></Avatar.Root>
        <Text>Alice Johnson</Text>
      </Stack>
    )},
    { label: 'Priority', value: <Badge variant="soft" size="sm" color="orange">High</Badge> },
    { label: 'Due Date', value: 'Mar 30, 2026' },
    { label: 'Created', value: 'Feb 1, 2026' },
    { label: 'Team', value: <Badge variant="soft" size="sm" color="indigo">Design System</Badge> },
    { label: 'Sprint', value: 'Sprint 14' },
    { label: 'Story Points', value: '8' },
  ];

  return (
    <Stack gap="lg" padding="lg">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">{t.home}</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">{t.projects}</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Page>{t.name}</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Stack direction="row" align="center" justify="between" wrap gap="md">
        <Stack gap="xs">
          <Stack direction="row" align="center" gap="sm" wrap>
            <Heading level={1} size="2xl">{t.name}</Heading>
            <Badge variant="soft" color="blue">{t.status}</Badge>
          </Stack>
          <Text color="muted">{t.description}</Text>
        </Stack>
        <Button>
          <Icon name="pencil" size="sm" />
          {t.edit}
        </Button>
      </Stack>

      <Tabs.Root defaultValue="details">
        <Tabs.List>
          <Tabs.Trigger value="details">{t.details}</Tabs.Trigger>
          <Tabs.Trigger value="activity">{t.activity}</Tabs.Trigger>
          <Tabs.Trigger value="related">{t.related}</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="details">
          <Card.Root>
            <Card.Body>
              <List dividers>
                {details.map((row) => (
                  <List.Item key={row.label}>
                    <List.Content>
                      <List.Title>{row.label}</List.Title>
                    </List.Content>
                    <List.Meta title={row.value} />
                  </List.Item>
                ))}
              </List>
            </Card.Body>
          </Card.Root>
        </Tabs.Content>

        <Tabs.Content value="activity">
          <Card.Root>
            <Card.Body>
              <Timeline>
                {ACTIVITY.map((entry) => (
                  <Timeline.Item key={entry.action} color={entry.dotColor}>
                    <Stack direction="row" align="center" gap="sm">
                      <Avatar.Root size="xs" color={entry.color}>
                        <Avatar.Fallback>{entry.initials}</Avatar.Fallback>
                      </Avatar.Root>
                      <Stack gap="xs">
                        <Text weight="medium">{entry.action}</Text>
                        <Text size="xs" color="muted">{entry.user} — {entry.detail} — {entry.time}</Text>
                      </Stack>
                    </Stack>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card.Body>
          </Card.Root>
        </Tabs.Content>

        <Tabs.Content value="related">
          <Card.Root>
            <Card.Body>
              <Table hoverable>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Name</Table.Head>
                    <Table.Head>Type</Table.Head>
                    <Table.Head>Status</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {RELATED.map((item) => (
                    <Table.Row key={item.name}>
                      <Table.Cell>
                        <Text weight="medium">{item.name}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text color="muted">{item.type}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant="dot" size="sm" color={item.color}>{item.status}</Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Card.Body>
          </Card.Root>
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
}
