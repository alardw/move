import { Stack, Text } from 'move';

const weights = ['normal', 'medium', 'semibold', 'bold'] as const;

export default function WeightsSample() {
  return (
    <Stack gap="xs">
      {weights.map((weight) => (
        <Text key={weight} weight={weight}>weight="{weight}" — the quick brown fox.</Text>
      ))}
    </Stack>
  );
}
