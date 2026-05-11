import { Divider, Stack, Text } from 'move';

const types = ['solid', 'dashed', 'dotted'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

export default function StylesSample() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Line styles</Text>
        {types.map((t) => (
          <Stack key={t} gap="xs">
            <Text size="sm" color="muted">type="{t}"</Text>
            <Divider type={t} />
          </Stack>
        ))}
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Sizes (line thickness)</Text>
        {sizes.map((s) => (
          <Stack key={s} gap="xs">
            <Text size="sm" color="muted">size="{s}"</Text>
            <Divider size={s} />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
