import { Stack, Text } from "move";

const PATH = "/Users/alard/projects/move/packages/move/src/index.ts";
const PARAGRAPH =
  "One seed derives every surface and keeps text legible in both modes. Muted body copy reads clearly while the accent carries interaction across the whole interface.";

export default function TruncateSample() {
  return (
    <Stack
      gap="lg"
      // purity-ignore: bounded width so truncation has something to ellipsize against
      style={{ maxWidth: 320 }}
    >
      <Stack gap="xs">
        <Text size="sm" weight="medium">
          truncate (end)
        </Text>
        <Text truncate>{PATH}</Text>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">
          truncate="start"
        </Text>
        <Text truncate="start">{PATH}</Text>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">
          truncate="middle"
        </Text>
        <Text truncate="middle">{PATH}</Text>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">
          truncate="clamp" lines={2}
        </Text>
        <Text truncate="clamp" lines={2}>
          {PARAGRAPH}
        </Text>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">
          truncate + tooltip — hover to reveal the full text
        </Text>
        <Text truncate tooltip>
          {PATH}
        </Text>
      </Stack>
    </Stack>
  );
}
