import { Checkbox, Stack } from 'move';

export default function BasicSample() {
  return (
    <Stack gap="sm">
      <Checkbox defaultChecked>Send me product updates</Checkbox>
      <Checkbox>Subscribe to the newsletter</Checkbox>
      <Checkbox disabled>Beta features (only on paid plans)</Checkbox>
    </Stack>
  );
}
