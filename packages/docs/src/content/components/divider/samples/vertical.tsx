import { Divider, Stack, Text } from 'move';

export default function VerticalSample() {
  return (
    // composite-purity-ignore: fixed row height gives the vertical dividers a visible extent; no Move height prop
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
