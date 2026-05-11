import { Badge, Collapsible, Icon, Stack, Text } from 'move';

/**
 * `asChild` lets the Trigger borrow any element. Here it wraps a
 * styled summary row — a div with padding, a status pill, a chevron —
 * and the row becomes a real button, with all the keyboard and ARIA
 * semantics, no extra wrapper required.
 */
export default function AsChildSample() {
  const rowStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: 'var(--move-spacing-md) var(--move-spacing-lg)',
    border: '1px solid var(--move-border-base)',
    borderRadius: 'var(--move-rounded-lg)',
    background: 'var(--move-surface-bg)',
    cursor: 'pointer',
    textAlign: 'left',
  };

  return (
    <Collapsible.Root>
      <Stack gap="sm">
        <Collapsible.Trigger asChild>
          <button type="button" style={rowStyle}>
            <Stack direction="row" gap="md" align="center" justify="between">
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
          </button>
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
