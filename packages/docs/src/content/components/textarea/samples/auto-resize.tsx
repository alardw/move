import { Stack, Text, Textarea } from 'move';

export default function AutoResizeSample() {
  return (
    <Stack gap="sm">
      <Textarea autoSize maxRows={10} placeholder="Type and watch the textarea grow…" />
      <Text size="sm" color="muted">Grows with content up to 10 rows, then scrolls inside.</Text>
    </Stack>
  );
}
