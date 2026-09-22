import { Alert, Button, Dialog } from 'move';

/**
 * A dialog that only has something to say.
 *
 * No footer, because there is nothing to decide — the close button in the header
 * is the whole of it. The body closes the box in that case, and takes the bottom
 * gutter the footer would otherwise have carried, so the panel keeps the same
 * margin on all three sides.
 */
export default function MessageSample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="secondary">Open link</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Unconditionally</Dialog.Title>
            <Dialog.Description>That link has expired</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <Alert variant="warning" title="That link has expired">
              It has either been used already or it timed out. Ask a colleague to send a new one.
            </Alert>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
