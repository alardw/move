import { InputText, Stack, Text } from 'move';

export default function StatesSample() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Default</Text>
        <InputText aria-label="Default" defaultValue="Type here" />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Invalid</Text>
        <InputText aria-label="Invalid" defaultValue="not an email" invalid />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Read-only</Text>
        <InputText aria-label="Read-only" defaultValue="alex@acme.co" readOnly />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Disabled</Text>
        <InputText aria-label="Disabled" defaultValue="Frozen" disabled />
      </Stack>
    </Stack>
  );
}
