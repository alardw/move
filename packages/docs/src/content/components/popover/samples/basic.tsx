import { Button, Popover, Stack, Text } from 'move';

export default function BasicSample() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="secondary">Show details</Button>
      </Popover.Trigger>
      <Popover.Content sideOffset={8}>
        <Stack gap="sm">
          <Text weight="medium">About this metric</Text>
          <Text size="sm" color="muted">
            Active sessions in the last 5 minutes, refreshed every 30 seconds. Excludes bots and synthetic monitors.
          </Text>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  );
}
