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
 * Items take a `badge` on the right — unread counts, status pills, anything
 * that says "look here next." Badges fade out with the labels when the rail
 * collapses, so the icons-only mode stays tidy.
 */
export default function WithBadgesSample() {
  return (
    // recipe-purity-ignore: fixed-height demo frame so the Sidebar layout reads in the docs preview; no Move height prop
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
              <Sidebar.Item icon={<Icon name="inbox" />} badge={<Badge color="blue">12</Badge>} tooltip="Inbox" active>Inbox</Sidebar.Item>
              <Sidebar.Item icon={<Icon name="star" />} tooltip="Starred">Starred</Sidebar.Item>
              <Sidebar.Item icon={<Icon name="send" />} tooltip="Sent">Sent</Sidebar.Item>
              <Sidebar.Item icon={<Icon name="archive" />} badge={<Badge color="gray">203</Badge>} tooltip="Archive">Archive</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Labels</Sidebar.GroupLabel>
              <Sidebar.Item icon={<Icon name="tag" />} badge={<Badge color="red">3</Badge>} tooltip="Important">Important</Sidebar.Item>
              <Sidebar.Item icon={<Icon name="briefcase" />} tooltip="Work">Work</Sidebar.Item>
              <Sidebar.Item icon={<Icon name="receipt" />} tooltip="Receipts">Receipts</Sidebar.Item>
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
