import { Sidebar, Heading, Text } from 'move';

export function AppSidebar() {
  return (
    <Sidebar.Root>
      <Sidebar.Header collapsedChildren={<Text weight="bold" size="lg">M</Text>}>
        <Heading level={2} size="lg">My App</Heading>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.Item icon="home" active tooltip="Home">
            Home
          </Sidebar.Item>
          <Sidebar.Item icon="info" tooltip="About">
            About
          </Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Trigger icon="panel-left" tooltip="Toggle sidebar" visibility="desktop">Collapse</Sidebar.Trigger>
      </Sidebar.Footer>
      <Sidebar.Rail />
    </Sidebar.Root>
  );
}
