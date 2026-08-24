import { FormField, Label, PinInput, Stack } from 'move';

export default function MaskedSample() {
  return (
    <Stack gap="md">
      <FormField.Root>
        <FormField.Label>
          <Label>Masked (PIN, password)</Label>
        </FormField.Label>
        <FormField.Field>
          <PinInput length={4} mask />
        </FormField.Field>
      </FormField.Root>
      <FormField.Root>
        <FormField.Label>
          <Label>Alphanumeric</Label>
        </FormField.Label>
        <FormField.Field>
          <PinInput length={6} type="alphanumeric" />
        </FormField.Field>
      </FormField.Root>
    </Stack>
  );
}
