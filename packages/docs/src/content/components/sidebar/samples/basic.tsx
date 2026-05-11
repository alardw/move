import { Icon, Sidebar, Stack, Text } from 'move';

/**
 * Sidebar lives inside a `Sidebar.Provider` that holds the collapsed/mobile
 * state. The Trigger toggles between modes — collapse on desktop, slide-in
 * sheet on mobile. Items take an `icon` and an optional `tooltip` so they
 * keep their labels when the rail is collapsed to icons-only.
 */
export default function BasicSample() {
  return (
    <div style={{ display: 'flex', height: 360, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)', overflow: 'hidden' }}>
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Header>
            <Text weight="semibold">Acme Co.</Text>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
              <Sidebar.Item icon={<Icon name="home" />} tooltip="Home" active>Home</Sidebar.Item>
              <Sidebar.Item icon={<Icon name="inbox" />} tooltip="Inbox">Inbox</Sidebar.Item>
              <Sidebar.Item icon={<Icon name="folder" />} tooltip="Projects">Projects</Sidebar.Item>
              <Sidebar.Item icon={<Icon name="users" />} tooltip="Team">Team</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Account</Sidebar.GroupLabel>
              <Sidebar.Item icon={<Icon name="settings" />} tooltip="Settings">Settings</Sidebar.Item>
              <Sidebar.Item icon={<Icon name="life-buoy" />} tooltip="Help">Help</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Item icon={<Icon name="user" />} tooltip="Profile">Alex Smith</Sidebar.Item>
          </Sidebar.Footer>
        </Sidebar.Root>
        <Stack flex={1} align="center" justify="center" padding="lg">
          <Sidebar.Trigger icon="panel-left" tooltip="Toggle sidebar" />
        </Stack>
      </Sidebar.Provider>
    </div>
  );
}
