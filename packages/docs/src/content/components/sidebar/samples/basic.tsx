import * as React from 'react';
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
  // A docs sample must not navigate away, so the router's job is done here
  // by state: the click is swallowed and drives `active` instead.
  const [current, setCurrent] = React.useState('/home');
  const select = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrent(e.currentTarget.getAttribute('href') ?? '');
  };

  return (
    // composite-purity-ignore: fixed-height demo frame so the Sidebar layout reads in the docs preview; no Move height prop
    <div style={{ display: 'flex', height: 360, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)', overflow: 'hidden' }}>
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Header>
            <Sidebar.Expanded>
              <Text weight="semibold">Acme Co.</Text>
            </Sidebar.Expanded>
            <HeaderToggle />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
              <Sidebar.Nav>
                <Sidebar.NavItem href="/home" active={current === "/home"} onClick={select} icon={<Icon name="home" />} tooltip="Home">Home</Sidebar.NavItem>
                <Sidebar.NavItem href="/inbox" active={current === "/inbox"} onClick={select} icon={<Icon name="inbox" />} tooltip="Inbox">Inbox</Sidebar.NavItem>
                <Sidebar.NavItem href="/projects" active={current === "/projects"} onClick={select} icon={<Icon name="folder" />} tooltip="Projects">Projects</Sidebar.NavItem>
                <Sidebar.NavItem href="/team" active={current === "/team"} onClick={select} icon={<Icon name="users" />} tooltip="Team">Team</Sidebar.NavItem>
              </Sidebar.Nav>
            </Sidebar.Group>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Account</Sidebar.GroupLabel>
              <Sidebar.Nav>
                <Sidebar.NavItem href="/profile" active={current === "/profile"} onClick={select} icon={<Icon name="user" />} tooltip="Profile">Profile</Sidebar.NavItem>
                <Sidebar.NavItem href="/settings" active={current === "/settings"} onClick={select} icon={<Icon name="settings" />} tooltip="Settings">Settings</Sidebar.NavItem>
                <Sidebar.NavItem href="/help" active={current === "/help"} onClick={select} icon={<Icon name="life-buoy" />} tooltip="Help">Help</Sidebar.NavItem>
              </Sidebar.Nav>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Expanded>
              <Stack direction="row" align="center" justify="between" gap="sm">
                <Text size="sm" color="muted">Alex Smith</Text>
                <Tooltip label="Account menu" side="top">
                  <Button variant="ghost" size="sm" aria-label="Account menu">
                    <Icon name="ellipsis" />
                  </Button>
                </Tooltip>
              </Stack>
            </Sidebar.Expanded>
            <Sidebar.Collapsed>
              <Tooltip label="Account menu" side="right">
                <Button variant="ghost" size="sm" aria-label="Account menu">
                  <Icon name="ellipsis" />
                </Button>
              </Tooltip>
            </Sidebar.Collapsed>
          </Sidebar.Footer>
        </Sidebar.Root>
        <Stack flex={1} align="center" justify="center" padding="lg">
          <Text color="muted">Main content</Text>
        </Stack>
      </Sidebar.Provider>
    </div>
  );
}
