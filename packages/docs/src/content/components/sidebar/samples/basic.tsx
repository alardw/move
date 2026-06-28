import { Button, Icon, Sidebar, Stack, Text, Tooltip, useSidebarContext } from 'move';

/**
 * The collapse toggle is a plain ghost Button wired to `useSidebarContext`,
 * not a Sidebar.Trigger (that's a full-width row for the content/footer). The
 * header lays the logo and actions out at opposite ends.
 */
function HeaderToggle() {
  const { collapsed, toggleCollapsed } = useSidebarContext();
  return (
    <Tooltip label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} side="right">
      <Button variant="ghost" size="sm" onClick={toggleCollapsed} aria-label="Toggle sidebar">
        <Icon name={collapsed ? 'panel-left' : 'panel-left-close'} />
      </Button>
    </Tooltip>
  );
}

export default function BasicSample() {
  return (
    // recipe-purity-ignore: fixed-height demo frame so the Sidebar layout reads in the docs preview; no Move height prop
    <div style={{ display: 'flex', height: 360, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)', overflow: 'hidden' }}>
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Header collapsedChildren={<HeaderToggle />}>
            <Text weight="semibold">Acme Co.</Text>
            <HeaderToggle />
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
          <Text color="muted">Main content</Text>
        </Stack>
      </Sidebar.Provider>
    </div>
  );
}
