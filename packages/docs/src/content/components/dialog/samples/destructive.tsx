import { Button, Dialog } from 'move';

/**
 * For destructive flows, lean on `variant="danger"` for the confirm action
 * and a small `size="sm"` Content — the user has one decision to make, so
 * give them less to scan.
 */
export default function DestructiveSample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="danger">Delete project</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content size="sm">
          <Dialog.Header>
            <Dialog.Title>Delete this project?</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>
              This removes the project, its files, its history, and the
              twenty-six unread comments nobody got around to reading. There is
              no undo, no trash bin, no support ticket that brings it back.
            </Dialog.Description>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.FooterEnd>
              <Dialog.Close asChild>
                <Button variant="ghost">Keep it</Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button variant="danger">Delete forever</Button>
              </Dialog.Close>
            </Dialog.FooterEnd>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
