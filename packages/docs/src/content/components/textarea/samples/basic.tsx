import { Stack, Textarea } from 'move';

export default function BasicSample() {
  return (
    <Stack gap="md">
      <Textarea aria-label="Write a message" rows={4} placeholder="Write a message…" />
      <Textarea aria-label="Filled variant" rows={4} variant="filled" placeholder="Filled variant" />
    </Stack>
  );
}
