import { Button, Popover, Stack, Text } from 'move';
import { StagedOverlay } from '../../../components';

/**
 * Card-only preview: the popover staged open and inert. Anchored overlays keep
 * their trigger — it's the anchor the content positions against.
 */
export default function PopoverPreview() {
  return (
    <StagedOverlay>
      {({ container, root, content }) => (
        <Popover.Root {...root}>
          <Popover.Trigger asChild>
            <Button variant="secondary">Show details</Button>
          </Popover.Trigger>
          <Popover.Content container={container} sideOffset={8} {...content}>
            <Stack gap="sm">
              <Text weight="medium">About this metric</Text>
              <Text size="sm" color="muted">
                Active sessions in the last 5 minutes.
              </Text>
            </Stack>
          </Popover.Content>
        </Popover.Root>
      )}
    </StagedOverlay>
  );
}
