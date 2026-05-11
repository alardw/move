import { Code, Stack, Text } from 'move';

const variants = ['subtle', 'outline', 'ghost'] as const;
const descriptions: Record<typeof variants[number], string> = {
  subtle: 'Filled muted background — the default, reads as a chip in flowing prose.',
  outline: 'Border only — useful in places where a fill would compete with the surface.',
  ghost: 'No chrome at all — just the monospace font. For when surrounding context already separates the snippet.',
};

export default function VariantsSample() {
  return (
    <Stack gap="lg">
      {variants.map((v) => (
        <Stack key={v} gap="xs">
          <Text size="sm" weight="medium">variant="{v}"</Text>
          <Text size="sm" color="muted">{descriptions[v]}</Text>
          <Text>
            Inline <Code variant={v}>useAnimations(config, refs)</Code> renders with the {v} treatment.
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}
