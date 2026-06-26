import { Splitter, Stack, Text } from 'move';

const panel: React.CSSProperties = {
  background: 'var(--move-bg-muted)',
  padding: 'var(--move-spacing-md)',
  height: '100%',
};

export default function BasicSample() {
  return (
    <div style={{ height: 240 }}>
      <Splitter.Root>
        <Splitter.Panel>
          <Stack gap="xs" style={panel}>
            <Text weight="medium">Sidebar</Text>
            <Text size="sm" color="muted">Drag the gutter to resize.</Text>
          </Stack>
        </Splitter.Panel>
        <Splitter.Panel>
          <Stack gap="xs" style={panel}>
            <Text weight="medium">Main</Text>
            <Text size="sm" color="muted">Or focus the gutter and use Arrow keys.</Text>
          </Stack>
        </Splitter.Panel>
      </Splitter.Root>
    </div>
  );
}
