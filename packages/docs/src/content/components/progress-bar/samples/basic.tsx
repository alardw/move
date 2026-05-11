import { ProgressBar, Stack, Text } from 'move';

export default function BasicSample() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" weight="medium">25%</Text>
        <ProgressBar value={25} />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">60%</Text>
        <ProgressBar value={60} />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">90%</Text>
        <ProgressBar value={90} />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Indeterminate</Text>
        <ProgressBar />
      </Stack>
    </Stack>
  );
}
