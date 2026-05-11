import { Badge, Button, Card, Stack, Text } from 'move';

/**
 * `FooterStart` and `FooterEnd` split the footer into a left/right
 * layout — metadata or a status pill on one side, action buttons on
 * the other, no inline `marginLeft: 'auto'` required.
 */
export default function FooterSplitSample() {
  return (
    <Stack gap="md">
      <Card.Root>
        <Card.Header>
          <Card.Title>Marketing site</Card.Title>
          <Card.Description>Last deploy 3 minutes ago by alex@acme.co</Card.Description>
        </Card.Header>
        <Card.Body>
          <Text size="sm" color="muted">
            Production traffic has stayed within p99 budgets since the rollout. No anomalies in error rates.
          </Text>
        </Card.Body>
        <Card.Footer>
          <Card.FooterStart>
            <Badge variant="soft" color="success">Active</Badge>
          </Card.FooterStart>
          <Card.FooterEnd>
            <Button variant="ghost">Rollback</Button>
            <Button>Open</Button>
          </Card.FooterEnd>
        </Card.Footer>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Title>Analytics ETL</Card.Title>
          <Card.Description>Job has been retrying for 2 hours.</Card.Description>
        </Card.Header>
        <Card.Footer>
          <Card.FooterStart>
            <Badge variant="dot" color="danger">Failing</Badge>
          </Card.FooterStart>
          <Card.FooterEnd>
            <Button variant="ghost">View logs</Button>
            <Button variant="danger">Page on-call</Button>
          </Card.FooterEnd>
        </Card.Footer>
      </Card.Root>
    </Stack>
  );
}
