import { Button, Drawer, Stack, Text } from 'move';

const positions = ['left', 'right', 'top', 'bottom'] as const;

export default function PositionsSample() {
  return (
    <Stack direction="row" gap="sm" wrap>
      {positions.map((position) => (
        <Drawer.Root key={position} position={position}>
          <Drawer.Trigger asChild>
            <Button variant="secondary" size="sm">From {position}</Button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay />
            <Drawer.Content size="md">
              <Drawer.Header>
                <Drawer.Title>position="{position}"</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Text>The drawer slides in from the {position} edge.</Text>
              </Drawer.Body>
              <Drawer.Footer>
                <Drawer.Close asChild>
                  <Button>Close</Button>
                </Drawer.Close>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      ))}
    </Stack>
  );
}
