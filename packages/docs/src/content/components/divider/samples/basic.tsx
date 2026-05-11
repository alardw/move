import { Divider, Stack, Text } from 'move';

export default function BasicSample() {
  return (
    <Stack gap="md">
      <Text>The line above this paragraph is a default Divider — horizontal, solid, sm.</Text>
      <Divider />
      <Text>And the line below ends the paragraph that follows it.</Text>
      <Divider />
      <Text size="sm" color="muted">
        Drop a Divider between any two content blocks for a clean visual break, with the right ARIA semantics for free.
      </Text>
    </Stack>
  );
}
