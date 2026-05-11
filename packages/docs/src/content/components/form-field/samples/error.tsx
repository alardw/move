import { FormField, InputText, Label } from 'move';

export default function ErrorSample() {
  return (
    <FormField.Root>
      <FormField.Label>
        <Label htmlFor="bad-email">Email</Label>
      </FormField.Label>
      <FormField.Field>
        <InputText id="bad-email" defaultValue="not an email" invalid />
      </FormField.Field>
      <FormField.Description error>That doesn’t look like a valid email address.</FormField.Description>
    </FormField.Root>
  );
}
