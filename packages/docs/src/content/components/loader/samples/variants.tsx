import { Loader, Stack, Text } from 'move';

export default function VariantsSample() {
  return (
    <Stack direction="row" gap="lg" align="center">
      <Stack gap="xs" align="center">
        <Loader variant="spinner" />
        <Text size="sm" color="muted">spinner (default)</Text>
      </Stack>
      <Stack gap="xs" align="center">
        <Loader variant="dots" />
        <Text size="sm" color="muted">dots</Text>
      </Stack>
    </Stack>
  );
}
