import { Button, Drawer, Stack, Text } from 'move';

/**
 * `modal={false}` keeps the drawer open without a backdrop or
 * focus-trap — useful when the rest of the page should stay
 * interactive (e.g. an inspector panel that updates as you click
 * around the canvas).
 */
export default function NonModalSample() {
  return (
    <Stack gap="md" align="start">
      <Drawer.Root modal={false}>
        <Drawer.Trigger asChild>
          <Button>Open inspector</Button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Content size="sm">
            <Drawer.Header>
              <Drawer.Title>Inspector</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Text>
                No backdrop, no scroll lock, no focus trap. The page behind stays clickable — close manually
                from the footer or by pressing Escape.
              </Text>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button>Close</Button>
              </Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </Stack>
  );
}
