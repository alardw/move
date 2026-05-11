import { Badge, Stack, Text } from 'move';

const sizes = ['sm', 'md', 'lg'] as const;

export default function SizesSample() {
  return (
    <Stack gap="md">
      {sizes.map((size) => (
        <Stack key={size} direction="row" gap="md" align="center">
          <Text size="sm" weight="medium" style={{ width: '4ch' }}>{size}</Text>
          <Stack direction="row" gap="sm" align="center" wrap>
            <Badge size={size} color="primary">Primary</Badge>
            <Badge size={size} color="success" variant="soft">Active</Badge>
            <Badge size={size} color="warning" variant="surface">Trial</Badge>
            <Badge size={size} color="danger" variant="outline">Past due</Badge>
            <Badge size={size} color="info" variant="dot">Beta</Badge>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
