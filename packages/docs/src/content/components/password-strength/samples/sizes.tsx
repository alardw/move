import { PasswordStrength, Stack, Text } from 'move';

const sizes = ['sm', 'md', 'lg'] as const;

export default function SizesSample() {
  return (
    <Stack gap="md">
      {sizes.map((size) => (
        <Stack key={size} gap="xs">
          <Text size="sm" weight="medium">{size}</Text>
          <PasswordStrength size={size} score={2} />
        </Stack>
      ))}
    </Stack>
  );
}
