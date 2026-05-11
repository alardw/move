import { InputText, Label, Stack } from 'move';

export default function BasicSample() {
  return (
    <Stack gap="sm">
      <Label htmlFor="email">Email</Label>
      <InputText id="email" type="email" placeholder="hello@example.com" />
    </Stack>
  );
}
