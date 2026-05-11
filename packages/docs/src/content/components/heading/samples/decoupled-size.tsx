import { Heading, Stack, Text } from 'move';

/**
 * `level` controls the rendered HTML tag and the document outline,
 * `size` controls the visual weight. Combine them when you want a
 * semantically-important heading to read quietly, or vice versa.
 */
export default function DecoupledSizeSample() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" color="muted">level=2, default size</Text>
        <Heading level={2}>Quarterly review</Heading>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" color="muted">level=2, size=md (small visual)</Text>
        <Heading level={2} size="md">Quarterly review</Heading>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" color="muted">level=4, size=2xl (visually big, but still h4 in the outline)</Text>
        <Heading level={4} size="2xl">Quarterly review</Heading>
      </Stack>
    </Stack>
  );
}
