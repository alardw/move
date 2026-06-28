import { Skeleton, Stack } from 'move';

export default function BasicSample() {
  return (
    <Skeleton.Root>
      <Stack gap="md">
        <Stack direction="row" gap="md" align="center">
          <Skeleton.Circle width={48} height={48} />
          <Stack gap="xs" flex={1}>
            <Skeleton.Rounded width="40%" height={16} />
            <Skeleton.Rounded width="70%" height={12} />
          </Stack>
        </Stack>
        <Skeleton.Text lines={3} />
      </Stack>
    </Skeleton.Root>
  );
}
