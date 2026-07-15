import { ColorInput, Stack, Text } from 'move';

export default function StatesSample() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Default</Text>
        <ColorInput aria-label="Default" defaultValue="#4c6ef5" width="20rem" />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Invalid</Text>
        <ColorInput aria-label="Invalid" invalid defaultValue="#not-a-color" width="20rem" />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Read-only</Text>
        <ColorInput aria-label="Read-only" readOnly defaultValue="#15aabf" width="20rem" />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Disabled</Text>
        <ColorInput aria-label="Disabled" disabled defaultValue="#fa5252" width="20rem" />
      </Stack>
    </Stack>
  );
}
