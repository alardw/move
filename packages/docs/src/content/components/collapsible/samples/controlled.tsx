import { useState } from 'react';
import { Button, Collapsible, Stack, Text } from 'move';

/**
 * Pass `open` and `onOpenChange` to drive the panel from outside —
 * useful when you want a master toggle, when state lives in a query
 * string, or when several disclosures should sync together.
 */
export default function ControlledSample() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap="md">
      <Stack direction="row" gap="sm" align="center">
        <Button size="sm" onClick={() => setOpen((o) => !o)}>{open ? 'Collapse' : 'Expand'}</Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Close</Button>
        <Text size="sm" color="muted">state: {open ? 'open' : 'closed'}</Text>
      </Stack>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Stack gap="sm">
          <Collapsible.Trigger>
            {/* recipe-purity-ignore: the trigger resets to inline (all:unset); width:100% lets the row fill it so justify spreads — no Move width prop */}
            <Stack direction="row" gap="sm" align="center" justify="between" style={{ width: '100%' }}>
              <Text weight="medium">Controlled panel</Text>
              <Collapsible.Icon />
            </Stack>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <Text size="sm" color="muted">
              The trigger still toggles, and the buttons above drive the same state. They share one source of truth.
            </Text>
          </Collapsible.Content>
        </Stack>
      </Collapsible.Root>
    </Stack>
  );
}
