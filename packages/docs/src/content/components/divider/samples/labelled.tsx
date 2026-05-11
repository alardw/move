import { Divider, Stack, Text } from 'move';

export default function LabelledSample() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" weight="medium">align="center" (default)</Text>
        <Divider>Or sign in with</Divider>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">align="left"</Text>
        <Divider align="left">Recently used</Divider>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">align="right"</Text>
        <Divider align="right">Updated 2 min ago</Divider>
      </Stack>
    </Stack>
  );
}
