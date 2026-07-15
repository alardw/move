import { ColorInput, Stack, Text } from 'move';

const sizes = ['sm', 'md', 'lg'] as const;

export default function SizesSample() {
  return (
    <Stack gap="md">
      {sizes.map((size) => (
        <Stack key={size} direction="row" gap="md" align="center">
          <Text size="sm" weight="medium">{size}</Text>
          <ColorInput aria-label={`Colour (size ${size}, outlined)`} size={size} defaultValue="#7950f2" width="14rem" />
          <ColorInput aria-label={`Colour (size ${size}, filled)`} size={size} variant="filled" defaultValue="#12b886" width="14rem" />
        </Stack>
      ))}
    </Stack>
  );
}
