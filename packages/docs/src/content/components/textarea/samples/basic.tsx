import { Stack, Textarea } from 'move';

export default function BasicSample() {
  return (
    <Stack gap="md">
      <Textarea rows={4} placeholder="Write a message…" />
      <Textarea rows={4} variant="filled" placeholder="Filled variant" />
    </Stack>
  );
}
