import { ColorInput, Stack, Text } from 'move';

export default function StatesSample() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Default</Text>
        <ColorInput defaultValue="#4c6ef5" width="20rem" />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Invalid</Text>
        <ColorInput invalid defaultValue="#not-a-color" width="20rem" />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Read-only</Text>
        <ColorInput readOnly defaultValue="#15aabf" width="20rem" />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Disabled</Text>
        <ColorInput disabled defaultValue="#fa5252" width="20rem" />
      </Stack>
    </Stack>
  );
}
