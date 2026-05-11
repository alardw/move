import { Loader, Stack, Text } from 'move';

const sizes = ['sm', 'md', 'lg'] as const;

export default function SizesSample() {
  return (
    <Stack direction="row" gap="lg" align="center">
      {sizes.map((size) => (
        <Stack key={size} gap="xs" align="center">
          <Loader size={size} />
          <Text size="sm" color="muted">{size}</Text>
        </Stack>
      ))}
    </Stack>
  );
}
