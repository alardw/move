import { FormField, Label, Password, Stack } from 'move';

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
            <Password size={size} placeholder={`size="${size}"`} />
          </FormField.Field>
        </FormField.Root>
      ))}
    </Stack>
  );
}
