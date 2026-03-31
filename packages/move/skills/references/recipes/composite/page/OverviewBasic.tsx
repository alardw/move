import { Stack, Grid, Card, Heading, Text, Badge, Button, Icon, Avatar, List, Table } from 'move';

const defaultLabels = {
  title: 'Overview',
  totalRevenue: 'Total Revenue',
  totalRevenueValue: '$45,231.89',
  totalRevenueChange: '+20.1% from last month',
  activeUsers: 'Active Users',
  activeUsersValue: '2,350',
  activeUsersChange: '+180 since last hour',
  newOrders: 'New Orders',
  newOrdersValue: '12,234',
  newOrdersChange: '+19% from last month',
  conversionRate: 'Conversion Rate',
  conversionRateValue: '3.2%',
  conversionRateChange: '+0.4% from last month',
  recentActivity: 'Recent Activity',
  topPerformers: 'Top Performers',
  viewAll: 'View all',
};

type Labels = typeof defaultLabels;

type StatCard = {
  label: string;
  value: string;
  change: string;
  icon: string;
  trend: 'up' | 'down';
  color: string;
};

const activities = [
  { user: 'Alice Johnson', initials: 'AJ', color: 'indigo', action: 'Placed order #1234', detail: 'Acme Corp — $4,200', time: '2 min ago', type: 'order' },
  { user: 'Bob Smith', initials: 'BS', color: 'teal', action: 'Updated profile settings', detail: 'Changed notification preferences', time: '5 min ago', type: 'settings' },
  { user: 'Carol White', initials: 'CW', color: 'orange', action: 'Submitted support ticket', detail: 'Billing inquiry — #T-892', time: '12 min ago', type: 'support' },
  { user: 'David Brown', initials: 'DB', color: 'violet', action: 'Completed onboarding', detail: 'New team member — Engineering', time: '25 min ago', type: 'onboarding' },
  { user: 'Eve Davis', initials: 'ED', color: 'pink', action: 'Placed order #1230', detail: 'TechStart BV — $1,800', time: '1 hour ago', type: 'order' },
];

const TYPE_COLOR: Record<string, string> = { order: 'indigo', settings: 'gray', support: 'orange', onboarding: 'green' };

const performers = [
  { name: 'Alice Johnson', initials: 'AJ', color: 'indigo', role: 'Sales Lead', metric: '$12,400', metricLabel: 'Revenue' },
  { name: 'Frank Miller', initials: 'FM', color: 'cyan', role: 'Account Exec', metric: '$9,800', metricLabel: 'Revenue' },
  { name: 'Grace Lee', initials: 'GL', color: 'green', role: 'Sales Rep', metric: '$8,200', metricLabel: 'Revenue' },
  { name: 'Bob Smith', initials: 'BS', color: 'teal', role: 'Sales Rep', metric: '$7,500', metricLabel: 'Revenue' },
];

export default function OverviewBasic({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };

  const stats: StatCard[] = [
    { label: t.totalRevenue, value: t.totalRevenueValue, change: t.totalRevenueChange, icon: 'dollar-sign', trend: 'up', color: 'green' },
    { label: t.activeUsers, value: t.activeUsersValue, change: t.activeUsersChange, icon: 'users', trend: 'up', color: 'blue' },
    { label: t.newOrders, value: t.newOrdersValue, change: t.newOrdersChange, icon: 'shopping-cart', trend: 'up', color: 'indigo' },
    { label: t.conversionRate, value: t.conversionRateValue, change: t.conversionRateChange, icon: 'trending-up', trend: 'up', color: 'violet' },
  ];

  return (
    <Stack gap="lg" padding="lg">
      <Heading level={1} size="2xl">{t.title}</Heading>

      <Grid columns={4} gap="md" collapseBelow={640}>
        {stats.map((stat) => (
          <Card.Root key={stat.label}>
            <Card.Body>
              <Stack gap="sm">
                <Stack direction="row" align="center" justify="between">
                  <Text size="sm" color="muted">{stat.label}</Text>
                  <Icon name={stat.icon} size="sm" color="muted" />
                </Stack>
                <Heading level={3} size="2xl">{stat.value}</Heading>
                <Badge variant="soft" size="sm" color={stat.color}>{stat.change}</Badge>
              </Stack>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      <Grid columns={3} gap="lg" collapseBelow={768}>
        <Grid.Cell span={2}>
          <Card.Root>
            <Card.Header>
              <Stack direction="row" align="center" justify="between">
                <Card.Title>{t.recentActivity}</Card.Title>
                <Button variant="ghost" size="sm">{t.viewAll}</Button>
              </Stack>
            </Card.Header>
            <Card.Body>
              <Table hoverable>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>User</Table.Head>
                    <Table.Head>Action</Table.Head>
                    <Table.Head>Type</Table.Head>
                    <Table.Head>Time</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {activities.map((a, i) => (
                    <Table.Row key={i}>
                      <Table.Cell>
                        <Stack direction="row" align="center" gap="sm">
                          <Avatar.Root size="xs" color={a.color}>
                            <Avatar.Fallback>{a.initials}</Avatar.Fallback>
                          </Avatar.Root>
                          <Text weight="medium">{a.user}</Text>
                        </Stack>
                      </Table.Cell>
                      <Table.Cell>
                        <Stack gap="none">
                          <Text>{a.action}</Text>
                          <Text size="xs" color="muted">{a.detail}</Text>
                        </Stack>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant="soft" size="sm" color={TYPE_COLOR[a.type]}>{a.type}</Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text color="muted">{a.time}</Text>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Card.Body>
          </Card.Root>
        </Grid.Cell>

        <Card.Root>
          <Card.Header>
            <Card.Title>{t.topPerformers}</Card.Title>
          </Card.Header>
          <Card.Body>
            <List dividers>
              {performers.map((p) => (
                <List.Item key={p.name}>
                  <List.Leading>
                    <Avatar.Root size="sm" color={p.color}>
                      <Avatar.Fallback>{p.initials}</Avatar.Fallback>
                    </Avatar.Root>
                  </List.Leading>
                  <List.Content>
                    <List.Title>{p.name}</List.Title>
                    <List.Description>{p.role}</List.Description>
                  </List.Content>
                  <List.Meta title={p.metric} description={p.metricLabel} />
                </List.Item>
              ))}
            </List>
          </Card.Body>
        </Card.Root>
      </Grid>
    </Stack>
  );
}
