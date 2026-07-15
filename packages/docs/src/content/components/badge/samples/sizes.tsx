import { Badge, Stack, Text } from "move";

const sizes = ["sm", "md", "lg"] as const;

export default function SizesSample() {
  return (
    <Stack gap="md">
      {sizes.map((size) => (
        <Stack key={size} direction="row" gap="md" align="center">
          <Text size="sm" weight="medium">
            {size}
          </Text>
          <Stack direction="row" gap="sm" align="center" wrap>
            <Badge size={size} color="indigo">
              Primary
            </Badge>
            <Badge size={size} color="green" variant="soft">
              Active
            </Badge>
            <Badge size={size} color="yellow" variant="surface">
              Trial
            </Badge>
            <Badge size={size} color="red" variant="outline">
              Past due
            </Badge>
            <Badge size={size} color="blue" variant="dot">
              Beta
            </Badge>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
