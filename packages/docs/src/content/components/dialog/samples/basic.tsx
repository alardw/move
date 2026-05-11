import { Button, Dialog } from 'move';

export default function BasicSample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Publish changes</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>
              You’re about to push the last hour of edits live. Anyone visiting the
              site after this will see the new version — including the typo on the
              pricing page that you keep promising you’ll fix.
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
  );
}
