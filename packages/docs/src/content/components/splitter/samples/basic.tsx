import { Splitter, Stack, Text } from 'move';

// Muted panel surface so each pane reads as a distinct region.
const panelBg: React.CSSProperties = { background: 'var(--move-bg-muted)' };

export default function BasicSample() {
  return (
    // recipe-purity-ignore: fixed-height frame so the Splitter has a track to resize within; no Move height prop
    <div style={{ height: 240 }}>
      <Splitter.Root>
        <Splitter.Panel>
          {/* recipe-purity-ignore: muted pane surface tint; no Move background primitive */}
          <Stack gap="xs" fill padding="md" style={panelBg}>
            <Text weight="medium">Sidebar</Text>
            <Text size="sm" color="muted">Drag the gutter to resize.</Text>
          </Stack>
        </Splitter.Panel>
        <Splitter.Panel>
          {/* recipe-purity-ignore: muted pane surface tint; no Move background primitive */}
          <Stack gap="xs" fill padding="md" style={panelBg}>
            <Text weight="medium">Main</Text>
            <Text size="sm" color="muted">Or focus the gutter and use Arrow keys.</Text>
          </Stack>
        </Splitter.Panel>
      </Splitter.Root>
    </div>
  );
}
