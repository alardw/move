import { Badge, Button, Icon, Sidebar, Stack, Text, Tooltip, useSidebarContext } from 'move';

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

/**
 * Nav items take a `badge` on the right — unread counts, status pills, anything
 * that says "look here next." Badges fade out with the labels when the rail
 * collapses, so the icons-only mode stays tidy.
 *
 * These use `variant="inherit"`, which takes the badge's colours from the row
 * it sits on. A palette colour is chosen against its own text, not against
 * whatever it is placed on, so on the filled active row a blue badge lands
 * 1.16:1 from the row and dissolves into it.
 */
export default function WithBadgesSample() {
  return (
    // composite-purity-ignore: fixed-height demo frame so the Sidebar layout reads in the docs preview; no Move height prop
    <div style={{ display: 'flex', height: 360, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)', overflow: 'hidden' }}>
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Header collapsedChildren={<HeaderToggle />}>
            <Text weight="semibold">Inbox Zero</Text>
            <HeaderToggle />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Mailboxes</Sidebar.GroupLabel>
              <Sidebar.Nav>
                <Sidebar.NavItem href="/inbox" icon={<Icon name="inbox" />} badge={<Badge variant="inherit">12</Badge>} tooltip="Inbox" active>Inbox</Sidebar.NavItem>
                <Sidebar.NavItem href="/starred" icon={<Icon name="star" />} tooltip="Starred">Starred</Sidebar.NavItem>
                <Sidebar.NavItem href="/sent" icon={<Icon name="send" />} tooltip="Sent">Sent</Sidebar.NavItem>
                <Sidebar.NavItem href="/archive" icon={<Icon name="archive" />} badge={<Badge variant="inherit">203</Badge>} tooltip="Archive">Archive</Sidebar.NavItem>
              </Sidebar.Nav>
            </Sidebar.Group>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Labels</Sidebar.GroupLabel>
              <Sidebar.Nav>
                <Sidebar.NavItem href="/important" icon={<Icon name="tag" />} badge={<Badge variant="inherit">3</Badge>} tooltip="Important">Important</Sidebar.NavItem>
                <Sidebar.NavItem href="/work" icon={<Icon name="briefcase" />} tooltip="Work">Work</Sidebar.NavItem>
                <Sidebar.NavItem href="/receipts" icon={<Icon name="receipt" />} tooltip="Receipts">Receipts</Sidebar.NavItem>
              </Sidebar.Nav>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar.Root>
        <Stack flex={1} align="center" justify="center" padding="lg">
          <Text color="muted">Main content</Text>
        </Stack>
      </Sidebar.Provider>
    </div>
  );
}
