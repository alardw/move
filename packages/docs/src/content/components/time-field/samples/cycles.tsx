import { FormField, Label, Stack, TimeField } from 'move';

export default function CyclesSample() {
  return (
    <Stack gap="md">
      <FormField.Root>
        <FormField.Label>
          <Label>24-hour</Label>
        </FormField.Label>
        <FormField.Field>
          <TimeField hourCycle={24} defaultValue="14:30" />
        </FormField.Field>
      </FormField.Root>
      <FormField.Root>
        <FormField.Label>
          <Label>12-hour with AM/PM</Label>
        </FormField.Label>
        <FormField.Field>
          <TimeField hourCycle={12} defaultValue="14:30" />
        </FormField.Field>
      </FormField.Root>
      <FormField.Root>
        <FormField.Label>
          <Label>With seconds</Label>
        </FormField.Label>
        <FormField.Field>
          <TimeField defaultValue="14:30:45" granularity="second" />
        </FormField.Field>
      </FormField.Root>
    </Stack>
  );
}
