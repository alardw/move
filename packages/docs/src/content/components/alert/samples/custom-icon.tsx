import { Alert, Code, Stack } from 'move';

/**
 * `icon` accepts a Lucide icon name string for a custom glyph,
 * `true` for the variant default, or `false` to drop the icon
 * entirely — useful for terse inline messages where the variant
 * colour is enough.
 */
export default function CustomIconSample() {
  return (
    <Stack gap="md">
      <Alert variant="info" icon="rocket" title="New release">
        v2.4 ships keyboard shortcuts for everything in the command palette.
        Press <Code>?</Code> to see the full list.
      </Alert>
      <Alert variant="warning" icon="bell" title="Reminder">
        Your team’s 1:1 starts in 15 minutes. The agenda is still empty — drop
        in a topic before the meeting reads as "skip".
      </Alert>
      <Alert variant="success" icon={false}>
        Profile updated.
      </Alert>
    </Stack>
  );
}
