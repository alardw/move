import { Stack, Text } from 'move';

const colors = ['base', 'muted', 'subtle', 'primary', 'success', 'warning', 'error'] as const;

export default function ColorsSample() {
  return (
    <Stack gap="xs">
      {colors.map((color) => (
        <Text key={color} color={color}>color="{color}" — quick brown fox.</Text>
      ))}
    </Stack>
  );
}
