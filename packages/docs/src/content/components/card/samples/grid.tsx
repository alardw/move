import { Badge, Button, Card, Stack, Text } from 'move';

/**
 * Cards drop happily into a CSS grid — `maxWidth` keeps each column
 * from outgrowing readable line-length, and `variant="elevated"`
 * adds a soft drop shadow that reads like a tile.
 */
const projects = [
  { name: 'Marketing site', status: 'Active', color: 'success' as const, desc: 'Static, edge-cached, deploy on every merge to main.' },
  { name: 'Customer portal', status: 'Beta', color: 'info' as const, desc: 'Self-serve plan changes, billing history, support tickets.' },
  { name: 'Analytics ETL', status: 'Failing', color: 'danger' as const, desc: 'Pipes events into the warehouse for the dashboards team.' },
  { name: 'Legacy admin', status: 'Maintenance', color: 'warning' as const, desc: 'Read-only until the v3 rewrite ships next quarter.' },
];

export default function GridSample() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))', gap: 'var(--move-spacing-md)' }}>
      {projects.map((p) => (
        <Card.Root key={p.name} variant="elevated">
          <Card.Header>
            <Stack direction="row" gap="sm" align="center">
              <Card.Title>{p.name}</Card.Title>
              <Badge variant="soft" color={p.color}>{p.status}</Badge>
            </Stack>
          </Card.Header>
          <Card.Body>
            <Text size="sm" color="muted">{p.desc}</Text>
          </Card.Body>
          <Card.Footer>
            <Card.FooterEnd>
              <Button variant="ghost" size="sm">Open</Button>
            </Card.FooterEnd>
          </Card.Footer>
        </Card.Root>
      ))}
    </div>
  );
}
