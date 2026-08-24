import { FormField, InputText, Label, Stack } from 'move';

export default function StatesSample() {
  return (
    <Stack gap="md">
      <FormField.Root>
        <FormField.Label>
          <Label>Default</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText defaultValue="Type here" />
        </FormField.Field>
      </FormField.Root>
      <FormField.Root invalid>
        <FormField.Label>
          <Label>Invalid</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText defaultValue="not an email" invalid />
        </FormField.Field>
      </FormField.Root>
      <FormField.Root>
        <FormField.Label>
          <Label>Read-only</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText defaultValue="alex@acme.co" readOnly />
        </FormField.Field>
      </FormField.Root>
      <FormField.Root>
        <FormField.Label>
          <Label>Disabled</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText defaultValue="Frozen" disabled />
        </FormField.Field>
      </FormField.Root>
    </Stack>
  );
}
