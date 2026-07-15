import { Badge, Stack, Text } from "move";

const palette = [
  "gray",
  "red",
  "pink",
  "grape",
  "violet",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "green",
  "lime",
  "yellow",
  "orange",
] as const;

/**
 * Every Open Color palette is available by name — useful for category
 * labels, project tags, and anything where the colour is just a colour.
 */
export default function PaletteSample() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" weight="medium">
          variant="soft"
        </Text>
        <Stack direction="row" gap="sm" align="center" wrap>
          {palette.map((c) => (
            <Badge key={c} variant="soft" color={c}>
              {c}
            </Badge>
          ))}
        </Stack>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">
          variant="dot"
        </Text>
        <Stack direction="row" gap="sm" align="center" wrap>
          {palette.map((c) => (
            <Badge key={c} variant="dot" color={c}>
              {c}
            </Badge>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
