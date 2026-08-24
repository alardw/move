import { FormField, Label, Stack, Switch } from 'move';

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
            <Switch.Root size={size} defaultChecked>
              <Switch.Thumb />
            </Switch.Root>
          </FormField.Field>
        </FormField.Root>
      ))}
    </Stack>
  );
}
