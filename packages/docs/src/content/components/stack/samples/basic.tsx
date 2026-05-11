import { Stack, Text } from 'move';

const tile: React.CSSProperties = {
  background: 'var(--move-bg-muted)',
  padding: 'var(--move-spacing-md)',
  borderRadius: 'var(--move-rounded-md)',
};

export default function BasicSample() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Vertical (default)</Text>
        <Stack gap="sm">
          <div style={tile}>One</div>
          <div style={tile}>Two</div>
          <div style={tile}>Three</div>
        </Stack>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Horizontal</Text>
        <Stack direction="row" gap="sm">
          <div style={tile}>One</div>
          <div style={tile}>Two</div>
          <div style={tile}>Three</div>
        </Stack>
      </Stack>
    </Stack>
  );
}
