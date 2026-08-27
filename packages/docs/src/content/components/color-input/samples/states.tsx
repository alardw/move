import { ColorInput, FormField, Label, Stack } from 'move';

export default function StatesSample() {
  return (
    <Stack gap="md">
      <FormField.Root>
        <FormField.Label>
          <Label>Default</Label>
        </FormField.Label>
        <FormField.Field>
          <ColorInput defaultValue="#4c6ef5" width="lg" />
        </FormField.Field>
      </FormField.Root>
      <FormField.Root invalid>
        <FormField.Label>
          <Label>Invalid</Label>
        </FormField.Label>
        <FormField.Field>
          <ColorInput invalid defaultValue="#not-a-color" width="lg" />
        </FormField.Field>
      </FormField.Root>
      <FormField.Root>
        <FormField.Label>
          <Label>Read-only</Label>
        </FormField.Label>
        <FormField.Field>
          <ColorInput readOnly defaultValue="#15aabf" width="lg" />
        </FormField.Field>
      </FormField.Root>
      <FormField.Root>
        <FormField.Label>
          <Label>Disabled</Label>
        </FormField.Label>
        <FormField.Field>
          <ColorInput disabled defaultValue="#fa5252" width="lg" />
        </FormField.Field>
      </FormField.Root>
    </Stack>
  );
}
