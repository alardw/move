import { Icon, Sidebar, Stack, Text } from 'move';

/**
 * Pass `asChild` and Sidebar.Item forgets it’s a button — wrap your
 * router’s Link component (Next.js, React Router, TanStack) and the
 * Item injects icon, label, badge, and tooltip into the link element.
 * Active state is yours to drive from the route.
 */
export default function LinksSample() {
  // Stand-in for whatever your router exports. In a real app, swap for
  // `<NextLink href={href} />` or `<RouterLink to={href} />`.
  const Link = ({ href, children, ...rest }: { href: string; children?: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>{children}</a>
  );

  return (
    <div style={{ display: 'flex', height: 360, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)', overflow: 'hidden' }}>
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Header>
            <Text weight="semibold">Docs</Text>
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
          <Sidebar.Trigger icon="panel-left" tooltip="Toggle sidebar" />
        </Stack>
      </Sidebar.Provider>
    </div>
  );
}
