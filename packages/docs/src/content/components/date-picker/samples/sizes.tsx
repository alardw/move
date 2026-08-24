import { DatePicker, FormField, Label, Stack } from 'move';

const sizes = ['sm', 'md', 'lg'] as const;

export default function SizesSample() {
  return (
    <Stack gap="md">
      {sizes.map((size) => (
        <FormField.Root key={size} labelWidth="3rem">
          <FormField.Label>
            <Label>{size}</Label>
          </FormField.Label>
          <FormField.Field>
            <DatePicker.Root mode="single">
              <DatePicker.Trigger>
                <DatePicker.Input size={size} />
              </DatePicker.Trigger>
              <DatePicker.Content />
            </DatePicker.Root>
          </FormField.Field>
        </FormField.Root>
      ))}
    </Stack>
  );
}
