import { Button, Drawer } from 'move';
import { StagedOverlay } from '../../../components';

/** Card-only preview: the drawer staged open and inert. */
export default function DrawerPreview() {
  return (
    <StagedOverlay minHeight={280}>
      {({ root, content, portal }) => (
        <Drawer.Root {...root} animations={false}>
          <Drawer.Portal {...portal}>
            <Drawer.Overlay />
            <Drawer.Content {...content}>
              <Drawer.Header>
                <Drawer.Title>Filters</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Drawer.Description>
                  Tweak the filter criteria — changes apply immediately.
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
      )}
    </StagedOverlay>
  );
}
