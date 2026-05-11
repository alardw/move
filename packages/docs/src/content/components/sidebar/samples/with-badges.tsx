import { Badge, Icon, Sidebar, Stack, Text } from 'move';

/**
 * Items take a `badge` prop on the right — useful for unread counts,
 * status pills, anything that says "look here next." Badges fade out
 * with the labels when the rail collapses, so the icons-only mode stays
 * tidy.
 */
export default function WithBadgesSample() {
  return (
    <div style={{ display: 'flex', height: 360, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)', overflow: 'hidden' }}>
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Header>
            <Text weight="semibold">Inbox Zero</Text>
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
          <Sidebar.Trigger icon="panel-left" tooltip="Toggle sidebar" />
        </Stack>
      </Sidebar.Provider>
    </div>
  );
}
