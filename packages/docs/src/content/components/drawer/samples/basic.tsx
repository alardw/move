import { Button, Drawer } from 'move';

export default function BasicSample() {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button>Open drawer</Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Filters</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Drawer.Description>
              Tweak the filter criteria here. Changes apply immediately to the underlying list, so you can keep
              the drawer open while you iterate.
            </Drawer.Description>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close asChild>
              <Button variant="ghost">Reset</Button>
            </Drawer.Close>
            <Drawer.Close asChild>
              <Button>Apply</Button>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
