import { useState } from 'react';
import { Button, Dialog, Stack, Text } from 'move';

/**
 * Pass `open` and `onOpenChange` to drive the dialog from your own state.
 * Useful when something other than a Trigger button needs to open it — a
 * server response, a keyboard shortcut, a row click in a table.
 */
export default function ControlledSample() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <Stack gap="sm" align="start">
      <Stack direction="row" gap="sm" align="center">
        <Button onClick={() => setOpen(true)}>Open from state</Button>
        <Text size="sm" color="muted">opened {count} {count === 1 ? 'time' : 'times'}</Text>
      </Stack>
      <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) setCount((n) => n + 1);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Controlled open</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Dialog.Description>
                The trigger lives outside the dialog. Open state is held in a parent
                `useState`, so anything in the page can toggle it — buttons, hotkeys,
                background events, the lot.
              </Dialog.Description>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.FooterEnd>
                <Button onClick={() => setOpen(false)}>Got it</Button>
              </Dialog.FooterEnd>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Stack>
  );
}
