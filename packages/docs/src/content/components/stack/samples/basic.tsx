import type { ReactNode } from 'react';
import { Card, Stack, Text } from 'move';

const Tile = ({ children }: { children: ReactNode }) => (
  <Card.Root>
    <Card.Body>{children}</Card.Body>
  </Card.Root>
);

export default function BasicSample() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Vertical (default)</Text>
        <Stack gap="sm">
          <Tile>One</Tile>
          <Tile>Two</Tile>
          <Tile>Three</Tile>
        </Stack>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Horizontal</Text>
        <Stack direction="row" gap="sm">
          <Tile>One</Tile>
          <Tile>Two</Tile>
          <Tile>Three</Tile>
        </Stack>
      </Stack>
    </Stack>
  );
}
