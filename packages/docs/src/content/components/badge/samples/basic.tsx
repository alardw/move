import { Badge, Stack } from "move";

export default function BasicSample() {
  return (
    <Stack direction="row" gap="sm" align="center" wrap>
      <Badge>New</Badge>
      <Badge color="green">Active</Badge>
      <Badge color="yellow">Trial</Badge>
      <Badge color="red">Past due</Badge>
      <Badge color="blue">Beta</Badge>
    </Stack>
  );
}
