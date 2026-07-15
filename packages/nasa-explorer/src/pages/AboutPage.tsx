import { Stack, Heading, Text, Code } from 'move';

export function AboutPage() {
  return (
    <Stack gap="lg" align="center">
      <Heading level={1}>About</Heading>
      <Text color="muted" size="lg">
        Built with <Code>move</Code> — a composable React component library.
      </Text>
    </Stack>
  );
}
