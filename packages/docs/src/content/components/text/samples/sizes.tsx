import { Stack, Text } from 'move';

const sizes = ['xs', 'sm', 'base', 'lg', 'xl'] as const;

export default function SizesSample() {
  return (
    <Stack gap="sm">
      {sizes.map((size) => (
        <Text key={size} size={size}>The quick brown fox jumps over the lazy dog — size="{size}"</Text>
      ))}
    </Stack>
  );
}
