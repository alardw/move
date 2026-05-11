import { Code, Stack, Text } from 'move';

const sizes = ['xs', 'sm', 'base', 'lg'] as const;

export default function SizesSample() {
  return (
    <Stack gap="md">
      {sizes.map((size) => (
        <Stack key={size} direction="row" gap="md" align="baseline">
          <Text size="sm" weight="medium" style={{ width: '4ch' }}>{size}</Text>
          <Text size={size === 'lg' ? 'lg' : 'base'}>
            Match the surrounding text size — <Code size={size}>moveAnimate(el, &#123; opacity: 1 &#125;)</Code>
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}
