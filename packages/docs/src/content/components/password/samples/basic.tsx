import { Password, Stack } from 'move';

export default function BasicSample() {
  return (
    <Stack gap="md">
      <Password aria-label="Enter your password" placeholder="Enter your password" />
      <Password aria-label="Password" defaultValue="prefilled-secret" />
    </Stack>
  );
}
