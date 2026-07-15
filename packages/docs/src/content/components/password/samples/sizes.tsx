import { Password, Stack, Text } from 'move';

const sizes = ['sm', 'md', 'lg'] as const;

export default function SizesSample() {
  return (
    <Stack gap="md">
      {sizes.map((size) => (
        <Stack key={size} direction="row" gap="md" align="center">
          <Text size="sm" weight="medium">{size}</Text>
          <Password aria-label={`size="${size}"`} size={size} placeholder={`size="${size}"`} />
        </Stack>
      ))}
    </Stack>
  );
}
