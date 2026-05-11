import { PinInput, Stack, Text } from 'move';

export default function MaskedSample() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Masked (PIN, password)</Text>
        <PinInput length={4} mask />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Alphanumeric</Text>
        <PinInput length={6} type="alphanumeric" />
      </Stack>
    </Stack>
  );
}
