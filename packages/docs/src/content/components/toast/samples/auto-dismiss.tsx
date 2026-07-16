import { Alert, Button, Stack, Toast, toast } from 'move';

export default function AutoDismissSample() {
  return (
    <Stack gap="md">
      <Alert variant="warning" title="Auto-dismiss forfeits WCAG 2.2.3 (No Timing)">
        A timed dismissal puts a clock on reading the message. Move keeps it within 2.2.1 Timing
        Adjustable (Level A) by pausing on hover and focus — but manual close (the default) is the
        safer choice for anything the user must not miss. Reserve a duration for low-stakes,
        repeatable confirmations.
      </Alert>

      <Stack direction="row" gap="sm" wrap>
        <Button onClick={() => toast.success('Saved — this toast clears itself in 4s.', { duration: 4000 })}>
          Timed toast (4s)
        </Button>
      </Stack>

      <Toast.Viewport />
    </Stack>
  );
}
