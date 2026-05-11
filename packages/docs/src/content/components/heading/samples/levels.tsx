import { Heading, Stack } from 'move';

export default function LevelsSample() {
  return (
    <Stack gap="md">
      <Heading level={1}>Level 1 — page title</Heading>
      <Heading level={2}>Level 2 — major section</Heading>
      <Heading level={3}>Level 3 — sub-section</Heading>
      <Heading level={4}>Level 4 — sub-sub-section</Heading>
      <Heading level={5}>Level 5</Heading>
      <Heading level={6}>Level 6</Heading>
    </Stack>
  );
}
