import { Badge, Button, Collapsible, Icon, Stack, Text } from 'move';

/**
 * `asChild` lets the Trigger borrow any element. Here it wraps a
 * full-width Button — a status pill, a title, a chevron — and that
 * Button becomes the disclosure trigger, keeping all of its keyboard
 * and ARIA semantics, no extra wrapper required.
 */
export default function AsChildSample() {
  return (
    <Collapsible.Root>
      <Stack gap="sm">
        <Collapsible.Trigger asChild>
          <Button variant="secondary" fullWidth>
            {/* recipe-purity-ignore: full-width flex row inside the button so justify spreads — no Move width prop */}
            <Stack direction="row" gap="md" align="center" justify="between" style={{ width: '100%' }}>
              <Stack gap="none">
                <Text weight="medium">Diagnostics</Text>
                <Text size="sm" color="muted">Server health, queue depth, recent errors</Text>
              </Stack>
              <Stack direction="row" gap="sm" align="center">
                <Badge variant="dot" color="warning">3 incidents</Badge>
                <Collapsible.Icon>
                  <Icon name="chevron-down" />
                </Collapsible.Icon>
              </Stack>
            </Stack>
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <Stack gap="xs" padding="md">
            <Text size="sm">CPU at 64% · memory steady · queue 12 jobs · p99 320ms</Text>
            <Text size="sm" color="muted">
              Two of today’s incidents auto-resolved within 90 seconds; one was a flaky third-party webhook.
            </Text>
          </Stack>
        </Collapsible.Content>
      </Stack>
    </Collapsible.Root>
  );
}
