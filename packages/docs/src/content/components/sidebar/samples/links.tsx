import { Button, Icon, Sidebar, Stack, Text, Tooltip, useSidebarContext } from 'move';

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
 * Pass `asChild` and Sidebar.Item forgets it's a button — wrap your router's
 * Link (Next.js, React Router, TanStack) and the Item injects icon, label,
 * badge, and tooltip into the link element. Active state is yours to drive.
 */
export default function LinksSample() {
  // Stand-in for whatever your router exports. In a real app, swap for
  // `<NextLink href={href} />` or `<RouterLink to={href} />`.
  const Link = ({ href, children, ...rest }: { href: string; children?: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    // recipe-purity-ignore: raw <a> stands in for your router's Link (Next.js / React Router / TanStack)
    <a href={href} {...rest}>{children}</a>
  );

  return (
    // recipe-purity-ignore: fixed-height demo frame so the Sidebar layout reads in the docs preview; no Move height prop
    <div style={{ display: 'flex', height: 360, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)', overflow: 'hidden' }}>
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Header collapsedChildren={<HeaderToggle />}>
            <Text weight="semibold">Docs</Text>
            <HeaderToggle />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Guide</Sidebar.GroupLabel>
              <Sidebar.Item asChild icon={<Icon name="rocket" />} tooltip="Getting started" active>
                <Link href="/getting-started">Getting started</Link>
              </Sidebar.Item>
              <Sidebar.Item asChild icon={<Icon name="brain" />} tooltip="Core concepts">
                <Link href="/core-concepts">Core concepts</Link>
              </Sidebar.Item>
              <Sidebar.Item asChild icon={<Icon name="blocks" />} tooltip="Components">
                <Link href="/components">Components</Link>
              </Sidebar.Item>
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
