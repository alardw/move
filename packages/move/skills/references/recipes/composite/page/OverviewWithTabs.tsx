import { Stack, Grid, Card, Heading, Text, Tabs, Icon } from 'move';

const defaultLabels = {
  title: 'Dashboard',
  overview: 'Overview',
  analytics: 'Analytics',
  reports: 'Reports',
  totalRevenue: 'Total Revenue',
  totalRevenueValue: '$45,231.89',
  subscriptions: 'Subscriptions',
  subscriptionsValue: '2,350',
  sales: 'Sales',
  salesValue: '12,234',
  activeNow: 'Active Now',
  activeNowValue: '573',
  analyticsPlaceholder: 'Charts and analytics content',
  reportsPlaceholder: 'Reports and exports content',
};

type Labels = typeof defaultLabels;

type StatCard = { label: string; value: string; icon: string };

export default function OverviewWithTabs({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };

  const stats: StatCard[] = [
    { label: t.totalRevenue, value: t.totalRevenueValue, icon: 'dollar-sign' },
    { label: t.subscriptions, value: t.subscriptionsValue, icon: 'users' },
    { label: t.sales, value: t.salesValue, icon: 'credit-card' },
    { label: t.activeNow, value: t.activeNowValue, icon: 'activity' },
  ];

  return (
    <Stack gap="lg" padding="lg">
      <Heading level={1} size="2xl">{t.title}</Heading>

      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Trigger value="overview">{t.overview}</Tabs.Trigger>
          <Tabs.Trigger value="analytics">{t.analytics}</Tabs.Trigger>
          <Tabs.Trigger value="reports">{t.reports}</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview">
          <Stack gap="md">
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
                    </Stack>
                  </Card.Body>
                </Card.Root>
              ))}
            </Grid>

            <Grid columns={2} gap="md" collapseBelow={640}>
              <Card.Root>
                <Card.Header>
                  <Card.Title>Revenue</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Stack align="center" justify="center" padding="xl">
                    <Text color="muted">Chart placeholder</Text>
                  </Stack>
                </Card.Body>
              </Card.Root>
              <Card.Root>
                <Card.Header>
                  <Card.Title>Recent Sales</Card.Title>
                  <Card.Description>265 sales this month</Card.Description>
                </Card.Header>
                <Card.Body>
                  <Stack align="center" justify="center" padding="xl">
                    <Text color="muted">Sales list placeholder</Text>
                  </Stack>
                </Card.Body>
              </Card.Root>
            </Grid>
          </Stack>
        </Tabs.Content>

        <Tabs.Content value="analytics">
          <Card.Root>
            <Card.Body>
              <Stack align="center" justify="center" padding="xl">
                <Text color="muted">{t.analyticsPlaceholder}</Text>
              </Stack>
            </Card.Body>
          </Card.Root>
        </Tabs.Content>

        <Tabs.Content value="reports">
          <Card.Root>
            <Card.Body>
              <Stack align="center" justify="center" padding="xl">
                <Text color="muted">{t.reportsPlaceholder}</Text>
              </Stack>
            </Card.Body>
          </Card.Root>
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
}
