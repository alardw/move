import { Collapsible, Stack, Text } from 'move';

export default function BasicSample() {
  return (
    <Collapsible.Root defaultOpen>
      <Stack gap="sm">
        <Collapsible.Trigger>
          {/* recipe-purity-ignore: the trigger resets to inline (all:unset); width:100% lets the row fill it so justify spreads — no Move width prop */}
          <Stack direction="row" gap="sm" align="center" justify="between" style={{ width: '100%' }}>
            <Text weight="medium">What does the trigger do?</Text>
            <Collapsible.Icon />
          </Stack>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <Stack gap="sm">
            <Text>
              It’s a plain <Text as="span" weight="medium">{'<button>'}</Text> with `aria-expanded` and `aria-controls` wired up,
              so keyboards and screen readers see exactly what the eye sees: a toggle that opens a region.
            </Text>
            <Text color="muted" size="sm">
              The chevron rotates as the content expands — no separate animation to choreograph.
            </Text>
          </Stack>
        </Collapsible.Content>
      </Stack>
    </Collapsible.Root>
  );
}
