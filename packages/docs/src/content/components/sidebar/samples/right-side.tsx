import * as React from 'react';
import { Button, Icon, Sidebar, Stack, Text, Tooltip, useSidebarContext } from 'move';

function HeaderToggle() {
  const { collapsed, toggleCollapsed } = useSidebarContext();
  return (
    <Tooltip label={collapsed ? 'Expand' : 'Collapse'} side="left">
      <Button variant="ghost" size="sm" onClick={toggleCollapsed} aria-label="Toggle panel">
        <Icon name={collapsed ? 'panel-right' : 'panel-right-close'} />
      </Button>
    </Tooltip>
  );
}

/**
 * `side="right"` flips the border, the collapse direction, and the mobile
 * slide-in — for secondary navigation in a layout that already has the primary
 * nav on the left.
 *
 * Sidebar is the right home for a panel that stays: it sits beside the content,
 * shares the page with it, and collapses to a rail. Reach for Drawer when the
 * panel is transient — it overlays the page, traps focus, and closes once the
 * user is done.
 */
export default function RightSideSample() {
  // A docs sample must not navigate away, so the router's job is done here
  // by state: the click is swallowed and drives `active` instead.
  const [current, setCurrent] = React.useState('/guides');
  const select = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrent(e.currentTarget.getAttribute('href') ?? '');
  };

  return (
    // composite-purity-ignore: fixed-height demo frame so the Sidebar layout reads in the docs preview; no Move height prop
    <div style={{ display: 'flex', height: 360, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)', overflow: 'hidden' }}>
      <Sidebar.Provider>
        <Stack flex={1} align="center" justify="center" padding="lg">
          <Text color="muted">Main content</Text>
        </Stack>
        <Sidebar.Root side="right">
          <Sidebar.Header>
            <Sidebar.Expanded>
              <Text weight="semibold">Resources</Text>
            </Sidebar.Expanded>
            <HeaderToggle />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Learn</Sidebar.GroupLabel>
              <Sidebar.Nav>
                <Sidebar.NavItem href="/guides" active={current === "/guides"} onClick={select} icon={<Icon name="book-open" />} tooltip="Guides">Guides</Sidebar.NavItem>
                <Sidebar.NavItem href="/api" active={current === "/api"} onClick={select} icon={<Icon name="code" />} tooltip="API reference">API reference</Sidebar.NavItem>
                <Sidebar.NavItem href="/changelog" active={current === "/changelog"} onClick={select} icon={<Icon name="history" />} tooltip="Changelog">Changelog</Sidebar.NavItem>
              </Sidebar.Nav>
            </Sidebar.Group>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Get help</Sidebar.GroupLabel>
              <Sidebar.Nav>
                <Sidebar.NavItem href="/support" active={current === "/support"} onClick={select} icon={<Icon name="life-buoy" />} tooltip="Support">Support</Sidebar.NavItem>
                <Sidebar.NavItem href="/community" active={current === "/community"} onClick={select} icon={<Icon name="users" />} tooltip="Community">Community</Sidebar.NavItem>
              </Sidebar.Nav>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar.Root>
      </Sidebar.Provider>
    </div>
  );
}
