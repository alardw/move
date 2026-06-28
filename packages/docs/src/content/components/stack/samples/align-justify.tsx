import type { ReactNode } from 'react';
import { Card, Stack, Text } from 'move';

const Tile = ({ children, tall }: { children: ReactNode; tall?: boolean }) => (
  <Card.Root>
    <Stack padding={tall ? 'xl' : 'sm'}>{children}</Stack>
  </Card.Root>
);

export default function AlignJustifySample() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" weight="medium">justify="between"</Text>
        <Card.Root>
          <Stack direction="row" gap="sm" justify="between" padding="sm">
            <Tile>Start</Tile>
            <Tile>End</Tile>
          </Stack>
        </Card.Root>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">align="center" + justify="around"</Text>
        <Card.Root>
          <Stack direction="row" gap="sm" align="center" justify="around" padding="sm">
            <Tile>1</Tile>
            <Tile tall>2 (tall)</Tile>
            <Tile>3</Tile>
          </Stack>
        </Card.Root>
      </Stack>
    </Stack>
  );
}
