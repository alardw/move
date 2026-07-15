import { Collapsible, Icon, Stack, Text } from 'move';

/**
 * Drop your own glyph into `Collapsible.Icon` and the 180° rotation
 * still applies — pick directional icons (arrow-down, caret-down) so
 * the flipped state reads as "open."
 */
export default function CustomIconSample() {
  return (
    <Stack gap="md">
      <Collapsible.Root>
        <Stack gap="sm">
          <Collapsible.Trigger>
            {/* composite-purity-ignore: the trigger resets to inline (all:unset); width:100% lets the row fill it so justify spreads — no Move width prop */}
            <Stack direction="row" gap="sm" align="center" justify="between" style={{ width: '100%' }}>
              <Text weight="medium">Arrow down ↔ up</Text>
              <Collapsible.Icon>
                <Icon name="arrow-down" />
              </Collapsible.Icon>
            </Stack>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <Text size="sm" color="muted">
              On open the arrow flips 180° and points up — a clear "tap to collapse" affordance.
            </Text>
          </Collapsible.Content>
        </Stack>
      </Collapsible.Root>
      <Collapsible.Root>
        <Stack gap="sm">
          <Collapsible.Trigger>
            {/* composite-purity-ignore: the trigger resets to inline (all:unset); width:100% lets the row fill it so justify spreads — no Move width prop */}
            <Stack direction="row" gap="sm" align="center" justify="between" style={{ width: '100%' }}>
              <Text weight="medium">Caret down ↔ up</Text>
              <Collapsible.Icon>
                <Icon name="chevrons-down" />
              </Collapsible.Icon>
            </Stack>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <Text size="sm" color="muted">
              Double chevron exaggerates the flip — works well in dense lists where you want the state to read at a glance.
            </Text>
          </Collapsible.Content>
        </Stack>
      </Collapsible.Root>
    </Stack>
  );
}
