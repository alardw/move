import { Skeleton, Stack, Text } from 'move';

const modes = ['pulse', 'wave', 'none'] as const;

export default function AnimationsSample() {
  return (
    <Stack gap="md">
      {modes.map((mode) => (
        <Stack key={mode} gap="xs">
          <Text size="sm" weight="medium">animation="{mode}"</Text>
          <Skeleton.Root animation={mode}>
            <Stack gap="xs">
              <Skeleton.Rounded height={16} />
              <Skeleton.Rounded width="80%" height={16} />
              <Skeleton.Rounded width="60%" height={16} />
            </Stack>
          </Skeleton.Root>
        </Stack>
      ))}
    </Stack>
  );
}
