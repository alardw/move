import { Button, Stack, Toast, toast } from 'move';

export default function BasicSample() {
  return (
    <>
      <Stack direction="row" gap="sm" wrap>
        <Button onClick={() => toast.info('A new release is available — refresh when convenient.')}>Info</Button>
        <Button onClick={() => toast.success('Saved — your changes are live.')}>Success</Button>
        <Button onClick={() => toast.warning('You’re using 92% of your quota.')}>Warning</Button>
        <Button onClick={() => toast.error('Couldn’t save — check your connection.')}>Error</Button>
      </Stack>
      <Toast.Viewport />
    </>
  );
}
