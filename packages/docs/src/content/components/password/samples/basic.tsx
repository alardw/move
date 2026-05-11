import { Password, Stack } from 'move';

export default function BasicSample() {
  return (
    <Stack gap="md">
      <Password placeholder="Enter your password" />
      <Password defaultValue="prefilled-secret" />
    </Stack>
  );
}
