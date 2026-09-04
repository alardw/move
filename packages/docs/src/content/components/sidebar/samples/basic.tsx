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
    // composite-purity-ignore: fixed-height demo frame so the Sidebar layout reads in the docs preview; no Move height prop
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
              <Sidebar.Nav>
                <Sidebar.NavItem href="/home" icon={<Icon name="home" />} tooltip="Home" active>Home</Sidebar.NavItem>
                <Sidebar.NavItem href="/inbox" icon={<Icon name="inbox" />} tooltip="Inbox">Inbox</Sidebar.NavItem>
                <Sidebar.NavItem href="/projects" icon={<Icon name="folder" />} tooltip="Projects">Projects</Sidebar.NavItem>
                <Sidebar.NavItem href="/team" icon={<Icon name="users" />} tooltip="Team">Team</Sidebar.NavItem>
              </Sidebar.Nav>
            </Sidebar.Group>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Account</Sidebar.GroupLabel>
              <Sidebar.Nav>
                <Sidebar.NavItem href="/settings" icon={<Icon name="settings" />} tooltip="Settings">Settings</Sidebar.NavItem>
                <Sidebar.NavItem href="/help" icon={<Icon name="life-buoy" />} tooltip="Help">Help</Sidebar.NavItem>
              </Sidebar.Nav>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Nav aria-label="Account">
              <Sidebar.NavItem href="/profile" icon={<Icon name="user" />} tooltip="Profile">Alex Smith</Sidebar.NavItem>
            </Sidebar.Nav>
          </Sidebar.Footer>
        </Sidebar.Root>
        <Stack flex={1} align="center" justify="center" padding="lg">
          <Text color="muted">Main content</Text>
        </Stack>
      </Sidebar.Provider>
    </div>
  );
}
