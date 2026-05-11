import { useState } from 'react';
import { Alert, Button, Stack } from 'move';

/**
 * `closable` adds a close button that runs the exit animation, then
 * unmounts and fires `onClose`. The order matters — the SR announcement
 * gets to finish, the layout doesn’t snap shut.
 */
export default function DismissibleSample() {
  const [shown, setShown] = useState(true);

  return (
    <Stack gap="md" align="start">
      {shown && (
        <Alert
          variant="success"
          title="Saved"
          closable
          onClose={() => setShown(false)}
        >
          Your changes are live. You can dismiss this banner — it won’t come back
          until something else changes.
        </Alert>
      )}
      {!shown && (
        <Button variant="secondary" size="sm" onClick={() => setShown(true)}>
          Bring it back
        </Button>
      )}
    </Stack>
  );
}
