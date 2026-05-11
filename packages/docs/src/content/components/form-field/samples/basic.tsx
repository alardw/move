import { FormField, InputText, Label, Stack } from 'move';

export default function BasicSample() {
  return (
    <Stack gap="md">
      <FormField.Root>
        <FormField.Label>
          <Label htmlFor="email">Email</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText id="email" type="email" placeholder="hello@example.com" />
        </FormField.Field>
        <FormField.Description>We’ll only use it for account-related emails.</FormField.Description>
      </FormField.Root>
      <FormField.Root>
        <FormField.Label>
          <Label htmlFor="display-name">Display name</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText id="display-name" placeholder="Mira K." />
        </FormField.Field>
      </FormField.Root>
    </Stack>
  );
}
