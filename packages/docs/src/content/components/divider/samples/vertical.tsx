import { Divider, Stack, Text } from 'move';

export default function VerticalSample() {
  return (
    <Stack direction="row" gap="md" align="center" style={{ height: 80 }}>
      <Text>Drafts</Text>
      <Divider orientation="vertical" />
      <Text>Pending review</Text>
      <Divider orientation="vertical" />
      <Text>Published</Text>
      <Divider orientation="vertical">Archive</Divider>
      <Text size="sm" color="muted">Older items</Text>
    </Stack>
  );
}
