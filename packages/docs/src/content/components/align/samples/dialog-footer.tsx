import { Align, Button, Stack, Text } from 'move';

/**
 * A common destructive-confirm pattern: a quiet hint on the left,
 * a pair of actions on the right, the centre slot left empty so
 * the end actions never wander toward the middle.
 */
export default function DialogFooterSample() {
  return (
    <Stack
      gap="md"
      padding="lg"
      style={{ border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-xl)', background: 'var(--move-bg-subtle)' }}
    >
      <Stack gap="xs">
        <Text size="lg" weight="semibold">Discard draft?</Text>
        <Text size="sm" color="muted">
          You haven’t saved this post in 12 minutes. Closing now removes the
          working copy from this device — the published version is unaffected.
        </Text>
      </Stack>
      <Align gap="md">
        <Align.Start>
          <Text size="xs" color="muted">Drafts auto-save every 30 seconds.</Text>
        </Align.Start>
        <Align.End>
          <Button variant="ghost">Keep editing</Button>
          <Button variant="danger">Discard</Button>
        </Align.End>
      </Align>
    </Stack>
  );
}
