import { Skeleton, Stack, Text } from 'move';

const modes = [
  { label: 'pulse', value: 'pulse' },
  { label: 'wave', value: 'wave' },
  { label: 'false', value: false },
] as const;

export default function AnimationsSample() {
  return (
    <Stack gap="md">
      {modes.map((mode) => (
        <Stack key={mode.label} gap="xs">
          <Text size="sm" weight="medium">animation: {mode.label}</Text>
          <Skeleton.Root animation={mode.value}>
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
