import { Checkbox, Stack, Text } from 'move';

const sizes = ['sm', 'md', 'lg'] as const;

export default function SizesSample() {
  return (
    <Stack gap="md">
      {sizes.map((size) => (
        <Stack key={size} direction="row" gap="md" align="center">
          <Text size="sm" weight="medium" style={{ width: '4ch' }}>{size}</Text>
          <Checkbox size={size} defaultChecked>Default checked</Checkbox>
          <Checkbox size={size}>Unchecked</Checkbox>
          <Checkbox size={size} disabled defaultChecked>Disabled</Checkbox>
        </Stack>
      ))}
    </Stack>
  );
}
