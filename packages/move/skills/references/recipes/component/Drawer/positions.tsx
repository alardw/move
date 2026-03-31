import { useState } from 'react';
import { Drawer, Button, Stack } from 'move';

export default function DrawerPositions() {
  const [position, setPosition] = useState<'left' | 'right' | 'top' | 'bottom' | null>(null);

  return (
    <>
      <Stack direction="row" gap="sm">
        {(['left', 'right', 'top', 'bottom'] as const).map((pos) => (
          <Button key={pos} variant="secondary" onClick={() => setPosition(pos)}>
            {pos}
          </Button>
        ))}
      </Stack>
      {position && (
        <Drawer.Root open onOpenChange={() => setPosition(null)} position={position} responsive={false}>
          <Drawer.Portal>
            <Drawer.Overlay />
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Position: {position}</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <p>This drawer slides in from the {position}.</p>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </>
  );
}
