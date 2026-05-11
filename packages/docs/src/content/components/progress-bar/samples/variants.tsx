import { ProgressBar, Stack, Text } from 'move';

const variants = ['default', 'success', 'warning', 'error'] as const;

export default function VariantsSample() {
  return (
    <Stack gap="md">
      {variants.map((v) => (
        <Stack key={v} gap="xs">
          <Text size="sm" weight="medium">variant="{v}"</Text>
          <ProgressBar value={68} variant={v} />
        </Stack>
      ))}
    </Stack>
  );
}
