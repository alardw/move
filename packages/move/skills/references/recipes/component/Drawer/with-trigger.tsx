import { Drawer, Button } from 'move';

export default function DrawerWithTrigger() {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button>Open with Trigger</Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Uncontrolled Drawer</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p>This drawer uses the built-in Trigger for uncontrolled open/close.</p>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
