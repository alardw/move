import { EmptyState, Stack } from 'move';

/**
 * Every slot is optional. Drop the action for a quiet "nothing here"
 * notice in a corner of the page; drop the icon for a tighter visual.
 */
export default function MinimalSample() {
  return (
    <Stack gap="lg">
      <EmptyState
        icon="cloud-off"
        title="You’re offline"
        description="We’ll sync any changes once you reconnect."
      />
      <EmptyState
        title="No favourites"
        description="Star a project to pin it here."
      />
    </Stack>
  );
}
