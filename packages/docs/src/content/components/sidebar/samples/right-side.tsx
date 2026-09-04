import { Button, Icon, Sidebar, Stack, Text, Tooltip, useSidebarContext } from 'move';

function HeaderToggle() {
  const { collapsed, toggleCollapsed } = useSidebarContext();
  return (
    <Tooltip label={collapsed ? 'Expand inspector' : 'Collapse inspector'} side="left">
      <Button variant="ghost" size="sm" onClick={toggleCollapsed} aria-label="Toggle inspector">
        <Icon name={collapsed ? 'panel-right' : 'panel-right-close'} />
      </Button>
    </Tooltip>
  );
}

/**
 * `side="right"` flips the border, the collapse direction, and the mobile
 * slide-in. Useful for inspector panels, secondary navigation, or any layout
 * that already has the primary nav on the left.
 */
export default function RightSideSample() {
  return (
    // composite-purity-ignore: fixed-height demo frame so the Sidebar layout reads in the docs preview; no Move height prop
    <div style={{ display: 'flex', height: 360, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)', overflow: 'hidden' }}>
      <Sidebar.Provider>
        <Stack flex={1} align="center" justify="center" padding="lg">
          <Text color="muted">Main content</Text>
        </Stack>
        <Sidebar.Root side="right">
          <Sidebar.Header collapsedChildren={<HeaderToggle />}>
            <Text weight="semibold">Inspector</Text>
            <HeaderToggle />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Layers</Sidebar.GroupLabel>
              <Sidebar.Nav>
                <Sidebar.NavItem href="/frame" icon={<Icon name="square" />} tooltip="Frame" active>Frame</Sidebar.NavItem>
                <Sidebar.NavItem href="/title" icon={<Icon name="type" />} tooltip="Title">Title</Sidebar.NavItem>
                <Sidebar.NavItem href="/cover-image" icon={<Icon name="image" />} tooltip="Cover image">Cover image</Sidebar.NavItem>
              </Sidebar.Nav>
            </Sidebar.Group>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Properties</Sidebar.GroupLabel>
              <Sidebar.Nav>
                <Sidebar.NavItem href="/style" icon={<Icon name="paintbrush" />} tooltip="Style">Style</Sidebar.NavItem>
                <Sidebar.NavItem href="/layout" icon={<Icon name="ruler" />} tooltip="Layout">Layout</Sidebar.NavItem>
              </Sidebar.Nav>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar.Root>
      </Sidebar.Provider>
    </div>
  );
}
