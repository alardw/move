import { Icon, Sidebar, Stack, Text } from 'move';

/**
 * `side="right"` flips the border, the collapse direction, and the
 * mobile slide-in. Useful for inspector panels, secondary navigation,
 * or any layout that already has the primary nav on the left.
 */
export default function RightSideSample() {
  return (
    <div style={{ display: 'flex', height: 360, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)', overflow: 'hidden' }}>
      <Sidebar.Provider>
        <Stack flex={1} align="center" justify="center" padding="lg">
          <Sidebar.Trigger icon="panel-right" tooltip="Toggle inspector" />
        </Stack>
        <Sidebar.Root side="right">
          <Sidebar.Header>
            <Text weight="semibold">Inspector</Text>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Layers</Sidebar.GroupLabel>
              <Sidebar.Item icon={<Icon name="square" />} tooltip="Frame" active>Frame</Sidebar.Item>
              <Sidebar.Item icon={<Icon name="type" />} tooltip="Title">Title</Sidebar.Item>
              <Sidebar.Item icon={<Icon name="image" />} tooltip="Cover image">Cover image</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Properties</Sidebar.GroupLabel>
              <Sidebar.Item icon={<Icon name="paintbrush" />} tooltip="Style">Style</Sidebar.Item>
              <Sidebar.Item icon={<Icon name="ruler" />} tooltip="Layout">Layout</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar.Root>
      </Sidebar.Provider>
    </div>
  );
}
