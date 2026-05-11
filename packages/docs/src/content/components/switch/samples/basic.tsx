import { Stack, Switch } from 'move';

export default function BasicSample() {
  return (
    <Stack gap="sm" align="start">
      <Switch.Root defaultChecked label="Email notifications">
        <Switch.Thumb />
      </Switch.Root>
      <Switch.Root label="SMS notifications">
        <Switch.Thumb />
      </Switch.Root>
      <Switch.Root disabled defaultChecked label="Push notifications (mobile only)">
        <Switch.Thumb />
      </Switch.Root>
    </Stack>
  );
}
