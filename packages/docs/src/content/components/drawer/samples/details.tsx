import { Avatar, Badge, Button, Divider, Drawer, Stack, Text } from "move";

/**
 * A common detail-pane pattern — the drawer sits on the right of a list
 * view, slides in when a row is clicked, and shows the selected item’s
 * full content without leaving the page.
 */
export default function DetailsSample() {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button>View teammate</Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content size="md">
          <Drawer.Header>
            <Drawer.Title>Mira Kovac</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Stack gap="md">
              <Stack direction="row" gap="md" align="center">
                <Avatar.Root size="xl">
                  <Avatar.Image
                    src="https://i.pravatar.cc/96?img=47"
                    alt="Mira Kovac"
                  />
                  <Avatar.Fallback>MK</Avatar.Fallback>
                </Avatar.Root>
                <Stack gap="none">
                  <Text weight="semibold">Mira Kovac</Text>
                  <Text size="sm" color="muted">
                    Senior product designer · she/her
                  </Text>
                  <Stack direction="row" gap="xs" align="center">
                    <Badge variant="dot" color="green">
                      Available
                    </Badge>
                  </Stack>
                </Stack>
              </Stack>
              <Divider gap="xs" />
              <Stack gap="xs">
                <Text size="sm" color="muted">
                  About
                </Text>
                <Text>
                  Designs the systems team’s component library, runs the weekly
                  design crit, and writes the Friday digest nobody reads but
                  everyone misses when it’s gone.
                </Text>
              </Stack>
              <Divider gap="xs" />
              <Stack gap="xs">
                <Text size="sm" color="muted">
                  Recent work
                </Text>
                <Text>· Refresh of the Move colour primitives (12 PRs)</Text>
                <Text>· New Sidebar variant for the customer portal</Text>
                <Text>· Hand-off doc for the v3 token migration</Text>
              </Stack>
            </Stack>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close asChild>
              <Button variant="ghost">Close</Button>
            </Drawer.Close>
            <Button>Open profile</Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
