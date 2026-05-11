import { Heading, Stack, Text } from 'move';

export default function TruncateSample() {
  return (
    <Stack gap="md">
      <div style={{ maxWidth: '24rem', border: '1px dashed var(--move-border-base)', padding: 'var(--move-spacing-sm)', borderRadius: 'var(--move-rounded-md)' }}>
        <Heading level={3} truncate>
          The very long title of a project that nobody bothered to shorten before pasting it into the page header
        </Heading>
        <Text size="sm" color="muted">— with truncate, the full text becomes a tooltip on hover (browser-native).</Text>
      </div>
    </Stack>
  );
}
