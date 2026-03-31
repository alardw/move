import { useState } from 'react';
import { Drawer, Button, Stack } from 'move';

export default function DrawerSizes() {
  const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | null>(null);

  return (
    <>
      <Stack direction="row" gap="sm">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
          <Button key={s} variant="secondary" onClick={() => setSize(s)}>
            {s}
          </Button>
        ))}
      </Stack>
      {size && (
        <Drawer.Root open onOpenChange={() => setSize(null)}>
          <Drawer.Portal>
            <Drawer.Overlay />
            <Drawer.Content size={size}>
              <Drawer.Header>
                <Drawer.Title>Size: {size}</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <p>This drawer uses the {size} size preset.</p>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </>
  );
}
