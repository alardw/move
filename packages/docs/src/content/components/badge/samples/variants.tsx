import { Badge, Stack, Text } from "move";

const variants = ["solid", "soft", "surface", "outline", "dot"] as const;
const descriptions: Record<(typeof variants)[number], string> = {
  solid:
    "High-contrast filled chip — for the loudest status the page is allowed to have.",
  soft: "Tinted background, no border — quieter, friendlier, the most common choice.",
  surface:
    "Tinted background plus a matching border — for badges that sit on busier surfaces.",
  outline: "Border only, transparent fill — pairs well with crowded layouts.",
  dot: "A coloured dot before the label — minimum visual weight, maximum readability.",
};

export default function VariantsSample() {
  return (
    <Stack gap="lg">
      {variants.map((v) => (
        <Stack key={v} gap="xs">
          <Stack direction="row" gap="sm" align="baseline">
            <Text size="sm" weight="medium">
              variant="{v}"
            </Text>
            <Text size="sm" color="muted">
              {descriptions[v]}
            </Text>
          </Stack>
          <Stack direction="row" gap="sm" align="center" wrap>
            <Badge variant={v}>Default</Badge>
            <Badge variant={v} color="green">
              Active
            </Badge>
            <Badge variant={v} color="yellow">
              Trial
            </Badge>
            <Badge variant={v} color="red">
              Past due
            </Badge>
            <Badge variant={v} color="blue">
              Beta
            </Badge>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
