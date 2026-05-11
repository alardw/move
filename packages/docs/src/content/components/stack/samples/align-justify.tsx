import { Stack, Text } from 'move';

const tile: React.CSSProperties = {
  background: 'var(--move-bg-muted)',
  padding: 'var(--move-spacing-md)',
  borderRadius: 'var(--move-rounded-md)',
};

export default function AlignJustifySample() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" weight="medium">justify="between"</Text>
        <Stack direction="row" gap="sm" justify="between" style={{ background: 'var(--move-bg-subtle)', padding: 'var(--move-spacing-sm)', borderRadius: 'var(--move-rounded-md)' }}>
          <div style={tile}>Start</div>
          <div style={tile}>End</div>
        </Stack>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">align="center" + justify="around"</Text>
        <Stack direction="row" gap="sm" align="center" justify="around" style={{ background: 'var(--move-bg-subtle)', padding: 'var(--move-spacing-sm)', borderRadius: 'var(--move-rounded-md)', height: 80 }}>
          <div style={tile}>1</div>
          <div style={{ ...tile, height: 60 }}>2 (tall)</div>
          <div style={tile}>3</div>
        </Stack>
      </Stack>
    </Stack>
  );
}
