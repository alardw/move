import { Stack, Text, TimeField } from 'move';

export default function CyclesSample() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" weight="medium">24-hour</Text>
        <TimeField hourCycle={24} defaultValue="14:30" />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">12-hour with AM/PM</Text>
        <TimeField hourCycle={12} defaultValue="14:30" />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">With seconds</Text>
        <TimeField defaultValue="14:30:45" granularity="second" />
      </Stack>
    </Stack>
  );
}
