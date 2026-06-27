import { Button, Dialog } from 'move';
import { StagedOverlay } from '../../../components';

/**
 * Card-only preview: the dialog staged open and inert. Not a page sample —
 * the interactive examples live in `samples/`.
 */
export default function DialogPreview() {
  return (
    <StagedOverlay>
      {({ root, content, portal }) => (
        <Dialog.Root {...root}>
          <Dialog.Portal {...portal}>
            <Dialog.Overlay />
            <Dialog.Content size="sm" {...content}>
              <Dialog.Header>
                <Dialog.Title>Publish changes</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Dialog.Description>
                  Push the last hour of edits live?
                </Dialog.Description>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.FooterEnd>
                  <Dialog.Close asChild>
                    <Button variant="ghost">Not yet</Button>
                  </Dialog.Close>
                  <Dialog.Close asChild>
                    <Button>Publish</Button>
                  </Dialog.Close>
                </Dialog.FooterEnd>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </StagedOverlay>
  );
}
