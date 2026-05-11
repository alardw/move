import { InputText, Label, Stack } from 'move';

export default function RequiredSample() {
  return (
    <Stack gap="md">
      <Stack gap="sm">
        <Label htmlFor="full-name" required>Full name</Label>
        <InputText id="full-name" required />
      </Stack>
      <Stack gap="sm">
        <Label htmlFor="phone">Phone</Label>
        <InputText id="phone" placeholder="Optional" />
      </Stack>
    </Stack>
  );
}
